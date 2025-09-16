<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, reactive } from 'vue'
import { userRoutes } from '~/utils/userRoutes'
import { useUserProgramsStore } from '~/stores/user/useProgramsStore'
import { useUserProgramDetailStore } from '~/stores/user/useUserProgramDetailStore'
import type { Program } from '~/types/users/program'

definePageMeta({
	name: 'user-landing',
	layout: 'user',
	ssr: false, // 恢復 CSR 模式，這對 skeleton 很重要
})

const programsStore = useUserProgramsStore();
const programDetailStore = useUserProgramDetailStore();

// 管理圖片載入狀態 - 改用 Element Plus Loading
const imageLoadingState = reactive<Record<number, boolean>>({});
const isClient = ref(false);
const isMobile = ref(false);

// 已移除開發環境用的 fallback programId，改以實際回傳的 Id 為準

// 影像載入與骨架交由 ImageWithSkeleton 元件處理

const searchKeyword = ref('');
const industry = ref('');
const jobType = ref('');
const location = ref('');
const sort = ref('');

const currentPage = ref(1);
const pageSize = 6;

// 儲存超時計時器，用於清理
const timeoutIds = new Map<number, ReturnType<typeof setTimeout>>();

// 添加超時保護，防止 loading 狀態卡住
const setImageLoadingTimeout = (programId: number) => {
	// 清除之前的計時器（如果存在）
	if (timeoutIds.has(programId)) {
		clearTimeout(timeoutIds.get(programId)!);
	}

	const timeoutId = setTimeout(() => {
		if (imageLoadingState[programId] === true) {
			imageLoadingState[programId] = false; // 超時後強制停止 loading
		}
		timeoutIds.delete(programId); // 清理計時器記錄
	}, 10000); // 10 秒超時

	timeoutIds.set(programId, timeoutId);
}

// 響應式檢測函數
const checkIsMobile = () => {
	isMobile.value = window.innerWidth < 640; // sm breakpoint
}

// 頁面載入時直接獲取資料，不需要登入驗證
onMounted(() => {
	isClient.value = true; // 恢復客戶端標記

	// 初始化響應式檢測
	checkIsMobile();

	// 監聽視窗大小變化
	window.addEventListener('resize', checkIsMobile);
	programsStore.fetchPrograms({ page: currentPage.value, limit: pageSize });
})

// 儲存 watcher 停止函數，用於清理
const watchStopHandlers: (() => void)[] = [];

// 監聽程式資料變化，初始化 loading 狀態
const stopItemsWatch = watch(() => programsStore.items, (newItems) => {
	if (newItems && newItems.length > 0) {
		newItems.forEach((program) => {
			if (program.Id && imageLoadingState[program.Id] === undefined) {
				// 如果沒有 CoverImage，直接設為不載入（使用 fallback）
				imageLoadingState[program.Id] = program.CoverImage ? true : false;
				// 如果有 CoverImage，啟動超時保護
				if (program.CoverImage) {
					setImageLoadingTimeout(program.Id);
				}
			}
		});
	}
}, { immediate: true });

const stopPopularWatch = watch(() => programsStore.popular, (newPopular) => {
	if (newPopular && newPopular.length > 0) {
		newPopular.forEach((program) => {
			if (program.Id && imageLoadingState[program.Id] === undefined) {
				// 如果沒有 CoverImage，直接設為不載入（使用 fallback）
				imageLoadingState[program.Id] = program.CoverImage ? true : false;
				// 如果有 CoverImage，啟動超時保護
				if (program.CoverImage) {
					setImageLoadingTimeout(program.Id);
				}
			}
		});
	}
}, { immediate: true });

watchStopHandlers.push(stopItemsWatch, stopPopularWatch);

watch(currentPage, (p) => {
	programsStore.fetchPrograms({
		page: p,
		limit: pageSize,
		keyword: searchKeyword.value,
		industry: industry.value,
		jobType: jobType.value,
		location: location.value,
		sort: sort.value,
	})
});

