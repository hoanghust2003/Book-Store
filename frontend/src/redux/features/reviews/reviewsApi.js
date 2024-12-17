import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/reviews`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery,
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: (newReview) => ({
        url: '/',
        method: 'POST',
        body: newReview,
      }),
      invalidatesTags: [{ type: 'Reviews', id: 'LIST' }], 
    }),
    getReviewsByBookId: builder.query({
      query: (bookId) => `/${bookId}`,
      providesTags: (result, error, bookId) => [{ type: 'Reviews', id: bookId }],
    }),
    getPublicReviews: builder.query({
      query: (bookId) => `/list/${bookId}`,
      // providesTags: ['Reviews'],
    }),
  }),
});

export const { useAddReviewMutation, useGetReviewsByBookIdQuery, useGetPublicReviewsQuery } = reviewsApi;
export default reviewsApi;