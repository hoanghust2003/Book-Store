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
                state.cartItems.push(action.payload)
                Swal.fire({
                    positon: "top-end",
                    icon: "success",
                    title: "Your book has been added to the cart",
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
        }
    }
})

//export actions
export const {addToCart} = cartSlice.actions
export default cartSlice.reducer