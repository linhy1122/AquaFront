import request from './request'

export const feedApi = {
  // 查询饲料库存
  inventory(params) {
    return request.get('/api/feed/inventory', { params })
  },
  // 饲料入库
  inStock(data) {
    return request.post('/api/feed/inStock', data)
  },
  // 饲料出库
  outStock(data) {
    return request.post('/api/feed/outStock', data)
  },
  // 出入库流水明细
  records(params) {
    return request.get('/api/feed/records', { params })
  },
}
