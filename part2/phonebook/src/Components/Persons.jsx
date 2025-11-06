const Persons = (props) => {
    const personsToDisplay = props.search?
        props.persons.filter(x=>x.name.toLowerCase().includes(props.search.toLowerCase())):
        props.persons
    
    return personsToDisplay.map(person => (
        <div key={person.name}>
            {person.name} {person.number} <button onClick={()=>props.deletePerson(person.id)}>Delete</button>
        </div>))
}

export default Persons