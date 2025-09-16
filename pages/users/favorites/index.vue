<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
	name: 'user-favorites',
	layout: 'user',
	middleware: 'user-auth',
	ssr: false, // CSR 模式
})

type FavoriteItem = {
	id: number;
	title: string;
	description: string;
	city: string;
	start: string;
	end: string;
	applicants: number;
	status: '體驗進行中' | '已結束' | '即將開始';
	isFavorited: boolean;
};

const items = ref<FavoriteItem[]>([
	{
		id: 1,
		title: '軟體工程師體驗營',
		description:
      '深入科技公司開發現場，體驗真實專案開發流程，了解程式設計師的日常工作與挑戰，探索科技業職涯發展機會。',
		city: '台北市信義區',
		start: '2025/10/15',
		end: '2025/12/30',
		applicants: 0,
		status: '體驗進行中',
		isFavorited: true,
	},
	{
		id: 2,
		title: '咖啡師職人體驗',
		description:
      '跟隨產業咖啡師學習沖煮技巧，從豆子挑選到沖煮手法，體驗精品咖啡的製作藝術，了解咖啡產業的專業知識。',
		city: '台北市大安區',
		start: '2025/09/01',
		end: '2025/11/30',
		applicants: 0,
		status: '體驗進行中',
		isFavorited: true,
	},
	{
		id: 3,
		title: '數位行銷實戰體驗',
		description:
      '參與真實行銷案例操作，學習社群媒體經營、廣告投放策略，並體驗數據維度的成效分析與報告撰寫。',
		city: '台北市信義區',
		start: '2025/08/15',
		end: '2025/12/15',
		applicants: 0,
		status: '體驗進行中',
		isFavorited: true,
	},
	{
		id: 4,
		title: '投資理財體驗營',
		description:
      '邀請財經顧問講解投資基礎、理財規劃與風險管理，學習如何建立長期穩健的資產配置與投資習慣。',
		city: '台中市西屯區',
		start: '2025/09/20',
		end: '2025/11/20',
		applicants: 0,
		status: '體驗進行中',
		isFavorited: true,
	},
	{
		id: 5,
		title: 'UI/UX 設計師工作坊',
		description:
      '從使用者研究到互動原型，體驗完整的產品設計流程，學習設計工具與最佳實踐，強化設計思維。',
		city: '新北市板橋區',
		start: '2025/04/01',
		end: '2025/12/20',
		applicants: 0,
		status: '體驗進行中',
		isFavorited: true,
	},
	{
		id: 6,
		title: '新創企業營運體驗',
		description:
      '加入團隊參與實際的產品發想、迭代與營運流程，理解部門協作方式並累積跨域實戰經驗。',
		city: '高雄市鼓山區',
		start: '2025/07/01',
		end: '2025/10/15',
		applicants: 0,
		status: '體驗進行中',
		isFavorited: true,
	},
	{
		id: 7,
		title: '資料分析入門實作',
		description:
      '透過實際案例學習資料清理、可視化與基礎模型建立，了解分析在商業決策的應用。',
		city: '新竹市東區',
		start: '2025/09/10',
		end: '2025/12/10',
		applicants: 0,
		status: '體驗進行中',
		isFavorited: true,
	},
	{
		id: 8,
		title: '產品經理實戰工作坊',
		description:
      '體驗需求訪談、需求拆解與 PRD 撰寫流程，學習跨部門協作與產品排程管理。',
		city: '台北市中正區',
		start: '2025/08/20',
		end: '2025/11/20',
		applicants: 0,
		status: '體驗進行中',
		isFavorited: true,
	},
]);

const currentPage = ref(1);
const pageSize = ref(6);
const total = computed(() => items.value.length);
const visibleItems = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value;
	return items.value.slice(start, start + pageSize.value);
})

const pageStartDisplay = computed<number>(() => {
	if (total.value === 0) return 0;
	return (currentPage.value - 1) * pageSize.value + 1;
})

