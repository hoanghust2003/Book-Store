const express = require('express');
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook, approveBook, getPendingBooks, getBooksByCustomer } = require('./book.controller');
const isAuth = require('../middleware/auth')
const router =  express.Router();

// post a book
router.post("/create-book", postABook)

// get all books
router.get("/", getAllBooks);

// get pending books
router.get("/pending", getPendingBooks);

router.get("/customer-books", getBooksByCustomer);

// single book endpoint
router.get("/:id", getSingleBook);

// update a book endpoint
router.put("/edit/:id", UpdateBook);

// delete a book endpoint
router.delete("/:id", deleteABook)

// approve a book (admin)
router.put("/approve-book/:id", approveBook);

// Tìm kiếm sách API
router.get('/search', async (req, res) => {
  try {
      const { title, category, trending, minPrice, maxPrice } = req.query;

      // Tạo điều kiện tìm kiếm động
      let searchConditions = {};

      if (title) {
          searchConditions.title = { $regex: title, $options: 'i' };  // Tìm kiếm không phân biệt hoa thường
      }

      if (category) {
          searchConditions.category = category;
      }

      if (trending !== undefined) {
          searchConditions.trending = trending === 'true';
      }

      if (minPrice || maxPrice) {
          searchConditions.oldPrice = {};
          if (minPrice) searchConditions.oldPrice.$gte = parseFloat(minPrice);
          if (maxPrice) searchConditions.oldPrice.$lte = parseFloat(maxPrice);
      }

      // Tìm sách theo các điều kiện
      const books = await Book.find(searchConditions);
      res.status(200).json(books);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving books' });
  }
});

module.exports = router;