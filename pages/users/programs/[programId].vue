<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  name: 'user-programs-programId',
  layout: 'user',
});

const router = useRouter();
const isFavorited = ref(false);

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value;
};

const goBack = () => {
  router.push({ name: 'user-landing' });
};

// 假資料：企業名稱（之後可換 API）
const companyName = ref('某某某科技資訊公司');
</script>

<template>
  <main class="min-h-screen bg-brand-gray">
    <div class="mx-auto max-w-container-users px-6 py-12 md:px-12">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-primary-blue-dark">體驗詳情</h1>
        <div class="flex items-center gap-4">
          <el-button type="primary" size="large">我要申請</el-button>
          <el-button size="large" @click="goBack">返回列表</el-button>
          <el-button size="large" @click="toggleFavorite">
            <div class="flex items-center gap-2">
              <font-awesome-icon :icon="[isFavorited ? 'fas' : 'far', 'heart']" />
              <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
            </div>
          </el-button>
        </div>
      </div>

      <!-- 企業封面區塊 -->
      <section aria-label="企業封面" class="mb-8">
        <div class="relative h-44 w-full rounded-lg bg-gray-300">
          <!-- 圓形 LOGO 佔位 -->
          <div
            class="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-600 bg-white text-sm font-semibold text-gray-700"
          >
            LOGO
          </div>

          <!-- 置中標題 -->
          <h2
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-800"
          >
            企業封面
          </h2>

          <!-- 公司名稱 -->
          <p class="absolute bottom-6 left-6 text-base font-medium text-gray-800">
            {{ companyName }}
          </p>
        </div>

        
      </section>

      <!-- 其餘內容佔位（後續區塊再實作） -->
      <div class="rounded-lg bg-white p-8 shadow-sm">
        <p>這裡是計畫的詳細內容...</p>
      </div>
    </div>
  </main>
</template>
