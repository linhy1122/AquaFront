<template>
  <div class="card">
    <div class="card-header">
      <h3>⚡ 增氧机状态</h3>
      <button class="btn btn-primary btn-sm">+ 添加设备</button>
    </div>
    <div class="card-body">
      <div class="equipment-grid">
        <div class="equipment-card">
          <div class="equipment-header">
            <h4>⚡ 1号增氧机</h4>
            <span class="badge badge-success">运行中</span>
          </div>
          <div class="equipment-status">
            <span class="status-dot online"></span>
            <span>在线</span>
          </div>
          <div style="margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 14px; color: #666;">运行时长</span>
              <span style="font-weight: 500;">8小时30分</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-size: 14px; color: #666;">功率</span>
              <span style="font-weight: 500;">3.5 kW</span>
            </div>
          </div>
          <div style="margin-top: 15px; display: flex; gap: 10px; align-items: center;">
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider"></span>
            </label>
            <button class="btn btn-warning btn-sm" style="margin-left: auto;">运行日志</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'AeratorCard' })
</script>