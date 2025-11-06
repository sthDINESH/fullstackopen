import { useState, useEffect } from 'react'
import Filter from './Components/Filter'
import PersonForm from './Components/PersonForm'
import Persons from './Components/Persons'
import phonebookServices from './Services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  const handleNewName = (event) => setNewName(event.target.value)

  const handleNewNumber = (event) => setNewNumber(event.target.value)
  
  const handleSearch = (event) => setSearch(event.target.value)
  
  const handleAdd = (event) => {
    event.preventDefault()
    
    persons.map(x=>x.name).includes(newName)?
      alert(`${newName} is already added to phonebook`):(
        phonebookServices
          .create({name: newName, number: newNumber})
          .then(person => setPersons(persons.concat(person)))
          .catch(error => {
            alert(`Could not add ${newName}`)
            console.log("Error adding - ", newName, error)
          })
      )
  }
  
  const deletePerson = (id) => {
    if(window.confirm(`Delete ${persons.find(p => p.id === id).name}?`)){
      console.log("Delete", id)
      phonebookServices.erase(id)
        .then(person => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(e=>{
          alert(`${persons.find(p=>p.id===id).name} already deleted`)
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
      <h2>Phonebook</h2>
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
