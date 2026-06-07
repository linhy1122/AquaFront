<template>
  <div class="analysis-report">
    <div class="card">
      <div class="card-header">
        <h3>数据分析</h3>
        <div class="header-actions">
          <select v-model="range" @change="loadReport" class="range-select">
            <option value="30d">近30天</option>
            <option value="90d">近90天</option>
          </select>
          <select v-model.number="filterPondId" @change="loadReport">
            <option :value="null">全部塘口</option>
            <option v-for="p in pondList" :key="p.pondId" :value="p.pondId">{{ p.code || p.name }}</option>
          </select>
          <button class="btn btn-primary btn-sm" @click="loadReport">刷新</button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="loading" class="empty-state">正在加载分析…</div>
        <template v-else-if="report">
          <div class="chart-row">
            <div class="chart-card full-width">
              <h4>鱼塘健康雷达图</h4>
              <p class="chart-sub">存塘量 / 成活率 / 平均规格 / 投喂效率 / 收益率</p>
              <div ref="radarRef" class="chart-box-lg"></div>
            </div>
          </div>

          <div class="chart-row">
            <div class="chart-card">
              <h4>收益-成本散点图</h4>
              <p class="chart-sub">每个点代表一个塘口</p>
              <div ref="scatterRef" class="chart-box"></div>
            </div>
            <div class="chart-card">
              <h4>塘口效率排名</h4>
              <p class="chart-sub">按单位投喂产出排序</p>
              <div ref="rankRef" class="chart-box"></div>
            </div>
          </div>

          <div v-if="report.conclusions?.length" class="conclusions-section">
            <h4>分析结论</h4>
            <div class="conclusion-list">
              <div v-for="(c, i) in report.conclusions" :key="i" :class="['conclusion-item', c.type]">
                <span class="conclusion-icon">{{ c.type === 'danger' ? '⚠️' : c.type === 'warning' ? '⚡' : '💡' }}</span>
                <span>{{ c.message }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount, onMounted } from 'vue'
import * as echarts from 'echarts'
import { reportApi } from '@/api/report'
import { pondApi } from '@/api'
import { CHART_COLORS } from '@/composables/useReportChart'

defineOptions({ name: 'AnalysisTab' })

const range = ref('30d')
const filterPondId = ref(null)
const report = ref(null)
const loading = ref(false)
const error = ref('')
const pondList = ref([])

const radarRef = ref(null)
const scatterRef = ref(null)
const rankRef = ref(null)
let radarChart = null, scatterChart = null, rankChart = null
let isActive = false

function initCharts() {
  radarChart = echarts.init(radarRef.value)
  scatterChart = echarts.init(scatterRef.value)
  rankChart = echarts.init(rankRef.value)
  const ro = new ResizeObserver(() => {
    radarChart?.resize(); scatterChart?.resize(); rankChart?.resize()
  })
  ro.observe(radarRef.value); ro.observe(scatterRef.value); ro.observe(rankRef.value)
  return ro
}

let resizeObs = null

function allChartRefsReady() {
  return [radarRef, scatterRef, rankRef].every(r => r.value && r.value.isConnected && r.value.clientWidth > 0 && r.value.clientHeight > 0)
}

function renderRadar(data) {
  if (!data?.length) { radarChart?.clear(); return }
  const indicator = [
    { name: '存塘量', max: 100 }, { name: '成活率', max: 100 },
    { name: '平均规格', max: 100 }, { name: '投喂效率', max: 100 },
    { name: '收益率', max: 100 }
  ]
  const maxVals = {
    currentNum: Math.max(...data.map(d => d.currentNum || 0), 1),
    survivalRate: 100,
    avgSpec: Math.max(...data.map(d => d.avgSpec || 0), 1),
    feedAmount: Math.max(...data.map(d => d.feedAmount || 0), 1)
  }
  const series = data.map((d, i) => ({
    value: [
      Math.round((d.currentNum || 0) / maxVals.currentNum * 100),
      d.survivalRate || 0,
      Math.round((d.avgSpec || 0) / maxVals.avgSpec * 100),
      d.feedCost > 0 ? Math.round(Math.min((d.feedAmount || 0) / d.feedCost * 50, 100)) : 0,
      d.expProfit != null ? Math.round(Math.max(0, Math.min(d.expProfit / Math.max(d.feedCost + d.extraCost, 1) * 100, 100))) : 0
    ],
    name: d.pondName || `塘口 ${d.pondId}`,
    lineStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
    areaStyle: { color: CHART_COLORS[i % CHART_COLORS.length] + '30' }
  }))
  radarChart?.setOption({
    tooltip: { confine: true },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    radar: { indicator, center: ['50%', '45%'], radius: '60%', name: { textStyle: { fontSize: 11 } } },
    series: [{ type: 'radar', data: series, symbolSize: 4 }]
  }, true)
}

