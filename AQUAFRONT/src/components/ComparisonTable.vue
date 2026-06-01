<template>
  <div class="card">
    <div class="card-header">
      <h3>各塘口水质对比</h3>
      <div class="header-actions">
        <select v-model.number="selectedPondId" class="pond-selector" :disabled="latestList.length === 0">
          <option v-for="item in latestList" :key="item.pondId" :value="item.pondId">
            {{ item.pondName || `塘口 ${item.pondId}` }}
          </option>
        </select>
        <button class="btn btn-primary btn-sm" @click="refreshLatest">刷新数据</button>
      </div>
    </div>

    <div class="card-body">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else-if="loading && latestList.length === 0" class="empty-state">正在加载最新水质数据…</div>
      <div v-else-if="latestList.length === 0" class="empty-state">暂无水质数据</div>
      <div v-else-if="!selectedPondData" class="empty-state">暂无该塘口数据</div>
      <div v-else>
        <WaterQualitySummaryBar
          :pond-name="selectedPondData.pondName || `塘口 ${selectedPondData.pondId}`"
          :record="selectedPondData"
          :last-updated-at="formatWaterQualityTime(selectedPondData.recordedAt)"
          :loading="loading"
        />
        <WaterQualityPondComparisonChart
          :pond-data="selectedPondData"
          :all-ponds-data="latestList"
          :loading="loading"
          :error="error"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import WaterQualitySummaryBar from './WaterQualitySummaryBar.vue'
import WaterQualityPondComparisonChart from './WaterQualityPondComparisonChart.vue'
import { useWaterQuality } from '@/composables/useWaterQuality'
import { formatWaterQualityTime } from '@/constants/waterQuality'

defineOptions({ name: 'ComparisonTable' })

const {
  latestList,
  loading,
  error,
  refreshLatest
} = useWaterQuality()

const selectedPondId = ref(null)

watch(
  latestList,
  list => {
    if (!list.length) {
      selectedPondId.value = null
      return
    }
    const hasSelected = list.some(item => item.pondId === selectedPondId.value)
    if (!hasSelected) {
      selectedPondId.value = list[0].pondId
    }
  },
  { immediate: true }
)

const selectedPondData = computed(() => {
  if (!selectedPondId.value || !latestList.value.length) return null
  return latestList.value.find(item => item.pondId === selectedPondId.value) || null
})
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pond-selector {
  min-width: 160px;
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: #fff;
  font-size: 13px;
}

.empty-state {
  padding: 24px 12px;
  text-align: center;
  color: #888;
}
</style>
