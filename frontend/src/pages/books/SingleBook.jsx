import React, { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import ReviewSection from "./ReviewSection";
import RecommendSection from "./RecommendSection";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
const SingleBook = () => {
  const { id } = useParams();
  const {data: book,isLoading,isError} = useFetchAllBooksQuery(id);

  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };


  if (isLoading) return <div>Loading...</div>;
  if (isError || !book)
    return <div>Error happened while loading book info</div>;

  return (
    <div>
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
            <strong>Author:</strong> {book.author || "admin"}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Published:</strong>{" "}
            {new Date(book?.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-4 capitalize">
            <strong>Category:</strong> {book?.category}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Description:</strong> {book.description}
          </p>

          <button
            onClick={() => handleAddToCart(book)}
            className="btn-primary px-6 space-x-1 flex items-center gap-1 "
          >
            <FiShoppingCart className="" />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>
      <ReviewSection id={book?._id} reviews={reviews} />

    </div>
      
      <div>
        <RecommendSection category={book?.category} />
      </div>
    </div>

    
    
  );
};

export default SingleBook;
