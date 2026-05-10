<template>
  <div class="content">
    <div class="page-header">
      <h1>水质实时监测</h1>
      <div class="breadcrumb">首页 / 监测监控 / 水质监测</div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>实时水质数据</h3>
        <div>
          <span style="color: #666; font-size: 14px;">更新时间：2026-04-14 09:30:15</span>
          <button class="btn btn-primary btn-sm" style="margin-left: 10px;" @click="refreshData">🔄 刷新</button>
        </div>
      </div>
      <div class="card-body">
        <div class="monitor-grid">
          <div class="monitor-card success">
            <h4>🌡️ 水温</h4>
            <div class="monitor-value">24.5</div>
            <div class="monitor-unit">°C</div>
            <div class="monitor-status">
              <span class="badge badge-success">正常 (20-28°C)</span>
            </div>
          </div>

          <div class="monitor-card success">
            <h4>💧 pH值</h4>
            <div class="monitor-value">7.2</div>
            <div class="monitor-status">
              <span class="badge badge-success">正常 (6.5-8.5)</span>
            </div>
          </div>

          <div class="monitor-card warning">
            <h4>💨 溶解氧</h4>
            <div class="monitor-value">4.8</div>
            <div class="monitor-unit">mg/L</div>
            <div class="monitor-status">
              <span class="badge badge-warning">偏低 (≥5.0)</span>
            </div>
          </div>

          <div class="monitor-card success">
            <h4>⚗️ 氨氮</h4>
            <div class="monitor-value">0.35</div>
            <div class="monitor-unit">mg/L</div>
            <div class="monitor-status">
              <span class="badge badge-success">正常 (≤0.5)</span>
            </div>
          </div>

          <div class="monitor-card success">
            <h4>🧪 亚硝酸盐</h4>
            <div class="monitor-value">0.08</div>
            <div class="monitor-unit">mg/L</div>
            <div class="monitor-status">
              <span class="badge badge-success">正常 (≤0.1)</span>
            </div>
          </div>

          <div class="monitor-card success">
            <h4>🔬 透明度</h4>
            <div class="monitor-value">35</div>
            <div class="monitor-unit">cm</div>
            <div class="monitor-status">
              <span class="badge badge-success">正常 (30-40)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ComparisonTable />
    <WaterStandardTable />
  </div>
</template>

<script setup>
import ComparisonTable from '../components/ComparisonTable.vue'
import WaterStandardTable from '../components/WaterStandardTable.vue'

const refreshData = () => {
  alert('正在获取最新数据...')
}
</script>