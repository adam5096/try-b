<template>
	<div
		class="relative overflow-hidden"
		:class="wrapperClass"
		v-loading="!isLoaded"
		element-loading-text="載入中..."
		element-loading-background="rgba(255, 255, 255, 0.8)"
		element-loading-spinner="el-icon-loading"
	>
		<img
			ref="imgEl"
			:src="currentSrc"
			:alt="alt || 'image'"
			loading="lazy"
			decoding="async"
			:class="imgClass"
			@load="handleLoad"
			@error="handleError"
		>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';

interface Props {
	src?: string | null
	alt?: string
	fallbackSrc?: string
	imgClass?: string // classes applied to <img>
	wrapperClass?: string // classes applied to wrapper
	fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

const props = withDefaults(defineProps<Props>(), {
	src: '',
	alt: 'image',
	fallbackSrc: '/img/home/home-worker-bg.webp',
	imgClass: 'w-full h-48 object-cover',
	wrapperClass: '',
	fit: 'cover',
});

const isLoaded = ref(false);
const normalizeUrl = (u?: string | null) => {
	if (!u) {
		return u as any;
	}
	const httpsUrl = u.trim().replace(/^http:\/\//i, 'https://');
	try {
		return encodeURI(httpsUrl);
	}
	catch {
		return httpsUrl.replace(/\s/g, '%20');
	}
};
const currentSrc = ref<string>(normalizeUrl(props.src) || props.fallbackSrc);
const imgEl = ref<HTMLImageElement | null>(null);

// 移除 skeleton 相關邏輯，改用 v-loading

watch(
	() => props.src,
	(val) => {
		// 當來源改變時，重置為未載入並重新指向新來源
		isLoaded.value = false;
		currentSrc.value = normalizeUrl(val) || props.fallbackSrc;
	},
);

const handleLoad = () => {
	// 圖片載入完成，移除 loading 遮罩
	isLoaded.value = true;
};

const handleError = () => {
	// 若原圖失敗，嘗試切換到 fallback
	if (currentSrc.value !== props.fallbackSrc) {
		currentSrc.value = props.fallbackSrc;
		isLoaded.value = false; // 重置載入狀態，重新顯示 loading
	}
	else {
		// fallback 也失敗時，結束 loading 狀態
		isLoaded.value = true;
	}
};

// 若圖片已在快取中，立即移除 loading 遮罩
onMounted(async () => {
	await nextTick();
	const el = imgEl.value as HTMLImageElement | null;
	if (el && el.complete && el.naturalWidth > 0) {
		// 圖片已在快取中，立即移除 loading
		isLoaded.value = true;
	}
});
</script>
