<template>
  <div class="content">
    <div class="page-header">
      <h1>设备监控中心</h1>
      <div class="breadcrumb">首页 / 监测监控 / 设备监控</div>
    </div>

    <!-- 设备概览 -->
    <EquipmentStats />

    <!-- 增氧机 -->
    <AeratorCard />

    <!-- 水泵 -->
    <PumpCard />

    <!-- 设备运行统计 -->
    <EquipmentStatsTable />
  </div>
</template>

<script setup>
import EquipmentStats from '../components/EquipmentStats.vue'
import AeratorCard from '../components/AeratorCard.vue'
import PumpCard from '../components/PumpCard.vue'
import EquipmentStatsTable from '../components/EquipmentStatsTable.vue'
</script>