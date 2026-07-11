import { createContext, useState, useRef } from "react"

const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = (props) => {
  const [message, setMessage] = useState('')
  const timeoutRef = useRef(null)
  
  const showNotification = (message) => {
    setMessage(message)

    if (timeoutRef.current) { clearTimeout(timeoutRef.current) }

    timeoutRef.current = setTimeout(() => {
      setMessage('')
      timeoutRef.current = null
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{message, showNotification}}>
      {props.children}
    </NotificationContext.Provider>
  )
}