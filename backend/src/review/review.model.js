const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review