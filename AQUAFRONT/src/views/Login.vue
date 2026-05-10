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

<div class="form-group captcha-group">
            <label for="captcha">验证码</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="captcha" v-model="form.captcha" placeholder="请输入验证码" style="flex: 1;">
              <img :src="captchaImage.image" alt="验证码" class="captcha-image" @click="loadCaptcha" style="cursor: pointer; height: 40px;">
            </div>
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
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  captcha: '',
  remember: false
})

const captchaImage = reactive({
  image: '',
  key: ''
})

const loadCaptcha = async () => {
  try {
    const res = await authApi.getCaptcha()
    if (res.success) {
      captchaImage.image = res.data.captchaImage
      captchaImage.key = res.data.captchaKey
    }
  } catch (error) {
    console.error('加载验证码失败:', error)
  }
}

onMounted(() => {
  loadCaptcha()
})

const handleLogin = async () => {
   try {
     const loginData = {
       username: form.username,
       password: form.password
     }
     if (form.captcha?.trim()) {
       loginData.captcha = form.captcha
     }
     const res = await authApi.login(loginData)
     if (res.success) {
       localStorage.setItem('token', res.data.token)
       localStorage.setItem('username', res.data.username)
       localStorage.setItem('role', res.data.role)
       localStorage.setItem('userId', res.data.userId)
       router.push('/dashboard')
     } else {
       console.log('Login failed:', res)
       alert(res.message || '登录失败')
       loadCaptcha()
     }
   } catch (error) {
     console.error('Login error:', error)
     alert(error.message || '登录失败，请重试')
     loadCaptcha()
   }
 }
</script>