export const signAndSend = (tx, fromPair) => new Promise(async resolve => {
  const unsub = await tx.signAndSend(fromPair, data => {
    const {status} = data
    console.log('Transaction status:', status.type)

    if (status.isInBlock) {
      console.log('Included at block hash', status.asInBlock.toHex())
    }
    else if (status.isFinalized) {
      const blockHash = status.asFinalized.toHex()
      console.log('Finalized block hash', blockHash)
    
      unsub()
      resolve(data)
    }
  })
})

const getErrors = (api, events) => events
  .filter(({event}) =>
    api.events.system.ExtrinsicFailed.is(event)
  )

export const hasErrors = (api, txResult) => getErrors(api, txResult.events).length > 0

export const decodeEvents = (api, txResult) => {
  
}

export const decodeErrors = (api, txResult) => {
    return getErrors(api, txResult.events)
      .map(({event: {data: [error, info]}}) => {
        if (error.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = api.registry.findMetaError(error.asModule);
          const {documentation, method, section} = decoded;

          return `${section}.${method}: ${documentation.join(' ')}`
        } 
        else {
          // Other, CannotLookup, BadOrigin, no extra info
          return error.toString()
        }
      })
}
