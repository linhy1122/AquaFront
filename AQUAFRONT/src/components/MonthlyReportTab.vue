<template>
  <div class="monthly-report">
    <div class="card">
      <div class="card-header">
        <h3>养殖月报</h3>
        <div class="header-actions">
          <input type="month" v-model="reportMonth" @change="loadReport" class="month-input">
          <select v-model.number="filterPondId" @change="loadReport">
            <option :value="null">全部塘口</option>
            <option v-for="p in pondList" :key="p.pondId" :value="p.pondId">{{ p.code || p.name }}</option>
          </select>
          <button class="btn btn-primary btn-sm" @click="loadReport">刷新</button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="loading" class="empty-state">正在加载月报…</div>
        <template v-else-if="report">
          <div class="kpi-grid">
            <div class="kpi-card"><span class="kpi-label">本月投喂量</span><span class="kpi-value">{{ report.summary.monthFeed }} kg</span></div>
            <div class="kpi-card"><span class="kpi-label">本月入库</span><span class="kpi-value">{{ report.summary.monthIn }} kg</span></div>
            <div class="kpi-card"><span class="kpi-label">本月出库</span><span class="kpi-value">{{ report.summary.monthOut }} kg</span></div>
            <div class="kpi-card"><span class="kpi-label">饲料成本</span><span class="kpi-value">¥{{ report.summary.monthFeedCost }}</span></div>
            <div class="kpi-card"><span class="kpi-label">额外成本</span><span class="kpi-value">¥{{ report.summary.monthExtraCost }}</span></div>
            <div class="kpi-card"><span class="kpi-label">总成本</span><span class="kpi-value">¥{{ report.summary.monthTotalCost }}</span></div>
            <div class="kpi-card"><span class="kpi-label">日均投喂</span><span class="kpi-value">{{ report.summary.dailyAvg?.toFixed(1) }} kg</span></div>
          </div>
          <div class="chart-row">
            <div class="chart-card full-width">
              <h4>每日投喂趋势</h4>
              <div ref="trendChartRef" class="chart-box"></div>
            </div>
          </div>
          <div class="chart-row">
            <div class="chart-card">
              <h4>塘口投喂排行</h4>
              <div ref="rankChartRef" class="chart-box"></div>
            </div>
            <div class="chart-card">
              <h4>月度成本构成</h4>
              <p class="chart-sub">投喂+入库+出库趋势</p>
              <div ref="costTrendRef" class="chart-box"></div>
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

defineOptions({ name: 'MonthlyReportTab' })

const reportMonth = ref(new Date().toISOString().slice(0, 7))
const filterPondId = ref(null)
const report = ref(null)
const loading = ref(false)
const error = ref('')
const pondList = ref([])

const trendChartRef = ref(null)
const rankChartRef = ref(null)
const costTrendRef = ref(null)
let trendChart = null, rankChart = null, costTrendChart = null
let resizeObs = null

function initAll() {
  trendChart = echarts.init(trendChartRef.value)
  rankChart = echarts.init(rankChartRef.value)
  costTrendChart = echarts.init(costTrendRef.value)
  const targets = [trendChartRef, rankChartRef, costTrendRef]
  resizeObs = new ResizeObserver(() => targets.forEach(t => t.value && echarts.getInstanceByDom(t.value)?.resize()))
  targets.forEach(t => resizeObs.observe(t.value))
}

function renderCharts() {
  if (!report.value) return
  nextTick(() => {
    if (!trendChart) initAll()

    if (report.value.dailyFeedTrend?.length) {
      trendChart?.setOption({
        tooltip: { trigger: 'axis', confine: true },
        grid: { left: 50, right: 20, top: 15, bottom: 30 },
        xAxis: { type: 'category', data: report.value.dailyFeedTrend.map(d => d.date.slice(8)), axisLabel: { fontSize: 10 } },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } } },
        toolbox: { feature: { saveAsImage: { title: '导出' } } },
        series: [{
          type: 'line', smooth: true, data: report.value.dailyFeedTrend.map(d => d.feedAmount),
          lineStyle: { color: '#5470c6', width: 2 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1, [{offset:0,color:'#5470c660'},{offset:1,color:'#5470c605'}]) },
          markLine: { silent: true, data: [{ type: 'average', name: '日均' }], lineStyle: { type: 'dashed', color: '#ee6666' } }
        }]
      }, true)
    }

    if (report.value.pondRank?.length) {
      const sorted = [...report.value.pondRank].sort((a, b) => a.feedAmount - b.feedAmount)
      rankChart?.setOption({
        tooltip: { trigger: 'axis', confine: true },
        grid: { left: 90, right: 30, top: 10, bottom: 10 },
        xAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } } },
        yAxis: { type: 'category', data: sorted.map(p => p.pondCode || p.pondName || `塘口 ${p.pondId}`), axisLabel: { fontSize: 11 } },
        toolbox: { feature: { saveAsImage: { title: '导出' } } },
        series: [{
          type: 'bar', data: sorted.map(p => p.feedAmount),
          itemStyle: { color: '#91cc75', borderRadius: [0, 4, 4, 0] },
          label: { show: true, position: 'right', fontSize: 10, formatter: p => `${p.value} kg` }
        }]
      }, true)
    }

    const s = report.value.summary
    costTrendChart?.setOption({
      tooltip: { trigger: 'axis', confine: true },
      grid: { left: 50, right: 20, top: 10, bottom: 30 },
      xAxis: { type: 'category', data: ['投喂成本', '入库量', '出库量'], axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } } },
      series: [
        { type: 'bar', barWidth: '25%', data: [s.monthFeedCost || 0, s.monthIn || 0, s.monthOut || 0],
          itemStyle: { color: params => ['#5470c6', '#91cc75', '#ee6666'][params.dataIndex], borderRadius: [4, 4, 0, 0] },
          label: { show: true, position: 'top', fontSize: 10 } }
      ]
    }, true)
  })
}

async function loadReport() {
  loading.value = true; error.value = ''
  try {
    const res = await reportApi.getMonthly({ month: reportMonth.value, pondId: filterPondId.value || undefined })
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
  resizeObs?.disconnect(); trendChart?.dispose(); rankChart?.dispose(); costTrendChart?.dispose()
})
</script>

<style scoped>
.header-actions { display: flex; gap: 8px; align-items: center; }
.month-input { padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 6px; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; }
.kpi-card { padding: 14px; background: #fafafa; border: 1px solid #eee; border-radius: 8px; text-align: center; }
.kpi-label { display: block; font-size: 12px; color: #888; margin-bottom: 4px; }
.kpi-value { font-size: 20px; font-weight: 600; color: #333; }
.chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.chart-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 8px; padding: 12px; }
.chart-card.full-width { grid-column: 1 / -1; }
.chart-card h4 { margin: 0 0 2px; font-size: 14px; color: #555; }
.chart-sub { margin: 0 0 8px; font-size: 11px; color: #999; }
.chart-box { width: 100%; height: 260px; }
.empty-state { padding: 40px 16px; text-align: center; color: #888; }
</style>
