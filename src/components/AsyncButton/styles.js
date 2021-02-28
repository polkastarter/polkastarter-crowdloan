import {makeStyles} from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  btnProgress: {
    color: 'rgb(173, 96, 55)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}))
