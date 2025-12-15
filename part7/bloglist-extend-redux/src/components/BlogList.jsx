import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router'
import Blog from './Blog'
import { initializeBlogs, addBlog } from '../reducers/blogsReducer'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { showSuccess, clear } from '../reducers/notificationReducer'
import blogService from '../services/blogs'
import { ListGroup } from 'react-bootstrap'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  const blogFormVisibilityRef = useRef(null)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    if (user){
      blogService.setToken(user.token)
    }
  }, [user])

  const createBlog = async (blogObject) => {
    try {
      await dispatch(addBlog(blogObject))
      dispatch(showSuccess(`a new blog ${blogObject.title} by ${blogObject.author} added`))
      blogFormVisibilityRef.current.toggleVisibility()
      setTimeout(() => dispatch(clear()), 5000)
    }
    catch (error) {
      dispatch(showSuccess(`Error: ${error.message}`))
      setTimeout(() => dispatch(clear()), 5000)
    }
  }

  return (
    <div>
      <Togglable buttonLabel='create new blog' ref={blogFormVisibilityRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <ListGroup>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </ListGroup>
    </div>
  )
}

export default BlogList