// 監聽篩選條件變化
watch([searchKeyword, industry, jobType, location, sort], () => {
	currentPage.value = 1; // 重置到第一頁
	programsStore.fetchPrograms({
		page: 1,
		limit: pageSize,
		keyword: searchKeyword.value,
		industry: industry.value,
		jobType: jobType.value,
		location: location.value,
		sort: sort.value,
	})
});

// 輪播切換狀態（用於切換時模糊過場）
const isSwitching = ref(false);
let carouselSwitchTimer: ReturnType<typeof setTimeout> | null = null;
const onCarouselChange = () => {
	isSwitching.value = true;
	if (carouselSwitchTimer) clearTimeout(carouselSwitchTimer);
	carouselSwitchTimer = setTimeout(() => {
		isSwitching.value = false;
	}, 200);
}

const industries = ref([
	{ value: 'tech', label: '科技業' },
	{ value: 'finance', label: '金融業' },
	{ value: 'retail', label: '零售業' },
	{ value: 'catering', label: '餐飲業' },
]);

const jobTypes = ref([
	{ value: 'engineering', label: '工程師' },
	{ value: 'designer', label: '設計師' },
	{ value: 'marketing', label: '行銷' },
	{ value: 'pm', label: '產品經理' },
]);

const locations = ref([
	{ value: 'taipei', label: '台北市' },
	{ value: 'hsinchu', label: '新竹市' },
	{ value: 'kaohsiung', label: '高雄市' },
]);

const sortOptions = ref([
	{ value: 'latest', label: '最新發布' },
	{ value: 'popular', label: '熱門程度' },
	{ value: 'deadline', label: '截止日期' },
]);

// 格式化程式日期顯示
const formatProgramDate = (program: Program) => {
	if (!program.ProgramStartDate || !program.ProgramEndDate) {
		return '日期未定';
	}

	try {
		const startDate = new Date(program.ProgramStartDate);
		const endDate = new Date(program.ProgramEndDate);

		// 檢查日期是否有效
		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			return '日期格式錯誤';
		}

		const formatDate = (date: Date) => {
			return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
		};

		return `${formatDate(startDate)} - ${formatDate(endDate)}`;
	}
	catch (error) {
		// 日期格式化錯誤（靜默處理）
		return '日期格式錯誤';
	}
};

// 解析清單項目的 ProgramId（以回傳的 Id 為主，保守兼容 id）
const resolveProgramId = (program: any) => {
	return program?.Id ?? program?.id ?? null;
}

// 圖片載入處理函數 - 改用 Loading 狀態
const handleImageLoad = (programId: number) => {
	imageLoadingState[programId] = false; // 載入完成，停止 loading
}

const handleImageError = (programId: number) => {
	imageLoadingState[programId] = false; // 即使錯誤也要停止 loading
}

// 檢查圖片是否正在載入中
const isImageLoading = (programId: number) => {
	// 只有明確設為 true 時才顯示 loading
	return imageLoadingState[programId] === true;
}

// 處理查看詳情按鈕點擊
const handleViewDetail = async (program: any) => {
	try {
		const programId = resolveProgramId(program);
		if (programId === undefined || programId === null || programId === '') {
			// 此體驗卡片缺少有效的 programId，暫時無法查看詳情
			return
		}
		// 先取得計畫詳情
		await programDetailStore.fetchDetail(programId);

		// 導航到計畫詳情頁
		await navigateTo(userRoutes.programDetail(programId));
	}
	catch (error) {
		// 處理查看詳情錯誤（靜默處理）
		// 如果取得詳情失敗，仍然導航到詳情頁，讓詳情頁處理錯誤狀態
		const programId = resolveProgramId(program);
		if (programId !== undefined && programId !== null && programId !== '') {
			await navigateTo(userRoutes.programDetail(programId));
		}
	}
};

// 組件卸載時清理資源
onUnmounted(() => {
	// 停止所有 watchers
	watchStopHandlers.forEach((stopFn) => {
		try {
			stopFn();
		}
		catch (error) {
			// 靜默處理 watcher 停止錯誤
		}
	});

	// 清理所有超時計時器
	timeoutIds.forEach((timeoutId) => {
		clearTimeout(timeoutId);
	})
	timeoutIds.clear();

	// 移除視窗大小變化監聽器
	window.removeEventListener('resize', checkIsMobile);

	// 清理圖片載入狀態
	Object.keys(imageLoadingState).forEach((key) => {
		delete imageLoadingState[key as any];
	})
});
</script>

