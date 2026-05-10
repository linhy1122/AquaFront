<template>
  <div class="card fade-in">
    <div class="card-header">
      <h3>今日投喂记录</h3>
      <router-link to="/feeding" class="btn btn-primary btn-sm">查看全部</router-link>
    </div>
    <div class="card-body">
      <table>
        <thead>
          <tr>
            <th>塘口</th>
            <th>饲料类型</th>
            <th>投喂量(kg)</th>
            <th>投喂时间</th>
            <th>操作人</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1号塘口</td>
            <td>草鱼饲料</td>
            <td>25</td>
            <td>07:00</td>
            <td>张三</td>
          </tr>
          <tr>
            <td>2号塘口</td>
            <td>鲤鱼饲料</td>
            <td>30</td>
            <td>07:15</td>
            <td>李四</td>
          </tr>
          <tr>
            <td>3号塘口</td>
            <td>综合饲料</td>
            <td>20</td>
            <td>07:30</td>
            <td>王五</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'FeedingCard' })
</script>