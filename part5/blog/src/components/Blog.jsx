import { useState } from "react"

const Blog = ({ blog }) => {
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

  return (
    <div style={blogStyle}>
      <div style={hideOnVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>View</button>
      </div>
      <div style={showOnVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
      </div>  
      <div style={showOnVisible}>{blog.url}</div>  
      <div style={showOnVisible}>
        likes: {blog.likes} <button>likes</button>
      </div>  
      <div style={showOnVisible}>{blog.user.username}</div>  
    </div>
  )
}

export default Blog