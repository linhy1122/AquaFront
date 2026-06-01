import request from './request'

export const reportApi = {
  getDaily(params) {
    return request.get('/api/report/daily', { params })
  },
  getMonthly(params) {
    return request.get('/api/report/monthly', { params })
  },
  getAnalysis(params) {
    return request.get('/api/report/analysis', { params })
  }
}
