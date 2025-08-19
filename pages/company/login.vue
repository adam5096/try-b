<script setup lang="ts">
import { ref } from 'vue';
import type { LoginData } from '~/types/company';

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
  try {
    await authStore.login(loginData.value);
    
    const route = useRoute();
    const redirectPath = route.query.redirect as string;

    // Security enhancement: Only redirect to internal company pages.
    // Otherwise, default to the company index page.
    if (redirectPath && redirectPath.startsWith('/company/')) {
      await navigateTo(redirectPath);
    } else {
      await navigateTo('/company');
    }

  } catch (error: any) {
    errorMessage.value = '登入失敗，請檢查您的帳號和密碼。';
    console.error('Login failed:', error);
  } finally {
    isLoading.value = false;
  }
}

definePageMeta({
  name: 'companyLogin',
  layout: 'blank',
});
</script>

<template>
  <div class="flex h-screen bg-white">
    <!-- Left side with background image -->
    <div class="hidden lg:block lg:w-1/2">
      <img
        src="~/assets/img/home/home-worker-bg.webp"
        alt="Login background"
        class="h-full w-full object-cover"
      />
    </div>

    <!-- Right side with login form -->
    <div class="flex w-full items-center justify-center lg:w-1/2">
      <div class="w-full max-w-sm p-8">
        <div class="mb-8 text-left">
          <div class="mb-4 flex items-center gap-2">
            <div
              class="flex h-10 w-10 items-center justify-center border border-gray-400 p-1 text-xs"
            >
              <span class="font-bold">TRY</span>
              <span class="font-bold text-primary-blue">β</span>
            </div>
            <span class="text-lg font-bold">TRYβ職業體驗平台</span>
          </div>
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
              class="w-full rounded-md border border-gray-300 p-3 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
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
              class="w-full rounded-md border border-gray-300 p-3 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
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
            class="w-full rounded-md bg-gray-800 py-3 font-bold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isLoading"
          >
            {{ isLoading ? '登入中...' : '登入' }}
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