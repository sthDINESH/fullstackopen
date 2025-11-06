import { useState, useEffect } from 'react'
import Filter from './Components/Filter'
import PersonForm from './Components/PersonForm'
import Persons from './Components/Persons'
import Notification from './Components/Notification'
import phonebookServices from './Services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)

  const handleNewName = (event) => setNewName(event.target.value)

  const handleNewNumber = (event) => setNewNumber(event.target.value)
  
  const handleSearch = (event) => setSearch(event.target.value)
  
  const handleAdd = (event) => {
    event.preventDefault()
    
    if(persons.map(x=>x.name).includes(newName)){
      if(window.confirm(`${newName} is already added to phonebook, replace old number with new one?`)){
        const person = persons.find(p=>p.name===newName)
        const updatedPerson = { ...person, number:newNumber}
        phonebookServices.update(updatedPerson.id, updatedPerson)
          .then(person=>{
            setPersons(persons.map(p=>p.id===person.id ? person:p))
            setMessage({
              content: `Updated ${person.name}`,
              tag: "success",
            })
            setTimeout(()=>setMessage(null), 5000)
          })
          .catch(error => {
            setMessage({
              content: `Information for ${newName} has already been removed from the server`,
              tag: "error",
            })
            setTimeout(()=>setMessage(null), 5000)
            setPersons(persons.filter(p=>p.name !== newName))
            console.log("Error:", error)
          })
      }
    } else {
      phonebookServices
        .create({name: newName, number: newNumber})
        .then(person => {
          setPersons(persons.concat(person))
          setMessage({
            content: `Added ${newName}`,
            tag: "success",
          })
          setTimeout(()=>setMessage(null), 5000)
        })
        .catch(error => {
          alert(`Could not add ${newName}`)
          console.log("Error", error)
        })
    }
    setNewName('')
    setNewNumber('')
  }
  
  const deletePerson = (id) => {
    if(window.confirm(`Delete ${persons.find(p => p.id === id).name}?`)){
      phonebookServices.erase(id)
        .then(person => {
          setPersons(persons.filter(p => p.id !== person.id))
          setMessage({
              content: `Deleted ${person.name}`,
              tag: "success",
            })
            setTimeout(()=>setMessage(null), 5000)
        })
        .catch(e=>{
          setMessage({
            content: `${persons.find(p=>p.id===id).name} already deleted`,
            tag: "error",
          })
          setTimeout(()=>setMessage(null), 5000)
          console.log("Error",e)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  useEffect(()=>{
    phonebookServices
      .getAll()
      .then(persons=>{
        setPersons(persons)
      })
  }, [])

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />
      <Filter search={search} handleSearch={handleSearch} />
      <h2>add a new</h2>
      <PersonForm 
        handleAdd={handleAdd} 
        newName={newName} 
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
