import React from "react";
import { getImgUrl } from "../../utils/getImgUrl";
import { Link } from "react-router-dom";

const CustomBookCard = ({ book }) => {
  const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice) return null;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  const discount = calculateDiscount(book?.oldPrice, book?.newPrice);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN'); // Định dạng giá theo kiểu Việt Nam
  };

  return (
    <div className="inline-block rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white font-roboto shadow-md overflow-hidden w-52">
      <div className="relative">
        <Link to={`/books/${book._id}`} className="block overflow-hidden">
          <img
            src={getImgUrl(book?.coverImage)}
            alt={book?.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
        {discount && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-sm font-semibold px-2 py-1 rounded">
            {discount}% 
          </div>
        )}
      </div>
      <div className="p-4">
        <Link to={`/books/${book._id}`} className="block">
          <h3 className="text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400">
            {book?.title}
          </h3>
        </Link>
        <div className="my-2">
          <span className="text-red-500 font-bold text-base">{formatPrice(book.newPrice)} đ</span>
          {formatPrice(book.oldPrice) && (
            <span className="line-through text-gray-500 text-sm ml-2">{formatPrice(book.oldPrice)} đ</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomBookCard;