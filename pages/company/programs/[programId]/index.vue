<script setup lang="ts">
definePageMeta({
  name: 'company-program-detail',
  layout: 'company',
});

import { ref, computed } from 'vue';
import {
  User,
  Briefcase,
  MapLocation,
  Calendar,
  Document,
  Edit,
  Delete,
  Plus,
  DataLine,
  View,
} from '@element-plus/icons-vue';
import type { ProgramDetailResponse } from '~/types/company/program';
import { useProgramDetail } from '~/composables/api/company/useProgramDetail';
import { useCompanyProgramDetailStore } from '~/stores/company/useProgramDetailStore';
import { parseIntroContent } from '~/utils/introParser';

const route = useRoute();
const authStore = useCompanyAuthStore();
const programDetailStore = useCompanyProgramDetailStore();

// 檢查認證狀態
if (!authStore.isLoggedIn) {
  throw createError({ 
    statusCode: 401, 
    statusMessage: '請先登入企業帳號' 
  });
}

// --- Data Fetching ---
// 使用 e comp 7 API 取得計畫詳情
const { data: programDetail, error: programError, pending: isLoading } = useProgramDetail(
  computed(() => authStore.companyId),
  computed(() => Array.isArray(route.params.programId) ? route.params.programId[0] : route.params.programId)
);

// 監聽 API 回應並更新 Store
watch(programDetail, (newData) => {
  if (newData) {
    programDetailStore.setProgramDetail(newData);
  }
}, { immediate: true });

watch(programError, (newError) => {
  if (newError) {
    programDetailStore.setError(newError.message || '載入計畫詳情失敗');
  }
}, { immediate: true });

watch(isLoading, (loading) => {
  programDetailStore.setLoading(loading);
}, { immediate: true });

// 從 Store 取得資料
const program = computed(() => programDetailStore.programInfo);
const programStats = computed(() => programDetailStore.programStats);

// 解析 intro 內容
const parsedIntro = computed(() => {
  if (!program.value?.intro) return null;
  return parseIntroContent(program.value.intro);
});

// 申請統計資料 (從 e comp 7 API 回應中的 Statistics 物件取得)
const totalApplicants = computed(() => programStats.value?.totalApplicants ?? 0);
const reviewedApplicants = computed(() => programStats.value?.reviewedCount ?? 0);
const pendingApplicants = computed(() => programStats.value?.pendingCount ?? 0);
// --- End Data Fetching ---


// --- SEO Meta ---
// 確保 program 資料存在才設定 meta
if (program.value) {
  useSeoMeta({
    title: `${program.value.name}｜Try B 企業實習體驗平台`,
    description: program.value.intro ? program.value.intro.substring(0, 150) : '企業實習體驗計畫詳情', // 安全地截取前 150 字作為描述
    ogTitle: `${program.value.name}｜Try B 企業實習體驗平台`,
    ogDescription: program.value.intro ? program.value.intro.substring(0, 150) : '企業實習體驗計畫詳情',
    // ogImage: program.value.images && program.value.images[0], // 使用第一張圖當作 OG Image
  });
}
// --- End SEO Meta ---


