<template>
  <div class="card fade-in">
    <div class="card-header">
      <h3>水质监测实时数据</h3>
      <div class="header-actions">
        <span v-if="lastUpdatedAt" class="update-time">更新时间：{{ formatWaterQualityTime(lastUpdatedAt) }}</span>
        <router-link to="/monitoring" class="btn btn-primary btn-sm">查看详情</router-link>
      </div>
    </div>

    <div class="card-body">
      <div v-if="error" class="alert alert-danger">
        {{ error }}
        <button class="btn btn-primary btn-sm" style="margin-left: 8px;" @click="refreshLatest">重试</button>
      </div>

      <div v-if="loading && !latestPond" class="empty-state">正在加载水质模拟数据…</div>

      <template v-else-if="latestPond">
        <div class="monitor-meta">
          <div>
            <strong>{{ latestPond.pondName || '未知塘口' }}</strong>
            <span class="meta-tip">当前展示最新一条模拟记录</span>
          </div>
          <span :class="['badge', getStatusClass(getOverallWaterQualityStatus(latestPond))]">
            {{ getStatusLabel(getOverallWaterQualityStatus(latestPond)) }}
          </span>
        </div>

        <div class="monitor-grid">
          <div v-for="metric in compactMetrics" :key="metric.key" :class="['monitor-card', metric.status]">
            <h4>{{ metric.label }}</h4>
            <div class="monitor-value">{{ metric.value }}</div>
            <div v-if="metric.unit" class="monitor-unit">{{ metric.unit }}</div>
            <div class="monitor-status">
              <span :class="['badge', metric.badgeClass]">{{ metric.statusLabel }}</span>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="empty-state">暂无水质数据，请稍后再试。</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWaterQuality } from '@/composables/useWaterQuality'
import {
  WATER_QUALITY_METRICS,
  formatWaterQualityTime,
  formatWaterQualityValue,
  getMetricStatus,
  getOverallWaterQualityStatus,
  getStatusClass,
  getStatusLabel
} from '@/constants/waterQuality'

defineOptions({ name: 'MonitorCard' })

const {
  latestList,
  loading,
  error,
  lastUpdatedAt,
  refreshLatest
} = useWaterQuality()

const latestPond = computed(() => latestList.value[0] || null)

const compactMetrics = computed(() => {
  if (!latestPond.value) {
    return []
  }
  return WATER_QUALITY_METRICS.slice(0, 4).map(metric => {
    const status = getMetricStatus(metric, latestPond.value[metric.key])
    return {
      key: metric.key,
      label: metric.label,
      unit: metric.unit,
      value: formatWaterQualityValue(metric, latestPond.value[metric.key]),
      status,
      statusLabel: getStatusLabel(status),
      badgeClass: getStatusClass(status)
    }
  })
})
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.update-time {
  color: #666;
  font-size: 13px;
}

.monitor-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.empty-state {
  padding: 28px 16px;
  text-align: center;
  color: #888;
}
</style>
