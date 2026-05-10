<template>
  <div class="content">
    <div class="page-header">
      <h1>用户管理中心</h1>
      <div class="breadcrumb">首页 / 系统设置 / 用户管理</div>
    </div>

    <!-- 标签页 -->
    <div class="tabs">
      <div class="tab active" @click="switchTab('users')">用户列表</div>
      <div class="tab" @click="switchTab('roles')">角色权限</div>
      <div class="tab" @click="switchTab('logs')">操作日志</div>
    </div>

    <!-- 用户列表 -->
    <UsersTab v-show="activeTab === 'users'" />

    <!-- 角色权限 -->
    <RolesTab v-show="activeTab === 'roles'" />

    <!-- 操作日志 -->
    <LogsTab v-show="activeTab === 'logs'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UsersTab from '../components/UsersTab.vue'
import RolesTab from '../components/RolesTab.vue'
import LogsTab from '../components/LogsTab.vue'

const activeTab = ref('users')

const switchTab = (tabName) => {
  activeTab.value = tabName
}
</script>