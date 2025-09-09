<script setup lang="ts">
definePageMeta({
  layout: 'company',
  name: 'company-comments'
})

import { reactive, ref, onMounted } from 'vue'
import { UserFilled } from '@element-plus/icons-vue'
import { useCompanyAuthStore } from '~/stores/company/useAuthStore'
import { useCompanyCommentReviews } from '~/composables/api/company/useCompanyCommentReviews'

const filters = reactive({
  programName: '',
  rating: 'all',
  dateSort: 'desc',
  dateRange: ''
})

const comments = ref<any[]>([])
const loading = ref(false)
const loadError = ref<string | null>(null)

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
  loading.value = true
  loadError.value = null
  // 開發階段若無 companyId，使用 9 做測試
  const companyId = authStore.companyId ?? 9
  console.info('[Comments] loadData start', {
    companyId,
    page: pagination.currentPage,
    limit: pagination.pageSize
  })
  try {
    const { data, error } = await fetchEvaluations(companyId, { page: pagination.currentPage, limit: pagination.pageSize })
    if (error.value) {
      console.error('取得企業評價資料失敗:', error.value)
      comments.value = []
      pagination.total = 0
      loadError.value = (error.value as any)?.message || '取得資料失敗'
      return
    }
    if (data.value) {
      pagination.total = data.value.TotalCount || 0
      comments.value = (data.value.Data || []).map((item) => ({
        id: item.Id,
        author: {
          name: item.ParticipantName,
          // 直接採用後端 Headshot（只處理空白字元編碼）
          avatar: (() => {
            const raw = item.Headshot || ''
            if (!raw) return ''
            return encodeURI(raw)
          })(),
          role: item.Identity?.title || '—',
          age: item.ParticipantAge
        },
        program: item.ProgramPlanName,
        rating: item.Score,
        date: formatDate(item.EvaluationDate),
        text: item.Comment
      }))
      console.info('[Comments] response', { total: pagination.total, count: comments.value.length })
    }
  } catch (e: any) {
    loadError.value = e?.message || '取得資料失敗'
  } finally {
    loading.value = false
  }
}

function handlePageChange (page: number) {
  pagination.currentPage = page
  loadData()
}

onMounted(() => {
  console.info('[Comments] onMounted', {
    isLoggedIn: authStore.isLoggedIn,
    companyId: authStore.companyId,
    hasToken: !!authStore.token
  })
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
        <div class="flex-grow" style="min-width: 260px; max-width: 720px; flex-basis: 40%;">
          <el-input id="programName" v-model="filters.programName" placeholder="搜尋計畫名稱..." />
        </div>
        <div>
          <el-select id="rating" v-model="filters.rating" placeholder="全部分數" style="width: 160px">
            <el-option label="全部分數" value="all" />
            <el-option label="5 星" value="5" />
            <el-option label="4 星" value="4" />
            <el-option label="3 星" value="3" />
            <el-option label="2 星" value="2" />
            <el-option label="1 星" value="1" />
          </el-select>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <el-select id="dateSort" v-model="filters.dateSort" style="width: 140px">
              <el-option label="日期:新到舊" value="desc" />
              <el-option label="日期:舊到新" value="asc" />
            </el-select>
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

      <el-skeleton :loading="loading" animated :throttle="{ leading: 200, trailing: 200, initVal: true }" :count="3">
        <template #template>
          <div class="py-6 flex gap-4">
            <el-skeleton-item variant="circle" style="width:40px;height:40px" />
            <div class="flex-1">
              <div class="flex flex-wrap justify-between items-center gap-2">
                <div class="flex items-center gap-2 text-sm">
                  <el-skeleton-item variant="text" style="width:120px" />
                  <el-skeleton-item variant="text" style="width:48px" />
                  <el-skeleton-item variant="text" style="width:80px" />
                  <el-skeleton-item variant="text" style="width:160px" />
                </div>
                <div class="flex items-center gap-2">
                  <el-skeleton-item variant="text" style="width:80px" />
                  <el-skeleton-item variant="text" style="width:80px" />
                </div>
              </div>
              <el-skeleton-item variant="p" style="margin-top:8px" />
            </div>
          </div>
        </template>
        <template #default>
          <div class="divide-y divide-gray-200">
            <div v-for="comment in comments" :key="comment.id" class="py-6 flex gap-4">
              <el-avatar :size="40" :src="comment.author.avatar">
                <template #default>
                  <el-icon><UserFilled /></el-icon>
                </template>
              </el-avatar>
              <div class="flex-1">
                <div class="flex flex-wrap justify-between items-center gap-2">
                  <div class="flex items-center gap-2 text-sm">
                    <span class="font-bold">{{ comment.author.name }}</span>
                    <span>{{ comment.author.age }}歲</span>
                    <span class="text-gray-500">{{ comment.author.role }}</span>
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
        </template>
      </el-skeleton>

      <div class="mt-6 flex justify-between items-center">
        <div>
          <span class="text-sm text-gray-600 mr-2">每頁顯示:</span>
          <el-select v-model="pagination.pageSize" placeholder="Select" style="width: 120px">
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

