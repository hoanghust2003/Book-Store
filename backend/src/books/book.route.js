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



module.exports = router;