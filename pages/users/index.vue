<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { userRoutes } from '~/utils/userRoutes';
import { useUserAuthStore } from '~/stores/user/useAuthStore';
import { useUserProgramsStore } from '~/stores/user/useProgramsStore';
import { useUserProgramDetailStore } from '~/stores/user/useUserProgramDetailStore';
import type { Program } from '~/types/users/program';

definePageMeta({
  name: 'user-landing',
  layout: 'user',
});

const authStore = useUserAuthStore();
const programsStore = useUserProgramsStore();
const programDetailStore = useUserProgramDetailStore();

// 開發環境用的 fallback programId（後端清單缺少真正的 programId 時使用）
const FALLBACK_PROGRAM_ID = 45;

// 圖片載入錯誤時回退至預設圖片
const onProgramImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  if (img && img.src !== '/img/home/home-worker-bg.webp') {
    img.src = '/img/home/home-worker-bg.webp';
    img.onerror = null; // 避免 fallback 再次觸發造成遞迴
  }
};

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

const activeStatus = ref('all');

const setActiveStatus = (status: string) => {
  activeStatus.value = status;
};

const getStatusCount = (status: string) => {
  if (!programsStore.items) return 0;
  // 由於新版本沒有 Status 欄位，暫時返回 0
  // 未來可以根據其他欄位來判斷狀態
  return 0;
};

// 解析清單項目的 ProgramId（兼容不同欄位命名）
const resolveProgramId = (program: any) => {
  // 僅接受可用的 Program Id 欄位；不再使用 ApplicationId 以免誤傳
  return (
    program?.Id ??
    program?.id ??
    program?.ProgramId ??
    program?.programId ??
    program?.Program?.Id ??
    program?.Program?.id ??
    program?.ID ??
    null
  );
};

