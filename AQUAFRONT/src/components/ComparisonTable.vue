<template>
  <div class="card">
    <div class="card-header">
      <h3>各塘口水质对比</h3>
      <button class="btn btn-primary btn-sm">导出数据</button>
    </div>
    <div class="card-body">
      <table>
        <thead>
          <tr>
            <th>塘口</th>
            <th>水温(°C)</th>
            <th>pH值</th>
            <th>溶解氧(mg/L)</th>
            <th>氨氮(mg/L)</th>
            <th>亚硝酸盐(mg/L)</th>
            <th>透明度(cm)</th>
            <th>综合状态</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1号塘口</strong></td>
            <td>24.5</td>
            <td>7.2</td>
            <td>5.2</td>
            <td>0.35</td>
            <td>0.08</td>
            <td>35</td>
            <td><span class="badge badge-success">优良</span></td>
            <td>09:30</td>
          </tr>
          <tr>
            <td><strong>2号塘口</strong></td>
            <td>24.8</td>
            <td>7.5</td>
            <td>5.0</td>
            <td>0.42</td>
            <td>0.09</td>
            <td>32</td>
            <td><span class="badge badge-success">优良</span></td>
            <td>09:30</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'ComparisonTable' })
</script>