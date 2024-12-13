import React, { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import ReviewSection from "./ReviewSection";
import RecommendSection from "./RecommendSection";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";
import { useGetPublicReviewsQuery } from "../../redux/features/reviews/reviewsApi";
const SingleBook = () => {
  const { id } = useParams();
  const {data: book,isLoading,isError} = useFetchBookByIdQuery(id);
  const { data: reviews = [], refetch } = useGetPublicReviewsQuery(id);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       const response = await fetch(`/api/reviews/${id}`);
  //       const data = await response.json();
  //       setReviews(data);
  //     } catch (error) {
  //       console.error("Error fetching reviews:", error);
  //     }
  //   };

  //   fetchReviews();
  // }, [id]);

  useEffect(() => {
    refetch(); // Refetch reviews 
  }, [refetch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };


  if (isLoading) return <div>Loading...</div>;
  if (isError || !book)
    return <div>Error happened while loading book info</div>;

  return (
    <div className = "font-roboto">
        <div className="max-w-10xl mx-auto shadow-md p-5">
      <h1 className="text-2xl font-bold mb-6">{book.title}</h1>

      <div className="flex flex-col md:flex-row md:items-center">
        <div>
          <img
            src={getImgUrl(book.coverImage)}
            alt={book.title}
            className="w-full h-auto mb-8"
          />
        </div>

        <div className="md:w-1/2 md:pl-8">
          <p className="text-gray-700 mb-2">
            <strong>Tác giả:</strong> {book.author || "admin"}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Ngày xuất bản:</strong>{" "}
            {new Date(book?.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-4 capitalize">
            <strong>Thể loại:</strong> {book?.category}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Tóm tắt nội dung:</strong> {book.description}
          </p>

          <button
            onClick={() => handleAddToCart(book)}
            className="btn-primary px-6 space-x-1 flex items-center gap-1 "
          >
            <FiShoppingCart className="" />
            <span>Thêm vào giỏ</span>
          </button>
        </div>

      </div>

      <ReviewSection id={book?._id} title="Reviews" reviews={reviews} />

    </div>
      
      <div>
        <RecommendSection category={book?.category} />
      </div>
    </div>

    
    
  );
};

export default SingleBook;
