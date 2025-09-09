<script lang="ts" setup>
import { useCompanyPlanStore } from '~/stores/company/usePlanStore';

const planStore = useCompanyPlanStore();
</script>

<template>
  <ClientOnly>
    <div class="p-4 bg-white rounded-lg mb-6">
      <template v-if="planStore.isLoading">
        <el-skeleton animated>
          <template #template>
            <div class="flex flex-wrap items-center gap-3">
              <el-skeleton-item variant="text" style="width: 140px; height: 20px; border-radius: 9999px" />
              <el-skeleton-item variant="text" style="width: 220px; height: 20px; border-radius: 9999px" />
              <el-skeleton-item variant="text" style="width: 100px; height: 20px; border-radius: 9999px" />
            </div>
          </template>
        </el-skeleton>
      </template>
      <template v-else>
        <!-- 未付款：顯示替代文案覆蓋原內容 -->
        <template v-if="!planStore.isPayed">
          <p class="text-sm text-orange-500">
            方案已過期或已達體驗人數上限
          </p>
        </template>
        <!-- 已付款：沿用原本顯示邏輯 -->
        <template v-else>
          <p v-if="planStore.error" class="text-sm text-red-500">
            無法載入方案資訊，請稍後再試。
          </p>
          <p v-else-if="planStore.hasPlan" class="text-sm text-green-600">
            {{ planStore.planStatusText }}
          </p>
          <p v-else class="text-sm text-orange-500">
            {{ planStore.planStatusText }}
          </p>
        </template>
      </template>
    </div>

    <template #fallback>
      <div class="p-4 bg-white rounded-lg mb-6">
        <el-skeleton animated>
          <template #template>
            <div class="flex flex-wrap items-center gap-3">
              <el-skeleton-item variant="text" style="width: 140px; height: 20px; border-radius: 9999px" />
              <el-skeleton-item variant="text" style="width: 220px; height: 20px; border-radius: 9999px" />
              <el-skeleton-item variant="text" style="width: 100px; height: 20px; border-radius: 9999px" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </template>
  </ClientOnly>
</template>