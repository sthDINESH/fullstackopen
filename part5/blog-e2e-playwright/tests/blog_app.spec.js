const { describe, beforeEach, test, expect } = require('@playwright/test')
const { loginWith } = require('./test_helper')

const user = {
                username: "tester",
                password: "abcd1234" 
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
                const titleLocator = page.getByLabel('title')
                const authorLocator = page.getByLabel('author')
                const urlLocator = page.getByLabel('url')
                const createLocator = page.getByRole('button', {name:'create'})

                await expect(titleLocator).toBeVisible()
                await expect(authorLocator).toBeVisible()
                await expect(urlLocator).toBeVisible()
                await expect(createLocator).toBeVisible()

                await titleLocator.fill('test blog')
                await authorLocator.fill('test author')
                await urlLocator.fill('test-url.com')
                await createLocator.click()

                await expect(page.getByText('a new blog test blog by test author added')).toBeVisible()
                await expect(page.getByTestId('blog-summary')).toBeVisible()
            })
        })
    })

    
})