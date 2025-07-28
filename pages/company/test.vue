<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'company',
});

const selectValue = ref('Option1')
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">
      隔離測試頁面
    </h1>
    <p class="mb-2">
      這個頁面只包含一個最基本的 El-Select 元件，用以診斷 v-model 的問題。
    </p>
    <p class="mb-4">
      當前的選中值是：<span class="font-mono text-red-500">{{ selectValue }}</span>
    </p>

    <ClientOnly>
      <el-select v-model="selectValue" placeholder="請選擇" size="large" style="width: 240px">
        <el-option label="選項一" value="Option1" />
        <el-option label="選項二" value="Option2" />
        <el-option label="選項三" value="Option3" />
      </el-select>
    </ClientOnly>
  </div>
</template> 