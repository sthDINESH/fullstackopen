import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  const createBlogFn = vi.fn()

  beforeEach(() => {
    render(
      <BlogForm createBlog={createBlogFn}/>
    )
  })

  test('calls the event handler with the right details when a new blog is created', async () => {
    const title = screen.getByLabelText('title')
    const author = screen.getByLabelText('author')
    const url = screen.getByLabelText('url')

    const user = userEvent.setup()
    await user.type(title, 'test-blog')
    await user.type(author,'test-author')
    await user.type(url, 'test-url')

    const create = screen.getByText('create')
    await user.click(create)

    expect(createBlogFn.mock.calls).toHaveLength(1)
    expect(createBlogFn.mock.calls[0][0].title).toBe('test-blog')
    expect(createBlogFn.mock.calls[0][0].author).toBe('test-author')
    expect(createBlogFn.mock.calls[0][0].url).toBe('test-url')
  })
})