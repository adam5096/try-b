<script setup lang="ts">
definePageMeta({
  name: 'companyLogin',
  layout: 'blank',
  ssr: false, // CSR 模式
});

import { ref } from 'vue';
import type { LoginData } from '~/types/company/company';

const authStore = useCompanyAuthStore();
const router = useRouter();

const loginData = ref<LoginData>({
  account: '',
  psd: '',
});
const isLoading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  isLoading.value = true;
  errorMessage.value = '';
  let willRedirect = false;
  try {
    await authStore.login(loginData.value);
    
    const redirectPath = useRoute().query.redirect as string;
    // 為了讓第一次畫面能以 SSR 預先渲染，登入後改為「全頁重新導向」
    // 僅允許導向到企業端內部頁面，否則回到企業首頁
    const targetPath = (redirectPath && redirectPath.startsWith('/company/'))
      ? redirectPath
      : router.resolve(routes.company.landing()).path;

    if (process.client) {
      // 進行全頁重新導向，於導向完成前維持按鈕 loading 狀態
      willRedirect = true;
      window.location.replace(targetPath);
    }

  } catch (error: any) {
    errorMessage.value = '登入失敗，請檢查您的帳號和密碼。';
  } finally {
    // 僅在未跳轉的情況下才關閉 loading
    if (!willRedirect) {
      isLoading.value = false;
    }
  }
}
</script>

<template>
  <div class="flex h-screen bg-white">
    <!-- Left side with background image -->
    <div class="hidden lg:block lg:w-1/2">
      <NuxtImg
        src="/img/home/home-worker-bg.webp"
        alt="Login background"
        class="h-full w-full object-cover"
        sizes="sm:0 md:50vw lg:50vw"
        format="webp"
        quality="80"
        placeholder="blur"
        loading="lazy"
      />
    </div>

    <!-- Right side with login form -->
    <div class="flex w-full items-center justify-center lg:w-1/2">
      <div class="w-full max-w-sm p-8">
        <div class="mb-8 text-left">
          <NuxtLink to="/" class="mb-4 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div
              class="flex h-10 w-10 items-center justify-center border border-gray-400 p-1 text-xs"
            >
              <span class="font-bold">TRY</span>
              <span class="font-bold text-primary-blue">β</span>
            </div>
            <span class="text-lg font-bold">TRYβ職業體驗平台</span>
          </NuxtLink>
          <h2 class="text-3xl font-bold text-gray-800">
            歡迎回來
          </h2>
          <p class="mt-2 text-gray-500">
            請登入您的帳戶或建立新帳戶
          </p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="account" class="mb-1 block text-sm font-medium text-gray-700">
              帳號 / 電子郵件
            </label>
            <input
              id="account"
              v-model="loginData.account"
              type="text"
              placeholder="請輸入您的帳號或電子郵件"
              autocomplete="username"
              class="w-full rounded-md border border-gray-300 p-3 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
              :disabled="isLoading"
              required
            />
          </div>

          <div class="mb-6">
            <div class="flex items-center justify-between">
              <label for="password" class="mb-1 block text-sm font-medium text-gray-700">
                密碼
              </label>
              <a href="#" class="text-sm text-primary-blue hover:underline">
                忘記密碼？
              </a>
            </div>
            <input
              id="password"
              v-model="loginData.psd"
              type="password"
              placeholder="請輸入您的密碼"
              autocomplete="current-password"
              class="w-full rounded-md border border-gray-300 p-3 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
              :disabled="isLoading"
              required
            />
          </div>

          <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {{ errorMessage }}
          </div>

          <div class="mb-6 flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              記住我的帳號
            </label>
          </div>

          <button
            type="submit"
            class="w-full rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isLoading"
            :aria-busy="isLoading"
            aria-live="polite"
          >
            <span v-if="isLoading" class="inline-flex items-center justify-center gap-2">
              <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              登入中…
            </span>
            <span v-else>登入</span>
          </button>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              還沒有帳戶？
              <NuxtLink to="/company/register" class="font-medium text-primary-blue hover:underline">
                立即註冊
              </NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>