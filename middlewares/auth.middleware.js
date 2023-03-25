const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const { StatusCodes } = require('http-status-codes')

module.exports.isAuthenticated = (req, res, next) => {
  const authorization = req.header('Authorization')

  if(!authorization) {
    return next(createError(StatusCodes.UNAUTHORIZED, 'not authorized'))
  }

  const [schema, token] = authorization.split(' ')

  if(schema !== 'Bearer') {
    return next(createError(StatusCodes.UNAUTHORIZED, 'not authorized'))
  }

  if(!token) {
    return next(createError(StatusCodes.UNAUTHORIZED, 'not authorized'))
  }

  const secret = process.env.JWT_SECRET || 'test'
  jwt.verify(token, secret, (err, decodedToken) => {
    if(err) {
      return next(err)
    }
    req.currentUserId = decodedToken.id
    next()
  })
}