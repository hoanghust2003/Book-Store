import { createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'
const initialState = {
    cartItems: []
}
const cartSlice = createSlice({
    name: 'cart',
    initialState : initialState,
    reducers: {
        addToCart: (state,action) => {
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);
            if(!existingItem){
                state.cartItems.push({...action.payload, quantity: 1})
                Swal.fire({
                    positon: "top-end",
                    icon: "success",
                    title: "Đã được thêm vào giỏ hàng",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    title: "Book already in cart",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Ok!"
                  })
            }
        },
        removeFromCart: (state,action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id)
        },
        clearCart: (state) => {
            state.cartItems = []
        },
        updateCartQuantity: (state, action) => {
            const { product, quantity } = action.payload;
            const item = state.cartItems.find(item => item._id === product._id);
            if (item) {
              item.quantity = quantity;
            }
          },
    }
})

//export actions
export const {addToCart, removeFromCart, clearCart, updateCartQuantity} = cartSlice.actions
export default cartSlice.reducer