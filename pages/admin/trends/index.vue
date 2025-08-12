<script setup lang="ts">
import { ref } from 'vue';
import { Search, Rank, View, Star, User } from '@element-plus/icons-vue';


definePageMeta({
  name: 'pp5-admin-trends',
  layout: 'admin',
});

// UI-only demo state for cutting layout
const keyword = ref('');
const selectedIndustry = ref<string>('');
const selectedJob = ref<string>('');
const selectedRegion = ref<string>('');
const selectedSort = ref('recent');

const industryOptions = [
  { label: '全部產業', value: 'all' },
  { label: '資訊科技', value: 'it' },
  { label: '金融保險', value: 'finance' },
  { label: '製造業', value: 'manufacture' },
];

const jobOptions = [
  { label: '全部職類', value: 'all' },
  { label: '工程研發', value: 'rd' },
  { label: '產品設計', value: 'design' },
  { label: '行銷營運', value: 'marketing' },
];

const regionOptions = [
  { label: '全區域', value: 'all' },
  { label: '台北', value: 'taipei' },
  { label: '新北', value: 'newtaipei' },
  { label: '台中', value: 'taichung' },
];

const sortOptions = [
  { label: '新到舊', value: 'new_to_old' },
  { label: '舊到新', value: 'old_to_new' },
];

type TrendItem = {
  id: number;
  title: string;
  company: string;
  dateRange: string;
  description: string;
  category: string;
  views: number;
  favorites: number;
  applicants: number;
};

const trendItems = ref<TrendItem[]>([
  {
    id: 1,
    title: '軟體工程師體驗',
    company: '企業名稱',
    dateRange: '2025/7/7 - 2025/8/7',
    description: '帶你探索北部著名的夜市，品嚐道地小吃與特色美食…',
    category: '科技業',
    views: 8742,
    favorites: 42,
    applicants: 12,
  },
  {
    id: 2,
    title: '咖啡師職人體驗',
    company: '企業名稱',
    dateRange: '2025/7/7 - 2025/8/7',
    description: '專業講師帶領，探索陽明山國家公園的自然美景與生態環境…',
    category: '餐飲業',
    views: 6531,
    favorites: 42,
    applicants: 12,
  },
  {
    id: 3,
    title: '數位行銷實戰體驗',
    company: '企業名稱',
    dateRange: '2025/7/7 - 2025/8/7',
    description: '學習內容傳播的策略，品嚐各種台灣高山茶，體驗中華文化情懷…',
    category: '行銷業',
    views: 4218,
    favorites: 42,
    applicants: 12,
  },
  {
    id: 4,
    title: '環境永續實戰體驗',
    company: '企業名稱',
    dateRange: '2025/7/7 - 2025/8/7',
    description: '漫步在充滿懷舊氣息的小巷老街，了解歲月故事與城市變遷…',
    category: '環境永續業',
    views: 9876,
    favorites: 42,
    applicants: 12,
  },
  {
    id: 5,
    title: 'UI/UX 設計師工作坊',
    company: '企業名稱',
    dateRange: '2025/7/7 - 2025/8/7',
    description: '專家授課帶您入門，製作專屬您的設計作品，體驗手作樂趣…',
    category: '科技業',
    views: 5324,
    favorites: 42,
    applicants: 12,
  },
]);

</script>


<template>
  <section class="w-full">
    <div class="mx-auto w-full max-w-container-admin">
      <header class="mb-6 md:mb-8">
        <h1 class="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">熱門體驗管理</h1>
        <p class="mt-3 text-sm leading-6 text-gray-600 md:text-base">
          在此頁面，您可以管理平台上顯示的熱門體驗排序、添加或移除體驗。
        </p>
      </header>

      <!-- Filter toolbar -->
      <div class="mb-6 flex flex-wrap items-center gap-3 md:mb-8 md:gap-4 md:flex-nowrap">
        <h2 class="mr-2 whitespace-nowrap text-base font-semibold text-gray-900 md:text-lg">
          當前熱門體驗 (8)
        </h2>

        <el-input
          v-model="keyword"
          placeholder="搜尋體驗..."
          clearable
          :suffix-icon="Search"
          class="w-[260px] md:w-[300px]"
        />

        <el-select v-model="selectedIndustry" placeholder="產業類別" clearable class="w-[150px]">
          <el-option
            v-for="opt in industryOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <el-select v-model="selectedJob" placeholder="職業類別" clearable class="w-[150px]">
          <el-option
            v-for="opt in jobOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <el-select v-model="selectedRegion" placeholder="地區" clearable class="w-[130px]">
          <el-option
            v-for="opt in regionOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <el-select v-model="selectedSort" placeholder="排序" clearable class="w-[120px]">
          <el-option
            v-for="opt in sortOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>

      <el-divider />

      <!-- Draggable list (UI only) -->
      <div class="mb-3 text-sm text-gray-500 md:mb-4">拖曳項目可調整排序順序</div>

      <div class="space-y-4">
        <div
          v-for="item in trendItems"
          :key="item.id"
          class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:gap-6"
        >
          <!-- Drag handle -->
          <div class="flex w-6 shrink-0 items-center justify-center text-gray-400 md:w-8">
            <el-icon class="cursor-grab"><Rank /></el-icon>
          </div>

          <!-- Thumbnail -->
          <div class="flex h-20 w-28 items-center justify-center rounded bg-brand-gray text-gray-500 md:h-24 md:w-36">
            體驗圖片
          </div>

          <!-- Main content -->
          <div class="flex min-w-0 flex-1 flex-col justify-between gap-2">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="flex items-center gap-3">
                  <h3 class="truncate text-base font-semibold text-gray-900 md:text-lg">{{ item.title }}</h3>
                  <span class="text-xs text-gray-500">{{ item.company }}</span>
                </div>
                <div class="mt-1 text-xs text-gray-500">{{ item.dateRange }}</div>
                <p class="mt-2 line-clamp-1 text-sm text-gray-700 md:line-clamp-2">{{ item.description }}</p>
              </div>
            </div>

            <div class="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
              <span class="inline-flex items-center gap-1"><el-icon><View /></el-icon>{{ item.views.toLocaleString() }} 次瀏覽</span>
              <span class="inline-flex items-center gap-1"><el-icon><Star /></el-icon>{{ item.favorites }} 人收藏</span>
              <span class="inline-flex items-center gap-1"><el-icon><User /></el-icon>{{ item.applicants }} 人申請</span>
            </div>
          </div>

          <!-- Category (right column) -->
          <div class="flex shrink-0 items-center whitespace-nowrap text-sm text-gray-700 md:text-base">
            {{ item.category }}
          </div>

          <!-- Actions -->
          <div class="flex shrink-0 items-center gap-1">
            <el-button size="small">詳情</el-button>
            <el-button size="small" type="danger">刪除</el-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


