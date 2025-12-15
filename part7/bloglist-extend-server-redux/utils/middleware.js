const jwt = require('jsonwebtoken')
const logger = require('./logger')
const morgan = require('morgan')
const User = require('../models/user')

morgan.token('body', (request) => JSON.stringify(request.body))

const requestLogger = process.env.NODE_ENV === 'test'
  ? (request, response, next) => next()
  : morgan(':method :url :status :res[content-length] - :response-time ms :body')

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Handle errors
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

// Authorization Header token extractor
const tokenExtractor = (request, response, next) => {
  const authHeader = request.get('authorization')
  if (authHeader && authHeader.includes('Bearer ')){
    request.token = authHeader.replace('Bearer ','')
  }
  next()
}

// User extractor
const userExtractor = async (request, response, next) => {
  const decodedToken = await jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id){
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or invalid' })
  }
  request.user = user

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}