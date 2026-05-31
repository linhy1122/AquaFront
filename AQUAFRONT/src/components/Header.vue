<template>
  <header class="header">
    <div class="header-left">
      <h3>{{ pageTitle }}</h3>
    </div>
    <div class="header-right">
      <div class="notification-bell" @click="showAlarmModal = true">
        🔔
        <span class="notification-badge">3</span>
      </div>
      <div class="user-info">
        <div class="user-avatar">{{ avatarText }}</div>
        <div>
          <div style="font-weight: 500;">{{ displayRoleLabel }}</div>
          <div style="font-size: 12px; color: #666;">{{ displayUsername }}</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrentUser, loadCurrentUser } from '@/composables/useCurrentUser'

const route = useRoute()
const { currentUser } = useCurrentUser()

const pageTitle = computed(() => {
  const titles = {
    dashboard: '仪表盘',
    warehouse: '仓储管理',
    pond: '塘口管理',
    monitoring: '水质监测',
    equipment: '设备监控',
    feeding: '投喂管理',
    alarm: '报警管理',
    report: '报表统计',
    user: '用户管理'
  }
  return titles[route.name] || '智慧水产养殖系统'
})

const displayUsername = computed(() => {
  return currentUser.value?.username || localStorage.getItem('username') || '未登录'
})

const displayRole = computed(() => {
  return currentUser.value?.role || localStorage.getItem('role') || 'USER'
})

const displayRoleLabel = computed(() => {
  return displayRole.value === 'ADMIN' ? '管理员' : '普通用户'
})

const avatarText = computed(() => {
  const name = displayUsername.value || 'U'
  return name.slice(0, 1).toUpperCase()
})

const showAlarmModal = ref(false)

onMounted(() => {
  loadCurrentUser(true)
})
</script>
