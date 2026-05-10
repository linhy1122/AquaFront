import request from './request'

export const pondApi = {
  // 分页查询塘口列表
  list(params) {
    return request.get('/api/pond/list', { params })
  },
  // 新增塘口
  add(data) {
    return request.post('/api/pond/add', data)
  },
  // 编辑塘口
  update(data) {
    return request.put('/api/pond/update', data)
  },
  // 删除塘口
  delete(pondId) {
    return request.delete(`/api/pond/delete/${pondId}`)
  },
  // 获取塘口详情
  getDetail(pondId) {
    return request.get(`/api/pond/${pondId}`)
  }
}