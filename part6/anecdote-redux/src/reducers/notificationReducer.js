import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setMessage(state, action){
            return action.payload
        },
        clearMessage(){
            return null
        }
    }
})

const { setMessage, clearMessage } = notificationSlice.actions

export const setNotification = (message, interval) => {
    return async (dispatch) => {
        dispatch(setMessage(message))
        setTimeout(()=>dispatch(clearMessage()), interval * 1000)
    }
}

export default notificationSlice.reducer
