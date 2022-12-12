import React, { useState, useImperativeHandle } from 'react'

const Notification = React.forwardRef((props, ref) => {
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)

  const setNotification = (message, type) => {
    setMessage(message)
    setType(type)
    setTimeout(() => {
      setMessage(null)
      setType(null)
    }, 5000)
  }

  useImperativeHandle(ref, () => {
    return {
      setNotification
    }
  })

  return (
    <div className={type}>
      {message}
    </div>
  )
})

Notification.displayName = 'Notification'

export default Notification
