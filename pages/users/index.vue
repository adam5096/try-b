<script setup lang="ts">
definePageMeta({
  name: 'user-landing',
  layout: 'user',
});

import { ref, watch, onMounted } from 'vue';
import { userRoutes } from '~/utils/userRoutes';
import SkeletonLoader from '~/components/shared/SkeletonLoader.vue';
import ImageWithSkeleton from '~/components/shared/ImageWithSkeleton.vue';
import { useUserProgramsStore } from '~/stores/user/useProgramsStore';
import { useUserProgramDetailStore } from '~/stores/user/useUserProgramDetailStore';
import type { Program } from '~/types/users/program';

const programsStore = useUserProgramsStore();
const programDetailStore = useUserProgramDetailStore();

// 已移除開發環境用的 fallback programId，改以實際回傳的 Id 為準

// 影像載入與骨架交由 ImageWithSkeleton 元件處理

const searchKeyword = ref('');
const industry = ref('');
const jobType = ref('');
const location = ref('');
const sort = ref('');

const currentPage = ref(1);
const pageSize = 6;

// 頁面載入時直接獲取資料，不需要登入驗證
onMounted(() => {
  programsStore.fetchPrograms({ page: currentPage.value, limit: pageSize });
});

watch(currentPage, (p) => {
  programsStore.fetchPrograms({ 
    page: p, 
    limit: pageSize,
    keyword: searchKeyword.value,
    industry: industry.value,
    jobType: jobType.value,
    location: location.value,
    sort: sort.value
  });
});

// 監聽篩選條件變化
watch([searchKeyword, industry, jobType, location, sort], () => {
  currentPage.value = 1; // 重置到第一頁
  programsStore.fetchPrograms({ 
    page: 1, 
    limit: pageSize,
    keyword: searchKeyword.value,
    industry: industry.value,
    jobType: jobType.value,
    location: location.value,
    sort: sort.value
  });
});

const industries = ref([
  { value: 'tech', label: '科技業' },
  { value: 'finance', label: '金融業' },
  { value: 'retail', label: '零售業' },
  { value: 'catering', label: '餐飲業' },
]);

const jobTypes = ref([
  { value: 'engineering', label: '工程師' },
  { value: 'designer', label: '設計師' },
  { value: 'marketing', label: '行銷' },
  { value: 'pm', label: '產品經理' },
]);

const locations = ref([
  { value: 'taipei', label: '台北市' },
  { value: 'hsinchu', label: '新竹市' },
  { value: 'kaohsiung', label: '高雄市' },
]);

const sortOptions = ref([
  { value: 'latest', label: '最新發布' },
  { value: 'popular', label: '熱門程度' },
  { value: 'deadline', label: '截止日期' },
]);

// 格式化程式日期顯示
const formatProgramDate = (program: Program) => {
  if (!program.ProgramStartDate || !program.ProgramEndDate) {
    return '日期未定';
  }
  
  try {
    const startDate = new Date(program.ProgramStartDate);
    const endDate = new Date(program.ProgramEndDate);
    
    // 檢查日期是否有效
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return '日期格式錯誤';
    }
    
    const formatDate = (date: Date) => {
      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  } catch (error) {
    console.error('Error formatting program date:', error);
    return '日期格式錯誤';
  }
};



// 解析清單項目的 ProgramId（以回傳的 Id 為主，保守兼容 id）
const resolveProgramId = (program: any) => {
  return program?.Id ?? program?.id ?? null;
};

// 處理查看詳情按鈕點擊
const handleViewDetail = async (program: any) => {
  try {
    const programId = resolveProgramId(program);
    if (programId === undefined || programId === null || programId === '') {
      console.warn('此體驗卡片缺少有效的 programId，暫時無法查看詳情');
      return;
    }
    // 先取得計畫詳情
    await programDetailStore.fetchDetail(programId);
    
    // 導航到計畫詳情頁
    await navigateTo(userRoutes.programDetail(programId));
  } catch (error) {
    console.error('Error handling view detail:', error);
    // 如果取得詳情失敗，仍然導航到詳情頁，讓詳情頁處理錯誤狀態
    const programId = resolveProgramId(program);
    if (programId !== undefined && programId !== null && programId !== '') {
      await navigateTo(userRoutes.programDetail(programId));
    }
  }
};  
</script>

