const jwt = require('jsonwebtoken');
const UserModel = require('../users/user.model');
const { sendErrorResponse } = require('../utils/helper');

const isAuth = async (req, res, next) => {
  const authToken = req.cookies.authToken;

  // send error response if no token
  if (!authToken) {
    return sendErrorResponse({
      message: "Unauthorized request",
      status: 401,
      res,
    });
  }

  try {
    // if the token is valid
    const payload = jwt.verify(authToken, process.env.JWT_SECRET);

    // if the token is valid find user from the payload
    // if the token is invalid it will throw error which we can handle
    // from inside the error middleware
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      return sendErrorResponse({
        message: "Unauthorized request user not found!",
        status: 401,
        res,
      });
    }

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    return sendErrorResponse({
      message: "Unauthorized request",
      status: 401,
      res,
    });
  }
};

const isPurchasedByTheUser = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      _id: req.user.id,
      books: req.body.bookId,
    });
    if (!user) {
      return sendErrorResponse({
        res,
        message: "Sorry we didn't found the book inside your library!",
        status: 403,
      });
    }
    next();
  } catch (error) {
    return sendErrorResponse({
      res,
      message: "An error occurred while checking the book in your library!",
      status: 500,
    });
  }
};

module.exports = { isAuth, isPurchasedByTheUser };