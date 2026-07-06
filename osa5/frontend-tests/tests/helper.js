const { expect } = require('@playwright/test')

const createBlogWith = async (page, title, author, url) => {
    await page.goto('http://localhost:5173/create')

    await page.getByPlaceholder('Title').fill(title)
    await page.getByPlaceholder('Author').fill(author)
    await page.getByPlaceholder('Url').fill(url)
    await page.getByRole('button', { name: 'Create' }).click()
}

const loginWith = async (page, username, password) => {
    await page.goto('http://localhost:5173/login')

    await page.getByPlaceholder('Username').fill(username)
    await page.getByPlaceholder('Password').fill(password)
    await page.getByRole('button', { name: 'Login' }).click()
}

const likeBlog = async (page, iteration) => {
    await page.getByRole('button', { name: 'View' }).nth(iteration).click()
    await page.getByRole('button', { name: 'Like' }).click()
    await page.getByRole('button', { name: 'Hide' }).click()
}

export { createBlogWith, loginWith, likeBlog }