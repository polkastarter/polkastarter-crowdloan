import React, {useState, useContext, useEffect} from 'react'
import keyring from '@polkadot/ui-keyring'
import {connect, loadAccounts} from '../../services/polkadot'
import {transfer} from '../../services/balance'
import {toNumber} from 'services/utils'

const PolkadotContext = React.createContext()

export const PolkadotContextProvider = props => {
  const [state, setState] = useState({})
  
  useEffect(() => {
    const run = async () => {
      const api = await connect()
      await loadAccounts()
      
      // fund the current account with fake 
      const accountPairs = keyring.getPairs()

      // // fund the last account which is the one used by the polkadot browser extension
      // await transfer(
      //   api,
      //   accountPairs[0],
      //   accountPairs[accountPairs.length - 1].address,
      //   1000e12
      // )
    
      setState({
        api,
        accountPairs,
        loaded: true
      })
    }

    run()
  }, [])

  useEffect(() => {
    const {api, loaded} = state
    let unsub

    const run = async () => {
      unsub = await api.rpc.chain.subscribeNewHeads(async lastHeader => {
        setState({...state, blockNumber: toNumber(lastHeader.number)})
      })
    }

    loaded && run()

    return () => {
      unsub && unsub()
    }
  }, [state.loaded])

  return (
    <PolkadotContext.Provider value={state}>
      {props.children}
    </PolkadotContext.Provider>
  )
}

export const usePolkadot = () => ({...useContext(PolkadotContext)})
