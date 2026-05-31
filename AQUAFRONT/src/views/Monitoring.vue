<template>
  <div class="content">
    <div class="page-header">
      <h1>水质实时监测</h1>
      <div class="breadcrumb">首页 / 监测监控 / 水质监测</div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>实时水质数据</h3>
        <div class="monitor-toolbar">
          <span v-if="lastUpdatedAt" class="update-time">刷新时间：{{ formatWaterQualityTime(lastUpdatedAt) }}</span>
          <button class="btn btn-primary btn-sm" @click="refreshPage">刷新</button>
        </div>
      </div>

      <div class="card-body">
        <div v-if="error" class="alert alert-danger">
          {{ error }}
          <button class="btn btn-primary btn-sm" style="margin-left: 8px;" @click="refreshPage">重试</button>
        </div>

        <div v-if="loading && !selectedPond" class="empty-state">正在生成模拟水质数据…</div>

        <template v-else-if="selectedPond">
          <div class="monitor-meta">
            <div>
              <strong>{{ selectedPond.pondName || '未知塘口' }}</strong>
              <span class="meta-tip">可切换塘口查看对应历史模拟记录</span>
            </div>
            <select v-model.number="selectedPondId" class="pond-selector">
              <option v-for="item in latestList" :key="item.pondId" :value="item.pondId">
                {{ item.pondName || `塘口 ${item.pondId}` }}
              </option>
            </select>
          </div>

          <div class="monitor-grid">
            <div v-for="metric in metrics" :key="metric.key" :class="['monitor-card', metric.status]">
              <h4>{{ metric.label }}</h4>
              <div class="monitor-value">{{ metric.value }}</div>
              <div v-if="metric.unit" class="monitor-unit">{{ metric.unit }}</div>
              <div class="monitor-status">
                <span :class="['badge', metric.badgeClass]">{{ metric.statusLabel }}</span>
              </div>
              <div class="metric-tip">{{ metric.thresholdText }}</div>
            </div>
          </div>
        </template>

        <div v-else class="empty-state">暂无水质数据，请稍后再试。</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>最近监测历史</h3>
        <button class="btn btn-primary btn-sm" :disabled="!selectedPond" @click="refreshHistory">刷新历史</button>
      </div>
      <div class="card-body">
        <div v-if="historyError" class="alert alert-danger">{{ historyError }}</div>
        <div v-if="historyLoading && historyRecords.length === 0" class="empty-state">正在加载历史数据…</div>
        <div v-else-if="historyRecords.length === 0" class="empty-state">暂无历史记录</div>
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>时间</th>
                <th v-for="metric in metrics" :key="metric.key">{{ metric.label }}</th>
                <th>综合状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historyRecords" :key="`${item.pondId}-${item.recordedAt}`">
                <td>{{ formatWaterQualityTime(item.recordedAt) }}</td>
                <td v-for="metric in metrics" :key="metric.key">
                  {{ formatWaterQualityValue(metric, item[metric.key]) }}
                </td>
                <td>
                  <span :class="['badge', getStatusClass(getOverallWaterQualityStatus(item))]">
                    {{ getStatusLabel(getOverallWaterQualityStatus(item)) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ComparisonTable />
    <WaterStandardTable />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ComparisonTable from '../components/ComparisonTable.vue'
import WaterStandardTable from '../components/WaterStandardTable.vue'
import { useWaterQuality } from '@/composables/useWaterQuality'
import {
  WATER_QUALITY_METRICS,
  formatWaterQualityTime,
  formatWaterQualityValue,
  getMetricStatus,
  getOverallWaterQualityStatus,
  getStatusClass,
  getStatusLabel,
  metricThresholdText
} from '@/constants/waterQuality'

const {
  latestList,
  historyRecords,
  loading,
  historyLoading,
  error,
  historyError,
  lastUpdatedAt,
  refreshLatest,
  loadHistory
} = useWaterQuality()

const selectedPondId = ref(null)

watch(
  latestList,
  list => {
    if (!list.length) {
      selectedPondId.value = null
      return
    }
    const hasSelected = list.some(item => item.pondId === selectedPondId.value)
    if (!hasSelected) {
      selectedPondId.value = list[0].pondId
    }
  },
  { immediate: true }
)

watch(
  selectedPondId,
  pondId => {
    if (pondId) {
      loadHistory(pondId)
    }
  },
  { immediate: true }
)

watch(
  lastUpdatedAt,
  () => {
    if (selectedPondId.value) {
      loadHistory(selectedPondId.value)
    }
  }
)

const selectedPond = computed(() => {
  if (!selectedPondId.value) {
    return null
  }
  return latestList.value.find(item => item.pondId === selectedPondId.value) || null
})

const metrics = computed(() => {
  if (!selectedPond.value) {
    return []
  }
  return WATER_QUALITY_METRICS.map(metric => {
    const status = getMetricStatus(metric, selectedPond.value[metric.key])
    return {
      ...metric,
      status,
      value: formatWaterQualityValue(metric, selectedPond.value[metric.key]),
      statusLabel: getStatusLabel(status),
      badgeClass: getStatusClass(status),
      thresholdText: metricThresholdText(metric)
    }
  })
})

const refreshHistory = () => {
  if (selectedPondId.value) {
    loadHistory(selectedPondId.value)
  }
}

const refreshPage = () => {
  refreshLatest()
  refreshHistory()
}
</script>

<style scoped>
.monitor-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.update-time {
  color: #666;
  font-size: 14px;
}

.monitor-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #fafafa;
}

.meta-tip {
  display: block;
  margin-top: 4px;
  color: #888;
  font-size: 12px;
}

.pond-selector {
  min-width: 180px;
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: #fff;
}

.metric-tip {
  margin-top: 8px;
  color: #666;
  font-size: 12px;
}

.empty-state {
  padding: 28px 16px;
  text-align: center;
  color: #888;
}
</style>
