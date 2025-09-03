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
const { data: programDetail, error: programError, pending: isLoading } = await useProgramDetail(
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

// 申請統計資料 (從 e comp 7 API 回應中取得)
const totalApplicants = computed(() => programStats.value?.appliedCount ?? 0);
const reviewedApplicants = computed(() => 0); // 暫時設為 0，等待後續 API 實作
const pendingApplicants = computed(() => 0); // 暫時設為 0，等待後續 API 實作
// --- End Data Fetching ---


// --- SEO Meta ---
// 確保 program 資料存在才設定 meta
if (program.value) {
  useSeoMeta({
    title: `${program.value.name}｜Try B 企業實習體驗平台`,
    description: program.value.intro.substring(0, 150), // 截取前 150 字作為描述
    ogTitle: `${program.value.name}｜Try B 企業實習體驗平台`,
    ogDescription: program.value.intro.substring(0, 150),
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
  <div v-if="programError" class="p-6 lg:p-8">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">載入失敗</h1>
      <p class="text-gray-600 mb-4">{{ programError.message }}</p>
      <el-button type="primary" @click="refresh()">重新載入</el-button>
    </div>
  </div>
  <div v-else-if="program" class="p-6 lg:p-8">
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
          <el-button type="primary" plain>
            編輯計畫
          </el-button>
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
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                體驗介紹
              </h3>
              <p class="text-zinc-700 leading-relaxed text-sm">
                {{ program?.intro }}
              </p>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                師資介紹
              </h3>
              <div class="space-y-4 text-sm">
                <div>
                  <h4 class="font-medium text-zinc-800">
                    林德榮
                  </h4>
                  <p class="text-zinc-700 mt-1 leading-relaxed">
                    資深研發顧問與雲端架構師 10 多年，擔任過後端開發、系統架構設計、技術顧問與團隊技術主管。深入理解敏捷開發、雲端平台、資料庫設計與 DevOps 實務，並從不同技術角色面向切入系統設計與開發經驗觀點，並結合實務專案經驗，擅長 B2B 系統架構設計與跨平台服務整合，運用不同的技術視角打開你的軟體開發新觀點。
                  </p>
                </div>
                <div>
                  <h4 class="font-medium text-zinc-800">
                    經歷
                  </h4>
                  <ul class="list-disc list-inside text-zinc-700 mt-1 space-y-1">
                    <li>國際雲端服務商 系統架構師</li>
                    <li>主導企業雲端平台架構設計與開發，協助客戶完成數位轉型，實現高可用、高擴展性的微服務系統。</li>
                    <li>知名新創公司 資深軟體工程師</li>
                    <li>負責核心產品的後端開發與 API 設計，並導入 CI/CD 流程，縮短交付週期、提升團隊開發效率。</li>
                    <li>跨境電商平台 技術顧問</li>
                    <li>協助規劃新資料庫架構與分散式架構，改善高流量環境下的系統穩定性，並培訓內部開發團隊。</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                參加限制
              </h3>
              <ul class="list-decimal list-inside text-zinc-700 text-sm space-y-1">
                <li>了解 JS 變數、陣列物件、DOM、監聽、AJAX 等知識，尚未熟練也沒關係。</li>
                <li>在履歷上需附上最近寫過的 JS Code、Codepen、Github Pages 皆可，或是分享目前 freeCodeCamp 的 JS 研究進度。</li>
                <li>18歲以上</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                行前須知、注意事項
              </h3>
              <ul class="list-decimal list-inside text-zinc-700 text-sm space-y-1">
                <li>請攜帶個人筆記型電腦，以便參與實作環節</li>
                <li>建議課前了解基本的數位行銷概念</li>
                <li>活動當天請提早 15 分鐘到達，以便完成報到手續</li>
                <li>午餐將由公司提供</li>
                <li>如有特殊飲食需求，請在申請表中註明</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                準備清單
              </h3>
              <ul class="list-decimal list-inside text-zinc-700 text-sm space-y-1">
                <li>筆記型電腦</li>
                <li>水壺</li>
                <li>證件(身分證、健保卡)</li>
                <li>手帕</li>
                <li>長袖外套</li>
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

      <!-- Location -->
      <el-card class="md:row-span-2">
        <template #header>
          <h3 class="font-bold text-zinc-900">
            體驗地點
          </h3>
        </template>
        <p class="text-sm text-zinc-700 mb-4">
          {{ program?.address }}
        </p>
        <div class="aspect-video bg-zinc-200 rounded-lg flex items-center justify-center">
          <p class="text-zinc-500">
            地圖
          </p>
        </div>
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
