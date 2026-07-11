import { useAnecdoteActions, useNotificationActions } from '../store'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { showMessage } = useNotificationActions()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    await add(content)
    showMessage(`You voted ${content}`)
    event.target.reset()
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='anecdote' />
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
