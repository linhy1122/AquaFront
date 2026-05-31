# AQUAFRONT - Vue 3 前端项目

基于 **Vue 3** + **Vite** + **Vue Router** 构建的智慧水产养殖系统前端应用。

## 项目结构

```
AQUAFRONT/
├── src/
│   ├── main.js                 # 应用入口
│   ├── App.vue                 # 根组件
│   ├── style.css               # 全局样式
│   ├── api/                    # API 服务层
│   │   ├── request.js          # Axios 实例
│   │   ├── auth.js             # 认证 API
│   │   ├── user.js             # 用户 API
│   │   └── index.js            # 统一导出
│   ├── router/
│   │   └── index.js           # 路由配置
│   ├── layouts/
│   │   └── MainLayout.vue     # 主布局组件
│   ├── components/            # 可复用组件
│   │   ├── Sidebar.vue
│   │   ├── Header.vue
│   │   ├── MonitorCard.vue
│   │   ├── EquipmentCard.vue
│   │   ├── AlarmCard.vue
│   │   ├── FeedingCard.vue
│   │   ├── StockRecordCard.vue
│   │   ├── FeedStockCard.vue
│   │   ├── PondBasicTab.vue
│   │   ├── PondSpeciesTab.vue
│   │   ├── PondStockTab.vue
│   │   ├── ComparisonTable.vue
│   │   ├── WaterStandardTable.vue
│   │   ├── EquipmentStats.vue
│   │   ├── AeratorCard.vue
│   │   ├── PumpCard.vue
│   │   ├── EquipmentStatsTable.vue
│   │   ├── FeedingRecordsTab.vue
│   │   ├── FeedingPlanTab.vue
│   │   ├── FeedingStatsTab.vue
│   │   ├── ThresholdTab.vue
│   │   ├── AlarmRecordsTab.vue
│   │   ├── AlarmSettingsTab.vue
│   │   ├── DailyReportTab.vue
│   │   ├── MonthlyReportTab.vue
│   │   ├── AnalysisTab.vue
│   │   ├── UsersTab.vue
│   │   ├── RolesTab.vue
│   │   └── LogsTab.vue
│   └── views/                 # 页面组件
│       ├── Login.vue
│       ├── Dashboard.vue
│       ├── Warehouse.vue
│       ├── Pond.vue
│       ├── Monitoring.vue
│       ├── Equipment.vue
│       ├── Feeding.vue
│       ├── Alarm.vue
│       ├── Report.vue
│       └── User.vue
├── index.html
├── package.json
└── vite.config.js
```

## 路由配置

| 路径 | 组件 | 说明 |
|------|------|------|
| /login | Login | 登录页面 |
| /dashboard | Dashboard | 仪表盘 |
| /warehouse | Warehouse | 仓储管理 |
| /pond | Pond | 塘口管理 |
| /monitoring | Monitoring | 水质监测 |
| /equipment | Equipment | 设备监控 |
| /feeding | Feeding | 投喂管理 |
| /alarm | Alarm | 报警管理 |
| /report | Report | 报表统计 |
| /user | User | 用户管理 |

## 重构说明

### 原型到 Vue 3 迁移

1. **HTML 原型分析**
   - 分析 FR 文件夹下 12 个静态 HTML 页面
   - 提取公共样式和布局结构
   - 识别可复用组件

2. **组件化拆分**
   - **布局组件**: Sidebar、Header、MainLayout
   - **业务组件**: 各功能模块的 Tab 组件
   - **展示组件**: MonitorCard、EquipmentCard、AlarmCard、FeedingCard

3. **路由实现**
   - 使用 Vue Router 4 实现 SPA 路由
   - 登录页面独立路由
   - 其他页面使用 MainLayout 布局

4. **样式迁移**
   - 将原型 CSS 迁移到 style.css
   - 适配 Vue 的 scoped 样式
   - 保留原有视觉效果

## 开发命令

