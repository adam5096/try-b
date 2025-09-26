<template>
	<div>
		<slot v-if="isClient" />
		<div
			v-else
			class="skeleton bg-gray-200 animate-pulse"
			:style="{ height: fallbackHeight }"
		/>
	</div>
</template>

<script setup lang="ts">
interface Props {
	fallbackHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
	fallbackHeight: '200px',
});

const isClient = ref(false);

onMounted(() => {
	isClient.value = true;
});
</script>
