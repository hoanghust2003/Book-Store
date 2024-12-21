const express = require("express");
require("express-async-errors")
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')
const helmet = require('helmet');
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://book-app-frontend-tau.vercel.app','http://localhost:5174'],
    credentials: true
}))
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(helmet()); // Use helmet for security headers

// Set COOP and COEP headers
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

// routes
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");
const reviewRoutes = require("./src/review/review.route");
const authRouter = require("./src/auth/auth.route");

const errorHandler = require("./src/middleware/error");
const fileParser = require("./src/middleware/file");
app.use(errorHandler);

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/auth", authRouter);

app.use("/test", fileParser, (req, res) => {
  console.log(req.files);
  console.log(req.body);
  res.json({});
});

// 404 Route (route này sẽ bắt mọi yêu cầu không hợp lệ)
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Giữ route này ở cuối cùng
app.use("/", (req, res) => {
  res.json({ message: "Book Store Server is running!" });
});

async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.use("/", (req, res) => {
    res.send("Book Store Server is running!");
  });
}

main().then(() => console.log("Mongodb connect successfully!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});