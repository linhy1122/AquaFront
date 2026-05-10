<template>
  <div class="card">
    <div class="card-header">
      <h3>塘口列表</h3>
      <button class="btn btn-primary btn-sm">+ 新增塘口</button>
    </div>
    <div class="card-body">
      <div class="toolbar">
        <div class="search-box">
          <input type="text" placeholder="搜索塘口名称...">
          <select>
            <option>全部状态</option>
            <option>使用中</option>
            <option>空闲</option>
            <option>维护中</option>
          </select>
          <button class="btn btn-primary btn-sm">查询</button>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>塘口编号</th>
              <th>塘口名称</th>
              <th>面积(亩)</th>
              <th>水深(m)</th>
              <th>水源类型</th>
              <th>当前状态</th>
              <th>负责人</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>P001</td>
              <td><strong>1号塘口</strong></td>
              <td>5.0</td>
              <td>1.8</td>
              <td>地下水</td>
              <td><span class="badge badge-success">使用中</span></td>
              <td>张三</td>
              <td>2025-03-15</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑</button>
                <button class="btn btn-warning btn-sm">详情</button>
                <button class="btn btn-danger btn-sm">删除</button>
              </td>
            </tr>
            <tr>
              <td>P002</td>
              <td><strong>2号塘口</strong></td>
              <td>6.5</td>
              <td>2.0</td>
              <td>河水</td>
              <td><span class="badge badge-success">使用中</span></td>
              <td>李四</td>
              <td>2025-03-15</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑</button>
                <button class="btn btn-warning btn-sm">详情</button>
                <button class="btn btn-danger btn-sm">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="pagination">
        <button disabled>上一页</button>
        <span class="page-info">第 1 页 / 共 2 页</span>
        <button>下一页</button>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3>塘口统计</h3>
    </div>
    <div class="card-body">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">🏞️</div>
          <div class="stat-info">
            <h4>塘口总数</h4>
            <div class="value">12</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">✅</div>
          <div class="stat-info">
            <h4>使用中</h4>
            <div class="value">10</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">⏸️</div>
          <div class="stat-info">
            <h4>空闲</h4>
            <div class="value">2</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">📏</div>
          <div class="stat-info">
            <h4>总面积(亩)</h4>
            <div class="value">68.5</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'PondBasicTab' })
</script>