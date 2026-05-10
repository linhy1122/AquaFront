import request from './request'

export const statisticApi = {
  // 塘口统计数据
  getPondStatistic() {
    return request.get('/api/statistic/pond')
  },
  // 放养统计数据
  getStockingStatistic() {
    return request.get('/api/statistic/stocking')
  }
}