import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import AddBlogForm from './components/AddBlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import NotifService from './services/notification'
import './index.css'
import Togglable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const { message, messageType, notify } = NotifService()
  const blogFormRef = useRef()

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

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      notify('Wrong credentials, try again.', 'error', 5000)
    }
  }

  const handleLogout = (event) => {
    if (event) { event.preventDefault() }
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

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

  const handleBlogLike = async (id) => {
    const blog = blogs.find(b => b.id === id)

    const updatedObject = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }

    await blogService.update(blog.id, updatedObject)
  }

  const loginForm = () => {
    return (
      <div>
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  const blogForm = () => {
    return (
      <div>
        <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
          <AddBlogForm createBlog={addBlog}/>
        </Togglable>
      </div>
    )
  }

  return(
    <div>
      <Notification message={message} notifType={messageType} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={(event) => handleLogout(event)}>Logout</button>
          {blogForm()}
          <div>
            <h2>blogs</h2>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                handleLike={handleBlogLike}
                handleDelete={deleteBlog} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App