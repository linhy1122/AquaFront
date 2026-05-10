<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon blue">📦</div>
      <div class="stat-info">
        <h4>今日投喂量(kg)</h4>
        <div class="value">118</div>
        <div class="trend">计划: 119.5kg</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green">📊</div>
      <div class="stat-info">
        <h4>本月累计(kg)</h4>
        <div class="value">1,650</div>
        <div class="trend trend-up">日均55kg</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon orange">💰</div>
      <div class="stat-info">
        <h4>本月饲料费用(元)</h4>
        <div class="value">6,600</div>
        <div class="trend">约4元/kg</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon blue">📈</div>
      <div class="stat-info">
        <h4>饵料系数</h4>
        <div class="value">1.8</div>
        <div class="trend trend-up">正常范围</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3>各塘口投喂统计（本月）</h3>
    </div>
    <div class="card-body">
      <table>
        <thead>
          <tr>
            <th>塘口</th>
            <th>品种</th>
            <th>投喂次数</th>
            <th>累计投喂量(kg)</th>
            <th>日均投喂(kg)</th>
            <th>饲料费用(元)</th>
            <th>增重量(kg)</th>
            <th>饵料系数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1号塘口</strong></td>
            <td>草鱼</td>
            <td>56</td>
            <td>350</td>
            <td>11.7</td>
            <td>1,400</td>
            <td>195</td>
            <td>1.79</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'FeedingStatsTab' })
</script>