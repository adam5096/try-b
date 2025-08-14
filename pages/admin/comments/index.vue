<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

definePageMeta({
  name: 'admin-comments',
  layout: 'admin',
})

type ReviewStatus = 'systemApproved' | 'systemRejected' | 'manualConfirmed' | 'manualRejected'

interface CommentItem {
  id: number
  programTitle: string
  programId: string
  reviewer: string
  rating: number
  status: ReviewStatus
  date: string // YYYY/MM/DD
}

const query = ref('')
const filterRating = ref<'all' | '5' | '4plus' | '3plus'>('all')
const sortBy = ref<'recent' | 'oldest'>('recent')

const allComments = ref<CommentItem[]>([
  {
    id: 12345,
    programTitle: '軟體工程師體驗營',
    programId: 'TW-TPE-2025-0142',
    reviewer: '林美玲',
    rating: 5,
    status: 'manualRejected',
    date: '2025/11/28',
  },
  {
    id: 12344,
    programTitle: '咖啡職人體驗',
    programId: 'TW-TPE-2025-0142',
    reviewer: '王大明',
    rating: 4,
    status: 'systemApproved',
    date: '2025/11/27',
  },
  {
    id: 12343,
    programTitle: '資料分析一日體驗',
    programId: 'TW-TPE-2025-0108',
    reviewer: '陳小安',
    rating: 3,
    status: 'systemRejected',
    date: '2025/11/21',
  },
])

const statusLabelMap: Record<ReviewStatus, string> = {
  systemApproved: '已通過(系統)',
  systemRejected: '已拒絕(系統)',
  manualConfirmed: '已確認(人工)',
  manualRejected: '已拒絕(人工)',
}

const statusClassMap: Record<ReviewStatus, string> = {
  systemApproved: 'bg-green-50 text-green-700 border border-green-200',
  systemRejected: 'bg-red-50 text-red-700 border border-red-200',
  manualConfirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  manualRejected: 'bg-red-50 text-red-700 border border-red-200',
}

const visibleComments = computed(() => {
  const q = query.value.trim().toLowerCase()
  const filtered = allComments.value.filter((c) => {
    const matchQuery = q
      ? c.programTitle.toLowerCase().includes(q) || c.reviewer.toLowerCase().includes(q) || c.programId.toLowerCase().includes(q)
      : true
    const matchRating = (() => {
      if (filterRating.value === 'all') return true
      if (filterRating.value === '5') return c.rating === 5
      if (filterRating.value === '4plus') return c.rating >= 4
      if (filterRating.value === '3plus') return c.rating >= 3
      return true
    })()
    return matchQuery && matchRating
  })

  const sorted = filtered.sort((a, b) => {
    if (sortBy.value === 'recent') return a.date < b.date ? 1 : a.date > b.date ? -1 : 0
    return a.date > b.date ? 1 : a.date < b.date ? -1 : 0
  })
  return sorted
})

const total = computed(() => visibleComments.value.length)
</script>


<template>
  <div class="mx-auto w-full max-w-container-admin space-y-6">
    <!-- Title -->
    <section class="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 md:text-3xl">體驗者留言評價列表</h1>
        <p class="mt-1 text-sm text-gray-600">查看並管理所有體驗者對企業的評價</p>
      </div>
    </section>

    <!-- Toolbar -->
    <section class="rounded border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <!-- Left: filters -->
        <div class="flex flex-wrap items-center gap-2 md:gap-3">
          <el-select v-model="filterRating" class="w-[150px]" placeholder="全部評價">
            <el-option label="全部評價" value="all" />
            <el-option label="僅五星" value="5" />
            <el-option label="4 星以上" value="4plus" />
            <el-option label="3 星以上" value="3plus" />
          </el-select>

          <el-select v-model="sortBy" class="w-[150px]" placeholder="最新評價">
            <el-option label="最新評價" value="recent" />
            <el-option label="最舊優先" value="oldest" />
          </el-select>
        </div>

        <!-- Right: search -->
        <el-input
          v-model="query"
          placeholder="搜尋評價..."
          clearable
          :suffix-icon="Search"
          class="w-full xl:w-[360px]"
        />
      </div>
    </section>

    <!-- List (Table on md+/Cards on < md) -->
    <section class="space-y-4">
      <!-- Table -->
      <div class="hidden overflow-hidden rounded border border-gray-200 bg-white shadow-sm md:block">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-brand-gray">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">體驗計畫名稱</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">體驗計畫ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">體驗者</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">評分</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">狀態</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">日期</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="c in visibleComments" :key="c.id" class="hover:bg-brand-gray/50">
              <td class="px-6 py-4 text-gray-900">{{ c.id }}</td>
              <td class="px-6 py-4 text-gray-900">
                <div class="font-medium">{{ c.programTitle }}</div>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ c.programId }}</td>
              <td class="px-6 py-4 text-gray-900">
                <div class="flex items-center gap-2">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600">用</div>
                  <span>{{ c.reviewer }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <el-rate :model-value="c.rating" disabled disabled-void-color="#d1d5db" />
              </td>
              <td class="px-6 py-4">
                <span class="inline-block rounded px-2 py-1 text-xs" :class="statusClassMap[c.status]">{{ statusLabelMap[c.status] }}</span>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ c.date }}</td>
              <td class="px-6 py-4 text-left">
                <button class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-brand-gray">詳情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Cards -->
      <div class="space-y-3 md:hidden">
        <div v-for="c in visibleComments" :key="c.id" class="rounded border border-gray-200 bg-white p-4 shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600">用</div>
                <div class="truncate font-semibold text-gray-900">{{ c.reviewer }}</div>
              </div>
              <div class="mt-1 text-sm text-gray-700">{{ c.programTitle }}</div>
              <div class="mt-0.5 text-xs text-gray-500">{{ c.programId }}</div>
            </div>
            <span class="shrink-0 rounded px-2 py-1 text-xs" :class="statusClassMap[c.status]">{{ statusLabelMap[c.status] }}</span>
          </div>
          <div class="mt-2 flex items-center justify-between">
            <el-rate :model-value="c.rating" disabled disabled-void-color="#d1d5db" />
            <div class="text-sm text-gray-700">{{ c.date }}</div>
          </div>
          <div class="mt-3 flex justify-end">
            <button class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-brand-gray">詳情</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer / Pagination info -->
    <section class="flex items-center justify-between text-sm text-gray-600">
      <div>共 {{ total }} 筆結果</div>
      <div class="flex items-center gap-2">
        <button class="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-brand-gray">上一頁</button>
        <button class="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-brand-gray">下一頁</button>
      </div>
    </section>
  </div>
</template>
