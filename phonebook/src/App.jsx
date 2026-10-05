import { useEffect, useState } from 'react'
import server from './phone'
import Notification from './components/Notification'
import './index.css'


const Filter = (props) => {
  return <div>
    filter shown with: <input value={props.newQuery} onChange={props.handleSetQuery} />
  </div>
}

const PersonsForm = (props) => {
  return <form onSubmit={props.checkForRepeated} >
    <div>
      name: <input value={props.newName} onChange={props.handleSetName} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleSetNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
}


const Persons = (props) => {
  return <div>
    {props.filteredResults.map((person) => { return <p key={person.name}>{person.name} {person.number}<button onClick={() => props.deletePerson(person)}>Delete</button></p> })}
  </div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newQuery, setNewQuery] = useState('')
  const [message, setMessage] = useState(null)
  const filteredResults = newQuery == '' ? persons : persons.filter((person) => person.name.trim().toLowerCase().includes(newQuery.trim().toLowerCase()))


  useEffect(() => {
    const eventHandler = response => {
      setPersons(response.data)
    }
    server.getAll().then(eventHandler)
  }, [])

  function deletePerson(person) {
    if (window.confirm("Delete " + person.name + "?")) {
      server.remove(person.id).then(setPersons(persons.filter((p) => p.id !== person.id))).catch(() => {
        setMessage("ERROR: the information of " + person.name + " was already deleted.")
        setTimeout(() => {
          setMessage(null)
        }, 3000);
      }
      )
    }
  }

  function handleSetName(event) {
    setNewName(event.target.value)
  }

  function handleSetNumber(event) {
    setNewNumber(event.target.value)
  }

  function handleSetQuery(event) {
    setNewQuery(event.target.value)
  }

  function checkForRepeated(event) {
    event.preventDefault()
    const personDetails = { name: newName, number: newNumber };
    if (persons.some((person) => person.name == newName)) {
      if (window.confirm(`${newName} is already in the phonebook, update their number?`)) {
        server.update(persons.find((person) => person.name == newName).id, personDetails).then((response) => {
          setPersons(persons.map((person) => person.id == response.data.id ? response.data : person));
          setMessage("Updated " + personDetails.name)
          setTimeout(() => {
            setMessage(null)
          }, 3000);
        }).catch(() => {
          setMessage("ERROR: the information of " + personDetails.name + " was already deleted.")
          setTimeout(() => {
            setMessage(null)
          }, 3000);
        }
        )
      }
    }
    else {
      server.add(personDetails).then((response) => {
        setPersons([...persons, response.data]);
        setMessage("Added " + personDetails.name)
        setTimeout(() => {
          setMessage(null)
        }, 3000);;
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />
      <Filter newQuery={newQuery} handleSetQuery={handleSetQuery}></Filter>

      <h2>Add a new</h2>

      <PersonsForm checkForRepeated={checkForRepeated} handleSetName={handleSetName} handleSetNumber={handleSetNumber} newName={newName} newNumber={newNumber}></PersonsForm>

      <h2>Numbers</h2>

      <Persons filteredResults={filteredResults} deletePerson={deletePerson}></Persons>
    </div>
  )
}

export default App