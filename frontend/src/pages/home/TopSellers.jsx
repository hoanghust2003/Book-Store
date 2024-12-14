import React, { useEffect, useState } from 'react'
import BookCard from '../books/BookCard';
import {useFetchAllBooksQuery} from '../../redux/features/books/booksApi'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const categories = ["Choose a genre", "Business","Fiction","Horror","Adventure"]
const TopSellers = () => {
  
  const [selectedCategory,setSelectedCategory] = useState("Choose a genre");

  const { data: fetchedBooks = [] } = useFetchAllBooksQuery();

  const filteredBooks = selectedCategory === "Choose a genre" ? fetchedBooks : fetchedBooks.filter(book =>
    book.category === selectedCategory.toLowerCase()
  )

  return (
    <div className='py-10 bg-white dark:bg-gray-900 text-black dark:text-white max-w-screen-xl mx-auto' >
      <h2 className='text-3xl font-semibold mb-6'>SÁCH BÁN CHẠY</h2>
      {/*category */}
      <div className='mb-8 flex items-center'>
        <select 
        onChange={(e) => setSelectedCategory(e.target.value)}
        name="category" id="category" className='border
        border-gray-300 rounded-md px-4 py-2 focus:outline-none bg-white dark:bg-gray-900 text-black dark:text-white'>
          {
            categories.map((category,index) => (
              <option key={index} value={category}>{category}</option>
            ))
          }
        </select>
      </div>

      <Swiper
                slidesPerView={2}
                spaceBetween={30}
                navigation={true}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 40,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 50,
                    },
                    1180: {
                        slidesPerView: 2,
                        spaceBetween: 50,
                    }
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper"
            >

                {
                   filteredBooks.length > 0 && filteredBooks.map((book, index) => (
                        <SwiperSlide key={index}>
                            <BookCard  book={book} />
                        </SwiperSlide>
                    ))
                }



            </Swiper>


    </div>
  )
}

export default TopSellers