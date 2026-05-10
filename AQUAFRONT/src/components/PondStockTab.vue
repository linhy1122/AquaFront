<template>
  <div class="card">
    <div class="card-header">
      <h3>放养数量记录</h3>
      <button class="btn btn-primary btn-sm">+ 新增记录</button>
    </div>
    <div class="card-body">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>塘口</th>
              <th>品种</th>
              <th>放养数量(尾)</th>
              <th>放养日期</th>
              <th>平均规格(g/尾)</th>
              <th>存活率(%)</th>
              <th>当前数量(尾)</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1号塘口</td>
              <td>草鱼</td>
              <td>5,000</td>
              <td>2026-03-15</td>
              <td>150</td>
              <td>96%</td>
              <td>4,800</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑</button>
                <button class="btn btn-danger btn-sm">删除</button>
              </td>
            </tr>
            <tr>
              <td>2号塘口</td>
              <td>鲤鱼</td>
              <td>6,000</td>
              <td>2026-03-18</td>
              <td>120</td>
              <td>95%</td>
              <td>5,700</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑</button>
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
      <h3>放养统计汇总</h3>
    </div>
    <div class="card-body">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">🐟</div>
          <div class="stat-info">
            <h4>总放养量(尾)</h4>
            <div class="value">45,600</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">✅</div>
          <div class="stat-info">
            <h4>当前存塘(尾)</h4>
            <div class="value">43,850</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">📊</div>
          <div class="stat-info">
            <h4>平均存活率</h4>
            <div class="value">96.2%</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">⚖️</div>
          <div class="stat-info">
            <h4>总放养重量(kg)</h4>
            <div class="value">5,680</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'PondStockTab' })
</script>