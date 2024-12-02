const express = require("express");
const {emailValidationSchema, validate, newUserSchema} = require("../middleware/validator")
const authRouter = express.Router();
const {isAuth} = require("../middleware/auth")
const fileParser = require("../middleware/file")
const {generateAuthLink, verifyAuthToken,sendProfileInfo, logout, updateProfile} = require("./auth.controller")
authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink
);

authRouter.get('/verify',verifyAuthToken)
authRouter.get('/profile',isAuth,sendProfileInfo)
authRouter.post('/logout',isAuth,logout)
authRouter.put('/profile',
  isAuth,
  fileParser,
  validate(newUserSchema),
  updateProfile)

module.exports = authRouter;