<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon green">✅</div>
      <div class="stat-info">
        <h4>运行中设备</h4>
        <div class="value">5</div>
        <div class="trend trend-up">正常</div>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon blue">⏸️</div>
      <div class="stat-info">
        <h4>待机设备</h4>
        <div class="value">3</div>
        <div class="trend">可启用</div>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon orange">🔧</div>
      <div class="stat-info">
        <h4>维护中设备</h4>
        <div class="value">1</div>
        <div class="trend">预计2天后</div>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon red">❌</div>
      <div class="stat-info">
        <h4>故障设备</h4>
        <div class="value">0</div>
        <div class="trend trend-up">良好</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'EquipmentStats' })
</script>