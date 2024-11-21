const express = require("express");
require("express-async-errors")
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')

const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://book-app-frontend-tau.vercel.app'],
    credentials: true
}))
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

// routes
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require("./src/orders/order.route")
const userRoutes =  require("./src/users/user.route")
const adminRoutes = require("./src/stats/admin.stats")
//const reviewRoutes = require("./src/review/review.route")
const authRouter = require("./src/auth/auth.route")

const errorHandler = require("./src/middleware/error")
app.use(errorHandler)

app.use("/api/books", bookRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/auth", userRoutes)
app.use("/api/admin", adminRoutes)
//app.use("/api/review",reviewRoutes)
app.use("/auth",authRouter)

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