import { createContext, useReducer } from "react"

const notificationReducer = (state, action) => {
    switch(action.type){
      case "SET_MESSAGE":
        return action.payload
      case "CLEAR_MESSAGE":
        return null
      default:
        return state
    }
  }

const NotificationContext = createContext( null )

export const NotificationContextProvider = ({children}) => {
   const [notification, notificationDispatch] = useReducer(notificationReducer, null)
   
   return (
    <NotificationContext.Provider value={{ notification, notificationDispatch }}>
        {children}
    </NotificationContext.Provider>
   )
}

export default NotificationContext