import { onBeforeUnmount, onMounted, ref } from 'vue'

export function usePolling(fetchFn, interval = 10000) {
  const polling = ref(false)
  let timer = null

  const start = () => {
    polling.value = true
    fetchFn()
    timer = setInterval(() => {
      fetchFn()
    }, interval)
  }

  const stop = () => {
    polling.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(() => {
    start()
  })

  onBeforeUnmount(() => {
    stop()
  })

  return { polling, start, stop }
}
