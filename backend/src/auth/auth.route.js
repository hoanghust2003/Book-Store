const express = require("express");
const {emailValidationSchema, validate} = require("../middleware/validator")
const authRouter = express.Router();
const {isAuth} = require("../middleware/auth")

const {generateAuthLink, verifyAuthToken,sendProfileInfo, logout} = require("./auth.controller")
authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink
);

authRouter.get('/verify',verifyAuthToken)
authRouter.get('/profile',isAuth,sendProfileInfo)
authRouter.post('/logout',isAuth,logout)
module.exports = authRouter;