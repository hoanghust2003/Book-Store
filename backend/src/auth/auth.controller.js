const crypto = require("crypto")
const VerificationTokenModel = require("./verificationToken.model")
const UserModel = require("../users/user.model")
const nodemailer = require('nodemailer')
const mail = require("../utils/mail")
const {sendErrorResponse, formatUserProfile} = require("../utils/helper")
const jwt = require("jsonwebtoken")
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

  //res.redirect(`${process.env.AUTH_SUCCESS_URL}?profile=${JSON.stringify(formatUserProfile(user))}`)

  res.send()
}

const sendProfileInfo = (req,res) => {
  res.json({
    profile: req.user,
  })
}

const logout = (req,res) => {
  res.clearCookie('authToken').send()
}

module.exports = {
    generateAuthLink,
    verifyAuthToken,
    sendProfileInfo,
    logout
}