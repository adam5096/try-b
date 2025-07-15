<script setup lang="ts">
definePageMeta({
  name: 'index',
});
</script>

<template>

  <header class="bg-white nav-shadow sticky ">
    <div class="h-main-header w-full max-w-screen-full-hd mx-auto px-4">
      <nav class="flex items-center justify-between h-full gap-8">
        <!-- Logo Section -->
        <h1 class="flex items-center gap-2 text-2xl">
          <span class="text-4xl font-black">TRY β</span>
          <div class="flex flex-col text-sm">
            <div class="font-bold"> 短期職業</div>
            <div class="font-bold">體驗媒合平台</div>
          </div>
        </h1>

        <!-- Search Bar -->
        <div
          class="flex-1 flex justify-center mx-auto border border-gray-200 rounded-lg p-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <input type="text" placeholder="搜尋職業體驗機會..." class="w-full bg-transparent focus:outline-none">
        </div>

        <!-- Right Navigation -->
        <div class="flex items-center gap-8">
          <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            探索我們
          </a>
          <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            方案
          </a>
          <div class="flex items-center gap-2">
            <UserIcon class="w-6 h-6" />
            <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              登入
            </a>
            <span class="text-gray-400">/</span>
            <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              註冊
            </a>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
