const BN = require('bn.js');

export const bn = num => new BN(num)
export const toNumber = substrateNum => substrateNum.toNumber()
export const fromPlunk = num => bn(num).div(bn(10).pow(bn(12)))
export const toPlunk = num => bn(num).mul(bn(10).pow(bn(12)))

export const toUnit = (num, decimals=12) => {
  const base = bn(10).pow(bn(decimals));
  const dm = bn(num).divmod(base);
  
  return parseFloat(`${dm.div.toString()}.${dm.mod.toString()}`).toLocaleString()
}

// TODO: remove this hack then crowdloan module is deployed on an official network
export const normalizeNumericValue = num => bn(num).div(bn(256))
