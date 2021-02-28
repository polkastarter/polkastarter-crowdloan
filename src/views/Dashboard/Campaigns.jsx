import React from "react"
import Campaign from './Campaign'

const Campaigns = props => {
  const {fundCount=0} = props

  return (
    new Array(fundCount).fill().map((_, i) => (
      <Campaign key={i} fundIndex={i} />
    ))
  )
}

export default React.memo(Campaigns)
