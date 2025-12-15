const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)


describe('blog api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('returns the correct amount of blog posts in the JSON format', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    blogs.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('for a logged in user', async () => {
    let loginResponse = null
    beforeEach(async() => {
      const user = helper.initialUsers[0]

      loginResponse = await api.post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('post creates a new blog post', async () => {
      const newBlog = {
        title: 'test blog',
        author: 'validator 1',
        url: 'http://validator-1.html',
        likes: 0,
      }

      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type',/application\/json/)

      const savedBlogs = await helper.blogsInDB()
      assert.strictEqual(savedBlogs.length, helper.initialBlogs.length + 1)

      const savedBlogTitles = savedBlogs.map(b => b.title)
      assert(savedBlogTitles.includes(newBlog.title))
    })

    test('if the likes property is missing from the request, it will default to the value 0', async () => {
      const newBlog = {
        title: 'test blog',
        author: 'validator 1',
        url: 'http://validator-1.html',
      }
      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(201)
      const savedBlog = await Blog.findOne(newBlog)
      assert.strictEqual(savedBlog.likes, 0)
    })

    test('if title is missing in request, responds with the status code 400', async () => {
      const newBlog = {
        author: 'validator 1',
        url: 'http://validator-1.html',
      }
      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(400)

    })

    test('if url is missing in request, responds with the status code 400', async () => {
      const newBlog = {
        title: 'test blog',
        author: 'validator 1',
      }
      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newBlog)
        .expect(400)

    })

    test('a blog can be deleted', async () => {
      const blog = {
        title: 'test blog',
        author: 'validator 1',
        url: 'http://validator-1.html',
        likes: 0,
      }

      const response = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(blog)

      const blogToDelete = response.body

      await api.delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(204)

      const updatedBlogs = await helper.blogsInDB()
      const updatedBlogTitles = updatedBlogs.map(b => b.title)
      assert(!updatedBlogTitles.includes(blogToDelete.title))
    })
  })



  test('updating non existent blog returns 404', async () => {
    const nonExistingId = await helper.nonExistingId()

    await api.put(`/api/blogs/${nonExistingId}`)
      .expect(404)
  })

  test('likes for a blog can be updated', async () => {
    const blogs = await helper.blogsInDB()
    const blogToUpdate = blogs[0]

    const blogId = blogToUpdate.id
    const blogLikes = blogToUpdate.likes


    const response = await api.put(`/api/blogs/${blogId}`)
      .send({ likes: blogLikes + 1 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = response.body

    assert.strictEqual(updatedBlog.likes, blogLikes + 1)
  })

  describe('for missing token', async () => {
    test('post return 401 for new blog', async () => {
      const newBlog = {
        title: 'test blog',
        author: 'validator 1',
        url: 'http://validator-1.html',
        likes: 0,
      }

      const response = await api.post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type',/application\/json/)

      assert.strictEqual(response.body.error, 'token invalid')

      const savedBlogs = await helper.blogsInDB()
      assert.strictEqual(savedBlogs.length, helper.initialBlogs.length)
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})