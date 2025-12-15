import { ListGroup } from "react-bootstrap"

const UserBlogs = ({ user }) => {
  if(!user)
    return null

  return (
    <div className='py-4'>
      <h2>{user.name}</h2>
      <div className='pt-3'>
        <h3>added blogs</h3>
        <ListGroup variant='flush'>
          {user.blogs.map(blog => <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>)}
        </ListGroup>
      </div>
    </div>
  )
}

export default UserBlogs