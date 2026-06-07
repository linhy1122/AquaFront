<template>
  <div class="content">
    <div class="page-header">
      <h1>报警管理中心</h1>
      <div class="breadcrumb">首页 / 业务管理 / 报警管理</div>
    </div>
    <div class="overview-cards">
      <div class="overview-card">
        <div class="overview-icon blue">🏞️</div>
        <div class="overview-info"><span class="overview-label">总塘口数</span><span class="overview-value">{{ overview.totalPonds }}</span></div>
      </div>
      <div class="overview-card">
        <div class="overview-icon green">⚙️</div>
        <div class="overview-info"><span class="overview-label">已配置阈值</span><span class="overview-value">{{ overview.configuredPonds }}</span></div>
      </div>
      <div class="overview-card">
        <div class="overview-icon red">🚨</div>
        <div class="overview-info"><span class="overview-label">当前报警</span><span class="overview-value alert">{{ overview.activeAlarms }}</span></div>
      </div>
      <div class="overview-card">
        <div class="overview-icon red">🔴</div>
        <div class="overview-info"><span class="overview-label">严重报警</span><span class="overview-value critical">{{ overview.criticalAlarms }}</span></div>
      </div>
      <div class="overview-card">
        <div class="overview-icon orange">🟡</div>
        <div class="overview-info"><span class="overview-label">预警</span><span class="overview-value warning">{{ overview.warningAlarms }}</span></div>
      </div>
      <div class="overview-card">
        <div class="overview-icon blue">📋</div>
        <div class="overview-info"><span class="overview-label">今日新增</span><span class="overview-value">{{ overview.todayAlarms }}</span></div>
      </div>
    </div>
    <div class="tabs">
      <div class="tab" :class="{ active: activeTab === 'threshold' }" @click="switchTab('threshold')">阈值设置</div>
      <div class="tab" :class="{ active: activeTab === 'records' }" @click="switchTab('records')">报警记录</div>
      <div class="tab" :class="{ active: activeTab === 'settings' }" @click="switchTab('settings')">报警设置</div>
    </div>
    <ThresholdTab v-if="activeTab === 'threshold'" />
    <AlarmRecordsTab v-if="activeTab === 'records'" />
    <AlarmSettingsTab v-if="activeTab === 'settings'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ThresholdTab from '../components/ThresholdTab.vue'
import AlarmRecordsTab from '../components/AlarmRecordsTab.vue'
import AlarmSettingsTab from '../components/AlarmSettingsTab.vue'
import { alarmApi } from '@/api/alarm'

const activeTab = ref('threshold')
const overview = ref({ totalPonds: 0, configuredPonds: 0, activeAlarms: 0, criticalAlarms: 0, warningAlarms: 0, todayAlarms: 0 })

const switchTab = (tabName) => { activeTab.value = tabName }

async function loadOverview() {
  try {
    const res = await alarmApi.getOverview()
    if (res.success) overview.value = res.data.overview
  } catch {}
}

onMounted(() => { loadOverview() })
</script>

<style scoped>
.overview-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; margin-bottom: 20px; }
.overview-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 10px; padding: 16px; display: flex; align-items: center; gap: 12px; }
.overview-icon { font-size: 24px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
.overview-icon.blue { background: #e6f7ff; }
.overview-icon.green { background: #f6ffed; }
.overview-icon.red { background: #fff2f0; }
.overview-icon.orange { background: #fffbe6; }
.overview-info { display: flex; flex-direction: column; }
.overview-label { font-size: 12px; color: #888; }
.overview-value { font-size: 22px; font-weight: 600; color: #333; }
.overview-value.alert, .overview-value.critical { color: #ff4d4f; }
.overview-value.warning { color: #faad14; }
</style>
