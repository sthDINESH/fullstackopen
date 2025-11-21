import { render, screen } from '@testing-library/react'
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

    // screen.debug()
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
})