import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (!notification) return null
  return (
    <Alert variant={notification.type}>{ notification.content }</Alert>
  )
}

export default Notification