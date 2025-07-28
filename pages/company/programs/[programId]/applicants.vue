<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  name: 'company-programs-applicants',
  layout: 'company',
});

const pendingApplicants = [
  {
    id: 1,
    name: '林小美',
    title: 'UI/UX設計師',
    program: '數位行銷體驗計畫',
    department: '行銷部門',
    date: '2025/10/15 14:30',
    status: '待審核',
  },
  {
    id: 2,
    name: '王大明',
    title: '產品經理',
    program: '前端開發體驗計畫',
    department: '技術部門',
    date: '2025/10/14 09:15',
    status: '待審核',
  },
  {
    id: 3,
    name: '張雅琪',
    title: '數據分析師',
    program: '產品管理體驗計畫',
    department: '產品部門',
    date: '2025/10/13 16:45',
    status: '待審核',
  },
  {
    id: 4,
    name: '李志豪',
    title: '人力資源專員',
    program: '數據分析體驗計畫',
    department: '數據部門',
    date: '2025/10/12 11:20',
    status: '待審核',
  },
  {
    id: 5,
    name: '陳美玲',
    title: '軟體工程師',
    program: '人資管理體驗計畫',
    department: '人資部門',
    date: '2025/10/11 13:50',
    status: '待審核',
  },
]

const approvedApplicants = [
  {
    id: 6,
    name: '吳建志',
    title: '行銷專員',
    program: '後端開發體驗計畫',
    department: '技術部門',
    applyDate: '2025/10/10 10:30',
    approveDate: '2025/10/11 14:20',
    status: '已通過',
  },
  {
    id: 7,
    name: '林佳穎',
    title: '財務分析師',
    program: '社群行銷體驗計畫',
    department: '行銷部門',
    applyDate: '2025/10/09 15:45',
    approveDate: '2025/10/10 09:30',
    status: '已拒絕',
  },
  {
    id: 8,
    name: '黃志明',
    title: '客戶服務專員',
    program: '財務管理體驗計畫',
    department: '財務部門',
    applyDate: '2025/10/08 11:15',
    approveDate: '2025/10/09 16:40',
    status: '已通過',
  },
  {
    id: 9,
    name: '楊雅玲',
    title: '後端工程師',
    program: '客戶服務體驗計畫',
    department: '客服部門',
    applyDate: '2025/10/07 09:20',
    approveDate: '2025/10/08 13:10',
    status: '已通過',
  },
]

const pendingSort = ref('date-desc')
const approvedSort = ref('date-desc')
const approvedStatus = ref('all')
</script>

<template>
  <div class="p-6 lg:p-8">
    <div class="mb-6">
      <p class="text-sm text-zinc-500">
        目前的方案 日期：2025/7/1 - 2025/8/1 10:10AM 體驗人數上限 10 人 剩餘體驗人數 5 人
      </p>
    </div>

    <!-- Page Header -->
    <div class="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-zinc-900 flex-shrink-0 whitespace-nowrap">
        體驗者申請列表
      </h1>
      <el-input placeholder="搜尋申請者姓名、計畫名稱..." class="w-full md:w-72">
        <template #append>
          <el-button>
            <span class="material-icons-outlined">search</span>
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- Pending Applicants -->
    <div class="card-base mb-6 bg-white">
      <div class="flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <h2 class="card-title">
          待審核申請 (5)
        </h2>
        <div class="flex items-center gap-2">
          <span class="text-sm text-zinc-500 whitespace-nowrap">排序方式：</span>
          <ClientOnly>
            <el-select v-model="pendingSort" size="small" class="w-36">
              <el-option label="日期 - 新到舊" value="date-desc" />
              <el-option label="日期 - 舊到新" value="date-asc" />
            </el-select>
          </ClientOnly>
        </div>
      </div>
      <el-table :data="pendingApplicants" style="width: 100%">
        <el-table-column label="申請者" width="180">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
                <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <div>
                  <p class="font-bold">
                    {{ row.name }}
                  </p>
                  <p class="text-sm text-zinc-500">
                    {{ row.title }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="計畫名稱">
            <template #default="{ row }">
              <p>{{ row.program }}</p>
              <p class="text-sm text-zinc-500">
                {{ row.department }}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="申請日期" />
          <el-table-column label="狀態">
            <template #default="{ row }">
              <span class="tag-amber">{{ row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <el-button type="primary">
              查看
            </el-button>
          </el-table-column>
        </el-table>
      </div>

    <!-- Approved Applicants -->
    <div class="card-base mb-6 bg-white">
      <div class="flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <h2 class="card-title">
          已審核申請 (4)
        </h2>
        <div class="flex flex-wrap items-center justify-end gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-zinc-500 whitespace-nowrap">排序方式：</span>
            <ClientOnly>
              <el-select v-model="approvedSort" size="small" class="w-36">
                <el-option label="日期 - 新到舊" value="date-desc" />
                <el-option label="日期 - 舊到新" value="date-asc" />
              </el-select>
            </ClientOnly>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-zinc-500 whitespace-nowrap">狀態：</span>
            <ClientOnly>
              <el-select v-model="approvedStatus" size="small" class="w-28">
                <el-option label="全部" value="all" />
                <el-option label="已通過" value="approved" />
                <el-option label="已拒絕" value="rejected" />
              </el-select>
            </ClientOnly>
          </div>
        </div>
      </div>
      <el-table :data="approvedApplicants" style="width: 100%">
        <el-table-column label="申請者" width="180">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
                <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <div>
                  <p class="font-bold">
                    {{ row.name }}
                  </p>
                  <p class="text-sm text-zinc-500">
                    {{ row.title }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="計畫名稱">
            <template #default="{ row }">
              <p>{{ row.program }}</p>
              <p class="text-sm text-zinc-500">
                {{ row.department }}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="applyDate" label="申請日期" />
          <el-table-column prop="approveDate" label="審核日期" />
          <el-table-column label="狀態">
            <template #default="{ row }">
              <span :class="{ 'tag-green': row.status === '已通過', 'tag-red': row.status === '已拒絕' }">{{ row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <el-button type="primary">
              查看
            </el-button>
          </el-table-column>
        </el-table>
      </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-zinc-500">
        顯示 1-9 筆，共 9 筆申請
      </p>
      <el-pagination background layout="prev, pager, next" :total="9" />
    </div>
  </div>
</template>