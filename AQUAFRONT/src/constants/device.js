export const DEVICE_TYPE_OPTIONS = [
  { label: '增氧机', value: 'aerator' },
  { label: '水泵', value: 'pump' },
  { label: '投喂机', value: 'feeder' }
]

export const DEVICE_STATUS_OPTIONS = [
  { label: '运行中', value: 'on' },
  { label: '待机', value: 'off' },
  { label: '故障', value: 'error' }
]

export const DEVICE_STATUS_BADGES = {
  on: 'badge-success',
  off: 'badge-info',
  error: 'badge-danger'
}

export const DEVICE_TYPE_LABELS = {
  aerator: '增氧机',
  pump: '水泵',
  feeder: '投喂机'
}

export const DEVICE_STATUS_LABELS = {
  on: '运行中',
  off: '待机',
  error: '故障'
}

export const DEVICE_RUNTIME_LABELS = {
  aerator: '输出功率',
  pump: '流量',
  feeder: '投喂量'
}

export function getDeviceTypeLabel(value) {
  return DEVICE_TYPE_LABELS[value] || value || '--'
}

export function getDeviceStatusLabel(value) {
  return DEVICE_STATUS_LABELS[value] || value || '--'
}

export function getDeviceStatusBadge(value) {
  return DEVICE_STATUS_BADGES[value] || 'badge-secondary'
}

export function formatDeviceRuntime(value) {
  if (value === null || value === undefined || value === '') {
    return '--'
  }
  const num = Number(value)
  if (Number.isNaN(num)) {
    return '--'
  }
  if (num >= 60) {
    const hours = Math.floor(num / 60)
    const minutes = Math.round(num % 60)
    return `${hours}h ${minutes}m`
  }
  return `${num.toFixed(1)} min`
}

export function formatDeviceNumber(value, precision = 2) {
  if (value === null || value === undefined || value === '') {
    return '--'
  }
  const num = Number(value)
  if (Number.isNaN(num)) {
    return '--'
  }
  return num.toFixed(precision)
}

export function formatDeviceTime(value) {
  if (!value) {
    return '--'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }
  return date.toLocaleString('zh-CN', { hour12: false })
}

export function createEmptyDeviceRow() {
  return {
    deviceName: '',
    deviceType: 'aerator',
    status: 'off'
  }
}
