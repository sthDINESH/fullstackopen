import { createSlice } from '@reduxjs/toolkit'
import blogsServices from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => action.payload,
    appendBlog: (state, action) => {
      state.push(action.payload)
    },
    updateBlog: (state, action) => {
      const id = action.payload.id
      return state.map(blog => blog.id===id?action.payload:blog).sort((a,b) => b.likes - a.likes)
    },
    removeBlog: (state, action) => {
      return state.filter(blog => blog.id !== action.payload).sort((a,b) => b.likes - a.likes)
    }
  }
})

const { setBlogs, appendBlog, updateBlog, removeBlog } = blogsSlice.actions

// thunk action creators
export const initializeBlogs = () => {
  return async (dispatch) => {
    const response = await blogsServices.getAll()
    dispatch(setBlogs(response.sort((a,b) => (b.likes-a.likes))))
  }
}

export const addBlog = (blogObj) => {
  return async (dispatch) => {
    const newBlog = await blogsServices.create(blogObj)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const response = await blogsServices.update(blog.id, blog)
    dispatch(updateBlog(response))
  }
}

export const deleteBlog = (blogId) => {
  return async (dispatch) => {
    await blogsServices.remove(blogId)
    dispatch(removeBlog(blogId))
  }
}

export default blogsSlice.reducer