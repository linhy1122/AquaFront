<template>
  <div class="card">
    <div class="card-header">
      <h3>养殖月报 - 2026年4月</h3>
    </div>
    <div class="card-body">
      <div class="alert alert-info">
        <strong>统计周期：</strong>2026年4月1日 - 2026年4月14日
      </div>

      <h4 style="margin: 20px 0 10px 0;">一、生产概况</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">🐟</div>
          <div class="stat-info">
            <h4>月初存塘</h4>
            <div class="value">43,200</div>
            <div class="trend">尾</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">📊</div>
          <div class="stat-info">
            <h4>当前存塘</h4>
            <div class="value">45,600</div>
            <div class="trend trend-up">↑ 2,400尾</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'MonthlyReportTab' })
</script>