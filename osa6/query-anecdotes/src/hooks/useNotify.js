import { useContext } from "react"
import NotificationContext from "../NotificationContext"

export const useNotify = () => {
  const { showNotification } = useContext(NotificationContext)

  return {
    notify: showNotification
  }
}
