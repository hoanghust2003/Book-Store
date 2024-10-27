const express = require('express');
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook } = require('./book.controller');

const router =  express.Router();

// post a book
router.post("/create-book", verifyAdminToken, postABook)

// get all books
router.get("/", getAllBooks);

// single book endpoint
router.get("/:id", getSingleBook);

module.exports = router;