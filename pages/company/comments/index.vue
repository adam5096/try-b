<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue';
import { UserFilled } from '@element-plus/icons-vue';
import { useCompanyAuthStore } from '~/stores/company/useAuthStore';
import { useCompanyCommentReviews } from '~/composables/api/company/useCompanyCommentReviews';

definePageMeta({
	layout: 'company',
	name: 'company-comments',
});

const route = useRoute();
const router = useRouter();

const comments = ref<any[]>([]);
const loading = ref(true);
const loadError = ref<string | null>(null);

const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0,
});

const authStore = useCompanyAuthStore();
const { fetchEvaluations } = useCompanyCommentReviews();

function formatDate(input: string) {
	const d = new Date(input);
	if (isNaN(d.getTime())) { return input; }
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}/${m}/${day}`;
}

async function loadData() {
	loading.value = true;
	loadError.value = null;
	// 開發階段若無 companyId，使用 9 做測試
	const companyId = authStore.companyId ?? 9;
	try {
		const { data, error } = await fetchEvaluations(companyId, { page: pagination.currentPage, limit: pagination.pageSize });
		if (error.value) {
			comments.value = [];
			pagination.total = 0;
			loadError.value = (error.value as any)?.message || '取得資料失敗';
			return;
		}
		if (data.value) {
			pagination.total = data.value.TotalCount || 0;
			comments.value = (data.value.Data || []).map(item => ({
				id: item.Id,
				author: {
					name: item.ParticipantName,
					avatar: item.Headshot || '',
					role: item.Identity?.title || '—',
					age: item.ParticipantAge,
				},
				program: item.ProgramPlanName,
				rating: item.Score,
				date: formatDate(item.EvaluationDate),
				text: item.Comment,
			}));
		}
	}
	catch (e: any) {
		loadError.value = e?.message || '取得資料失敗';
	}
	finally {
		loading.value = false;
	}
}

function handlePageChange(page: number) {
	pagination.currentPage = page;
	loadData();
}

onMounted(() => {
	// 第一時間載入數據
	loadData();
});
</script>

<template>
	<div class="space-y-6">
		<CompanyPlanStatusHeader />

		<h1 class="text-2xl font-bold">
			體驗者評價管理
		</h1>

		<el-card>
			<template #header>
				<div class="flex justify-between items-center">
					<span>評價列表</span>
					<span class="text-sm text-gray-500">共 {{ pagination.total }} 則評價</span>
				</div>
			</template>

			<el-skeleton
				:loading="loading"
				animated
				:throttle="{ leading: 200, trailing: 200, initVal: true }"
				:count="3"
			>
				<template #template>
					<div class="py-6 flex gap-4">
						<el-skeleton-item
							variant="circle"
							style="width:40px;height:40px"
						/>
						<div class="flex-1">
							<div class="flex flex-wrap justify-between items-center gap-2">
								<div class="flex items-center gap-2 text-sm">
									<el-skeleton-item
										variant="text"
										style="width:120px"
									/>
									<el-skeleton-item
										variant="text"
										style="width:48px"
									/>
									<el-skeleton-item
										variant="text"
										style="width:80px"
									/>
									<el-skeleton-item
										variant="text"
										style="width:160px"
									/>
								</div>
								<div class="flex items-center gap-2">
									<el-skeleton-item
										variant="text"
										style="width:80px"
									/>
									<el-skeleton-item
										variant="text"
										style="width:80px"
									/>
								</div>
							</div>
							<el-skeleton-item
								variant="p"
								style="margin-top:8px"
							/>
						</div>
					</div>
				</template>
				<template #default>
					<div class="divide-y divide-gray-200">
						<div
							v-for="comment in comments"
							:key="comment.id"
							class="py-6 flex gap-4"
						>
							<el-avatar
								:size="40"
								:src="comment.author.avatar"
							>
								<template #default>
									<el-icon><UserFilled /></el-icon>
								</template>
							</el-avatar>
							<div class="flex-1">
								<div class="flex flex-wrap justify-between items-center gap-2">
									<div class="flex items-center gap-2 text-sm">
										<span class="font-bold">{{ comment.author.name }}</span>
										<span>{{ comment.author.age }}歲</span>
										<span class="text-gray-500">{{ comment.author.role }}</span>
										<span class="text-gray-500">{{ comment.program }}</span>
									</div>
									<div class="flex items-center gap-2">
										<el-rate
											:model-value="comment.rating"
											disabled
											show-score
											text-color="#ff9900"
											:score-template="`${comment.rating.toFixed(1)}`"
										/>
										<span class="text-sm text-gray-500">{{ comment.date }}</span>
									</div>
								</div>
								<p class="mt-2 text-gray-700">
									{{ comment.text }}
								</p>
							</div>
						</div>
					</div>
				</template>
			</el-skeleton>

			<div class="mt-6 flex justify-between items-center">
				<div>
					<span class="text-sm text-gray-600 mr-2">每頁顯示:</span>
					<el-select
						v-model="pagination.pageSize"
						placeholder="Select"
						style="width: 120px"
					>
						<el-option
							label="10 筆"
							:value="10"
						/>
						<el-option
							label="20 筆"
							:value="20"
						/>
						<el-option
							label="50 筆"
							:value="50"
						/>
					</el-select>
				</div>
				<el-pagination
					background
					layout="prev, pager, next"
					:total="pagination.total"
					:current-page="pagination.currentPage"
					:page-size="pagination.pageSize"
					prev-text="上一頁"
					next-text="下一頁"
					@current-change="handlePageChange"
				/>
			</div>
		</el-card>
	</div>
</template>
