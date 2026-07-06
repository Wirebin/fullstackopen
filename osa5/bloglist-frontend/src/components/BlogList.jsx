import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Blog from './Blog'
import AddBlogForm from './AddBlogForm'
import LoginForm from './LoginForm'
import blogService from '../services/blogs'
import Togglable from './Toggleable'

const BlogList = ({ blogs, handleLike, user }) => {
  return (
    <div>
      <div>
        <h2>Blogs</h2>
        <ul>
          {blogs.sort((a, b) => b.likes - a.likes).map(blog => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BlogList
