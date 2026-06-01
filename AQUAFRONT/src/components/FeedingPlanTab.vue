<template>
  <div class="plan-section">
    <div class="card">
      <div class="card-header">
        <h3>自动投喂计划</h3>
        <div class="header-actions">
          <button class="btn btn-primary btn-sm" :disabled="!hasExecutable" @click="handleExecuteAll">全部执行</button>
          <button class="btn btn-default btn-sm" @click="handleGenerate">重新计算</button>
          <button class="btn btn-default btn-sm" @click="loadPlans">刷新</button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="loading && plans.length === 0" class="empty-state">正在加载投喂计划…</div>
        <div v-else-if="plans.length === 0" class="empty-state">暂无投喂计划，请点击"重新计算"生成</div>
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>塘口</th>
                <th>养殖品种</th>
                <th>存塘量(尾)</th>
                <th>存塘重量(kg)</th>
                <th>投喂率(%)</th>
                <th>建议投喂量(kg)</th>
                <th>饲料</th>
                <th>状态</th>
                <th>说明</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plan in plans" :key="plan.planId">
                <td><strong>{{ displayPond(plan) }}</strong></td>
                <td>{{ getFactor(plan, 'species') }}</td>
                <td>{{ getFactor(plan, 'currentNum') }}</td>
                <td>{{ plan.stockWeight ?? getFactor(plan, 'biomassKg') }}</td>
                <td>{{ plan.feedRate != null ? (plan.feedRate).toFixed(1) : '-' }}</td>
                <td><strong>{{ plan.suggestedAmount }}</strong></td>
                <td>{{ plan.materialName || '-' }}</td>
                <td>
                  <span :class="['badge', statusBadge(plan.status)]">{{ statusLabel(plan.status) }}</span>
                </td>
                <td style="max-width:160px;font-size:12px;color:#888;">{{ plan.calcReason || '-' }}</td>
                <td>
                  <button
                    v-if="plan.status === 'pending'"
                    class="btn btn-success btn-sm"
                    @click="handleExecute(plan.planId)"
                  >执行</button>
                  <button
                    v-if="plan.status === 'pending'"
                    class="btn btn-warning btn-sm"
                    @click="handleCancel(plan.planId)"
                  >作废</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { feedApi } from '@/api/feed'
import { usePolling } from '@/composables/usePolling'

defineOptions({ name: 'FeedingPlanTab' })

const plans = ref([])
const loading = ref(false)
const error = ref('')

async function loadPlans() {
  loading.value = true
  error.value = ''
  try {
    const res = await feedApi.getPlans()
    if (res.success) {
      plans.value = Array.isArray(res.data?.plans) ? res.data.plans : []
    } else {
      error.value = res.message || '加载失败'
    }
  } catch (e) {
    error.value = e?.message || '加载失败'
  } finally {
    loading.value = false
  }
}

usePolling(loadPlans, 10000)

const hasExecutable = computed(() =>
  plans.value.some(p => p.status === 'pending' && p.suggestedAmount > 0)
)

const handleGenerate = async () => {
  try {
    const res = await feedApi.generatePlans()
    if (res.success) {
      plans.value = Array.isArray(res.data?.plans) ? res.data.plans : []
    } else {
      error.value = res.message || '重新计算失败'
    }
  } catch (e) {
    error.value = e?.message || '重新计算失败'
  }
}

const handleExecute = async (id) => {
  if (!confirm('确认执行该投喂计划？')) return
  const res = await feedApi.executePlan(id)
  if (res.success) {
    await loadPlans()
  } else {
    alert(res.message || '执行失败')
  }
}

const handleExecuteAll = async () => {
  if (!confirm('确认执行全部待执行计划？')) return
  const res = await feedApi.executeAllPlans()
  if (res.success) {
    alert(`已执行 ${res.data?.executedCount || 0} 条计划`)
    await loadPlans()
  } else {
    alert(res.message || '批量执行失败')
  }
}

const handleCancel = async (id) => {
  if (!confirm('确认作废该计划？')) return
  const res = await feedApi.cancelPlan(id)
  if (res.success) {
    await loadPlans()
  } else {
    alert(res.message || '作废失败')
  }
}

function displayPond(plan) {
  if (plan.pondCode && plan.pondName) return `${plan.pondCode} ${plan.pondName}`
  if (plan.pondName) return plan.pondName
  return `塘口 ${plan.pondId}`
}

function parseFactors(plan) {
  if (!plan.factorsJson) return {}
  try {
    const raw = plan.factorsJson
      .replace(/[{}]/g, '')
      .split(',')
      .reduce((acc, pair) => {
        const parts = pair.split('=')
        if (parts.length === 2) {
          acc[parts[0].trim()] = parts[1].trim()
        }
        return acc
      }, {})
    return raw
  } catch { return {} }
}

function getFactor(plan, key) {
  const f = parseFactors(plan)
  return f[key] || '-'
}

const statusBadge = (s) => {
  if (s === 'pending') return 'badge-warning'
  if (s === 'executed') return 'badge-success'
  if (s === 'cancelled') return 'badge-secondary'
  if (s === 'no_batch') return 'badge-secondary'
  if (s === 'data_missing') return 'badge-danger'
  if (s === 'no_feed') return 'badge-info'
  return 'badge-secondary'
}

const statusLabel = (s) => {
  if (s === 'pending') return '待执行'
  if (s === 'executed') return '已执行'
  if (s === 'cancelled') return '已作废'
  if (s === 'no_batch') return '无批次'
  if (s === 'data_missing') return '数据缺失'
  if (s === 'no_feed') return '无饲料'
  return s || '-'
}
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  padding: 24px 12px;
  text-align: center;
  color: #888;
}
</style>
