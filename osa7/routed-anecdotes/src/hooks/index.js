import { useContext, useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'
import AnecdoteContext from '../AnecdoteContext'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    inputProps: {
      type,
      value,
      onChange
    },
    reset
  }
}

export const useAnecdotes = () => {
  const { anecdotes, setAnecdotes } = useContext(AnecdoteContext)

  useEffect(() => {
    anecdoteService.getAll()
      .then(data => 
        setAnecdotes(data))
  }, [setAnecdotes])

  const addAnecdote = (anecdote) => {
    anecdoteService.createNew(anecdote)
      .then(data => 
        setAnecdotes(anecdotes => 
          [...anecdotes, data]))
  }

  const deleteAnecdote = (id) => {
    anecdoteService.removeOne(id)
      .then(data => 
        setAnecdotes(anecdotes => 
          anecdotes.filter(anecdote => 
            anecdote.id !== data.id)))
  }

  return  {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}