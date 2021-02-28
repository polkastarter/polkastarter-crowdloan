import React, {useState, useEffect} from 'react'
import {usePolkadot} from 'views/context/PolkadotContext'
import {makeStyles} from "@material-ui/core/styles"
import GridItem from "components/Grid/GridItem.js"
import GridContainer from "components/Grid/GridContainer.js"
import Icon from "@material-ui/core/Icon"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js"
import CardFooter from "components/Card/CardFooter.js"
import CardIcon from "components/Card/CardIcon.js"
import {getFund} from 'services/crowdloan'
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js"

const useStyles = makeStyles(styles);

const Campaign = props => {
  const {fundIndex, blockNumber} = props
  const [fundInfo, setFundInfo] = useState({})
  const {api} = usePolkadot()
  const classes = useStyles()

  useEffect(() => {
    const run = async () => {
      const fund = await getFund(api, fundIndex)
      setFundInfo(fund)
      console.log(fund)
    }

    run()
  }, [blockNumber])

  return (
    <GridContainer>
      <GridItem xs={12} sm={6} md={3}>
        <Card>
          <CardHeader color="danger" stats icon>
            <CardIcon color="danger">
              <Icon>info_outline</Icon>
            </CardIcon>
            <p className={classes.cardCategory}>Raised</p>
            <h3 className={classes.cardTitle}></h3>
          </CardHeader>
          <CardFooter stats>
            <div className={classes.stats}>
              Last 24 Hours
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  )
}

export default React.memo(Campaign)
