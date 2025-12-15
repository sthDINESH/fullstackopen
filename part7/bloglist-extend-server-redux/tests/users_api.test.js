const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('users api', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.createIndexes()

    const usersWithHash = await Promise.all(
      helper.initialUsers.map(async (u) => ({
        username: u.username,
        name: u.name,
        passwordHash: await bcrypt.hash(u.password, 10)
      }))
    )

    await User.insertMany(usersWithHash)
  })

  test('all users are returned', async () => {
    const users = await helper.usersInDB()
    assert.strictEqual(users.length, helper.initialUsers.length)
  })

  test('new users can be added', async () => {
    const user = {
      username: 'Tester',
      name: 'Tester',
      password: 'tester',
    }

    const response = await api.post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, user.username)
  })

  describe('invalid users are not created', () => {
    test('when username is not unique', async () => {
      const existingUser = helper.initialUsers[0]

      const response = await api.post('/api/users')
        .send(existingUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(response.body.error.includes('expected `username` to be unique'))

      const usersAtEnd = await helper.usersInDB()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('when length of username is less than 3', async () => {
      const user = {
        'username': 'v3',
        'name': 'validator number3',
        'password': 'abcdval03',
      }

      const response = await api.post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(response.body.error.includes('User validation failed'))

      const usersAtEnd = await helper.usersInDB()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('when length of password is less than 3', async () => {
      const user = {
        'username': 'validator3',
        'name': 'validator number3',
        'password': 'a3',
      }

      const response = await api.post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(response.body.error.includes('password validation failed'))

      const usersAtEnd = await helper.usersInDB()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})