import request from './request'

export const authApi = {
  getCaptcha() {
    return request.get('/api/auth/captcha')
  },

  login(data) {
    const payload = {
      username: data.username,
      password: data.password
    }
    if (data.captcha) {
      payload.captcha = data.captcha.trim().toUpperCase()
    }
    return request.post('/api/auth/login', payload)
  },

  register(data) {
    return request.post('/api/auth/register', data)
  },

  createUser(data) {
    return request.post('/api/admin/users', data)
  },

  getCurrentUser() {
    return request.get('/api/auth/me')
  },

  logout() {
    return request.post('/api/auth/logout')
  },

  adminTest() {
    return request.get('/api/auth/admin/test')
  }
}