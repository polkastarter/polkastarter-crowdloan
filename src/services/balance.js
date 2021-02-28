import {signAndSend} from './tx'

export const transfer = async (api, fromPair, to, amount) => await signAndSend(
  api.tx.balances.transfer(to, amount),
  fromPair
)
