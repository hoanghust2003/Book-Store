import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL'

const baseQuery = fetchBaseQuery({
    baseUrl:`${getBaseUrl()}/api/books`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token = localStorage.getItem('token');
        if (token){
            Headers.set('Authorization', `Bearer ${token}`)
        }
        return Headers;
    }
})
const booksApi = createApi({
    reducerPath: "bookApi",
    baseQuery,
    tagTypes: ['Books'],
    endpoints: (builder) =>({
        fetchAllBooks: builder.query({
            query: () => "/",
            providesTags:["Books"]
        }),
        fetchBookById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (results, error, id) => [{type: "Books", id}],

        }),
        fetchPendingBooks: builder.query({
            query: () => "/pending",
            providesTags:["Books"]
        }),
        fetchBooksByCustomer: builder.query({
            query: (userId) => `/customer-books?userId=${userId}`,
            providesTags: ["Books"]
        }),
        addBook: builder.mutation({
            query: (newBook) => ({
                url: `/create-book`,
                method: "POST",
                body: newBook
            }),
            invalidatesTags: ["Books"]
        }),
        updateBook: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/edit/${id}`,
                method: "PUT",
                body: rest,
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags: ["Books"]
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Books"]
        }),
        approveBook: builder.mutation({
            query: (id) => ({
              url: `/approve-book/${id}`,
              method: 'PUT',
            }),
            invalidatesTags: ['Books'],
          }),
    })
    
})

export const {useFetchAllBooksQuery, fetchBookById, useAddBookMutation,
    useUpdateBookMutation,useDeleteBookMutation, useFetchBookByIdQuery,useApproveBookMutation, useFetchPendingBooksQuery,
    useFetchBooksByCustomerQuery
} = booksApi 
export default booksApi