<template>
  <div class="content">
    <div class="page-header">
      <h1>塘口管理中心</h1>
      <div class="breadcrumb">首页 / 基础管理 / 塘口管理</div>
    </div>

    <!-- 标签页 -->
    <div class="tabs">
      <div class="tab active" @click="switchTab('basic')">塘口基本信息</div>
      <div class="tab" @click="switchTab('species')">养殖品种记录</div>
      <div class="tab" @click="switchTab('stock')">放养数量记录</div>
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