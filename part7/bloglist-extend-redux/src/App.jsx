import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router'
import Notification from './components/Notification'
import { clearLoggedUser } from './reducers/userReducer'
import blogService from './services/blogs'
import BlogList from './components/BlogList'
import Users from './components/Users'
import Login from './components/Login'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const handleLogout = () => {
    if(window.confirm('Are you sure you want to log out?')){
      window.localStorage.removeItem('blogAppUser')
      blogService.setToken(null)
      dispatch(clearLoggedUser())
    }
  }

  return (
    <div>
      {!user && <Login />}
      {user && (
        <div>
          <h1>blogs</h1>
          <Notification />
          <div>
            {user.username} logged in
            <div>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path='/' element={<BlogList />} />
        <Route path='/users' element={<Users />} />
      </Routes>
    </div>
  )
}



export default App