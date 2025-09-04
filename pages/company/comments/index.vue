<script setup lang="ts">
definePageMeta({
  layout: 'company',
  name: 'company-comments'
})

import { reactive, ref, onMounted } from 'vue'
import { useCompanyAuthStore } from '~/stores/company/useAuthStore'
import { useCompanyCommentReviews } from '~/composables/api/company/useCompanyCommentReviews'

const filters = reactive({
  programName: '',
  rating: 'all',
  dateSort: 'desc',
  dateRange: ''
})

const comments = ref<any[]>([])

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const authStore = useCompanyAuthStore()
const { fetchEvaluations } = useCompanyCommentReviews()

function formatDate(input: string) {
  const d = new Date(input)
  if (isNaN(d.getTime())) return input
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}/${m}/${day}`
}

async function loadData() {
  // 開發階段若無 companyId，使用 9 做測試
  const companyId = authStore.companyId ?? 9
  const { data, error } = await fetchEvaluations(companyId, { page: pagination.currentPage, limit: pagination.pageSize })
  if (error.value) {
    console.error('取得企業評價資料失敗:', error.value)
    comments.value = []
    pagination.total = 0
    return
  }
  if (data.value) {
    pagination.total = data.value.TotalCount || 0
    comments.value = (data.value.Data || []).map((item) => ({
      id: item.Id,
      author: {
        name: item.ParticipantName,
        avatar: `https://i.pravatar.cc/40?u=${encodeURIComponent(item.ParticipantName)}-${item.Id}`,
        role: item.ParticipantIdentity?.title || '—',
        age: item.ParticipantAge
      },
      program: item.ProgramName,
      rating: item.Score,
      date: formatDate(item.EvaluationDate),
      text: item.Comment
    }))
  }
}

function handlePageChange (page: number) {
  pagination.currentPage = page
  loadData()
}

onMounted(() => {
  loadData()
})
</script>


<template>
  <div class="space-y-6">
    <CompanyPlanStatusHeader />

    <h1 class="text-2xl font-bold">
      體驗者評價管理
    </h1>

    <el-card>
      <div class="flex flex-wrap items-end gap-x-6 gap-y-4">
        <div class="flex-grow">
          <label for="programName" class="block text-sm font-medium text-gray-700 mb-1">計畫名稱</label>
          <el-input id="programName" v-model="filters.programName" placeholder="搜尋計畫名稱..." />
        </div>
        <div>
          <label for="rating" class="block text-sm font-medium text-gray-700 mb-1">評價分數</label>
          <el-select id="rating" v-model="filters.rating" placeholder="全部分數" class="w-full min-w-form-control md:max-w-form-select">
            <el-option label="全部分數" value="all" />
            <el-option label="5 星" value="5" />
            <el-option label="4 星" value="4" />
            <el-option label="3 星" value="3" />
            <el-option label="2 星" value="2" />
            <el-option label="1 星" value="1" />
          </el-select>
        </div>
        <div>
          <label for="dateSort" class="block text-sm font-medium text-gray-700 mb-1">日期範圍</label>
          <div class="flex items-center gap-2">
            <el-select id="dateSort" v-model="filters.dateSort" class="w-full min-w-form-control md:max-w-form-select">
              <el-option label="日期:新到舊" value="desc" />
              <el-option label="日期:舊到新" value="asc" />
            </el-select>
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
            />
          </div>
        </div>
        <div>
          <el-button type="primary">
            篩選
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span>評價列表</span>
          <span class="text-sm text-gray-500">共 {{ pagination.total }} 則評價</span>
        </div>
      </template>

      <div class="divide-y divide-gray-200">
        <div v-for="comment in comments" :key="comment.id" class="py-6 flex gap-4">
          <el-avatar :size="40" :src="comment.author.avatar" />
          <div class="flex-1">
            <div class="flex flex-wrap justify-between items-center gap-2">
              <div class="flex items-center gap-2 text-sm">
                <span class="font-bold">{{ comment.author.name }}</span>
                <span>{{ comment.author.role }} | {{ comment.author.age }}歲</span>
                <span class="text-gray-500">{{ comment.program }}</span>
              </div>
              <div class="flex items-center gap-2">
                <el-rate :model-value="comment.rating" disabled show-score text-color="#ff9900" :score-template="`${comment.rating.toFixed(1)}`" />
                <span class="text-sm text-gray-500">{{ comment.date }}</span>
              </div>
            </div>
            <p class="mt-2 text-gray-700">
              {{ comment.text }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-between items-center">
        <div>
          <span class="text-sm text-gray-600 mr-2">每頁顯示:</span>
          <el-select v-model="pagination.pageSize" placeholder="Select" class="w-full min-w-form-control md:max-w-form-select">
            <el-option label="10 筆" :value="10" />
            <el-option label="20 筆" :value="20" />
            <el-option label="50 筆" :value="50" />
          </el-select>
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pagination.total"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          prev-text="上一頁"
          next-text="下一頁"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

