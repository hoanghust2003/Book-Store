const mongoose =  require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description:  {
        type: String,
        required: true,
    },
    longDescription:  {
        type: String,
    },
    category:  {
        type: String,
        required: true,
    },
    trending: {
        type: Boolean,
        required: true,
    },
    averageRating: {
        type: Number
    },
    coverImage: {
        type: String,
        required: true,
    },
    oldPrice: {
        type: Number,
        required: true,
    },
    newPrice: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author : {
        type : String
    },
    sku : {
        type : String
    },
    publisher : {
        type : String
    },
    ownerId: {
        type: String,
    },
    size : {
        type : String
    },
    weight : {
        type : String
    },
    pages : {
        type : String
    },
    format : {
        type : String
    },
    approved : {
        type: Number,
        default: 0
    }
  }, {
    timestamps: true,
  });

  const Book = mongoose.model('Book', bookSchema);

  module.exports = Book;