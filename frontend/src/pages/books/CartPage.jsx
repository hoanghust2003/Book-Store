import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getImgUrl } from '../../utils/getImgUrl'
import { removeFromCart, clearCart } from '../../redux/features/cart/cartSlice'

const CartPage = () => {
  const cartItems = useSelector(state => state.cart.cartItems)
  const dispatch = useDispatch()
  const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice, 0).toFixed(2);

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }
  return (
    <>
      <div className="flex mt-12 h-full flex-col overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between">
            <div className="text-lg font-medium text-gray-900 dark:text-gray-200">Giỏ hàng</div>
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

          <div className="mt-8">
            <div className="flow-root">
              {
                cartItems.length > 0 ? (
                  <ul role="list" className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                    {
                      cartItems.map((product) => (
                        <li key={product?._id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <img
                              alt=""
                              src={`${getImgUrl(product?.coverImage)}`}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex flex-wrap justify-between text-base font-medium text-gray-900 dark:text-gray-200">
                                <h3>
                                  <Link to='/'>{product?.title}</Link>
                                </h3>
                                <p className="sm:ml-4">${product?.newPrice}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize"><strong>Thể loại:</strong> {product?.category}</p>
                            </div>
                            <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                              <p className="text-gray-500 dark:text-gray-400"><strong>Sl:</strong> 1</p>

                              <div className="flex">
                                <button
                                  onClick={() => handleRemoveFromCart(product)}
                                  type="button" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                  Thể loại
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                ) : (<p className="text-gray-500 dark:text-gray-400">No product found!</p>)
              }
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-200">
            <p>Subtotal</p>
            <p>${totalPrice ? totalPrice : 0}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Shipping and taxes calculated at checkout.</p>
          <div className="mt-6">
            <Link
              to="/checkout"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              Checkout
            </Link>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
            <Link to="/">
              or
              <button
                type="button"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 ml-1"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default CartPage