<template>
  <main class="bg-gray-100">
    <div class="py-12">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Hot Programs Section -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold mb-2">熱門體驗計畫總覽</h2>
          <p class="text-gray-500 mb-8">在這裡探索最受歡迎的體驗計畫，看看大家都喜歡哪些活動！</p>
          <el-carousel v-if="programsStore.popular && programsStore.popular.length > 0" :interval="4000" type="card" height="300px">
            <el-carousel-item v-for="program in programsStore.popular" :key="program.Id">
              <el-card :body-style="{ padding: '0px' }" class="h-full">
                <div class="relative h-full">
                  <ImageWithSkeleton
                    :src="program.CoverImage"
                    alt="program image"
                    img-class="w-full h-2/3 object-cover"
                    skeleton-height-class="h-2/3"
                  />
                  <div class="p-4">
                    <h3 class="text-lg font-bold">{{ program.Name || '未命名計畫' }}</h3>
                    <p class="text-sm text-gray-500">{{ program.Industry?.Title || '產業未分類' }}</p>
                  </div>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
          <div v-else>
            <div v-if="programsStore.loading" class="bg-white rounded-lg p-4">
              <SkeletonLoader :show-title="false" :show-image="true" :show-button="false" image-height-class="h-[300px]" />
            </div>
            <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p class="text-gray-500">暫無熱門計畫</p>
            </div>
          </div>
        </section>

        <!-- General Programs Section -->
        <section>
          <h2 class="text-2xl font-bold mb-2">一般體驗計畫總覽</h2>
          <p class="text-gray-500 mb-8">管理您已申請的體驗計畫，並在這裡快速申請新計畫。</p>

          <!-- Filters -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-4 bg-white rounded-lg shadow items-stretch">
            <el-input v-model="searchKeyword" placeholder="關鍵字搜尋" clearable />
            <el-select v-model="industry" placeholder="產業類別" clearable>
              <el-option v-for="item in industries" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="jobType" placeholder="職業類別" clearable>
              <el-option v-for="item in jobTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="location" placeholder="地區" clearable>
              <el-option v-for="item in locations" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="sort" placeholder="排序" clearable>
              <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>


          <!-- Program Cards -->
          <div v-if="programsStore.items && programsStore.items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <el-card v-for="program in programsStore.items" :key="program.Id" class="shadow-lg hover:shadow-xl transition-shadow border border-[#CCCCCC] h-[580px] flex flex-col overflow-hidden">
              <!-- Cover Image with Status Tag -->
              <div class="relative flex-shrink-0">
                <ImageWithSkeleton
                  :src="program.CoverImage"
                  alt="program image"
                  img-class="w-full h-48 object-cover"
                  skeleton-height-class="h-48"
                />
                <!-- Status Tag (左上角) -->
                <div class="absolute top-2 left-2 bg-primary-blue-light text-white px-2 py-1 text-xs rounded z-10">
                  已發佈
                </div>
              </div>
              
              <!-- Program Content -->
              <div class="p-4 flex flex-col flex-1 min-h-0">
                <!-- Title -->
                <h3 class="text-lg font-bold text-black mb-2 line-clamp-2 leading-tight h-[3rem] flex items-start">{{ program.Name || '未命名計畫' }}</h3>
                
                <!-- Description - 伸展填滿剩餘空間 -->
                <p class="text-sm text-gray-600 mb-3 flex-1 overflow-hidden text-ellipsis line-clamp-3">{{ program.Intro || '暫無介紹' }}</p>
                
                <!-- Program Details - 固定高度區域 -->
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
                
                <!-- Action Button -->
                <button 
                  @click="handleViewDetail(program)"
                  class="w-full bg-btn-yellow text-black font-medium py-2 px-4 rounded-lg hover:bg-btn-yellow/80 transition-colors text-sm"
                >
                  查看詳情
                </button>
              </div>
            </el-card>
          </div>
          <div v-else>
            <div v-if="programsStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <el-card v-for="n in pageSize" :key="'skeleton-'+n" class="shadow-lg border border-[#CCCCCC] h-[580px] flex flex-col overflow-hidden">
                <div class="p-4 w-full">
                  <SkeletonLoader :show-title="true" :show-image="true" :show-button="true" :lines="3" image-height-class="h-48" button-height-class="h-10" />
                </div>
              </el-card>
            </div>
            <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p class="text-gray-500">暫無體驗計畫</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="programsStore.items && programsStore.items.length > 0 && programsStore.total > pageSize" class="mt-12 flex justify-center">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="programsStore.total"
            />
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style>
.el-carousel__arrow {
  background-color: rgba(31, 41, 55, 0.5);
  color: white;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.el-carousel__arrow:hover {
  background-color: rgba(31, 41, 55, 0.8);
}

/* 文字截斷樣式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  line-clamp: 4;
  overflow: hidden;
}
</style>