<template>
	<main class="bg-gray-100">
		<div class="py-12">
			<div class="mx-auto max-w-7xl px-6 lg:px-8">
				<!-- Hot Programs Section -->
				<section class="mb-16">
					<h2 class="text-2xl font-bold mb-2 tracking-widest">
						熱門體驗計畫總覽
					</h2>
					<p class="text-gray-500 mb-8 tracking-wider">
						在這裡探索最受歡迎的體驗計畫，看看大家都喜歡哪些活動！
					</p>
					<div
						v-loading="programsStore.loading"
						element-loading-text="載入熱門計畫中..."
						element-loading-background="rgba(248, 249, 251, 0.8)"
						:style="{ height: isMobile ? '400px' : '300px' }"
						class="relative"
					>
						<el-carousel
							v-if="programsStore.popular && programsStore.popular.length > 0"
							:interval="4000"
							:height="isMobile ? '400px' : '300px'"
							trigger="hover"
							indicator-position="outside"
							:class="['switch-blur', 'hot-carousel', { 'is-switching': isSwitching }]"
							@change="onCarouselChange"
						>
							<el-carousel-item
								v-for="program in programsStore.popular"
								:key="program.Id"
							>
								<el-card
									:body-style="{ padding: '0px', height: '100%' }"
									class="h-full"
								>
									<div class="h-full flex flex-col sm:flex-row">
										<!-- Image Section -->
										<div
											v-loading="isClient && isImageLoading(program.Id)"
											class="w-full sm:w-1/2 h-1/2 sm:h-full flex-shrink-0"
											element-loading-text="載入中..."
											element-loading-background="rgba(0, 0, 0, 0.1)"
										>
											<NuxtImg
												v-if="program.CoverImage"
												:src="program.CoverImage"
												alt="program image"
												class="w-full h-full object-cover"
												fit="cover"
												quality="80"
												format="webp"
												@load="handleImageLoad(program.Id)"
												@error="handleImageError(program.Id)"
											/>
											<img
												v-else
												src="/img/home/home-worker-bg.webp"
												alt="program image"
												class="w-full h-full object-cover"
												@load="handleImageLoad(program.Id)"
												@error="handleImageError(program.Id)"
											>
										</div>
										<!-- Text Section -->
										<div class="w-full sm:w-1/2 h-1/2 sm:h-full p-4 sm:p-6 flex flex-col justify-center bg-white">
											<h3 class="text-lg sm:text-2xl font-bold mb-2 tracking-widest line-clamp-2">
												{{ program.Name || '未命名計畫' }}
											</h3>
											<p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 tracking-wider">
												{{ program.Industry?.Title || '產業未分類' }}
											</p>
											<button
												class="w-full sm:w-max rounded-md bg-btn-yellow px-4 sm:px-6 py-2 font-bold text-black transition-transform tracking-widest hover:scale-105 hover:bg-primary-blue-dark hover:text-white"
												@click="handleViewDetail(program)"
											>
												查看詳情
											</button>
										</div>
									</div>
								</el-card>
							</el-carousel-item>
						</el-carousel>
						<div
							v-else
							class="w-full h-full"
						>
							<div
								v-if="programsStore.loading"
								v-loading="true"
								element-loading-text="載入熱門計畫中..."
								element-loading-background="rgba(248, 249, 251, 0.8)"
								class="w-full h-full"
							/>
							<div
								v-else
								class="flex items-center justify-center h-full bg-gray-50 rounded-lg"
							>
								<p class="text-gray-500">
									暫無熱門計畫
								</p>
							</div>
						</div>
					</div>
				</section>

				<!-- General Programs Section -->
				<section>
					<h2 class="text-2xl font-bold mb-2 tracking-widest">
						一般體驗計畫總覽
					</h2>
					<p class="text-gray-500 mb-8 tracking-wider">
						管理您已申請的體驗計畫，並在這裡快速申請新計畫。
					</p>

					<!-- Filters -->
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-4 bg-white rounded-lg shadow items-stretch">
						<el-input
							v-model="searchKeyword"
							placeholder="關鍵字搜尋"
							clearable
						/>
						<el-select
							v-model="industry"
							placeholder="產業類別"
							clearable
						>
							<el-option
								v-for="item in industries"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
						<el-select
							v-model="jobType"
							placeholder="職業類別"
							clearable
						>
							<el-option
								v-for="item in jobTypes"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
						<el-select
							v-model="location"
							placeholder="地區"
							clearable
						>
							<el-option
								v-for="item in locations"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
						<el-select
							v-model="sort"
							placeholder="排序"
							clearable
						>
							<el-option
								v-for="item in sortOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</div>

					<!-- Program Cards -->
					<div
						v-if="programsStore.items && programsStore.items.length > 0"
						class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
					>
						<el-card
							v-for="program in programsStore.items"
							:key="program.Id"
							class="shadow-lg hover:shadow-xl transition-shadow border border-[#CCCCCC]  flex flex-col overflow-hidden"
						>
							<!-- Cover Image with Status Tag -->
							<div
								v-loading="isClient && isImageLoading(program.Id)"
								class="relative flex-shrink-0"
								element-loading-text="載入圖片中..."
								element-loading-background="rgba(0, 0, 0, 0.1)"
							>
								<NuxtImg
									v-if="program.CoverImage"
									:src="program.CoverImage"
									alt="program image"
									class="w-full h-48 object-cover"
									fit="cover"
									quality="80"
									format="webp"
									loading="lazy"
									@load="handleImageLoad(program.Id)"
									@error="handleImageError(program.Id)"
								/>
								<img
									v-else
									src="/img/home/home-worker-bg.webp"
									alt="program image"
									class="w-full h-48 object-cover"
									loading="lazy"
									@load="handleImageLoad(program.Id)"
									@error="handleImageError(program.Id)"
								>
								<!-- Status Tag (左上角) -->
								<div class="absolute top-2 left-2 bg-primary-blue-light text-white px-2 py-1 text-xs rounded z-10">
									<span class="tracking-widest">已發佈</span>
								</div>
							</div>

							<!-- Program Content -->
							<div class="p-4 flex flex-col flex-1 min-h-0">
								<!-- Title -->
								<h3 class="tracking-widest text-xl font-bold text-black  line-clamp-2 leading-tight h-[3rem] flex items-start">
									{{ program.Name || '未命名計畫' }}
								</h3>

								<!-- Description - 伸展填滿剩餘空間 -->
								<p class="text-sm text-gray-600 mb-3 flex-1 overflow-hidden text-ellipsis line-clamp-3">
									{{ program.Intro || '暫無介紹' }}
								</p>

								<!-- Program Details - 固定高度區域 -->
								<div class="space-y-2 mb-6 h-[5.5rem] flex flex-col justify-center">
									<div class="flex items-center gap-2 h-4">
										<font-awesome-icon
											:icon="['fas', 'briefcase']"
											class="text-gray-500 w-3 flex-shrink-0"
										/>
										<span class="tracking-wide text-black truncate">{{ program.Industry?.Title || '產業未分類' }}</span>
									</div>
									<div class="flex items-center gap-2 h-4">
										<font-awesome-icon
											:icon="['fas', 'calendar']"
											class="text-gray-500 w-3 flex-shrink-0"
										/>
										<span class="tracking-wide text-black truncate">{{ formatProgramDate(program) }}</span>
									</div>
									<div class="flex items-center gap-2 h-4">
										<font-awesome-icon
											:icon="['fas', 'map-marker-alt']"
											class="text-gray-500 w-3 flex-shrink-0"
										/>
										<span class="tracking-wide text-black truncate">{{ program.Address || '地點未定' }}</span>
									</div>
									<div class="flex items-center gap-2 h-4">
										<font-awesome-icon
											:icon="['fas', 'users']"
											class="text-gray-500 w-3 flex-shrink-0"
										/>
										<span class="tracking-wide text-black truncate">已申請人數: {{ program.AppliedCount || 0 }}人</span>
									</div>
								</div>

								<!-- Action Button -->
								<button
									class="relative w-full rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform  tracking-widest hover:scale-105 hover:bg-primary-blue-dark hover:text-white"
									@click="handleViewDetail(program)"
								>
									<span class="absolute -top-1 -right-1 inline-flex h-3 w-3">
										<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
										<span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
									</span>
									查看詳情
								</button>
							</div>
						</el-card>
					</div>
					<div v-else>
						<div
							v-if="programsStore.loading"
							class="flex items-center justify-center h-64 bg-white rounded-lg text-gray-500"
						>
							載入中…
						</div>
						<div
							v-else
							class="flex items-center justify-center h-64 bg-gray-50 rounded-lg"
						>
							<p class="text-gray-500">
								暫無體驗計畫
							</p>
						</div>
					</div>

					<!-- Pagination -->
					<div
						v-if="programsStore.items && programsStore.items.length > 0 && programsStore.total > pageSize"
						class="mt-12 flex justify-center"
					>
						<el-pagination
							v-model:current-page="currentPage"
							:page-size="pageSize"
							layout="prev, pager, next"
							:total="programsStore.total"
						/>
					</div>
				</section>
			</div>
		</div>
	</main>
