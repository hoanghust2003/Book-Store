import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser, HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi";
import DarkModeSwitch from "./DarkModeSwitch";

import logo from "../assets/footer-logo.png";
import avatarImg from "../assets/avatar.png";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Orders", href: "/orders" },
    { name: "Cart Page", href: "/cart" },
    { name: "Check Out", href: "/checkout" },
  ];

  const navigation2 = [
    {name: "Mua Sách", href: "/books"}
  ]

  const handleLogOut = () => {
    logout();
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-md sticky top-0 z-50">
      <nav className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-20 h-20" />
          <div className="flex flex-col">
            <Link to="/">
              <h1 className="text-5xl font-bold">Book Store</h1>
            </Link>
            <p className="text-sm italic">"Nơi hội tụ tri thức và cảm hứng"</p>
          </div>
        </div>
        {/* Menu chính */}
        {/* <ul className="hidden md:flex space-x-8">
          {navigation2.map((item) => (
            <li key={item.name}>
              <Link to={item.href} className="hover:text-yellow-300 font-semibold">
                {item.name}
              </Link>
            </li>
          ))}
        </ul> */}

        {/* Thanh tìm kiếm */}
        <div className="relative flex-grow max-w-lg mx-4 rounded-lg border-2 border-yellow-400">
          <IoSearchOutline className="absolute left-3 top-2 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Phần bên phải */}
        <div className="flex items-center space-x-4">
          <DarkModeSwitch />

          {/* User Profile */}
          {currentUser ? (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img
                  src={currentUser?.avatar || avatarImg}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full ring-2 ring-blue-300"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md z-40">
                  <ul className="py-2">
                    {navigation.map((item) => (
                      <li key={item.name} onClick={() => setIsDropdownOpen(false)}>
                        <Link to={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogOut}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <HiOutlineUser className="text-white w-6 h-6" />
            </Link>
          )}

          {/* Wishlist */}
          <Link to="/wishlist">
            <HiOutlineHeart className="text-white w-6 h-6" />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center px-3 py-2 bg-blue-400 text-black rounded-md hover:bg-blue-300"
          >
            <HiOutlineShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
