<template>
  <div class="card">
    <div class="card-header">
      <h3>放养记录</h3>
      <button class="btn btn-primary btn-sm">+ 新增放养</button>
    </div>
    <div class="card-body">
      <div class="toolbar">
        <div class="search-box">
          <input type="text" placeholder="搜索塘口...">
          <select>
            <option>全部品种</option>
            <option>草鱼</option>
            <option>鲤鱼</option>
            <option>鲢鱼</option>
            <option>鲫鱼</option>
          </select>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>塘口</th>
              <th>品种</th>
              <th>放养数量(尾)</th>
              <th>放养日期</th>
              <th>平均规格(g/尾)</th>
              <th>操作人</th>
              <th>备注</th>
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
              <td>张三</td>
              <td>春季放养</td>
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
              <td>李四</td>
              <td>-</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑</button>
                <button class="btn btn-danger btn-sm">删除</button>
              </td>
            </tr>
            <tr>
              <td>3号塘口</td>
              <td>鲢鱼</td>
              <td>8,000</td>
              <td>2026-03-20</td>
              <td>100</td>
              <td>王五</td>
              <td>混养</td>
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
defineOptions({ name: 'StockRecordCard' })
</script>