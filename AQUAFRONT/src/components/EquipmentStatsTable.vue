<template>
  <div class="card">
    <div class="card-header">
      <h3>📊 本月设备运行统计</h3>
    </div>
    <div class="card-body">
      <table>
        <thead>
          <tr>
            <th>设备名称</th>
            <th>类型</th>
            <th>运行时长(h)</th>
            <th>启停次数</th>
            <th>耗电(kWh)</th>
            <th>故障次数</th>
            <th>运行状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1号增氧机</strong></td>
            <td>增氧机</td>
            <td>245</td>
            <td>58</td>
            <td>857.5</td>
            <td>0</td>
            <td><span class="badge badge-success">正常</span></td>
          </tr>
          <tr>
            <td><strong>1号水泵</strong></td>
            <td>水泵</td>
            <td>156</td>
            <td>62</td>
            <td>468</td>
            <td>0</td>
            <td><span class="badge badge-success">正常</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'EquipmentStatsTable' })
</script>