<script setup lang="ts">
import { ref, watch } from 'vue';
import { userRoutes } from '~/utils/userRoutes';
import { useUserAuthStore } from '~/stores/user/useAuthStore';
import { useUserProgramsStore } from '~/stores/user/useProgramsStore';
import type { Program } from '~/types/users/program';

definePageMeta({
  name: 'user-landing',
  layout: 'user',
  middleware: 'user-auth',
});

const authStore = useUserAuthStore();
const programsStore = useUserProgramsStore();

const searchKeyword = ref('');
const industry = ref('');
const jobType = ref('');
const location = ref('');
const sort = ref('');

const currentPage = ref(1);
const pageSize = 6;

watch(
  () => authStore.isLoggedIn,
  (logged) => {
    if (logged) {
      programsStore.fetchPrograms({ page: currentPage.value, limit: pageSize });
    }
  },
  { immediate: true },
);

watch(currentPage, (p) => {
  if (authStore.isLoggedIn) {
    programsStore.fetchPrograms({ 
      page: p, 
      limit: pageSize,
      keyword: searchKeyword.value,
      industry: industry.value,
      jobType: jobType.value,
      location: location.value,
      sort: sort.value
    });
  }
});

// 監聽篩選條件變化
watch([searchKeyword, industry, jobType, location, sort], () => {
  if (authStore.isLoggedIn) {
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
  }
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
  const startDate = new Date(program.ProgramStartDate);
  const endDate = new Date(program.ProgramEndDate);
  
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
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
                <img :src="program.CoverImage" class="w-full h-2/3 object-cover" alt="program image" />
                <div class="p-4">
                  <h3 class="text-lg font-bold">{{ program.Name }}</h3>
                  <p class="text-sm text-gray-500">{{ program.Industry.Title }}</p>
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

          <!-- Program Cards -->
          <div v-if="programsStore.items && programsStore.items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <el-card v-for="program in programsStore.items" :key="program.Id" class="shadow-lg hover:shadow-xl transition-shadow">
              <template #header>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-lg">{{ program.Name }}</span>
                  <el-button text>
                    <font-awesome-icon :icon="['fas', 'heart']" />
                  </el-button>
                </div>
              </template>
              <div class="text-sm text-gray-600">
                <p class="min-h-[4.5rem]">{{ program.Intro }}</p>
                <div class="mt-4 space-y-2">
                  <div class="flex items-center gap-2">
                    <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
                    <span>{{ program.Address }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <font-awesome-icon :icon="['fas', 'calendar-alt']" />
                    <span>{{ formatProgramDate(program) }}</span>
                  </div>
                </div>
                <div class="mt-4 flex justify-between text-xs text-gray-500 border-t pt-2">
                  <span>已申請人數：{{ program.AppliedCount }} 人</span>
                  <span>申請截止還有 {{ program.DaysLeft }} 天</span>
                </div>
                <div class="mt-2 text-right text-blue-500 font-bold min-h-5">
                  <span v-if="program.IsOngoing !== null">{{ program.IsOngoing ? '進行中' : '已結束' }}</span>
                </div>
              </div>
              <template #footer>
                                  <NuxtLink :to="userRoutes.programDetail(program.Id)">
                  <el-button type="primary" class="w-full">查看詳情</el-button>
                </NuxtLink>
              </template>
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