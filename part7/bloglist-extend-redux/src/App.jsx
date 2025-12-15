import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useMatch, NavLink, useNavigate } from 'react-router'
import Notification from './components/Notification'
import { clearLoggedUser } from './reducers/userReducer'
import blogService from './services/blogs'
import BlogList from './components/BlogList'
import Users from './components/Users'
import Login from './components/Login'
import UserBlogs from './components/UserBlogs'
import BlogDetail from './components/BlogDetail'
import { likeBlog, deleteBlog, addComment } from './reducers/blogsReducer'
import { showError, clear } from './reducers/notificationReducer'
import { Container, Nav, Navbar, Button } from 'react-bootstrap'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)

  const navigate = useNavigate()

  const userIdBlogList = useMatch('/users/:id')?.params.id
  console.log('id', userIdBlogList)
  const userBlogList = users.find(user => user.id === userIdBlogList)
  console.log('user', userBlogList)

  const blogIdBlogDetail = useMatch('/blogs/:id')?.params.id
  const blogBlogDetail = blogs.find(blog => blog.id === blogIdBlogDetail) 

  const handleLogout = () => {
    if(window.confirm('Are you sure you want to log out?')){
      window.localStorage.removeItem('blogAppUser')
      blogService.setToken(null)
      dispatch(clearLoggedUser())
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
      navigate('/')
    }
    catch (error) {
      dispatch(showError(`Error: ${error.message}`))
      setTimeout(() => dispatch(clear()), 5000)
    }
  }

  const addBlogComment = async (id, comment) => {
    try {
      await dispatch(addComment(id, comment))
    }
    catch (error) {
      dispatch(showError(`Error: ${error.message}`))
      setTimeout(() => dispatch(clear()), 5000)
    }
  }

  const navStyle = {
    backgroundColor: 'grey',
    padding: 2,
  }

  const navLinkStyle = {
    paddingLeft:2,
    paddingRight:2,
  }

  return (
    <div>
      <Navbar>
        <Container>
          <Nav className='me-auto'>
            <Nav.Link as={NavLink} to='/' style={navLinkStyle}>blogs</Nav.Link>
            <Nav.Link as={NavLink} to='/users' style={navLinkStyle}>users</Nav.Link>
          </Nav>
          {
            user && <span>{user.username} logged in <Button onClick={handleLogout}>Logout</Button></span>
          }
        </Container>
      </Navbar>
      <div className='container'>
        {!user && <Login />}
        <h1>blogs</h1>
        <Notification />
        <Routes>
          <Route path='/' element={<BlogList />} />
          <Route path='/users' element={<Users />} />
          <Route path='/users/:id' element={<UserBlogs user={userBlogList} />} />
          <Route path='/blogs/:id' element={<BlogDetail blog={blogBlogDetail} updateBlog={updateBlog} removeBlog={removeBlog} user={user} addComment={addBlogComment} />} />
        </Routes>
      </div>
    </div>
  )
}



export default App