// 處理查看詳情按鈕點擊
const handleViewDetail = async (program: any) => {
  try {
    const programId = resolveProgramId(program);
    if (programId === undefined || programId === null || programId === '') {
      console.warn('Invalid programId provided to handleViewDetail:', program);
      if (process.dev && FALLBACK_PROGRAM_ID) {
        console.log(`[dev:fallback] 此卡片缺少 programId，改用 fallback=${FALLBACK_PROGRAM_ID}`);
        await programDetailStore.fetchDetail(FALLBACK_PROGRAM_ID);
        await navigateTo(userRoutes.programDetail(FALLBACK_PROGRAM_ID));
        return;
      } else {
        console.log('[warn] 此體驗卡片缺少 programId，暫時無法查看詳情');
        return;
      }
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
                <img 
                  :src="program.CoverImage || '/img/home/home-worker-bg.webp'" 
                  class="w-full h-2/3 object-cover" 
                  alt="program image" 
                  @error="onProgramImageError"
                />
                <div class="p-4">
                  <h3 class="text-lg font-bold">{{ program.Name || '未命名計畫' }}</h3>
                  <p class="text-sm text-gray-500">{{ program.Industry?.Title || '產業未分類' }}</p>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
          <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p class="text-gray-500">{{ programsStore.loading ? '載入中...' : '暫無熱門計畫' }}</p>
          </div>
        </section>

        <!-- General Programs Section -->
        <section>
          <h2 class="text-2xl font-bold mb-2">一般體驗計畫總覽</h2>
          <p class="text-gray-500 mb-8">管理您已申請的體驗計畫，並在這裡快速申請新計畫。</p>

          <!-- Filters -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-4 bg-white rounded-lg shadow">
            <el-input v-model="searchKeyword" placeholder="關鍵字搜尋" clearable class="w-full md:max-w-form-search" />
            <el-select v-model="industry" placeholder="產業類別" clearable class="w-full min-w-form-control md:max-w-form-select">
              <el-option v-for="item in industries" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="jobType" placeholder="職業類別" clearable class="w-full min-w-form-control md:max-w-form-select">
              <el-option v-for="item in jobTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="location" placeholder="地區" clearable class="w-full min-w-form-control md:max-w-form-select">
              <el-option v-for="item in locations" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="sort" placeholder="排序" clearable class="w-full min-w-form-control md:max-w-form-select">
              <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <!-- Status Tabs -->
          <div class="mb-8">
            <div class="flex flex-wrap gap-2">
              <button 
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="activeStatus === 'all' ? 'bg-primary-blue-light text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="setActiveStatus('all')"
              >
                全部計劃({{ programsStore.total || 0 }})
              </button>
              <button 
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="activeStatus === 'approved' ? 'bg-primary-blue-light text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="setActiveStatus('approved')"
              >
                已通過({{ getStatusCount('已通過') }})
              </button>
              <button 
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="activeStatus === 'published' ? 'bg-primary-blue-light text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="setActiveStatus('published')"
              >
                已發佈({{ getStatusCount('已發佈') }})
              </button>
              <button 
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="activeStatus === 'pending' ? 'bg-primary-blue-light text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="setActiveStatus('pending')"
              >
                待發佈({{ getStatusCount('待發佈') }})
              </button>
              <button 
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="activeStatus === 'rejected' ? 'bg-primary-blue-light text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="setActiveStatus('rejected')"
              >
                已拒絕({{ getStatusCount('已拒絕') }})
              </button>
              <button 
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="activeStatus === 'reviewing' ? 'bg-primary-blue-light text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="setActiveStatus('reviewing')"
              >
                審核中({{ getStatusCount('審核中') }})
              </button>
            </div>
          </div>

          <!-- Program Cards -->
          <div v-if="programsStore.items && programsStore.items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <el-card v-for="program in programsStore.items" :key="program.Id" class="shadow-lg hover:shadow-xl transition-shadow border border-[#CCCCCC]">
              <!-- Cover Image with Status Tag -->
              <div class="relative">
                <img 
                  :src="program.CoverImage || '/img/home/home-worker-bg.webp'" 
                  class="w-full h-48 object-cover" 
                  alt="program image" 
                  @error="onProgramImageError"
                />
                <!-- Status Tag (左上角) -->
                <div class="absolute top-2 left-2 bg-primary-blue-light text-white px-2 py-1 text-xs rounded z-10">
                  已發佈
                </div>
              </div>
              
              <!-- Program Content -->
              <div class="p-4">
                <!-- Title -->
                <h3 class="text-lg font-bold text-black mb-2">{{ program.Name || '未命名計畫' }}</h3>
                
                <!-- Description -->
                <p class="text-sm text-gray-600 mb-4 min-h-[3rem]">{{ program.Intro || '暫無介紹' }}</p>
                
                <!-- Program Details -->
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2">
                    <font-awesome-icon :icon="['fas', 'briefcase']" class="text-gray-500 w-4" />
                    <span class="text-sm text-black">{{ program.Industry?.Title || '產業未分類' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <font-awesome-icon :icon="['fas', 'calendar']" class="text-gray-500 w-4" />
                    <span class="text-sm text-black">{{ formatProgramDate(program) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-gray-500 w-4" />
                    <span class="text-sm text-black">{{ program.Address || '地點未定' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <font-awesome-icon :icon="['fas', 'users']" class="text-gray-500 w-4" />
                    <span class="text-sm text-black">已申請人數: {{ program.AppliedCount || 0 }}人</span>
                  </div>
                </div>
                
                <!-- Company Name -->
                <div class="text-xs text-gray-500 mb-2">
                  產業: {{ program.Industry?.Title || '未指定產業' }}
                </div>
                
                
                
                <!-- Action Button -->
                <button 
                  v-if="authStore.isLoggedIn" 
                  @click="handleViewDetail(program)"
                  class="w-full bg-btn-yellow text-black font-medium py-3 px-4 rounded-lg hover:bg-btn-yellow/80 transition-colors"
                >
                  查看詳情
                </button>
                <button 
                  v-else 
                  class="w-full bg-gray-400 text-white font-medium py-3 px-4 rounded-lg cursor-not-allowed opacity-50"
                  disabled
                  title="請先登入以查看詳情"
                >
                  查看詳情
                </button>
              </div>
            </el-card>
          </div>
          <div v-else class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p class="text-gray-500">{{ programsStore.loading ? '載入中...' : '暫無體驗計畫' }}</p>
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
</style>