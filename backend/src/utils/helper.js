const { Response } = require("express");

const sendErrorResponse = ({res,message,status}) => {
    res.status(status).json({message: message})
}

const formatUserProfile = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
}
module.exports = { sendErrorResponse, formatUserProfile };