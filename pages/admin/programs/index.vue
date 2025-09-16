<script setup lang="ts">
import { computed, ref } from 'vue';
import { navigateTo } from '#app';
import { adminRoutes } from '~/utils/adminRoutes';

definePageMeta({ name: 'admin-programs', layout: 'admin' as any });

type ProgramStatus = 'draft' | 'recruiting' | 'ongoing' | 'finished' | 'canceled';
type ProgramPhaseFilter = 'all' | 'upcoming' | 'ongoing' | 'finished';
type ReviewStatus = 'systemApproved' | 'systemRejected' | 'manualConfirmed' | 'manualRejected';

interface ProgramItem {
	id: number;
	title: string;
	company: string;
	location: string;
	startDate: string; // YYYY-MM-DD
	endDate: string; // YYYY-MM-DD
	applicants: number;
	slots: number;
	status: ProgramStatus;
	reviewStatus: ReviewStatus;
}

const query = ref('');

// UI 暫存篩選（點擊「確認篩選」後才套用）
const uiReviewStatus = ref<'all' | ReviewStatus>('all');
const uiProgramStatus = ref<ProgramPhaseFilter>('all');
const uiDateFrom = ref(''); // YYYY-MM-DD | ''
const uiDateTo = ref(''); // YYYY-MM-DD | ''

// 已套用的篩選條件
const appliedReviewStatus = ref<'all' | ReviewStatus>('all');
const appliedProgramStatus = ref<ProgramPhaseFilter>('all');
const appliedDateFrom = ref('');
const appliedDateTo = ref('');

const allPrograms = ref<ProgramItem[]>([
	{
		id: 101,
		title: 'AI 產品經理一日體驗',
		company: '星河數據科技',
		location: '台北市',
		startDate: '2025-09-15',
		endDate: '2025-09-15',
		applicants: 42,
		slots: 50,
		status: 'recruiting',
		reviewStatus: 'systemApproved',
	},
	{
		id: 102,
		title: '雲端DevOps工程師實作營',
		company: '雲原生股份有限公司',
		location: '新北市',
		startDate: '2025-08-22',
		endDate: '2025-08-24',
		applicants: 30,
		slots: 30,
		status: 'ongoing',
		reviewStatus: 'systemApproved',
	},
	{
		id: 103,
		title: '前端工程師Try Before You Dive',
		company: '未來網路',
		location: '台中市',
		startDate: '2025-07-01',
		endDate: '2025-07-01',
		applicants: 120,
		slots: 100,
		status: 'finished',
		reviewStatus: 'systemApproved',
	},
	{
		id: 104,
		title: '資料分析師一日見習',
		company: '洞察智能',
		location: '高雄市',
		startDate: '2025-09-05',
		endDate: '2025-09-05',
		applicants: 5,
		slots: 20,
		status: 'draft',
		reviewStatus: 'manualConfirmed',
	},
	{
		id: 105,
		title: '行銷實習工作坊',
		company: '品牌引擎',
		location: '台北市',
		startDate: '2025-08-10',
		endDate: '2025-08-11',
		applicants: 18,
		slots: 25,
		status: 'canceled',
		reviewStatus: 'manualRejected',
	},
]);

const statusLabelMap: Record<ProgramStatus, string> = {
	draft: '草稿',
	recruiting: '招募中',
	ongoing: '進行中',
	finished: '已結束',
	canceled: '已取消',
};

const statusClassMap: Record<ProgramStatus, string> = {
	draft: 'bg-gray-100 text-gray-700 border border-gray-200',
	recruiting: 'bg-green-50 text-green-700 border border-green-200',
	ongoing: 'bg-blue-50 text-blue-700 border border-blue-200',
	finished: 'bg-gray-50 text-gray-500 border border-gray-200',
	canceled: 'bg-red-50 text-red-700 border border-red-200',
};

const applyFilters = () => {
	appliedReviewStatus.value = uiReviewStatus.value;
	appliedProgramStatus.value = uiProgramStatus.value;
	appliedDateFrom.value = uiDateFrom.value;
	appliedDateTo.value = uiDateTo.value;
};

