import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders default blog content', () => {
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'Url'
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText('Title', { exact: false })
  const authorElement = screen.getByText('Author', { exact: false })
  const urlElement = screen.queryByText('Url')
  const likeElement = screen.queryByText('0')

  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  expect(urlElement).toBeNull()
  expect(likeElement).toBeNull()
})

test('renders hidden blog content', async () => {
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

  const eventUser = userEvent.setup()
  const button = screen.getByText('View')
  await eventUser.click(button)

  const urlElement = screen.getByText('url: Url', { exact: false })
  const likesElement = screen.getByText('likes: 0', { exact: false })

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
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
  const viewButton = screen.getByText('View')
  await eventUser.click(viewButton)
  const likeButton = screen.getByText('Like')
  await eventUser.click(likeButton)
  await eventUser.click(likeButton)
  expect(likesMock.mock.calls).toHaveLength(2)
})
