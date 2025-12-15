import { useState } from 'react'
import { Form, Button, ListGroup } from 'react-bootstrap'

const BlogDetail = ({ blog, updateBlog, removeBlog, user, addComment }) => {
  if(!blog){
    return null
  }
  const updateLikes = () => {
    updateBlog({ ...blog, likes: blog.likes + 1 })
  }

  const handleDelete = () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (ok) {
      removeBlog(blog)
    }
  }

  return (
    <div className='py-4'>
      <h2>{ blog.title }</h2>
      <a href={blog.url}>{ blog.url }</a>
      <div>
        likes: {blog.likes} <Button onClick={updateLikes}>likes</Button>
      </div>
      <div>added by {blog.user.username}</div>
      <div>
        {
          user && user.username === blog.user.username
          && (
            <Button onClick={handleDelete} variant='danger'>Delete</Button>
          )
        }
      </div>
      <Comments
        blogId={blog.id}
        comments={blog.comments}
        addComment={addComment}
      />

    </div>
  )
}

const Comments = ({ blogId, comments, addComment }) => {
  const [ comment, setComment ] = useState('')

  const submitComment = (e) => {
    e.preventDefault()
    console.log('submit comment:', comment)
    addComment(blogId, comment)
    setComment('')
  }

  return (
    <div className='pt-4' >
      <h3>comments</h3>
      <Form onSubmit={submitComment}>
        <Form.Group className='d-flex gap-2'>
          <Form.Control value={comment} onChange={ (e) => setComment(e.target.value) }/>
          <Button type="submit">add comment</Button>
        </Form.Group>
      </Form>
      <ListGroup variant='flush'>
        {comments.map(comment => <ListGroup.Item key={comment.id}>{comment.body}</ListGroup.Item>)}
      </ListGroup>
    </div>
  )
}

export default BlogDetail