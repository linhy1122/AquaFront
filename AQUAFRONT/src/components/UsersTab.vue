<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ isAdmin ? '用户列表' : '个人信息' }}</h3>
      <div class="header-actions">
        <button
          v-if="isAdmin"
          class="btn btn-primary btn-sm"
          @click="showAddModal"
        >
          + 新增用户
        </button>
        <button
          v-else
          class="btn btn-primary btn-sm"
          @click="refreshCurrentUser"
        >
          刷新信息
        </button>
      </div>
    </div>

    <div class="card-body">
      <template v-if="isAdmin">
        <div class="toolbar">
          <div class="search-box">
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索用户名或邮箱..."
            >
            <button class="btn btn-primary btn-sm" @click="loadUsers">查询</button>
          </div>
        </div>

        <div v-if="loadError" class="empty-state error-state">
          {{ loadError }}
        </div>
        <div v-else-if="loadingUsers" class="empty-state">
          正在加载用户列表...
        </div>
        <div v-else-if="filteredUsers.length === 0" class="empty-state">
          暂无匹配用户
        </div>
        <div v-else class="table-container">
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
              <tr v-for="user in filteredUsers" :key="user.id">
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
                <td class="action-cell">
                  <button class="btn btn-primary btn-sm" @click="editUser(user)">编辑</button>
                  <button class="btn btn-warning btn-sm" @click="resetPassword(user)">重置密码</button>
                  <button
                    v-if="user.id !== 1"
                    class="btn btn-danger btn-sm"
                    @click="deleteUser(user.id)"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else>
        <div v-if="currentUserLoading && !currentUser" class="empty-state">
          正在加载个人信息...
        </div>
        <div v-else-if="currentUser" class="profile-panel">
          <div class="profile-item">
            <span class="label">用户名</span>
            <span>{{ currentUser.username || '-' }}</span>
          </div>
          <div class="profile-item">
            <span class="label">邮箱</span>
            <span>{{ currentUser.email || '-' }}</span>
          </div>
          <div class="profile-item">
            <span class="label">角色</span>
            <span>
              <span :class="getRoleBadge(currentUser.role)">{{ getRoleText(currentUser.role) }}</span>
            </span>
          </div>
          <div class="profile-item">
            <span class="label">用户状态</span>
            <span :class="currentUser.enabled ? 'badge badge-success' : 'badge badge-danger'">
              {{ currentUser.enabled ? '启用' : '禁用' }}
            </span>
          </div>
          <div class="profile-item">
            <span class="label">用户ID</span>
            <span>{{ currentUser.userId || currentUser.id || '-' }}</span>
          </div>
        </div>
        <div v-else class="empty-state error-state">
          {{ currentUserError || '未能获取个人信息，请重新登录后再试。' }}
        </div>
      </template>
    </div>

    <div v-if="isAdmin && showModal" class="modal" @click.self="closeModal">
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
              <input
                type="password"
                v-model="formData.password"
                required
                placeholder="请输入密码（6-100个字符）"
              >
            </div>
            <div v-if="isEdit" class="form-group">
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

    <div v-if="isAdmin && showResetPwdModal" class="modal" @click.self="closeResetPwdModal">
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
              <input
                type="password"
                v-model="resetPwdForm.password"
                required
                placeholder="请输入新密码（6-100个字符）"
              >
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
import { computed, onMounted, reactive, ref } from 'vue'
import { userApi } from '@/api'
import { useCurrentUser, loadCurrentUser } from '@/composables/useCurrentUser'

defineOptions({ name: 'UsersTab' })

const { currentUser, currentUserLoading, currentUserError } = useCurrentUser()
const users = ref([])
const searchKeyword = ref('')
const showModal = ref(false)
const showResetPwdModal = ref(false)
const isEdit = ref(false)
const loadingUsers = ref(false)
const loadError = ref('')
const storedRole = ref(localStorage.getItem('role') || '')

const isAdmin = computed(() => {
  return (currentUser.value?.role || storedRole.value) === 'ADMIN'
})

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
  email: '',
  role: 'USER',
  enabled: true,
  password: ''
})

const filteredUsers = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  if (!keyword) {
    return users.value
  }
  return users.value.filter(user => {
    const username = String(user.username || '').toLowerCase()
    const email = String(user.email || '').toLowerCase()
    return username.includes(keyword) || email.includes(keyword)
  })
})

const loadUsers = async () => {
  if (!isAdmin.value) {
    loadError.value = '需要管理员权限才能查看用户列表。'
    return
  }

  loadingUsers.value = true
  loadError.value = ''
  try {
    const res = await userApi.getUsers()
    if (res.success) {
      users.value = Array.isArray(res.data?.users) ? res.data.users : []
    } else {
      loadError.value = res.message || '加载用户列表失败'
      users.value = []
    }
  } catch (error) {
    if (error?.status === 403) {
      loadError.value = '当前账号没有管理员权限，无法查看用户列表。'
    } else {
      loadError.value = error?.message || '加载用户列表失败'
    }
    users.value = []
  } finally {
    loadingUsers.value = false
  }
}

const refreshCurrentUser = async () => {
  await loadCurrentUser(true)
}

const getRoleBadge = (role) => {
  const map = {
    ADMIN: 'badge badge-danger',
    USER: 'badge badge-info'
  }
  return map[role] || 'badge badge-info'
}

const getRoleText = (role) => {
  const map = {
    ADMIN: '管理员',
    USER: '普通用户'
  }
  return map[role] || '普通用户'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

const showAddModal = () => {
  if (!isAdmin.value) return
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
  if (!isAdmin.value) return
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
    if (!formData.password || formData.password.length < 6) {
      alert('密码长度应为6-100个字符')
      return
    }

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      enabled: formData.enabled
    }
    if (isEdit.value) {
      payload.role = formData.role
    }

    const res = isEdit.value
      ? await userApi.updateUser(formData.id, payload)
      : await userApi.createUser(payload)

    if (res.success) {
      alert(isEdit.value ? '更新成功' : '创建成功')
      await loadUsers()
      closeModal()
    } else {
      alert(res.message || (isEdit.value ? '更新失败' : '创建失败'))
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
      await loadUsers()
    } else {
      alert(res.message || '删除失败')
    }
  } catch (error) {
    alert(error.message || '删除失败')
  }
}

const resetPassword = (user) => {
  if (!isAdmin.value) return
  resetPwdForm.id = user.id
  resetPwdForm.username = user.username
  resetPwdForm.email = user.email
  resetPwdForm.role = user.role
  resetPwdForm.enabled = user.enabled
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

    const payload = {
      username: resetPwdForm.username,
      email: resetPwdForm.email,
      password: resetPwdForm.password,
      role: resetPwdForm.role,
      enabled: resetPwdForm.enabled
    }

    const res = await userApi.updateUser(resetPwdForm.id, payload)
    if (res.success) {
      alert('密码重置成功')
      closeResetPwdModal()
      await loadUsers()
    } else {
      alert(res.message || '重置失败')
    }
  } catch (error) {
    alert(error.message || '重置失败')
  }
}

onMounted(async () => {
  await loadCurrentUser(true)
  if (isAdmin.value) {
    await loadUsers()
  }
})
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: #666;
  background: #fafafa;
  border: 1px dashed #ddd;
  border-radius: 6px;
}

.error-state {
  color: #d4380d;
  background: #fff2e8;
  border-color: #ffbb96;
}

.profile-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fff;
}

.profile-item .label {
  font-size: 12px;
  color: #999;
}

.action-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
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

@media (max-width: 768px) {
  .profile-panel {
    grid-template-columns: 1fr;
  }
}
</style>
