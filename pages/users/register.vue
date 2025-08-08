<script setup lang="ts">
definePageMeta({
  name: 'user-register',
  layout: 'user'
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          建立您的帳戶
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          請註冊您的帳戶以繼續使用平台服務
        </p>
      </div>
      <form
        class="mt-8 space-y-6"
        action="#"
        method="POST"
      >
        <div class="rounded-md -space-y-px">
          <div class="pt-4">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700"
            >姓名</label>
            <input
              id="name"
              name="name"
              type="text"
              autocomplete="name"
              required
              class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
              placeholder="請輸入您的姓名"
            >
          </div>
          <div class="pt-4">
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
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >密碼</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
              placeholder="請輸入您的密碼"
            >
          </div>
          <div class="pt-4">
            <label
              for="confirm-password"
              class="block text-sm font-medium text-gray-700"
            >確認密碼</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full rounded-md border-gray-300 px-1 py-2 shadow-sm focus:outline-none sm:text-sm"
              placeholder="請再次輸入您的密碼"
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-400 py-2 px-4 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            註冊
          </button>
        </div>
        <div class="text-center text-xs text-gray-500">
          註冊即表示您同意我們的<a href="#">服務條款</a>與<a href="#">隱私權政策</a>
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
          <span class="bg-gray-50 px-2 text-gray-500">或使用其他方式註冊</span>
        </div>
      </div>
      <div>
        <button
          type="button"
          class="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          使用 Google 帳戶註冊
        </button>
      </div>
    </div>
  </div>
</template>