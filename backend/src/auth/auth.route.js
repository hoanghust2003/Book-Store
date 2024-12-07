const express = require("express");
const {emailValidationSchema, validate, newUserSchema,updateUserSchema} = require("../middleware/validator")
const authRouter = express.Router();
const {isAuth} = require("../middleware/auth")
const fileParser = require("../middleware/file")
const {generateAuthLink, verifyAuthToken,sendProfileInfo, logout, updateProfile, registerUser, loginUser} = require("./auth.controller")
authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink
);
authRouter.post(
  '/register',
  validate(newUserSchema),
  registerUser
);
authRouter.post('/login', loginUser);
authRouter.get('/verify',verifyAuthToken)
authRouter.get('/profile',isAuth,sendProfileInfo)
authRouter.post('/logout',isAuth,logout)
authRouter.put('/profile',
  isAuth,
  fileParser,
  validate(updateUserSchema),
  updateProfile)
  
module.exports = authRouter;