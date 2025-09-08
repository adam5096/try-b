
<script setup lang="ts">
import { ref } from 'vue'
import { navigateTo } from '#app'
import { adminRoutes } from '~/utils/adminRoutes'

const isSidebarOpen = ref(false)
const activeIndex = ref(0)
const navItems = [
  { key: 'dashboard', label: '儀表板' },
  { key: 'programs', label: '體驗計畫' },
  { key: 'popular', label: '熱門體驗' },
  { key: 'comments', label: '評價管理' },
  { key: 'logout', label: '登出' },
]

const handleNav = (item: { key: string; label: string }, idx: number) => {
  activeIndex.value = idx
  if (item.key === 'programs') {
    navigateTo(adminRoutes.programs())
  }
  if (item.key === 'popular') {
    navigateTo(adminRoutes.trends())
  }
  if (item.key === 'comments') {
    navigateTo(adminRoutes.comments())
  }
  if (item.key === 'dashboard') {
    navigateTo(adminRoutes.dashboard())
  }
}
</script>


<template>
  <div class="min-h-screen w-full bg-white text-gray-900">
    <!-- Top bar -->
    <header class="flex h-16 w-full items-center justify-between bg-gray-700 px-4 text-white md:px-6 xl:px-8 header-compact">
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-12 items-center justify-center rounded bg-gray-600 text-[10px]">LOGO</div>
        <span class="text-lg font-semibold md:text-xl brand-full">TRYβ管理後台系統</span>
        <span class="text-lg font-semibold md:text-xl brand-compact">TRYβ</span>
      </div>
      <div class="flex items-center gap-3">
        <button class="md:hidden" @click="isSidebarOpen = !isSidebarOpen" aria-label="切換選單">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-7 w-7">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div class="hidden items-center gap-2 md:flex">
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM5.25 20.1a7.5 7.5 0 0113.5 0 .9.9 0 01-.9.9H6.15a.9.9 0 01-.9-.9z" clip-rule="evenodd" />
            </svg>
          </div>
          <span>管理員</span>
        </div>
      </div>
    </header>

    <div class="flex flex-col md:flex-row">
      <!-- Overlay for mobile sidebar -->
      <!-- Sidebar -->
      <aside
        class="w-full overflow-hidden bg-white transition-[max-height] duration-500 ease-in-out md:static md:h-auto md:max-h-full md:w-60 md:border-r md:transition-none xl:w-64"
        :class="isSidebarOpen ? 'max-h-screen' : 'max-h-0 md:max-h-full'"
      >
        <nav class="space-y-6 px-6 py-6">
          <button
            v-for="(item, idx) in navItems"
            :key="item.key"
            class="flex w-full items-center justify-between rounded px-2 py-2 text-left text-gray-800 hover:bg-brand-gray"
            @click="handleNav(item, idx)"
          >
            <span class="flex items-center gap-3">
              <span class="block h-5 w-1 rounded bg-gray-400" v-if="idx === activeIndex"></span>
              <span>{{ item.label }}</span>
            </span>
          </button>
        </nav>
      </aside>

      <!-- Content -->
      <main class="ml-0 flex min-h-[calc(100vh-4rem)] w-full flex-col p-4 md:p-6 xl:p-8">
        <slot />
      </main>
    </div>
  </div>

</template>

<style scoped>
/* 370px 以下統一精簡樣式 */
@media (max-width: 369.98px) {
  .header-compact {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
  .brand-full { display: none; }
  .brand-compact { display: inline; }
}
</style>
