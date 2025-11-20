import { useState, useImperativeHandle } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const showOnVisible = { display: visible?'':'none' }
  const hideOnVisible = { display: visible?'none': '' }

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <>
      <div style={showOnVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
      <div style={hideOnVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
    </>
  )
}

export default Togglable