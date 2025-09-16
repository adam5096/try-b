<script lang="ts" setup>
import {
	Search,
	Briefcase,
	Location,
	User,
} from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useCompanyProgramStore } from '~/stores/company/useProgramStore';

definePageMeta({
	layout: 'company',
	name: 'company-index',
	ssr: false, // CSR 模式
});

const searchForm = {
	name: '',
	industry: '',
	job_type: '',
	sort: 'date_desc',
};

const programStore = useCompanyProgramStore();
const programs = computed(() => programStore.programs);

// SSR 頁面初始化：伺服端先抓列表，加速首屏
if (import.meta.server) {
	await programStore.init();
}

// 依狀態回傳徽章樣式
const getStatusBadgeClass = (program: any) => {
	const status = getProgramStatus(program);
	return status === '未發布'
		? 'bg-yellow-300 text-black'
		: 'bg-primary-blue-light text-white';
};

// 已移除骨架與圖片預載，避免 SSR/CSR 不一致

const handlePageChange = (page: number) => {
	programStore.setPage(page);
};

const getProgramStatus = (program: any) => {
	const now = new Date();
	const publishStart = new Date(program.PublishStartDate);
	const publishEnd = new Date(program.PublishEndDate);
	const programStart = new Date(program.ProgramStartDate);
	const programEnd = new Date(program.ProgramEndDate);

	if (now < publishStart) return '未發布';
	if (now >= publishStart && now <= publishEnd) return '已發佈';
	if (now > publishEnd && now < programStart) return '已截止';
	if (now >= programStart && now <= programEnd) return '進行中';
	if (now > programEnd) return '已結束';

	return '未知';
};

// 與使用者端一致：格式化日期顯示
const formatProgramDate = (program: any) => {
	if (!program?.ProgramStartDate || !program?.ProgramEndDate) {
		return '日期未定';
	}

	try {
		const startDate = new Date(program.ProgramStartDate);
		const endDate = new Date(program.ProgramEndDate);

		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			return '日期格式錯誤';
		}

		const formatDate = (date: Date) => {
			const yyyy = date.getFullYear();
			const mm = String(date.getMonth() + 1).padStart(2, '0');
			const dd = String(date.getDate()).padStart(2, '0');
			return `${yyyy}/${mm}/${dd}`;
		};

		return `${formatDate(startDate)} - ${formatDate(endDate)}`;
	}
	catch {
		return '日期格式錯誤';
	}
};

// 將介紹文字正規化，避免 SSR/C SR 因換行或空白差異造成 hydration mismatch
const formatIntroText = (raw: any): string => {
	const text = typeof raw === 'string' ? raw : '';
	return text
		.replace(/\r\n|\r|\n/g, ' ') // 移除換行
		.replace(/\s+/g, ' ') // 合併多餘空白
		.trim();
};

// 查看詳情（與使用者端交互一致，改導到公司端詳情頁）
const handleViewDetail = async (program: any) => {
	const id = program?.Id;
	if (id === undefined || id === null || id === '') return;
	await navigateTo(`/company/programs/${id}`);
};
</script>

