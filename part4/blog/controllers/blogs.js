const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// API to get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blogs)
})

// API to save a single blog
blogsRouter.post('/', async (request, response) => {
  const decodedToken = await jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id){
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if(!user) {
    return response.status(400).json({ error: ' UserId missing or invalid' })
  }

  const { title, author, url, likes } = request.body
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  response.status(201).json(result)
})

// API to delete a single blog
blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = await jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id){
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if(!blog) {
    return response.status(400).json({ error: 'BlogId missing or invalid' })
  }

  if (user._id.equals(blog.user._id)){
    await blog.deleteOne()

    user.blogs = user.blogs.filter(b => !b._id.equals(blog._id))
    await user.save()

    return response.status(204).end()
  } else {
    return response.status(403).json({ error:'UserId does not have permissions' })
  }
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