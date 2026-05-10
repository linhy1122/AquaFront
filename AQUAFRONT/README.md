# AQUAFRONT - Vue 3 前端项目

基于 **Vue 3** + **Vite** + **Vue Router** 构建的智慧水产养殖系统前端应用。

## 项目结构

```
AQUAFRONT/
├── src/
│   ├── main.js                 # 应用入口
│   ├── App.vue                 # 根组件
│   ├── style.css               # 全局样式
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
- 原生 CSS (无第三方 CSS 框架)