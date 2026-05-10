<template>
  <div class="alert alert-info">
    <strong>提示：</strong>根据水温、天气、鱼的生长阶段自动计算建议投喂量
  </div>
  
  <div class="card">
    <div class="card-header">
      <h3>今日投喂计划</h3>
      <button class="btn btn-success btn-sm" @click="executePlan">执行计划</button>
    </div>
    <div class="card-body">
      <div class="alert alert-success">
        <strong>计划状态：</strong>已生成，待执行
      </div>
      
      <table>
        <thead>
          <tr>
            <th>塘口</th>
            <th>品种</th>
            <th>存塘量(尾)</th>
            <th>建议投喂量(kg)</th>
            <th>饲料类型</th>
            <th>计划时间</th>
            <th>投喂率(%)</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1号塘口</strong></td>
            <td>草鱼</td>
            <td>4,800</td>
            <td>24</td>
            <td>草鱼饲料</td>
            <td>07:00</td>
            <td>0.5%</td>
            <td>水温适宜，正常投喂</td>
          </tr>
        </tbody>
        <tfoot>
          <tr style="background: #fafafa; font-weight: bold;">
            <td>合计</td>
            <td>-</td>
            <td>29,414</td>
            <td>119.5</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3>投喂参数设置</h3>
      <button class="btn btn-primary btn-sm" @click="saveFeedingParams">💾 保存</button>
    </div>
    <div class="card-body">
      <div class="form-grid">
        <div class="form-group">
          <label>基础投喂率(%体重/天)</label>
          <input type="number" value="0.5" step="0.1">
        </div>
        <div class="form-group">
          <label>水温低于20°C投喂率(%)</label>
          <input type="number" value="0.3" step="0.1">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'FeedingPlanTab' })

const executePlan = () => {
  if (confirm('确认执行今日投喂计划吗？')) {
    alert('投喂计划已开始执行！')
  }
}

const saveFeedingParams = () => {
  if (confirm('确认保存投喂参数吗？')) {
    alert('参数已保存！')
  }
}
</script>