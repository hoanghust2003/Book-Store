import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSearchBooksQuery } from '../redux/features/books/booksApi';
import BookCard from './books/BookCard';
import CustomBookCard from './books/CustomBookCard';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Box,
  Typography,
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import getBaseUrl from "../utils/baseURL";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const title = query.get('title');
  const category = query.get('category');
  const minPrice = query.get('minPrice');
  const maxPrice = query.get('maxPrice');
  const { data: books = [], isLoading, isError } = useSearchBooksQuery({ title, category, minPrice, maxPrice });
  const categories = ["Novel","Business", "Technology", "Fiction", "Horror", "Adventure"];
  const priceRanges = [
    { label: "0đ - 150.000đ", min: 0, max: 150000 },
    { label: "150.000đ - 300.000đ", min: 150000, max: 300000 },
    { label: "300.000đ - 500.000đ", min: 300000, max: 500000 },
    { label: "500.000đ - 700.000đ", min: 500000, max: 700000 },
    { label: "700.000đ - Trở Lên", min: 700000, max: Infinity },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [ownerNames, setOwnerNames] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchOwnerNames = async () => {
      const uniqueOwnerIds = [...new Set(books.map((book) => book.ownerId))];
      const ownerNamesData = {};
      for (const ownerId of uniqueOwnerIds) {
        try {
          const response = await axios.get(`${getBaseUrl()}/api/auth/${ownerId}`);
          ownerNamesData[ownerId] = response.data.name;
        } catch (error) {
          console.error(`Error fetching owner name for ID: ${ownerId}`, error);
        }
      }
      setOwnerNames(ownerNamesData);
    };

    if (books.length > 0) {
      fetchOwnerNames();
    }
  }, [books]);

  const handleCategoryChange = (event) => {
    const category = event.target.name.toLowerCase();
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
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

  const handleOwnerChange = (event) => {
    const ownerId = event.target.name;
    setSelectedOwners((prev) =>
      prev.includes(ownerId)
        ? prev.filter((id) => id !== ownerId)
        : [...prev, ownerId]
    );
  };

  const filteredBooks = books.filter((book) => {
    const inCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(book.category.toLowerCase());

    const inPriceRange =
      selectedPriceRanges.length === 0 ||
      priceRanges.some(
        (range) =>
          selectedPriceRanges.includes(range.label) &&
          book.newPrice >= range.min &&
          book.newPrice < range.max
      );

      const inOwner =
      selectedOwners.length === 0 || selectedOwners.includes(book.ownerId);  

    return inCategory && inPriceRange && inOwner;
  });

  const paginatedBooks = filteredBooks.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching books</div>;

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
                    checked={selectedCategories.includes(
                      category.toLowerCase()
                    )}
                    onChange={handleCategoryChange}
                    name={category.toLowerCase()}
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
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Nhà xuất bản
          </Typography>
          <FormControl component="fieldset">
            <FormGroup>
              {books &&
                books.length > 0 &&
                Array.from(
                  new Set(books.map((book) => book.ownerId).filter(Boolean))
                ).map((ownerId) => (
                  <FormControlLabel
                    key={ownerId}
                    control={
                      <Checkbox
                        checked={selectedOwners.includes(ownerId)}
                        onChange={handleOwnerChange}
                        name={ownerId}
                      />
                    }
                    label={ownerNames[ownerId] || `Unknown (ID: ${ownerId})`}
                  />
                ))}
            </FormGroup>
          </FormControl>
        </Box>
      </div>
      <div className="w-3/4">
        <h1 className="text-3xl font-bold mb-6">Kết quả tìm kiếm cho "{title}"</h1>
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
            {Array.from(
              { length: Math.ceil(filteredBooks.length / itemsPerPage) },
              (_, index) => (
                <Tab key={index} label={`Page ${index + 1}`} />
              )
            )}
          </Tabs>
        </Stack>
      </div>
    </div>
  );
};

export default SearchResults;