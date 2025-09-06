<script setup lang="ts">
definePageMeta({
  layout: 'company',
});

// 與公司端主列表 UI 完全一致，/company/programs 直接導向 /company
// 避免兩份列表頁並存造成體驗不一致與快取殘影
if (import.meta.client) {
  navigateTo('/company');
}
</script>

<template></template>
