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
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
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
    <div className="font-roboto bg-gray-50 py-10 max-w-screen-xl mx-auto">
      {/* Breadcrumb */}
      <div className="bg-white-50 py-2">
        <div className="font-roboto text-sm text-gray-600 mb-5">
          TRANG CHỦ &gt; SÁCH &gt; {book?.category.toUpperCase()} &gt;{" "}
          <span className="text-gray-600 mb-5">{book.title.toUpperCase()}</span>
        </div>
      </div>
      <div className="max-w-10xl mx-auto shadow-md p-5">
        {/* <h1 className="text-2xl font-bold mb-6">{book.title}</h1> */}

        <div className="flex flex-col md:flex-row md:items-center">
          <div>
            <img
              src={getImgUrl(book.coverImage)}
              alt={book.title}
              className="w-full h-auto mb-8 "
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

            {/* Pricing and Add to Cart Button */}
            <div className="flex items-center space-x-4">
              <div className="text-lg text-red-500 font-bold">
                {book.newPrice} VND
              </div>
              {
                <div className="text-sm text-gray-500 line-through">
                  {book.oldPrice} VND
                </div>
              }
            </div>
            <button
              onClick={() => handleAddToCart(book)}
              className="bg-blue-600 text-white px-6 py-3 flex items-center gap-2 w-full lg:w-auto mt-4"
            >
              <FiShoppingCart className="text-lg" />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>

        {/* Tabs for Details, Reviews, and Recommendations */}
        <div className="mt-10">
          <div className="border-b border-gray-200 mb-5">
            <ul className="flex space-x-10 justify-center">
              <li className="text-lg font-semibold text-primary border-b-2 border-primary pb-2">
                Chi tiết sản phẩm
              </li>
              <li className="text-lg font-semibold text-gray-500 pb-2">
                Đánh giá ({reviews.length})
              </li>
            </ul>
          </div>

          {/* Review Section */}
          <div className="space-y-6">
            <ReviewSection id={book?._id} title="Reviews" reviews={reviews} />
          </div>
        </div>
      </div>

      {/* Recommend Section */}
      <div className="mt-10">
        <RecommendSection category={book?.category} />
      </div>
    </div>
  );
};

export default SingleBook;
