import { useState } from 'react'
import { Button, FormInput } from './Styles'

const AddBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <label>
          <FormInput 
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            placeholder='Title' />
        </label><br />

        <label>
          <FormInput
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
            placeholder='Author' />
        </label><br />

        <label>
          <FormInput
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            placeholder='Url' />
        </label><br />

        <Button type="submit">Create</Button>
      </form>
    </div>
  )
}

export default AddBlogForm
