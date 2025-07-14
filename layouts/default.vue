<script setup lang="ts">
import { routes as r } from '~/utils/routes';
</script>

<template>
  <div class="p-4">
    <header>
      <nav class="flex flex-col gap-8">
        <!-- 首頁 -->
        <div>
          <div class="font-bold mb-2">首頁相關</div>
          <div class="flex flex-col gap-2 pl-4">
            <NuxtLink :to="r.home()">Home</NuxtLink>
            <NuxtLink :to="r.loginRoles()">Roles</NuxtLink>
          </div>
        </div>

        <!-- 體驗者 -->
        <div>
          <div class="font-bold mb-2">體驗者相關</div>
          <div class="flex flex-col gap-2 pl-4">
            <NuxtLink :to="r.user.landing()">up10 熱門/一般體驗計畫總覽頁</NuxtLink>
            <NuxtLink :to="r.user.login()">up1 體驗者登入頁</NuxtLink>
            <NuxtLink :to="r.user.programDetail(1)">up11 單一體驗計畫詳情頁</NuxtLink>
            <NuxtLink :to="r.user.applications()">up6 申請活動的狀態追蹤頁</NuxtLink>
            <NuxtLink :to="r.user.comments()">up15 評價列表</NuxtLink>
            <NuxtLink :to="r.user.commentsDetail(1)">up7 填寫評價頁面</NuxtLink>
          </div>
        </div>

        <!-- 企業 -->
        <div>
          <div class="font-bold mb-2">企業相關</div>
          <div class="flex flex-col gap-2 pl-4">
            <NuxtLink :to="r.company.login()">ep1-1 企業登入頁面</NuxtLink>
            <NuxtLink :to="r.company.landing()">ep6 所有計畫申請列表頁面</NuxtLink>
            <NuxtLink :to="r.company.programDetail(1)">ep7 單一計畫詳情頁</NuxtLink>
            <NuxtLink :to="r.company.applicants(1)">ep8 體驗者申請列表頁面</NuxtLink>
            <NuxtLink :to="r.company.applicantDetail(1)">ep9 體驗者申請審核頁面</NuxtLink>
          </div>
        </div>
      </nav>
    </header>
    <main class="py-4">
      <slot />
    </main>
  </div>
</template>
