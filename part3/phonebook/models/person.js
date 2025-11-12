const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const db_uri = process.env.MONGODB_URI

console.log(`Connecting to MONGODB ${db_uri}`)
mongoose.connect(db_uri)
    .then(response => {
        console.log("Connected to MongoDB")
    })
    .catch(error => {
        console.log("Error connecting to MongoDB", error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
personSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema) 


