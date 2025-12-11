import { createSlice } from '@reduxjs/toolkit'
import blogsServices from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => action.payload,
    appendBlog: (state, action) => {
      state.push(action.payload)
    }
  }
})

const { setBlogs, appendBlog } = blogsSlice.actions

// thunk action creators
export const initializeBlogs = () => {
  return async (dispatch) => {
    const response = await blogsServices.getAll()
    dispatch(setBlogs(response))
  }
}

export const addBlog = (blogObj) => {
  return async (dispatch) => {
    const newBlog = await blogsServices.create(blogObj)
    dispatch(appendBlog(newBlog))
  }
}

export default blogsSlice.reducer