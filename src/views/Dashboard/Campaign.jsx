import React, {useState, useEffect, useMemo} from 'react'
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
import {toNumber, toPlunk} from 'services/utils'
import {usePolkadot} from 'views/context/PolkadotContext'
import AsyncButton from 'components/AsyncButton'
import useWallet from 'hooks/useWallet'
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js"

const useStyles = makeStyles(styles)

// for million, 2 * 3-grouping + comma
const M_LENGTH = 6 + 1
const K_LENGTH = 3 + 1

const Campaign = props => {
  const {fundIndex} = props
  const {register, handleSubmit, control} = useForm()
  const [fundInfo, setFundInfo] = useState()
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

  const getRaised = () => fundInfo && formatBalance(fundInfo['raised'])

  const submitTransaction = async data => {
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
      console.log(errors)
    }


    setLoading(false)
  }

  const formatDisplay = (prefix, postfix, unit, label = '', isShort=false) => {
    return <>{`${prefix}${isShort ? '' : '.'}`}{!isShort && <span className='ui--FormatBalance-postfix'>{`0000${postfix || ''}`.slice(-4)}</span>}<span className='ui--FormatBalance-unit'> {unit}</span>{label}</>;
  }

  const getFormat = (registry, formatIndex = 0) => {
    const decimals = registry.chainDecimals
    const tokens = registry.chainTokens
  
    return [
      formatIndex < decimals.length
        ? decimals[formatIndex]
        : decimals[0],
      formatIndex < tokens.length
        ? tokens[formatIndex]
        : tokens[1]
    ]
  }

  const formatInfo = useMemo(
    () => getFormat(api.registry, 0),
    [api, 0]
  )

  const format = (value, [decimals, token], withCurrency = true, withSi, _isShort, labelPost) =>  {
    const [prefix, postfix] = formatBalance(value, { decimals, forceUnit: '-', withSi: false }).split('.')
    const isShort = _isShort || (withSi && prefix.length >= K_LENGTH)
    const unitPost = withCurrency ? token : ''
  
    if (prefix.length > M_LENGTH) {
      const [major, rest] = formatBalance(value, { decimals, withUnit: false }).split('.')
      const minor = rest.substr(0, 4)
      const unit = rest.substr(4)
  
      return <>{major}.<span className='ui--FormatBalance-postfix'>{minor}</span><span className='ui--FormatBalance-unit'>{unit}{unit ? unitPost : ` ${unitPost}`}</span>{labelPost || ''}</>
    }
  
    return formatDisplay(prefix, postfix, unitPost, labelPost, isShort)
  }

  const getOwner = () => fundInfo && fundInfo['owner'].toString()
  const getCap = () => fundInfo && format(fundInfo['cap'], formatInfo)
  const getEnd = () => fundInfo && fundInfo['end'].toString()
  const getFirstSlot = () => fundInfo && fundInfo['firstSlot'].toString()
  const getLastSlot = () => fundInfo && fundInfo['lastSlot'].toString()

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
          <CardHeader color="danger" stats icon>
            <CardIcon color="danger">
              <Icon>info_outline</Icon>
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
    </GridContainer>
  )
}

export default React.memo(Campaign)
