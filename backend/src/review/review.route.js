const express = require('express');
const { addReview, getReview, getPublicReviews } = require('./review.controller');
const { isAuth, isPurchasedByTheUser } = require('../middleware/auth');
const { validate, newReviewSchema } = require('../middleware/validator');

const reviewRouter = express.Router();

reviewRouter.post(
  '/',
  isAuth,
  validate(newReviewSchema),
  addReview
);
reviewRouter.get('/:bookId', isAuth, getReview);
reviewRouter.get('/list/:bookId', getPublicReviews);
module.exports = reviewRouter;