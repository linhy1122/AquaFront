<template>
  <div class="content">
    <div class="page-header">
      <h1>设备监控中心</h1>
      <div class="breadcrumb">首页 / 监测监控 / 设备监控</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon green">总</div>
        <div class="stat-info">
          <h4>设备总数</h4>
          <div class="value">{{ realtimeSummary.total }}</div>
          <div class="trend trend-up">30秒自动刷新</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">运</div>
        <div class="stat-info">
          <h4>运行中</h4>
          <div class="value">{{ realtimeSummary.running }}</div>
          <div class="trend">状态 on</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">待</div>
        <div class="stat-info">
          <h4>待机中</h4>
          <div class="value">{{ realtimeSummary.idle }}</div>
          <div class="trend">状态 off</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">故</div>
        <div class="stat-info">
          <h4>故障设备</h4>
          <div class="value">{{ realtimeSummary.fault }}</div>
          <div class="trend trend-up">状态 error</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>设备列表管理</h3>
        <div class="toolbar-actions">
          <span v-if="lastUpdatedAt" class="update-time">最新同步：{{ formatDeviceTime(lastUpdatedAt) }}</span>
          <button class="btn btn-primary btn-sm" @click="refreshAll">刷新</button>
          <button class="btn btn-primary btn-sm" @click="openAddDialog">单个新增</button>
          <button class="btn btn-primary btn-sm" @click="openBatchDialog">批量新增</button>
        </div>
      </div>

      <div class="card-body">
        <div v-if="error" class="alert alert-danger">
          {{ error }}
          <button class="btn btn-primary btn-sm" style="margin-left: 8px;" @click="refreshAll">重试</button>
        </div>

        <div class="toolbar">
          <div class="search-box">
            <select v-model="searchForm.pondId" @change="handleSearch">
              <option value="">全部塘口</option>
              <option v-for="pond in pondList" :key="pond.pondId" :value="pond.pondId">
                {{ pond.name }}
              </option>
            </select>
            <select v-model="searchForm.deviceType" @change="handleSearch">
              <option value="">全部类型</option>
              <option v-for="item in deviceTypeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
            <select v-model="searchForm.status" @change="handleSearch">
              <option value="">全部状态</option>
              <option v-for="item in statusOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
            <input
              type="text"
              v-model="searchForm.keyword"
              placeholder="搜索设备名称/类型..."
              @keyup.enter="handleSearch"
            >
            <button class="btn btn-primary btn-sm" @click="handleSearch">查询</button>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>设备名称</th>
                <th>塘口</th>
                <th>类型</th>
                <th>状态</th>
                <th>运行时长</th>
                <th>功率(kW)</th>
                <th>流量/投喂量</th>
                <th>更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="deviceRecords.length === 0">
                <td colspan="9" style="text-align:center;padding:40px;color:#999;">暂无设备数据</td>
              </tr>
              <tr v-for="item in deviceRecords" :key="item.deviceId">
                <td><strong>{{ item.deviceName }}</strong></td>
                <td>{{ item.pondName || '--' }}</td>
                <td>{{ getDeviceTypeLabel(item.deviceType) }}</td>
                <td>
                  <span :class="['badge', getDeviceStatusBadge(item.status)]">
                    {{ getDeviceStatusLabel(item.status) }}
                  </span>
                </td>
                <td>{{ formatDeviceRuntime(item.runtimeMinutes) }}</td>
                <td>{{ formatDeviceNumber(item.powerKw, 2) }}</td>
                <td>{{ formatDeviceNumber(item.flowRate, 2) }}</td>
                <td>{{ formatDeviceTime(item.lastUpdate) }}</td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="openEditDialog(item)">编辑</button>
                  <button class="btn btn-warning btn-sm" @click="toggleDeviceStatus(item)">
                    {{ item.status === 'on' ? '停用' : '启用' }}
                  </button>
                  <button class="btn btn-danger btn-sm" @click="handleDelete(item.deviceId)">删除</button>
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
        <h3>塘口设备运行日志</h3>
        <div class="toolbar-actions">
          <select v-model="historyPondId" class="pond-selector">
            <option value="">请选择塘口</option>
            <option v-for="pond in pondList" :key="pond.pondId" :value="pond.pondId">
              {{ pond.name }}
            </option>
          </select>
          <button class="btn btn-primary btn-sm" :disabled="!historyPondId" @click="refreshHistory">刷新日志</button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="historyError" class="alert alert-danger">
          {{ historyError }}
          <button class="btn btn-primary btn-sm" style="margin-left: 8px;" @click="refreshHistory">重试</button>
        </div>

        <div v-if="historyLoading && historyRecords.length === 0" class="empty-state">正在加载设备日志…</div>
        <div v-else-if="historyRecords.length === 0" class="empty-state">暂无运行日志</div>

        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>时间</th>
                <th>设备</th>
                <th>类型</th>
                <th>状态</th>
                <th>运行时长</th>
                <th>功率(kW)</th>
                <th>流量/投喂量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historyRecords" :key="item.logId">
                <td>{{ formatDeviceTime(item.recordedAt) }}</td>
                <td>{{ item.deviceName }}</td>
                <td>{{ getDeviceTypeLabel(item.deviceType) }}</td>
                <td>
                  <span :class="['badge', getDeviceStatusBadge(item.status)]">
                    {{ getDeviceStatusLabel(item.status) }}
                  </span>
                </td>
                <td>{{ formatDeviceRuntime(item.runtimeMinutes) }}</td>
                <td>{{ formatDeviceNumber(item.powerKw, 2) }}</td>
                <td>{{ formatDeviceNumber(item.flowRate, 2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal" :class="{ show: showDialog }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑设备' : '新增设备' }}</h3>
          <span class="modal-close" @click="closeDialog">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>塘口 <span style="color:red">*</span></label>
              <select v-model="form.pondId">
                <option value="">请选择塘口</option>
                <option v-for="pond in pondList" :key="pond.pondId" :value="pond.pondId">
                  {{ pond.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>设备名称 <span style="color:red">*</span></label>
              <input v-model="form.deviceName" type="text" placeholder="例如：1号增氧机">
            </div>
            <div class="form-group">
              <label>设备类型 <span style="color:red">*</span></label>
              <select v-model="form.deviceType">
                <option v-for="item in deviceTypeOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="form.status">
                <option v-for="item in statusOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeDialog">取消</button>
          <button class="btn btn-primary" :disabled="submitting" @click="handleSubmit">
            {{ submitting ? '提交中...' : '确认' }}
          </button>
        </div>
      </div>
    </div>

    <div class="modal" :class="{ show: showBatchDialog }">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3>批量新增设备</h3>
          <span class="modal-close" @click="closeBatchDialog">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>塘口 <span style="color:red">*</span></label>
              <select v-model="batchForm.pondId">
                <option value="">请选择塘口</option>
                <option v-for="pond in pondList" :key="pond.pondId" :value="pond.pondId">
                  {{ pond.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="batch-list">
            <div v-for="(row, index) in batchForm.devices" :key="index" class="batch-row">
              <input v-model="row.deviceName" type="text" placeholder="设备名称">
              <select v-model="row.deviceType">
                <option v-for="item in deviceTypeOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
              <select v-model="row.status">
                <option v-for="item in statusOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
              <button class="btn btn-danger btn-sm" :disabled="batchForm.devices.length === 1" @click="removeBatchRow(index)">
                删除
              </button>
            </div>
          </div>

          <div style="margin-top: 12px;">
            <button class="btn btn-secondary btn-sm" @click="addBatchRow">+ 添加一行</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeBatchDialog">取消</button>
          <button class="btn btn-primary" :disabled="batchSubmitting" @click="handleBatchSubmit">
            {{ batchSubmitting ? '提交中...' : '批量提交' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { deviceApi, pondApi } from '@/api'
import { useDeviceRealtime } from '@/composables/useDeviceRealtime'
import {
  DEVICE_RUNTIME_LABELS,
  DEVICE_STATUS_OPTIONS,
  DEVICE_TYPE_OPTIONS,
  createEmptyDeviceRow,
  formatDeviceNumber,
  formatDeviceRuntime,
  formatDeviceTime,
  getDeviceStatusBadge,
  getDeviceStatusLabel,
  getDeviceTypeLabel
} from '@/constants/device'

const page = ref(1)
const size = ref(10)
const total = ref(0)
const deviceRecords = ref([])
const pondList = ref([])
const submitting = ref(false)
const batchSubmitting = ref(false)
const showDialog = ref(false)
const showBatchDialog = ref(false)
const isEdit = ref(false)
const historyPondId = ref('')

const searchForm = reactive({
  pondId: '',
  deviceType: '',
  status: '',
  keyword: ''
})

const form = reactive({
  deviceId: null,
  pondId: '',
  deviceName: '',
  deviceType: 'aerator',
  status: 'off'
})

const batchForm = reactive({
  pondId: '',
  devices: [createEmptyDeviceRow()]
})

const deviceTypeOptions = DEVICE_TYPE_OPTIONS
const statusOptions = DEVICE_STATUS_OPTIONS

const {
  latestList,
  historyRecords,
  historyLoading,
  historyError,
  error,
  lastUpdatedAt,
  loadHistory,
  refreshLatest
} = useDeviceRealtime()

const realtimeSummary = computed(() => {
  const devices = latestList.value || []
  return {
    total: devices.length,
    running: devices.filter(item => item.status === 'on').length,
    idle: devices.filter(item => item.status === 'off').length,
    fault: devices.filter(item => item.status === 'error').length
  }
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size.value)))

const normalizeParams = () => {
  const params = {
    page: page.value,
    size: size.value
  }
  if (searchForm.pondId !== '' && searchForm.pondId !== null) {
    params.pondId = searchForm.pondId
  }
  if (searchForm.deviceType) {
    params.deviceType = searchForm.deviceType
  }
  if (searchForm.status) {
    params.status = searchForm.status
  }
  if (searchForm.keyword) {
    params.keyword = searchForm.keyword
  }
  return params
}

const fetchPonds = async () => {
  try {
    const res = await pondApi.list({ page: 1, size: 1000 })
    if (res.success) {
      pondList.value = res.data.records || []
      if (!historyPondId.value && pondList.value.length > 0) {
        historyPondId.value = pondList.value[0].pondId
      }
    }
  } catch (err) {
    console.error('Failed to load ponds', err)
  }
}

const fetchDevices = async () => {
  try {
    const res = await deviceApi.list(normalizeParams())
    if (res.success) {
      deviceRecords.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      alert(res.message || '加载设备列表失败')
    }
  } catch (err) {
    alert('加载设备列表失败: ' + (err.message || '未知错误'))
  }
}

const refreshHistory = () => {
  if (historyPondId.value) {
    loadHistory(historyPondId.value)
  }
}

const refreshAll = async () => {
  await refreshLatest()
  await fetchDevices()
  refreshHistory()
}

const handleSearch = async () => {
  page.value = 1
  await fetchDevices()
}

const changePage = async nextPage => {
  page.value = nextPage
  await fetchDevices()
}

const resetForm = () => {
  form.deviceId = null
  form.pondId = ''
  form.deviceName = ''
  form.deviceType = 'aerator'
  form.status = 'off'
}

const openAddDialog = () => {
  isEdit.value = false
  resetForm()
  showDialog.value = true
}

const openEditDialog = item => {
  isEdit.value = true
  form.deviceId = item.deviceId
  form.pondId = item.pondId
  form.deviceName = item.deviceName
  form.deviceType = item.deviceType || 'aerator'
  form.status = item.status || 'off'
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const handleSubmit = async () => {
  if (!form.pondId || !form.deviceName || !form.deviceType) {
    alert('请填写完整信息')
    return
  }
  submitting.value = true
  try {
    const payload = {
      pondId: Number(form.pondId),
      deviceName: form.deviceName,
      deviceType: form.deviceType,
      status: form.status
    }
    let res
    if (isEdit.value) {
      payload.deviceId = form.deviceId
      res = await deviceApi.update(payload)
    } else {
      res = await deviceApi.add(payload)
    }
    if (res.success) {
      closeDialog()
      await refreshAll()
    } else {
      alert(res.message || '操作失败')
    }
  } catch (err) {
    alert('请求失败: ' + (err.response?.data?.message || err.message || '未知错误'))
  } finally {
    submitting.value = false
  }
}

const handleDelete = async deviceId => {
  if (!confirm('确定删除该设备吗？')) {
    return
  }
  try {
    const res = await deviceApi.delete(deviceId)
    if (res.success) {
      await refreshAll()
    } else {
      alert(res.message || '删除失败')
    }
  } catch (err) {
    alert('删除失败: ' + (err.response?.data?.message || err.message || '未知错误'))
  }
}

const toggleDeviceStatus = async item => {
  const nextStatus = item.status === 'on' ? 'off' : 'on'
  try {
    const res = await deviceApi.updateStatus(item.deviceId, nextStatus)
    if (res.success) {
      await refreshAll()
    } else {
      alert(res.message || '状态更新失败')
    }
  } catch (err) {
    alert('状态更新失败: ' + (err.response?.data?.message || err.message || '未知错误'))
  }
}

const closeBatchDialog = () => {
  showBatchDialog.value = false
}

const openBatchDialog = () => {
  batchForm.pondId = ''
  batchForm.devices = [createEmptyDeviceRow()]
  showBatchDialog.value = true
}

const addBatchRow = () => {
  batchForm.devices.push(createEmptyDeviceRow())
}

const removeBatchRow = index => {
  if (batchForm.devices.length > 1) {
    batchForm.devices.splice(index, 1)
  }
}

const handleBatchSubmit = async () => {
  if (!batchForm.pondId) {
    alert('请先选择塘口')
    return
  }
  const devices = batchForm.devices.filter(item => item.deviceName && item.deviceType)
  if (devices.length === 0) {
    alert('请至少填写一条设备信息')
    return
  }
  batchSubmitting.value = true
  try {
    const payload = {
      pondId: Number(batchForm.pondId),
      devices: devices.map(item => ({
        deviceName: item.deviceName,
        deviceType: item.deviceType,
        status: item.status || 'off'
      }))
    }
    const res = await deviceApi.batchAdd(payload)
    if (res.success) {
      closeBatchDialog()
      await refreshAll()
    } else {
      alert(res.message || '批量添加失败')
    }
  } catch (err) {
    alert('批量添加失败: ' + (err.response?.data?.message || err.message || '未知错误'))
  } finally {
    batchSubmitting.value = false
  }
}

const historyPond = computed(() => {
  if (!historyPondId.value) {
    return null
  }
  return pondList.value.find(item => item.pondId === historyPondId.value || Number(item.pondId) === Number(historyPondId.value)) || null
})

watch(
  historyPondId,
  pondId => {
    if (pondId) {
      loadHistory(Number(pondId))
    }
  },
  { immediate: true }
)

watch(
  lastUpdatedAt,
  () => {
    fetchDevices()
    refreshHistory()
  }
)

onMounted(async () => {
  await fetchPonds()
  await refreshAll()
})
</script>

<style scoped>
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.update-time {
  color: #666;
  font-size: 13px;
}

.pond-selector {
  min-width: 160px;
}

.empty-state {
  padding: 28px 16px;
  text-align: center;
  color: #888;
}

.modal-large {
  max-width: 920px;
}

.batch-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.batch-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr auto;
  gap: 10px;
  align-items: center;
}

.batch-row input,
.batch-row select {
  width: 100%;
}
</style>
