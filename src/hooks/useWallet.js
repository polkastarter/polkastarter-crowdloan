import React, {useState, useEffect} from 'react'
import {web3FromSource} from '@polkadot/extension-dapp'
import {usePolkadot} from 'views/context/PolkadotContext'
import {signAndSend, decodeErrors} from 'services/tx'
import {partial} from 'services/fn'

const useWallet = () => {
  const {api, accountPairs, loaded} = usePolkadot()
  const [wallet, setWallet] = useState({})

  useEffect(() => {
    const run = async () => {
      const accountPair = accountPairs[accountPairs.length - 1]
      const {
        address,
        meta: {source, isInjected}
      } = accountPair

      if (isInjected) {
        const injected = await web3FromSource(source)
        api.setSigner(injected.signer)
      }
      
      setWallet({
        signAndSend: partial(signAndSend, address),
        decodeErrors
      })
    }

    loaded && run()
  }, [loaded])

  return wallet
}

export default useWallet
