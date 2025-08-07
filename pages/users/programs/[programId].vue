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
</script>

<!-- up11 單一體驗計畫詳情頁 -->
<template>
  <main class="min-h-screen bg-brand-gray">
    <div class="mx-auto max-w-container-users px-6 py-12 md:px-12">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-primary-blue-dark">
          體驗詳情
        </h1>
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

      <!-- Main Content Area -->
      <div class="rounded-lg bg-white p-8 shadow-sm">
        <p>這裡是計畫的詳細內容...</p>
      </div>
    </div>
  </main>
</template>
