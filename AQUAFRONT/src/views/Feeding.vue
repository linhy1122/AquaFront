<template>
  <div class="content">
    <div class="page-header">
      <h1>投喂管理中心</h1>
      <div class="breadcrumb">首页 / 业务管理 / 投喂管理</div>
    </div>

    <!-- 标签页 -->
    <div class="tabs">
      <div class="tab active" @click="switchTab('records')">投喂记录</div>
      <div class="tab" @click="switchTab('plan')">投喂计划</div>
      <div class="tab" @click="switchTab('statistics')">投喂统计</div>
    </div>

    <!-- 投喂记录 -->
    <FeedingRecordsTab v-show="activeTab === 'records'" />

    <!-- 投喂计划 -->
    <FeedingPlanTab v-show="activeTab === 'plan'" />

    <!-- 投喂统计 -->
    <FeedingStatsTab v-show="activeTab === 'statistics'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FeedingRecordsTab from '../components/FeedingRecordsTab.vue'
import FeedingPlanTab from '../components/FeedingPlanTab.vue'
import FeedingStatsTab from '../components/FeedingStatsTab.vue'

const activeTab = ref('records')

const switchTab = (tabName) => {
  activeTab.value = tabName
}
</script>