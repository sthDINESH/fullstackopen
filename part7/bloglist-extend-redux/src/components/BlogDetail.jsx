const BlogDetail = ({ blog, updateBlog, removeBlog, user }) => {
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

    </>
  )
}

export default BlogDetail