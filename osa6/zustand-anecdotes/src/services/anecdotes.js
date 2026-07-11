const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  const data = await response.json()
  return data
}

const createNew = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }

  return await response.json()
}

const vote = async (id) => {
  const anecdoteUrl = `${baseUrl}/${id}`
  const response = await fetch(anecdoteUrl)
  const anecdote = await response.json()

  const updatedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1,
  }
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAnecdote)
  }

  const updateResponse = await fetch(anecdoteUrl, options)

  if (!updateResponse.ok || !response.ok) {
    throw new Error('Failed to vote anecdote')
  }

  return await updateResponse.json()
}

const remove = async (id) => {
  const anecdoteUrl = `${baseUrl}/${id}`

  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  }

  const response = await fetch(anecdoteUrl, options)

  if (!response.ok) {
    throw new Error('Failed to remove anecdote')
  }

  return await response.json()
}

export default { getAll, createNew, vote, remove }
