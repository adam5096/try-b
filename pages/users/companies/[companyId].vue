<script setup lang="ts">
definePageMeta({
  name: 'user-company-detail',
  layout: 'user',
  ssr: false, // CSR 模式
});

import { ref } from 'vue';

// 假資料：公司資訊（待串 API）
const companyName = ref('某某某科技資訊公司');
const companyIntro = ref(
  '我們是一家專注於數位產品設計與平台研發的公司，致力於以使用者為中心打造穩定、友善且可擴展的產品。團隊成員來自各領域，包含前端、後端與資料工程，鼓勵跨域合作與持續學習。'
);
const lifeBenefits = ref([
  '年終與績效獎金制度完善',
  '每年教育訓練與技術分享',
  '彈性工時與遠端工作制度',
  '員工旅遊與定期團建活動',
]);

// 右欄公司資訊 / 聯繫資訊（佔位資料）
const companyInfo = ref([
  { label: '成立年份', value: '2018' },
  { label: '產業別', value: '軟體／SaaS' },
  { label: '員工人數', value: '80-120 人' },
  { label: '公司地址', value: '台北市信義區' },
]);
const contactInfo = ref([
  { label: '網站', value: 'https://example.com' },
  { label: 'Email', value: 'hr@example.com' },
  { label: '電話', value: '(02) 1234-5678' },
]);

// 環境照片（水平滑動的佔位版）
const envPhotos = ref(
  Array.from({ length: 6 }).map((_, i) => ({ id: i + 1 }))
);

// 相關體驗計畫（卡片列表佔位版）
const relatedPrograms = ref(
  Array.from({ length: 4 }).map((_, i) => ({
    id: i + 1,
    title: `體驗計畫範例 ${i + 1}`,
    brief: '以實作導向的體驗活動，著重跨域協作與快速學習。',
    date: '2025/10/01 - 2025/12/20',
  }))
);

// 簡易的評價清單（佔位資料）
const reviews = ref(
  Array.from({ length: 3 }).map((_, i) => ({
    id: i + 1,
    author: `匿名用戶 ${i + 1}`,
    rating: 4,
    createdAt: '2025/05/01',
    content:
      '公司文化開放，溝通順暢，提供充足的資源支持學習與實作。工作節奏踏實，整體體驗良好。',
  }))
);
</script>

<template>
  <main class="bg-brand-gray min-h-screen">
    <div class="mx-auto max-w-container-users px-6 md:px-12 py-10">
      <!-- 企業封面 -->
      <section class="mb-8">
        <div class="h-48 md:h-56 w-full rounded-lg bg-gray-300 flex items-center justify-center text-2xl text-gray-700">
          企業封面
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 主欄（左） -->
        <section class="lg:col-span-8 space-y-8">
          <!-- 公司介紹 -->
          <el-card class="!rounded-lg" shadow="never">
            <template #header>
              <h3 class="text-lg font-bold">公司介紹</h3>
            </template>
            <p class="leading-7 text-gray-700">{{ companyIntro }}</p>
            <div class="mt-6">
              <h4 class="font-semibold mb-2">生活福利</h4>
              <ul class="list-disc pl-6 space-y-1 text-gray-700">
                <li v-for="(b, i) in lifeBenefits" :key="i">{{ b }}</li>
              </ul>
            </div>
          </el-card>

          <!-- 環境照片（水平滑動） -->
          <el-card class="!rounded-lg" shadow="never">
            <template #header>
              <h3 class="text-lg font-bold">環境照片</h3>
            </template>
            <div class="relative">
              <div class="flex gap-4 overflow-x-auto pb-2">
                <div
                  v-for="p in envPhotos"
                  :key="p.id"
                  class="min-w-[220px] h-32 md:h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500"
                >
                  圖片(公司環境)
                </div>
              </div>
            </div>
          </el-card>

          <!-- 相關體驗計畫 -->
          <el-card class="!rounded-lg" shadow="never">
            <template #header>
              <h3 class="text-lg font-bold">相關體驗計畫</h3>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <el-card
                v-for="rp in relatedPrograms"
                :key="rp.id"
                shadow="hover"
                class="border border-gray-200 !rounded-lg"
              >
                <div class="h-28 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500">圖片(體驗縮圖)</div>
                <h4 class="font-semibold text-gray-800">{{ rp.title }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ rp.brief }}</p>
                <div class="text-xs text-gray-500 mt-2">{{ rp.date }}</div>
              </el-card>
            </div>
          </el-card>

          <!-- 體驗者評價 -->
          <el-card class="!rounded-lg" shadow="never">
            <template #header>
              <h3 class="text-lg font-bold">體驗者評價</h3>
            </template>
            <div class="space-y-6">
              <div v-for="rv in reviews" :key="rv.id" class="border-b border-gray-100 pb-4">
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <div class="font-medium text-gray-700">{{ rv.author }}</div>
                  <div class="text-xs">{{ rv.createdAt }}</div>
                </div>
                <el-rate :model-value="rv.rating" disabled class="!align-middle !-mt-1" />
                <p class="mt-2 text-gray-700 leading-7">{{ rv.content }}</p>
              </div>
            </div>
          </el-card>
        </section>

        <!-- 側欄（右） -->
        <aside class="lg:col-span-4 space-y-6">
          <el-card class="!rounded-lg" shadow="never">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold">企業資訊</h3>
                <div class="text-sm text-gray-500">{{ companyName }}</div>
              </div>
            </template>
            <dl class="text-gray-700 space-y-2">
              <div v-for="(meta, i) in companyInfo" :key="i" class="grid grid-cols-3 gap-2">
                <dt class="col-span-1 text-gray-500">{{ meta.label }}</dt>
                <dd class="col-span-2">{{ meta.value }}</dd>
              </div>
            </dl>
          </el-card>

          <el-card class="!rounded-lg" shadow="never">
            <template #header>
              <h3 class="text-lg font-bold">聯繫資訊</h3>
            </template>
            <dl class="text-gray-700 space-y-2">
              <div v-for="(c, i) in contactInfo" :key="i" class="grid grid-cols-3 gap-2">
                <dt class="col-span-1 text-gray-500">{{ c.label }}</dt>
                <dd class="col-span-2 break-all">{{ c.value }}</dd>
              </div>
            </dl>
          </el-card>
        </aside>
      </div>
    </div>
  </main>
</template>


