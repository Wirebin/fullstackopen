const _ = require('lodash')
const User = require('../models/user')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  return likes.reduce((accumulator, current) => {
    return accumulator + current
  }, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) { return null }
  
  const favourite = blogs.reduce((max, blog) => {
    return max.likes > blog.likes ? max : blog
  })
  return favourite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) { return null }

  const count = _.countBy((blogs), blog => blog.author)
  const most = [maxName, maxAmount] = _.maxBy(Object.entries(count), ([, value]) => value)
  return {'author': most[0], 'blogs': most[1]}
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) { return null }

  const likes = {}
  _.forEach((blogs), blog => {
    if (blog.author in likes) {
      likes[blog.author] += blog.likes
    } else {
      likes[blog.author] = blog.likes
    }
  })
  const most = [maxName, maxAmount] = _.maxBy(Object.entries(likes), ([, value]) => value)
  return {'author': most[0], 'likes': most[1]}
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy,
  
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,

  usersInDb,
}