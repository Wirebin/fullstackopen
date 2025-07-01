import { useState, useEffect } from 'react'
import AddPersonForm from './components/AddPersonForm'
import NameFilter from './components/NameFilter'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  const personObject = {
      name: newName,
      number: newNumber
    }

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = event => {
    event.preventDefault()

    if (persons
        .filter(person => person.name === newName)
        .length) {
          if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
            personService
              .update(persons.find(person => person.name === newName).id, personObject)
              .then(() => personService.getAll()
              .then(response => setPersons(response.data)))
              .catch(error => {
                setMessageType('error')
                setMessage(`Information of ${newName} has already been removed from server.`)
                setTimeout(() => {
                  setMessageType(null)
                  setMessage(null)
                }, 5000)
                return
              })
          }
      setMessageType('success')
      setMessage(`Person ${newName} has been successfully updated.`)
      setTimeout(() => {
        setMessageType(null)
        setMessage(null)
      }, 5000)
      return
    }

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
    setMessageType('success')
    setMessage(`Person ${newName} has been successfully added.`)
    setTimeout(() => {
      setMessageType(null)
      setMessage(null)
    }, 5000)
  }

  const deletePerson = person => {
    personService
      .erase(person)
      .then(() => personService.getAll()
      .then(response => setPersons(response.data)))
      .catch(error => {
        setMessageType('error')
        setMessage(`Information of ${newName} has already been removed from server.`)
        setTimeout(() => {
          setMessageType(null)
          setMessage(null)
        }, 5000)
        return
      })

    setMessageType('success')
    setMessage(`${person.name} has been succesfully deleted.`)
    setTimeout(() => {
      setMessageType(null)
      setMessage(null)
    }, 5000)
  }

  return (
    <div>
      <Notification message={message} notifType={messageType} />
      <h2>Phonebook</h2>
      <NameFilter filter={newFilter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <AddPersonForm 
        name={newName} 
        number={newNumber} 
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onClick={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} onDelete={deletePerson} />
    </div>
  )
}

export default App