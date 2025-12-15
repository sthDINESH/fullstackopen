import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './Blog'
import { initializeBlogs, addBlog, likeBlog, deleteBlog } from '../reducers/blogsReducer'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { showSuccess, showError, clear } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

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

  const updateBlog = async (blog) => {
    try {
      await dispatch(likeBlog(blog))
    }
    catch (error) {
      dispatch(showError(`Error: ${error.message}`))
      setTimeout(() => dispatch(clear()), 5000)
    }
  }

  const removeBlog = async (blog) => {
    try {
      await dispatch(deleteBlog(blog.id))
    }
    catch (error) {
      dispatch(showError(`Error: ${error.message}`))
      setTimeout(() => dispatch(clear()), 5000)
    }
  }

  return (
    <div>
      <Togglable buttonLabel='create new blog' ref={blogFormVisibilityRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
      )}
    </div>
  )
}

export default BlogList