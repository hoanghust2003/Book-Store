import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import {
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineShoppingCart,
} from "react-icons/hi";
import DarkModeSwitch from "./DarkModeSwitch";
import { Menu, MenuItem, Button, Box } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import logo from "../assets/footer-logo.png";
import avatarImg from "../assets/avatar.png";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import getBaseUrl from "../utils/baseURL";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";

const DropdownMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const categories = [
    {
      title: "Sách",
      items: ["All Books", "Business", "Fiction", "Horror", "Adventure"],
    },
  ];

  return (
    <Box>
      <Button
        onClick={handleOpen}
        sx={{
          color: "white",
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        <MenuBookIcon sx={{ mr: 0.5 }} fontSize="large" />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          style: { maxHeight: 400, width: "300px" },
        }}
      >
        {categories.map((category) => (
          <div key={category.title}>
            <h3 style={{ padding: "8px 16px", fontWeight: "bold" }}>
              {category.title}
            </h3>
            {category.items.map((item) => (
              <MenuItem key={item} onClick={handleClose}>
                <Link
                  to={`/${
                    item === "All Books"
                      ? "books"
                      : item.toLowerCase().replace(/\s+/g, "-")
                  }`}
                >
                  {item}
                </Link>
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    </Box>
  );
};

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();

  const navigation = [
    { name: "Đơn Hàng", href: "/orders" },
    { name: "Giỏ Hàng", href: "/cart" },
    { name: "Thanh Toán", href: "/checkout" },
  ];

  // if (currentUser?.role === 'admin') {
  //   navigation.unshift({ name: "Dashboard", href: "/dashboard" });
  // }
  if (currentUser?.role === "admin") {
    navigation.unshift({
      name: "Approve Books",
      href: "/dashboard/approve-books",
    });
    navigation.unshift({ name: "Dashboard", href: "/dashboard" });
  }

  if (currentUser?.role === "customer") {
    navigation.unshift({
      name: "Manage Books",
      href: "/dashboard/manage-books",
    });
    navigation.unshift({ name: "Add Book", href: "/dashboard/add-new-book" });
  }

  const handleLogOut = async () => {
    try {
      await axios.post(
        `${getBaseUrl()}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("tokenType");
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to log out:", error);
    }
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
          {/* Dropdown Menu */}
          <DropdownMenu />
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
                {/* <img
                  src={currentUser?.avatar || avatarImg}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full ring-2 ring-blue-300"
                /> */}
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full ring-2 ring-blue-300"
                  />
                ) : (
                  <Avatar sx={{ bgcolor: deepOrange[500] }}>
                    {currentUser.name.charAt(0)}
                  </Avatar>
                )}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md z-40">
                  <ul className="py-2">
                    {navigation.map((item) => (
                      <li
                        key={item.name}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Link
                          to={item.href}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Tài Khoản
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
