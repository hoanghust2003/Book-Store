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

// Import MUI components
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const categories = ["Thể loại","Novel", "Business","Fiction","Horror","Adventure"]
const TopSellers = () => {
  
  const [selectedCategory,setSelectedCategory] = useState("Chọn thể loại");

  const { data: fetchedBooks = [] } = useFetchAllBooksQuery();

  const filteredBooks = selectedCategory === "Chọn thể loại" ? fetchedBooks : fetchedBooks.filter(book =>
    book.category === selectedCategory.toLowerCase() && book.trending == true
  )
  console.log(filteredBooks)

  return (
    <div className='py-10 max-w-screen-xl mx-auto' >
      <h2 className='text-3xl font-semibold mb-6'>SÁCH BÁN CHẠY</h2>
      {/* Material UI Select for category */}
      <Box sx={{  minWidth: 120, maxWidth: 150, marginBottom: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Thể loại</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Thể loại"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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