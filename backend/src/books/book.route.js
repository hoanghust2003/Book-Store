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

router.get('/search', async (req, res) => {
    try {
      const { title, category, trending, minPrice, maxPrice } = req.query;
  
      let searchConditions = {};
  
      // Title search with multiple word support and diacritic handling
      if (title) {
        searchConditions.$or = [
          { title: { $regex: title.replace(/\s+/g, '.*'), $options: 'i' }},
        //   { description: { $regex: title.replace(/\s+/g, '.*'), $options: 'i' }}
        ];
      }
  
      if (category) {
        searchConditions.category = { $regex: category, $options: 'i' };
      }
  
      if (trending !== undefined) {
        searchConditions.trending = trending === 'true';
      }
  
      // Price range search using newPrice instead of oldPrice
      if (minPrice || maxPrice) {
        searchConditions.newPrice = {};
        if (minPrice) searchConditions.newPrice.$gte = parseFloat(minPrice);
        if (maxPrice) searchConditions.newPrice.$lte = parseFloat(maxPrice);
      }
  
      // Add approved condition
      searchConditions.approved = 1;
  
      const books = await Book.find(searchConditions);
      
      if (books.length === 0) {
        return res.status(200).json([]);
      }
  
      res.status(200).json(books);
    } catch (err) {
      console.error('Search error:', err);
      res.status(500).json({ message: 'Error searching books' });
    }
  });

// single book endpoint
router.get("/:id", getSingleBook);

// update a book endpoint
router.put("/edit/:id", UpdateBook);

// delete a book endpoint
router.delete("/:id", deleteABook)

// approve a book (admin)
router.put("/approve-book/:id", approveBook);



module.exports = router;