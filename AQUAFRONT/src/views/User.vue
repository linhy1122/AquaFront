<template>
  <div class="content">
    <div class="page-header">
      <h1>用户管理中心</h1>
      <div class="breadcrumb">首页 / 系统设置 / 用户管理</div>
    </div>

    <div v-if="loading" class="card">
      <div class="card-body">正在加载用户信息...</div>
    </div>

    <template v-else>
      <div v-if="isAdmin" class="tabs">
        <div class="tab" :class="{ active: activeTab === 'users' }" @click="switchTab('users')">用户列表</div>
        <div class="tab" :class="{ active: activeTab === 'roles' }" @click="switchTab('roles')">角色权限</div>
        <div class="tab" :class="{ active: activeTab === 'logs' }" @click="switchTab('logs')">操作日志</div>
      </div>
      <div v-else class="card notice-card">
        <div class="card-body">
          当前账号为普通用户，仅展示个人信息，不提供用户管理列表。
        </div>
      </div>

      <UsersTab v-if="!isAdmin || activeTab === 'users'" />

      <RolesTab v-if="isAdmin && activeTab === 'roles'" />
      <LogsTab v-if="isAdmin && activeTab === 'logs'" />
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import UsersTab from '../components/UsersTab.vue'
import RolesTab from '../components/RolesTab.vue'
import LogsTab from '../components/LogsTab.vue'
import { useCurrentUser, loadCurrentUser } from '@/composables/useCurrentUser'

const activeTab = ref('users')
const { currentUser, currentUserLoading } = useCurrentUser()
const storedRole = ref(localStorage.getItem('role') || '')

const isAdmin = computed(() => {
  return (currentUser.value?.role || storedRole.value) === 'ADMIN'
})

const loading = computed(() => {
  return currentUserLoading.value && !currentUser.value
})

const switchTab = (tabName) => {
  activeTab.value = tabName
}

onMounted(() => {
  loadCurrentUser(true)
})
</script>

<style scoped>
.notice-card {
  margin-bottom: 16px;
}
</style>
