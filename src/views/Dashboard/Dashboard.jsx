import React, {useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import WidgetsIcon from '@material-ui/icons/Widgets'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Campaign from './Campaign'

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import {usePolkadot} from '../context/PolkadotContext'
import CreateCrowdloan from './CreateCrowdloan'
import RegisterParachain from './RegisterParachain'
import {toUnit} from 'services/utils'
import {listenBalanceChange} from 'services/balance'
import Campaigns from './Campaigns'

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const [fundCount, setFundCount] = useState('')
  const [balance, setBalance] = useState('')
  const classes = useStyles()
  const {api, blockNumber, accountPairs, loaded} = usePolkadot()
  const {
    match: {params: {paraId}}
  } = props;

  useEffect(() => {
    const run = async () => {
      const count = localStorage.getItem('fund_count') || 1
      setFundCount(Number(count))
    }

    loaded && run()
  }, [blockNumber])

  useEffect(() => {
    let unsub

    const run = async () => {
      const accountPair = accountPairs[accountPairs.length - 1]
      unsub = await listenBalanceChange(api, accountPair.address, balance => {
        setBalance(toUnit(balance))
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
        {/* <GridItem xs={12} sm={6} md={3}>
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
        </GridItem> */}
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
        {/* <GridItem xs={12}>
          <RegisterParachain />
        </GridItem> */}
        {/* <GridItem xs={12}>
          <CreateCrowdloan />
        </GridItem> */}
        {/* <GridItem xs={12}>
          {loaded ? <Campaigns fundCount={fundCount}/> : null}
        </GridItem> */}
        <GridItem xs={12}>
          <Campaign fundIndex={paraId} />
        </GridItem>
      </GridContainer>
    </div>
  );
}