const pageEndDisplay = computed<number>(() => {
	if (total.value === 0) return 0;
	return Math.min(currentPage.value * pageSize.value, total.value);
})

function handleClearAll() {
	items.value = [];
}

function handleToggleFavorite(id: number) {
	const target = items.value.find(x => x.id === id);
	if (target) target.isFavorited = !target.isFavorited;
}

function handleViewDetail(item: FavoriteItem) {
	navigateTo({ name: 'user-program-detail', params: { programId: String(item.id) } });
}
</script>

<template>
	<section class="mx-auto max-w-container-users px-6 md:px-12 py-8 md:py-10">
		<!-- Header -->
		<div class="flex items-start justify-between gap-4">
			<div>
				<h2 class="text-2xl md:text-3xl font-bold text-gray-800">
					我的收藏清單
				</h2>
				<p class="mt-2 text-gray-500">
					管理您收藏的體驗計畫，查看詳情或直接申請參與
				</p>
			</div>

			<el-popconfirm
				title="確定清空收藏？"
				confirm-button-text="清空"
				cancel-button-text="取消"
				@confirm="handleClearAll"
			>
				<template #reference>
					<el-button>清空收藏</el-button>
				</template>
			</el-popconfirm>
		</div>

		<el-divider class="!my-6" />

		<!-- Empty -->
		<el-empty
			v-if="total === 0"
			description="尚未收藏任何體驗"
		/>

		<!-- Grid -->
		<div
			v-else
			class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
		>
			<el-card
				v-for="item in visibleItems"
				:key="item.id"
				shadow="hover"
			>
				<!-- Image placeholder with favorite icon -->
				<div class="relative">
					<div class="h-56 bg-gray-200 flex items-center justify-center text-3xl text-gray-500 select-none">
						圖片
					</div>
					<button
						class="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow hover:bg-white"
						:aria-label="item.isFavorited ? '取消收藏' : '加入收藏'"
						@click="handleToggleFavorite(item.id)"
					>
						<font-awesome-icon
							:icon="[item.isFavorited ? 'fas' : 'far', 'heart']"
							class="h-5 w-5 text-gray-700"
						/>
					</button>
				</div>

				<!-- Content -->
				<div class="mt-4">
					<h3 class="text-lg font-semibold text-gray-800">
						{{ item.title }}
					</h3>
					<p class="mt-2 text-gray-600 leading-relaxed line-clamp-3">
						{{ item.description }}
					</p>

					<div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
						<div class="flex items-center gap-2">
							<font-awesome-icon
								:icon="['fas', 'map-marker-alt']"
								class="w-4"
							/>
							<span>{{ item.city }}</span>
						</div>
						<div class="flex items-center gap-2">
							<font-awesome-icon
								:icon="['fas', 'calendar-alt']"
								class="w-4"
							/>
							<span>{{ item.start }} - {{ item.end }}</span>
						</div>
					</div>

					<div class="mt-2 flex items-center justify-between text-gray-600">
						<span>已申請人數：{{ item.applicants }} 人</span>
						<el-tag
							type="success"
							effect="plain"
						>
							{{ item.status }}
						</el-tag>
					</div>

					<div class="mt-4">
						<el-button
							class="w-full"
							@click="handleViewDetail(item)"
						>
							查看詳情
						</el-button>
					</div>
				</div>
			</el-card>
		</div>

		<!-- Pagination (mimic applications page) -->
		<section class="mt-8 flex items-center justify-between text-gray-500">
			<div>
				顯示 {{ pageStartDisplay }}-{{ pageEndDisplay }} 筆，共 {{ total }} 筆結果
			</div>
			<el-pagination
				v-model:current-page="currentPage"
				:page-size="pageSize"
				:total="total"
				layout="prev, pager, next"
				:pager-count="7"
			/>
		</section>
	</section>
</template>
