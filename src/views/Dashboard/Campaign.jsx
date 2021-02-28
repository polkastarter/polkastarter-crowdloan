import React, {useState, useEffect} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {web3FromSource} from '@polkadot/extension-dapp'
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
import {toNumber} from 'services/utils'
import {usePolkadot} from 'views/context/PolkadotContext'
import AsyncButton from 'components/AsyncButton'
import useWallet from 'hooks/useWallet'
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js"

const useStyles = makeStyles(styles);

const Campaign = props => {
  const {fundIndex} = props
  const {register, handleSubmit, control} = useForm()
  const [fundInfo, setFundInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const {api, blockNumber} = usePolkadot()
  const {signAndSend, decodeErrors} = useWallet()
  const classes = useStyles()

  useEffect(() => {
    const run = async () => {
      const fund = await getFund(api, fundIndex)
      setFundInfo(fund)
    }

    run()
  }, [blockNumber])

  const getRaised = () => fundInfo.value && toNumber(fundInfo.value['raised'])

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
    </GridContainer>
  )

  const submitTransaction = async data => {
    setLoading(true)
    const {amount} = data
    
    const txResult = await signAndSend(
      api.tx.crowdloan.contribute(
        toPlunk(amount),
        fundIndex,
        null
      )
    )

    const errors = await decodeErrors(api, txResult)

    if(errors.length > 0) {
      console.log(errors)
    }


    setLoading(false)
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={6} md={3}>
        <Card>
          <CardHeader color="danger" stats icon>
            <CardIcon color="danger">
              <Icon>info_outline</Icon>
            </CardIcon>
            <p className={classes.cardCategory}>Raised</p>
            <h3 className={classes.cardTitle}>{getRaised()}</h3>
          </CardHeader>
          <CardBody>
            {renderContributeForm}
          </CardBody>
          <CardFooter stats>
            <AsyncButton
              onClick={handleSubmit(submitTransaction)}
              loading={loading}
            >
              Contribute
            </AsyncButton>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  )
}

export default React.memo(Campaign)
