import request from './request'

export const waterQualityApi = {
  getLatest() {
    return request.get('/api/water-quality/latest')
  },

  getHistory(pondId, limit = 10) {
    return request.get(`/api/water-quality/history/${pondId}`, {
      params: { limit }
    })
  }
}
