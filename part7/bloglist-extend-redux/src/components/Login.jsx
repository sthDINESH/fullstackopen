import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Notification from './Notification'
import { showError, clear } from '../reducers/notificationReducer'
import { setLoggedUser } from '../reducers/userReducer'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { Form, Button } from 'react-bootstrap'


const Login = () => {
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async event => {
    event.preventDefault()
    console.log('Logging in as', userName, password)

    try {
      const user = await loginService.login({ username: userName, password: password })
      window.localStorage.setItem('blogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setLoggedUser(user))
      setUserName('')
      setPassword('')
    }
    catch(error) {
      console.log('Error', error.message)
      dispatch(showError('Wrong username or password'))
      setTimeout(() => dispatch(clear()), 5000)
    }
  }

  return (
    <Form onSubmit={handleLogin}>
      <h1>log in to application</h1>
      <Notification />
      <Form.Group>
        <Form.Label>
          userName
          <Form.Control type='text' value={userName} onChange={({ target }) => setUserName(target.value)}></Form.Control>
        </Form.Label>
      </Form.Group>
      <Form.Group>
        <Form.Label>
          password
          <Form.Control type='password' value={password} onChange={({ target }) => setPassword(target.value)}></Form.Control>
        </Form.Label>
      </Form.Group>
      <div>
        <Button type="submit" variant='primary'>login</Button>
      </div>
    </Form>
  )
}

export default Login