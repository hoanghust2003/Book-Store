const BookModel = require('../books/book.model');
const ReviewModel = require('./review.model');
const { Types, isValidObjectId } = require('mongoose');

const addReview = async (req, res) => {
  const { bookId, rating, content } = req.body;
  // Kiểm tra content không rỗng hoặc chỉ có khoảng trắng
  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Content cannot be empty!" });
  }
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
  try {
    const reviews = await ReviewModel.find({ book: req.params.bookId }).populate('user', 'name avatar');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

module.exports = {
  addReview,
  getReview,
  getPublicReviews,
};