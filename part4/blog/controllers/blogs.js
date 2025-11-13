const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { error } = require('../utils/logger')

// API to get all blogs
blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => response.json(blogs))
})

// API to save a single blog
blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog.save()
  .then((result) => {
    response.status(201).json(result)
  })
  .catch(error => next(error))
})

module.exports = blogsRouter