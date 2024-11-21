import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import booksApi from './features/books/booksApi'
import ordersApi from './features/orders/ordersApi'
import reviewsApi from './features/reviews/reviewsApi';
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(booksApi.middleware,ordersApi.middleware, reviewsApi.middleware)
}) 