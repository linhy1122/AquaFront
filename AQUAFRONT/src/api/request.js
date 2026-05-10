import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8899/Aqua',
  timeout: 10000,
  withCredentials: true
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

request.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error.response || error)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return Promise.reject(error.response?.data || { message: error.message })
  }
)

export default request