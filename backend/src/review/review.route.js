const express = require('express');
const { addReview, getReview, getPublicReviews } = require('./review.controller');
const { isAuth, isPurchasedByTheUser } = require('../middleware/auth');

const reviewRouter = express.Router();

reviewRouter.post(
  '/',
  isAuth,
  isPurchasedByTheUser,
  addReview
);
reviewRouter.get('/:bookId', isAuth, getReview);
reviewRouter.get('/list/:bookId', getPublicReviews);

module.exports = reviewRouter;