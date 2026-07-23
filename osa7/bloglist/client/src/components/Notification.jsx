import { useNotification } from "../store";

const Notification = () => {
  const { message, messageType } = useNotification();

  if (message === null) {
    return null;
  }

  return <div className={messageType}>{message}</div>;
};

export default Notification;
