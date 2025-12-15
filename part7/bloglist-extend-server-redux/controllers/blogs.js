const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')

// API to get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { body: 1 })
  return response.json(blogs)
})

// API to save a single blog
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
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
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user

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
  const blogToUpdate = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (!blogToUpdate){
    return response.status(404).end()
  }

  const { likes } = request.body
  blogToUpdate.likes = likes

  const updatedBlog = await blogToUpdate.save()
  return response.json(updatedBlog)

})

// API to add a comment to blog post
blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).end()
  }
  const { body } = request.body
  const comment = new Comment({
    body,
    blog: blog._id
  })
  const result = await comment.save()
  blog.comments = blog.comments.concat(comment._id)
  await blog.save()

  return response.status(201).json(result)

})

module.exports = blogsRouter