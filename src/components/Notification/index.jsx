import React from 'react'
import Snackbar from 'components/Snackbar/Snackbar.js'
import AddAlert from '@material-ui/icons/AddAlert'

const Notification = props => {
  const {message='', type, onClose} = props

  return (
    <Snackbar
      place='tr'
      color={type === 'error' ? 'danger' : 'info'}
      icon={AddAlert}
      message={message}
      open={message}
      closeNotification={onClose}
      close
    />
  )
}

export default React.memo(Notification)
