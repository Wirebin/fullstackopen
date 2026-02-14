const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { json } = require('node:stream/consumers')

const api = supertest(app)

describe('Incorrect information gets handled accordingly', () => {
  const newUser = {
    username: 'test',
    name: 'Test User',
    password: 'salainen',
  }

  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('Creating a new user fails if the username already exists', async () => {
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({
        error: 'expected `username` to be unique'
      })
  })

  test('Username or password being less than 3 characters long returns an error', async () => {
    await api
      .post('/api/users')
      .send({
        username: 'W',
        password: 'LongPassword'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({
        error: 'Username needs to be at least 3 characters long'
      })

    await api
      .post('/api/users')
      .send({
        username: 'LongUsername',
        password: 'L'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({
        error: 'Password needs to be at least 3 characters long'
      })
  })

  test('Missing needed information returns an error', async () => {
    await api
      .post('/api/users')
      .send({
        password: 'secret'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({
        error: 'Missing field: username or password'
      })

    await api
      .post('/api/users')
      .send({
        username: 'FunnyName'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({
        error: 'Missing field: username or password'
      })
  })
})

after(async () => {
  await mongoose.connection.close()
})