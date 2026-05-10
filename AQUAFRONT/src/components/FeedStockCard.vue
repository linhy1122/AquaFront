<template>
  <div class="card">
    <div class="card-header">
      <h3>饲料库存明细</h3>
      <button class="btn btn-success btn-sm" @click="openInStockDialog">+ 入库登记</button>
    </div>
    <div class="card-body">
      <div class="toolbar">
        <div class="search-box">
          <input type="text" v-model="searchName" placeholder="搜索饲料名称..." @keyup.enter="fetchInventory">
          <button class="btn btn-primary btn-sm" @click="fetchInventory">搜索</button>
          <button class="btn btn-sm" :class="showRecords ? 'btn-primary' : 'btn-warning'" @click="toggleRecords">
            {{ showRecords ? '库存列表' : '出入库流水' }}
          </button>
        </div>
      </div>

      <!-- 库存列表 -->
      <div v-if="!showRecords">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>饲料名称</th>
                <th>类别</th>
                <th>单价(元/kg)</th>
                <th>当前库存(kg)</th>
                <th>库存状态</th>
                <th>预计可用天数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="inventoryRecords.length === 0">
                <td colspan="7" style="text-align:center;padding:40px;color:#999;">暂无库存数据</td>
              </tr>
              <tr v-for="item in inventoryRecords" :key="item.materialId">
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>{{ item.unitPrice?.toFixed(2) }}</td>
                <td>{{ item.currentStock?.toFixed(2) }}</td>
                <td>
                  <span :class="['badge', item.stockStatus === '充足' ? 'badge-success' : 'badge-warning']">
                    {{ item.stockStatus }}
                  </span>
                </td>
                <td>{{ item.availableDays }}天</td>
                <td>
                  <button class="btn btn-primary btn-sm" @click="openOutStockDialog(item)">出库</button>
                  <button class="btn btn-warning btn-sm" @click="openInStockDialogFor(item)">入库</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="invTotal > 0">
          <button :disabled="invPage <= 1" @click="invPage--; fetchInventory()">上一页</button>
          <span class="page-info">第 {{ invPage }} / {{ invTotalPages }} 页，共 {{ invTotal }} 条</span>
          <button :disabled="invPage >= invTotalPages" @click="invPage++; fetchInventory()">下一页</button>
        </div>
      </div>

      <!-- 出入库流水 -->
      <div v-if="showRecords">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>记录ID</th>
                <th>物料ID</th>
                <th>类型</th>
                <th>数量(kg)</th>
                <th>总成本(元)</th>
                <th>记录时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="recordList.length === 0">
                <td colspan="6" style="text-align:center;padding:40px;color:#999;">暂无流水记录</td>
              </tr>
              <tr v-for="item in recordList" :key="item.recordId">
                <td>{{ item.recordId }}</td>
                <td>{{ item.materialId }}</td>
                <td>
                  <span :class="['badge', item.type === 'IN' ? 'badge-success' : 'badge-warning']">
                    {{ item.type === 'IN' ? '入库' : '出库' }}
                  </span>
                </td>
                <td>{{ item.quantity?.toFixed(2) }}</td>
                <td>{{ item.totalCost?.toFixed(2) }}</td>
                <td>{{ item.recordDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination" v-if="recTotal > 0">
          <button :disabled="recPage <= 1" @click="recPage--; fetchRecords()">上一页</button>
          <span class="page-info">第 {{ recPage }} / {{ recTotalPages }} 页，共 {{ recTotal }} 条</span>
          <button :disabled="recPage >= recTotalPages" @click="recPage++; fetchRecords()">下一页</button>
        </div>
      </div>
    </div>

    <!-- 入库弹窗 -->
    <div class="modal" :class="{ show: showInStockDialog }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>饲料入库</h3>
          <span class="modal-close" @click="showInStockDialog = false">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>物料 ID <span style="color:red">*</span></label>
              <input type="number" v-model.number="inStockForm.materialId" placeholder="请输入物料ID">
            </div>
            <div class="form-group">
              <label>入库数量(kg) <span style="color:red">*</span></label>
              <input type="number" v-model.number="inStockForm.quantity" min="0" step="0.01" placeholder="请输入数量">
            </div>
            <div class="form-group">
              <label>单价(元/kg)</label>
              <input type="number" v-model.number="inStockForm.unitPrice" min="0" step="0.01" placeholder="选填">
            </div>
            <div class="form-group">
              <label>操作人</label>
              <input type="text" v-model="inStockForm.operator" placeholder="选填">
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label>备注</label>
              <textarea v-model="inStockForm.remark" placeholder="选填" rows="2"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="showInStockDialog = false">取消</button>
          <button class="btn btn-success" @click="handleInStock" :disabled="stockSubmitting">
            {{ stockSubmitting ? '提交中...' : '确认入库' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 出库弹窗 -->
    <div class="modal" :class="{ show: showOutStockDialog }">
      <div class="modal-content">
        <div class="modal-header">
          <h3>饲料出库</h3>
          <span class="modal-close" @click="showOutStockDialog = false">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>物料 ID <span style="color:red">*</span></label>
              <input type="number" v-model.number="outStockForm.materialId" placeholder="请输入物料ID">
            </div>
            <div class="form-group">
              <label>出库数量(kg) <span style="color:red">*</span></label>
              <input type="number" v-model.number="outStockForm.quantity" min="0" step="0.01" placeholder="请输入数量">
            </div>
            <div class="form-group">
              <label>关联批次ID</label>
              <input type="number" v-model.number="outStockForm.batchId" placeholder="选填">
            </div>
            <div class="form-group">
              <label>操作人</label>
              <input type="text" v-model="outStockForm.operator" placeholder="选填">
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label>备注</label>
              <textarea v-model="outStockForm.remark" placeholder="选填" rows="2"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="showOutStockDialog = false">取消</button>
          <button class="btn btn-warning" @click="handleOutStock" :disabled="stockSubmitting">
            {{ stockSubmitting ? '提交中...' : '确认出库' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { feedApi } from '../api'

defineOptions({ name: 'FeedStockCard' })

// --- 库存列表 ---
const searchName = ref('')
const invPage = ref(1)
const invSize = ref(10)
const invTotal = ref(0)
const inventoryRecords = ref([])

const invTotalPages = computed(() => Math.ceil(invTotal.value / invSize.value) || 1)

const fetchInventory = async () => {
  try {
    const res = await feedApi.inventory({
      page: invPage.value,
      size: invSize.value,
      name: searchName.value || undefined
    })
    if (res.success) {
      inventoryRecords.value = res.data.records || []
      invTotal.value = res.data.total || 0
    }
  } catch (err) {
    console.error('获取饲料库存失败:', err)
  }
}

// --- 出入库流水 ---
const showRecords = ref(false)
const recPage = ref(1)
const recSize = ref(10)
const recTotal = ref(0)
const recordList = ref([])

const recTotalPages = computed(() => Math.ceil(recTotal.value / recSize.value) || 1)

const fetchRecords = async () => {
  try {
    const res = await feedApi.records({
      page: recPage.value,
      size: recSize.value
    })
    if (res.success) {
      recordList.value = res.data.records || []
      recTotal.value = res.data.total || 0
    }
  } catch (err) {
    console.error('获取流水记录失败:', err)
  }
}

const toggleRecords = () => {
  showRecords.value = !showRecords.value
  if (showRecords.value) {
    fetchRecords()
  }
}

// --- 入库 ---
const showInStockDialog = ref(false)
const stockSubmitting = ref(false)
const inStockForm = reactive({
  materialId: null,
  quantity: null,
  unitPrice: null,
  operator: '',
  remark: ''
})

const openInStockDialog = () => {
  inStockForm.materialId = null
  inStockForm.quantity = null
  inStockForm.unitPrice = null
  inStockForm.operator = ''
  inStockForm.remark = ''
  showInStockDialog.value = true
}

const openInStockDialogFor = (item) => {
  inStockForm.materialId = item.materialId
  inStockForm.quantity = null
  inStockForm.unitPrice = item.unitPrice || null
  inStockForm.operator = ''
  inStockForm.remark = ''
  showInStockDialog.value = true
}

const handleInStock = async () => {
  if (!inStockForm.materialId || !inStockForm.quantity) {
    alert('请填写物料ID和数量')
    return
  }
  stockSubmitting.value = true
  try {
    const payload = { ...inStockForm }
    if (!payload.unitPrice) delete payload.unitPrice
    if (!payload.operator) delete payload.operator
    if (!payload.remark) delete payload.remark
    
    const res = await feedApi.inStock(payload)
    if (res.success) {
      showInStockDialog.value = false
      fetchInventory()
      alert(res.message || '入库成功')
    } else {
      alert(res.message || '入库失败')
    }
  } catch (err) {
    alert('请求失败: ' + (err.message || '未知错误'))
  } finally {
    stockSubmitting.value = false
  }
}

// --- 出库 ---
const showOutStockDialog = ref(false)
const outStockForm = reactive({
  materialId: null,
  quantity: null,
  batchId: null,
  operator: '',
  remark: ''
})

const openOutStockDialog = (item) => {
  outStockForm.materialId = item.materialId
  outStockForm.quantity = null
  outStockForm.batchId = null
  outStockForm.operator = ''
  outStockForm.remark = ''
  showOutStockDialog.value = true
}

const handleOutStock = async () => {
  if (!outStockForm.materialId || !outStockForm.quantity) {
    alert('请填写物料ID和数量')
    return
  }
  stockSubmitting.value = true
  try {
    const payload = { ...outStockForm }
    if (!payload.batchId) delete payload.batchId
    if (!payload.operator) delete payload.operator
    if (!payload.remark) delete payload.remark
    
    const res = await feedApi.outStock(payload)
    if (res.success) {
      showOutStockDialog.value = false
      fetchInventory()
      alert(res.message || '出库成功')
    } else {
      alert(res.message || res.data?.message || '出库失败')
    }
  } catch (err) {
    alert('请求失败: ' + (err.message || '未知错误'))
  } finally {
    stockSubmitting.value = false
  }
}

onMounted(() => {
  fetchInventory()
})
</script>