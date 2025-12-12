import { createSlice } from '@reduxjs/toolkit'

const getUserFromLocalStorage = () => {
  const userJSON = window.localStorage.getItem('blogAppUser')
  return userJSON ? JSON.parse(userJSON) : null
}

const userSlice = createSlice({
  name: 'user',
  initialState: getUserFromLocalStorage(),
  reducers: {
    setLoggedUser: (state, action) => {
      return action.payload
    },
    clearLoggedUser: (state) => {
      return null
    }
  }
})

export const { setLoggedUser, clearLoggedUser } = userSlice.actions

export default userSlice.reducer