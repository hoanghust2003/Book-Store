import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/review`,
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
      invalidatesTags: ['Reviews'],
    }),
    getReviewsByBookId: builder.query({
      query: (bookId) => `/${bookId}`,
      providesTags: ['Reviews'],
    }),
    getPublicReviews: builder.query({
      query: (bookId) => `/list/${bookId}`,
      providesTags: ['Reviews'],
    }),
  }),
});

export const { useAddReviewMutation, useGetReviewsByBookIdQuery, useGetPublicReviewsQuery } = reviewsApi;
export default reviewsApi;