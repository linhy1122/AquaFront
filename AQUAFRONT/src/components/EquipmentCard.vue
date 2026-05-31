<template>
  <div class="card fade-in">
    <div class="card-header">
      <h3>设备运行状态</h3>
      <router-link to="/equipment" class="btn btn-primary btn-sm">查看详情</router-link>
    </div>
    <div class="card-body">
      <div v-if="error" class="alert alert-danger">
        {{ error }}
        <button class="btn btn-primary btn-sm" style="margin-left: 8px;" @click="refreshLatest">重试</button>
      </div>

      <div v-if="loading && latestList.length === 0" class="empty-state">正在加载设备模拟数据…</div>

      <div v-else class="equipment-grid">
        <div v-for="item in previewList" :key="item.deviceId" class="equipment-card">
          <div class="equipment-header">
            <h4>{{ getDeviceTypeLabel(item.deviceType) }} · {{ item.deviceName }}</h4>
            <span :class="['badge', getDeviceStatusBadge(item.status)]">
              {{ getDeviceStatusLabel(item.status) }}
            </span>
          </div>
          <div class="equipment-status">
            <span class="status-dot" :class="item.status === 'on' ? 'online' : item.status === 'error' ? 'warning' : 'offline'"></span>
            <span>{{ item.pondName || `塘口 ${item.pondId}` }}</span>
          </div>
          <div>运行时长：{{ formatDeviceRuntime(item.runtimeMinutes) }}</div>
          <div>
            {{ runtimeLabel(item.deviceType) }}：{{ formatDeviceNumber(getMetricValue(item), 2) }}
            {{ runtimeUnit(item.deviceType) }}
          </div>
        </div>

        <div v-if="previewList.length === 0" class="empty-state">暂无设备数据</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDeviceRealtime } from '@/composables/useDeviceRealtime'
import {
  DEVICE_RUNTIME_LABELS,
  formatDeviceNumber,
  formatDeviceRuntime,
  getDeviceStatusBadge,
  getDeviceStatusLabel,
  getDeviceTypeLabel
} from '@/constants/device'

defineOptions({ name: 'EquipmentCard' })

const { latestList, loading, error, refreshLatest } = useDeviceRealtime()

const previewList = computed(() => (latestList.value || []).slice(0, 4))

const runtimeLabel = deviceType => DEVICE_RUNTIME_LABELS[deviceType] || '指标'

const runtimeUnit = deviceType => {
  if (deviceType === 'pump') {
    return 'm³/h'
  }
  if (deviceType === 'feeder') {
    return 'kg/h'
  }
  return 'kW'
}

const getMetricValue = item => {
  if (item.deviceType === 'pump') {
    return item.flowRate
  }
  if (item.deviceType === 'feeder') {
    return item.flowRate
  }
  return item.powerKw
}
</script>

<style scoped>
.empty-state {
  padding: 20px 0;
  color: #888;
  text-align: center;
}
</style>
