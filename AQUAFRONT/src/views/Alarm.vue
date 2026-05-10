<template>
  <div class="content">
    <div class="page-header">
      <h1>报警管理中心</h1>
      <div class="breadcrumb">首页 / 业务管理 / 报警管理</div>
    </div>

    <!-- 标签页 -->
    <div class="tabs">
      <div class="tab active" @click="switchTab('threshold')">阈值设置</div>
      <div class="tab" @click="switchTab('records')">报警记录</div>
      <div class="tab" @click="switchTab('settings')">报警设置</div>
    </div>

    <!-- 阈值设置 -->
    <ThresholdTab v-show="activeTab === 'threshold'" />

    <!-- 报警记录 -->
    <AlarmRecordsTab v-show="activeTab === 'records'" />

    <!-- 报警设置 -->
    <AlarmSettingsTab v-show="activeTab === 'settings'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ThresholdTab from '../components/ThresholdTab.vue'
import AlarmRecordsTab from '../components/AlarmRecordsTab.vue'
import AlarmSettingsTab from '../components/AlarmSettingsTab.vue'

const activeTab = ref('threshold')

const switchTab = (tabName) => {
  activeTab.value = tabName
}
</script>