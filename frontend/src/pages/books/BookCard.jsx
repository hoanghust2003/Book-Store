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
  return (
    <div className=" rounded-lg transition-shadow duration-300 bg-white dark:bg-gray-800 text-black dark:text-white font-roboto">
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-4">
        <div className="sm:h-72 sm:flex-shrink-0 border rounded-md">
          <Link to={`/books/${book._id}`}>
            <img
              src={`${getImgUrl(book?.coverImage)}`}
              alt=""
              className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>

        <div className="flex flex-col sm:w-2/3 justify-between p-4">
        <div>
          <Link to={`/books/${book._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 mb-3">
              {book?.title}
            </h3>
          </Link>
          <p className="text-gray-600 dark:text-gray-300 mb-5">{book?.description.length > 80 ? `${book.description
            .slice(0, 165)}...` : book?.description
          }</p>
          <p className="font-medium mb-5">
            {book?.newPrice} VNĐ <span className="line-through font-normal ml-2">
                {book?.oldPrice} VNĐ
            </span>
          </p>
          <button 
          onClick={() => handleAddToCart(book)}
          className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-lg rounded-lg ">
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

