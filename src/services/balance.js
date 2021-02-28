import {signAndSend} from './tx'

export const transfer = async (api, fromPair, to, amount) => await signAndSend(
  api.tx.balances.transfer(to, amount),
  fromPair
)

export const listenBalanceChange = async (api, account, onChange) => {
  const unsub = await api.query.system.account(account, ({data: {free: currentFree}}) => {
    onChange(currentFree)
  })

  return unsub
}
