<template>
  <div class="card">
    <div class="card-header">
      <h3>报警记录列表</h3>
      <div style="display: flex; gap: 10px;">
        <select>
          <option>全部状态</option>
          <option>未处理</option>
          <option>处理中</option>
          <option>已解决</option>
        </select>
        <button class="btn btn-primary btn-sm">查询</button>
      </div>
    </div>
    <div class="card-body">
      <div class="alarm-list">
        <div class="alarm-item critical">
          <div class="alarm-header">
            <span class="alarm-title">🔴 溶解氧过低 - 3号塘口</span>
            <span class="alarm-time">2026-04-14 08:30</span>
          </div>
          <div class="alarm-desc">
            当前值：<strong style="color: #ff4d4f;">3.2 mg/L</strong> | 阈值：≥ 4.0 mg/L
          </div>
          <div class="alarm-actions">
            <span class="badge badge-danger">未处理</span>
            <button class="btn btn-primary btn-sm">立即处理</button>
          </div>
        </div>
      </div>
      
      <div class="pagination">
        <button disabled>上一页</button>
        <span class="page-info">第 1 页 / 共 2 页</span>
        <button>下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'AlarmRecordsTab' })
</script>