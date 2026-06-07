<template>
  <div class="card">
    <div class="card-header">
      <h3>报警记录列表</h3>
      <div class="header-actions">
        <select v-model.number="filterPond" class="filter-select">
          <option :value="null">全部塘口</option>
          <option v-for="p in pondList" :key="p.pondId" :value="p.pondId">{{ p.code || p.name }}</option>
        </select>
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option value="unhandled">未处理</option>
          <option value="processing">处理中</option>
          <option value="handled">已处理</option>
          <option value="auto_recovered">自动恢复</option>
        </select>
        <select v-model="filterSeverity" class="filter-select">
          <option value="">全部等级</option>
          <option value="warning">预警</option>
          <option value="critical">严重</option>
        </select>
        <button class="btn btn-primary btn-sm" @click="loadRecords">查询</button>
      </div>
    </div>
    <div class="card-body">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else-if="loading" class="empty-state">正在加载…</div>
      <template v-else>
        <div v-if="!records.length" class="empty-state">暂无报警记录</div>
        <div v-else class="record-list">
          <div v-for="r in records" :key="r.alarmId" :class="['record-item', 'severity-' + r.severity]">
            <div class="record-header">
              <span class="record-icon">{{ r.severity === 'critical' ? '🔴' : '🟡' }}</span>
              <span class="record-title">{{ r.alarmValue || r.alarmItem }}</span>
              <span class="record-time">{{ formatTime(r.createdAt) }}</span>
            </div>
            <div class="record-meta">
              <span class="meta-tag">{{ r.pondCode || r.pondName }}</span>
              <span class="meta-tag">当前值: {{ r.currentValue }}</span>
              <span v-if="r.thresholdMin != null" class="meta-tag">下限: {{ r.thresholdMin }}</span>
              <span v-if="r.thresholdMax != null" class="meta-tag">上限: {{ r.thresholdMax }}</span>
              <span class="meta-tag">触发 {{ r.triggerCount }} 次</span>
            </div>
            <div class="record-actions">
              <span :class="'badge badge-' + statusBadge(r.status)">{{ statusLabel(r.status) }}</span>
              <span v-if="r.severity === 'critical'" class="badge badge-danger">严重</span>
              <span v-else class="badge badge-warning">预警</span>
              <button v-if="r.status === 'unhandled' || r.status === 'processing'" class="btn btn-primary btn-sm" @click="showHandle(r)">处理</button>
              <button v-if="r.remark" class="btn btn-secondary btn-sm" @click="showRemark(r)">备注</button>
            </div>
          </div>
        </div>
        <div class="pagination" v-if="total > size">
          <button :disabled="page <= 1" @click="page--; loadRecords()">上一页</button>
          <span class="page-info">第 {{ page }} 页 / 共 {{ Math.ceil(total / size) }} 页</span>
          <button :disabled="page * size >= total" @click="page++; loadRecords()">下一页</button>
        </div>
      </template>
    </div>

    <div v-if="showHandleModal" class="modal-overlay" @click.self="showHandleModal = false">
      <div class="modal">
        <h4>处理报警</h4>
        <div class="form-group">
          <label>处理方式</label>
          <select v-model="handleForm.handleMethod" class="form-input">
            <option value="manual">手动处理</option>
            <option value="popup_ack">弹窗确认</option>
          </select>
        </div>
        <div class="form-group">
          <label>处理人</label>
          <input v-model="handleForm.handledBy" class="form-input" placeholder="输入处理人">
        </div>
        <div class="form-group">
          <label>备注</label>
          <textarea v-model="handleForm.remark" class="form-input" rows="2" placeholder="处理备注"></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showHandleModal = false">取消</button>
          <button class="btn btn-primary" @click="submitHandle">确认处理</button>
        </div>
      </div>
    </div>

    <div v-if="showRemarkModal" class="modal-overlay" @click.self="showRemarkModal = false">
      <div class="modal">
        <h4>备注详情</h4>
        <p>{{ remarkText }}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showRemarkModal = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { alarmApi } from '@/api/alarm'
import { pondApi } from '@/api'

defineOptions({ name: 'AlarmRecordsTab' })

const pondList = ref([])
const filterPond = ref(null)
const filterStatus = ref('')
const filterSeverity = ref('')
const records = ref([])
const loading = ref(false)
const error = ref('')
const page = ref(1)
const size = ref(20)
const total = ref(0)

const showHandleModal = ref(false)
const handleForm = ref({ handleMethod: 'manual', handledBy: '', remark: '' })
const currentAlarmId = ref(null)

const showRemarkModal = ref(false)
const remarkText = ref('')

function formatTime(t) { return t ? t.slice(0, 19).replace('T', ' ') : '-' }
function statusBadge(s) { return ({ unhandled: 'danger', processing: 'warning', handled: 'success', auto_recovered: 'info' })[s] || 'secondary' }
function statusLabel(s) { return ({ unhandled: '未处理', processing: '处理中', handled: '已处理', auto_recovered: '自动恢复' })[s] || s }

async function loadRecords() {
  loading.value = true; error.value = ''
  try {
    const res = await alarmApi.getRecords({ page: page.value, size: size.value, pondId: filterPond.value || undefined, status: filterStatus.value || undefined, severity: filterSeverity.value || undefined })
    if (res.success) { records.value = res.data.records || []; total.value = res.data.total || 0 }
    else { error.value = res.message || '加载失败' }
  } catch (e) { error.value = e?.message || '加载失败' }
  finally { loading.value = false }
}

function showHandle(r) {
  currentAlarmId.value = r.alarmId
  handleForm.value = { handleMethod: 'manual', handledBy: '', remark: '' }
  showHandleModal.value = true
}

async function submitHandle() {
  try {
    const res = await alarmApi.handleAlarm(currentAlarmId.value, handleForm.value)
    if (res.success) { showHandleModal.value = false; loadRecords() }
  } catch {}
}

function showRemark(r) {
  remarkText.value = r.remark
  showRemarkModal.value = true
}

async function loadPonds() {
  try {
    const res = await pondApi.list({ page: 1, size: 100 })
    if (res.success) pondList.value = res.data.records || []
  } catch {}
}

onMounted(() => { loadPonds(); loadRecords() })
</script>

<style scoped>
.header-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.filter-select { padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 6px; }
.record-list { display: flex; flex-direction: column; gap: 8px; }
.record-item { border: 1px solid #f0f0f0; border-radius: 8px; padding: 14px; }
.record-item.severity-critical { border-left: 4px solid #ff4d4f; }
.record-item.severity-warning { border-left: 4px solid #faad14; }
.record-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.record-icon { font-size: 16px; }
.record-title { font-weight: 500; flex: 1; font-size: 14px; }
.record-time { font-size: 12px; color: #888; white-space: nowrap; }
.record-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.meta-tag { font-size: 12px; color: #666; background: #f5f5f5; padding: 2px 8px; border-radius: 4px; }
.record-actions { display: flex; gap: 8px; align-items: center; }
.pagination { display: flex; gap: 12px; align-items: center; justify-content: center; margin-top: 20px; }
.page-info { font-size: 13px; color: #666; }
.empty-state { padding: 40px 16px; text-align: center; color: #888; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 12px; padding: 24px; width: 420px; max-width: 90vw; }
.modal h4 { margin: 0 0 16px; font-size: 16px; }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 13px; color: #555; margin-bottom: 4px; }
.form-input { width: 100%; padding: 8px 10px; border: 1px solid #d9d9d9; border-radius: 6px; box-sizing: border-box; }
</style>
