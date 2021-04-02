import React from "react"
import Campaign from './Campaign'

const Campaigns = props => {
  const {fundCount=1} = props

  return (
    new Array(fundCount).fill().map((_, i) => (
      <Campaign key={i} fundIndex={155} />
    ))
  )
}

export default React.memo(Campaigns)
