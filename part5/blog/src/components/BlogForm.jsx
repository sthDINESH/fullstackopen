import { useState } from "react"

const BlogForm = ( {createBlog} ) => {
    // form inputs as states
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        createBlog({ title, author, url})
        setTitle('')
        setAuthor('')
        setUrl('')
    }
    
    return (
      <form onSubmit={handleSubmit}>
        <h2>create new</h2>
        <div>
          <label>
            title
            <input type='text' value={title} onChange={({target}) => setTitle(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            author
            <input type='text' value={author} onChange={({target}) => setAuthor(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            url
            <input type='text' value={url} onChange={({target}) => setUrl(target.value)}></input>
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    )
  }

export default BlogForm