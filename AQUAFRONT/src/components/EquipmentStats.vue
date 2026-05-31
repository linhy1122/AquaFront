<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon green">设备</div>
      <div class="stat-info">
        <h4>设备总数</h4>
        <div class="value">{{ summary.total }}</div>
        <div class="trend trend-up">实时同步</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon blue">运行</div>
      <div class="stat-info">
        <h4>运行中</h4>
        <div class="value">{{ summary.running }}</div>
        <div class="trend">状态 on</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon orange">待机</div>
      <div class="stat-info">
        <h4>待机中</h4>
        <div class="value">{{ summary.idle }}</div>
        <div class="trend">状态 off</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon red">故障</div>
      <div class="stat-info">
        <h4>故障设备</h4>
        <div class="value">{{ summary.fault }}</div>
        <div class="trend trend-up">状态 error</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDeviceRealtime } from '@/composables/useDeviceRealtime'

defineOptions({ name: 'EquipmentStats' })

const { latestList } = useDeviceRealtime()

const summary = computed(() => {
  const devices = latestList.value || []
  return {
    total: devices.length,
    running: devices.filter(item => item.status === 'on').length,
    idle: devices.filter(item => item.status === 'off').length,
    fault: devices.filter(item => item.status === 'error').length
  }
})
</script>
