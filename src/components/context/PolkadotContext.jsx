import React, {useState, useContext, useEffect} from 'react'
import {connect, loadAccounts} from '../../services/polkadot'

const PolkadotContext = React.createContext()

export const PolkadotContextProvider = props => {
  const [state, setState] = useState({})
  
  useEffect(() => {
    const run = async () => {
      const api = await connect()
      const accounts = loadAccounts()
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
