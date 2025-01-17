import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getImgUrl } from "../../utils/getImgUrl";
import  {Link} from 'react-router-dom'
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
const BookCard = ({book}) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
  }

  const formatPrice = (price) => {
    if (isNaN(price)) return ""; // Trả về rỗng nếu không phải là số hợp lệ
    return Number(price).toLocaleString('vi-VN'); // Định dạng giá theo kiểu Việt Nam
  };

  const truncateDescription = (description, length) => {
    if (!description) return '';
    const cleanedDescription = description.replace(/(\r\n|\n|\r)/gm, ' ');
    return cleanedDescription.length > length ? `${cleanedDescription.slice(0, length)}...` : cleanedDescription;
};
  return (
    <div className=" rounded-lg transition-shadow duration-300 bg-white dark:bg-gray-800 text-black dark:text-white font-roboto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-4">
        <div className="sm:h-72 sm:flex-shrink-0 overflow-hidden border rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 border-gray-300 dark:border-gray-600">
          <Link to={`/books/${book._id}`}>
            <img
              src={`${getImgUrl(book?.coverImage)}`}
              alt=""
              className="w-40 h-60 object-cover"
            />
          </Link>
        </div>

        <div className="flex flex-col sm:w-2/3 justify-between p-4 h-full">
        <div>
          <Link to={`/books/${book._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 mb-3">
              {book?.title}
            </h3>
          </Link>
          <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: truncateDescription(book?.longDescription, 150),
          }}
          >
            {/* {book?.longDescription.length > 80 ? `${book?.longDescription
            .slice(0, 165)}...` : book?.longDescription
          } */}
          </p>
          <p className="font-medium mb-5">
            {formatPrice(book.newPrice)} VNĐ <span className="line-through font-normal ml-2">
                {formatPrice(book.oldPrice)} VNĐ
            </span>
          </p>
          <button 
          onClick={() => handleAddToCart(book)}
          className="bg-blue-600 text-white px-6 py-3 flex items-center gap-2 w-full lg:w-auto mt-4 rounded-lg border border-gray-300">
            <FiShoppingCart className="text-x1" />
            <span>Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BookCard;

