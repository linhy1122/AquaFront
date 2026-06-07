import { computed, onBeforeUnmount, onMounted, reactive } from 'vue'
import { waterQualityApi } from '@/api/waterQuality'

const POLL_INTERVAL = 30000

const state = reactive({
  latestList: [],
  historyRecords: [],
  loading: false,
  historyLoading: false,
  error: '',
  historyError: '',
  lastUpdatedAt: '',
  selectedHistoryPondId: null
})

let pollingTimer = null
let consumerCount = 0
let latestRequestId = 0
let historyRequestId = 0

function extractResponseData(response) {
  if (response && typeof response === 'object' && 'success' in response) {
    if (!response.success) {
      throw new Error(response.message || '请求失败')
    }
    return response.data || {}
  }
  return response || {}
}

async function fetchLatest() {
  const requestId = ++latestRequestId
  state.loading = true
  state.error = ''
  try {
    const response = await waterQualityApi.getLatest()
    if (requestId !== latestRequestId) {
      return
    }
    const payload = extractResponseData(response)
    state.latestList = Array.isArray(payload.records) ? payload.records : []
    state.lastUpdatedAt = payload.updatedAt || new Date().toISOString()
    if (!state.selectedHistoryPondId && state.latestList.length > 0) {
      state.selectedHistoryPondId = state.latestList[0].pondId
    }
  } catch (error) {
    if (requestId !== latestRequestId) {
      return
    }
    state.error = error?.message || '获取水质数据失败'
  } finally {
    if (requestId === latestRequestId) {
      state.loading = false
    }
  }
}

async function fetchHistory(pondId, limit = 10) {
  if (!pondId) {
    state.historyRecords = []
    state.historyError = ''
    return
  }

  const requestId = ++historyRequestId
  state.historyLoading = true
  state.historyError = ''
  state.selectedHistoryPondId = pondId
  try {
    const response = await waterQualityApi.getHistory(pondId, limit)
    if (requestId !== historyRequestId) {
      return
    }
    const payload = extractResponseData(response)
    state.historyRecords = Array.isArray(payload.records) ? payload.records : []
  } catch (error) {
    if (requestId !== historyRequestId) {
      return
    }
    state.historyError = error?.message || '获取历史数据失败'
    state.historyRecords = []
  } finally {
    if (requestId === historyRequestId) {
      state.historyLoading = false
    }
  }
}

function startPolling() {
  consumerCount += 1
  if (pollingTimer) {
    return
  }
  fetchLatest()
  pollingTimer = setInterval(() => {
    fetchLatest()
  }, POLL_INTERVAL)
}

function stopPolling() {
  consumerCount = Math.max(0, consumerCount - 1)
  if (consumerCount > 0) {
    return
  }
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

export function useWaterQuality() {
  onMounted(() => {
    startPolling()
  })

  onBeforeUnmount(() => {
    stopPolling()
  })

  return {
    latestList: computed(() => state.latestList),
    historyRecords: computed(() => state.historyRecords),
    loading: computed(() => state.loading),
    historyLoading: computed(() => state.historyLoading),
    error: computed(() => state.error),
    historyError: computed(() => state.historyError),
    lastUpdatedAt: computed(() => state.lastUpdatedAt),
    selectedHistoryPondId: computed(() => state.selectedHistoryPondId),
    refreshLatest: fetchLatest,
    loadHistory: fetchHistory
  }
}
