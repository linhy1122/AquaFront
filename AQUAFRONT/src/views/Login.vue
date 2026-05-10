<template>
  <div class="login-container">
    <div class="login-box fade-in">
      <h1>🐟 智慧水产养殖系统</h1>
      <p class="subtitle">Aquaculture Management System</p>

      <form id="loginForm" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="form.username" placeholder="请输入用户名" required>
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="form.password" placeholder="请输入密码" required>
        </div>

        <div class="form-group">
          <label for="role">角色</label>
          <select id="role" v-model="form.role">
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </select>
        </div>

        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="remember" v-model="form.remember">
            <span style="font-weight: normal;">记住密码</span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-block">登 录</button>
      </form>

      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
        <a href="#" style="color: #1890ff; text-decoration: none;">忘记密码?</a>
        <span style="margin: 0 10px;">|</span>
        <a href="#" style="color: #1890ff; text-decoration: none;">注册账号</a>
      </div>

      <div style="margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 6px; font-size: 12px; color: #666;">
        <strong>演示账号：</strong><br>
        管理员：admin / admin123<br>
        普通用户：user / user123
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  role: 'admin',
  remember: false
})

const handleLogin = () => {
  if ((form.username === 'admin' && form.password === 'admin123') ||
      (form.username === 'user' && form.password === 'user123')) {
    router.push('/dashboard')
  } else {
    alert('用户名或密码错误，请重试！')
  }
}
</script>