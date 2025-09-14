<script setup lang="ts">
definePageMeta({
  name: 'user-login',
  layout: 'user',
  ssr: false, // CSR 模式
})

import { ref, watchEffect } from 'vue';
import { useUserAuthStore } from '~/stores/user/useAuthStore';
import type { UserLoginData } from '~/types/users/user';

const authStore = useUserAuthStore();
const route = useRoute();
const router = useRouter();

// Redirect if already logged in
watchEffect(() => {
  if (authStore.isLoggedIn) {
    router.push({ name: 'user-landing' });
  }
});

const loginData = ref<Omit<UserLoginData, 'password'>>({
  account: '',
});
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  isLoading.value = true;
  errorMessage.value = '';
  let willRedirect = false;
  try {
    const loginPayload: UserLoginData = {
      ...loginData.value,
      password: password.value,
    };
    await authStore.login(loginPayload);

    // 登入成功後，立即導航到使用者首頁
    const redirectPath = route.query.redirect as string;
    
    // 安全檢查：只允許導向內部使用者頁面
    if (redirectPath && redirectPath.startsWith('/users/')) {
      willRedirect = true;
      await navigateTo(redirectPath);
    } else {
      willRedirect = true;
      await navigateTo({ name: 'user-landing' });
    }
    
  } catch (error: any) {
    errorMessage.value = error.message || '登入失敗，請檢查您的帳號和密碼。';
  } finally {
    // 僅在未觸發路由跳轉時才關閉 loading
    if (!willRedirect) {
      isLoading.value = false;
    }
  }
}
</script>

<!-- up1 體驗者登入頁 -->
<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          歡迎回來
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          請登入您的帳戶以繼續使用平台服務
        </p>
      </div>
      <form
        class="mt-8 space-y-6"
        @submit.prevent="handleLogin"
      >
        <div class="rounded-md  -space-y-px">
          <div>
            <label
              for="account"
              class="block text-sm font-medium text-gray-700"
            >帳號</label>
            <input
              id="account"
              v-model="loginData.account"
              name="account"
              type="text"
              autocomplete="username"
              required
              class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
              placeholder="請輸入您的帳號"
            >
          </div>
          <div class="pt-4">
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
              >密碼</label>
              <div class="text-sm">
                <a href="#">忘記密碼？</a>
              </div>
            </div>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
              placeholder="請輸入您的密碼"
            >
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            >
            <label
              for="remember-me"
              class="ml-2 block text-sm text-gray-900"
            >記住我的登入資訊</label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative flex w-full justify-center rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
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
        </div>
      </form>
      <div class="relative">
        <div
          class="absolute inset-0 flex items-center"
          aria-hidden="true"
        >
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-gray-50 px-2 text-gray-500">或使用其他方式登入</span>
        </div>
      </div>
      <div>
        <button
          type="button"
          class="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          使用 Google 帳戶登入
        </button>
      </div>
      <div class="text-center text-sm">
        還沒有帳戶？
        <NuxtLink :to="{ name: 'user-register' }">立即註冊</NuxtLink>
      </div>
    </div>
  </div>
</template>
