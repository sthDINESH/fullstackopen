require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', function (req, res){
    return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

// API to return all persons in phonebook
app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// API to return phonebook info with timestamp
app.get("/info", (request, response) => {
    Person.find({})
        .then(persons => {
            response.send(`
                    <div>
                        Phonebook has info for ${persons.length} people.
                        </br>
                        ${new Date().toString()}
                    </div>
                `)
        })
    
})

// API to return a single person in phonebook
app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person =>{
            if (person) {
                return response.json(person)
            } else {
                response.statusMessage = `Person not found with id:${id}`
                return response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// API to delete a single person in phonebook
app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            console.log(deletedPerson)
            response.status(204).end()
        })
        .catch(error => next(error))
})

// API to add a single person in phonebook
app.post("/api/persons", (request, response) => {
    const body = request.body
    if (!body.name || !body.number){
        return response.status(400).json({
            "error": "invalid data - missing name or number"
        })
    }
    // save a new person
    const person = new Person(request.body)
    person.save()
        .then(savedPerson => {
            return response.json(savedPerson)
        })
})

// API to update a single person in phonebook
app.put("/api/persons/:id", (request, response, next) => {
    if(!request.body.number){
        return response.status(400).json({
            error: "missing number"
        })
    }

    Person.findById(request.params.id)
        .then(person => {
            person.number = request.body.number
            
            person.save()
                .then(updatedPerson => response.json(updatedPerson))
        })
        .catch(error => next(error)) 
})

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on Port: ${PORT}`)
})