import { computed, reactive } from 'vue'
import { authApi } from '@/api'

const state = reactive({
  user: null,
  loading: false,
  error: '',
  loaded: false
})

let requestPromise = null

function extractResponseData(response) {
  if (response && typeof response === 'object' && 'success' in response) {
    if (!response.success) {
      throw new Error(response.message || 'Request failed')
    }
    return response.data || {}
  }
  return response || {}
}

export async function loadCurrentUser(force = false) {
  if (state.loading && requestPromise) {
    return requestPromise
  }

  if (state.loaded && !force && state.user) {
    return state.user
  }

  if (!localStorage.getItem('token')) {
    state.user = null
    state.loaded = true
    state.error = ''
    state.loading = false
    return null
  }

  state.loading = true
  state.error = ''
  requestPromise = authApi.getCurrentUser()
    .then(response => {
      const payload = extractResponseData(response)
      state.user = payload || null
      state.loaded = true
      return state.user
    })
    .catch(error => {
      state.user = null
      state.loaded = true
      state.error = error?.message || 'Failed to load current user'
      return null
    })
    .finally(() => {
      state.loading = false
      requestPromise = null
    })

  return requestPromise
}

export function useCurrentUser() {
  return {
    currentUser: computed(() => state.user),
    currentUserLoading: computed(() => state.loading),
    currentUserError: computed(() => state.error),
    loadCurrentUser
  }
}
