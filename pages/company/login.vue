<script setup lang="ts">
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
              <span class="font-bold text-major-blue">β</span>
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

        <form>
          <div class="mb-4">
            <label for="email" class="mb-1 block text-sm font-medium text-gray-700">
              帳號 / 電子郵件
            </label>
            <input
              id="email"
              type="email"
              placeholder="請輸入您的帳號或電子郵件"
              class="w-full rounded-md border border-gray-300 p-3 focus:border-major-blue focus:outline-none focus:ring-1 focus:ring-major-blue"
            />
          </div>

          <div class="mb-6">
            <div class="flex items-center justify-between">
              <label for="password" class="mb-1 block text-sm font-medium text-gray-700">
                密碼
              </label>
              <a href="#" class="text-sm text-major-blue hover:underline">
                忘記密碼？
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="請輸入您的密碼"
              class="w-full rounded-md border border-gray-300 p-3 focus:border-major-blue focus:outline-none focus:ring-1 focus:ring-major-blue"
            />
          </div>

          <div class="mb-6 flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-major-blue focus:ring-major-blue"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              記住我的帳號
            </label>
          </div>

          <button
            type="submit"
            class="w-full rounded-md bg-gray-800 py-3 font-bold text-white transition hover:bg-gray-700"
          >
            登入
          </button>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              還沒有帳戶？
              <a href="#" class="font-medium text-major-blue hover:underline">
                立即註冊
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>