<template>
  <div class="summary-bar">
    <div class="summary-left">
      <span class="pond-badge">{{ pondName }}</span>
      <span v-if="overallStatus" :class="['status-badge', statusClass]">{{ statusLabel }}</span>
    </div>
    <div class="summary-right">
      <span v-if="lastUpdatedAt" class="update-time">更新: {{ lastUpdatedAt }}</span>
      <span v-if="loading" class="polling-dot" title="轮询刷新中"></span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getOverallWaterQualityStatus, getStatusClass, getStatusLabel, formatWaterQualityTime } from '@/constants/waterQuality'

const props = defineProps({
  pondName: { type: String, default: '' },
  record: { type: Object, default: null },
  lastUpdatedAt: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

const overallStatus = computed(() => {
  if (!props.record) return null
  return getOverallWaterQualityStatus(props.record)
})

const statusClass = computed(() => overallStatus.value ? getStatusClass(overallStatus.value) : '')
const statusLabel = computed(() => overallStatus.value ? getStatusLabel(overallStatus.value) : '')
</script>

<style scoped>
.summary-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f8f9fa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 12px;
}

.summary-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.summary-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pond-badge {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.update-time {
  color: #888;
  font-size: 12px;
}

.polling-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #52c41a;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