function renderScatter(data) {
  if (!data?.length) { scatterChart?.clear(); return }
  const scData = data.filter(d => d.feedCost != null && d.expProfit != null)
  scatterChart?.setOption({
    tooltip: {
      confine: true,
      formatter(p) {
        const d = scData[p.dataIndex]; if (!d) return ''
        return `${d.pondName}<br/>成本: ¥${d.feedCost + (d.extraCost || 0)}<br/>收益: ¥${d.expRevenue || '-'}<br/>利润: ¥${d.expProfit}`
      }
    },
    grid: { left: 50, right: 20, top: 10, bottom: 30 },
    xAxis: { type: 'value', name: '总成本(元)', nameTextStyle: { fontSize: 10 }, splitLine: { show: false } },
    yAxis: { type: 'value', name: '预计利润(元)', nameTextStyle: { fontSize: 10 }, splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } } },
    series: [{
      type: 'scatter', symbolSize: 14,
      data: scData.map(d => [(d.feedCost || 0) + (d.extraCost || 0), d.expProfit || 0]),
      itemStyle: { color: params => (scData[params.dataIndex]?.expProfit || 0) >= 0 ? '#91cc75' : '#ee6666' },
      label: { show: true, formatter: p => scData[p.dataIndex]?.pondName || '', fontSize: 10, position: 'right' }
    }],
    toolbox: { feature: { saveAsImage: { title: '导出' } } }
  }, true)
}

function renderRank(data) {
  if (!data?.length) { rankChart?.clear(); return }
  const sorted = [...data].sort((a, b) => {
    const ae = a.expProfit != null && a.feedCost > 0 ? a.expProfit / a.feedCost : 0
    const be = b.expProfit != null && b.feedCost > 0 ? b.expProfit / b.feedCost : 0
    return ae - be
  })
  rankChart?.setOption({
    tooltip: { confine: true, formatter: p => {
      const d = sorted[p.dataIndex]; if (!d) return ''
      const ratio = d.feedCost > 0 ? ((d.expProfit || 0) / d.feedCost * 100).toFixed(1) : '-'
      return `${d.pondName}<br/>利润率: ${ratio}%<br/>利润: ¥${d.expProfit || 0}`
    } },
    grid: { left: 90, right: 30, top: 10, bottom: 10 },
    xAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } } },
    yAxis: { type: 'category', data: sorted.map(d => d.pondName || `塘口 ${d.pondId}`), axisLabel: { fontSize: 11 } },
    toolbox: { feature: { saveAsImage: { title: '导出' } } },
    series: [{
      type: 'bar', data: sorted.map(d => {
        const ratio = d.feedCost > 0 ? Math.round(d.expProfit / d.feedCost * 100) : 0
        return { value: d.expProfit || 0, itemStyle: { color: ratio >= 0 ? '#91cc75' : '#ee6666', borderRadius: [0, 4, 4, 0] } }
      }), label: { show: true, position: 'right', fontSize: 10, formatter: p => `¥${p.value}` }
    }]
  }, true)
}

function renderCharts() {
  if (!report.value) return
  nextTick(() => {
    if (!isActive) return
    if (!radarChart) {
      if (!allChartRefsReady()) {
        requestAnimationFrame(() => { if (isActive) renderCharts() })
        return
      }
      resizeObs = initCharts()
    }
    renderRadar(report.value.pondRadar)
    renderScatter(report.value.pondRadar)
    renderRank(report.value.pondRadar)
  })
}

async function loadReport() {
  loading.value = true; error.value = ''
  try {
    const res = await reportApi.getAnalysis({ range: range.value, pondId: filterPondId.value || undefined })
    if (res.success) { report.value = res.data?.report || null; if (isActive) renderCharts() }
    else { error.value = res.message || '加载失败' }
  } catch (e) { error.value = e?.message || '加载失败' }
  finally { loading.value = false }
}

async function loadPonds() {
  try {
    const res = await pondApi.list({ page: 1, size: 100 })
    if (res.success) pondList.value = res.data.records || []
  } catch {}
}

onMounted(() => { isActive = true; loadPonds(); loadReport() })
onBeforeUnmount(() => {
  isActive = false
  resizeObs?.disconnect(); radarChart?.dispose(); scatterChart?.dispose(); rankChart?.dispose()
})
</script>

<style scoped>
.header-actions { display: flex; gap: 8px; align-items: center; }
.range-select { padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 6px; }
.chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.chart-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 8px; padding: 12px; }
.chart-card.full-width { grid-column: 1 / -1; }
.chart-card h4 { margin: 0 0 2px; font-size: 14px; color: #555; }
.chart-sub { margin: 0 0 8px; font-size: 11px; color: #999; }
.chart-box { width: 100%; height: 260px; }
.chart-box-lg { width: 100%; height: 320px; }
.empty-state { padding: 40px 16px; text-align: center; color: #888; }
.conclusions-section { margin-top: 16px; }
.conclusions-section h4 { font-size: 14px; color: #555; margin-bottom: 8px; }
.conclusion-list { display: flex; flex-direction: column; gap: 6px; }
.conclusion-item { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 6px; font-size: 13px; }
.conclusion-item.danger { background: #fff2f0; border: 1px solid #ffccc7; color: #cf1322; }
.conclusion-item.warning { background: #fffbe6; border: 1px solid #ffe58f; color: #d48806; }
.conclusion-item.info { background: #e6f7ff; border: 1px solid #91d5ff; color: #096dd9; }
.conclusion-icon { font-size: 16px; }
</style>
