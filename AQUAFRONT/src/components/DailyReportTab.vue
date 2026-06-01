<template>
  <div class="daily-report">
    <div class="card">
      <div class="card-header">
        <h3>养殖日报</h3>
        <div class="header-actions">
          <input type="date" v-model="reportDate" @change="loadReport" class="date-input">
          <select v-model.number="filterPondId" @change="loadReport">
            <option :value="null">全部塘口</option>
            <option v-for="p in pondList" :key="p.pondId" :value="p.pondId">{{ p.code || p.name }}</option>
          </select>
          <button class="btn btn-primary btn-sm" @click="loadReport">刷新</button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="loading" class="empty-state">正在加载报表…</div>
        <template v-else-if="report">
          <div class="kpi-grid">
            <div class="kpi-card"><span class="kpi-label">塘口总数</span><span class="kpi-value">{{ report.summary.pondTotal }}</span></div>
            <div class="kpi-card"><span class="kpi-label">活跃塘口</span><span class="kpi-value">{{ report.summary.activePonds }}</span></div>
            <div class="kpi-card"><span class="kpi-label">总放养量</span><span class="kpi-value">{{ report.summary.totalStock?.toLocaleString() }}</span></div>
            <div class="kpi-card"><span class="kpi-label">当前存塘</span><span class="kpi-value">{{ report.summary.totalCurrent?.toLocaleString() }}</span></div>
            <div class="kpi-card"><span class="kpi-label">今日投喂</span><span class="kpi-value">{{ report.summary.todayFeed }} kg</span></div>
            <div class="kpi-card"><span class="kpi-label">今日入库</span><span class="kpi-value">{{ report.summary.todayIn }} kg</span></div>
            <div class="kpi-card"><span class="kpi-label">今日出库</span><span class="kpi-value">{{ report.summary.todayOut }} kg</span></div>
            <div class="kpi-card"><span class="kpi-label">今日成本</span><span class="kpi-value">¥{{ report.summary.todayTotalCost }}</span></div>
          </div>
          <div class="chart-row">
            <div class="chart-card">
              <h4>各塘口存塘量</h4>
              <div ref="stockChartRef" class="chart-box"></div>
            </div>
            <div class="chart-card">
              <h4>各塘口存活率</h4>
              <div ref="survivalChartRef" class="chart-box"></div>
            </div>
          </div>
          <div class="chart-row">
            <div class="chart-card">
              <h4>今日成本构成</h4>
              <p class="chart-sub">饲料成本 vs 额外成本</p>
              <div ref="costChartRef" class="chart-box-sm"></div>
            </div>
            <div class="chart-card">
              <h4>今日仓储动态</h4>
              <p class="chart-sub">入库 vs 出库</p>
              <div ref="warehouseChartRef" class="chart-box-sm"></div>
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
import { CHART_COLORS, baseBarOption } from '@/composables/useReportChart'

defineOptions({ name: 'DailyReportTab' })

const reportDate = ref(new Date().toISOString().slice(0, 10))
const filterPondId = ref(null)
const report = ref(null)
const loading = ref(false)
const error = ref('')
const pondList = ref([])

const stockChartRef = ref(null)
const survivalChartRef = ref(null)
const costChartRef = ref(null)
const warehouseChartRef = ref(null)
let stockChart = null, survivalChart = null, costChart = null, warehouseChart = null
let resizeObs = null

function initAll() {
  stockChart = echarts.init(stockChartRef.value)
  survivalChart = echarts.init(survivalChartRef.value)
  costChart = echarts.init(costChartRef.value)
  warehouseChart = echarts.init(warehouseChartRef.value)
  const targets = [stockChartRef, survivalChartRef, costChartRef, warehouseChartRef]
  resizeObs = new ResizeObserver(() => targets.forEach(t => t.value && echarts.getInstanceByDom(t.value)?.resize()))
  targets.forEach(t => resizeObs.observe(t.value))
}

function renderCharts() {
  if (!report.value?.pondSeries?.length) return
  nextTick(() => {
    if (!stockChart) initAll()
    const ponds = report.value.pondSeries
    const labels = ponds.map(p => p.pondCode || p.pondName || `塘口 ${p.pondId}`)

    stockChart?.setOption(baseBarOption(labels, ponds.map(p => p.currentNum || 0), CHART_COLORS[0]), true)
    survivalChart?.setOption(baseBarOption(labels, ponds.map(p => p.survivalRate || 0), CHART_COLORS[1]), true)

    const s = report.value.summary
    costChart?.setOption({
      tooltip: { trigger: 'item', confine: true },
      series: [{
        type: 'pie', radius: ['40%', '65%'],
        data: [
          { value: s.todayFeedCost || 0, name: '饲料成本', itemStyle: { color: '#5470c6' } },
          { value: s.todayExtraCost || 0, name: '额外成本', itemStyle: { color: '#fac858' } }
        ],
        label: { formatter: '{b}: ¥{c}', fontSize: 11 }
      }]
    }, true)

    warehouseChart?.setOption({
      tooltip: { trigger: 'item', confine: true },
      series: [{
        type: 'pie', radius: ['40%', '65%'],
        data: [
          { value: s.todayIn || 0, name: '入库', itemStyle: { color: '#91cc75' } },
          { value: s.todayOut || 0, name: '出库', itemStyle: { color: '#ee6666' } }
        ],
        label: { formatter: '{b}: {c} kg', fontSize: 11 }
      }]
    }, true)
  })
}

async function loadReport() {
  loading.value = true; error.value = ''
  try {
    const res = await reportApi.getDaily({ date: reportDate.value, pondId: filterPondId.value || undefined })
    if (res.success) { report.value = res.data?.report || null; renderCharts() }
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

onMounted(() => { loadPonds(); loadReport() })
onBeforeUnmount(() => {
  resizeObs?.disconnect()
  stockChart?.dispose(); survivalChart?.dispose(); costChart?.dispose(); warehouseChart?.dispose()
})
</script>

<style scoped>
.header-actions { display: flex; gap: 8px; align-items: center; }
.date-input { padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 6px; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; }
.kpi-card { padding: 14px; background: #fafafa; border: 1px solid #eee; border-radius: 8px; text-align: center; }
.kpi-label { display: block; font-size: 12px; color: #888; margin-bottom: 4px; }
.kpi-value { font-size: 20px; font-weight: 600; color: #333; }
.chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.chart-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 8px; padding: 12px; }
.chart-card h4 { margin: 0 0 2px; font-size: 14px; color: #555; }
.chart-sub { margin: 0 0 8px; font-size: 11px; color: #999; }
.chart-box { width: 100%; height: 260px; }
.chart-box-sm { width: 100%; height: 220px; }
.empty-state { padding: 40px 16px; text-align: center; color: #888; }
</style>
