<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  name: 'user-comments',
  layout: 'user',
  middleware: 'user-auth',
});

// 暫時硬編寫，後續由 API 帶入
const totalReviews = ref(24);
// 篩選器狀態（設計圖：審核狀態/日期）
const statusOptions = ['已通過', '已拒絕', '未評價'];
const selectedStatuses = ref<string[]>([]);

const dateSortOptions = [
  { label: '新到舊', value: 'newest' },
  { label: '舊到新', value: 'oldest' },
] as const;
const selectedDateSort = ref<'newest' | 'oldest'>('newest');

function onClearFilters() {
  selectedStatuses.value = [];
  selectedDateSort.value = 'newest';
  currentPage.value = 1;
}

function onApplyFilters() {
  // 預留：之後串接 API 查詢或觸發列表刷新
  currentPage.value = 1;
  filterVisible.value = false; // 套用後關閉篩選面板
}

// 第二部分：列表假資料
type ReviewStatus = '未評價' | '已通過' | '已退回' | '已拒絕';
type ReviewItem = {
  id: number;
  companyName: string;
  programTitle: string;
  status: ReviewStatus;
  rating?: number;
  date?: string;
  reviewText?: string;
  rejectionReason?: string;
  logoUrl?: string;
};

function tagTypeForStatus(status: ReviewStatus): 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case '已通過':
      return 'success';
    case '已退回':
      return 'warning';
    case '已拒絕':
      return 'danger';
    default:
      return 'info';
  }
}

const reviews = ref<ReviewItem[]>([
  {
    id: 1,
    companyName: 'AVC科技公司',
    programTitle: '行銷企業體驗',
    status: '未評價',
  },
  {
    id: 2,
    companyName: 'AVC科技公司',
    programTitle: '行銷企業體驗',
    status: '已通過',
    rating: 5,
    date: '2025/10/15',
    reviewText:
      '這次的行銷企劃體驗非常棒！我學到了很多實用的技能，也獲得了許多寶貴的建議。整體來說對我的職涯規劃有很大幫助！',
  },
  {
    id: 3,
    companyName: 'AVC科技公司',
    programTitle: '行銷企業體驗',
    status: '已通過',
    rating: 5,
    date: '2025/10/15',
    reviewText:
      '教練的指導細膩且非常實用，讓我了解產業工作如何應用數據分析工具，並能更深入學習一些實務技巧。',
  },
  {
    id: 4,
    companyName: 'AVC科技公司',
    programTitle: '行銷企業體驗',
    status: '已退回',
    rating: 5,
    date: '2025/10/15',
    reviewText:
      '人力資源與產品體驗環節貼合度高，整體流程順暢，對於職場的實務內容有更深理解。',
    rejectionReason:
      '內容含有不雅字眼，已由系統自動拒絕，將會由人工於 24 小時內複審。',
  },
  {
    id: 5,
    companyName: 'AVC科技公司',
    programTitle: '行銷企業體驗',
    status: '已通過',
    rating: 5,
    date: '2025/10/15',
    reviewText:
      '財務分析的實作案例很紮實，了解了從資料分析到實際工作流程的連結，幫助很大。',
  },
]);

function onWriteReview(commentId: number) {
  navigateTo({ name: 'user-comments-detail', params: { commentId: String(commentId) } });
}

// --- Pagination 狀態 ---
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [10, 20, 30, 50];

// 產生 totalReviews 長度的資料以展示分頁（後續串接 API 時可移除）
const allReviews = computed<ReviewItem[]>(() => {
  const base = reviews.value;
  return Array.from({ length: totalReviews.value }, (_, i) => ({
    ...base[i % base.length],
    id: i + 1,
  }));
});

const visibleReviews = computed<ReviewItem[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return allReviews.value.slice(start, start + pageSize.value);
});

// 篩選面板可見性（受控）
const filterVisible = ref(false);
</script>

