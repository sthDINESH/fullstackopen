import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (state, action) => {
      return action.payload
    }
  }
})

const { setUsers } = usersSlice.actions

// thunk action setters
export const initializeUsers = () => {
  return async (dispatch, getState) => {
    const response = await userService.getAll()
    dispatch(setUsers(response))
  }
}

export default usersSlice.reducer