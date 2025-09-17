<template>
	<div>
		<!-- 標題骨架 -->
		<div
			v-if="showTitle"
			class="mb-4"
		>
			<div class="h-8 bg-gray-300 rounded-lg w-3/4 mb-2 skeleton" />
			<div class="h-4 bg-gray-300 rounded w-1/2 skeleton" />
		</div>

		<!-- 內容骨架 -->
		<div class="space-y-4">
			<!-- 圖片骨架 -->
			<div
				v-if="showImage"
				class="bg-gray-300 rounded-lg skeleton"
				:class="imageHeightClass"
			/>

			<!-- 文字行骨架 -->
			<div
				v-for="i in lines"
				:key="i"
				class="space-y-2"
			>
				<div
					class="h-4 bg-gray-300 rounded skeleton"
					:class="getLineWidth(i)"
				/>
			</div>

			<!-- 按鈕骨架 -->
			<div
				v-if="showButton"
				class="pt-2"
			>
				<div
					class="bg-gray-300 rounded-lg w-full skeleton"
					:class="buttonHeightClass"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	showTitle?: boolean // 是否顯示標題骨架
	showImage?: boolean // 是否顯示圖片骨架
	showButton?: boolean // 是否顯示按鈕骨架
	lines?: number // 文字行數
	imageHeightClass?: string // 圖片骨架高度（Tailwind 類別）
	buttonHeightClass?: string // 按鈕骨架高度（Tailwind 類別）
}

withDefaults(defineProps<Props>(), {
	showTitle: true,
	showImage: true,
	showButton: false,
	lines: 3,
	imageHeightClass: 'h-48',
	buttonHeightClass: 'h-10',
});

// 根據行數決定寬度變化，讓骨架看起來更自然
const getLineWidth = (lineIndex: number) => {
	const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3'];
	return widths[lineIndex % widths.length] || 'w-full';
};
</script>
