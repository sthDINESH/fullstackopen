const blogsRouter = require('express').Router()
const { request } = require('express')
const Blog = require('../models/blog')
const { error } = require('../utils/logger')

// API to get all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    return response.json(blogs)
})

// API to save a single blog
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

// API to delete a single blog
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})

// API to update a blog post
blogsRouter.put('/:id', async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate){
    return response.status(404).end()
  }

  const { likes } = request.body
  blogToUpdate.likes = likes

  const updatedBlog = await blogToUpdate.save()
  return response.json(updatedBlog)

})

module.exports = blogsRouter