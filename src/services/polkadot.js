import {ApiPromise, WsProvider} from '@polkadot/api'
import {web3Accounts, web3Enable} from '@polkadot/extension-dapp'
import keyring from '@polkadot/ui-keyring'
import config from '../config'

export const connect = async () => {
  const provider = new WsProvider(config.WS_PROVIDER)
  return await ApiPromise.create({provider})
}

export const loadAccounts = async () => {
  await web3Enable(config.APP_NAME)
  let allAccounts = await web3Accounts()

  allAccounts = allAccounts.map(({address, meta}) => ({
      address, 
      meta: {
        ...meta, 
        name: `${meta.name} (${meta.source})`
      } 
    }))

  
  await keyring.loadAll({isDevelopment: config.DEVELOPMENT_KEYRING}, allAccounts)
}
