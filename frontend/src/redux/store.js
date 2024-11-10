import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import booksApi from './features/books/booksApi'
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(booksApi.middleware)
}) 