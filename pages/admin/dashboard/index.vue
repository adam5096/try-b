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
              <CalendarIcon v-if="m.icon === 'calendar'" class="h-6 w-6" />
              <svg v-else-if="m.icon === 'users'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
                <path d="M7.5 6a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM3 18.25a6.5 6.5 0 0113 0c0 .414-.336.75-.75.75h-11.5a.75.75 0 01-.75-.75zM17.25 7.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM15.75 12.75c1.933 0 3.75.78 5.06 2.04.188.177.29.424.29.682v2.778a.75.75 0 01-.75.75h-3.594" />
              </svg>
              <StarIcon v-else-if="m.icon === 'star'" class="h-6 w-6" />
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
                <path d="M3 3.75A.75.75 0 013.75 3h.5a.75.75 0 01.75.75v15.5a.75.75 0 01-.75.75h-.5A.75.75 0 013 19.25V3.75zM8.5 9.75A.75.75 0 019.25 9h.5a.75.75 0 01.75.75v9.5a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75v-9.5zM14 6.75a.75.75 0 01.75-.75h.5a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-.5A.75.75 0 0114 19.25V6.75zM19.5 12.75a.75.75 0 01.75-.75h.5a.75.75 0 01.75.75v6.5a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75v-6.5z" />
              </svg>
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
  </div>
</template>

<script setup lang="ts">
import CalendarIcon from '~/components/CalendarIcon.vue'
import StarIcon from '~/components/StarIcon.vue'

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