<template>
  <div v-if="error" class="alert alert-danger">{{ error }}</div>
  <div v-else-if="loading && !stats" class="empty-state">正在加载统计…</div>

  <template v-else-if="stats">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">📦</div>
        <div class="stat-info">
          <h4>今日投喂量(kg)</h4>
          <div class="value">{{ stats.todayTotal ?? '--' }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">📊</div>
        <div class="stat-info">
          <h4>本月累计(kg)</h4>
          <div class="value">{{ stats.monthTotal ?? '--' }}</div>
          <div class="trend">日均 {{ stats.dailyAvg ?? '--' }} kg</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">💰</div>
        <div class="stat-info">
          <h4>本月饲料费用(元)</h4>
          <div class="value">{{ stats.monthCost ?? '--' }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>各塘口投喂统计（本月）</h3>
      </div>
      <div class="card-body">
        <div v-if="!pondStats.length" class="empty-state">暂无投喂统计</div>
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>塘口</th>
                <th>投喂次数</th>
                <th>累计投喂量(kg)</th>
                <th>日均投喂(kg)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ps in pondStats" :key="ps.pondId">
                <td><strong>{{ displayPond(ps) }}</strong></td>
                <td>{{ ps.feedTimes }}</td>
                <td>{{ ps.totalAmount }}</td>
                <td>{{ ps.dailyAvg }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { computed, ref } from 'vue'
import { feedApi } from '@/api/feed'
import { usePolling } from '@/composables/usePolling'

defineOptions({ name: 'FeedingStatsTab' })

const data = ref(null)
const loading = ref(false)
const error = ref('')

async function loadStats() {
  loading.value = true
  error.value = ''
  try {
    const res = await feedApi.getStats()
    if (res.success) {
      data.value = res.data?.stats || null
    } else {
      error.value = res.message || '加载统计失败'
    }
  } catch (e) {
    error.value = e?.message || '加载统计失败'
  } finally {
    loading.value = false
  }
}

usePolling(loadStats, 10000)

const displayPond = (ps) => {
  if (ps.pondCode && ps.pondName) return `${ps.pondCode} ${ps.pondName}`
  if (ps.pondName) return ps.pondName
  return `塘口 ${ps.pondId}`
}

const stats = computed(() => data.value)
const pondStats = computed(() => {
  if (!data.value?.pondStats) return []
  return Array.isArray(data.value.pondStats) ? data.value.pondStats : []
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.stat-icon {
  font-size: 28px;
}

.stat-info h4 {
  margin: 0 0 4px;
  font-size: 13px;
  color: #888;
}

.stat-info .value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.trend {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.empty-state {
  padding: 24px 12px;
  text-align: center;
  color: #888;
}
</style>
