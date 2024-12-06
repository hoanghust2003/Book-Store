const BookModel = require('../books/book.model');
const ReviewModel = require('./review.model');
const { Types, isValidObjectId } = require('mongoose');

const addReview = async (req, res) => {
  const { bookId, rating, content } = req.body;

  try {
    await ReviewModel.findOneAndUpdate(
      { book : bookId, user: req.user.id },
      { content, rating },
      { upsert: true, new: true }
    );

    const [result] = await ReviewModel.aggregate([
      {
        $match: {
          book: new Types.ObjectId(bookId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    await BookModel.findByIdAndUpdate(bookId, {
      averageRating: result.averageRating,
    });

    res.status(200).json({
      message: "Review updated.",
    });
  } catch (error) {
    console.error("Error adding review", error);
    res.status(500).json({ message: "Failed to add review" });
  }
};

const getReview = async (req, res) => {
  const { bookId } = req.params;

  if (!isValidObjectId(bookId))
    return res.status(422).json({ message: "Book id is not valid!" });

  const review = await ReviewModel.findOne({ book: bookId, user: req.user.id });

  if (!review)
    return res.status(404).json({ message: "Review not found!" });

  res.json({
    content: review.content,
    rating: review.rating,
  });
};

const getPublicReviews = async (req, res) => {
  const reviews = await ReviewModel.find({ bookId: req.params.bookId }).populate({
    path: "user",
    select: "name avatar",
  });

  res.json({
    reviews: reviews.map((r) => {
      return {
        id: r._id,
        content: r.content,
        date: r.createdAt.toISOString().split("T")[0],
        rating: r.rating,
        user: {
          id: r.user._id,
          name: r.user.name,
          avatar: r.user.avatar,
        },
      };
    }),
  });
};

module.exports = {
  addReview,
  getReview,
  getPublicReviews,
};