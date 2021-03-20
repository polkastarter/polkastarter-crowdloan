import React, {useEffect, useState} from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import {formatBalance} from '@polkadot/util'
import WidgetsIcon from '@material-ui/icons/Widgets'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
// import CardBody from "components/Card/CardBody.js";


import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import {usePolkadot} from '../context/PolkadotContext'
import CreateCrowdloan from './CreateCrowdloan'
import RegisterParachain from './RegisterParachain'
import {toNumber, toUnit, normalizeNumericValue} from 'services/utils'
import {listenBalanceChange} from 'services/balance'
import {getFundCount} from 'services/crowdloan'
import Campaigns from './Campaigns'

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const [fundCount, setFundCount] = useState('')
  const [balance, setBalance] = useState('')
  const classes = useStyles()
  const {api, blockNumber, accountPairs, loaded} = usePolkadot()

  useEffect(() => {
    const run = async () => {
      // const count = await getFundCount(api)
      const count = 2;
      setFundCount(count)
    }

    loaded && run()
  }, [blockNumber])

  useEffect(() => {
    let unsub

    const run = async () => {
      const accountPair = accountPairs[accountPairs.length - 1]
      unsub = await listenBalanceChange(api, accountPair.address, balance => {
        setBalance(toUnit(normalizeNumericValue(balance)))
      })
    }

    loaded && run()

    return () => {
      unsub && unsub()
    }
  }, [loaded])  

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <AccountBalanceIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Balance</p>
              <h3 className={classes.cardTitle}>{balance}</h3>
            </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <AccountBalanceWalletIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Campaigns</p>
              <h3 className={classes.cardTitle}>
                {fundCount}
              </h3>
            </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <WidgetsIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Current Block</p>
              <h3 className={classes.cardTitle}>{blockNumber}</h3>
            </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12}>
          <RegisterParachain />
        </GridItem>
        <GridItem xs={12}>
          <CreateCrowdloan />
        </GridItem>
        <GridItem xs={12}>
          {loaded ? <Campaigns fundCount={fundCount}/> : null}
        </GridItem>
      </GridContainer>
    </div>
  );
}
