import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Blog from './components/Blog'
import Notification from './components/Notification'
import { showSuccess, showError, clear } from './reducers/notificationReducer'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const dispatch = useDispatch()

  const [blogs, setBlogs] = useState([])
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormVisibilityRef = useRef(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes ))
    )
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogAppUser')
    if (userJSON){
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    console.log('Logging in as', userName, password)

    try {
      const user = await loginService.login({ username: userName, password: password })
      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUserName('')
      setPassword('')
    }
    catch(error) {
      console.log('Error', error.message)
      dispatch(showError('Wrong username or password'))
      // setMessage({ content: 'Wrong username or password', type: 'error' })
      setTimeout(() => dispatch(clear()), 5000)
    }
  }

  const handleLogout = () => {
    if(window.confirm('Are you sure you want to log out?')){
      window.localStorage.removeItem('blogAppUser')
      blogService.setToken(null)
      setUser(null)
    }
  }

  const createBlog = async (blogObject) => {
    try {
      const savedBlog = await blogService.create(blogObject)
      dispatch(showSuccess(`a new blog ${savedBlog.title} by ${savedBlog.author} added`))
      blogFormVisibilityRef.current.toggleVisibility()
      setTimeout(() => dispatch(clear()), 5000)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
    catch (error) {
      dispatch(showSuccess(`Error: ${error.message}`))
      setTimeout(() => dispatch(clear()), 5000)
    }
  }

  const updateBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, blog)
      setBlogs( blogs.map(b => b.id===updatedBlog.id? updatedBlog: b).toSorted((a,b) => b.likes-a.likes))
    }
    catch (error) {
      dispatch(showError(`Error: ${error.message}`))
      setTimeout(() => dispatch(clear()), 5000)
    }
  }

  const removeBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)
      setBlogs( blogs.filter(b => b.id!==blog.id).toSorted((a,b) => b.likes-a.likes))
    }
    catch (error) {
      dispatch(showError(`Error: ${error.message}`))
      setTimeout(() => dispatch(clear()), 5000)
    }

  }

  const login = () => {
    return (
      <form onSubmit={handleLogin}>
        <h1>log in to application</h1>
        <Notification />
        <div>
          <label>
            userName
            <input type='text' value={userName} onChange={({ target }) => setUserName(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            password
            <input type='password' value={password} onChange={({ target }) => setPassword(target.value)}></input>
          </label>
        </div>
        <div>
          <button type="submit">login</button>
        </div>
      </form>
    )
  }

  return (
    <div>
      {!user && login()}
      {user && (
        <div>
          <h1>blogs</h1>
          <Notification />
          <div>
            {user.username} logged in
            <button onClick={handleLogout}>Logout</button>
          </div>
          <Togglable buttonLabel='create new blog' ref={blogFormVisibilityRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
          )}
        </div>
      )}
    </div>
  )
}

export default App