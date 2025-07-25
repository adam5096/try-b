<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

// --- Header State ---
const isLoggedIn = ref(false); // Simulate user login state
const isMenuOpen = ref(false);
const isProfileMenuOpen = ref(false);

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

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

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
    <!-- Header -->
    <header class="nav-shadow sticky bg-white z-40">
      <div class="h-main-header w-full max-w-screen-full-hd mx-auto p-12">
        <nav class="flex h-full items-center justify-between gap-8">
          <!-- 商標 Section -->
          <h1 class="flex flex-none items-center gap-2 text-2xl">
            <div class="w-site-logo-width h-site-logo-height">
            </div>
          </h1>

          <!-- Desktop Search Bar 搜尋欄 -->
          <div class="hidden lg:flex flex-1 justify-center px-4">
            <div
              class="w-full min-w-[150px] max-w-[400px] flex items-center justify-center mx-auto border border-gray-300 rounded-full px-4 py-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input type="text" placeholder="搜尋體驗計畫..." class="w-full bg-transparent focus:outline-none">
            </div>
          </div>

          <!-- Logged In User Section -->
          <div v-if="isLoggedIn" class="hidden lg:flex items-center gap-4">
            <a href="#" class="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
              首頁
            </a>
            <div class="relative">
              <button class="relative text-gray-600 hover:text-blue-600">
                <font-awesome-icon :icon="['fas', 'bell']" class="h-6 w-6" />
                <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">3</span>
              </button>
            </div>
            <div class="relative">
              <button @click="toggleProfileMenu" class="flex items-center gap-2">
                <img class="h-10 w-10 rounded-full object-cover" src="https://i.imgur.com/JS4g6z4.png" alt="User avatar">
              </button>
              <!-- Profile Dropdown -->
              <div v-if="isProfileMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <font-awesome-icon :icon="['fas', 'list-alt']" />
                  <span>申請清單</span>
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <font-awesome-icon :icon="['fas', 'heart']" />
                  <span>收藏清單</span>
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <font-awesome-icon :icon="['fas', 'user-circle']" />
                  <span>帳戶中心</span>
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <font-awesome-icon :icon="['fas', 'question-circle']" />
                  <span>評價列表</span>
                </a>
                 <div class="border-t my-1"></div>
                <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
                  <span>登出</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Guest Section -->
          <div v-else class="hidden lg:flex items-center gap-6">
            <a href="#" class="px-6 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors font-medium">
              首頁
            </a>
            <div class="flex items-center gap-2">
              <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                登入
              </a>
              <span class="text-gray-400">/</span>
              <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                註冊
              </a>
            </div>
          </div>

          <!-- 右側導覽 -->
          <div class="flex items-center">
            <!-- Mobile Menu Button -->
            <button class="lg:hidden" @click="toggleMenu">
              <HamburgerIcon class="h-8 w-8 text-gray-700" />
            </button>

            <!-- Mobile Menu Panel -->
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

              <!-- Logged In User Mobile Menu -->
               <div v-if="isLoggedIn" class="flex flex-col gap-8 lg:hidden">
                  <a href="#" class="flex items-center gap-3 px-4 py-2 text-lg text-gray-700 hover:bg-gray-100">
                    <font-awesome-icon :icon="['fas', 'list-alt']" />
                    <span>申請清單</span>
                  </a>
                  <a href="#" class="flex items-center gap-3 px-4 py-2 text-lg text-gray-700 hover:bg-gray-100">
                    <font-awesome-icon :icon="['fas', 'heart']" />
                    <span>收藏清單</span>
                  </a>
                  <a href="#" class="flex items-center gap-3 px-4 py-2 text-lg text-gray-700 hover:bg-gray-100">
                    <font-awesome-icon :icon="['fas', 'user-circle']" />
                    <span>帳戶中心</span>
                  </a>
                  <a href="#" class="flex items-center gap-3 px-4 py-2 text-lg text-gray-700 hover:bg-gray-100">
                    <font-awesome-icon :icon="['fas', 'question-circle']" />
                    <span>評價列表</span>
                  </a>
                   <div class="border-t my-1"></div>
                  <a href="#" class="flex items-center gap-3 px-4 py-2 text-lg text-gray-700 hover:bg-gray-100">
                    <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
                    <span>登出</span>
                  </a>
              </div>

              <!-- Guest Mobile Menu -->
              <div v-else class="flex flex-col gap-8 lg:hidden">
                <a href="#" class="px-4 py-2 text-lg text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  登入
                </a>
                <a href="#" class="px-4 py-2 text-lg text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  註冊
                </a>
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
    <footer class="bg-[#4B4B4B] text-white">
      <div class="mx-auto max-w-container-main px-6 md:px-12 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Logo and Social Media -->
          <div class="flex flex-col items-center md:items-start">
            <h2 class="text-3xl font-bold">TRYβ</h2>
            <div class="flex space-x-4 mt-6">
              <a href="#" class="text-gray-400 hover:text-white"><span class="sr-only">Facebook</span><font-awesome-icon :icon="['fab', 'facebook']" class="h-8 w-8" /></a>
              <a href="#" class="text-gray-400 hover:text-white"><span class="sr-only">Instagram</span><font-awesome-icon :icon="['fab', 'instagram']" class="h-8 w-8" /></a>
              <a href="#" class="text-gray-400 hover:text-white"><span class="sr-only">LINE</span><font-awesome-icon :icon="['fab', 'line']" class="h-8 w-8" /></a>
            </div>
          </div>

          <!-- Quick Links & Contact Info -->
          <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 class="font-semibold text-lg tracking-wider">快速連結</h3>
              <ul class="mt-4 space-y-4">
                <li><a href="#" class="hover:text-gray-300">首頁</a></li>
                <li><a href="#" class="hover:text-gray-300">企業方案</a></li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-lg tracking-wider">聯絡資訊</h3>
              <ul class="mt-4 space-y-4">
                <li class="flex items-center">
                  <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="w-5 mr-3" />
                  <span>台北市大安區創意街123號</span>
                </li>
                <li class="flex items-center">
                  <font-awesome-icon :icon="['fas', 'phone-alt']" class="w-5 mr-3" />
                  <span>+886-2-9999-8888</span>
                </li>
                <li class="flex items-center">
                  <font-awesome-icon :icon="['fas', 'envelope']" class="w-5 mr-3" />
                  <span>hello@explorelab.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-12 border-t border-gray-600 pt-8 text-center text-gray-400">
          <p>&copy; 2025 TRYβ 版權所有.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* You can add scoped styles here if needed */
</style> 