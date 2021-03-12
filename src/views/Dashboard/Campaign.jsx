import React, {useState, useEffect} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {formatBalance, formatNumber} from '@polkadot/util'
import InputBase from '@material-ui/core/InputBase'
import {makeStyles} from "@material-ui/core/styles"
import GridItem from "components/Grid/GridItem.js"
import GridContainer from "components/Grid/GridContainer.js"
import Icon from "@material-ui/core/Icon"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js"
import CardFooter from "components/Card/CardFooter.js"
import CardIcon from "components/Card/CardIcon.js"
import CardBody from "components/Card/CardBody.js"
import {getFund} from 'services/crowdloan'
import {toUnit, toPlunk, bn, normalizeNumericValue} from 'services/utils'
import {usePolkadot} from 'views/context/PolkadotContext'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import AsyncButton from 'components/AsyncButton'
import useWallet from 'hooks/useWallet'
import Notification from 'components/Notification'
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js"

const useStyles = makeStyles(styles);

const Campaign = props => {
  const {fundIndex} = props
  const {register, handleSubmit, control, reset} = useForm()
  const [fundInfo, setFundInfo] = useState()
  const [notification, setNotification] = useState({})
  const [loading, setLoading] = useState(false)
  const {api, blockNumber} = usePolkadot()
  const {signAndSend, decodeErrors} = useWallet()
  const classes = useStyles()

  useEffect(() => {
    const run = async () => {
      const fund = await getFund(api, fundIndex)
      setFundInfo(fund.unwrapOr(null))
    }

    run()
  }, [blockNumber])

  const getRaised = () => fundInfo && toUnit(normalizeNumericValue(fundInfo['raised']))

  const submitTransaction = async data => {
    try {
      setLoading(true)
      const {amount} = data
      
      const txResult = await signAndSend(
        api.tx.crowdloan.contribute(
          fundIndex,
          toPlunk(amount),
          null
        )
      )

      const errors = await decodeErrors(api, txResult)

      if(errors.length > 0) {
        setNotification({
          message: `Error while contributing to the campaign ${errors[0].message || errors[0]}`,
          type: 'error'
        })
      }
      else {
        setNotification({
          message: `You contribution has been deposited`,
          type: 'info'
        })
      }
    }
    catch(error) {
      setNotification({
        message: `Error while contributing to the campaign ${error.message}`,
        type: 'error'
      })
    }
    finally {
      setLoading(false)
      reset({amount: ''})
    }

  }

  const getOwner = () => fundInfo && fundInfo['owner'].toString()
  const getCap = () => fundInfo && toUnit(normalizeNumericValue(fundInfo['cap']))
  const getEnd = () => fundInfo && normalizeNumericValue(fundInfo['end']).toString()
  const getFirstSlot = () => fundInfo && normalizeNumericValue(fundInfo['firstSlot']).toString()
  const getLastSlot = () => fundInfo && normalizeNumericValue(fundInfo['lastSlot']).toString()

  const renderContributeForm = () => (
    <GridContainer>
      <GridItem xs={12}>
        <Controller
          name='amount'
          control={control}
          ref={register({required: true})} 
          render={({onChange, value}) => (
            <InputBase
              placeholder='Amount'
              type='number'
              value={value}
              onChange={onChange}
            />
          )}
        />
      </GridItem>
      <GridItem>
        <AsyncButton
          onClick={handleSubmit(submitTransaction)}
          loading={loading}
        >
          Contribute
        </AsyncButton>
      </GridItem>
    </GridContainer>
  )

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader stats icon>
            <CardIcon color="info">
              <AddCircleOutlineIcon />
            </CardIcon>
            <p className={classes.cardCategory}>Raised</p>
            <h3 className={classes.cardTitle}>{getRaised()}</h3>
          </CardHeader>
          <CardBody>
            {renderContributeForm()}
          </CardBody>
          <CardFooter stats>
            <GridContainer>
              <GridItem xs={12}>
                <h3 style={{fontSize: '0.75rem'}}>Owner: {getOwner()}</h3>
              </GridItem>
              <GridItem xs={12}>
                <h3 style={{fontSize: '0.75rem'}}>Cap: {getCap()}</h3>
              </GridItem>
              <GridItem xs={12}>
                <h3 style={{fontSize: '0.75rem'}}>End Block: {getEnd()}</h3>
              </GridItem>
              <GridItem xs={12}>
                <h3 style={{fontSize: '0.75rem'}}>Start Slot: {getFirstSlot()}</h3>
              </GridItem>
              <GridItem xs={12}>
                <h3 style={{fontSize: '0.75rem'}}>End Slot: {getLastSlot()}</h3>
              </GridItem>
            </GridContainer>
          </CardFooter>
        </Card>
      </GridItem>
      <Notification
        onClose={() => setNotification({})}
        message={notification.message}
        type={notification.type}
      />
    </GridContainer>
  )
}

export default React.memo(Campaign)
