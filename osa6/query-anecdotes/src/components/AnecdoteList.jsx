import { useAnecdotes } from '../hooks/useAnecdotes'
import { useNotify } from '../hooks/useNotify'

const AnecdoteList = () => {
  const { anecdotes, isPending, isError, voteAnecdote } = useAnecdotes()
  const { notify } = useNotify()

  const handleVote = (anecdote) => {
    voteAnecdote(anecdote)
    notify(`Anecdote ${anecdote.content} voted`)
  }

  if (isError) {
    return <div>Anecdote service not available due to problems in server</div>
  }
  
  if (isPending) {
    return <div>loading data...</div>
  }

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
