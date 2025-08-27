<!-- ep10-3 企業方案頁面 -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { useAllPlans } from '~/composables/api/company/useAllPlans';

definePageMeta({
  layout: 'company',
  name: 'company-purchase-index',
})

const router = useRouter()
const { plans, isLoading, error, fetchAllPlans } = useAllPlans();

onMounted(() => {
  fetchAllPlans();
});

interface CurrentPlan {
  orderNumber: string
  paymentDate: string
  paymentMethod: string
  amount: string
  details: {
    duration: string
    limit: string
    period: string
  }
}

const currentPlan = ref<CurrentPlan>({
  orderNumber: 'TXN20231215-78945',
  paymentDate: '2025年12月15日 14:30',
  paymentMethod: '信用卡 (末四碼: 5678)',
  amount: 'NT$ 2,700',
  details: {
    duration: '60天',
    limit: '體驗人數上限 30 人',
    period: '2025年12月25日 - 2026年3月25日',
  },
})

const activeStep = ref(0)

function selectPlan(planId: number) {
  return navigateTo({
    name: 'company-purchase-payment',
    query: { planId },
  })
}
</script>

<template>
  <div class="p-8">
    <!-- Current Plan Static Info -->
    <CompanyPlanStatusHeader />

    <!-- Current Plan Details -->
    <div class="mb-8">
      <h2 class="text-xl font-bold mb-4">
        目前方案
      </h2>
      <el-card shadow="never">
        <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <p class="text-gray-500">
              訂單編號
            </p>
            <p class="font-semibold">
              {{ currentPlan.orderNumber }}
            </p>
          </div>
          <div>
            <p class="text-gray-500">
              付款日期
            </p>
            <p class="font-semibold">
              {{ currentPlan.paymentDate }}
            </p>
          </div>
          <div>
            <p class="text-gray-500">
              付款方式
            </p>
            <p class="font-semibold">
              {{ currentPlan.paymentMethod }}
            </p>
          </div>
          <div>
            <p class="text-gray-500">
              付款金額
            </p>
            <p class="font-semibold text-lg">
              {{ currentPlan.amount }}
            </p>
          </div>
        </div>
        <div class="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p class="font-bold">
            方案詳情
          </p>
          <p class="text-lg font-semibold mt-2">
            {{ currentPlan.details.duration }} {{ currentPlan.details.limit }}
          </p>
          <p class="text-sm text-gray-500">
            {{ currentPlan.details.period }}
          </p>
        </div>
      </el-card>
    </div>

    <!-- Plan Selection -->
    <div>
      <h2 class="text-xl font-bold text-center">
        方案總覽
      </h2>
      <p class="text-sm text-gray-500 text-center mb-4">
        不限刊登次數，可同時刊登多種體驗
      </p>
      <div class="mb-4">
        <el-steps :active="0" finish-status="success" align-center>
          <el-step title="選擇方案" />
          <el-step title="付款方式" />
          <el-step title="完成付款" />
        </el-steps>
      </div>

      <div class="space-y-4">
        <div v-if="isLoading">
          <p>載入中...</p>
        </div>
        <div v-else-if="error">
          <p>讀取方案時發生錯誤: {{ error.message }}</p>
        </div>
        <el-card v-for="plan in plans" v-else :key="plan.id" shadow="hover">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-8">
              <div class="w-48">
                <p class="font-bold">
                  {{ plan.name }}
                </p>
                <p class="text-sm text-gray-600">
                  體驗人數上限 {{ plan.max_participants }} 人
                </p>
              </div>
              <p class="text-sm text-gray-800">
                {{ plan.description || '暫無描述' }}
              </p>
            </div>
            <div class="flex items-center gap-8">
              <p class="text-lg font-semibold w-32 text-right">
                TWD{{ plan.price }}
              </p>
              <el-button type="primary" @click="selectPlan(plan.id)">
                選擇
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-step.is-simple .el-step__title) {
  @apply whitespace-nowrap;
}
:deep(.el-step__head.is-success) {
  .el-step__line {
    @apply bg-green-500;
  }
  .el-step__icon {
    @apply bg-green-500 text-white;
  }
}
:deep(.el-step__title.is-success) {
  @apply text-green-500;
}
</style>

