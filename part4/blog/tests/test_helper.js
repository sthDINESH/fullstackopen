const Blog = require('../models/blog')
const User = require('../models/user')

// Data to seed db
const initialUsers = [
  {
    'username': 'validator1',
    'name': 'validator number1',
    'password': 'abcdval01'
  },
  {
    'username': 'validator2',
    'name': 'validator number2',
    'password': 'abcdval02'
  },
]

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
]

// Helper functions
const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Dummy blog',
    author: 'dummy',
    url: 'http://dummy.html',
    likes: 0,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}



module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDB,
  usersInDB,
  nonExistingId,
}
