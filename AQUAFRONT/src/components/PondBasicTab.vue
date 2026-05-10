<template>
  <div class="card">
    <div class="card-header">
      <h3>塘口列表</h3>
      <button class="btn btn-primary btn-sm" @click="openAddDialog">+ 新增塘口</button>
    </div>
    <div class="card-body">
      <div class="toolbar">
        <div class="search-box">
          <input type="text" v-model="searchForm.name" placeholder="搜索塘口名称..." @keyup.enter="fetchPonds">
          <select v-model="searchForm.status" @change="fetchPonds">
            <option value="">全部状态</option>
            <option value="1">使用中</option>
            <option value="2">空闲</option>
            <option value="3">维修</option>
          </select>
          <button class="btn btn-primary btn-sm" @click="fetchPonds">查询</button>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>塘口编号</th>
              <th>塘口名称</th>
              <th>面积(亩)</th>
              <th>水深(m)</th>
              <th>水源类型</th>
              <th>当前状态</th>
              <th>负责人</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="ponds.length === 0">
              <td colspan="9" style="text-align:center;padding:40px;color:#999;">暂无塘口数据</td>
            </tr>
            <tr v-for="item in ponds" :key="item.pondId">
              <td>{{ item.code }}</td>
              <td><strong>{{ item.name }}</strong></td>
              <td>{{ item.area }}</td>
              <td>{{ item.depth ?? '--' }}</td>
              <td>{{ waterSourceLabel(item.waterSource) }}</td>
              <td>
                <span :class="['badge', statusBadge(item.status)]">{{ statusLabel(item.status) }}</span>
              </td>
              <td>{{ item.manager || '--' }}</td>
              <td>{{ item.createdAt?.slice(0, 10) }}</td>
              <td>
                <button class="btn btn-primary btn-sm" @click="openEditDialog(item)">编辑</button>
                <button class="btn btn-warning btn-sm" @click="handleViewDetail(item.pondId)">详情</button>
                <button class="btn btn-danger btn-sm" @click="handleDelete(item.pondId)">删除</button>
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

  <div class="card">
    <div class="card-header">
      <h3>塘口统计</h3>
    </div>
    <div class="card-body">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">🏞️</div>
          <div class="stat-info">
            <h4>塘口总数</h4>
            <div class="value">{{ pondStat.totalCount ?? '--' }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">✅</div>
          <div class="stat-info">
            <h4>使用中</h4>
            <div class="value">{{ pondStat.inUseCount ?? '--' }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">⏸️</div>
          <div class="stat-info">
            <h4>空闲</h4>
            <div class="value">{{ pondStat.idleCount ?? '--' }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">📏</div>
          <div class="stat-info">
            <h4>总面积(亩)</h4>
            <div class="value">{{ pondStat.totalArea ?? '--' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 新增/编辑弹窗 -->
  <div class="modal" :class="{ show: showDialog }">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEdit ? '编辑' : '新增' }}塘口</h3>
        <span class="modal-close" @click="closeDialog">&times;</span>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label>塘口编号 <span style="color:red">*</span></label>
            <input type="text" v-model="form.code" placeholder="例如：P004">
          </div>
          <div class="form-group">
            <label>塘口名称 <span style="color:red">*</span></label>
            <input type="text" v-model="form.name" placeholder="例如：4号罗非鱼塘">
          </div>
          <div class="form-group">
            <label>面积(亩) <span style="color:red">*</span></label>
            <input type="number" v-model.number="form.area" min="0" step="0.1" placeholder="请输入面积">
          </div>
          <div class="form-group">
            <label>水深(m)</label>
            <input type="number" v-model.number="form.depth" min="0" step="0.1" placeholder="选填">
          </div>
          <div class="form-group">
            <label>水源类型</label>
            <select v-model="form.waterSource">
              <option value="">请选择</option>
              <option value="1">地下水</option>
              <option value="2">地表水</option>
              <option value="3">海水</option>
            </select>
          </div>
          <div class="form-group">
            <label>位置/地址</label>
            <input type="text" v-model="form.location" placeholder="选填">
          </div>
          <div class="form-group">
            <label>状态</label>
            <select v-model="form.status">
              <option value="1">使用中</option>
              <option value="2">空闲</option>
              <option value="3">维修</option>
            </select>
          </div>
          <div class="form-group">
            <label>负责人</label>
            <input type="text" v-model="form.manager" placeholder="选填">
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

  <!-- 详情弹窗 -->
  <div class="modal" :class="{ show: showDetailDialog }">
    <div class="modal-content">
      <div class="modal-header">
        <h3>塘口详情</h3>
        <span class="modal-close" @click="showDetailDialog = false">&times;</span>
      </div>
      <div class="modal-body" v-if="detail">
        <div class="form-grid">
          <div class="form-group">
            <label>塘口编号</label>
            <div class="detail-value">{{ detail.code }}</div>
          </div>
          <div class="form-group">
            <label>塘口名称</label>
            <div class="detail-value">{{ detail.name }}</div>
          </div>
          <div class="form-group">
            <label>面积(亩)</label>
            <div class="detail-value">{{ detail.area }}</div>
          </div>
          <div class="form-group">
            <label>水深(m)</label>
            <div class="detail-value">{{ detail.depth ?? '--' }}</div>
          </div>
          <div class="form-group">
            <label>水源类型</label>
            <div class="detail-value">{{ waterSourceLabel(detail.waterSource) }}</div>
          </div>
          <div class="form-group">
            <label>位置</label>
            <div class="detail-value">{{ detail.location || '--' }}</div>
          </div>
          <div class="form-group">
            <label>状态</label>
            <div class="detail-value">
              <span :class="['badge', statusBadge(detail.status)]">{{ statusLabel(detail.status) }}</span>
            </div>
          </div>
          <div class="form-group">
            <label>负责人</label>
            <div class="detail-value">{{ detail.manager || '--' }}</div>
          </div>
          <div class="form-group">
            <label>创建时间</label>
            <div class="detail-value">{{ detail.createdAt || '--' }}</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" @click="showDetailDialog = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { pondApi, statisticApi } from '../api'

defineOptions({ name: 'PondBasicTab' })

// --- 列表 ---
const page = ref(1)
const size = ref(10)
const total = ref(0)
const ponds = ref([])
const submitting = ref(false)

const searchForm = reactive({
  name: '',
  status: ''
})

const totalPages = computed(() => Math.ceil(total.value / size.value) || 1)

const waterSourceLabel = (val) => {
  const map = { '1': '地下水', '2': '地表水', '3': '海水' }
  return map[val] || val || '--'
}

const statusBadge = (val) => {
  const map = { '1': 'badge-success', '2': 'badge-warning', '3': 'badge-danger' }
  return map[val] || 'badge-info'
}

const statusLabel = (val) => {
  const map = { '1': '使用中', '2': '空闲', '3': '维修' }
  return map[val] || val || '--'
}

const fetchPonds = async () => {
  try {
    const res = await pondApi.list({
      page: page.value,
      size: size.value,
      name: searchForm.name || undefined,
      status: searchForm.status || undefined
    })
    if (res.success) {
      ponds.value = res.data.records || []
      total.value = res.data.total || 0
    }
  } catch (err) {
    console.error('获取塘口列表失败:', err)
  }
}

const changePage = (p) => {
  page.value = p
  fetchPonds()
}

// --- 统计 ---
const pondStat = ref({})

const fetchStatistic = async () => {
  try {
    const res = await statisticApi.getPondStatistic()
    if (res.success) {
      pondStat.value = res.data || {}
    }
  } catch (err) {
    console.error('获取塘口统计失败:', err)
  }
}

// --- 弹窗 ---
const showDialog = ref(false)
const showDetailDialog = ref(false)
const isEdit = ref(false)
const detail = ref(null)

const createDefaultForm = () => ({
  pondId: null,
  code: '',
  name: '',
  area: null,
  depth: null,
  waterSource: '',
  location: '',
  status: '1',
  manager: ''
})

const form = reactive(createDefaultForm())

const resetForm = () => {
  form.pondId = null
  form.code = ''
  form.name = ''
  form.area = null
  form.depth = null
  form.waterSource = ''
  form.location = ''
  form.status = '1'
  form.manager = ''
}

const openAddDialog = () => {
  isEdit.value = false
  resetForm()
  showDialog.value = true
}

const openEditDialog = (item) => {
  isEdit.value = true
  form.pondId = item.pondId
  form.code = item.code
  form.name = item.name
  form.area = item.area
  form.depth = item.depth || null
  form.waterSource = item.waterSource || ''
  form.location = item.location || ''
  form.status = item.status || '1'
  form.manager = item.manager || ''
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const handleSubmit = async () => {
  if (!form.code || !form.name || !form.area) {
    alert('请填写所有必填字段（编号、名称、面积）')
    return
  }
  submitting.value = true
  try {
    const payload = {
      code: form.code,
      name: form.name,
      area: form.area
    }
    if (form.depth !== null && form.depth !== undefined && form.depth !== '') payload.depth = form.depth
    if (form.waterSource) payload.waterSource = form.waterSource
    if (form.location) payload.location = form.location
    if (form.status) payload.status = form.status
    if (form.manager) payload.manager = form.manager

    let res
    if (isEdit.value) {
      payload.pondId = form.pondId
      res = await pondApi.update(payload)
    } else {
      res = await pondApi.add(payload)
    }
    if (res.success) {
      closeDialog()
      fetchPonds()
      fetchStatistic()
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

const handleViewDetail = async (pondId) => {
  try {
    const res = await pondApi.getDetail(pondId)
    if (res.success) {
      detail.value = res.data.pond
      showDetailDialog.value = true
    } else {
      alert(res.message || '获取详情失败')
    }
  } catch (err) {
    alert('获取详情失败: ' + (err.message || '未知错误'))
  }
}

const handleDelete = async (pondId) => {
  if (!confirm('确定要删除该塘口吗？')) return
  try {
    const res = await pondApi.delete(pondId)
    if (res.success) {
      fetchPonds()
      fetchStatistic()
    } else {
      alert(res.message || '删除失败')
    }
  } catch (err) {
    alert('删除失败: ' + (err.message || '未知错误'))
  }
}

onMounted(() => {
  fetchPonds()
  fetchStatistic()
})
</script>

<style scoped>
.detail-value {
  padding: 12px 15px;
  background: #fafafa;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  min-height: 42px;
  display: flex;
  align-items: center;
}
</style>