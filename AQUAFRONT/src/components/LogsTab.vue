<template>
  <div class="card">
    <div class="card-header">
      <h3>用户操作日志</h3>
      <div style="display: flex; gap: 10px;">
        <input type="date" value="2026-04-14">
        <select>
          <option>全部用户</option>
          <option>admin</option>
          <option>zhangsan</option>
        </select>
        <button class="btn btn-primary btn-sm">查询</button>
      </div>
    </div>
    <div class="card-body">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>用户</th>
            <th>角色</th>
            <th>操作模块</th>
            <th>操作内容</th>
            <th>IP地址</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2026-04-14 09:30</td>
            <td>admin</td>
            <td>管理员</td>
            <td>设备监控</td>
            <td>启动1号增氧机</td>
            <td>192.168.1.100</td>
            <td><span class="badge badge-success">成功</span></td>
          </tr>
          <tr>
            <td>2026-04-14 08:30</td>
            <td>zhangsan</td>
            <td>普通用户</td>
            <td>投喂管理</td>
            <td>新增投喂记录：1号塘口 25kg</td>
            <td>192.168.1.101</td>
            <td><span class="badge badge-success">成功</span></td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <button disabled>上一页</button>
        <span class="page-info">第 1 页 / 共 10 页</span>
        <button>下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'LogsTab' })
</script>