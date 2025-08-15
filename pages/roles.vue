<script setup lang="ts">
definePageMeta({
  name: 'roles',
  layout: 'main'
});

const roles = ref([
  {
    title: '體驗者',
    description: '開啟職場任意門，體驗你的無限可能。',
    features: ['實習與專案合作機會', '多元職涯探索', '實際職務體驗計畫'],
    loginUrl: '/users/login'
  },
  {
    title: '企業',
    description: '每一場體驗，都是品牌加分的機會',
    features: [
      '輕鬆創建和管理您的體驗活動',
      '獲取詳細的預訂數據和分析',
      '提高品牌曝光度並擴大客戶群'
    ],
    loginUrl: '/company/login'
  }
]);
</script>

<template>
  <div class="bg-brand-gray">
    <div class="container mx-auto px-4 py-20 lg:py-24">
      <header class="mb-12 text-center">
        <h2 class="text-3xl font-bold text-primary-blue-dark">
          選擇您的角色
        </h2>
      </header>

      <main class="flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch">
        <!-- Role Card -->
        <div
          v-for="role in roles"
          :key="role.title"
          class="flex w-full max-w-md flex-col items-center rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm md:w-1/2"
        >
          <div class="mb-6 flex h-32 w-48 items-center justify-center rounded bg-gray-200 text-gray-500">
            圖片
          </div>
          <h3 class="mb-2 text-2xl font-bold text-primary-blue-dark">
            {{ role.title }}
          </h3>
          <p class="mb-6 text-gray-600">
            {{ role.description }}
          </p>
          <ul class="mb-8 space-y-3 text-left">
            <li
              v-for="feature in role.features"
              :key="feature"
              class="flex items-start"
            >
              <div class="flex-shrink-0">
                <HomeCheckIcon class="mr-3 h-5 w-5 text-primary-blue" />
              </div>
              <span>{{ feature }}</span>
            </li>
          </ul>
          <div class="mt-auto w-full pt-4">
            <NuxtLink
              :to="role.loginUrl"
              class="inline-block w-full rounded-lg border border-gray-300 px-6 py-3 text-center text-gray-700 transition-colors hover:bg-gray-100"
            >
              登入/註冊
            </NuxtLink>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>