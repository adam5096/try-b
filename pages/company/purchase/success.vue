<template>
  <div class="space-y-6">
    <CompanyPlanStatusHeader />

    <div class="bg-white p-6 md:p-10 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-6 text-center">
        方案總覽
      </h2>
      <el-steps :active="3" finish-status="success" align-center class="mb-10">
        <el-step title="選擇方案" />
        <el-step title="付款方式" />
        <el-step title="完成付款" />
      </el-steps>

      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full"
        >
          <SharedCheckIcon class="w-12 h-12 text-green-500" />
        </div>
        <h3 class="mt-4 text-3xl font-bold">
          付款成功！
        </h3>
        <p class="mt-2 text-gray-500">
          您的方案已成功付款並確認
        </p>
      </div>

      <el-divider class="my-8" />

      <div class="max-w-2xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div>
            <p class="text-sm text-gray-500">
              訂單編號
            </p>
            <p class="font-medium text-lg">
              TXN20231215-78945
            </p>
          </div>
          <div class="md:text-left">
            <p class="text-sm text-gray-500">
              付款日期
            </p>
            <p class="font-medium text-lg">
              2025年12月15日 14:30
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">
              付款方式
            </p>
            <p class="font-medium text-lg">
              信用卡 (末四碼: 5678)
            </p>
          </div>
          <div class="md:text-left">
            <p class="text-sm text-gray-500">
              付款金額
            </p>
            <p class="font-bold text-xl">
              NT$ 2,700
            </p>
          </div>
        </div>
      </div>

      <div class="max-w-2xl mx-auto mt-8 p-6 bg-gray-50 rounded-lg">
        <h4 class="text-lg font-bold mb-4 text-center">
          方案詳情
        </h4>
        <div class="text-center">
          <p class="text-xl font-medium">
            60天 體驗人數上限 30 人
          </p>
          <p class="mt-2 text-gray-500">
            2025年12月25日 - 2025年3月25日
          </p>
        </div>
      </div>

      <p class="mt-8 text-center text-gray-500">
        我們已將訂單確認信發送至您的電子郵件: zhang.xiaoming@email.com
      </p>

      <div class="mt-8 text-center">
        <el-button @click="goToPlans">
          返回計畫列表
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { companyRoutes as r } from '~/utils/companyRoutes';

definePageMeta({
  layout: 'company',
  name: 'company-purchase-success',
});

const router = useRouter();

function goToPlans() {
  router.push(r.landing());
}
</script>

<style scoped>
:deep(.el-step__title) {
  font-size: 16px;
}
</style>