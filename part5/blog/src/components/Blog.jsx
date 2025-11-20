import { useState } from "react"

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const showOnVisible = { display: visible?'':'none' }
  const hideOnVisible = { display: visible?'none': ''}

  const toggleVisibility = () => setVisible(!visible)

  const updateLikes = () => {
    blog.likes += 1
    updateBlog(blog)
  }

  const handleDelete = () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (ok) {
      removeBlog(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideOnVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>View</button>
      </div>
      <div style={showOnVisible}>
        <div>
          {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        </div>  
        <div>{blog.url}</div>  
        <div>
          likes: {blog.likes} <button onClick={updateLikes}>likes</button>
        </div>  
        <div>{blog.user.username}</div>  
        <div>  
        {
          user.username === blog.user.username 
          && (
            <button onClick={handleDelete}>Delete</button>
          )
        }
        </div>
      </div>
    </div>
  )
}

export default Blog