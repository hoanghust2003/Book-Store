import React from "react";
import BookCard from "./BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import the custom CSS file
import "../../App.css";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
const RecommendSection = ({ category }) => {
  const { data: books = [], isLoading, isError } = useFetchAllBooksQuery();

  if (!category) return null;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching books</div>;

  const filteredBooks = books.filter(book => book.category === category && book.trending === true)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">CỬA HÀNG GIỚI THIỆU</h2>
      <Swiper
        slidesPerView={2}
        spaceBetween={10}
        pagination={{ clickable: true }}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
        }}
        modules={[Pagination, Navigation]}
        className="custom-swiper-pagination" 
      >
        {filteredBooks.map(book => (
          <SwiperSlide key={book._id}>
            <BookCard book={book} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecommendSection;