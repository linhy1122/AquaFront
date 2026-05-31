<template>
  <div class="card">
    <div class="card-header">
      <h3>各塘口水质对比</h3>
      <button class="btn btn-primary btn-sm" @click="refreshLatest">刷新数据</button>
    </div>

    <div class="card-body">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="loading && latestList.length === 0" class="empty-state">正在加载最新水质数据…</div>
      <div v-else-if="latestList.length === 0" class="empty-state">暂无水质数据</div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>塘口</th>
              <th v-for="metric in metrics" :key="metric.key">{{ metric.label }}({{ metric.unit || '-' }})</th>
              <th>综合状态</th>
              <th>更新时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in latestList" :key="item.pondId">
              <td><strong>{{ item.pondName || `塘口 ${item.pondId}` }}</strong></td>
              <td v-for="metric in metrics" :key="metric.key">
                {{ formatWaterQualityValue(metric, item[metric.key]) }}
              </td>
              <td>
                <span :class="['badge', getStatusClass(getOverallWaterQualityStatus(item))]">
                  {{ getStatusLabel(getOverallWaterQualityStatus(item)) }}
                </span>
              </td>
              <td>{{ formatWaterQualityTime(item.recordedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWaterQuality } from '@/composables/useWaterQuality'
import {
  WATER_QUALITY_METRICS,
  formatWaterQualityTime,
  formatWaterQualityValue,
  getOverallWaterQualityStatus,
  getStatusClass,
  getStatusLabel
} from '@/constants/waterQuality'

defineOptions({ name: 'ComparisonTable' })

const {
  latestList,
  loading,
  error,
  refreshLatest
} = useWaterQuality()

const metrics = WATER_QUALITY_METRICS
</script>

<style scoped>
.empty-state {
  padding: 24px 12px;
  text-align: center;
  color: #888;
}
</style>
