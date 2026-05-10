<template>
  <div class="card">
    <div class="card-header">
      <h3>投喂记录列表</h3>
      <button class="btn btn-primary btn-sm" @click="showAddFeedingModal">+ 新增投喂</button>
    </div>
    <div class="card-body">
      <div class="toolbar">
        <div class="search-box">
          <input type="date" value="2026-04-14">
          <select>
            <option>全部塘口</option>
            <option>1号塘口</option>
            <option>2号塘口</option>
          </select>
          <button class="btn btn-primary btn-sm">查询</button>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>塘口</th>
              <th>饲料类型</th>
              <th>投喂量(kg)</th>
              <th>投喂时间</th>
              <th>投喂方式</th>
              <th>水温(°C)</th>
              <th>天气</th>
              <th>操作人</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1号塘口</strong></td>
              <td>草鱼饲料</td>
              <td>25</td>
              <td>2026-04-14 07:00</td>
              <td>人工投喂</td>
              <td>24.5</td>
              <td>晴</td>
              <td>张三</td>
              <td>正常摄食</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑</button>
                <button class="btn btn-danger btn-sm">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'FeedingRecordsTab' })
</script>