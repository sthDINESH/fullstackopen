import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogAppUser')
    if (userJSON){
      setUser(JSON.parse(userJSON))
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    console.log("Logging in as", userName, password)

    try {
      const user = await loginService.login({username: userName, password: password})
      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      setUser(user)
      setUserName('')
      setPassword('')
    }
    catch(error) {
      console.log('Error', error.message)
    }
  }

  const handleLogout = (event) => {
    if(window.confirm('Are you sure you want to log out?')){
      window.localStorage.removeItem('blogAppUser')
      setUser(null)
    }
  }

  const login = () => {
    return (
      <form onSubmit={handleLogin}>
        <h1>log in to application</h1>
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

  return (
    <div>
      {!user && login()}
      {user && (
        <div>
          <h1>blogs</h1>
          <div>
          {user.username} logged in
          <button onClick={handleLogout}>Logout</button>
          </div>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App