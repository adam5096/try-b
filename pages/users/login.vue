<script setup lang="ts">
definePageMeta({
  name: 'user-login',
  layout: 'user'
})

function onSubmit() {
  // 模擬登入流程後導向使用者首頁
  navigateTo({ name: 'user-landing' });
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
        action="#"
        method="POST"
        @submit.prevent="onSubmit"
      >
        <div class="rounded-md  -space-y-px">
          <div>
            <label
              for="email-address"
              class="block text-sm font-medium text-gray-700"
            >電子郵件</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
              placeholder="請輸入您的電子郵件"
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
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
              placeholder="請輸入您的密碼"
            >
          </div>
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
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            登入
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
