<template>
  <div class="card">
    <div class="card-header">
      <h3>养殖品种记录</h3>
      <button class="btn btn-primary btn-sm" @click="openAddDialog">+ 新增品种</button>
    </div>
    <div class="card-body">
      <div class="toolbar">
        <div class="search-box">
          <select v-model="searchPondId" @change="fetchRecords">
            <option value="">全部塘口</option>
            <option v-for="p in pondList" :key="p.pondId" :value="p.pondId">{{ p.name }}</option>
          </select>
          <input type="text" v-model="searchSpecies" placeholder="搜索品种名称..." @keyup.enter="fetchRecords">
          <button class="btn btn-primary btn-sm" @click="fetchRecords">查询</button>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>塘口</th>
              <th>养殖品种</th>
              <th>放养数量(尾)</th>
              <th>放养日期</th>
              <th>平均规格(g/尾)</th>
              <th>存活率(%)</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="records.length === 0">
              <td colspan="8" style="text-align:center;padding:40px;color:#999;">暂无养殖品种记录</td>
            </tr>
            <tr v-for="item in records" :key="item.batchId">
              <td>{{ item.pondName || '--' }}</td>
              <td><strong>{{ item.species }}</strong></td>
              <td>{{ item.stockCount?.toLocaleString() }}</td>
              <td>{{ item.stockDate }}</td>
              <td>{{ item.avgSpec ?? '--' }}</td>
              <td>{{ item.survivalRate ?? '--' }}</td>
              <td>
                <span :class="['badge', statusBadge(item.status)]">{{ statusLabel(item.status) }}</span>
              </td>
              <td>
                <button class="btn btn-primary btn-sm" @click="openEditDialog(item)">编辑</button>
                <button class="btn btn-danger btn-sm" @click="handleDelete(item.batchId)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" v-if="total > 0">
        <button :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
        <span class="page-info">第 {{ page }} / {{ totalPages }} 页，共 {{ total }} 条</span>
        <button :disabled="page >= totalPages" @click="changePage(page + 1)">下一页</button>
      </div>
    </div>
  </div>

  <!-- 新增/编辑弹窗 -->
  <div class="modal" :class="{ show: showDialog }">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEdit ? '编辑' : '新增' }}养殖品种记录</h3>
        <span class="modal-close" @click="closeDialog">&times;</span>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label>塘口 <span style="color:red">*</span></label>
            <select v-model.number="form.pondId">
              <option value="">请选择塘口</option>
              <option v-for="p in pondList" :key="p.pondId" :value="p.pondId">{{ p.name }}</option>
            </select>
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
            <label>放养日期 <span style="color:red">*</span></label>
            <input type="date" v-model="form.stockDate">
          </div>
          <div class="form-group">
            <label>平均规格(g/尾)</label>
            <input type="number" v-model.number="form.avgSpec" min="0" step="0.1" placeholder="选填">
          </div>
          <div class="form-group">
            <label>当前数量(尾)</label>
            <input type="number" v-model.number="form.currentNum" min="1" placeholder="选填，默认等于放养数量">
          </div>
          <div class="form-group">
            <label>存活率(%)</label>
            <input type="number" v-model.number="form.survivalRate" min="0" max="100" step="0.1" placeholder="0-100">
          </div>
          <div class="form-group">
            <label>品种 ID</label>
            <input type="number" v-model.number="form.breedId" placeholder="选填">
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
import { stockingApi, pondApi } from '../api'

defineOptions({ name: 'PondSpeciesTab' })

// --- 列表 ---
const page = ref(1)
const size = ref(10)
const total = ref(0)
const records = ref([])
const submitting = ref(false)
const searchPondId = ref('')
const searchSpecies = ref('')
const pondList = ref([])

const totalPages = computed(() => Math.ceil(total.value / size.value) || 1)

const statusBadge = (status) => {
  const map = { active: 'badge-success', completed: 'badge-info', deleted: 'badge-danger' }
  return map[status] || 'badge-info'
}

const statusLabel = (status) => {
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

const fetchRecords = async () => {
  try {
    const params = {
      page: page.value,
      size: size.value
    }
    if (searchPondId.value && searchPondId.value !== '') {
      params.pondId = Number(searchPondId.value)
    }
    if (searchSpecies.value && searchSpecies.value.trim() !== '') {
      params.species = searchSpecies.value.trim()
    }

    const res = await stockingApi.listByPond(params)
    if (res.success) {
      records.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      console.warn('后端返回失败:', res.message)
    }
  } catch (err) {
    console.error('获取养殖品种记录失败:', err)
    console.error('请求参数:', JSON.stringify(params))
  }
}

const changePage = (p) => {
  page.value = p
  fetchRecords()
}

// --- 弹窗 ---
const showDialog = ref(false)
const isEdit = ref(false)

const form = reactive({
  batchId: null,
  pondId: '',
  species: '',
  stockCount: null,
  currentNum: null,
  avgSpec: null,
  survivalRate: null,
  breedId: null,
  stockDate: '',
  status: 'active'
})

const resetForm = () => {
  form.batchId = null
  form.pondId = ''
  form.species = ''
  form.stockCount = null
  form.currentNum = null
  form.avgSpec = null
  form.survivalRate = null
  form.breedId = null
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
  form.pondId = item.pondId || ''
  form.species = item.species
  form.stockCount = item.stockCount
  form.currentNum = item.currentNum || null
  form.avgSpec = item.avgSpec || null
  form.survivalRate = item.survivalRate || null
  form.breedId = item.breedId || null
  form.stockDate = item.stockDate
  form.status = item.status || 'active'
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const handleSubmit = async () => {
  if (!form.pondId || !form.species || !form.stockCount || !form.stockDate) {
    alert('请填写所有必填字段（塘口、品种名称、放养数量、放养日期）')
    return
  }
  submitting.value = true
  try {
    const payload = {
      pondId: form.pondId,
      species: form.species,
      stockCount: form.stockCount,
      stockDate: form.stockDate
    }
    if (form.currentNum !== null && form.currentNum !== undefined) payload.currentNum = form.currentNum
    if (form.avgSpec !== null && form.avgSpec !== undefined) payload.avgSpec = form.avgSpec
    if (form.survivalRate !== null && form.survivalRate !== undefined) payload.survivalRate = form.survivalRate
    if (form.breedId) payload.breedId = form.breedId
    if (form.status) payload.status = form.status

    let res
    if (isEdit.value) {
      payload.batchId = form.batchId
      res = await stockingApi.update(payload)
    } else {
      res = await stockingApi.add(payload)
    }
    if (res.success) {
      closeDialog()
      fetchRecords()
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
  if (!confirm('确定要删除该养殖品种记录吗？')) return
  try {
    const res = await stockingApi.delete(batchId)
    if (res.success) {
      fetchRecords()
    } else {
      alert(res.message || '删除失败')
    }
  } catch (err) {
    alert('删除失败: ' + (err.message || '未知错误'))
  }
}

onMounted(() => {
  fetchPondList()
  fetchRecords()
})
</script>