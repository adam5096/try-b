<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useUserAuthStore } from '~/stores/user/useAuthStore';

// --- Header State (Moved from pages/index.vue) ---
const isMenuOpen = ref(false);
const mobileMenuRef = ref<HTMLElement | null>(null);
const menuHeight = ref(0);

watch(isMenuOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';

      nextTick(() => {
        if (mobileMenuRef.value) {
          menuHeight.value = mobileMenuRef.value.offsetHeight;
        }
      });
    } else {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      menuHeight.value = 0;
    }
  }
});

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

const userLinks = ref([
  {
    name: '申請清單',
    route: { name: 'user-applications' },
    icon: ['fas', 'clipboard-list']
  },
  {
    name: '收藏清單',
    route: { name: 'user-favorites' },
    icon: ['fas', 'heart']
  },
  {
    name: '帳戶中心',
    route: { name: 'user-settings' },
    icon: ['fas', 'circle-user']
  },
  {
    name: '評價列表',
    route: { name: 'user-comments' },
    icon: ['fas', 'star']
  }
]);

const authStore = useUserAuthStore();

async function handleLogout() {
  try {
    await ElMessageBox.confirm(
      '您確定要登出嗎？',
      '確認登出',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    await authStore.logout();
    await navigateTo({ name: 'user-login' });
  } catch (error) {
    // Suppress error when user clicks "cancel"
    if (error !== 'cancel') {
      console.error('Logout failed:', error);
    }
  }
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
</script>

<template>
  <div>
    <!-- Header (Moved from pages/index.vue) -->
    <header class="nav-shadow fixed top-0 left-0 w-full bg-white z-40 h-[90px] flex items-center">
      <nav class="w-full max-w-screen-full-hd mx-auto px-6 lg:px-8 flex h-full items-center justify-between gap-8">
          <!-- 商標 Section -->
          <h1 class="flex flex-none items-center text-2xl">
            <NuxtLink to="/" class="flex items-center gap-2">
              <div class="w-site-logo-width h-site-logo-height">
                <NuxtImg
                  src="/img/home/try-beta-logo.webp"
                  alt="TRY Beta 網站商標"
                  class="h-full w-full object-contain"
                />
              </div>
            </NuxtLink>
          </h1>

          <!-- Desktop Search Bar 搜尋欄 -->
          <div class="hidden lg:flex flex-1 justify-center px-4">
            <div
              class="w-full min-w-[150px] max-w-[1000px] flex items-center justify-center mx-auto border border-gray-200 rounded-lg p-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input type="text" placeholder="搜尋職業體驗機會..." class="w-full bg-transparent focus:outline-none">
            </div>
          </div>

          <!-- 右側導覽 -->
          <div class="hidden lg:flex items-center gap-6">
            <NuxtLink :to="{ name: 'index' }" class="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
              首頁
            </NuxtLink>

            <!-- Logged in state -->
            <template v-if="authStore.isLoggedIn">
              <el-badge :value="3" :max="9" class="item">
                <font-awesome-icon :icon="['fas', 'bell']" class="w-6 h-6 text-gray-600 cursor-pointer" />
              </el-badge>
              
              <el-dropdown>
                <span class="flex items-center gap-2 cursor-pointer">
                  <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <font-awesome-icon :icon="['fas', 'circle-user']" class="w-6 h-6 text-gray-600" />
                  </div>
                  <span>{{ authStore.user?.name }}</span>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="link in userLinks" :key="link.name">
                      <NuxtLink :to="link.route" class="flex items-center gap-3">
                        <font-awesome-icon :icon="link.icon" class="w-4 h-4" />
                        <span>{{ link.name }}</span>
                      </NuxtLink>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="handleLogout">
                      <div class="flex items-center gap-3">
                        <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" class="w-4 h-4" />
                        <span>登出</span>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>

            <!-- Guest state -->
            <template v-else>
               <NuxtLink :to="{ name: 'user-login' }">
                <el-button >登入 / 註冊</el-button>
              </NuxtLink>
            </template>
          </div>

          <!-- Mobile Menu Button -->
          <div class="lg:hidden">
            <button @click="toggleMenu">
              <HamburgerIcon class="h-8 w-8 text-gray-700" />
            </button>
          </div>
          
          <!-- Mobile Menu -->
          <div
            ref="mobileMenuRef"
            :class="[
              'fixed -top-[90px] left-0 z-30 w-full transform overflow-y-auto bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out lg:hidden',
              isMenuOpen ? 'translate-y-[90px]' : '-translate-y-full',
            ]">
            <!-- Close button for mobile -->
            <button class="absolute top-6 right-6" @click="toggleMenu">
              <CloseIcon class="h-8 w-8 text-gray-700" />
            </button>

            <!-- Navigation Links -->
            <div class="mt-16">
              <nav>
                <ul v-if="authStore.isLoggedIn">
                  <li v-for="link in userLinks" :key="link.name" class="mb-2">
                    <NuxtLink :to="link.route" @click="toggleMenu" class="flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-lg" active-class="bg-blue-100 text-blue-600 font-semibold">
                      <font-awesome-icon :icon="link.icon" class="w-5 h-5" />
                      <span>{{ link.name }}</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-lg">
                      <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" class="w-5 h-5" />
                      <span>登出</span>
                    </button>
                  </li>
                </ul>
                 <ul v-else>
                  <li>
                    <NuxtLink :to="{ name: 'user-login' }" @click="toggleMenu" class="flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-lg">
                      <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" class="w-5 h-5" />
                      <span>登入 / 註冊</span>
                    </NuxtLink>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <!-- 遮罩 -->
          <div v-if="isMenuOpen" class="fixed inset-0 z-45 bg-black/30 lg:hidden" @click="toggleMenu"></div>
      </nav>
    </header>

    <!-- Page content will be injected here -->
    <main class="pt-[90px] bg-brand-gray transition-all duration-300 ease-in-out" :style="{ paddingTop: `${90 + menuHeight}px` }">
      <div class="mx-auto max-w-container-users px-6 md:px-12 py-10">
            <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.filter-to-white {
  filter: brightness(0) invert(1);
}
.pt-\[90px\] {
  padding-top: 90px;
}
</style> 