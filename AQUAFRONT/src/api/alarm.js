import request from './request'

export const alarmApi = {
  getOverview() { return request.get('/api/alarm/overview') },

  getThresholds(pondId) { return request.get('/api/alarm/thresholds', { params: { pondId } }) },
  batchSaveThresholds(data) { return request.put('/api/alarm/thresholds/batch', data) },

  getRecords(params) { return request.get('/api/alarm/records', { params }) },
  getRecentRecords(limit = 5) { return request.get('/api/alarm/records/recent', { params: { limit } }) },
  handleAlarm(id, data) { return request.post(`/api/alarm/records/${id}/handle`, data) },

  getSettings(pondId) { return request.get('/api/alarm/settings', { params: { pondId } }) },
  saveSettings(data) { return request.put('/api/alarm/settings', data) }
}
