<template>
	<div>
		<slot v-if="!hasError" />
		<SharedErrorMessage
			v-else
			:title="errorTitle"
			:message="errorMessage"
			:show-refresh="true"
			:show-back="true"
			@refresh="handleRefresh"
			@back="handleBack"
		/>
	</div>
</template>

<script setup lang="ts">
interface Props {
	fallbackTitle?: string;
	fallbackMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
	fallbackTitle: '發生錯誤',
	fallbackMessage: '很抱歉，頁面載入時發生問題。',
})

const hasError = ref(false);
const errorTitle = ref(props.fallbackTitle);
const errorMessage = ref(props.fallbackMessage);

const handleRefresh = () => {
	hasError.value = false;
  // 重新載入頁面
  window.location.reload();
};

const handleBack = () => {
	// 返回上一頁
	if (window.history.length > 1) {
		window.history.back();
  }
	else {
		// 如果沒有歷史記錄，導航到首頁
		navigateTo('/');
  }
};

// 監聽子組件的錯誤
onErrorCaptured((error: Error) => {
	hasError.value = true;
  errorTitle.value = '組件載入錯誤';
  errorMessage.value = error.message || props.fallbackMessage;

  // 記錄錯誤
  console.error('ErrorBoundary caught error:', error);

  // 阻止錯誤繼續傳播
  return false;
})
</script>
