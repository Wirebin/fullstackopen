import { useState, useEffect, useInsertionEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, GrayText, LikeButton, RemoveButton } from './Styles'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    if (blog) {
      setLikes(blog.likes)
    }
  }, [blog])

  if (!blog) return

  const likeBlog = async () => {
    setLikes(prev => prev + 1)
    handleLike(blog.id)
  }

  const blogStyle = {
    padding: 4,
    margin: 4
  }

  const externalUrl = blog.url.startsWith('http')
    ? blog.url
    : `https://${blog.url}`

  return (
    <Card className='blog'>
      <h2 style={{margin: "0.5em 0"}}>
        {blog.title}
      </h2>

      <GrayText>by {blog.author}</GrayText>

      <a style={{display: "block", margin: "0.8em 0"}} href={externalUrl} target='_blank' rel='noopener noreferrer'>
        {blog.url}
      </a>

      <GrayText>Added by {blog.user.name}</GrayText>

      <div>
        <span style={{'font-size': '1.2em', 'margin-right': '0.4em'}}>{likes} likes</span>
        
        {user && (
          <>
            <LikeButton style={{ marginLeft: 8 }} onClick={likeBlog}>Like</LikeButton>

            {blog.user.username === user.username && (
              <RemoveButton onClick={() => {
                if (window.confirm('Do you want to delete this blog?')) {
                  handleDelete(blog.id)
                }
              }}>Remove</RemoveButton>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

export default Blog