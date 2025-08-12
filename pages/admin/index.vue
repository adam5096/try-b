<script setup lang="ts">
definePageMeta({ layout: 'blank' as any })

import { ref } from 'vue'
import { navigateTo } from '#app'
import { adminRoutes } from '~/utils/adminRoutes'

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const onSubmitLogin = () => {
  // 後續可在此加入實際驗證流程；目前先直接導向管理列表頁
  navigateTo(adminRoutes.programs())
}
</script>


<template>
  <div class="min-h-screen bg-white">
    <div class="mx-auto flex justify-center min-h-screen w-full max-w-container-admin">
      <!-- Left visual area -->
      <!-- <div class="hidden w-1/2 bg-brand-gray md:block"></div> -->

      <!-- Right form area -->
      <div class="flex w-full flex-col  md:w-1/2">
        <div class="flex flex-1 flex-col items-center justify-center px-6 py-10 md:px-12">
          <!-- Brand -->
          <div class="mb-8 flex items-center gap-3">
            <div class="flex h-8 w-12 items-center justify-center rounded border border-gray-300 text-[10px] text-gray-500">
              LOGO
            </div>
            <h1 class="text-xl font-semibold text-gray-800 md:text-2xl">TRYβ管理後台系統</h1>
          </div>

          <h2 class="mb-6 text-lg font-semibold text-gray-900 md:mb-8 md:text-xl">管理員登入</h2>

          <!-- Login form -->
          <form class="w-full max-w-md" @submit.prevent="onSubmitLogin">
            <div class="mb-4">
              <label for="admin-username" class="mb-2 block text-sm text-gray-700">帳號</label>
              <input
                id="admin-username"
                v-model="username"
                type="text"
                inputmode="email"
                autocomplete="username"
                placeholder="請輸入您的帳號"
                class="w-full rounded border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
              />
            </div>

            <div class="mb-4">
              <label for="admin-password" class="mb-2 block text-sm text-gray-700">密碼</label>
              <input
                id="admin-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="請輸入您的密碼"
                class="w-full rounded border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
              />
            </div>

            <div class="mb-6 flex items-center justify-between text-sm">
              <label class="inline-flex items-center gap-2 text-gray-700">
                <input type="checkbox" v-model="rememberMe" class="h-4 w-4 rounded border-gray-300 text-primary-blue focus:ring-primary-blue" />
                記住我的帳號
              </label>
              <a href="#" class="text-gray-500 hover:text-gray-700">忘記密碼?</a>
            </div>

            <button type="submit" class="w-full rounded bg-gray-700 px-4 py-3 text-white transition-colors hover:bg-gray-800">登入系統</button>
          </form>

          <!-- Help link -->
          <div class="mt-6 text-center text-sm text-gray-600 md:mt-8">
            遇到問題？
            <a href="#" class="font-medium text-gray-700 hover:text-primary-blue">聯絡系統管理員</a>
          </div>

          <div class="mt-8 w-full max-w-md border-t border-gray-200 md:mt-10"></div>

          <!-- Footer -->
          <div class="mt-4 text-center text-xs leading-6 text-gray-500">
            © 2025 管理後台系統. 版權所有。<br />
            使用本系統代表您同意我們的
            <a href="#" class="underline hover:text-gray-700">使用條款</a>
            和
            <a href="#" class="underline hover:text-gray-700">隱私政策</a>
          </div>
        </div>

        <!-- Optional slot area (not used by login, reserved for future pages) -->
        <div class="px-6 pb-10 md:px-12">
          <slot />
        </div>
      </div>
    </div>
  </div>
  
</template>

