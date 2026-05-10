import request from './request'

export const userApi = {
  getUsers() {
    return request.get('/api/admin/users')
  },

  getUser(id) {
    return request.get(`/api/admin/users/${id}`)
  },

  createUser(data) {
    return request.post('/api/admin/users', data)
  },

  updateUser(id, data) {
    return request.put(`/api/admin/users/${id}`, data)
  },

  deleteUser(id) {
    return request.delete(`/api/admin/users/${id}`)
  }
}