</template>

<style>
.el-carousel__arrow {
  background-color: rgba(31, 41, 55, 0.5);
  color: white;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.el-carousel__arrow:hover {
  background-color: rgba(31, 41, 55, 0.8);
}

/* 熱門輪播：強化指示器可視度 */
.hot-carousel .el-carousel__indicator {
  width: auto !important;
  height: auto !important;
}

.hot-carousel .el-carousel__indicator button {
  background-color: rgba(0,0,0,0.25) !important;
  border-radius: 50% !important;
  width: 8px !important;
  height: 8px !important;
  border: none !important;
  transition: all 0.3s ease !important;
  padding: 0 !important;
  margin: 0 !important;
  min-width: 8px !important;
  min-height: 8px !important;
}

.hot-carousel .el-carousel__indicator.is-active button {
  background-color: rgba(0,0,0,0.8) !important;
  width: 10px !important;
  height: 10px !important;
  min-width: 10px !important;
  min-height: 10px !important;
}

.hot-carousel .el-carousel__indicators:hover .el-carousel__indicator button {
  background-color: rgba(0,0,0,0.4) !important;
}

/* 小螢幕下的指示器優化 */
@media (max-width: 639px) {
  .hot-carousel .el-carousel__indicator button {
    width: 6px !important;
    height: 6px !important;
    min-width: 6px !important;
    min-height: 6px !important;
    background-color: rgba(0,0,0,0.3) !important;
  }

  .hot-carousel .el-carousel__indicator.is-active button {
    width: 8px !important;
    height: 8px !important;
    min-width: 8px !important;
    min-height: 8px !important;
    background-color: rgba(0,0,0,0.7) !important;
  }

  /* 調整指示器容器的間距 */
  .hot-carousel .el-carousel__indicators {
    gap: 6px !important;
  }
}

/* 輪播切換時的模糊過場效果 */
.switch-blur .el-carousel__container {
  transition: filter 200ms ease;
}
.switch-blur.is-switching .el-carousel__container {
  filter: blur(4px);
}

/* 文字截斷樣式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  line-clamp: 4;
  overflow: hidden;
}

/* 小螢幕下的輪播圖優化 */
@media (max-width: 639px) {
  .hot-carousel .el-card {
    @apply shadow-lg;
  }

  .hot-carousel .el-card .flex {
    @apply gap-0;
  }

  /* 確保文字區域有足夠的內邊距 */
  .hot-carousel .p-4 {
    @apply p-3;
  }

  /* 確保按鈕在小螢幕下的可點擊性 */
  .hot-carousel button {
    @apply min-h-[44px] text-sm;
  }
}
</style>
