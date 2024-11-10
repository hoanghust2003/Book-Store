import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import the custom CSS file
import "../../App.css";
const RecommendSection = ({ category }) => {
  const [fetching, setFetching] = useState(true);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!category) return;

    const fetchBooks = async () => {
      try {
        const response = await fetch("/books.json");
        const data = await response.json();
        const filteredBooks = data.filter(book => book.category === category);
        setBooks(filteredBooks);
        console.log("Filtered books:", filteredBooks); // Debugging line
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchBooks();
  }, [category]);

  if (!category) return null;

  if (fetching) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Books related to this category</h2>
      <Swiper
        slidesPerView={1}
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
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        modules={[Pagination, Navigation]}
        className="custom-swiper-pagination" 
      >
        {books.map(book => (
          <SwiperSlide key={book._id}>
            <BookCard book={book} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecommendSection;