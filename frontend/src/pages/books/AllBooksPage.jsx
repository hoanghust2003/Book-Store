import React, { useState } from 'react';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import CustomBookCard from './CustomBookCard';
import { FormControl, FormControlLabel, FormGroup, Checkbox, Slider, Box, Typography, Stack, Pagination, Tabs, Tab } from '@mui/material';

const categories = ["Business", "Technology", "Fiction", "Horror", "Adventure"];
const priceRanges = [
  { label: '0đ - 150.000đ', min: 0, max: 150000 },
  { label: '150.000đ - 300.000đ', min: 150000, max: 300000 },
  { label: '300.000đ - 500.000đ', min: 300000, max: 500000 },
  { label: '500.000đ - 700.000đ', min: 500000, max: 700000 },
  { label: '700.000đ - Trở Lên', min: 700000, max: Infinity },
];
const AllBooksPage = () => {
  const { data: books = [], isLoading, isError } = useFetchAllBooksQuery();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;
  const handleCategoryChange = (event) => {
    const category = event.target.name;
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handlePriceRangeChange = (event) => {
    const rangeLabel = event.target.name;
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeLabel)
        ? prev.filter((label) => label !== rangeLabel)
        : [...prev, rangeLabel]
    );
  };

  const filteredBooks = books.filter((book) => {
    const inCategory =
      selectedCategories.length === 0 || selectedCategories.includes(book.category);

    const inPriceRange =
      selectedPriceRanges.length === 0 ||
      priceRanges.some(
        (range) =>
          selectedPriceRanges.includes(range.label) &&
          book.newPrice >= range.min &&
          book.newPrice < range.max
      );

    return inCategory && inPriceRange;
  });

  const paginatedBooks = filteredBooks.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading books</div>;

  return (
    <div className="py-10 max-w-screen-xl mx-auto flex">
      <div className="w-1/4 pr-4">
        <Typography variant="h6" gutterBottom>
          Thể Loại
        </Typography>
        <FormControl component="fieldset">
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={handleCategoryChange}
                    name={category}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
        </FormControl>
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Giá
          </Typography>
          <FormControl component="fieldset">
            <FormGroup>
              {priceRanges.map((range) => (
                <FormControlLabel
                  key={range.label}
                  control={
                    <Checkbox
                      checked={selectedPriceRanges.includes(range.label)}
                      onChange={handlePriceRangeChange}
                      name={range.label}
                    />
                  }
                  label={range.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
      </div>
      <div className="w-3/4">
        <h1 className="text-3xl font-bold mb-6">All Books</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-1">
          {paginatedBooks.map((book) => (
            <CustomBookCard key={book._id} book={book} />
          ))}
        </div>
        <Stack spacing={2} mt={4}>
        <Tabs
            value={currentPage}
            onChange={handlePageChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {Array.from({ length: Math.ceil(filteredBooks.length / itemsPerPage) }, (_, index) => (
              <Tab key={index + 1} label={`Page ${index + 1}`} />
            ))}
          </Tabs>
        </Stack>
      </div>
    </div>
  );
};

export default AllBooksPage;