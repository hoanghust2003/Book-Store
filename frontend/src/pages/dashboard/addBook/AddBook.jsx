import React, { useState } from 'react'
import InputField from './InputField'
import SelectField from './SelectField'
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';
import RichEditor from '../../../components/richeditor';
const AddBook = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [imageFile, setimageFile] = useState(null);
  const [addBook, { isLoading, isError }] = useAddBookMutation()
  const [imageFileName, setimageFileName] = useState('')
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const [content, setContent] = useState("")
  const onSubmit = async (data) => {

    const newBookData = {
      ...data,
      coverImage: imageFileName,
      ownerId: userId,
      longDescription: content
    }
    try {
      await addBook(newBookData).unwrap();
      Swal.fire({
        title: "Book added",
        text: "Your book is uploaded successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!"
      });
      reset();
      setimageFileName('')
      setimageFile(null);
    } catch (error) {
      console.error(error);
      alert("Failed to add book. Please try again.")
    }

  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimageFile(file);
      setimageFileName(file.name);
    }
  }
  return (
    <div className="max-w-lg   mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">TẠO SÁCH MỚI</h2>

      {/* Form starts here */}
      <form onSubmit={handleSubmit(onSubmit)} className=''>
        {/* Reusable Input Field for Title */}
        <InputField
          label="Tên Sách"
          name="title"
          placeholder="Nhập tên sách"
          register={register}
        />

        {/* Reusable Textarea for Description */}
        <InputField
          label="Mô tả"
          name="description"
          placeholder="Nhập mô tả sách"
          type="textarea"
          register={register}

        />

        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        <RichEditor value={content} name="longDescription" onChange={setContent} placeholder="Mô tả chi tiết về cuốn sách..." />

        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        {/* Reusable Select Field for Category */}
        <SelectField
          label="Thể Loại"
          name="category"
          options={[
            { value: '', label: 'Chọn Thể Loại' },
            { value: 'business', label: 'Business' },
            { value: 'technology', label: 'Technology' },
            { value: 'fiction', label: 'Fiction' },
            { value: 'horror', label: 'Horror' },
            { value: 'adventure', label: 'Adventure' },
            // Add more options as needed
          ]}
          register={register}
        />

        {/* Trending Checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register('trending')}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
          </label>
        </div>

        {/* Old Price */}
        <InputField
          label="Giá Gốc"
          name="oldPrice"
          type="number"
          placeholder="Giá Gốc"
          register={register}

        />

        {/* New Price */}
        <InputField
          label="Giá Mới"
          name="newPrice"
          type="number"
          placeholder="Giá Mới"
          register={register}

        />

        <InputField
          label="Tác giả"
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
          label="Nhà xuất bản"
          name="publisher"
          type="text"
          placeholder="NovelWorld"
          register={register}
        />

        <InputField
          label="Kích thước"
          name="size"
          type="text"
          placeholder="14 x 21 cm"
          register={register}
        />

        <InputField
          label="Trọng lượng"
          name="weight"
          type="text"
          placeholder="350g"
          register={register}
        />

        {/* Cover Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2 w-full" />
          {imageFileName && <p className="text-sm text-gray-500">Selected: {imageFileName}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-md">
          {
            isLoading ? <span className="">Adding.. </span> : <span>Add Book</span>
          }
        </button>
      </form>
    </div>
  )
}

export default AddBook