import request from './request'

export const dashboardApi = {
  getSummary() {
    return request.get('/api/dashboard/summary')
  }
}