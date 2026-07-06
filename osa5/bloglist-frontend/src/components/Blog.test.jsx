import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders only blog information if not logged in', () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'url.com',
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText('Title', { exact: false })
  const authorElement = screen.getByText('Author', { exact: false })
  const urlElement = screen.getByText('url.com')
  const likeElement = screen.queryByText('0')
  const likeButton = screen.queryByRole('button', { name: 'Like'})
  const removeButton = screen.queryByRole('button', { name: 'Remove'})

  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  expect(urlElement).toBeDefined()
  expect(likeElement).toBeDefined()
  expect(likeButton).toBeNull()
  expect(removeButton).toBeNull()
})

test('render only the like button if logged in user not the creator', async () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'Url',
    likes: 0,
    user: {
      name: 'User',
      username: 'user'
    }
  }
  const user = {
    name: 'Test User',
    username: 'testuser'
  }

  render(<Blog blog={blog} user={user}/>)

  const likeButton = screen.queryByRole('button', { name: 'Like' })
  const removeButton = screen.queryByRole('button', { name: 'Remove' })

  expect(likeButton).toBeDefined()
  expect(removeButton).toBeNull()
})

test('render remove button when logged in user is the creator', async () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'Url',
    likes: 0,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }
  const user = {
    name: 'Test User',
    username: 'testuser'
  }

  render(<Blog blog={blog} user={user}/>)

  const likeButton = screen.queryByRole('button', { name: 'Like' })
  const removeButton = screen.queryByRole('button', { name: 'Remove' })

  expect(likeButton).toBeDefined()
  expect(removeButton).toBeDefined()
})

test('event handler gets called twice when button is pressed', async () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'Url',
    likes: 0,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }
  const user = {
    name: 'Test User',
    username: 'testuser'
  }

  const likesMock = vi.fn()

  render(<Blog blog={blog} user={user} handleLike={likesMock}/> )

  const eventUser = userEvent.setup()
  const likeButton = screen.getByText('Like')
  await eventUser.click(likeButton)
  await eventUser.click(likeButton)
  expect(likesMock.mock.calls).toHaveLength(2)
})