<!-- up15 評價列表 -->
<template>
  <section class="mx-auto max-w-container-users px-6 md:px-12 py-8 md:py-10">
    <!-- Header: 標題與總數 -->
    <div class="flex items-end justify-between">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-800">評價列表</h2>
      <div class="text-gray-500 text-base md:text-lg">共 {{ totalReviews }} 則評價</div>
    </div>

    <!-- Controls: 三顆按鈕（Element Plus 預設樣式） -->
    <div class="mt-6 flex flex-wrap items-center gap-4 md:gap-6">
      <!-- 篩選 Popover -->
      <el-popover v-model:visible="filterVisible" placement="bottom-start" trigger="click" :width="440">
        <template #reference>
          <el-button>篩選</el-button>
        </template>

        <div class="p-3">
          <div class="flex flex-col gap-6">
            <!-- 審核狀態群組 -->
            <div>
              <el-tag effect="plain" type="info">審核狀態</el-tag>
              <div class="mt-3">
                <el-checkbox-group v-model="selectedStatuses">
                  <el-checkbox-button v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</el-checkbox-button>
                </el-checkbox-group>
              </div>
            </div>

            <!-- 日期排序群組 -->
            <div>
              <el-tag effect="plain" type="info">日期</el-tag>
              <div class="mt-3">
                <el-radio-group v-model="selectedDateSort">
                  <el-radio-button v-for="opt in dateSortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <el-button text @click="onClearFilters">清除</el-button>
            <el-button type="primary" @click="onApplyFilters">套用</el-button>
          </div>
        </div>
      </el-popover>
    </div>

    <!-- 分隔線 -->
    <el-divider/>

    <!-- List: 公司評價卡片 -->
    <div>
      <div v-for="item in visibleReviews" :key="item.id" class="py-4">
        <div class="flex items-center justify-between">
          <!-- Left: Logo + 公司名稱 + 體驗標籤 + 狀態 -->
          <div class="flex items-center gap-4">
            <el-avatar :size="48">企業logo</el-avatar>
            <div class="flex items-center flex-wrap gap-x-3 gap-y-2">
              <div class="text-lg font-semibold text-gray-800">{{ item.companyName }}</div>
              <el-tag effect="plain" round>{{ item.programTitle }}</el-tag>
              <span v-if="item.status === '未評價'" class="text-gray-400">未評價</span>
              <el-tag v-else :type="tagTypeForStatus(item.status)" size="small" effect="plain">{{ item.status }}</el-tag>
            </div>
          </div>

          <!-- Right: 撰寫評價（僅未評價） -->
          <div v-if="item.status === '未評價'">
            <el-button size="small" round @click="onWriteReview(item.id)">撰寫評價</el-button>
          </div>
        </div>

        <!-- 評分/日期/狀態列（已送出狀態） -->
        <div v-if="item.status !== '未評價'" class="mt-3 flex items-center gap-4 text-gray-600">
          <el-rate :model-value="item.rating || 0" disabled />
          <span class="font-semibold">{{ (item.rating ?? 0).toFixed(1) }}</span>
          <span class="text-gray-400">{{ item.date }}</span>
          <el-tag :type="tagTypeForStatus(item.status)" size="small" effect="plain">{{ item.status }}</el-tag>
        </div>

        <!-- 內文 -->
        <p v-if="item.reviewText" class="mt-2 text-gray-700 leading-relaxed">{{ item.reviewText }}</p>

        <!-- 退回/拒絕理由 -->
          <div v-if="item.rejectionReason" class="mt-3 text-gray-600">
          <span class="text-gray-500">拒絕理由：</span>
          <span>{{ item.rejectionReason }}</span>
          <div class="mt-2 text-right">
            <el-button size="small" round plain type="info" @click="onWriteReview(item.id)">修改再傳</el-button>
          </div>
        </div>

        <!-- item divider -->
        <el-divider />
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <!-- 每頁顯示 -->
      <div class="flex items-center gap-3">
        <span class="text-gray-600">每頁顯示：</span>
        <el-select v-model="pageSize" class="w-full min-w-form-control md:max-w-form-select">
          <el-option v-for="size in pageSizeOptions" :key="size" :label="`${size} 筆`" :value="size" />
        </el-select>
      </div>

      <!-- 分頁器 -->
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalReviews"
        :pager-count="7"
        layout="prev, pager, next"
        background
      />
    </div>
  </section>
</template>