const clearFilters = () => {
	uiReviewStatus.value = 'all';
	uiProgramStatus.value = 'all';
	uiDateFrom.value = '';
	uiDateTo.value = '';
	applyFilters();
};

const visiblePrograms = computed(() => {
	const q = query.value.trim().toLowerCase();
	const filtered = allPrograms.value.filter((p) => {
		const matchQuery = q
			? p.title.toLowerCase().includes(q) || p.company.toLowerCase().includes(q)
			: true;
		const matchProgramStatus = (() => {
			const f = appliedProgramStatus.value;
			if (f === 'all') { return true; }
			if (f === 'upcoming') { return p.status === 'draft' || p.status === 'recruiting'; }
			if (f === 'ongoing') { return p.status === 'ongoing'; }
			// 將取消視為已完成的一種結束狀態，與設計的「已完成」同一分組
			if (f === 'finished') { return p.status === 'finished' || p.status === 'canceled'; }
			return true;
		})();
		const matchReviewStatus = appliedReviewStatus.value === 'all'
			? true
			: p.reviewStatus === appliedReviewStatus.value;
		const matchDateFrom = appliedDateFrom.value
			? p.startDate >= appliedDateFrom.value
			: true;
		const matchDateTo = appliedDateTo.value
			? (p.endDate || p.startDate) <= appliedDateTo.value
			: true;
		return matchQuery && matchProgramStatus && matchReviewStatus && matchDateFrom && matchDateTo;
	});
	const sorted = filtered.sort((a, b) => (a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0));
	return sorted;
});

const total = computed(() => visiblePrograms.value.length);

const goToDetail = (programId: number) => {
	navigateTo(adminRoutes.programDetail(programId));
};
</script>

