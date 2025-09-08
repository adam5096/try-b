<!-- ep10-3 企業方案頁面 -->

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { useAllPlans } from '~/composables/api/company/useAllPlans';
import { useCompanyPlanStore } from '~/stores/company/usePlanStore';
import { isActivePlan } from '~/types/company/plan/current';

definePageMeta({
  layout: 'company',
  name: 'company-purchase-index',
})

const router = useRouter()
const { plans, isLoading, error, fetchAllPlans } = useAllPlans();
const planStore = useCompanyPlanStore();

onMounted(() => {
  fetchAllPlans();
});

const fallbackDescriptions: { [key: number]: string } = {
  2: '適合小型企業與新創公司',
  3: '適合持續成長的中小型企業',
  4: '適合中型企業與快速成長公司',
  5: '適合尋求規模化成長的大型企業',
  6: '適合大型企業與尋求長期合作的夥伴',
};

const processedPlans = computed(() => {
  if (!plans.value) {
    return [];
  }
  return plans.value.map(plan => ({
    ...plan,
    description: plan.description || fallbackDescriptions[plan.id] || '為您的企業需求量身打造',
  }));
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
  paymentDate: '2025 年 6 月 1 日 00:00',
  paymentMethod: '信用卡 (末四碼: 5678)',
  amount: 'TWD 2,700',
  details: {
    duration: '60天 體驗人數上限 30 人',
    limit: '體驗人數上限 30 人',
    period: '2025 年 6 月 1 日 - 2025 年 8 月 31 日',
  },
})

const activeStep = ref(0)

function selectPlan(planId: number) {
  return navigateTo({
    name: 'company-purchase-payment',
    query: { planId },
  })
}

// 由目前方案（紅框）共享資料到下方「方案詳情」（黃框）
const detailDurationAndLimit = computed(() => {
  const p = planStore.plan as any;
  if (p && isActivePlan(p)) {
    return `${p.plan_duration_days} 天 體驗人數上限 ${p.max_participants} 人`;
  }
  return `${currentPlan.value.details.duration}`; // fallback
});

const detailPeriod = computed(() => {
  const p = planStore.plan as any;
  if (p && isActivePlan(p)) {
    const start = new Date(p.start_date).toLocaleDateString('zh-TW');
    const end = new Date(p.end_date).toLocaleDateString('zh-TW');
    return `${start} - ${end}`;
  }
  return currentPlan.value.details.period; // fallback
});

// 顯示目前方案名稱（例如：方案C）；無資料時沿用「方案詳情」
const detailPlanName = computed(() => {
  const p = planStore.plan as any;
  if (p && isActivePlan(p)) {
    return p.plan_name || '方案詳情';
  }
  return '方案詳情';
});

// 目前方案售價（顯示於「付款金額」）
const detailPrice = computed(() => {
  const p = planStore.plan as any;
  if (p && isActivePlan(p)) {
    const price = Number(p.plan_price || 0);
    return `TWD ${price.toLocaleString('zh-TW')}`;
  }
  // fallback 舊靜態資料
  return currentPlan.value.amount;
});

// 千分位格式化（TWD）
function formatTwd(value: number | string) {
  const num = Number(value ?? 0);
  return `TWD ${num.toLocaleString('zh-TW')}`;
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
              {{ detailPrice }}
            </p>
          </div>
        </div>
        <div class="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p class="font-bold">
            {{ detailPlanName }}
          </p>
          <p class="text-lg font-semibold mt-2">
            {{ detailDurationAndLimit }}
          </p>
          <p class="text-sm text-gray-500">
            {{ detailPeriod }}
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
        <el-card v-for="plan in processedPlans" v-else :key="plan.id" shadow="hover">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-8 flex-1">
              <div class="min-w-[6rem]">
                <p class="font-bold">
                  {{ plan.name }}
                </p>
              </div>
              <!-- 第二列：天數 + 上限 與 描述 同一橫行 -->
              <div class="flex flex-col gap-1 flex-1">
                <div class="flex items-center gap-6">
                  <div class="text-sm text-gray-600 flex items-center gap-6 whitespace-nowrap">
                    <span>{{ plan.duration_days }} 天</span>
                    <span>體驗人數上限 {{ plan.max_participants }} 人</span>
                  </div>
                  <p class="text-sm text-gray-800 flex-1">
                    {{ plan.description }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-8">
              <p class="text-lg font-semibold w-32 text-right">
                {{ formatTwd(plan.price) }}
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

