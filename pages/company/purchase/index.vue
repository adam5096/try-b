<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'company',
  name: 'company-purchase-index',
})

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

interface PlanOption {
  id: number
  duration: string
  limit: string
  description: string
  price: string
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

const planOptions = ref<PlanOption[]>([
  { id: 1, duration: '30天', limit: '體驗人數上限 10 人', description: '適合小型企業與新創公司', price: 'TWD1000' },
  { id: 2, duration: '60天', limit: '體驗人數上限 30 人', description: '適合中小型企業', price: 'TWD2000' },
  { id: 3, duration: '90天', limit: '體驗人數上限 50 人', description: '適合中型企業與快速成長公司', price: 'TWD2700' },
  { id: 4, duration: '180天', limit: '體驗人數上限 100 人', description: '適合大型企業', price: 'TWD5000' },
  { id: 5, duration: '365天', limit: '體驗人數上限 200 人', description: '適合大型企業與特殊需求', price: 'TWD9000' },
])

const activeStep = ref(0)
</script>

<template>
  <div class="p-8">
    <!-- Current Plan Static Info -->
    <div class="p-4 bg-white rounded-lg shadow-sm mb-6">
      <p class="text-sm text-gray-500">
        目前的方案 日期：2025/7/1 - 2025/8/1 10:10AM 體驗人數上限 10 人 剩餘體驗人數 5 人
      </p>
    </div>

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
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-xl font-bold">
            方案總覽
          </h2>
          <p class="text-sm text-gray-500">
            不限刊登次數，可同時刊登多種體驗
          </p>
        </div>
        <div class="w-1/3">
          <el-steps :active="activeStep" finish-status="success" simple>
            <el-step title="選擇方案" />
            <el-step title="付款方式" />
            <el-step title="完成付款" />
          </el-steps>
        </div>
      </div>

      <div class="space-y-4">
        <el-card v-for="plan in planOptions" :key="plan.id" shadow="hover">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-8">
              <div class="w-48">
                <p class="font-bold">
                  {{ plan.duration }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ plan.limit }}
                </p>
              </div>
              <p class="text-sm text-gray-800">
                {{ plan.description }}
              </p>
            </div>
            <div class="flex items-center gap-8">
              <p class="text-lg font-semibold w-32 text-right">
                {{ plan.price }}
              </p>
              <el-button type="primary">
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
/* Add any additional styles if needed */
</style>

