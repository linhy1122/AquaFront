<template>
  <div class="card">
    <div class="card-header">
      <h3>投喂记录列表</h3>
      <div class="header-actions">
        <button class="btn btn-primary btn-sm" @click="loadRecords">刷新</button>
      </div>
    </div>
    <div class="card-body">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else-if="loading && records.length === 0" class="empty-state">正在加载投喂记录…</div>
      <div v-else-if="records.length === 0" class="empty-state">暂无投喂记录</div>
      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>塘口</th>
              <th>饲料</th>
              <th>计划量(kg)</th>
              <th>实际量(kg)</th>
              <th>投喂时间</th>
              <th>操作人</th>
              <th>状态</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in records" :key="r.logId">
              <td><strong>{{ displayPond(r) }}</strong></td>
              <td>{{ r.materialName || '-' }}</td>
              <td>{{ r.plannedAmount != null ? r.plannedAmount : '-' }}</td>
              <td>{{ r.actualAmount != null ? r.actualAmount : '-' }}</td>
              <td>{{ r.feedTime ? formatTime(r.feedTime) : '-' }}</td>
              <td>{{ r.operator || '-' }}</td>
              <td>
                <span :class="['badge', r.executeStatus === 'success' ? 'badge-success' : 'badge-secondary']">
                  {{ r.executeStatus === 'success' ? '成功' : r.executeStatus || '-' }}
                </span>
              </td>
              <td>{{ r.remark || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { feedApi } from '@/api/feed'
import { usePolling } from '@/composables/usePolling'

defineOptions({ name: 'FeedingRecordsTab' })

const records = ref([])
const loading = ref(false)
const error = ref('')

async function loadRecords() {
  loading.value = true
  error.value = ''
  try {
    const res = await feedApi.getFeedingLogs({ page: 1, size: 50 })
    if (res.success) {
      records.value = Array.isArray(res.data?.records) ? res.data.records : []
    } else {
      error.value = res.message || '加载失败'
    }
  } catch (e) {
    error.value = e?.message || '加载失败'
  } finally {
    loading.value = false
  }
}

usePolling(loadRecords, 10000)

const displayPond = (r) => {
  if (r.pondCode && r.pondName) return `${r.pondCode} ${r.pondName}`
  if (r.pondName) return r.pondName
  return `塘口 ${r.pondId}`
}

const formatTime = (t) => {
  if (!t) return '-'
  const d = new Date(t)
  return Number.isNaN(d.getTime()) ? t : d.toLocaleString('zh-CN', { hour12: false })
}
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  padding: 24px 12px;
  text-align: center;
  color: #888;
}
</style>
