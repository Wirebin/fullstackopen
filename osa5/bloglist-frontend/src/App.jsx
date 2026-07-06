import { useState, useEffect, useRef } from 'react'
import { StyleLink, NavBar, NavLeft, NavRight, LogoutButton } from './components/Styles'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import NotifService from './services/notification'

import './index.css'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import AddBlogForm from './components/AddBlogForm'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const { message, messageType, notify } = NotifService()
  const blogFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async blogObject => {
    try {
      const newBlog = await blogService.create(blogObject)

      const normalizedBlog = {
        ...newBlog,
        user: newBlog.user?.name
          ? newBlog.user
          : { id: newBlog.user, name: user.name, username: user.username }
      }
      setBlogs(blogs.concat(normalizedBlog))
      navigate('/')

      notify('New blog entry successfully created.', 'success', 5000)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout()
        notify('Your session has expired. Please log in again.', 'error', 5000)
      } else {
        notify('Title, author and url are needed for a blog entry.', 'error', 5000)
      }
    }
  }

  const deleteBlog = async id => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      navigate('/')
      notify('Blog deleted succesfully.', 'success', 5000)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout()
        notify('Your session has expired. Please log in again.', 'error', 5000)
      } else {
        notify('Failed to delete blog, try again.', 'error', 5000)
      }
    }
  }

  const handleLogin = async ({ username, password, setUsername, setPassword }) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      notify('Wrong credentials, try again.', 'error', 5000)
    }
  }

  const handleLogout = (event) => {
    if (event) { event.preventDefault() }
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const handleBlogLike = async (id) => {
    const blog = blogs.find(b => b.id === id)

    const updatedBackend = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }
    await blogService.update(blog.id, updatedBackend)

    const updatedFrontend = {
      ...updatedBackend,
      user: blog.user
    }
    setBlogs(blogs.map(b => b.id !== id ? b : updatedFrontend))
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  return(
    <div>
      <NavBar>
        <NavLeft>Blog App</NavLeft>

        <NavRight>
          <StyleLink to='/'>Blogs</StyleLink>
          {!user && (
            <StyleLink to='/login'>Login</StyleLink>
          )}
          {user && (
            <>
              <StyleLink to={'/create'}>Create</StyleLink>
              <LogoutButton onClick={(event) => handleLogout(event)}>Logout</LogoutButton>
            </>
          )}
        </NavRight>
      </NavBar>

      <Notification message={message} notifType={messageType} />

      <Routes>
        <Route path='/' element={
          <BlogList 
            blogs={blogs}
            handleLike={handleBlogLike}
            user={user} />
          }
        />
        <Route path='/login' element={
          <LoginForm
            handleLogin={handleLogin} />
          }
        />
        <Route path='/blogs/:id' element={
          <Blog
            blog={blog}
            user={user}
            handleLike={handleBlogLike}
            handleDelete={deleteBlog} />
          }
        />
        <Route path='/create' element={
          <AddBlogForm
            createBlog={addBlog} />
        }
        />
      </Routes>
    </div>
  )
}

export default App