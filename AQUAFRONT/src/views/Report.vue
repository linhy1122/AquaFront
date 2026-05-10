<template>
  <div class="content">
    <div class="page-header">
      <h1>报表统计中心</h1>
      <div class="breadcrumb">首页 / 业务管理 / 报表统计</div>
    </div>

    <!-- 标签页 -->
    <div class="tabs">
      <div class="tab active" @click="switchTab('daily')">日报表</div>
      <div class="tab" @click="switchTab('monthly')">月报表</div>
      <div class="tab" @click="switchTab('analysis')">数据分析</div>
    </div>

    <!-- 日报表 -->
    <DailyReportTab v-show="activeTab === 'daily'" />

    <!-- 月报表 -->
    <MonthlyReportTab v-show="activeTab === 'monthly'" />

    <!-- 数据分析 -->
    <AnalysisTab v-show="activeTab === 'analysis'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DailyReportTab from '../components/DailyReportTab.vue'
import MonthlyReportTab from '../components/MonthlyReportTab.vue'
import AnalysisTab from '../components/AnalysisTab.vue'

const activeTab = ref('daily')

const switchTab = (tabName) => {
  activeTab.value = tabName
}
</script>