import { useState } from 'react'

const NotifierService = () => {
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const notify = (message, type, timeout) => {
    setMessage(message)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, timeout)
  }

  return { message, messageType, notify }
}

export default NotifierService
