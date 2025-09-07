<script lang="ts" setup>
import { useCompanyPlanStore } from '~/stores/company/usePlanStore';

const planStore = useCompanyPlanStore();
</script>

<template>
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
    <p v-else-if="planStore.error" class="text-sm text-red-500">
      無法載入方案資訊，請稍後再試。
    </p>
    <p v-else-if="planStore.hasPlan" class="text-sm text-green-600">
      {{ planStore.planStatusText }}
    </p>
    <p v-else class="text-sm text-orange-500">
      {{ planStore.planStatusText }}
    </p>
  </div>
</template>
