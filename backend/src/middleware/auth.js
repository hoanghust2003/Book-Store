const jwt = require('jsonwebtoken');
const UserModel = require('../users/user.model');
const { sendErrorResponse, formatUserProfile } = require('../utils/helper');
const admin = require('firebase-admin');

const serviceAccount = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Thay \\n bằng \n
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const isAuth = async (req, res, next) => {
  const authToken = req.cookies.authToken || 
  (req.headers.authorization && req.headers.authorization.split(' ')[1]);;

  // send error response if no token
  if (!authToken) {
    console.log("No auth token found");
    return sendErrorResponse({
      message: "Unauthorized request",
      status: 401,
      res,
    });
  }

  /*
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

    req.user = formatUserProfile(user)

    next();
  } catch (error) {
    return sendErrorResponse({
      message: "Unauthorized request",
      status: 401,
      res,
    });
  }
};
  
  */

  try {
    // if the token is valid
    let payload;
    if (authToken.length > 500) {
        // Verify Firebase token
        payload = await admin.auth().verifyIdToken(authToken);
        console.log("Firebase token payload:", payload);

         // Check if user exists in Firebase
         const firebaseUser = await admin.auth().getUser(payload.uid);
         if (!firebaseUser) {
           return sendErrorResponse({
             message: "Unauthorized request user not found in Firebase!",
             status: 401,
             res,
           });
         }
 
         req.user = {
           uid: firebaseUser.uid,
           email: firebaseUser.email,
           name: firebaseUser.displayName,
           avatar: firebaseUser.photoURL,
         };
        
    } else {
        // Verify JWT token
        payload = jwt.verify(authToken, process.env.JWT_SECRET);
        console.log("JWT token payload:", payload);

        // Check user exists in MongoDB
        // if the token is valid find user from the payload
        // if the token is invalid it will throw error which we can handle
        // from inside the error middleware
        let user = await UserModel.findById(payload.userId);
        if (!user) {
          return sendErrorResponse({
            message: "Unauthorized request user not found!",
            status: 401,
            res,
          });
        }

        req.user = formatUserProfile(user);
    }

    next();
  } catch (error) {
    console.error("Error in isAuth middleware:", error);
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
        message: "Sorry you are not allowed to add review!",
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