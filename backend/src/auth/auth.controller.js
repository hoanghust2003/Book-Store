const crypto = require("crypto")
const VerificationTokenModel = require("./verificationToken.model")
const UserModel = require("../users/user.model")
const nodemailer = require('nodemailer')
const mail = require("../utils/mail")
const {sendErrorResponse, formatUserProfile} = require("../utils/helper")
const jwt = require("jsonwebtoken")
const cloudinary = require("../cloud/cloudinary")
const updateAvatarToCloudinary = require("../utils/fileUpload")
const generateAuthLink = async (req, res) => {
    // generate authentication link and send that link to the users email address
    /* 
    1. generate unique token for every user
    2. store that token inside database to validate it
    3. create a link which include token and user info
    4. send that link to user email
    5. notify user to look inside email to get the login link
    **/
    const {email} = req.body
    let user = await UserModel.findOne({email})
    if (!user){
      //if no user found -> create new user
      user = await UserModel.create({email})
    }

    const userId = user._id

    //if we have token for this user, it will remove that first
    await VerificationTokenModel.findOneAndDelete({userId})

    const randomToken = crypto.randomBytes(36).toString("hex")

    await VerificationTokenModel.create({
      userId: user._id,
      token: randomToken,
    })

    const link = `${process.env.VERIFICATION_LINK}?token=${randomToken}&userId=${userId}`

    await mail.sendVerificationMail({
      link,
      to: user.email,
    });

    console.log(req.body);

  res.json({ message: 'Please check your email for auth link' });
  
}

const verifyAuthToken = async (req, res) => {
  const {token, userId} = req.query

  if(typeof token  !== 'string' || typeof userId !== 'string'){
    return sendErrorResponse({
      status: 403 ,//unauthorized access
      message: "Invalid request",
      res
    })
  }

  const verificationToken = await VerificationTokenModel.findOne({userId})
  if (!verificationToken || !verificationToken.compare(token)){
    return sendErrorResponse({
      status: 403 ,//unauthorized access
      message: "Invalid request, token mismatch.",
      res
    })
  }

  //if userId is in out database or not
  const user = await UserModel.findById(userId)
  if (!user){
    return sendErrorResponse({
      status: 500,
      message: "User not found.",
      res
    })
  }

  //invalidate token that we already verified
  await VerificationTokenModel.findByIdAndDelete(verificationToken._id)

  //authentication
  //when create token, have to create payload to store user info
  const payload = {userId: user._id}
  const authToken = jwt.sign(payload, process.env.JWT_SECRET,{
    expiresIn: '15d'
  })

  res.cookie('authToken',authToken,{
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(Date.now() + 15 * 24 * 60 *60 * 1000)
  })

  res.redirect(`${process.env.AUTH_SUCCESS_URL}?profile=${JSON.stringify(formatUserProfile(user))}`)

  // res.send()
}

const sendProfileInfo = (req,res) => {
  res.json({
    profile: req.user,
  })
}

const logout = (req,res) => {
  res.clearCookie('authToken').send()
}

const updateProfile = async (req,res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        signedUp: true,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return sendErrorResponse({
        res,
        message: "Something went wrong, user not found!",
        status: 500,
      });
    }

    // If there is any file, upload to cloud and update db
    const file = req.files?.avatar;
    // if (file && !Array.isArray(file)) {
    //   user.avatar = await updateAvatarToCloudinary(file, user.avatar?.id);
    //   await user.save();
    // }
    if (file) {
      if (Array.isArray(file)) {
        // Nếu `file` là mảng (nhiều tệp), chỉ lấy tệp đầu tiên
        return sendErrorResponse({
          res,
          message: "Please upload only one avatar.",
          status: 400,
        });
      }
      
      // Cập nhật avatar nếu có tệp
      user.avatar = await updateAvatarToCloudinary(file, user.avatar?.id);
      await user.save();
    }

    res.json({ profile: formatUserProfile(user) });
  } catch (error) {
    console.error("Error updating profile", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
}

const registerUser = async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    // check if email existing
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email exists!" });
    }

    // Assign a default username if not provided
    const uniqueUsername = username || `user_${Date.now()}`;

    // create new user
    const newUser = new UserModel({
      name,
      email,
      username: uniqueUsername,
      password,
      role: 'user',
    });

    // save new user to database
    await newUser.save();

    const userId = newUser._id;
    //delete old token if exist
    await VerificationTokenModel.findOneAndDelete({ userId });

    // create random token for auth
    const randomToken = crypto.randomBytes(36).toString("hex")

    //save token to database
    await VerificationTokenModel.create({
      userId: newUser._id,
      token: randomToken,
    })

    //create link for auth
    const verificationLink = `${process.env.VERIFICATION_LINK}?token=${randomToken}&userId=${userId}`

    //send email for auth
    await mail.sendVerificationMail({
      link: verificationLink,
      to: newUser.email,
    });

    console.log(req.body);

    res.status(201).json({ message: "Register Success!", user: newUser });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ message: "Register Fail!" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user || !user.comparePassword(password)) {
      return sendErrorResponse({
          res,
          message: "Invalid email or password",
          status: 401,
      });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15d'
  });
  res.json({ token, user: formatUserProfile(user) });
};

const getProfile = async (req, res) => {
  res.json({ profile: req.user });
};

module.exports = {
    generateAuthLink,
    verifyAuthToken,
    sendProfileInfo,
    logout,
    updateProfile,
    registerUser,
    loginUser
}