<template>
	<div>
		<!-- Header -->
		<CompanyPlanStatusHeader />

		<!-- Main Content -->
		<div class="mt-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold tracking-widest">
						所有計畫列表
					</h1>
					<p class="text-gray-500 tracking-wider">
						管理您的所有體驗計畫，查看各計畫狀態及詳情
					</p>
				</div>
			</div>

			<!-- Filters -->
			<el-card class="mt-4">
				<el-form label-position="top">
					<el-row
						:gutter="12"
						align="middle"
					>
						<el-col
							:xs="24"
							:sm="24"
							:md="6"
						>
							<el-form-item>
								<el-input
									v-model="searchForm.name"
									placeholder="搜尋計畫名稱..."
									:prefix-icon="Search"
									style="width: 100%"
								/>
							</el-form-item>
						</el-col>
						<el-col
							:xs="24"
							:sm="24"
							:md="6"
						>
							<el-form-item>
								<el-select
									v-model="searchForm.industry"
									placeholder="產業類別"
									style="width: 100%"
								>
									<el-option
										label="資訊科技"
										value="tech"
									/>
									<el-option
										label="行銷廣告"
										value="marketing"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col
							:xs="24"
							:sm="24"
							:md="6"
						>
							<el-form-item>
								<el-select
									v-model="searchForm.job_type"
									placeholder="職務類別"
									style="width: 100%"
								>
									<el-option
										label="軟體工程師"
										value="swe"
									/>
									<el-option
										label="產品設計師"
										value="pd"
									/>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col
							:xs="24"
							:sm="24"
							:md="6"
						>
							<el-form-item>
								<el-select
									v-model="searchForm.sort"
									placeholder="排序方式"
									style="width: 100%"
								>
									<el-option
										label="日期：由新到舊"
										value="date_desc"
									/>
									<el-option
										label="日期：由舊到新"
										value="date_asc"
									/>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>

			<!-- Tabs -->
			<el-tabs
				model-value="all"
				class="mt-4"
			>
				<el-tab-pane
					label="全部計畫"
					name="all"
				/>
				<el-tab-pane
					label="已通過"
					name="passed"
				/>
				<el-tab-pane
					label="已發布"
					name="published"
				/>
				<el-tab-pane
					label="待發布"
					name="pending"
				/>
				<el-tab-pane
					label="已拒絕"
					name="rejected"
				/>
				<el-tab-pane
					label="審核中"
					name="reviewing"
				/>
			</el-tabs>

			<!-- Skeleton: 卡片清單骨架（首次載入或無任何既有資料時） -->
			<div
				v-if="programStore.isLoading && programs.length === 0"
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
			>
				<el-card
					v-for="n in 9"
					:key="n"
					class="border border-[#CCCCCC] flex flex-col"
				>
					<el-skeleton animated>
						<template #template>
							<!-- 封面骨架 -->
							<el-skeleton-item
								variant="image"
								style="width: 100%; height: 12rem"
							/>

							<!-- 內容骨架 -->
							<div class="p-4 flex flex-col flex-1 min-h-0 gap-3">
								<el-skeleton-item
									variant="h3"
									style="width: 80%"
								/>
								<el-skeleton-item variant="text" />
								<el-skeleton-item
									variant="text"
									style="width: 90%"
								/>
								<div class="mt-auto">
									<el-skeleton-item
										variant="button"
										style="width: 100%; height: 2.75rem"
									/>
								</div>
							</div>
						</template>
					</el-skeleton>
				</el-card>
			</div>

			<!-- Error -->
			<div
				v-if="programStore.error"
				class="text-center p-8 text-red-500"
			>
				<p>無法載入計畫列表，請稍後再試。</p>
			</div>
			<!-- Empty -->
			<div
				v-else-if="programs.length === 0"
				class="text-center p-8 text-gray-500"
			>
				<p class="tracking-wider">
					目前沒有任何計畫。
				</p>
			</div>
			<!-- Real Cards -->
			<div
				v-else
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
			>
				<el-card
					v-for="program in programs"
					:key="program.Id"
					class="shadow-lg hover:shadow-xl transition-shadow border border-[#CCCCCC] flex flex-col"
				>
					<!-- 封面與狀態徽章 -->
					<div class="relative flex-shrink-0">
						<img
							:src="program.CoverImage || '/img/home/home-worker-bg.webp'"
							alt="program image"
							class="w-full h-48 object-cover"
							loading="lazy"
						>
						<div
							class="absolute top-2 left-2 px-2 py-1 text-xs rounded z-10"
							:class="getStatusBadgeClass(program)"
						>
							<span class="tracking-widest">{{ getProgramStatus(program) }}</span>
						</div>
					</div>

					<!-- 內容 -->
					<div class="p-4 flex flex-col flex-1 min-h-0">
						<h3 class="text-lg font-bold text-black mb-2 line-clamp-2 leading-tight flex items-start tracking-widest">
							{{ program.Name || '未命名計畫' }}
						</h3>

						<p class="text-sm text-gray-600 mb-3 flex-1 overflow-hidden text-ellipsis line-clamp-3 tracking-wider">
							{{ formatIntroText(program.Intro) || '暫無介紹' }}
						</p>

						<div class="space-y-2 mb-6 flex flex-col justify-center">
							<div class="flex items-center gap-2">
								<font-awesome-icon
									:icon="['fas', 'briefcase']"
									class="text-gray-500 w-3 flex-shrink-0"
								/>
								<span class=" text-black truncate tracking-wide">{{ program.Industry?.Title || '產業未分類' }}</span>
							</div>
							<div class="flex items-center gap-2">
								<font-awesome-icon
									:icon="['fas', 'calendar']"
									class="text-gray-500 w-3 flex-shrink-0"
								/>
								<span class=" text-black truncate tracking-wide">{{ formatProgramDate(program) }}</span>
							</div>
							<div class="flex items-center gap-2">
								<font-awesome-icon
									:icon="['fas', 'map-marker-alt']"
									class="text-gray-500 w-3 flex-shrink-0"
								/>
								<span class=" text-black truncate tracking-wide">{{ program.Address || '地點未定' }}</span>
							</div>
							<div class="flex items-center gap-2">
								<font-awesome-icon
									:icon="['fas', 'users']"
									class="text-gray-500 w-3 flex-shrink-0"
								/>
								<span class=" text-black truncate tracking-wide">已申請人數: {{ program.AppliedCount || 0 }}人</span>
							</div>
						</div>

						<button
							class="relative w-full rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform tracking-widest hover:scale-105 hover:bg-primary-blue-dark hover:text-white"
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

			<!-- Pagination -->
			<div class="flex justify-center mt-8">
				<el-pagination
					background
					layout="prev, pager, next"
					:total="programStore.total"
					:page-size="programStore.limit"
					:current-page="programStore.page"
					@current-change="handlePageChange"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
