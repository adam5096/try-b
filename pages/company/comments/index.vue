<template>
  <div class="space-y-6">
    <div class="p-4 bg-white rounded-lg shadow-sm">
      <p class="text-sm text-gray-700">
        目前的方案 日期: 2025/7/1 - 2025/8/1 10:10AM 體驗人數上限 10 人 剩餘體驗人數 5 人
      </p>
    </div>

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

<script setup lang="ts">
import { reactive, ref } from 'vue'

definePageMeta({
  layout: 'company',
  name: 'company-comments'
})

const filters = reactive({
  programName: '',
  rating: 'all',
  dateSort: 'desc',
  dateRange: ''
})

const comments = ref([
  {
    id: 1,
    author: {
      name: '林小美',
      avatar: 'https://i.pravatar.cc/40?u=1',
      role: '大學生',
      age: 23
    },
    program: '行銷企劃體驗',
    rating: 5,
    date: '2025/10/15',
    text: '這次的行銷企劃體驗非常棒! 我學到了很多實用的技能, 特別是社群媒體行銷策略的部分。企業導師非常專業, 耐心解答我所有問題, 也給了我很多寶貴的建議。整個過程安排得很合理, 讓我能夠充分了解行銷企劃的日常工作內容。這次體驗對我未來的職涯規劃有很大幫助!'
  },
  {
    id: 2,
    author: {
      name: '張志明',
      avatar: 'https://i.pravatar.cc/40?u=2',
      role: '大學生',
      age: 23
    },
    program: '數據分析師體驗',
    rating: 4,
    date: '2025/10/12',
    text: '數據分析師體驗計畫內容豐富, 讓我了解了實際工作中如何應用數據分析工具。企業提供的案例很有實際參考價值, 也讓我學習到了如何從數據中找出有價值的洞見。不過我認為體驗時間可以再長一些, 這樣能更深入學習一些進階技巧。整體來說是很好的體驗, 推薦給想了解數據分析工作的朋友。'
  },
  {
    id: 3,
    author: {
      name: '陳雅婷',
      avatar: 'https://i.pravatar.cc/40?u=3',
      role: '大學生',
      age: 23
    },
    program: '人力資源專員體驗',
    rating: 5,
    date: '2025/10/08',
    text: '人力資源專員體驗讓我獲益良多! 從招聘流程、員工培訓到績效管理, 每個環節都有詳細的講解和實際操作。特別感謝李主管的耐心指導, 讓我對HR工作有了全面的認識。企業文化非常友善, 團隊成員都很樂於分享經驗。這次體驗確實幫助我確定了未來想往人資方向發展的決心。'
  },
  {
    id: 4,
    author: {
      name: '黃建國',
      avatar: 'https://i.pravatar.cc/40?u=4',
      role: '大學生',
      age: 23
    },
    program: '軟體工程師體驗',
    rating: 3,
    date: '2025/10/05',
    text: '軟體工程師體驗計畫內容與描述有些出入。雖然能接觸到實際開發環境, 但指導不夠充分, 有時候遇到問題需要自己解決。技術stack比較舊, 希望能更新一下。團隊成員都很友善, 但整體安排可以更有系統性。建議增加更多實際coding的機會和code review的環節, 這樣對學習會更有幫助。'
  },
  {
    id: 5,
    author: {
      name: '李佳穎',
      avatar: 'https://i.pravatar.cc/40?u=5',
      role: '大學生',
      age: 23
    },
    program: '財務分析師體驗',
    rating: 4,
    date: '2025/10/01',
    text: '財務分析師體驗計畫內容充實, 讓我了解了財務分析的實際工作流程和重要性。企業提供的案例研究很有深度, 讓我能夠應用所學知識。指導人員專業且耐心, 解答了我許多疑問。唯一建議是可以增加更多與其他部門合作的機會, 了解財務分析如何影響企業決策。整體來說是很棒的學習經驗!'
  }
])

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 24
})

function handlePageChange (page: number) {
  pagination.currentPage = page
}
</script>