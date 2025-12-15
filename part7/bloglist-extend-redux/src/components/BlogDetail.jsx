import { useState } from 'react'
import { addComment } from '../reducers/blogsReducer'

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
    <>
      <h2>{ blog.title }</h2>
      <a href={blog.url}>{ blog.url }</a>
      <div>
        likes: {blog.likes} <button onClick={updateLikes}>likes</button>
      </div>
      <div>added by {blog.user.username}</div>
      <div>
        {
          user && user.username === blog.user.username
          && (
            <button onClick={handleDelete}>Delete</button>
          )
        }
      </div>
      <Comments blogId={blog.id} comments={blog.comments} addComment={addComment} />

    </>
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
    <>
      <h3>comments</h3>
      <form onSubmit={submitComment}>
        <input value={comment} onChange={ (e) => setComment(e.target.value) }/>
        <button>add comment</button>
      </form>
      <ul>
        {comments.map(comment => <li key={comment.id}>{comment.body}</li>)}
      </ul>
    </>
  )
}

export default BlogDetail