const formatDate = (dateString: string) => {
  if (!dateString) { return ''; }
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const refresh = () => {
  window.location.reload();
};
</script>

<template>
  <div v-if="programError">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">載入失敗</h1>
      <p class="text-gray-600 mb-4">{{ programError.message }}</p>
      <el-button type="primary" @click="refresh()">重新載入</el-button>
    </div>
  </div>
  <div v-else-if="program">
    <!-- Top info bar -->
    <CompanyPlanStatusHeader />

    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-zinc-900">
        {{ program?.name }}
      </h1>
      <p class="text-sm text-zinc-500">
        計畫ID: {{ route.params.programId }} | 狀態: {{ program?.status?.Title }}
      </p>
    </div>

    <!-- Stats Card -->
    <el-card class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-lg font-bold text-zinc-800">
              申請統計
            </h3>
            <el-icon><DataLine /></el-icon>
          </div>
          <div class="space-y-3 md:max-w-xs">
            <div class="flex items-baseline justify-between">
              <p class="text-base text-zinc-600">
                總申請人數
              </p>
              <p class="text-3xl font-bold text-blue-500">
                {{ totalApplicants }}
              </p>
            </div>
            <div class="flex items-baseline justify-between">
              <p class="text-base text-zinc-600">
                已審核
              </p>
              <p class="text-3xl font-bold text-green-600">
                {{ reviewedApplicants }}
              </p>
            </div>
            <div class="flex items-baseline justify-between">
              <p class="text-base text-zinc-600">
                待審核
              </p>
              <p class="text-3xl font-bold text-amber-500">
                {{ pendingApplicants }}
              </p>
            </div>
          </div>
        </div>
        <div class="w-full md:w-auto flex-shrink-0">
          <NuxtLink
            :to="{
              name: 'company-program-applicants-list',
              params: { programId: route.params.programId },
            }"
          >
            <el-button type="primary" size="large" class="w-full">
              查看申請者列表
            </el-button>
          </NuxtLink>
        </div>
      </div>
    </el-card>

    <!-- Main Content -->
    <div class="mt-6">
      <el-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-zinc-800">
            計畫詳情
          </h2>
          <!-- <el-button type="primary" plain>
            編輯計畫
          </el-button> -->
        </div>
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="md:col-span-1 space-y-6">
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                基本資訊
              </h3>
              <dl class="space-y-4 text-sm">
                <div>
                  <dt class="text-zinc-500">
                    體驗名稱
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    {{ program?.name }}
                  </dd>
                </div>
                <div>
                  <dt class="text-zinc-500">
                    產業類別
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    {{ program?.industry?.Title }}
                  </dd>
                </div>
                <div>
                  <dt class="text-zinc-500">
                    職務類別
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    {{ program?.jobTitle?.Title }}
                  </dd>
                </div>
                <div>
                  <dt class="text-zinc-500">
                    體驗地點
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    {{ program?.address }}
                  </dd>
                </div>
                <!-- 體驗地點 google map -->
                <div>
                  <GoogleMapEmbed :src="program?.addressMap || ''" empty-text="尚未提供地圖資訊" />
                </div>
              </dl>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                聯絡資訊
              </h3>
              <dl class="space-y-4 text-sm">
                <div>
                  <dt class="text-zinc-500">
                    聯絡人
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    {{ program?.contactName }}
                  </dd>
                </div>
                <div>
                  <dt class="text-zinc-500">
                    電話
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    {{ program?.contactPhone }}
                  </dd>
                </div>
                <div>
                  <dt class="text-zinc-500">
                    Email
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    {{ program?.contactEmail }}
                  </dd>
                </div>
              </dl>
            </div>
            <div class="space-y-4 text-sm">
              <div>
                <p class="text-zinc-500">
                  刊登期間
                </p>
                <p class="text-zinc-800 mt-1">
                  {{ formatDate(program?.publishStartDate || '') }} - {{ formatDate(program?.publishEndDate || '') }} <span class="ml-2 text-zinc-500">{{ program?.publishDurationDays }}天</span>
                </p>
              </div>
              <div>
                <p class="text-zinc-500">
                  體驗日期
                </p>
                <p class="text-zinc-800 mt-1">
                  {{ formatDate(program?.programStartDate || '') }} - {{ formatDate(program?.programEndDate || '') }} <span class="ml-2 text-zinc-500">為期{{ program?.programDurationDays }}天</span>
                </p>
              </div>
              <div>
                <p class="text-zinc-500">
                  體驗人數
                </p>
                <p class="text-zinc-800 mt-1">
                  {{ program?.minPeople }} - {{ program?.maxPeople }}人
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="md:col-span-2 space-y-8">
            <!-- 體驗介紹 -->
            <div v-if="parsedIntro?.experienceIntro || parsedIntro?.fallback">
              <h3 class="font-semibold text-zinc-800 mb-2">
                體驗介紹
              </h3>
              <p class="text-zinc-700 leading-relaxed text-sm">
                {{ parsedIntro?.experienceIntro || parsedIntro?.fallback }}
              </p>
            </div>

            <!-- 師資介紹 -->
            <div v-if="parsedIntro?.teacherIntro">
              <h3 class="font-semibold text-zinc-800 mb-2">
                師資介紹
              </h3>
              <div class="text-sm">
                <p class="text-zinc-700 leading-relaxed">
                  {{ parsedIntro.teacherIntro }}
                </p>
              </div>
            </div>

            <!-- 參加限制 -->
            <div v-if="parsedIntro?.requirements && parsedIntro.requirements.length > 0">
              <h3 class="font-semibold text-zinc-800 mb-2">
                參加限制
              </h3>
              <ul class="list-decimal list-inside text-zinc-700 text-sm space-y-1">
                <li v-for="requirement in parsedIntro.requirements" :key="requirement">
                  {{ requirement }}
                </li>
              </ul>
            </div>

            <!-- 行前須知與準備清單 -->
            <div v-if="parsedIntro?.preparation && parsedIntro.preparation.length > 0">
              <h3 class="font-semibold text-zinc-800 mb-2">
                行前須知與準備清單
              </h3>
              <ul class="list-decimal list-inside text-zinc-700 text-sm space-y-1">
                <li v-for="item in parsedIntro.preparation" :key="item">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-card>
    </div>


    <!-- Section 3 -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Experience Process -->
      <el-card class="md:row-span-1">
        <template #header>
          <h3 class="font-bold text-zinc-900">
            體驗流程
          </h3>
        </template>
        <dl class="space-y-4 text-sm">
          <div v-for="(step, index) in program?.steps" :key="index">
            <dt class="font-semibold text-zinc-800">
              {{ step.Name }}
            </dt>
            <dd class="text-zinc-600 mt-1">
              {{ step.Description }}
            </dd>
          </div>
        </dl>
      </el-card>

      <!-- Analytics -->
      <el-card class="md:row-span-1">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-zinc-900">
              瀏覽數據
            </h3>
            <el-icon class="text-zinc-500">
              <View />
            </el-icon>
          </div>
        </template>
        <div class="space-y-3">
          <div class="flex items-baseline justify-between">
            <p class="text-base text-zinc-600">
              總瀏覽次數
            </p>
            <p class="text-2xl font-bold text-blue-500">
              {{ programStats?.totalViews }}
            </p>
          </div>
          <div class="flex items-baseline justify-between">
            <p class="text-base text-zinc-600">
              本週瀏覽
            </p>
            <p class="text-2xl font-bold text-zinc-800">
              {{ programStats?.weeklyViews }}
            </p>
          </div>
          <div class="flex items-baseline justify-between">
            <p class="text-base text-zinc-600">
              轉換率
            </p>
            <p class="text-2xl font-bold text-green-600">
              {{ programStats?.totalViews ? ((programStats.appliedCount / programStats.totalViews) * 100).toFixed(1) : 0 }}%
            </p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
