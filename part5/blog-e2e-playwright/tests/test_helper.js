const loginWith = async ( page, username, password) => {
    await page.getByLabel('userName').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', {name: 'login'}).click()
}

const createBlog = async ( page, blog) => {
    await page.getByLabel('title').fill(blog.title)
    await page.getByLabel('author').fill(blog.author)
    await page.getByLabel('url').fill(blog.url)
    await page.getByRole('button', {name:'create'}).click()
}

const likeBlog = async (page, blog) => {
    // await page.getByTestId('blog-summary')
    //     .filter({hasText: blog.title})
    //     .getByRole('button', {name: 'View'})
    //     .click()
    
    await page.getByTestId('blog-details')
        .filter({hasText: blog.title})
        .getByRole('button', {name: 'likes'})
        .click()
}

export { loginWith, createBlog, likeBlog }