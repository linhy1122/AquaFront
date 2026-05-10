<template>
  <div class="card">
    <div class="card-header">
      <h3>水质标准参考范围</h3>
    </div>
    <div class="card-body">
      <div class="alert alert-info">
        <strong>提示：</strong>以下为鱼类养殖适宜水质参数范围，超出范围将触发报警
      </div>
      <table>
        <thead>
          <tr>
            <th>指标</th>
            <th>最低值</th>
            <th>最适范围</th>
            <th>最高值</th>
            <th>单位</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>水温</strong></td>
            <td>18</td>
            <td>22-26</td>
            <td>30</td>
            <td>°C</td>
            <td>不同鱼种略有差异</td>
          </tr>
          <tr>
            <td><strong>pH值</strong></td>
            <td>6.5</td>
            <td>7.0-8.0</td>
            <td>8.5</td>
            <td>-</td>
            <td>过酸过碱都不利</td>
          </tr>
          <tr>
            <td><strong>溶解氧</strong></td>
            <td>4.0</td>
            <td>5.0-8.0</td>
            <td>-</td>
            <td>mg/L</td>
            <td>低于4.0会浮头</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'WaterStandardTable' })
</script>