console.log('Hello world')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// API to return all persons in phonebook
app.get("/api/persons", (request, response) => {
    response.json(persons)
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
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.statusMessage = `Person not found with id:${id}`
        response.status(404).end()
    }
})

// API to delete a single person in phonebook
app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    console.log(persons)
    response.status(204).end()
    
})

const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server running on Port: ${PORT}`)
})