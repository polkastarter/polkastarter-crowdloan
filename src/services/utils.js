const BN = require('bn.js');

export const bn = num => new BN(num)
export const toNumber = substrateNum => substrateNum.toNumber()
export const fromPlunk = num => bn(num).div(bn(10).pow(bn(12)))
export const toPlunk = num => bn(num).mul(bn(10).pow(bn(12)))
polk
