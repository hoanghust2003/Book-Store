const Book = require("./book.model");
const mongoose = require('mongoose');
const postABook = async (req, res) => {
    try {
        const { ownerId, ...bookData } = req.body;
        if (!ownerId) {
            return res.status(400).send({message: "User ID is missing"});
        }
        const newBook = new Book({
            ...bookData,
            approved: 0, // Set approved to 0
            ownerId: ownerId
        });
        await newBook.save();
        res.status(200).send({message: "Book posted successfully", book: newBook});
    } catch (error) {
        console.error("Error creating book", error);
        res.status(500).send({message: "Failed to create book"})
    }
}

// get all books
const getAllBooks =  async (req, res) => {
    try {
        const books = await Book.find({ approved: 1 }).sort({ createdAt: -1});
        res.status(200).send(books)
        
    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({message: "Failed to fetch books"})
    }
}

const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra nếu id không phải ObjectId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid book ID" });
        }

        const book = await Book.findOne({ _id: id, approved: 1 });
        if (!book) {
            return res.status(404).send({ message: "Book not found!" });
        }

        res.status(200).send(book);
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).send({ message: "Failed to fetch book" });
    }
};

// update book data
const UpdateBook = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedBook =  await Book.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedBook) {
            res.status(404).send({message: "Book is not found!"})
        }
        res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook
        })
    } catch (error) {
        console.error("Error updating a book", error);
        res.status(500).send({message: "Failed to update a book"})
    }
}

const deleteABook = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedBook =  await Book.findByIdAndDelete(id);
        if(!deletedBook) {
            res.status(404).send({message: "Book is not found!"})
        }
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook
        })
    } catch (error) {
        console.error("Error deleting a book", error);
        res.status(500).send({message: "Failed to delete a book"})
    }
};

const approveBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send({ message: "Book not found!" });
        }

        book.approved = 1; // Set approved to 1
        await book.save();

        res.status(200).send({
            message: "Book approved successfully",
            book: book
        });
    } catch (error) {
        console.error("Error approving book", error);
        res.status(500).send({ message: "Failed to approve book" });
    }
};

const getPendingBooks = async (req, res) => {
    try {
        console.log("Đang lấy danh sách sách chờ duyệt...");
        const books = await Book.find({ 
            $or: [{ approved: 0 }, { approved: { $exists: false } }] 
        }).sort({ createdAt: -1 });

        console.log("Danh sách sách chờ duyệt:", books);
        res.status(200).send(books);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sách chờ duyệt:", error.message, error.stack);
        res.status(500).send({ message: "Failed to fetch book", error: error.message });
    }
};

const getBooksByCustomer = async (req, res) => {
    try {
        const userId = req.query.userId || req.body.userId; // Get userId from query or body
        console.log("Received userId from frontend:", userId); // Thêm dòng này để kiểm tra userId
        if (!userId) {
            return res.status(400).send({ message: "User ID not provided" });
        }

        // If userId is not a MongoDB ObjectId, skip this check or use a custom validation
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error("Invalid user ID format:", userId);
            return res.status(400).send({ message: "Invalid user ID format" });
        }

        console.log("Fetching books for user ID:", userId);
        const books = await Book.find({ ownerId: userId }).sort({ createdAt: -1 });
        res.status(200).send(books);
    } catch (error) {
        console.error("Error fetching books by customer", error);
        res.status(500).send({ message: "Failed to fetch books" });
    }
};

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteABook,
    approveBook,
    getPendingBooks,
    getBooksByCustomer
}