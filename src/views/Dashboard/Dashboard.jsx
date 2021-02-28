import React, {useEffect, useState} from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import {formatBalance} from '@polkadot/util'
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
import {toNumber, fromPlunk} from 'services/utils'
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
      const count = await getFundCount(api)
      setFundCount(toNumber(count))
    }

    loaded && run()
  }, [blockNumber])

  useEffect(() => {
    let unsub

    const run = async () => {
      const accountPair = accountPairs[accountPairs.length - 1]
      unsub = await listenBalanceChange(api, accountPair.address, balance => {
        setBalance(formatBalance(toNumber(balance), {unit: 'unit'}))
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
                <Icon>info_outline</Icon>
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
                <Icon>content_copy</Icon>
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
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Current Block</p>
              <h3 className={classes.cardTitle}>{blockNumber}</h3>
            </CardHeader>
          </Card>
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
