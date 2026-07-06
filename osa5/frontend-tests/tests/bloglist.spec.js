const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlogWith, loginWith, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'First User',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testi Käyttäjä',
        username: 'tkayttaja',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await expect(page.getByRole('heading', { name: /Log in to application/ })).toBeVisible()
    await expect(page.getByPlaceholder(/Username/)).toBeVisible()
    await expect(page.getByPlaceholder(/Password/)).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Blogs')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'ei-salainen')
      await expect(page.getByText('Wrong credentials, try again.')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Blogs')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlogWith(page, 'Test Blog', 'tester', 'test.com')
      await expect(page.getByText('Test Blog')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlogWith(page, 'Test Blog', 'tester', 'test.com')
      await page.getByRole('link', { name: 'Test Blog' }).click()
      await expect(page.getByText('0 likes')).toBeVisible()
      await page.getByRole('button', { name: 'Like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlogWith(page, 'Test Blog', 'tester', 'test.com')
      await page.getByRole('link', { name: 'Test Blog' }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'Remove' }).click()
      await expect(page.getByText('Blog deleted succesfully.')).toBeVisible()
      await expect(page.locator('.blog')).toHaveCount(0)
    })

    test('only blog creator can delete a blog', async ({ page }) => {
      await createBlogWith(page, 'Test Blog', 'tester', 'test.com')

      // Change user
      await page.getByRole('button', { name: 'Logout' }).click()
      await loginWith(page, 'tkayttaja', 'salainen')
      await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()

      await page.getByRole('link', { name: 'Test Blog' }).click()
      await expect(page.getByText('Test Blog')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(0)
    })

    // test('blogs are sorted in order of most likes', async ({ page }) => {
    //   // Craete 3 blogs
    //   await createBlogWith(page, 'Test Blog', 'tester', 'test.com')
    //   await expect(page.getByText('Test Blog')).toBeVisible()
    //   await createBlogWith(page, 'Best Blog', 'person', 'bestblog.com')
    //   await expect(page.getByText('Best Blog')).toBeVisible()
    //   await createBlogWith(page, 'secret', '???', 'unknown.com')
    //   await expect(page.getByText('secret')).toBeVisible()

    //   await likeBlog(page, 1)
    //   await likeBlog(page, 2)
    //   await likeBlog(page, 1)
      
    //   // Check order
    //   let likedOrder = []
    //   for (let i = 0; i < 3; i++) {
    //     await page.getByRole('button', { name: 'View' }).nth(i).click()
    //     const text = await page.locator('text=likes:').innerText()
    //     likedOrder[0] = parseInt(text.replace('likes:', '').trim(), 10)
    //     await page.getByRole('button', { name: 'Hide' }).click()
    //   }

    //   const descOrder = (arr) => {
    //     return arr.every((val, i) => i === 0 || val <= arr[i - 1])
    //   }
    //   await expect(descOrder(likedOrder)).toBe(true)
    // })
  })
})