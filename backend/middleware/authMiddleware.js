const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../Models/userModel')
const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token,process.env.JWT_SECRET)
      // console.log('Dec Token:', decoded);
      req.user = await User.findById(decoded.id)
      
      if (!req.user) {
        res.status(401)
        throw new Error('No User Found')
      }

      next()
    } catch (error) {
      console.log(error)
      throw new Error('Not Authorized')

    }
  }

  if (!token) {
    res.status(401)
    throw new Error('NO token found')
  }
})

module.exports = { protect }