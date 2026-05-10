<template>
  <div class="card">
    <div class="card-header">
      <h3>饲料库存明细</h3>
      <button class="btn btn-success btn-sm">+ 入库登记</button>
    </div>
    <div class="card-body">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>饲料类型</th>
              <th>当前库存(kg)</th>
              <th>安全库存(kg)</th>
              <th>库存状态</th>
              <th>最近入库日期</th>
              <th>日均消耗(kg)</th>
              <th>预计可用天数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>草鱼饲料</td>
              <td>850</td>
              <td>500</td>
              <td><span class="badge badge-success">充足</span></td>
              <td>2026-04-10</td>
              <td>25</td>
              <td>34天</td>
              <td>
                <button class="btn btn-primary btn-sm">出库</button>
                <button class="btn btn-warning btn-sm">入库</button>
              </td>
            </tr>
            <tr>
              <td>鲤鱼饲料</td>
              <td>920</td>
              <td>600</td>
              <td><span class="badge badge-success">充足</span></td>
              <td>2026-04-12</td>
              <td>30</td>
              <td>30天</td>
              <td>
                <button class="btn btn-primary btn-sm">出库</button>
                <button class="btn btn-warning btn-sm">入库</button>
              </td>
            </tr>
            <tr>
              <td>综合饲料</td>
              <td>680</td>
              <td>500</td>
              <td><span class="badge badge-warning">偏低</span></td>
              <td>2026-04-08</td>
              <td>20</td>
              <td>34天</td>
              <td>
                <button class="btn btn-primary btn-sm">出库</button>
                <button class="btn btn-warning btn-sm">入库</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'FeedStockCard' })
</script>