```bash
# 安装依赖
npm install

# 开发环境
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 技术栈

- Vue 3 (Composition API)
- Vue Router 4
- Vite
- Axios
- 原生 CSS (无第三方 CSS 框架)

## API 集成

### 安装依赖
```bash
npm install axios
```

### API 服务结构
```
src/api/
├── request.js          # Axios 实例，自动添加 Token，处理响应
│                       # 基础路径: http://localhost:8899/Aqua
├── auth.js             # 认证相关 API
│   ├── getCaptcha()             # 获取验证码 (#1)
│   ├── login(data)              # 用户登录 (#2)
│   ├── register(data)           # 用户注册 (#3)
│   ├── createUser(data)         # 创建用户 (#4)
│   ├── getCurrentUser()         # 获取当前用户信息 (#5)
│   ├── logout()                 # 退出登录 (#6)
│   └── adminTest()              # 管理员权限测试 (#7)
├── user.js             # 用户管理 API (ADMIN)
│   ├── getUsers()               # 用户列表 (#8)
│   ├── getUser(id)              # 用户详情 (#9)
│   ├── updateUser(id, data)     # 更新用户 (#10)
│   └── deleteUser(id)           # 删除用户 (#11)
├── dashboard.js        # 数据概览 API
│   └── getSummary()             # 获取数据概览 (#12)
├── stocking.js         # 放养记录 API
│   ├── list(params)             # 分页查询放养记录 (#13)
│   ├── add(data)                # 新增放养记录 (#14)
│   ├── update(data)             # 编辑放养记录 (#15)
│   ├── delete(id)               # 删除放养记录 (#16)
│   └── listByPond(params)       # 按塘口查询放养记录 (#16b)
├── feed.js             # 饲料库存 API
│   ├── inventory(params)        # 查询饲料库存 (#17)
│   ├── inStock(data)            # 饲料入库 (#18)
│   ├── outStock(data)           # 饲料出库 (#19)
│   └── records(params)          # 出入库流水明细 (#20)
├── pond.js             # 塘口管理 API
│   ├── list(params)             # 分页查询塘口列表 (#21)
│   ├── add(data)                # 新增塘口 (#22)
│   ├── update(data)             # 编辑塘口 (#23)
│   ├── delete(id)               # 删除塘口 (#24)
│   └── getDetail(id)            # 获取塘口详情 (#25)
├── statistic.js        # 统计数据 API
│   ├── getPondStatistic()       # 塘口统计数据 (#26)
│   └── getStockingStatistic()   # 放养统计数据 (#27)
└── index.js            # 统一导出（7 个模块）
```

### 使用示例
```javascript
import { authApi, userApi } from '@/api'

// 登录
const res = await authApi.login({ username, password, captcha })
if (res.success) {
  localStorage.setItem('token', res.data.token)
}

// 获取用户列表（需 ADMIN 角色）
const users = await userApi.getUsers()
```

## 已完成功能

### 认证管理
- ✅ 登出 (`POST /api/auth/logout`)
- ✅ 获取当前用户 (`GET /api/auth/me`)

### 用户管理 (ADMIN)
- ✅ 用户列表 (`GET /api/admin/users`)
- ✅ 新增用户 (`POST /api/admin/users`)
- ✅ 用户详情 (`GET /api/admin/users/{id}`)
- ✅ 编辑用户 (`PUT /api/admin/users/{id}`)
- ✅ 重置密码（单独弹窗）
- ✅ 删除用户 (`DELETE /api/admin/users/{id}`)

### 数据概览
- ✅ 获取首页概览数据 (`GET /api/dashboard/summary`)

### 仓储管理
- ✅ 饲料库存查询 (`GET /api/feed/inventory`)
- ✅ 饲料入库 (`POST /api/feed/inStock`)
- ✅ 饲料出库 (`POST /api/feed/outStock`)
- ✅ 出入库流水明细 (`GET /api/feed/records`)

### 塘口管理
- ✅ 塘口列表 (`GET /api/pond/list`)
- ✅ 新增塘口 (`POST /api/pond/add`)
- ✅ 编辑塘口 (`PUT /api/pond/update`)
- ✅ 删除塘口 (`DELETE /api/pond/delete/{id}`)
- ✅ 塘口详情 (`GET /api/pond/{id}`)
- ✅ 塘口统计 (`GET /api/statistic/pond`)

### 放养记录
- ✅ 放养记录查询 (`GET /api/stocking/list`)
- ✅ 按塘口查询 (`GET /api/stocking/listByPond`)
- ✅ 新增放养记录 (`POST /api/stocking/add`)
- ✅ 编辑放养记录 (`PUT /api/stocking/update`)
- ✅ 删除放养记录 (`DELETE /api/stocking/delete/{id}`)
- ✅ 放养统计 (`GET /api/statistic/stocking`)