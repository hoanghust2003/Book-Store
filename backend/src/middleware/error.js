const JsonWebTokenError = require('jsonwebtoken')
const errorHandler = (error, req, res, next) => {
    if (error instanceof JsonWebTokenError){
        return res.status(401).json({ error: error.message })
    }
    res.status(500).json({ error: error.message })
}

module.exports = errorHandler