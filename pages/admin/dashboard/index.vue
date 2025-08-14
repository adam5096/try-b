<template>
  <div class="mx-auto w-full max-w-container-admin space-y-6">
    <!-- Title & Intro -->
    <section>
      <h1 class="text-2xl font-semibold text-gray-900 md:text-3xl">儀表板</h1>
      <p class="mt-1 text-sm text-gray-600">歡迎回來，管理員！以下是平台的最新統計數據。</p>
    </section>

    <!-- Stats cards -->
    <section>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="m in metrics"
          :key="m.key"
          class="rounded border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center gap-3 text-gray-700">
            <div class="flex h-10 w-10 items-center justify-center rounded bg-brand-gray text-gray-600">
              <Calendar v-if="m.icon === 'calendar'" class="h-6 w-6" />
              <User v-else-if="m.icon === 'users'" class="h-6 w-6" />
              <StarFilled v-else-if="m.icon === 'star'" class="h-6 w-6" />
              <TrendCharts v-else class="h-6 w-6" />
            </div>
            <div class="text-sm text-gray-600">{{ m.label }}</div>
          </div>
          <div class="mt-3 text-3xl font-semibold text-gray-900">{{ m.value }}</div>
          <div class="mt-2 flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4 text-green-600">
              <path fill-rule="evenodd" d="M12 5.25a.75.75 0 01.75.75v10.19l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V6a.75.75 0 01.75-.75z" clip-rule="evenodd" />
            </svg>
            <span class="text-green-600">{{ m.delta }}</span>
            <span class="text-gray-500">{{ m.note }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Enterprise analytics -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 md:text-2xl">企業端數據</h2>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- 註冊帳號統計 -->
        <el-card shadow="never" body-class="p-4">
          <template #header>
            <div class="text-base font-semibold text-gray-900">註冊帳號統計</div>
          </template>
          <div class="relative h-56 w-full overflow-hidden rounded bg-white">
            <!-- y label -->
            <span class="absolute left-0 top-0 translate-y-1.5 text-xs text-gray-500">數量</span>
            <!-- chart placeholder -->
            <div class="absolute inset-0 translate-y-2 p-4">
              <div class="h-full w-full rounded bg-brand-gray"></div>
            </div>
            <!-- x label -->
            <span class="absolute bottom-1 right-2 text-xs text-gray-500">月份</span>
          </div>
        </el-card>

        <!-- 活動發布統計趨勢 -->
        <el-card shadow="never" body-class="p-4">
          <template #header>
            <div class="text-base font-semibold text-gray-900">活動發布統計趨勢</div>
          </template>
          <div class="relative h-56 w-full overflow-hidden rounded bg-white">
            <span class="absolute left-0 top-0 translate-y-1.5 text-xs text-gray-500">數量</span>
            <div class="absolute inset-0 translate-y-2 p-4">
              <div class="h-full w-full rounded bg-brand-gray"></div>
            </div>
            <span class="absolute bottom-1 right-2 text-xs text-gray-500">月份</span>
          </div>
        </el-card>

        <!-- 活動成團統計趨勢 -->
        <el-card shadow="never" body-class="p-4">
          <template #header>
            <div class="text-base font-semibold text-gray-900">活動成團統計趨勢</div>
          </template>
          <div class="relative h-56 w-full overflow-hidden rounded bg-white">
            <span class="absolute left-0 top-0 translate-y-1.5 text-xs text-gray-500">數量</span>
            <div class="absolute inset-0 translate-y-2 p-4">
              <div class="h-full w-full rounded bg-brand-gray"></div>
            </div>
            <span class="absolute bottom-1 right-2 text-xs text-gray-500">月份</span>
          </div>
        </el-card>

        <!-- 當月發布體驗的職業種類 -->
        <el-card shadow="never" body-class="p-4">
          <template #header>
            <div class="text-base font-semibold text-gray-900">當月發布體驗的職業種類</div>
          </template>
          <div class="flex h-56 w-full flex-col justify-between">
            <div class="flex flex-1 items-center justify-center">
              <div class="h-40 w-40 rounded-full bg-brand-gray"></div>
            </div>
            <div class="mt-3 flex items-center gap-6 text-sm">
              <span class="inline-flex items-center gap-2 text-gray-700"><span class="inline-block h-3 w-3 rounded-sm bg-green-400"></span>綠色產業類</span>
              <span class="inline-flex items-center gap-2 text-gray-700"><span class="inline-block h-3 w-3 rounded-sm bg-blue-400"></span>資訊類</span>
              <span class="inline-flex items-center gap-2 text-gray-700"><span class="inline-block h-3 w-3 rounded-sm bg-gray-500"></span>行銷與設計類</span>
            </div>
          </div>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Calendar, User, StarFilled, TrendCharts } from '@element-plus/icons-vue'

definePageMeta({
  name: 'admin-dashboard',
  layout: 'admin',
});

const metrics = [
  { key: 'totalPrograms', label: '總體驗計畫', value: '248', icon: 'calendar', delta: '12% 增長', note: '相比上個月' },
  { key: 'activeUsers', label: '活躍用戶', value: '1,842', icon: 'users', delta: '8% 增長', note: '相比上個月' },
  { key: 'newReviews', label: '新增評價', value: '356', icon: 'star', delta: '15% 增長', note: '相比上個月' },
  { key: 'avgRating', label: '平均評分', value: '4.7', icon: 'chart', delta: '0.2 增長', note: '相比上個月' },
]
</script>