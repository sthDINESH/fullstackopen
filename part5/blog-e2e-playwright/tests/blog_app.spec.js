const { describe, beforeEach, test, expect } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./test_helper')

const user = {
                username: "tester",
                password: "abcd1234" 
            }

const userWithNoBlogsCreated = {
    username: 'tester2',
    password: 'abcd12342'
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
            await request.post('/api/users', {
                data: {
                    name: userWithNoBlogsCreated.name,
                    username: userWithNoBlogsCreated.username,
                    password: userWithNoBlogsCreated.password
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

            test('a user can delete own blog', async ({page}) => {
                await page.getByRole('button', {name:'create new blog'}).click()
                await createBlog(page, newBlog)
                // // Wait for the success notification to disappear (it has 5 second timeout in App.jsx)
                // await expect(page.getByText(`a new blog ${newBlog.title} by ${newBlog.author} added`)).toBeVisible()
                // await expect(page.getByText(`a new blog ${newBlog.title} by ${newBlog.author} added`)).not.toBeVisible()

                await page.getByTestId('blog-summary').getByRole('button', {name: 'View'}).click()

                const deleteButton = await page.getByRole('button', {name:'Delete'})
                await expect(deleteButton).toBeVisible()

                // Set up dialog handler BEFORE clicking delete
                page.on('dialog', async dialog => {
                    expect(dialog.type()).toBe('confirm')
                    expect(dialog.message()).toContain('Remove blog')
                    await dialog.accept() // Click "OK"
                })

                await deleteButton.click()
                // Verify blog is deleted
                await expect(page.getByTestId('blog-summary')).toHaveCount(0)
                await expect(page.getByTestId('blog-details')).toHaveCount(0)
            })
        })

        describe('When logged in as user without blogs', () => {
            beforeEach(async ({page}) => {
                await loginWith(page, user.username, user.password)
                await page.getByRole('button', {name:'create new blog'}).click()
                await createBlog(page, newBlog)
                await expect(page.getByTestId('blog-summary')).toBeVisible()

                page.on('dialog', async dialog => {
                    await expect(dialog.type()).toBe('confirm')
                    await expect(dialog.message()).toMatch(/Are you sure/)
                    await dialog.accept()
                })
                await page.getByRole('button', {name: 'logout'}).click()

                await loginWith(page, userWithNoBlogsCreated.username, userWithNoBlogsCreated.password)
                await expect(page.getByText(`${userWithNoBlogsCreated.username} logged in`)).toBeVisible()
            })

            test('delete button for blog is not visible', async ({page}) => {
                await expect(page.getByTestId('blog-summary')).toBeVisible()
                await expect(page.getByTestId('blog-summary')).toContainText(`${newBlog.title} ${newBlog.author}`)
                await page.getByTestId('blog-summary').getByRole('button', {name: 'View'}).click()
                await expect(page.getByTestId('blog-details')).toContainText(`${newBlog.title} ${newBlog.author}`)
                await expect(page.getByRole('button', {name:'Delete'})).not.toBeVisible()
            })

            test('blogs are arranged with most likes first', async ({page}) => {
                const addBlog = {
                    title: 'add blog',
                    author: 'add author',
                    url: 'add-url.com', 
                }
                await page.getByRole('button', {name:'create new blog'}).click()
                await createBlog(page, addBlog)

                let blogs = page.getByTestId('blog-summary')
                await expect(blogs).toHaveCount(2)

                // First, click View to show the details for both blogs
                await page.getByTestId('blog-summary').filter({hasText: newBlog.title}).getByRole('button', {name: 'View'}).click()
                await page.getByTestId('blog-summary').filter({hasText: addBlog.title}).getByRole('button', {name: 'View'}).click()

                // Like newBlog once
                await likeBlog(page, newBlog)
                // Wait for the likes to update to 1
                const newBlogDetails = page.getByTestId('blog-details').filter({hasText: newBlog.title})
                await expect(newBlogDetails.getByText(/likes:/)).toContainText('likes: 1')
                
                // Like addBlog twice
                await likeBlog(page, addBlog)
                const addBlogDetails = page.getByTestId('blog-details').filter({hasText: addBlog.title})
                await expect(addBlogDetails.getByText(/likes:/)).toContainText('likes: 1')
                
                await likeBlog(page, addBlog)
                await expect(addBlogDetails.getByText(/likes:/)).toContainText('likes: 2')

                // Verify order - blog with most likes should be first
                const blogSummaries = await page.getByTestId('blog-summary').allTextContents()
                expect(blogSummaries[0]).toContain(addBlog.title)
                expect(blogSummaries[1]).toContain(newBlog.title)
            })
        })

    })

    
})