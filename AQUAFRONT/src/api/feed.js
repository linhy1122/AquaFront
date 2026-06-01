import request from './request'

export const feedApi = {
  // 饲料库存
  inventory(params) {
    return request.get('/api/feed/inventory', { params })
  },
  inStock(data) {
    return request.post('/api/feed/inStock', data)
  },
  outStock(data) {
    return request.post('/api/feed/outStock', data)
  },
  records(params) {
    return request.get('/api/feed/records', { params })
  },

  // 投喂计划（只读，不会自动生成）
  getPlans(pondId) {
    const params = {}
    if (pondId) params.pondId = pondId
    return request.get('/api/feeding/plans', { params })
  },
  generatePlans() {
    return request.post('/api/feeding/plans/generate')
  },
  executePlan(id, operator) {
    return request.post(`/api/feeding/plans/${id}/execute`, null, { params: { operator } })
  },
  executeAllPlans(operator) {
    return request.post('/api/feeding/plans/execute-all', null, { params: { operator } })
  },
  cancelPlan(id) {
    return request.post(`/api/feeding/plans/${id}/cancel`)
  },

  // 投喂执行日志
  getFeedingLogs(params) {
    return request.get('/api/feeding/logs', { params })
  },

  // 投喂统计
  getStats() {
    return request.get('/api/feeding/stats')
  }
}
