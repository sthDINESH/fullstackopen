const { describe, beforeEach, test, expect } = require('@playwright/test')
const { loginWith, createBlog } = require('./test_helper')

const user = {
                username: "tester",
                password: "abcd1234" 
            }

const newBlog = {
    title: 'test blog',
    author: 'test author',
    url: 'test-url.com',
}

describe('Blog app', () => {
    beforeEach(async ({page}) => {
        await page.goto('/')
    })

    test('login form is shown', async ({page}) => {
        await expect(page.getByText('log in to application')).toBeVisible()
        await expect(page.getByLabel('userName')).toBeVisible()
        await expect(page.getByLabel('password')).toBeVisible()
        await expect(page.getByRole('button', {text: 'login'})).toBeVisible()
    })

    describe('login', () => {
        beforeEach(async ({page, request}) => {
            await request.post('/api/testing/reset')
            await request.post('/api/users', {
                data: {
                    name: user.name,
                    username: user.username,
                    password: user.password
                }
            })
            await page.goto('/')
        })

        test('succeeds with correct credentials', async ({page}) => {
            await loginWith(page, user.username, user.password)
            await expect(page.getByText(`${user.username} logged in`)).toBeVisible()

        })

        test('fails with invalid credentials', async ({page}) => {
            await loginWith(page, 'invalid_tester', user.password)
            await expect(page.getByText('Wrong username or password')).toBeVisible()
            
            await loginWith(page, user.username, 'invalid')
            await expect(page.getByText('Wrong username or password')).toBeVisible()
        })

        describe('When logged in', () => {
            beforeEach(async ({page}) => {
                await loginWith(page, user.username, user.password)
            })

            test('a new blog can be created', async ({page}) => {
                const createNewLocator = page.getByRole('button', {name: 'create new blog'})
                await expect(createNewLocator).toBeVisible()
                
                await createNewLocator.click()
                
                await expect(page.getByRole('heading', {name:'create new'})).toBeVisible()
                
                await expect(page.getByLabel('title')).toBeVisible()
                await expect(page.getByLabel('author')).toBeVisible()
                await expect(page.getByLabel('url')).toBeVisible()
                await expect(page.getByRole('button', {name:'create'})).toBeVisible()

                await createBlog(page, newBlog)

                await expect(page.getByText(`a new blog ${newBlog.title} by ${newBlog.author} added`)).toBeVisible()
                await expect(page.getByTestId('blog-summary')).toBeVisible()
                await expect(page.getByTestId('blog-summary')).toContainText(`${newBlog.title} ${newBlog.author}`)
            })

            test('a blog can be liked', async ({page}) => {
                await page.getByRole('button', {name:'create new blog'}).click()
                await createBlog(page, newBlog)

                await page.getByTestId('blog-summary').getByRole('button', {name: 'View'}).click()
                await expect(page.getByText('likes').locator('..')).toContainText('0')
                await page.getByRole('button', {name:'likes'}).click()
                await expect(page.getByText('likes').locator('..')).toContainText('1')
            })
        })

    })

    
})