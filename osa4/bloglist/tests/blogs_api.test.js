const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    "title": "JS 101",
    "author": "Me",
    "url": "example.com",
    "likes": 2
  },
  {
    "title": "Cool blog",
    "author": "Me",
    "url": "another-example.com",
    "likes": 5
  }
]

let token = ''
let userId = ''

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  
  const userResponse = await api
    .post('/api/users')
    .send({
      username: 'testuser',
      name: 'Test User',
      password: 'password123'
    })
  userId = userResponse.body.id

  await api
    .post('/api/users')
    .send({
      username: 'user',
      name: 'One Guy',
      password: 'salainen'
    })
  
  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'password123'
    })
  token = loginResponse.body.token
  
  let blogObject = new Blog({
    ...initialBlogs[0],
    user: userId
  })
  await blogObject.save()
  blogObject = new Blog({
    ...initialBlogs[1],
    user: userId
  })
  await blogObject.save()
})

describe('get requests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned in json format', async () => {
    const response = 
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 2)
  })

  test('a specific blog is within the returned notes', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body
    for (let i = 0; i < contents.length; i++) {
      assert.strictEqual(Object.keys(contents[i]).includes('id'), true)
    }
  })
})

describe('post requests', () => {
  test('able to post to /api/blogs', async () => {
    const prevResponse = await api.get('/api/blogs')
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        "title": "A new blog",
        "author": "Me",
        "url": "newblog.com",
        "likes": 0
      })
    const newResponse = await api.get('/api/blogs')
    assert.strictEqual(newResponse.body.length, prevResponse.body.length + 1)
  })

  test('default value for likes is zero', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        "title": "Test Blog",
        "author": "Dr. Seuss",
        "url": "testblog.net"
      })
    assert.strictEqual(response.body.likes, 0)
  })

  test('missing title or url causes bad request', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        "author": "Test",
        "likes": 2
      }).expect(400)
  })

  test('blog creation fails if there is a missing token', async () => {
    await api
      .post('/api/blogs')
      .send({
        "author": "Test",
        "likes": 2
      }).expect(401)
  })
})

describe('update requests', () => {
  const newData = {
      "title": "JS 102",
      "author": "You",
      "url": "example2.com",
      "likes": 200
    }

  test('update existing blog successfully', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body[0].id

    await api.put(`/api/blogs/${id}`).send(newData)
    const newResponse = await api.get(`/api/blogs/${id}`)
    assert.strictEqual(newResponse.body.likes, newData.likes)
    assert.strictEqual(newResponse.body.title, newData.title)
    assert.strictEqual(newResponse.body.url, newData.url)
    assert.strictEqual(newResponse.body.author, newData.author)
  })

  test('updating nonexistent blog fails', async () => {
    await api.put('/api/blogs/64f0c2b8c2f4c2a1b1234567').send(newData).expect(404)
  })
})

describe('deletion requests', () => {
  test('deleting existing blog successful', async () => {
    const before = await api.get('/api/blogs')
    const id = before.body[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    const after = await api.get('/api/blogs')

    assert.strictEqual(after.body.length, before.body.length - 1)
  })

  test('deleting nonexistent blog', async () => {
    await api
      .delete(`/api/blogs/64f0c2b8c2f4c2a1b1234567`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
})


after(async () => {
  await mongoose.connection.close()
})
