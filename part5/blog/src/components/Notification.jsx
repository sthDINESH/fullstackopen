const Notification = ({ message }) => {
  if (!message) return null
  return (
    <div className={`notification ${message.type}`}>{ message.content }</div>
  )
}

export default Notification