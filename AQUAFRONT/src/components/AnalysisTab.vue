<template>
  <div class="card">
    <div class="card-header">
      <h3>生长趋势分析</h3>
    </div>
    <div class="card-body">
      <div class="chart-container" style="background: #fafafa; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center; color: #666;">
          <div style="font-size: 60px; margin-bottom: 20px;">📈</div>
          <h4>鱼类生长曲线</h4>
          <p style="margin-top: 10px;">显示平均体重变化趋势</p>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3>成本收益分析</h3>
    </div>
    <div class="card-body">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">💰</div>
          <div class="stat-info">
            <h4>总投入成本</h4>
            <div class="value">11,030</div>
            <div class="trend">元/月</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">💵</div>
          <div class="stat-info">
            <h4>预计销售收入</h4>
            <div class="value">28,500</div>
            <div class="trend">元</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'AnalysisTab' })
</script>