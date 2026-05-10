<template>
  <div class="card">
    <div class="card-header">
      <h3>用户列表</h3>
      <button class="btn btn-primary btn-sm" @click="showAddModal">+ 新增用户</button>
    </div>
    <div class="card-body">
      <div class="toolbar">
        <div class="search-box">
          <input type="text" v-model="searchKeyword" placeholder="搜索用户名...">
          <button class="btn btn-primary btn-sm" @click="loadUsers">查询</button>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>用户ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td><strong>{{ user.username }}</strong></td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="getRoleBadge(user.role)">{{ getRoleText(user.role) }}</span>
              </td>
              <td>
                <span :class="user.enabled ? 'badge badge-success' : 'badge badge-danger'">
                  {{ user.enabled ? '启用' : '禁用' }}
                </span>
              </td>
              <td>{{ formatDate(user.createTime) }}</td>
              <td>
                <button class="btn btn-primary btn-sm" @click="editUser(user)">编辑</button>
                <button class="btn btn-warning btn-sm" @click="resetPassword(user)">重置密码</button>
                <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)" v-if="user.id !== 1">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 新增/编辑用户弹窗 -->
    <div class="modal" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑用户' : '新增用户' }}</h3>
          <span class="close" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitUser">
            <div class="form-group">
              <label>用户名</label>
              <input type="text" v-model="formData.username" :disabled="isEdit" required>
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input type="email" v-model="formData.email" required>
            </div>
            <div class="form-group">
              <label>密码 <span v-if="isEdit" style="color: #999;">(修改时必填)</span></label>
              <input type="password" v-model="formData.password" required placeholder="请输入密码（6-100个字符）">
            </div>
            <div class="form-group">
              <label>角色</label>
              <select v-model="formData.role">
                <option value="USER">普通用户</option>
                <option value="ADMIN">管理员</option>
              </select>
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="formData.enabled">
                <option :value="true">启用</option>
                <option :value="false">禁用</option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" @click="closeModal">取消</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? '更新' : '创建' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 重置密码弹窗 -->
    <div class="modal" v-if="showResetPwdModal" @click.self="closeResetPwdModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>重置密码</h3>
          <span class="close" @click="closeResetPwdModal">&times;</span>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitResetPassword">
            <div class="form-group">
              <label>用户名</label>
              <input type="text" :value="resetPwdForm.username" disabled>
            </div>
            <div class="form-group">
              <label>新密码</label>
              <input type="password" v-model="resetPwdForm.password" required placeholder="请输入新密码（6-100个字符）">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" @click="closeResetPwdModal">取消</button>
              <button type="submit" class="btn btn-primary">确认重置</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { userApi } from '@/api'

defineOptions({ name: 'UsersTab' })

const users = ref([])
const searchKeyword = ref('')
const showModal = ref(false)
const showResetPwdModal = ref(false)
const isEdit = ref(false)
const formData = reactive({
  id: null,
  username: '',
  email: '',
  password: '',
  role: 'USER',
  enabled: true
})

const resetPwdForm = reactive({
  id: null,
  username: '',
  password: ''
})

const loadUsers = async () => {
  try {
    const res = await userApi.getUsers()
    if (res.success) {
      users.value = res.data.users || []
    }
  } catch (error) {
    console.error('加载用户失败:', error)
    alert('加载用户失败')
  }
}

const getRoleBadge = (role) => {
  const map = {
    'ADMIN': 'badge badge-danger',
    'USER': 'badge badge-info'
  }
  return map[role] || 'badge badge-info'
}

const getRoleText = (role) => {
  const map = {
    'ADMIN': '管理员',
    'USER': '普通用户'
  }
  return map[role] || '普通用户'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

const showAddModal = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: null,
    username: '',
    email: '',
    password: '',
    role: 'USER',
    enabled: true
  })
  showModal.value = true
}

const editUser = (user) => {
  isEdit.value = true
  Object.assign(formData, {
    id: user.id,
    username: user.username,
    email: user.email,
    password: '',
    role: user.role,
    enabled: user.enabled
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitUser = async () => {
  try {
    if (isEdit.value) {
      if (!formData.password || formData.password.length < 6) {
        alert('编辑用户时密码为必填项，且长度应为6-100个字符')
        return
      }
      const res = await userApi.updateUser(formData.id, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        enabled: formData.enabled
      })
      if (res.success) {
        alert('更新成功')
        loadUsers()
        closeModal()
      } else {
        alert(res.message || '更新失败')
      }
    } else {
      if (!formData.password || formData.password.length < 6) {
        alert('密码长度应为6-100个字符')
        return
      }
      const res = await userApi.createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        enabled: formData.enabled
      })
      if (res.success) {
        alert('创建成功')
        loadUsers()
        closeModal()
      } else {
        alert(res.message || '创建失败')
      }
    }
  } catch (error) {
    alert(error.message || '操作失败')
  }
}

const deleteUser = async (id) => {
  if (!confirm('确定删除该用户吗？')) return
  try {
    const res = await userApi.deleteUser(id)
    if (res.success) {
      alert('删除成功')
      loadUsers()
    } else {
      alert(res.message || '删除失败')
    }
  } catch (error) {
    alert(error.message || '删除失败')
  }
}

const resetPassword = (user) => {
  resetPwdForm.id = user.id
  resetPwdForm.username = user.username
  resetPwdForm.password = ''
  showResetPwdModal.value = true
}

const closeResetPwdModal = () => {
  showResetPwdModal.value = false
}

const submitResetPassword = async () => {
  try {
    if (!resetPwdForm.password || resetPwdForm.password.length < 6) {
      alert('密码长度应为6-100个字符')
      return
    }
    
    const res = await userApi.updateUser(resetPwdForm.id, {
      password: resetPwdForm.password
    })
    if (res.success) {
      alert('密码重置成功')
      closeResetPwdModal()
    } else {
      alert(res.message || '重置失败')
    }
  } catch (error) {
    alert(error.message || '重置失败')
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.close {
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close:hover {
  color: #333;
}
</style>