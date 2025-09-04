<script lang="ts" setup>
definePageMeta({
  layout: 'company',
  name: 'company-index',
});

import {
  Search,
  Briefcase,
  Location,
  User,
} from '@element-plus/icons-vue';
import { computed } from 'vue';
import ImageWithSkeleton from '~/components/shared/ImageWithSkeleton.vue';
import { useCompanyProgramStore } from '~/stores/company/useProgramStore';

const searchForm = {
  name: '',
  industry: '',
  job_type: '',
  sort: 'date_desc',
};

const programStore = useCompanyProgramStore();
const programs = computed(() => programStore.programs);

// The fetching logic is now handled reactively inside the store.
// No need for onMounted or watch here anymore.

const handlePageChange = (page: number) => {
  programStore.setPage(page);
};

const getProgramStatus = (program: any) => {
  const now = new Date();
  const publishStart = new Date(program.PublishStartDate);
  const publishEnd = new Date(program.PublishEndDate);
  const programStart = new Date(program.ProgramStartDate);
  const programEnd = new Date(program.ProgramEndDate);
  
  if (now < publishStart) return '未發布';
  if (now >= publishStart && now <= publishEnd) return '已發佈';
  if (now > publishEnd && now < programStart) return '已截止';
  if (now >= programStart && now <= programEnd) return '進行中';
  if (now > programEnd) return '已結束';
  
  return '未知';
};

// 與使用者端一致：格式化日期顯示
const formatProgramDate = (program: any) => {
  if (!program?.ProgramStartDate || !program?.ProgramEndDate) {
    return '日期未定';
  }

  try {
    const startDate = new Date(program.ProgramStartDate);
    const endDate = new Date(program.ProgramEndDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return '日期格式錯誤';
    }

    const formatDate = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}/${mm}/${dd}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  } catch {
    return '日期格式錯誤';
  }
};

// 查看詳情（與使用者端交互一致，改導到公司端詳情頁）
const handleViewDetail = async (program: any) => {
  const id = program?.Id;
  if (id === undefined || id === null || id === '') return;
  await navigateTo(`/company/programs/${id}`);
};
</script>

<template>
  <div>
    <!-- Header -->
    <CompanyPlanStatusHeader />

    <!-- Main Content -->
    <div class="mt-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">
            所有計畫列表
          </h1>
          <p class="text-gray-500">
            管理您的所有體驗計畫，查看各計畫狀態及詳情
          </p>
        </div>
      </div>

      <!-- Filters -->
      <el-card class="mt-4">
        <div class="flex items-center gap-4">
          <el-input v-model="searchForm.name" placeholder="搜尋計畫名稱..." :prefix-icon="Search" class="w-full md:max-w-form-search" />
          <el-select v-model="searchForm.industry" placeholder="產業類別" class="w-full min-w-form-control md:max-w-form-select">
            <el-option label="資訊科技" value="tech" />
            <el-option label="行銷廣告" value="marketing" />
          </el-select>
          <el-select v-model="searchForm.job_type" placeholder="職務類別" class="w-full min-w-form-control md:max-w-form-select">
            <el-option label="軟體工程師" value="swe" />
            <el-option label="產品設計師" value="pd" />
          </el-select>
          <el-select v-model="searchForm.sort" placeholder="排序方式" class="w-full min-w-form-control md:max-w-form-select">
            <el-option label="日期：由新到舊" value="date_desc" />
            <el-option label="日期：由舊到新" value="date_asc" />
          </el-select>
        </div>
      </el-card>

      <!-- Tabs -->
      <el-tabs model-value="all" class="mt-4">
        <el-tab-pane label="全部計畫 (6)" name="all" />
        <el-tab-pane label="已通過 (4)" name="passed" />
        <el-tab-pane label="已發布 (2)" name="published" />
        <el-tab-pane label="待發布 (2)" name="pending" />
        <el-tab-pane label="已拒絕 (1)" name="rejected" />
        <el-tab-pane label="審核中 (1)" name="reviewing" />
      </el-tabs>

      <!-- Plan Cards -->
      <div v-if="programStore.isLoading" class="text-center p-8">
        <p>資料載入中...</p>
      </div>
      <div v-else-if="programStore.error" class="text-center p-8 text-red-500">
        <p>無法載入計畫列表，請稍後再試。</p>
      </div>
      <div v-else-if="programs.length === 0" class="text-center p-8 text-gray-500">
        <p>目前沒有任何計畫。</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <el-card
          v-for="program in programs"
          :key="program.Id"
          class="shadow-lg hover:shadow-xl transition-shadow border border-[#CCCCCC] h-[580px] flex flex-col overflow-hidden"
        >
          <!-- 封面與狀態徽章 -->
          <div class="relative flex-shrink-0">
            <ImageWithSkeleton
              :src="program.CoverImage"
              alt="program image"
              img-class="w-full h-48 object-cover"
              skeleton-height-class="h-48"
            />
            <div class="absolute top-2 left-2 bg-primary-blue-light text-white px-2 py-1 text-xs rounded z-10">
              {{ getProgramStatus(program) }}
            </div>
          </div>

          <!-- 內容 -->
          <div class="p-4 flex flex-col flex-1 min-h-0">
            <h3 class="text-lg font-bold text-black mb-2 line-clamp-2 leading-tight h-[3rem] flex items-start">
              {{ program.Name || '未命名計畫' }}
            </h3>

            <p class="text-sm text-gray-600 mb-3 flex-1 overflow-hidden text-ellipsis line-clamp-3">
              {{ program.Intro || '暫無介紹' }}
            </p>

            <div class="space-y-1 mb-6 h-[5.5rem] flex flex-col justify-center">
              <div class="flex items-center gap-2 h-4">
                <font-awesome-icon :icon="['fas', 'briefcase']" class="text-gray-500 w-3 flex-shrink-0" />
                <span class="text-xs text-black truncate">{{ program.Industry?.Title || '產業未分類' }}</span>
              </div>
              <div class="flex items-center gap-2 h-4">
                <font-awesome-icon :icon="['fas', 'calendar']" class="text-gray-500 w-3 flex-shrink-0" />
                <span class="text-xs text-black truncate">{{ formatProgramDate(program) }}</span>
              </div>
              <div class="flex items-center gap-2 h-4">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-gray-500 w-3 flex-shrink-0" />
                <span class="text-xs text-black truncate">{{ program.Address || '地點未定' }}</span>
              </div>
              <div class="flex items-center gap-2 h-4">
                <font-awesome-icon :icon="['fas', 'users']" class="text-gray-500 w-3 flex-shrink-0" />
                <span class="text-xs text-black truncate">已申請人數: {{ program.AppliedCount || 0 }}人</span>
              </div>
            </div>

            <button
              @click="handleViewDetail(program)"
              class="w-full bg-btn-yellow text-black font-medium py-2 px-4 rounded-lg hover:bg-btn-yellow/80 transition-colors text-sm"
            >
              查看詳情
            </button>
          </div>
        </el-card>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-8">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="programStore.total"
          :page-size="programStore.limit"
          :current-page="programStore.page"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style> 