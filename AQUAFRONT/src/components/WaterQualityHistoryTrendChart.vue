<template>
  <div class="trend-panel">
    <div class="chart-section">
      <div ref="chartContainer" class="chart-container"></div>
    </div>
    <div class="stats-section">
      <div v-for="s in stats" :key="s.key" class="stat-card">
        <div class="stat-label">{{ s.label }}</div>
        <div class="stat-row">
          <span class="stat-value">{{ s.max !== null ? s.max : '--' }}</span>
          <span class="stat-tag max">最高</span>
        </div>
        <div class="stat-row">
          <span class="stat-value">{{ s.min !== null ? s.min : '--' }}</span>
          <span class="stat-tag min">最低</span>
        </div>
        <div class="stat-row">
          <span class="stat-value">{{ s.avg !== null ? s.avg : '--' }}</span>
          <span class="stat-tag avg">平均</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { WATER_QUALITY_METRICS, getMetricStatus } from '@/constants/waterQuality'

const props = defineProps({
  records: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

const chartContainer = ref(null)
let chartInstance = null
let resizeObserver = null

const COLORS = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272']

function buildOption(data) {
  const sorted = [...data].sort(
    (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
  )

  const xData = sorted.map(r => {
    const d = new Date(r.recordedAt)
    return Number.isNaN(d.getTime()) ? r.recordedAt : d.toLocaleString('zh-CN', { hour12: false })
  })

  const series = WATER_QUALITY_METRICS.map((metric, idx) => {
    const values = sorted.map(r => {
      const v = r[metric.key]
      return v !== null && v !== undefined && v !== '' ? Number(v) : null
    })

    const latestVal = values[values.length - 1]
    const latestStatus = latestVal !== null
      ? getMetricStatus(metric, latestVal)
      : null

    const anomalies = values.map((v, vi) => {
      if (v === null) return null
      const s = getMetricStatus(metric, v)
      return s === 'danger' ? vi : null
    }).filter(i => i !== null)

    return {
      name: metric.label,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: values.map((v, vi) => {
        if (v === null) return 0
        const s = getMetricStatus(metric, v)
        return s === 'danger' ? 8 : vi === values.length - 1 ? 6 : 2
      }),
      lineStyle: {
        width: 2,
        color: COLORS[idx % COLORS.length]
      },
      itemStyle: {
        color: (params) => {
          const v = values[params.dataIndex]
          if (v === null) return 'transparent'
          const s = getMetricStatus(metric, v)
          if (s === 'danger') return '#ee6666'
          if (s === 'warning') return '#fac858'
          return COLORS[idx % COLORS.length]
        },
        borderColor: (params) => {
          const v = values[params.dataIndex]
          if (v === null) return 'transparent'
          const s = getMetricStatus(metric, v)
          if (s === 'danger') return '#ee6666'
          if (s === 'warning') return '#fac858'
          return COLORS[idx % COLORS.length]
        },
        borderWidth: (params) => {
          const v = values[params.dataIndex]
          if (v === null) return 0
          const s = getMetricStatus(metric, v)
          return s === 'danger' || s === 'warning' ? 2 : 0
        }
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: COLORS[idx % COLORS.length] + '60' },
          { offset: 1, color: COLORS[idx % COLORS.length] + '05' }
        ])
      },
      connectNulls: false,
      data: values,
      emphasis: {
        focus: 'series'
      }
    }
  })

  const xLabelCount = xData.length
  const interval = xLabelCount > 15 ? Math.floor(xLabelCount / 8) : 0

  return {
    tooltip: {
      trigger: 'axis',
      confine: true,
      textStyle: { fontSize: 12 },
      axisPointer: { type: 'cross' }
    },
    legend: {
      type: 'scroll',
      bottom: 0,
      textStyle: { fontSize: 12 }
    },
    grid: {
      left: 50,
      right: 20,
      top: 15,
      bottom: 44
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: {
        fontSize: 11,
        interval,
        rotate: 0
      },
      axisLine: { lineStyle: { color: '#ddd' } },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } },
      axisLabel: { fontSize: 11 }
    },
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      { type: 'slider', bottom: 28, height: 16, borderColor: '#ddd', fillerColor: '#e6f0ff' }
    ],
    series
  }
}

function renderChart() {
  if (!chartInstance || !chartContainer.value) return
  if (props.loading || props.error || props.records.length === 0) {
    chartInstance.clear()
    return
  }
  const option = buildOption(props.records)
  chartInstance.setOption(option, true)
}

const stats = computed(() => {
  if (!props.records.length) return []
  const records = props.records
  return WATER_QUALITY_METRICS.map(metric => {
    const vals = records
      .map(r => r[metric.key])
      .filter(v => v !== null && v !== undefined && v !== '')
      .map(Number)
      .filter(v => !Number.isNaN(v))
    if (!vals.length) {
      return { key: metric.key, label: metric.label, max: null, min: null, avg: null }
    }
    const max = Math.max(...vals)
    const min = Math.min(...vals)
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    const fix = (v) => v.toFixed(metric.precision)
    return {
      key: metric.key,
      label: metric.label,
      max: fix(max),
      min: fix(min),
      avg: fix(avg)
    }
  })
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

watch(() => props.records, renderChart, { deep: true })
</script>

<style scoped>
.trend-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-container {
  width: 100%;
  height: 360px;
}

.stats-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stat-card {
  flex: 1;
  min-width: 100px;
  padding: 8px 12px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 6px;
}

.stat-label {
  font-size: 11px;
  color: #888;
  margin-bottom: 4px;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  font-size: 12px;
  line-height: 1.6;
}

.stat-value {
  font-weight: 500;
  color: #333;
}

.stat-tag {
  font-size: 10px;
  padding: 0 4px;
  border-radius: 3px;
  color: #fff;
}

.stat-tag.max { background: #ee6666; }
.stat-tag.min { background: #5470c6; }
.stat-tag.avg { background: #91cc75; }
</style>
