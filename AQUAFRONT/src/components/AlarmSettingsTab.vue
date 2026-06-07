<template>
  <div class="card">
    <div class="card-header">
      <h3>报警方式设置</h3>
      <div class="header-actions">
        <select v-model.number="currentPondId" class="pond-select">
          <option :value="null">选择塘口</option>
          <option v-for="p in pondList" :key="p.pondId" :value="p.pondId">{{ p.code || p.name }}</option>
        </select>
        <button class="btn btn-primary btn-sm" :disabled="!currentPondId" @click="saveSettings">保存设置</button>
      </div>
    </div>
    <div class="card-body">
      <div v-if="!currentPondId" class="empty-state">请先选择一个塘口</div>
      <form v-else class="settings-form">
        <div class="form-group">
          <label class="switch-row">
            <input type="checkbox" v-model="form.popupEnabled" :true-value="1" :false-value="0">
            <span class="switch-label">页面弹窗报警</span>
          </label>
          <p class="form-hint">超阈值时在页面弹出报警通知</p>
        </div>
        <div class="form-group">
          <label class="switch-row">
            <input type="checkbox" v-model="form.soundEnabled" :true-value="1" :false-value="0">
            <span class="switch-label">声音提醒</span>
          </label>
          <p class="form-hint">超阈值时播放报警提示音</p>
        </div>
        <div class="form-group">
          <label class="switch-row">
            <input type="checkbox" v-model="form.badgeEnabled" :true-value="1" :false-value="0">
            <span class="switch-label">角标提醒</span>
          </label>
          <p class="form-hint">在页面顶部通知铃铛显示未处理报警数量</p>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>静默时段开始</label>
            <input type="time" v-model="form.quietStart" class="form-input">
          </div>
          <div class="form-group">
            <label>静默时段结束</label>
            <input type="time" v-model="form.quietEnd" class="form-input">
          </div>
        </div>
        <div class="form-group">
          <label>重复提醒间隔（分钟，0 表示不重复）</label>
          <input type="number" v-model.number="form.repeatIntervalMinutes" min="0" max="1440" class="form-input short">
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { alarmApi } from '@/api/alarm'
import { pondApi } from '@/api'

defineOptions({ name: 'AlarmSettingsTab' })

const pondList = ref([])
const currentPondId = ref(null)
const form = ref({
  popupEnabled: 1, soundEnabled: 1, badgeEnabled: 1,
  quietStart: '', quietEnd: '', repeatIntervalMinutes: 10
})

watch(currentPondId, async (pondId) => {
  if (!pondId) return
  try {
    const res = await alarmApi.getSettings(pondId)
    if (res.success) {
      const records = res.data.records || []
      if (records.length) {
        const s = records[0]
        form.value = {
          popupEnabled: s.popupEnabled ?? 1,
          soundEnabled: s.soundEnabled ?? 1,
          badgeEnabled: s.badgeEnabled ?? 1,
          quietStart: s.quietStart || '',
          quietEnd: s.quietEnd || '',
          repeatIntervalMinutes: s.repeatIntervalMinutes ?? 10
        }
      } else {
        form.value = { popupEnabled: 1, soundEnabled: 1, badgeEnabled: 1, quietStart: '', quietEnd: '', repeatIntervalMinutes: 10 }
      }
    }
  } catch {}
})

async function saveSettings() {
  try {
    const res = await alarmApi.saveSettings({ pondId: currentPondId.value, ...form.value })
    if (res.success) {
      // saved
    }
  } catch {}
}

async function loadPonds() {
  try {
    const res = await pondApi.list({ page: 1, size: 100 })
    if (res.success) pondList.value = res.data.records || []
  } catch {}
}

onMounted(() => { loadPonds() })
</script>

<style scoped>
.header-actions { display: flex; gap: 8px; align-items: center; }
.pond-select { padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 6px; min-width: 160px; }
.settings-form { max-width: 500px; }
.form-group { margin-bottom: 20px; }
.switch-row { display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 500; }
.switch-label { font-size: 14px; }
.form-hint { font-size: 12px; color: #888; margin: 4px 0 0 24px; }
.form-row { display: flex; gap: 16px; }
.form-row .form-group { flex: 1; }
.form-input { padding: 8px 10px; border: 1px solid #d9d9d9; border-radius: 6px; }
.form-input.short { width: 120px; }
.form-group label { display: block; font-size: 13px; color: #555; margin-bottom: 4px; }
.empty-state { padding: 40px 16px; text-align: center; color: #888; }
</style>
