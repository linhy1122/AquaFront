<template>
  <div class="content">
    <div class="page-header">
      <h1>欢迎使用智慧水产养殖系统</h1>
      <div class="breadcrumb">首页 / 仪表盘</div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card fade-in">
        <div class="stat-icon blue">🏞️</div>
        <div class="stat-info">
          <h4>塘口总数</h4>
          <div class="value">12</div>
          <div class="trend trend-up">↑ 2个新增</div>
        </div>
      </div>

      <div class="stat-card fade-in">
        <div class="stat-icon green">🐟</div>
        <div class="stat-info">
          <h4>存塘总量</h4>
          <div class="value">45,600</div>
          <div class="trend trend-up">↑ 1,200尾</div>
        </div>
      </div>

      <div class="stat-card fade-in">
        <div class="stat-icon orange">📦</div>
        <div class="stat-info">
          <h4>饲料库存(kg)</h4>
          <div class="value">2,850</div>
          <div class="trend trend-down">↓ 150kg</div>
        </div>
      </div>

      <div class="stat-card fade-in">
        <div class="stat-icon red">🚨</div>
        <div class="stat-info">
          <h4>待处理报警</h4>
          <div class="value">3</div>
          <div class="trend">需要处理</div>
        </div>
      </div>
    </div>

    <!-- 水质监测概览 -->
    <MonitorCard />

    <!-- 设备状态 -->
    <EquipmentCard />

    <!-- 最近报警 -->
    <AlarmCard />

    <!-- 今日投喂记录 -->
    <FeedingCard />
  </div>
</template>

<script setup>
import MonitorCard from '../components/MonitorCard.vue'
import EquipmentCard from '../components/EquipmentCard.vue'
import AlarmCard from '../components/AlarmCard.vue'
import FeedingCard from '../components/FeedingCard.vue'
</script>