import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<blog /> ', async () => {
  const blog = {
    'title': 'blog-title',
    'author': 'blog-author',
    'url': 'www.test-url.com',
    'likes': 1,
    'user': {
      'username': 'tester',
      'name': 'tester tester',
      'id': '691c978d107fa83055db9044'
    },
    'id': '691cca4f25c05618900f364a'
  }

  const updateBlog = vi.fn()
  const removeBlog = vi.fn()
  const loggedUser = 'tester'

  test('renders title and author, but not URL or likes by default', () => {
    render(
      <Blog
        blog={blog}
        updateBlog={updateBlog}
        removeBlog={removeBlog}
        user={loggedUser}
      />
    )

    // Check that summary is visible
    const summary = screen.getByTestId('blog-summary')
    expect(summary).toBeVisible()
    expect(summary).toHaveTextContent('blog-title blog-author')

    // Check that details are not visible
    const details = screen.getByTestId('blog-details')
    expect(details).not.toBeVisible()

    // Check that URL is in DOM but not visible
    const url = screen.getByText('www.test-url.com')
    expect(url).not.toBeVisible()

    // Check that likes is in DOM but not visible
    const likes = screen.getByText('likes: 1')
    expect(likes).not.toBeVisible()
  })

  test('shows URL and likes when the button controlling details is clicked', async () => {
    render(
      <Blog
        blog={blog}
        updateBlog={updateBlog}
        removeBlog={removeBlog}
        user={loggedUser}
      />
    )

    const view = screen.getByText('View')
    const user = userEvent.setup()
    await user.click(view)

    // Check that summary is not visible
    const summary = screen.getByTestId('blog-summary')
    expect(summary).not.toBeVisible()

    // Check that details are visible
    const details = screen.getByTestId('blog-details')
    expect(details).toBeVisible()

    // Check that URL is in DOM and visible
    const url = screen.getByText('www.test-url.com')
    expect(url).toBeVisible()

    // Check that likes is in DOM and visible
    const likes = screen.getByText('likes: 1')
    expect(likes).toBeVisible()
  })
})