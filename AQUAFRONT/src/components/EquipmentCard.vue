<template>
  <div class="card fade-in">
    <div class="card-header">
      <h3>设备运行状态</h3>
      <router-link to="/equipment" class="btn btn-primary btn-sm">查看详情</router-link>
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
          <div>运行时间：8小时30分</div>
          <div style="margin-top: 10px;">
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="equipment-card">
          <div class="equipment-header">
            <h4>⚡ 2号增氧机</h4>
            <span class="badge badge-info">待机</span>
          </div>
          <div class="equipment-status">
            <span class="status-dot online"></span>
            <span>在线</span>
          </div>
          <div>上次运行：昨天 14:20</div>
          <div style="margin-top: 10px;">
            <label class="switch">
              <input type="checkbox">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="equipment-card">
          <div class="equipment-header">
            <h4>💧 1号水泵</h4>
            <span class="badge badge-success">运行中</span>
          </div>
          <div class="equipment-status">
            <span class="status-dot online"></span>
            <span>在线</span>
          </div>
          <div>运行时间：3小时15分</div>
          <div style="margin-top: 10px;">
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'EquipmentCard' })
</script>