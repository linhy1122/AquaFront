import request from './request'

export const deviceApi = {
  list(params) {
    return request.get('/api/device/list', { params })
  },

  getDetail(deviceId) {
    return request.get(`/api/device/${deviceId}`)
  },

  add(data) {
    return request.post('/api/device/add', data)
  },

  batchAdd(data) {
    return request.post('/api/device/batch-add', data)
  },

  update(data) {
    return request.put('/api/device/update', data)
  },

  updateStatus(deviceId, status) {
    return request.patch(`/api/device/${deviceId}/status`, null, {
      params: { status }
    })
  },

  delete(deviceId) {
    return request.delete(`/api/device/${deviceId}`)
  },

  getLatest(params = {}) {
    return request.get('/api/device/latest', { params })
  },

  getHistory(pondId, limit = 20) {
    return request.get(`/api/device/history/${pondId}`, {
      params: { limit }
    })
  }
}
