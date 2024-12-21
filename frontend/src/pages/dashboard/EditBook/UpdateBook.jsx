import React, { useEffect, useState } from "react";
import InputField from "../addBook/InputField";
import SelectField from "../addBook/SelectField";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useFetchBookByIdQuery,
  useUpdateBookMutation,
} from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";
import RichEditor from "../../../components/richeditor";
const UpdateBook = () => {
  const { id } = useParams();
  const {
    data: bookData,
    isLoading,
    isError,
    refetch,
  } = useFetchBookByIdQuery(id);
  // console.log(bookData)
  const [updateBook] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, reset } = useForm();
  const [content, setContent] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  useEffect(() => {
    if (bookData) {
      setValue("title", bookData.title);
      setValue("description", bookData.description);
      setValue("category", bookData?.category);
      setValue("trending", bookData.trending);
      setValue("oldPrice", bookData.oldPrice);
      setValue("newPrice", bookData.newPrice);
      // setValue("coverImage", bookData.coverImage);
      setContent(bookData.longDescription);
      setValue("author", bookData.author);
      setValue("sku", bookData.sku);
      setValue("publisher", bookData.publisher);
      setValue("size", bookData.size);
      setValue("weight", bookData.weight);
      setImageFileName(bookData.coverImage);
    }
  }, [bookData, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);
    }
  };

  const onSubmit = async (data) => {
    const updateBookData = {
      title: data.title,
      description: data.description,
      category: data.category,
      trending: data.trending,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      coverImage: imageFileName,
      longDescription: content,
      author: data.author,
      sku: data.sku,
      publisher: data.publisher,
      size: data.size,
      weight: data.weight,
    };
    try {
      await axios.put(`${getBaseUrl()}/api/books/edit/${id}`, updateBookData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      Swal.fire({
        title: "Book Updated",
        text: "Your book is updated successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!",
      });
      await refetch();
    } catch (error) {
      console.log("Failed to update book.");
      alert("Failed to update book.");
    }
  };
  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching book data</div>;
  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />

        <SelectField
          label="Category"
          name="category"
          options={[
            { value: "", label: "Choose A Category" },
            { value: "novel", label: "Novel" },
            { value: "business", label: "Business" },
            { value: "technology", label: "Technology" },
            { value: "fiction", label: "Fiction" },
            { value: "horror", label: "Horror" },
            { value: "adventure", label: "Adventure" },
            { value: "comic", label: "Comic" },
          ]}
          register={register}
        />
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register("trending")}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">
              Trending
            </span>
          </label>
        </div>

        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
        />

        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
          register={register}
        />

        <RichEditor
          value={content}
          name="longDescription"
          onChange={setContent}
          placeholder="Mô tả chi tiết về cuốn sách..."
        />

        <InputField
          label="Author"
          name="author"
          type="text"
          placeholder="Jane Smith"
          register={register}
        />

        <InputField
          label="SKU"
          name="sku"
          type="text"
          placeholder="8934974206390"
          register={register}
        />

        <InputField
          label="Publisher"
          name="publisher"
          type="text"
          placeholder="NovelWorld"
          register={register}
        />

        <InputField
          label="Size"
          name="size"
          type="text"
          placeholder="14 x 21 cm"
          register={register}
        />

        <InputField
          label="Weight"
          name="weight"
          type="text"
          placeholder="350g"
          register={register}
        />

        {/* <InputField
          label="Cover Image URL"
          name="coverImage"
          type="text"
          placeholder="Cover Image URL"
          register={register}
        /> */}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2 w-full"
          />
          {imageFileName && (
            <p className="text-sm text-gray-500">Selected: {imageFileName}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
