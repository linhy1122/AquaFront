import request from './request'

export const stockingApi = {
  // 分页查询放养记录
  list(params) {
    return request.get('/api/stocking/list', { params })
  },
  // 按塘口查询放养记录
  listByPond(params) {
    return request.get('/api/stocking/listByPond', { params })
  },
  // 新增放养记录
  add(data) {
    return request.post('/api/stocking/add', data)
  },
  // 编辑放养记录
  update(data) {
    return request.put('/api/stocking/update', data)
  },
  // 删除放养记录
  delete(batchId) {
    return request.delete(`/api/stocking/delete/${batchId}`)
  },
}
