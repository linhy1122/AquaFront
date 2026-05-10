<template>
  <div class="card">
    <div class="card-header">
      <h3>放养数量记录</h3>
      <button class="btn btn-primary btn-sm" @click="openAddDialog">+ 新增记录</button>
    </div>
    <div class="card-body">
      <div class="toolbar">
        <div class="search-box">
          <select v-model="pondFilter.pondId" @change="fetchStockRecords">
            <option value="">全部塘口</option>
            <option v-for="p in pondList" :key="p.pondId" :value="p.pondId">{{ p.name }}</option>
          </select>
          <select v-model="pondFilter.species" @change="fetchStockRecords">
            <option value="">全部品种</option>
            <option v-for="s in speciesList" :key="s" :value="s">{{ s }}</option>
          </select>
          <button class="btn btn-primary btn-sm" @click="fetchStockRecords">查询</button>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>塘口</th>
              <th>品种</th>
              <th>放养数量(尾)</th>
              <th>放养日期</th>
              <th>平均规格(g/尾)</th>
              <th>存活率(%)</th>
              <th>当前数量(尾)</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="stockRecords.length === 0">
              <td colspan="9" style="text-align:center;padding:40px;color:#999;">暂无放养记录数据</td>
            </tr>
            <tr v-for="item in stockRecords" :key="item.batchId">
              <td>{{ item.pondName || '--' }}</td>
              <td>{{ item.species }}</td>
              <td>{{ item.stockCount?.toLocaleString() }}</td>
              <td>{{ item.stockDate }}</td>
              <td>{{ item.avgSpec ?? '--' }}</td>
              <td>{{ item.survivalRate ?? '--' }}</td>
              <td>{{ item.currentNum?.toLocaleString() || '--' }}</td>
              <td>
                <span :class="['badge', stkStatusBadge(item.status)]">{{ stkStatusLabel(item.status) }}</span>
              </td>
              <td>
                <button class="btn btn-primary btn-sm" @click="openEditDialog(item)">编辑</button>
                <button class="btn btn-danger btn-sm" @click="handleDelete(item.batchId)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="pagination" v-if="stkTotal > 0">
        <button :disabled="stkPage <= 1" @click="stkPage--; fetchStockRecords()">上一页</button>
        <span class="page-info">第 {{ stkPage }} / {{ stkTotalPages }} 页，共 {{ stkTotal }} 条</span>
        <button :disabled="stkPage >= stkTotalPages" @click="stkPage++; fetchStockRecords()">下一页</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3>放养统计汇总</h3>
    </div>
    <div class="card-body">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">🐟</div>
          <div class="stat-info">
            <h4>总放养量(尾)</h4>
            <div class="value">{{ stockingStat.totalStockingCount?.toLocaleString() || '--' }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">✅</div>
          <div class="stat-info">
            <h4>当前存塘(尾)</h4>
            <div class="value">{{ stockingStat.totalCurrentNum?.toLocaleString() || '--' }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">📊</div>
          <div class="stat-info">
            <h4>平均存活率</h4>
            <div class="value">{{ stockingStat.avgSurvivalRate ?? '--' }}%</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">⚖️</div>
          <div class="stat-info">
            <h4>总放养重量(kg)</h4>
            <div class="value">{{ stockingStat.totalWeight?.toLocaleString() || '--' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 新增/编辑弹窗 -->
  <div class="modal" :class="{ show: showDialog }">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEdit ? '编辑' : '新增' }}放养记录</h3>
        <span class="modal-close" @click="closeDialog">&times;</span>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label>塘口 ID <span style="color:red">*</span></label>
            <input type="number" v-model.number="form.pondId" placeholder="请输入塘口ID">
          </div>
          <div class="form-group">
            <label>品种 ID</label>
            <input type="number" v-model.number="form.breedId" placeholder="选填">
          </div>
          <div class="form-group">
            <label>品种名称 <span style="color:red">*</span></label>
            <input type="text" v-model="form.species" placeholder="请输入品种名称">
          </div>
          <div class="form-group">
            <label>放养数量(尾) <span style="color:red">*</span></label>
            <input type="number" v-model.number="form.stockCount" min="1" placeholder="请输入数量">
          </div>
          <div class="form-group">
            <label>当前数量(尾)</label>
            <input type="number" v-model.number="form.currentNum" min="1" placeholder="选填，默认等于放养数量">
          </div>
          <div class="form-group">
            <label>平均规格(g/尾)</label>
            <input type="number" v-model.number="form.avgSpec" step="0.1" placeholder="选填">
          </div>
          <div class="form-group">
            <label>存活率(%)</label>
            <input type="number" v-model.number="form.survivalRate" min="0" max="100" step="0.1" placeholder="0-100">
          </div>
          <div class="form-group">
            <label>放养日期 <span style="color:red">*</span></label>
            <input type="date" v-model="form.stockDate">
          </div>
          <div class="form-group">
            <label>状态</label>
            <select v-model="form.status">
              <option value="active">正常</option>
              <option value="completed">已完成</option>
              <option value="deleted">已删除</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" @click="closeDialog">取消</button>
        <button class="btn btn-primary" @click="handleSubmit" :disabled="submitting">
          {{ submitting ? '提交中...' : '确认' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { stockingApi, statisticApi, pondApi } from '../api'

defineOptions({ name: 'PondStockTab' })

// --- 放养记录列表 ---
const stkPage = ref(1)
const stkSize = ref(10)
const stkTotal = ref(0)
const stockRecords = ref([])
const submitting = ref(false)

const speciesList = ['南美白对虾', '草鱼', '鲤鱼', '鲢鱼', '鲫鱼', '罗非鱼']
const pondList = ref([])

const pondFilter = reactive({
  pondId: '',
  species: ''
})

const stkTotalPages = computed(() => Math.ceil(stkTotal.value / stkSize.value) || 1)

const stkStatusBadge = (status) => {
  const map = { active: 'badge-success', completed: 'badge-info', deleted: 'badge-danger' }
  return map[status] || 'badge-info'
}

const stkStatusLabel = (status) => {
  const map = { active: '正常', completed: '已完成', deleted: '已删除' }
  return map[status] || status
}

const fetchPondList = async () => {
  try {
    const res = await pondApi.list({ page: 1, size: 100 })
    if (res.success) {
      pondList.value = res.data.records || []
    }
  } catch (err) {
    console.error('获取塘口列表失败:', err)
  }
}

const fetchStockRecords = async () => {
  try {
    const params = {
      page: stkPage.value,
      size: stkSize.value
    }
    if (pondFilter.pondId) params.pondId = pondFilter.pondId
    if (pondFilter.species) params.species = pondFilter.species

    const res = await stockingApi.listByPond(params)
    if (res.success) {
      stockRecords.value = res.data.records || []
      stkTotal.value = res.data.total || 0
    }
  } catch (err) {
    console.error('获取放养记录失败:', err)
  }
}

// --- 放养统计 ---
const stockingStat = ref({})

const fetchStockingStat = async () => {
  try {
    const res = await statisticApi.getStockingStatistic()
    if (res.success) {
      stockingStat.value = res.data || {}
    }
  } catch (err) {
    console.error('获取放养统计失败:', err)
  }
}

// --- 弹窗新增/编辑 ---
const showDialog = ref(false)
const isEdit = ref(false)

const createDefaultForm = () => ({
  batchId: null,
  pondId: null,
  breedId: null,
  species: '',
  stockCount: null,
  currentNum: null,
  avgSpec: null,
  survivalRate: null,
  stockDate: '',
  status: 'active'
})

const form = reactive(createDefaultForm())

const resetForm = () => {
  form.batchId = null
  form.pondId = null
  form.breedId = null
  form.species = ''
  form.stockCount = null
  form.currentNum = null
  form.avgSpec = null
  form.survivalRate = null
  form.stockDate = ''
  form.status = 'active'
}

const openAddDialog = () => {
  isEdit.value = false
  resetForm()
  showDialog.value = true
}

const openEditDialog = (item) => {
  isEdit.value = true
  form.batchId = item.batchId
  form.pondId = item.pondId
  form.breedId = item.breedId || null
  form.species = item.species
  form.stockCount = item.stockCount
  form.currentNum = item.currentNum || null
  form.avgSpec = item.avgSpec || null
  form.survivalRate = item.survivalRate || null
  form.stockDate = item.stockDate
  form.status = item.status || 'active'
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const buildPayload = () => {
  const payload = {
    pondId: form.pondId,
    species: form.species,
    stockCount: form.stockCount,
    stockDate: form.stockDate
  }
  if (form.breedId) payload.breedId = form.breedId
  if (form.currentNum !== null && form.currentNum !== undefined) payload.currentNum = form.currentNum
  if (form.avgSpec !== null && form.avgSpec !== undefined) payload.avgSpec = form.avgSpec
  if (form.survivalRate !== null && form.survivalRate !== undefined) payload.survivalRate = form.survivalRate
  if (form.status) payload.status = form.status
  return payload
}

const handleSubmit = async () => {
  if (!form.pondId || !form.species || !form.stockCount || !form.stockDate) {
    alert('请填写所有必填字段（塘口ID、品种名称、放养数量、放养日期）')
    return
  }
  submitting.value = true
  try {
    const payload = buildPayload()
    let res
    if (isEdit.value) {
      payload.batchId = form.batchId
      res = await stockingApi.update(payload)
    } else {
      res = await stockingApi.add(payload)
    }
    if (res.success) {
      closeDialog()
      fetchStockRecords()
      fetchStockingStat()
    } else {
      alert(res.message || '操作失败')
    }
  } catch (err) {
    console.error('提交失败:', err)
    alert('请求失败: ' + (err.response?.data?.message || err.message || '未知错误'))
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (batchId) => {
  if (!confirm('确定要删除该放养记录吗？')) return
  try {
    const res = await stockingApi.delete(batchId)
    if (res.success) {
      fetchStockRecords()
      fetchStockingStat()
    } else {
      alert(res.message || '删除失败')
    }
  } catch (err) {
    alert('删除失败: ' + (err.message || '未知错误'))
  }
}

onMounted(() => {
  fetchPondList()
  fetchStockRecords()
  fetchStockingStat()
})
</script>