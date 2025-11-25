const { describe, beforeEach, test, expect } = require('@playwright/test')
const { loginWith } = require('./test_helper')

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
        const user = {
                username: "tester",
                password: "abcd1234" 
            }
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
    })
})