const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })

  return response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const id = request.params.id

  try {
    const blog = await Blog.findById(id)
    if (blog) { return response.json(blog) }
    else { return response.status(404).end() }
  } 
  catch(err) {
    next(err)
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = await User.findById(request.user.id)

  if (!user) { return response.status(400).json({ error: 'userId missing or invalid' })}
  else if (!title || !url) { return response.status(400).json({ error: 'title or url missing' }) }

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user.id,
  })

  const newBlog = await blog.save()
  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()

  return response.status(201).json(newBlog)
})

// Update for likes
blogsRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id
  const data = request.body

  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).end()
    }

    Object.keys(data).forEach(key => {
      blog[key] = data[key]
    })
    await blog.save()
    return response.status(200).json({ message: 'update successful' }).end()
  }
  catch(err) {
    next(err)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const id = request.params.id

  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).end()
    }
    
    if ( blog.user.toString() === request.user.id.toString() ) {
      await Blog.deleteOne({ _id: id })
      return response.status(200).json({ message: 'deletion successful' }).end()
    } else {
      return response.status(403).json({ message: 'Wrong user token' }).end()
    }
  } 
  catch(err) {
    next(err)
  }
})

module.exports = blogsRouter
