<template>
  <div class="card">
    <div class="card-header">
      <h3>角色权限管理</h3>
      <button class="btn btn-primary btn-sm">+ 新增角色</button>
    </div>
    <div class="card-body">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>角色名称</th>
              <th>用户数</th>
              <th>权限范围</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>管理员</strong></td>
              <td>1</td>
              <td>
                <span class="badge badge-success">全部权限</span>
              </td>
              <td>2025-01-01</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑权限</button>
              </td>
            </tr>
            <tr>
              <td><strong>普通用户</strong></td>
              <td>4</td>
              <td>
                <span class="badge badge-info">查看数据</span>
                <span class="badge badge-info">投喂管理</span>
              </td>
              <td>2025-01-01</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑权限</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'RolesTab' })
</script>