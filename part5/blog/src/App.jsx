import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlogTitle, setTitle] = useState('')
  const [newBlogAuthor, setAuthor] = useState('')
  const [newBlogUrl, setUrl] = useState('')
  const [message, setMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
    console.log("Logging in as", userName, password)

    try {
      const user = await loginService.login({username: userName, password: password})
      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUserName('')
      setPassword('')
    }
    catch(error) {
      console.log('Error', error.message)
      setMessage({content: `Wrong username or password`, type: 'error'})
      setTimeout(()=>setMessage(null), 5000)
    }
  }

  const handleLogout = (event) => {
    if(window.confirm('Are you sure you want to log out?')){
      window.localStorage.removeItem('blogAppUser')
      blogService.setToken(null)
      setUser(null)
    }
  }

  const handleCreateNew = async (event) => {
    event.preventDefault()
    try {
      const savedBlog = await blogService.create({
        title: newBlogTitle, 
        author: newBlogAuthor, 
        url: newBlogUrl,
      })
      setMessage({content: `a new blog ${savedBlog.title} by ${savedBlog.author} added`, type: 'success'})
      setTimeout(()=>setMessage(null), 5000)
      setTitle('')
      setAuthor('')
      setUrl('')
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
    catch (error) {
      setMessage({content: `Error: ${error.message}`, type: 'error'})
      setTimeout(()=>setMessage(null), 5000)
    }
  }

  const login = () => {
    return (
      <form onSubmit={handleLogin}>
        <h1>log in to application</h1>
        <Notification message={message} />
        <div>
          <label>
            userName
            <input type='text' value={userName} onChange={({target}) => setUserName(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            password
            <input type='password' value={password} onChange={({target}) => setPassword(target.value)}></input>
          </label>
        </div>
        <div>
          <button type="submit">login</button>
        </div>
      </form>
    )
  }

  const createBlog = () => {
    return (
      <form onSubmit={handleCreateNew}>
        <h2>create new</h2>
        <div>
          <label>
            title
            <input type='text' value={newBlogTitle} onChange={({target}) => setTitle(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            author
            <input type='text' value={newBlogAuthor} onChange={({target}) => setAuthor(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            url
            <input type='text' value={newBlogUrl} onChange={({target}) => setUrl(target.value)}></input>
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    )
  }

  return (
    <div>
      {!user && login()}
      {user && (
        <div>
          <h1>blogs</h1>
          <Notification message={message} />
          <div>
          {user.username} logged in
          <button onClick={handleLogout}>Logout</button>
          </div>
          {createBlog()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App