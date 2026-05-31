export const WATER_QUALITY_METRICS = [
  {
    key: 'temperature',
    label: '水温',
    unit: '°C',
    precision: 1,
    idealMin: 22,
    idealMax: 28,
    warnMin: 18,
    warnMax: 32,
    lowerIsBetter: false
  },
  {
    key: 'phValue',
    label: 'pH值',
    unit: '',
    precision: 2,
    idealMin: 6.5,
    idealMax: 8.5,
    warnMin: 6.0,
    warnMax: 9.0,
    lowerIsBetter: false
  },
  {
    key: 'dissolvedOxygen',
    label: '溶解氧',
    unit: 'mg/L',
    precision: 2,
    idealMin: 5.0,
    idealMax: 8.0,
    warnMin: 4.0,
    warnMax: 9.0,
    lowerIsBetter: false
  },
  {
    key: 'ammoniaNitrogen',
    label: '氨氮',
    unit: 'mg/L',
    precision: 3,
    idealMax: 0.2,
    warnMax: 0.5,
    lowerIsBetter: true
  },
  {
    key: 'nitrite',
    label: '亚硝酸盐',
    unit: 'mg/L',
    precision: 3,
    idealMax: 0.05,
    warnMax: 0.15,
    lowerIsBetter: true
  },
  {
    key: 'transparency',
    label: '透明度',
    unit: 'cm',
    precision: 1,
    idealMin: 30,
    idealMax: 45,
    warnMin: 20,
    warnMax: 60,
    lowerIsBetter: false
  }
]

const STATUS_WEIGHT = {
  normal: 0,
  warning: 1,
  danger: 2
}

const STATUS_LABELS = {
  normal: '正常',
  warning: '预警',
  danger: '异常'
}

const STATUS_CLASSES = {
  normal: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger'
}

export function formatWaterQualityValue(metric, value) {
  if (value === null || value === undefined || value === '') {
    return '--'
  }
  const num = Number(value)
  if (Number.isNaN(num)) {
    return '--'
  }
  return num.toFixed(metric.precision)
}

export function getMetricStatus(metric, value) {
  if (value === null || value === undefined || value === '') {
    return 'warning'
  }
  const num = Number(value)
  if (Number.isNaN(num)) {
    return 'warning'
  }

  if (metric.lowerIsBetter) {
    if (metric.idealMax !== undefined && num <= metric.idealMax) {
      return 'normal'
    }
    if (metric.warnMax !== undefined && num <= metric.warnMax) {
      return 'warning'
    }
    return 'danger'
  }

  if (metric.idealMin !== undefined && metric.idealMax !== undefined && num >= metric.idealMin && num <= metric.idealMax) {
    return 'normal'
  }
  if (metric.warnMin !== undefined && metric.warnMax !== undefined && num >= metric.warnMin && num <= metric.warnMax) {
    return 'warning'
  }
  return 'danger'
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] || '未知'
}

export function getStatusClass(status) {
  return STATUS_CLASSES[status] || 'badge-secondary'
}

export function getOverallWaterQualityStatus(record) {
  let overall = 'normal'
  for (const metric of WATER_QUALITY_METRICS) {
    const status = getMetricStatus(metric, record?.[metric.key])
    if (STATUS_WEIGHT[status] > STATUS_WEIGHT[overall]) {
      overall = status
    }
    if (overall === 'danger') {
      break
    }
  }
  return overall
}

export function formatWaterQualityTime(value) {
  if (!value) {
    return '--'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }
  return date.toLocaleString('zh-CN', { hour12: false })
}

export function metricThresholdText(metric) {
  if (metric.lowerIsBetter) {
    const normal = metric.idealMax !== undefined ? `≤ ${metric.idealMax.toFixed(metric.precision)}` : ''
    const warning = metric.warnMax !== undefined ? `预警 ≤ ${metric.warnMax.toFixed(metric.precision)}` : ''
    return [normal, warning].filter(Boolean).join('，')
  }
  const normal = metric.idealMin !== undefined && metric.idealMax !== undefined
    ? `${metric.idealMin.toFixed(metric.precision)} - ${metric.idealMax.toFixed(metric.precision)}`
    : ''
  const warning = metric.warnMin !== undefined && metric.warnMax !== undefined
    ? `预警 ${metric.warnMin.toFixed(metric.precision)} - ${metric.warnMax.toFixed(metric.precision)}`
    : ''
  return [normal, warning].filter(Boolean).join('，')
}
