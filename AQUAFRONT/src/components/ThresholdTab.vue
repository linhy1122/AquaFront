<template>
  <div class="alert alert-info">
    <strong>提示：</strong>设置水质参数阈值，当监测数据超出设定范围时将触发报警
  </div>
  
  <div class="card">
    <div class="card-header">
      <h3>水质报警阈值设置</h3>
      <button class="btn btn-primary btn-sm" @click="saveThreshold">💾 保存设置</button>
    </div>
    <div class="card-body">
      <form>
        <div class="form-grid">
          <div class="form-group">
            <label>🌡️ 水温下限 (°C)</label>
            <input type="number" value="18" step="0.1">
          </div>
          <div class="form-group">
            <label>🌡️ 水温上限 (°C)</label>
            <input type="number" value="30" step="0.1">
          </div>
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label>💧 pH值下限</label>
            <input type="number" value="6.5" step="0.1">
          </div>
          <div class="form-group">
            <label>💧 pH值上限</label>
            <input type="number" value="8.5" step="0.1">
          </div>
        </div>
        
        <div class="form-group">
          <label>💨 溶解氧最低值 (mg/L)</label>
          <input type="number" value="4.0" step="0.1">
          <small style="color: #666; display: block; margin-top: 5px;">低于此值将触发紧急报警</small>
        </div>
      </form>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3>当前阈值概览</h3>
    </div>
    <div class="card-body">
      <table>
        <thead>
          <tr>
            <th>监测指标</th>
            <th>下限值</th>
            <th>上限值</th>
            <th>报警级别</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>水温</strong></td>
            <td>18°C</td>
            <td>30°C</td>
            <td><span class="badge badge-warning">一般</span></td>
            <td><span class="badge badge-success">正常</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'ThresholdTab' })

const saveThreshold = () => {
  if (confirm('确认保存阈值设置吗？')) {
    alert('阈值设置已保存！')
  }
}
</script>