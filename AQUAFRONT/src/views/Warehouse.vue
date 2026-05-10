<template>
  <div class="content">
    <div class="page-header">
      <h1>仓储管理</h1>
      <div class="breadcrumb">首页 / 仓储管理</div>
    </div>

    <!-- 库存概览 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">🐟</div>
        <div class="stat-info">
          <h4>存塘总量(尾)</h4>
          <div class="value">45,600</div>
          <div class="trend trend-up">↑ 较上月+2.7%</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">🌾</div>
        <div class="stat-info">
          <h4>饲料库存(kg)</h4>
          <div class="value">2,850</div>
          <div class="trend trend-down">↓ 可用约19天</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">💊</div>
        <div class="stat-info">
          <h4>药品库存(件)</h4>
          <div class="value">45</div>
          <div class="trend">充足</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon red">📉</div>
        <div class="stat-info">
          <h4>本月消耗饲料(kg)</h4>
          <div class="value">1,650</div>
          <div class="trend">日均55kg</div>
        </div>
      </div>
    </div>

    <!-- 放养记录 -->
    <StockRecordCard />

    <!-- 饲料库存 -->
    <FeedStockCard />
  </div>
</template>

<script setup>
import StockRecordCard from '../components/StockRecordCard.vue'
import FeedStockCard from '../components/FeedStockCard.vue'
</script>