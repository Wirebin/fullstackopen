import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  const likeBlog = async () => {
    setLikes(prev => prev + 1)
    handleLike(blog.id)
  }

  const blogStyle = {
    border: 'solid',
    borderWidth: 1,
    padding: 4,
    margin: 6
  }

  return (
    <div style={blogStyle} className='blog'>
      {!visible && (
        <div>
          {blog.title} | {blog.author}
          <button style={{ marginLeft: 8 }} onClick={toggleVisible}>View</button>
        </div>
      )}
      {visible && (
        <div>
          {blog.title} | {blog.author}

          <button style={{ marginLeft: 8 }} onClick={toggleVisible}>Hide</button>
          <br />
          url: {blog.url} <br />

          likes: {likes}
          <button style={{ marginLeft: 8 }} onClick={likeBlog}>Like</button> <br />

          {blog.user.name}
          {blog.user.username === user.username && (
            <div>
              <button onClick={() => {
                if (window.confirm('Do you want to delete this blog?')) {
                  handleDelete(blog.id)
                }
              }}>Remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog