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

    test('post creates a new blog post', async () => {
        const newBlog = {
            title: "test blog",
            author: "validator 1",
            url: "http://validator-1.html",
            likes: 0,
        }
        const response = await api.post('/api/blogs')
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
            title: "test blog",
            author: "validator 1",
            url: "http://validator-1.html",
        }
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
        const savedBlog = await Blog.findOne(newBlog)
        assert.strictEqual(savedBlog.likes, 0)
    })

    test('if title is missing in request, responds with the status code 400', async () => {
        const newBlog = {
            author: "validator 1",
            url: "http://validator-1.html",
        }
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

    })

    test('if url is missing in request, responds with the status code 400', async () => {
        const newBlog = {
            title: "test blog",
            author: "validator 1",
        }
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

    })

    test('a blog can be deleted', async () => {
        const blogs = await helper.blogsInDB()
        const blogToDelete = blogs[0]

        await api.delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const updatedBlogs = await helper.blogsInDB()
        const updatedBlogTitles = updatedBlogs.map(b => b.title)
        assert(!updatedBlogTitles.includes(blogToDelete.title))
    })

    
})

after(async () => {
    await mongoose.connection.close()
})