import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ( { createBlog } ) => {
  // form inputs as states
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Form onSubmit={handleSubmit} className='pb-3'>
      <h2>create new</h2>
      <Form.Group>
        <Form.Label>
            title
          <Form.Control type='text' value={title} onChange={({ target }) => setTitle(target.value)}></Form.Control>
        </Form.Label>
      </Form.Group>
      <Form.Group>
        <Form.Label>
            author
          <Form.Control type='text' value={author} onChange={({ target }) => setAuthor(target.value)}></Form.Control>
        </Form.Label>
      </Form.Group>
      <Form.Group>
        <Form.Label>
            url
          <Form.Control type='url' value={url} onChange={({ target }) => setUrl(target.value)}></Form.Control>
        </Form.Label>
      </Form.Group>
      <Button type="submit" variant='primary'>create</Button>
    </Form>
  )
}

export default BlogForm