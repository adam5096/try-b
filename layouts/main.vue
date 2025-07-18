<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

// --- Header State (Moved from pages/index.vue) ---
const isMenuOpen = ref(false);

watch(isMenuOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    }
  }
});

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// --- Footer State ---
const quickLinks = ref([
  { text: '首頁', href: '#' },
  { text: '企業方案', href: '#' },
]);

const contactInfo = ref({
  address: '地址：台北市大安區創意街123號',
  phone: '電話：(+886)2-9999-8888',
  email: 'EMail：hello@explorelab.com',
});

const socialLinks = ref([
  { icon: ['fab', 'facebook'], href: '#', name: 'Facebook' },
  { icon: ['fab', 'instagram'], href: '#', name: 'Instagram' },
  { icon: ['fab', 'line'], href: '#', name: 'Line' },
]);
</script>

<template>
  <div>
    <!-- Header (Moved from pages/index.vue) -->
    <header class="nav-shadow sticky bg-white z-40">
      <div class="h-main-header w-full max-w-screen-full-hd mx-auto p-12">
        <nav class="flex h-full items-center justify-between gap-8">
          <!-- 商標 Section -->
          <h1 class="flex flex-none items-center gap-2 text-2xl">
            <div class="w-site-logo-width h-site-logo-height">
              <img src="~/assets/img/Try-beta-logo.webp" alt="TRYB Logo" class="w-full h-auto object-cover">
            </div>
          </h1>

          <!-- Desktop Search Bar 搜尋欄 -->
          <div class="hidden lg:flex flex-1 justify-center px-4">
            <div
              class="w-full min-w-[150px] max-w-[1000px] flex items-center justify-center mx-auto border border-gray-200 rounded-lg p-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input type="text" placeholder="搜尋職業體驗機會..." class="w-full bg-transparent focus:outline-none">
            </div>
          </div>

          <!-- 右側導覽 -->
          <div class="flex items-center">
            <!-- Mobile Menu Button -->
            <button class="lg:hidden" @click="toggleMenu">
              <HamburgerIcon class="h-8 w-8 text-gray-700" />
            </button>

            <!-- 右側導覽 -->
            <div :class="[
                'fixed top-0 left-0 z-50 h-1/2 w-full transform overflow-y-auto bg-white p-8 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:flex lg:h-auto lg:w-auto lg:transform-none lg:overflow-y-visible lg:p-0 lg:bg-transparent',
                isMenuOpen ? 'translate-y-0' : '-translate-y-full',
              ]" class="flex flex-col gap-8 lg:flex-row lg:items-center">
              <!-- Close button for mobile -->
              <button class="absolute top-8 right-8 lg:hidden" @click="toggleMenu">
                <CloseIcon class="h-8 w-8 text-gray-700" />
              </button>

              <!-- 搜尋欄 (Mobile Only) -->
              <div
                class="mt-16 flex w-full justify-center border border-gray-200 rounded-lg p-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 lg:hidden">
                <input type="text" placeholder="搜尋職業體驗機會..." class="w-full bg-transparent focus:outline-none">
              </div>

              <!-- 右側導覽 -->
              <div class="flex flex-col gap-8 lg:flex-row lg:items-center">
                <a href="#" class="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  探索我們
                </a>
                <a href="#" class="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  方案
                </a>
                <div class="px-4 py-2 flex items-center gap-2">
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
            </div>
          </div>
          <!-- 遮罩 -->
          <div v-if="isMenuOpen" class="fixed inset-0 z-45 bg-black/30 lg:hidden" @click="toggleMenu"></div>
        </nav>
      </div>
    </header>

    <!-- Page content will be injected here -->
    <slot />

    <!-- Footer -->
    <footer class="relative text-white bg-cover bg-center overflow-hidden">
      <!-- Background Image Layer -->
      <div class="absolute inset-0 z-0">
        <img src="~/assets/img/hero-background-worker.webp" alt="Footer background" class="w-full h-full object-cover object-center" />
      </div>

      <!-- Blue Overlay Layer -->
      <div class="absolute inset-0 z-10 bg-major-blue opacity-90"></div>
      
      <!-- Beta Icon Layer -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-20">
        <BetaIcon class="w-[800px] h-auto text-white" />
      </div>

      <!-- Content Layer -->
      <div class="relative z-30 mx-auto max-w-container-main px-6 md:px-12 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          <!-- Column 1: Logo and Socials -->
          <div class="flex flex-col items-center md:items-start">
            <div class="flex items-center gap-4">
              <img src="~/assets/img/Try-beta-logo.webp" alt="TRYB Logo" class="w-40 h-auto filter-to-white">
            </div>
            <div class="mt-6 flex gap-6">
              <a v-for="link in socialLinks" :key="link.name" :href="link.href" class="text-white hover:text-btn-yellow transition-colors">
                <font-awesome-icon :icon="link.icon" class="h-8 w-8" />
              </a>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h3 class="font-bold text-lg mb-4">快速連結</h3>
            <ul class="space-y-2">
              <li v-for="link in quickLinks" :key="link.text">
                <a :href="link.href" class="hover:text-btn-yellow transition-colors">{{ link.text }}</a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Contact Info -->
          <div>
            <h3 class="font-bold text-lg mb-4">聯絡資訊</h3>
            <ul class="space-y-2">
              <li>{{ contactInfo.address }}</li>
              <li>{{ contactInfo.phone }}</li>
              <li>{{ contactInfo.email }}</li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-6 border-t border-white/30 text-center text-sm">
          <p>網站版權為 Try β 所有 Copyright © 2025 Try β . All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.filter-to-white {
  filter: brightness(0) invert(1);
}
</style> 