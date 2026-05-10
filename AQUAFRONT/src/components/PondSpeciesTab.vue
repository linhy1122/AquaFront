<template>
  <div class="card">
    <div class="card-header">
      <h3>养殖品种记录</h3>
      <button class="btn btn-primary btn-sm">+ 新增品种</button>
    </div>
    <div class="card-body">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>塘口</th>
              <th>养殖品种</th>
              <th>品种特性</th>
              <th>放养日期</th>
              <th>预计上市日期</th>
              <th>养殖周期(天)</th>
              <th>当前规格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1号塘口</td>
              <td><strong>草鱼</strong></td>
              <td>生长快、肉质好</td>
              <td>2026-03-15</td>
              <td>2026-09-15</td>
              <td>180</td>
              <td>500g/尾</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑</button>
                <button class="btn btn-danger btn-sm">删除</button>
              </td>
            </tr>
            <tr>
              <td>2号塘口</td>
              <td><strong>鲤鱼</strong></td>
              <td>适应性强</td>
              <td>2026-03-18</td>
              <td>2026-08-18</td>
              <td>150</td>
              <td>450g/尾</td>
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
defineOptions({ name: 'PondSpeciesTab' })
</script>