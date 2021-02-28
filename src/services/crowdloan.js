export const getFundCount = async api => await api.query.crowdloan.fundCount()
export const getFund = async (api, fundIndex) => await api.query.crowdloan.funds(fundIndex)
