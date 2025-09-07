<script setup lang="ts">
definePageMeta({
  name: 'user-program-detail',
  layout: 'user',
});

import { ref, onMounted, computed } from 'vue';
import { userRoutes } from '~/utils/userRoutes';
import { useUserProgramDetailStore } from '~/stores/user/useUserProgramDetailStore';
import { parseIntroContent } from '~/utils/introParser';
import { useUserAuthStore } from '~/stores/user/useAuthStore';

const router = useRouter();
const isFavorited = ref(false);
const showApply = ref(false);

// 使用 store 管理計畫詳情
const programDetailStore = useUserProgramDetailStore();
const userAuthStore = useUserAuthStore();
const isLoggedIn = computed(() => userAuthStore.isLoggedIn);

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value;
};

const goBack = () => {
  router.push({ name: 'user-landing' });
};

// 取得路由參數中的計畫 ID
const route = useRoute();
const programId = computed(() => route.params.programId as string);

// 計算屬性：從 store 取得計畫詳情
const programDetail = computed(() => programDetailStore.programDetail);
const isLoading = computed(() => programDetailStore.loading);
const hasError = computed(() => programDetailStore.hasError);
const errorMessage = computed(() => programDetailStore.error);

// 解析 intro 內容
const parsedIntro = computed(() => {
  if (!programDetail.value?.intro) return null;
  return parseIntroContent(programDetail.value.intro);
});

// 頁面載入時取得計畫詳情
onMounted(async () => {
  if (programId.value) {
    try {
      await programDetailStore.fetchDetail(programId.value);
    } catch (error) {
      console.error('Failed to fetch program detail:', error);
    }
  }
});

// 錯誤處理函數
const handleRefresh = async () => {
  if (programId.value) {
    await programDetailStore.refreshDetail();
  }
};

const handleBack = () => {
  router.push({ name: 'user-landing' });
};

const handleContact = () => {
  // 這裡可以實作聯絡客服的邏輯
  console.log('Contact customer service');
};

// 日期格式化函數
const formatDate = (dateString: string) => {
  if (!dateString || dateString === '0001-01-01T00:00:00') {
    return '日期未定';
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '日期格式錯誤';
    }
    
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '日期格式錯誤';
  }
};

// 移除假資料，使用 store 中的真實資料

const onApplySubmitted = async () => {
  showApply.value = false;
  await navigateTo({ name: 'user-landing' }); // 導到 users/index.vue
};

// 申請按鈕點擊處理：未登入導向登入頁（附帶返回 redirect），已登入則開啟申請流程
const handleApplyClick = async () => {
  if (!isLoggedIn.value) {
    await navigateTo({ name: 'user-login', query: { redirect: route.fullPath } });
    return;
  }
  showApply.value = true;
};
</script>

