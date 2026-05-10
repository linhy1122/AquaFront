<template>
  <div class="card">
    <div class="card-header">
      <h3>报警方式设置</h3>
      <button class="btn btn-primary btn-sm" @click="saveAlarmSettings">💾 保存设置</button>
    </div>
    <div class="card-body">
      <div class="alert alert-info">
        <strong>提示：</strong>当前系统支持界面弹窗报警，后续版本将支持短信、邮件等方式
      </div>
      
      <form>
        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; cursor: pointer;">
            <input type="checkbox" checked> 
            <span style="font-weight: 500;">界面弹窗报警（已启用）</span>
          </label>
        </div>
        
        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; cursor: pointer;">
            <input type="checkbox" checked> 
            <span style="font-weight: 500;">声音提醒</span>
          </label>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'AlarmSettingsTab' })

const saveAlarmSettings = () => {
  if (confirm('确认保存报警设置吗？')) {
    alert('报警设置已保存！')
  }
}
</script>