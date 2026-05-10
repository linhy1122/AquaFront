<template>
  <div class="card">
    <div class="card-header">
      <h3>用户列表</h3>
      <button class="btn btn-primary btn-sm">+ 新增用户</button>
    </div>
    <div class="card-body">
      <div class="toolbar">
        <div class="search-box">
          <input type="text" placeholder="搜索用户名...">
          <button class="btn btn-primary btn-sm">查询</button>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>用户ID</th>
              <th>用户名</th>
              <th>姓名</th>
              <th>角色</th>
              <th>手机号</th>
              <th>状态</th>
              <th>最后登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td><strong>admin</strong></td>
              <td>系统管理员</td>
              <td><span class="badge badge-danger">管理员</span></td>
              <td>138****8888</td>
              <td><span class="badge badge-success">启用</span></td>
              <td>2026-04-14 09:00</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑</button>
                <button class="btn btn-warning btn-sm">重置密码</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td><strong>zhangsan</strong></td>
              <td>张三</td>
              <td><span class="badge badge-info">普通用户</span></td>
              <td>139****6666</td>
              <td><span class="badge badge-success">启用</span></td>
              <td>2026-04-14 07:30</td>
              <td>
                <button class="btn btn-primary btn-sm">编辑</button>
                <button class="btn btn-warning btn-sm">重置密码</button>
                <button class="btn btn-danger btn-sm">禁用</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'UsersTab' })
</script>