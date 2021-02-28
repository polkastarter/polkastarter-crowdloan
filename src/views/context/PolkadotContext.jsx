import React, {useState, useContext, useEffect} from 'react'
import keyring from '@polkadot/ui-keyring'
import {connect, loadAccounts} from '../../services/polkadot'
import {transfer} from '../../services/balance'

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



  return (
    <PolkadotContext.Provider value={state}>
      {props.children}
    </PolkadotContext.Provider>
  )
}

export const usePolkadot = () => ({...useContext(PolkadotContext)})
