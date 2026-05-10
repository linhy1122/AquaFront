<template>
  <div class="card fade-in">
    <div class="card-header">
      <h3>水质监测实时数据</h3>
      <router-link to="/monitoring" class="btn btn-primary btn-sm">查看详情</router-link>
    </div>
    <div class="card-body">
      <div class="monitor-grid">
        <div class="monitor-card success">
          <h4>水温</h4>
          <div class="monitor-value">24.5</div>
          <div class="monitor-unit">°C</div>
          <div class="monitor-status">
            <span class="badge badge-success">正常</span>
          </div>
        </div>

        <div class="monitor-card success">
          <h4>pH值</h4>
          <div class="monitor-value">7.2</div>
          <div class="monitor-status">
            <span class="badge badge-success">正常</span>
          </div>
        </div>

        <div class="monitor-card warning">
          <h4>溶解氧</h4>
          <div class="monitor-value">4.8</div>
          <div class="monitor-unit">mg/L</div>
          <div class="monitor-status">
            <span class="badge badge-warning">偏低</span>
          </div>
        </div>

        <div class="monitor-card success">
          <h4>氨氮</h4>
          <div class="monitor-value">0.35</div>
          <div class="monitor-unit">mg/L</div>
          <div class="monitor-status">
            <span class="badge badge-success">正常</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'MonitorCard' })
</script>