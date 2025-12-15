import { Link } from 'react-router'
import { ListGroup } from 'react-bootstrap'

const Blog = ({ blog }) => {
  return (
    <ListGroup.Item as={Link} to={`/blogs/${blog.id}`}>
      {blog.title} {blog.author}
    </ListGroup.Item>
  )
}

export default Blog