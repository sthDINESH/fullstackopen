import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showSuccess: (state, action) => {
      return {
        content: action.payload,
        type: 'success',
      }
    },
    showError: (state, action) => {
      return {
        content: action.payload,
        type: 'error',
      }
    },
    clear: () => {
      return null
    }
  }
})

export const { showSuccess, showError, clear } = notificationSlice.actions

export default notificationSlice.reducer