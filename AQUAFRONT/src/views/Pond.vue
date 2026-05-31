We need to apply the suggested edit to the original code. The original code had a comment with a garbled character: "<!-- 标签�?-->". The suggested edit replaces it with "<!-- 标签切换 -->" and also changes the tab class binding from hardcoded "tab active" to dynamic binding using :class. The rest remains the same. Output the complete modified file.

So we output the full template and script as shown in the suggested edit.```
<template>
  <div class="content">
    <div class="page-header">
      <h1>塘口管理中心</h1>
      <div class="breadcrumb">首页 / 基础管理 / 塘口管理</div>
    </div>

    <!-- 标签切换 -->
    <div class="tabs">
      <div :class="['tab', activeTab === 'basic' ? 'active' : '']" @click="switchTab('basic')">塘口基本信息</div>
      <div :class="['tab', activeTab === 'species' ? 'active' : '']" @click="switchTab('species')">养殖品种记录</div>
      <div :class="['tab', activeTab === 'stock' ? 'active' : '']" @click="switchTab('stock')">放养数量记录</div>
    </div>

    <!-- 塘口基本信息 -->
    <PondBasicTab v-show="activeTab === 'basic'" />

    <!-- 养殖品种记录 -->
    <PondSpeciesTab v-show="activeTab === 'species'" />

    <!-- 放养数量记录 -->
    <PondStockTab v-show="activeTab === 'stock'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PondBasicTab from '../components/PondBasicTab.vue'
import PondSpeciesTab from '../components/PondSpeciesTab.vue'
import PondStockTab from '../components/PondStockTab.vue'

const activeTab = ref('basic')

const switchTab = (tabName) => {
  activeTab.value = tabName
}
</script>

