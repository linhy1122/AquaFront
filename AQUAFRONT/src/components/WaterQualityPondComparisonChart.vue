<template>
  <div class="comparison-panel">
    <div class="chart-section">
      <div ref="chartContainer" class="chart-container"></div>
    </div>
    <div class="summary-section">
      <div class="summary-item">
        <span class="summary-dot" :class="overallClass"></span>
        <span>综合状态: <strong>{{ overallLabel }}</strong></span>
      </div>
      <div class="summary-item">
        <span>{{ worstMetric.label ? worstMetric.label + ' 最接近阈值' : '所有指标正常' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'
import * as echarts from 'echarts'
import {
  WATER_QUALITY_METRICS,
  getMetricStatus,
  getOverallWaterQualityStatus,
  getStatusClass,
  getStatusLabel
} from '@/constants/waterQuality'

const props = defineProps({
  pondData: { type: Object, default: null },
  allPondsData: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

const chartContainer = ref(null)
let chartInstance = null
let resizeObserver = null

const barColors = { danger: '#ee6666', warning: '#fac858', normal: '#5470c6' }

function computeAverages(list) {
  const avg = {}
  for (const m of WATER_QUALITY_METRICS) {
    const vals = list
      .map(p => p[m.key])
      .filter(v => v !== null && v !== undefined && v !== '')
      .map(Number)
      .filter(v => !Number.isNaN(v))
    avg[m.key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }
  return avg
}

function buildOption(data, averages) {
  const categories = WATER_QUALITY_METRICS.map(m => m.label)
  const values = WATER_QUALITY_METRICS.map(m => {
    const v = data[m.key]
    return v !== null && v !== undefined && v !== '' ? Number(v) : null
  })
  const statuses = WATER_QUALITY_METRICS.map(m => getMetricStatus(m, data[m.key]))
  const avgValues = WATER_QUALITY_METRICS.map(m => averages[m.key])

  return {
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter(params) {
        const idx = params[0]?.dataIndex
        if (idx === undefined) return ''
        const m = WATER_QUALITY_METRICS[idx]
        const v = values[idx]
        const s = statuses[idx]
        const a = avgValues[idx]
        const sl = s === 'normal' ? '正常' : s === 'warning' ? '预警' : '异常'
        let html = `<strong>${m.label}</strong><br/>`
        html += `当前值: <strong>${v !== null ? v.toFixed(m.precision) : '--'}</strong> ${m.unit || ''}<br/>`
        html += `状态: ${sl}<br/>`
        if (a !== null) {
          html += `全塘均值: ${a.toFixed(m.precision)} ${m.unit || ''}`
        }
        return html
      }
    },
    grid: { left: 50, right: 30, top: 15, bottom: 30 },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { fontSize: 11, interval: 0, rotate: 0 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } },
      axisLabel: { fontSize: 11 }
    },
    legend: {
      data: ['当前塘口', '全塘均值'],
      bottom: 0,
      textStyle: { fontSize: 12 }
    },
    series: [
      {
        name: '当前塘口',
        type: 'bar',
        barWidth: '28%',
        barGap: '20%',
        itemStyle: {
          color: params => barColors[statuses[params.dataIndex]] || '#ccc',
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          fontWeight: 500,
          color: '#333',
          formatter: params => {
            const v = params.data
            return v !== null && v !== undefined ? v : ''
          }
        },
        data: values.map((v, idx) => ({
          value: v,
          itemStyle: v === null ? { color: '#ddd', borderRadius: [4, 4, 0, 0] } : undefined
        }))
      },
      {
        name: '全塘均值',
        type: 'bar',
        barWidth: '28%',
        barGap: '20%',
        itemStyle: {
          color: '#b0c4de',
          borderRadius: [4, 4, 0, 0],
          opacity: 0.7
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          color: '#888',
          formatter: params => {
            const v = params.data
            return v !== null && v !== undefined ? v : ''
          }
        },
        data: avgValues.map(v => (v !== null ? Number(v.toFixed(2)) : null))
      }
    ]
  }
}

function renderChart() {
  if (!chartInstance || !chartContainer.value) return
  if (props.loading || props.error || !props.pondData) {
    chartInstance.clear()
    return
  }
  const averages = props.allPondsData.length > 1 ? computeAverages(props.allPondsData) : {}
  const option = buildOption(props.pondData, averages)
  chartInstance.setOption(option, true)
}

const overallStatus = computed(() => {
  if (!props.pondData) return null
  return getOverallWaterQualityStatus(props.pondData)
})
const overallClass = computed(() => {
  if (!overallStatus.value) return ''
  return getStatusClass(overallStatus.value)
})
const overallLabel = computed(() => {
  if (!overallStatus.value) return ''
  return getStatusLabel(overallStatus.value)
})

const worstMetric = computed(() => {
  if (!props.pondData) return {}
  let worst = { key: null, label: '', status: 'normal', distance: Infinity }
  for (const m of WATER_QUALITY_METRICS) {
    const v = props.pondData[m.key]
    if (v === null || v === undefined || v === '') continue
    const val = Number(v)
    if (Number.isNaN(val)) continue
    const status = getMetricStatus(m, val)
    if (status === 'danger') return m
    if (status === 'warning') return m
  }
  return {}
})

onMounted(() => {
  chartInstance = echarts.init(chartContainer.value)
  renderChart()
  resizeObserver = new ResizeObserver(() => chartInstance?.resize())
  resizeObserver.observe(chartContainer.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  chartInstance?.dispose()
  chartInstance = null
})

watch(() => props.pondData, renderChart, { deep: true })
watch(() => props.allPondsData, renderChart, { deep: true })
</script>

<style scoped>
.comparison-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-container {
  width: 100%;
  height: 320px;
}

.summary-section {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 8px 14px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 6px;
  font-size: 13px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.summary-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
</style>
