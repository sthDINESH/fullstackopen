import { useState, useImperativeHandle } from 'react'
import { Button } from 'react-bootstrap'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const showOnVisible = { display: visible?'':'none' }
  const hideOnVisible = { display: visible?'none': '' }

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div className='py-5'>
      <div style={showOnVisible}>
        {props.children}
        <Button onClick={toggleVisibility} variant='secondary'>cancel</Button>
      </div>
      <div style={hideOnVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
    </div>
  )
}

export default Togglable