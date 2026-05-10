<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>🐟 智慧水产养殖</h2>
      <p>管理系统 v1.0</p>
    </div>
    <nav class="sidebar-menu">
      <div class="menu-group">
        <div class="menu-group-title">主菜单</div>
        <router-link to="/dashboard" class="menu-item" active-class="active">
          <span>📊</span> 仪表盘
        </router-link>
      </div>

      <div class="menu-group">
        <div class="menu-group-title">基础管理</div>
        <router-link to="/warehouse" class="menu-item" active-class="active">
          <span>📦</span> 仓储管理
        </router-link>
        <router-link to="/pond" class="menu-item" active-class="active">
          <span>🏞️</span> 塘口管理
        </router-link>
      </div>

      <div class="menu-group">
        <div class="menu-group-title">监测监控</div>
        <router-link to="/monitoring" class="menu-item" active-class="active">
          <span>🔬</span> 水质监测
        </router-link>
        <router-link to="/equipment" class="menu-item" active-class="active">
          <span>⚙️</span> 设备监控
        </router-link>
      </div>

      <div class="menu-group">
        <div class="menu-group-title">业务管理</div>
        <router-link to="/feeding" class="menu-item" active-class="active">
          <span>🍽️</span> 投喂管理
        </router-link>
        <router-link to="/alarm" class="menu-item" active-class="active">
          <span>🚨</span> 报警管理
        </router-link>
        <router-link to="/report" class="menu-item" active-class="active">
          <span>📈</span> 报表统计
        </router-link>
      </div>

      <div class="menu-group">
        <div class="menu-group-title">系统设置</div>
        <router-link to="/user" class="menu-item" active-class="active">
          <span>👤</span> 用户管理
        </router-link>
        <router-link to="/login" class="menu-item">
          <span>🚪</span> 退出登录
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup>
defineOptions({ name: 'Sidebar' })
</script>