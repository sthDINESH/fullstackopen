import { useEffect, useState } from 'react'
import userService from '../services/users'

const Users = () => {
  const [ users, setUsers ] = useState([])

  useEffect(() => {
    userService.getAll().then(response => setUsers(response))
  }, [])
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
              <td>{u.name}</td>
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

