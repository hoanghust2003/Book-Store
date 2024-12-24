import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  removeFromCart,
  clearCart,
  updateCartQuantity,
} from "../../redux/features/cart/cartSlice";
import {
  ButtonGroup,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);

  const [selectedItems, setSelectedItems] = useState(
    cartItems.map(() => false)
  );
  const [selectAll, setSelectAll] = useState(false);

  const formatPrice = (price) => {
    if (isNaN(price)) return ""; // Trả về rỗng nếu không phải là số hợp lệ
    return Number(price).toLocaleString('vi-VN'); // Định dạng giá theo kiểu Việt Nam
  };

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleQuantityChange = (product, quantity) => {
    dispatch(updateCartQuantity({ product, quantity }));
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    setSelectedItems(cartItems.map(() => checked));
  };

  const handleSelectItem = (index, checked) => {
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems[index] = checked;
    setSelectedItems(updatedSelectedItems);

    // Update Select All checkbox based on item selections
    setSelectAll(updatedSelectedItems.every((item) => item));
  };

  return (
    <>
      <div className="flex mt-12 h-full flex-col overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between">
            <div className="text-lg font-medium text-gray-900 dark:text-gray-200">
              Giỏ hàng
            </div>
            <div className="ml-3 flex h-7 items-center ">
              <button
                type="button"
                onClick={handleClearCart}
                className="relative -m-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200"
              >
                <span className="">Xóa giỏ hàng</span>
              </button>
            </div>
          </div>

          {/* Select All Checkbox */}
          <div className="flex items-center mt-4">
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              }
              label="Chọn tất cả"
            />
          </div>

          <div className="mt-4">
            <div className="flow-root">
              {cartItems.length > 0 ? (
                <ul
                  role="list"
                  className="-my-6 divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {cartItems.map((product, index) => (
                    <li
                      key={product?._id}
                      className="flex py-6 items-center justify-between"
                    >
                      {/* Checkbox */}
                      <div className="flex items-center mr-4">
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              checked={selectedItems[index]}
                              onChange={(e) =>
                                handleSelectItem(index, e.target.checked)
                              }
                            />
                          }
                          label=""
                          labelPlacement="start"
                        />
                      </div>

                      {/* Product Image and Info */}
                      <div className="flex items-center w-1/3">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                          <img
                            alt=""
                            src={`${getImgUrl(product?.coverImage)}`}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900 dark:text-gray-200">
                            <Link to="/">{product?.title}</Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
                            <strong>Thể loại:</strong> {product?.category}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex items-center w-1/3 justify-center">
                        <ButtonGroup
                          variant="outlined"
                          aria-label="outlined button group"
                          style={{ height: "36px" }}
                        >
                          <Button
                            onClick={() =>
                              handleQuantityChange(
                                product,
                                product.quantity - 1
                              )
                            }
                            disabled={product.quantity <= 1}
                            style={{ height: "36px" }}
                          >
                            -
                          </Button>
                          <TextField
                            id={`quantity-${product._id}`}
                            type="number"
                            inputProps={{
                              min: 1,
                              style: {
                                textAlign: "center",
                                height: "100%",
                                padding: 0,
                                margin: 0,
                              },
                            }}
                            InputProps={{
                              style: { height: "36px", padding: 0 },
                            }}
                            value={product.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                product,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-16 text-center"
                          />

                          <Button
                            onClick={() =>
                              handleQuantityChange(
                                product,
                                product.quantity + 1
                              )
                            }
                            style={{ height: "36px" }}
                          >
                            +
                          </Button>
                        </ButtonGroup>
                      </div>

                      {/* Price and Remove Button */}
                      <div className="flex items-center w-1/3 justify-end">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-200 sm:mr-4">
                          {formatPrice((product?.newPrice * product.quantity))} VNĐ
                        </p>
                        <button
                          onClick={() => handleRemoveFromCart(product)}
                          type="button"
                          className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Không có sản phẩm!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-200">
            <p>Tổng Số Tiền</p>
            <p>{formatPrice(totalPrice ? totalPrice : 0)} VNĐ</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            
          </p>
          <div className="mt-6">
            <Link
              to="/checkout"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              Thanh toán
            </Link>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
            <Link to="/">
              or
              <button
                type="button"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 ml-1"
              >
                Tiếp tục mua sắm
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