<template>
  <main class="min-h-screen bg-brand-gray">
    <div class="mx-auto max-w-container-users px-6 py-12 md:px-12">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-primary-blue-dark">體驗詳情</h1>
        <div class="flex items-center gap-4">
          <el-button 
            v-if="programDetail" 
            type="primary" 
            size="large" 
            @click="handleApplyClick"
          >
            我要申請
          </el-button>
          <el-button size="large" @click="goBack">返回列表</el-button>
          <el-button size="large" @click="toggleFavorite">
            <div class="flex items-center gap-2">
              <font-awesome-icon :icon="[isFavorited ? 'fas' : 'far', 'heart']" />
              <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
            </div>
          </el-button>
        </div>
      </div>

      <!-- 載入狀態 -->
      <div v-if="isLoading" class="mb-8">
        <SharedSkeletonLoader 
          :show-title="true" 
          :show-image="true" 
          :lines="5" 
        />
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="hasError" class="mb-8">
        <SharedErrorMessage
          :title="'載入計畫詳情失敗'"
          :message="errorMessage || '載入計畫詳情時發生錯誤'"
          @refresh="handleRefresh"
          @back="handleBack"
          @contact="handleContact"
        />
      </div>

      <!-- 計畫詳情內容 -->
      <div v-else-if="programDetail" class="space-y-8">

      <!-- 企業封面區塊 -->
      <section aria-label="企業封面" class="mb-8">
        <div class="relative h-44 w-full rounded-lg bg-gray-300">
          <!-- 企業封面圖片 -->
          <img 
            v-if="programDetail.company_cover" 
            :src="programDetail.company_cover" 
            class="w-full h-full object-cover rounded-lg"
            alt="企業封面"
          />
          
          <!-- 圓形 LOGO -->
          <div
            v-if="programDetail.company_logo"
            class="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-600 bg-white overflow-hidden"
          >
            <img 
              :src="programDetail.company_logo" 
              class="w-full h-full object-cover"
              alt="企業 LOGO"
            />
          </div>
          <div
            v-else
            class="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-600 bg-white text-sm font-semibold text-gray-700"
          >
            LOGO
          </div>

          <!-- 置中標題 -->
          <h2
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-800"
          >
            {{ programDetail.name }}
          </h2>

          <!-- 公司名稱：可點擊前往公司詳情頁 -->
          <button
            type="button"
            class="absolute bottom-6 left-6 text-base font-medium text-primary-blue-dark hover:underline"
            @click="navigateTo(userRoutes.companyDetail(1))"
          >
            {{ programDetail.company_name }}
          </button>
        </div>

        <!-- 計畫內容（與企業封面同區塊） -->
        <div class="mt-6 rounded-lg bg-white p-8 shadow-sm">
          <!-- 內容卡抬頭：左標題／右關鍵資訊 -->
          <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="md:col-span-2">
              <h3 class="text-xl font-bold">{{ programDetail.name }}</h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ programDetail.Industry?.Title || '產業未分類' }}／{{ programDetail.JobTitle?.Title || '職位未分類' }}
              </p>
            </div>
            <div class="flex flex-col gap-2 text-sm text-gray-600">
              <div class="flex items-center justify-between">
                <span>已申請人數：{{ programDetail.applied_count }}人</span>
                <span>申請截止還有{{ programDetail.days_left }}天</span>
              </div>
              <div class="flex items-center justify-between">
                <span>體驗天數：{{ programDetail.program_duration_days }}天</span>
                <span>體驗人數：{{ programDetail.min_people }}-{{ programDetail.max_people }}人</span>
              </div>
              <div class="flex items-center gap-2">
                <font-awesome-icon :icon="['fas','calendar-alt']" />
                <span>{{ formatDate(programDetail.program_start_date) }} - {{ formatDate(programDetail.program_end_date) }}</span>
              </div>
            </div>
          </div>

          <!-- 內文段落 -->
          <div class="space-y-8 text-gray-800">
            <!-- 體驗介紹 -->
            <section v-if="parsedIntro?.experienceIntro || parsedIntro?.fallback">
              <h4 class="mb-3 text-lg font-bold">體驗介紹</h4>
              <p class="leading-7">
                {{ parsedIntro?.experienceIntro || parsedIntro?.fallback }}
              </p>
            </section>

            <!-- 師資介紹 -->
            <section v-if="parsedIntro?.teacherIntro">
              <h4 class="mb-3 text-lg font-bold">師資介紹</h4>
              <p class="leading-7">
                {{ parsedIntro.teacherIntro }}
              </p>
            </section>

            <!-- 參加限制 -->
            <section v-if="parsedIntro?.requirements && parsedIntro.requirements.length > 0">
              <h4 class="mb-3 text-lg font-bold">參加限制</h4>
              <ol class="list-decimal space-y-1 pl-6">
                <li v-for="requirement in parsedIntro.requirements" :key="requirement">
                  {{ requirement }}
                </li>
              </ol>
            </section>

            <!-- 行前須知與準備清單 -->
            <section v-if="parsedIntro?.preparation && parsedIntro.preparation.length > 0">
              <h4 class="mb-3 text-lg font-bold">行前須知與準備清單</h4>
              <ol class="list-decimal space-y-1 pl-6">
                <li v-for="item in parsedIntro.preparation" :key="item">
                  {{ item }}
                </li>
              </ol>
            </section>
          </div>
        </div>
      </section>

      <!-- 體驗流程區塊 -->
      <section aria-label="體驗流程" class="mb-8">
        <div class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <!-- 標題 + 流程列表 -->
          <div class="mb-6">
            <h3 class="mb-4 text-lg font-bold">體驗流程</h3>
            <dl v-if="programDetail.Steps && programDetail.Steps.length > 0" class="space-y-4">
              <div v-for="(step, idx) in programDetail.Steps" :key="idx" class="grid grid-cols-12 gap-4">
                <dt class="col-span-12 font-semibold text-gray-700 md:col-span-2">{{ step.Name }}</dt>
                <dd class="col-span-12 leading-7 text-gray-700 md:col-span-10">
                  {{ step.Description }}
                </dd>
              </div>
            </dl>
            <div v-else class="text-gray-500 text-center py-8">
              暫無體驗流程資訊
            </div>
          </div>

          <!-- 體驗地點 -->
          <div>
            <h3 class="mb-2 text-lg font-bold">體驗地點</h3>
            <p class="mb-4 text-gray-700">{{ programDetail.address }}</p>
            <SharedGoogleMapEmbed :src="programDetail.address_map || ''" empty-text="尚未提供地圖資訊" />
          </div>
        </div>
      </section>

      <!-- 體驗照片區塊 -->
      <section aria-label="體驗照片" class="mb-8">
        <div class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h3 class="mb-6 text-lg font-bold">體驗照片</h3>
          <div v-if="programDetail.Images && programDetail.Images.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div v-for="(image, idx) in programDetail.Images" :key="idx" class="rounded bg-gray-300">
              <img 
                v-if="image" 
                :src="image" 
                :alt="`體驗照片 ${idx + 1}`" 
                class="h-48 w-full object-cover rounded"
              />
              <div v-else class="flex h-48 w-full items-center justify-center text-3xl text-gray-700">
                圖片
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-8">
            暫無體驗照片
          </div>
        </div>
      </section>
    </div>
  </div>
  </main>
  <el-dialog
    v-model="showApply"
    width="560px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <UsersApplyExperience :program-id="programId" @submitted="onApplySubmitted" @close="showApply = false" />
  </el-dialog>
</template>
