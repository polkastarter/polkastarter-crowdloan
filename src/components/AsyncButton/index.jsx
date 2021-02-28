import React from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import styles from './styles'

const AsyncButton = props => {
  const {
    children,
    loading, 
    className,
    variant,
    onClick,
    disabled
  } = props
  const classes = styles();

  return (
    <div className={classes.root}>
      <Button
        variant={variant}
        className={className}
        disabled={loading || disabled}
        onClick={onClick}
      >
        {children}
      </Button>
      {loading && <CircularProgress size={24} className={classes.btnProgress} />}
    </div>
  )
}

export default React.memo(AsyncButton)
