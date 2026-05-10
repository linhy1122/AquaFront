<template>
  <div class="card fade-in">
    <div class="card-header">
      <h3>最近报警记录</h3>
      <router-link to="/alarm" class="btn btn-primary btn-sm">查看全部</router-link>
    </div>
    <div class="card-body">
      <div class="alarm-list">
        <div class="alarm-item critical">
          <div class="alarm-header">
            <span class="alarm-title">🔴 溶解氧过低</span>
            <span class="alarm-time">2026-04-14 08:30</span>
          </div>
          <div class="alarm-desc">3号塘口溶解氧降至3.2mg/L，低于最低阈值4.0mg/L</div>
          <div class="alarm-actions">
            <span class="badge badge-danger">未处理</span>
            <button class="btn btn-primary btn-sm">立即处理</button>
          </div>
        </div>

        <div class="alarm-item warning">
          <div class="alarm-header">
            <span class="alarm-title">🟡 pH值偏高</span>
            <span class="alarm-time">2026-04-14 07:15</span>
          </div>
          <div class="alarm-desc">2号塘口pH值达到8.5，接近上限</div>
          <div class="alarm-actions">
            <span class="badge badge-warning">处理中</span>
            <button class="btn btn-warning btn-sm">查看</button>
          </div>
        </div>

        <div class="alarm-item resolved">
          <div class="alarm-header">
            <span class="alarm-title">🟢 水温异常（已解决）</span>
            <span class="alarm-time">2026-04-13 22:10</span>
          </div>
          <div class="alarm-desc">1号塘口水温骤降至18°C，已恢复正常</div>
          <div class="alarm-actions">
            <span class="badge badge-success">已解决</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'AlarmCard' })
</script>