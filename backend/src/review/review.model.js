const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User is required"]
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: [true, "Book is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must be at most 5"],
  },
  content: {
    type: String,
    trim: true,
    required: [true, "Content is required"],
  },
},
{ timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review