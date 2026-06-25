import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'
import { expect } from 'vitest'

test('<AddBlogForm /> correctly calls the prop with correct information', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<AddBlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const UrlInput = screen.getByLabelText('url:')
  const sendButton = screen.getByText('Create')

  await user.type(titleInput, 'Test Title')
  await user.type(authorInput, 'Test Author')
  await user.type(UrlInput, 'Test Url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('Test Url')
})
