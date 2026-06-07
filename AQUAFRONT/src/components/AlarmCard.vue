<template>
  <div class="card fade-in">
    <div class="card-header">
      <h3>最近报警记录</h3>
      <router-link to="/alarm" class="btn btn-primary btn-sm">查看全部</router-link>
    </div>
    <div class="card-body">
      <div v-if="loading" class="empty-state">正在加载…</div>
      <div v-else-if="!records.length" class="empty-state">暂无报警记录</div>
      <div v-else class="alarm-list">
        <div v-for="r in records" :key="r.alarmId" :class="['alarm-item', r.severity === 'critical' ? 'critical' : 'warning']">
          <div class="alarm-header">
            <span class="alarm-title">{{ r.severity === 'critical' ? '🔴' : '🟡' }} {{ r.alarmValue || r.alarmItem }}</span>
            <span class="alarm-time">{{ formatTime(r.createdAt) }}</span>
          </div>
          <div class="alarm-desc">
            {{ r.pondName || '未知塘口' }} - 当前值: {{ r.currentValue }}
            <template v-if="r.thresholdMin != null"> | 下限: {{ r.thresholdMin }}</template>
            <template v-if="r.thresholdMax != null"> | 上限: {{ r.thresholdMax }}</template>
          </div>
          <div class="alarm-actions">
            <span :class="'badge badge-' + statusBadge(r.status)">{{ statusLabel(r.status) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { alarmApi } from '@/api/alarm'

defineOptions({ name: 'AlarmCard' })

const records = ref([])
const loading = ref(false)
let timer = null

function formatTime(t) { return t ? t.slice(0, 19).replace('T', ' ') : '-' }
function statusBadge(s) { return ({ unhandled: 'danger', processing: 'warning', handled: 'success', auto_recovered: 'info' })[s] || 'secondary' }
function statusLabel(s) { return ({ unhandled: '未处理', processing: '处理中', handled: '已处理', auto_recovered: '自动恢复' })[s] || s }

async function loadRecent() {
  loading.value = true
  try {
    const res = await alarmApi.getRecentRecords(5)
    if (res.success) records.value = res.data.records || []
  } catch {}
  finally { loading.value = false }
}

onMounted(() => { loadRecent(); timer = setInterval(loadRecent, 30000) })
onBeforeUnmount(() => { clearInterval(timer) })
</script>

<style scoped>
.alarm-list { display: flex; flex-direction: column; gap: 8px; }
.alarm-item { padding: 12px; border: 1px solid #f0f0f0; border-radius: 8px; }
.alarm-item.critical { border-left: 3px solid #ff4d4f; }
.alarm-item.warning { border-left: 3px solid #faad14; }
.alarm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.alarm-title { font-weight: 500; font-size: 13px; }
.alarm-time { font-size: 11px; color: #888; }
.alarm-desc { font-size: 12px; color: #666; margin-bottom: 6px; }
.alarm-actions { display: flex; gap: 6px; align-items: center; }
.empty-state { padding: 40px 16px; text-align: center; color: #888; }
</style>