<template>
	<div class="mx-auto w-full max-w-container-admin space-y-6">
		<!-- Title & Action -->
		<section class="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
			<div>
				<h1 class="text-2xl font-semibold text-gray-900 md:text-3xl">
					所有活動總覽
				</h1>
				<p class="mt-1 text-sm text-gray-600">
					瀏覽並管理平台上的所有體驗活動
				</p>
			</div>
			<div class="flex items-center gap-3">
				<button class="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800">
					新增活動
				</button>
			</div>
		</section>

		<!-- Filters -->
		<section class="rounded border border-gray-200 bg-white p-4 shadow-sm">
			<div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
				<!-- Search -->
				<div class="flex w-full items-center gap-2 xl:max-w-[360px]">
					<div class="relative w-full">
						<input
							v-model="query"
							type="search"
							inputmode="search"
							placeholder="搜尋計畫名稱或關鍵字"
							class="w-full rounded border border-gray-300 px-4 py-2 pr-9 text-gray-900 placeholder-gray-400 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
						>
						<span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="h-5 w-5"
							>
								<path
									fill-rule="evenodd"
									d="M10.5 3.75a6.75 6.75 0 104.243 11.93l3.788 3.789a.75.75 0 101.06-1.06l-3.789-3.789A6.75 6.75 0 0010.5 3.75zm0 1.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>
					</div>
				</div>

				<!-- Review status -->
				<div class="flex items-center gap-1.5 shrink-0">
					<span class="text-sm text-gray-600 shrink-0">審核狀態</span>
					<select
						v-model="uiReviewStatus"
						class="w-[160px] rounded border border-gray-300 px-2.5 py-2 text-sm text-gray-900 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
					>
						<option value="all">
							全部狀態
						</option>
						<option value="systemApproved">
							已通過(系統)
						</option>
						<option value="systemRejected">
							已拒絕(系統)
						</option>
						<option value="manualConfirmed">
							已確認(人工)
						</option>
						<option value="manualRejected">
							已拒絕(人工)
						</option>
					</select>
				</div>

				<!-- Program status -->
				<div class="flex items-center gap-1.5 shrink-0">
					<span class="text-sm text-gray-600 shrink-0">體驗狀態</span>
					<select
						v-model="uiProgramStatus"
						class="w-[140px] rounded border border-gray-300 px-2.5 py-2 text-sm text-gray-900 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
					>
						<option value="all">
							全部狀態
						</option>
						<option value="finished">
							已完成
						</option>
						<option value="upcoming">
							待舉辦
						</option>
						<option value="ongoing">
							進行中
						</option>
					</select>
				</div>

				<!-- Date range -->
				<div class="flex items-center gap-1.5 shrink-0">
					<span class="text-sm text-gray-600 shrink-0">日期範圍：</span>
					<input
						v-model="uiDateFrom"
						type="date"
						placeholder="開始日期"
						class="w-[160px] rounded border border-gray-300 px-2.5 py-2 text-sm text-gray-900 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
					>
					<span class="text-gray-500">至</span>
					<input
						v-model="uiDateTo"
						type="date"
						placeholder="結束日期"
						class="w-[160px] rounded border border-gray-300 px-2.5 py-2 text-sm text-gray-900 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
					>
				</div>

				<!-- Actions -->
				<div class="flex items-center gap-2 shrink-0">
					<button
						type="button"
						class="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-brand-gray"
						@click="applyFilters"
					>
						確認篩選
					</button>
					<button
						type="button"
						class="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-brand-gray"
						@click="clearFilters"
					>
						清除所有篩選
					</button>
				</div>
			</div>
		</section>

		<!-- List (Table on md+/Cards on < md) -->
		<section class="space-y-4">
			<!-- Table -->
			<div class="hidden overflow-hidden rounded border border-gray-200 bg-white shadow-sm md:block">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-brand-gray">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								活動名稱
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								公司
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								地點
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								日期
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								申請/名額
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								狀態
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
								操作
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100 bg-white">
						<tr
							v-for="p in visiblePrograms"
							:key="p.id"
							class="hover:bg-brand-gray/50"
						>
							<td class="px-6 py-4 text-gray-900">
								<div class="font-medium">
									{{ p.title }}
								</div>
							</td>
							<td class="px-6 py-4 text-gray-700">
								{{ p.company }}
							</td>
							<td class="px-6 py-4 text-gray-700">
								{{ p.location }}
							</td>
							<td class="px-6 py-4 text-gray-700">
								{{ p.startDate }}<span v-if="p.endDate && p.endDate !== p.startDate"> – {{ p.endDate }}</span>
							</td>
							<td class="px-6 py-4 text-gray-700">
								{{ p.applicants }} / {{ p.slots }}
							</td>
							<td class="px-6 py-4">
								<span
									class="inline-block rounded px-2 py-1 text-xs"
									:class="statusClassMap[p.status]"
								>{{ statusLabelMap[p.status] }}</span>
							</td>
							<td class="px-6 py-4 text-left">
								<button
									class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-brand-gray"
									@click="goToDetail(p.id)"
								>
									查看
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Cards -->
			<div class="space-y-3 md:hidden">
				<div
					v-for="p in visiblePrograms"
					:key="p.id"
					class="rounded border border-gray-200 bg-white p-4 shadow-sm"
				>
					<div class="mb-2 flex items-start justify-between gap-3">
						<div>
							<h3 class="text-base font-semibold text-gray-900">
								{{ p.title }}
							</h3>
							<p class="mt-0.5 text-sm text-gray-600">
								{{ p.company }} ・ {{ p.location }}
							</p>
						</div>
						<span
							class="shrink-0 rounded px-2 py-1 text-xs"
							:class="statusClassMap[p.status]"
						>{{ statusLabelMap[p.status] }}</span>
					</div>
					<div class="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
						<div>
							<span class="text-gray-500">日期：</span>{{ p.startDate }}<span v-if="p.endDate && p.endDate !== p.startDate"> – {{ p.endDate }}</span>
						</div>
						<div><span class="text-gray-500">申請/名額：</span>{{ p.applicants }} / {{ p.slots }}</div>
					</div>
					<div class="mt-3 flex justify-end">
						<button
							class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-brand-gray"
							@click="goToDetail(p.id)"
						>
							查看
						</button>
					</div>
				</div>
			</div>
		</section>

		<!-- Footer / Pagination info -->
		<section class="flex items-center justify-between text-sm text-gray-600">
			<div>共 {{ total }} 筆結果</div>
			<div class="flex items-center gap-2">
				<button class="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-brand-gray">
					上一頁
				</button>
				<button class="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-brand-gray">
					下一頁
				</button>
			</div>
		</section>
	</div>
</template>
