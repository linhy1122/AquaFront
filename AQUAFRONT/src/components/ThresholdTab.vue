<template>
  <div class="threshold-tab">
    <div class="overview-cards">
      <div class="stat-card"><span class="stat-label">总塘口数</span><span class="stat-value">{{ overview.totalPonds }}</span></div>
      <div class="stat-card"><span class="stat-label">已配置阈值</span><span class="stat-value">{{ overview.configuredPonds }}</span></div>
      <div class="stat-card"><span class="stat-label">当前报警</span><span class="stat-value status-alert">{{ overview.activeAlarms }}</span></div>
      <div class="stat-card"><span class="stat-label">严重报警</span><span class="stat-value status-critical">{{ overview.criticalAlarms }}</span></div>
      <div class="stat-card"><span class="stat-label">预警</span><span class="stat-value status-warning">{{ overview.warningAlarms }}</span></div>
      <div class="stat-card"><span class="stat-label">今日新增</span><span class="stat-value">{{ overview.todayAlarms }}</span></div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>水质报警阈值设置</h3>
        <div class="header-actions">
          <select v-model.number="currentPondId" @change="loadThresholds" class="pond-select">
            <option :value="null">选择塘口</option>
            <option v-for="p in pondList" :key="p.pondId" :value="p.pondId">{{ p.code || p.name }}</option>
          </select>
          <button class="btn btn-secondary btn-sm" :disabled="!currentPondId || !prevPondId" @click="copyFromPrev">复制上一塘口</button>
          <button class="btn btn-primary btn-sm" :disabled="!currentPondId" @click="saveThresholds">保存</button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="!currentPondId" class="empty-state">请先选择一个塘口</div>
        <template v-else>
          <table class="threshold-table" v-if="thresholdForm.length">
            <thead>
              <tr>
                <th>指标</th><th>下限值</th><th>上限值</th><th>当前值</th><th>状态</th><th>严重级别</th><th>启用</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in thresholdForm" :key="row.targetParam">
                <td><strong>{{ paramLabels[row.targetParam] || row.targetParam }}</strong></td>
                <td><input type="number" v-model.number="row.minValue" :step="paramSteps[row.targetParam]" class="threshold-input" placeholder="不设限"></td>
                <td><input type="number" v-model.number="row.maxValue" :step="paramSteps[row.targetParam]" class="threshold-input" placeholder="不设限"></td>
                <td>{{ row.currentValue ?? '-' }}</td>
                <td><span :class="'badge badge-' + statusMap[row.status]">{{ statusLabels[row.status] }}</span></td>
                <td>
                  <select v-model="row.severity" class="severity-select">
                    <option value="warning">预警</option>
                    <option value="critical">严重</option>
                  </select>
                </td>
                <td><input type="checkbox" v-model="row.enabled" :true-value="1" :false-value="0"></td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { alarmApi } from '@/api/alarm'
import { pondApi } from '@/api'

defineOptions({ name: 'ThresholdTab' })

const pondList = ref([])
const currentPondId = ref(null)
const prevPondId = ref(null)
const error = ref('')
const overview = reactive({ totalPonds: 0, configuredPonds: 0, activeAlarms: 0, criticalAlarms: 0, warningAlarms: 0, todayAlarms: 0 })
const thresholdForm = ref([])

const paramLabels = { temperature: '水温', ph: 'pH值', dissolvedOxygen: '溶解氧', ammoniaNitrogen: '氨氮', nitrite: '亚硝酸盐', transparency: '透明度' }
const paramSteps = { temperature: 0.1, ph: 0.1, dissolvedOxygen: 0.1, ammoniaNitrogen: 0.01, nitrite: 0.01, transparency: 0.5 }
const statusMap = { normal: 'success', warning: 'warning', critical: 'danger' }
const statusLabels = { normal: '正常', warning: '预警', critical: '严重' }

async function loadOverview() {
  try {
    const res = await alarmApi.getOverview()
    if (res.success) Object.assign(overview, res.data.overview)
  } catch {}
}

async function loadThresholds() {
  if (!currentPondId.value) { thresholdForm.value = []; return }
  try {
    const res = await alarmApi.getThresholds(currentPondId.value)
    if (res.success) {
      const records = res.data.records || []
      thresholdForm.value = records
        .filter(r => r.pondId === currentPondId.value)
        .map(r => ({
          pondId: currentPondId.value,
          targetParam: r.targetParam,
          minValue: r.minValue,
          maxValue: r.maxValue,
          currentValue: r.currentValue,
          status: r.status,
          severity: r.severity || 'warning',
          enabled: r.enabled != null ? r.enabled : 1
        }))
    }
  } catch (e) { error.value = e?.message || '加载阈值失败' }
}

async function saveThresholds() {
  if (!currentPondId.value) return
  try {
    const list = thresholdForm.value.map(r => ({
      pondId: currentPondId.value,
      targetParam: r.targetParam,
      minValue: r.minValue ?? null,
      maxValue: r.maxValue ?? null,
      severity: r.severity,
      enabled: r.enabled
    }))
    const res = await alarmApi.batchSaveThresholds(list)
    if (res.success) {
      prevPondId.value = currentPondId.value
      loadThresholds()
    }
  } catch (e) { error.value = e?.message || '保存失败' }
}

function copyFromPrev() {
  if (!prevPondId.value || !currentPondId.value) return
  thresholdForm.value.forEach(r => { r.pondId = currentPondId.value })
  saveThresholds()
}

async function loadPonds() {
  try {
    const res = await pondApi.list({ page: 1, size: 100 })
    if (res.success) pondList.value = res.data.records || []
  } catch {}
}

onMounted(() => { loadPonds(); loadOverview() })
</script>

<style scoped>
.overview-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; }
.stat-card { padding: 14px; background: #fafafa; border: 1px solid #eee; border-radius: 8px; text-align: center; }
.stat-label { display: block; font-size: 12px; color: #888; margin-bottom: 4px; }
.stat-value { font-size: 20px; font-weight: 600; color: #333; }
.stat-value.status-alert { color: #ff4d4f; }
.stat-value.status-critical { color: #ff4d4f; }
.stat-value.status-warning { color: #faad14; }
.header-actions { display: flex; gap: 8px; align-items: center; }
.pond-select { padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 6px; min-width: 160px; }
.threshold-table { width: 100%; border-collapse: collapse; }
.threshold-table th, .threshold-table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
.threshold-table th { background: #fafafa; color: #555; font-weight: 500; }
.threshold-table td { vertical-align: middle; }
.threshold-input { width: 100px; padding: 6px 8px; border: 1px solid #d9d9d9; border-radius: 4px; }
.severity-select { padding: 4px 6px; border: 1px solid #d9d9d9; border-radius: 4px; }
.empty-state { padding: 40px 16px; text-align: center; color: #888; }
</style>
