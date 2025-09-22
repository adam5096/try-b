<script lang="ts" setup>
import { useCompanyProgramStore } from '~/stores/company/useProgramStore';
import type { Program } from '~/types/company/program';

definePageMeta({
	layout: 'company',
	ssr: false,
});

const programStore = useCompanyProgramStore();
const programs = computed(() => programStore.programs);

// 分析圖片資料
const analyzeImageData = (program: Program) => {
	const hasCoverImage = !!program.CoverImage;
	const hasImages = program.Images && program.Images.length > 0;
	const coverImageUrl = program.CoverImage;
	const imagesCount = program.Images?.length || 0;
	
	return {
		hasCoverImage,
		hasImages,
		coverImageUrl,
		imagesCount,
		isCoverImageValid: hasCoverImage && coverImageUrl && coverImageUrl !== 'null',
	};
};

// 測試圖片載入
const testImageLoad = (url: string) => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve({ success: true, url });
		img.onerror = () => resolve({ success: false, url, error: 'Failed to load' });
		img.src = url;
	});
};

const testAllImages = async () => {
	console.log('=== 開始測試所有圖片 ===');
	
	for (const program of programs.value) {
		const analysis = analyzeImageData(program);
		console.log(`計畫 ${program.Id}: ${program.Name}`);
		console.log('分析結果:', analysis);
		
		if (analysis.coverImageUrl && analysis.isCoverImageValid) {
			const result = await testImageLoad(analysis.coverImageUrl);
			console.log('封面圖片測試結果:', result);
		}
		
		console.log('---');
	}
};
</script>

<template>
	<div class="container mx-auto p-6">
		<h1 class="text-2xl font-bold mb-6">圖片載入調試頁面</h1>
		
		<div class="mb-6">
			<el-button type="primary" @click="testAllImages">
				測試所有圖片載入
			</el-button>
		</div>

		<div class="grid gap-4">
			<div
				v-for="program in programs"
				:key="program.Id"
				class="border p-4 rounded"
			>
				<h3 class="font-bold">{{ program.Name }}</h3>
				<div class="mt-2 space-y-2">
					<div>
						<strong>封面圖片:</strong>
						<span v-if="program.CoverImage" class="text-green-600">
							{{ program.CoverImage }}
						</span>
						<span v-else class="text-red-600">無</span>
					</div>
					
					<div>
						<strong>圖片陣列:</strong>
						<span v-if="program.Images && program.Images.length > 0" class="text-green-600">
							{{ program.Images.length }} 張圖片
						</span>
						<span v-else class="text-red-600">無</span>
					</div>

					<div v-if="program.Images && program.Images.length > 0">
						<strong>圖片列表:</strong>
						<ul class="list-disc list-inside ml-4">
							<li v-for="(img, index) in program.Images" :key="index" class="text-sm">
								{{ img }}
							</li>
						</ul>
					</div>

					<!-- 測試圖片顯示 -->
					<div v-if="program.CoverImage" class="mt-2">
						<strong>封面圖片預覽:</strong>
						<div class="mt-1">
							<img
								:src="program.CoverImage"
								alt="test"
								class="w-32 h-20 object-cover border"
								@load="console.log('圖片載入成功:', program.CoverImage)"
								@error="console.log('圖片載入失敗:', program.CoverImage)"
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
