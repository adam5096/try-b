<template>
	<client-only>
		<div
			class="w-full rounded-md border overflow-hidden bg-white relative"
			:class="heightClass"
		>
			<el-skeleton
				:loading="isMapLoading"
				animated
				:throttle="{ leading: 300, trailing: 300, initVal: true }"
				:count="1"
				style="width: 100%; height: 100%"
			>
				<template #template>
					<el-skeleton-item
						variant="image"
						style="width: 100%; height: 100%"
					/>
				</template>
				<template #default>
					<template v-if="safeSrc">
						<iframe
							:src="safeSrc"
							width="100%"
							height="100%"
							style="border:0; display:block;"
							loading="lazy"
							allowfullscreen
							referrerpolicy="no-referrer-when-downgrade"
							@load="handleLoad"
						/>
					</template>
					<template v-else>
						<div class="w-full h-full flex items-center justify-center text-zinc-500 text-sm px-4">
							{{ emptyText }}
						</div>
					</template>
				</template>
			</el-skeleton>
		</div>
	</client-only>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface Props {
	src?: string | null;
	heightClass?: string; // Tailwind 高度：如 h-64 md:h-96
	emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
	src: '',
	heightClass: 'h-64 md:h-96',
	emptyText: '地圖資訊暫缺',
});

const isMapLoading = ref(true);

const allowPrefixes = [
	'https://www.google.com/maps',
	'https://maps.google.com/maps',
];

// 將需要 API key 的 embed/v1 轉成不需 key 的 share 版嵌入：/maps?q=...&output=embed
const buildKeylessUrl = (sourceUrl: string): string => {
	try {
		const u = new URL(sourceUrl);
		if (u.pathname.startsWith('/maps/embed/v1/')) {
			const q = u.searchParams.get('q');
			if (q) {
				return `https://www.google.com/maps?q=${q}&output=embed`;
			}
		}
	}
	catch {
		// ignore
	}
	return '';
};

const safeSrc = computed(() => {
	const val = props.src?.toString() ?? '';
	if (!val) return '';

	// 若是需要 key 的 v1 形式，優先改為 keyless 形式（避免本機/未授權網域報錯）
	if (val.includes('/maps/embed/v1/')) {
		const keyless = buildKeylessUrl(val);
		if (keyless) return keyless;
	}

	// 允許的 Google Maps 網域
	return allowPrefixes.some(p => val.startsWith(p)) ? val : '';
});

const handleLoad = () => {
	isMapLoading.value = false;
};

// 根據 safeSrc 控制骨架顯示：無可用來源則不顯示骨架
watch(
	safeSrc,
	(val) => {
		isMapLoading.value = !!val;
	},
	{ immediate: true },
);

// 防止某些環境下 iframe @load 不觸發：僅在仍為 loading 時，延遲關閉骨架
if (import.meta.client) {
	let fallbackTimer: number | null = null;
	watch(
		isMapLoading,
		(loading) => {
			if (loading) {
				if (fallbackTimer !== null) clearTimeout(fallbackTimer);
				fallbackTimer = window.setTimeout(() => {
					if (isMapLoading.value) {
						isMapLoading.value = false;
					}
					fallbackTimer = null;
				}, 5000);
			}
			else if (fallbackTimer !== null) {
				clearTimeout(fallbackTimer);
				fallbackTimer = null;
			}
		},
		{ immediate: true },
	);
}
</script>

<style scoped>
/* 確保容器尺寸穩定，iframe 不會撐破父層 */
:host {
  display: block;
}
</style>
