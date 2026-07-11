import { useAnecdotes, useFilter, useAnecdoteActions, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter()
  const anecdoteActions = useAnecdoteActions()
  const { showMessage } = useNotificationActions()
  
  const vote = id => {
    anecdoteActions.vote(id)
    const anecdote = anecdotes.find(a => a.id === id)
    showMessage(`You created anecdote: ${anecdote.content}`)
  }

  const remove = id => {
    anecdoteActions.remove(id)
    const anecdote = anecdotes.find(a => a.id === id)
    showMessage(`You removed anecdote: ${anecdote.content}`)
  }

  return (
    <>
      {anecdotes
      .filter((anecdote) => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
      .map(anecdote => (
        <div style={{marginBottom: 10}} key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            {anecdote.votes <= 0 && (
              <button onClick={() => remove(anecdote.id)}>Remove</button>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
