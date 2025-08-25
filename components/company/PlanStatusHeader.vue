<script lang="ts" setup>
import { useCompanyPlanStore } from '~/stores/company/usePlanStore';

const planStore = useCompanyPlanStore();
</script>

<template>
  <div class="p-4 bg-white rounded-lg mb-6">
    <p v-if="planStore.isLoading" class="text-sm text-gray-500">
      方案資訊載入中...
    </p>
    <p v-else-if="planStore.error" class="text-sm text-red-500">
      無法載入方案資訊，請稍後再試。
    </p>
    <p v-else-if="planStore.hasPlan" class="text-sm text-gray-500">
      {{ planStore.planStatusText }}
    </p>
    <p v-else class="text-sm text-gray-500">
      目前尚無有效方案。
    </p>
  </div>
</template>
