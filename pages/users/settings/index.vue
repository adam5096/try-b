<script setup lang="ts">
import UserIcon from '~/components/UserIcon.vue';

definePageMeta({
  name: 'user-settings',
  layout: 'user',
});
</script>

<template>
  <main class="min-h-screen bg-brand-gray">
    <div class="mx-auto max-w-container-users px-6 py-12 md:px-12">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-primary-blue-dark">
          帳戶中心設置
        </h1>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
          <UserIcon class="h-12 w-12 text-gray-500" />
        </div>
        <div>
          <p class="text-xl font-bold text-primary-blue-dark">
            林威辰
          </p>
          <p class="text-sm text-gray-500">
            台灣體驗管理員
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

