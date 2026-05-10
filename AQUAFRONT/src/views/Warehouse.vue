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
          <div class="value">{{ summary.totalStock?.toLocaleString() || '--' }}</div>
          <div class="trend" :class="(summary.stockGrowthRate || 0) >= 0 ? 'trend-up' : 'trend-down'">
            {{ (summary.stockGrowthRate || 0) >= 0 ? '↑' : '↓' }} 较上月{{ Math.abs(summary.stockGrowthRate || 0).toFixed(1) }}%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">🌾</div>
        <div class="stat-info">
          <h4>饲料库存(kg)</h4>
          <div class="value">{{ summary.feedStockKg?.toFixed(2) || '--' }}</div>
          <div class="trend">可用约{{ summary.feedAvailableDays || '--' }}天</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">📦</div>
        <div class="stat-info">
          <h4>饲料种类</h4>
          <div class="value">{{ feedCategoryCount }}</div>
          <div class="trend">当前库存种类</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon red">📉</div>
        <div class="stat-info">
          <h4>本月消耗饲料(kg)</h4>
          <div class="value">{{ summary.monthlyFeedConsumed?.toFixed(2) || '--' }}</div>
          <div class="trend">截止本月累计</div>
        </div>
      </div>
    </div>

    <!-- 饲料库存 -->
    <FeedStockCard />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { dashboardApi } from '../api'
import FeedStockCard from '../components/FeedStockCard.vue'

const summary = ref({})
const feedCategoryCount = computed(() => 4) // 静态值，后续可从接口获取

const fetchSummary = async () => {
  try {
    const res = await dashboardApi.getSummary()
    if (res.success) {
      summary.value = res.data
    }
  } catch (err) {
    console.error('获取概览数据失败:', err)
  }
}

onMounted(() => {
  fetchSummary()
})
</script>