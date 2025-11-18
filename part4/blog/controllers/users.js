const bcrypt = require('bcrypt')
const usersRouter = require("express").Router()
const User = require("../models/user")

// API to create a new user
usersRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body

    // Username length handled by mongoose validation
    if (password.length < 3) {
        return response.status(400).json({
            error: `password validation failed: password(${password}, length ${password.length}) 
            is shorter than minimum allowed length(3)`
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await newUser.save()
    return response.status(201).json(savedUser)
})

// API to get all users
usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    return response.json(users)
})

module.exports = usersRouter
