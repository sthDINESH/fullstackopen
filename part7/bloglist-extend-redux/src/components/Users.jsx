import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { initializeUsers } from '../reducers/usersReducer'

const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <td><strong>blogs created</strong></td>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
              <td>{u.blogs.length}</td>
            </tr>
          ))
          }
        </tbody>
      </table>
    </>
  )
}

export default Users

