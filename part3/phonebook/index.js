require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', function (req, res){
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

// const generateId = () => {
//     let id = null
//     while (!id || persons.map(p => Number(p.id)).includes(id)){
//         id = Math.floor(Math.random() * 100000) 
//     }
//     return id
// }

// API to return all persons in phonebook
app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// API to return phonebook info with timestamp
app.get("/info", (request, response) => {
    response.send(`
        <div>
            Phonebook has info for ${persons.length} people.
            </br>
            ${new Date().toString()}
        </div>
    `)
})

// API to return a single person in phonebook
app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id)
        .then(person =>{
            if (person) {
                return response.json(person)
            } else {
                response.statusMessage = `Person not found with id:${id}`
                return response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error.message)
            response.status(400).send({ error: 'malformatted id' })
        })
})

// API to delete a single person in phonebook
app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            console.log(deletedPerson)
            response.status(204).end()
        })
        .catch(error => {
            console.log(error.message)
            response.status(400).send({ error: 'malformatted id' })
        })
})

// API to add a single person in phonebook
app.post("/api/persons", (request, response) => {
    const body = request.body
    if (!body.name || !body.number){
        return response.status(400).json({
            "error": "invalid data - missing name or number"
        })
    }
    // } else if(persons.map(p => p.name).includes(body.name)){
    //     return response.status(400).json({
    //         "error" : "must be unique"
    //     })
    // }

    const person = new Person(request.body)
    person.save().then(p => {
        return response.json(p)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on Port: ${PORT}`)
})