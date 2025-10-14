<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import type { ReviewItem, ReviewStatus, CommentsQueryParams, SubmitEvaluationPayload } from '~/types/users/comment';
import { useUserComments } from '~/composables/api/users/useUserComments';
import { useUserEvaluation } from '~/composables/api/users/useUserEvaluation';

definePageMeta({
	name: 'user-comments',
	layout: 'user',
	middleware: 'user-auth',
	ssr: false, // CSR 模式
});

// API 相關
const { fetchComments } = useUserComments();
const { submitEvaluation } = useUserEvaluation();
const commentsData = ref<any>(null);
const loading = ref(false);
const error = ref<any>(null);

// 將後端回傳之 company_logo 轉為可用圖片 URL（相對路徑 → 透過本機代理）
function resolveCompanyLogo(rawLogoPath?: string | null): string | undefined {
	if (!rawLogoPath) { return undefined; }
	const trimmed = String(rawLogoPath).trim();
	if (!trimmed) { return undefined; }
	// 已是完整網址則直接使用
	if (/^https?:\/\//i.test(trimmed)) {
		return encodeURI(trimmed);
	}
	// 相對路徑：走 Nitro proxy，避免 CORS 與混合內容
	const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
	// 合併重複斜線，避免出現 /api-proxy//Images/... 造成 404
	const proxied = `/api-proxy${normalized}`.replace(/\/{2,}/g, '/');
	return encodeURI(proxied);
}

// 日期格式化
const { $dayjs } = useNuxtApp();
function formatEvaluationDate(dateStr?: string | null): string {
	if (!dateStr) { return ''; }
	const d = $dayjs(dateStr);
	return d.isValid() ? d.format('YYYY/MM/DD HH:mm:ss') : '';
}

// 篩選器狀態
const statusOptions = ['審核中', '系統已通過', '系統已拒絕', '人工已通過', '人工已拒絕', '待處理', '已發布', '全部通過', '全部拒絕', '未評價'];
const selectedStatuses = ref<string[]>([]);

const dateSortOptions = [
	{ label: '新到舊', value: 'newest' },
	{ label: '舊到新', value: 'oldest' },
] as const;
const selectedDateSort = ref<'newest' | 'oldest'>('newest');

// 分頁狀態
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [10, 20, 30, 50];

// 篩選面板可見性
const filterVisible = ref(false);

// 評價輸入狀態
const editingEvaluation = ref<{ [key: string]: { score: number, comment: string } | undefined }>({});

// 提交 loading 狀態（逐筆）
const submittingEvaluation = ref<{ [key: string]: boolean }>({});

// 計算屬性
const totalReviews = computed(() => commentsData.value?.TotalCount || 0);
const visibleReviews = computed(() => commentsData.value?.Data || []);

// 檢查是否有未完成的編輯
const hasUnfinishedEdits = computed(() => {
	return Object.keys(editingEvaluation.value).some(key =>
		editingEvaluation.value[key] !== undefined,
	);
});

// 統一的編輯檢查對話框
const showEditCheckDialog = async (title: string = '確認離開'): Promise<boolean> => {
	if (!hasUnfinishedEdits.value) {
		return true;
	}

	try {
		await ElMessageBox.confirm(
			'您有未完成的評價編輯，請選擇：',
			title,
			{
				confirmButtonText: '放棄編輯並離開',
				cancelButtonText: '繼續編輯',
				type: 'warning',
				distinguishCancelAndClose: true,
			},
		);
		// 使用者選擇放棄編輯
		editingEvaluation.value = {};
		return true;
	}
	catch (error) {
		// 使用者選擇繼續編輯或取消
		return false;
	}
};

// 狀態 ID 對應
const statusIdToText = (statusId: number): ReviewStatus => {
	const statusMap: { [key: number]: ReviewStatus } = {
		1: '審核中',
		2: '系統已通過',
		3: '系統已拒絕',
		4: '人工已通過',
		5: '人工已拒絕',
		6: '待處理',
		7: '已發布',
		15: '全部通過',
		16: '全部拒絕',
		17: '未評價',
	};
	return statusMap[statusId] || '未評價';
};

// 載入評價數據
const loadComments = async () => {
	loading.value = true;
	error.value = null;

	try {
		const params: CommentsQueryParams = {
			page: currentPage.value,
			limit: pageSize.value,
			status: selectedStatuses.value.length > 0 ? selectedStatuses.value as ReviewStatus[] : undefined,
			sort: selectedDateSort.value,
		};

		const result = await fetchComments(params);
		commentsData.value = result.data.value;
	}
	catch (err) {
		error.value = err;
	}
	finally {
		loading.value = false;
	}
};

// 篩選相關函數
function onClearFilters() {
	selectedStatuses.value = [];
	selectedDateSort.value = 'newest';
	currentPage.value = 1;
	loadComments();
}

function onApplyFilters() {
	currentPage.value = 1;
	filterVisible.value = false;
	loadComments();
}

// 狀態標籤類型
function tagTypeForStatus(status: ReviewStatus): 'success' | 'warning' | 'danger' | 'info' {
	switch (status) {
		case '系統已通過':
		case '人工已通過':
		case '全部通過':
			return 'success';
		case '審核中':
		case '待處理':
			return 'warning';
		case '系統已拒絕':
		case '人工已拒絕':
		case '全部拒絕':
			return 'danger';
		default:
			return 'info';
	}
}

// 開始編輯評價
function startEditEvaluation(item: ReviewItem) {
	editingEvaluation.value[item.serial_num] = {
		score: item.score || 0,
		comment: item.comment || '',
	};
}

// 提交評價
async function submitEvaluationForItem(item: ReviewItem) {
	const evaluationData = editingEvaluation.value[item.serial_num];
	if (!evaluationData) { return; }

	try {
		// 顯示確認訊息
		await ElMessageBox.confirm(
			'確定要提交此評價嗎？',
			'確認提交',
			{
				confirmButtonText: '確定',
				cancelButtonText: '取消',
				type: 'warning',
			},
		);

		// 設定逐筆提交 loading
		submittingEvaluation.value[item.serial_num] = true;

		const payload: SubmitEvaluationPayload = {
			score: evaluationData.score,
			comment: evaluationData.comment,
		};

		// 從 auth store 取得 userId，programId 來自列表的 program_id（新欄位）
		const authStore = useUserAuthStore();
		const userId = authStore.user?.id as number | undefined;
		if (!userId) { throw new Error('尚未登入或缺少使用者資訊'); }

		const result = await submitEvaluation(userId, item.program_id, payload);

		if (result.error.value) {
			throw result.error.value;
		}

		// 成功後更新本地數據
		const list = commentsData.value?.Data || [];
		const itemIndex = list.findIndex((review: ReviewItem) => review.serial_num === item.serial_num);
		if (itemIndex !== -1) {
			list[itemIndex].score = evaluationData.score;
			list[itemIndex].comment = evaluationData.comment;
			list[itemIndex].status_id = 2; // 假設提交後變為已通過狀態
		}

		// 清除編輯狀態
		editingEvaluation.value[item.serial_num] = undefined;

		ElMessage.success('評價提交成功！');
	}
	catch (error: any) {
		if (error === 'cancel') { return; }

		// 針對 400 Bad Request：統一顯示 AI 審查失敗訊息
		const status = error?.status || error?.statusCode || error?.response?.status;
		if (status === 400) {
			await ElMessageBox.alert('評價內容被判定為不當，請修改後再提交。', '提交失敗', {
				type: 'error',
				confirmButtonText: '我知道了',
			});
			return;
		}

		// 其他錯誤：保留原本處理邏輯
		let errorMessage = '提交失敗，請稍後重試';

		// 處理後端錯誤回應（安全考量：不直接揭露技術性錯誤訊息）
		const backendMessage = error?.data?.Message || error?.data?.message || error?.response?._data?.message;
		if (backendMessage) {
			// 特殊處理「體驗尚未結束」錯誤
			if (backendMessage === '體驗尚未結束') {
				ElMessage.warning('體驗尚未結束');
				// 退出編輯模式，收合多行輸入框
				editingEvaluation.value[item.serial_num] = undefined;
				return;
			}
			// 其他後端訊息統一使用友善提示
			errorMessage = '提交失敗，請稍後重試';
		}
		else if (error?.message) {
			if (error.message.includes('網路')) {
				errorMessage = '網路連線異常，請檢查網路後重試';
			}
			else if (error.message.includes('認證') || error.message.includes('登入')) {
				errorMessage = '登入已過期，請重新登入';
			}
			else if (error.message.includes('維護')) {
				errorMessage = '服務暫時維護中，請稍後再試';
			}
			else {
				// 安全考量：不直接顯示技術性錯誤訊息
				errorMessage = '提交失敗，請稍後重試';
			}
		}

		ElMessage.error(errorMessage);
	}
	finally {
		// 無論成功或失敗，關閉 loading
		submittingEvaluation.value[item.serial_num] = false;
	}
}

// 取消編輯
function cancelEditEvaluation(item: ReviewItem) {
	editingEvaluation.value[item.serial_num] = undefined;
}

// 監聽分頁變化
watch([currentPage, pageSize], () => {
	loadComments();
});

// 路由離開前檢查
onBeforeRouteLeave(async (to, from, next) => {
	if (hasUnfinishedEdits.value) {
		const shouldLeave = await showEditCheckDialog('確認離開頁面');
		if (shouldLeave) {
			next();
		}
		else {
			next(false);
		}
	}
	else {
		next();
	}
});

// 初始化載入
onMounted(() => {
	loadComments();

	// 瀏覽器離開前檢查
	const handleBeforeUnload = (event: BeforeUnloadEvent) => {
		if (hasUnfinishedEdits.value) {
			event.preventDefault();
			event.returnValue = '您有未完成的評價編輯，確定要離開嗎？';
			return event.returnValue;
		}
	};

	// 頁面可見性變化檢查
	const handleVisibilityChange = () => {
		if (document.hidden && hasUnfinishedEdits.value) {
			ElMessage.info('頁面已隱藏，請注意您的編輯內容');
		}
	};

	// 網路中斷檢查
	const handleOffline = () => {
		if (hasUnfinishedEdits.value) {
			ElMessage.warning('網路連線中斷，請注意您的編輯內容');
		}
	};

	// 網路恢復檢查
	const handleOnline = () => {
		if (hasUnfinishedEdits.value) {
			ElMessage.success('網路已恢復，您可以繼續編輯評價');
		}
	};

	// 添加事件監聽器
	window.addEventListener('beforeunload', handleBeforeUnload);
	document.addEventListener('visibilitychange', handleVisibilityChange);
	window.addEventListener('offline', handleOffline);
	window.addEventListener('online', handleOnline);

	// 組件卸載前清理
	onBeforeUnmount(() => {
		window.removeEventListener('beforeunload', handleBeforeUnload);
		document.removeEventListener('visibilitychange', handleVisibilityChange);
		window.removeEventListener('offline', handleOffline);
		window.removeEventListener('online', handleOnline);
	});
});
</script>

<template>
	<section class="mx-auto max-w-container-users px-6 md:px-12 py-8 md:py-10">
		<!-- Header: 標題與總數 -->
		<div class="flex items-end justify-between">
			<h2 class="text-2xl md:text-3xl font-bold text-gray-800 tracking-widest">
				評價列表
			</h2>
			<div class="text-gray-500 text-base md:text-lg tracking-wider">
				共 {{ totalReviews }} 則評價
			</div>
		</div>

		<!-- Controls: 篩選按鈕 -->
		<div class="mt-6 flex flex-wrap items-center gap-4 md:gap-6">
			<!-- 篩選 Popover -->
			<el-popover
				v-model:visible="filterVisible"
				placement="bottom-start"
				trigger="click"
				:width="440"
			>
				<template #reference>
					<el-button>篩選</el-button>
				</template>

				<div class="p-3">
					<div class="flex flex-col gap-6">
						<!-- 審核狀態群組 -->
						<div>
							<el-tag
								effect="plain"
								type="info"
							>
								審核狀態
							</el-tag>
							<div class="mt-3">
								<el-checkbox-group v-model="selectedStatuses">
									<el-checkbox-button
										v-for="opt in statusOptions"
										:key="opt"
										:value="opt"
									>
										{{ opt }}
									</el-checkbox-button>
								</el-checkbox-group>
							</div>
						</div>

						<!-- 日期排序群組 -->
						<div>
							<el-tag
								effect="plain"
								type="info"
							>
								日期
							</el-tag>
							<div class="mt-3">
								<el-radio-group v-model="selectedDateSort">
									<el-radio-button
										v-for="opt in dateSortOptions"
										:key="opt.value"
										:value="opt.value"
									>
										{{ opt.label }}
									</el-radio-button>
								</el-radio-group>
							</div>
						</div>
					</div>

					<div class="mt-5 flex justify-end gap-2">
						<el-button
							text
							@click="onClearFilters"
						>
							清除
						</el-button>
						<el-button
							type="primary"
							@click="onApplyFilters"
						>
							套用
						</el-button>
					</div>
				</div>
			</el-popover>
		</div>

		<!-- 分隔線 -->
		<el-divider />

		<!-- Loading State -->
		<div
			v-if="loading"
			class="py-6"
		>
			<el-skeleton
				:rows="3"
				animated
			/>
		</div>

		<!-- Error State -->
		<div
			v-else-if="error"
			class="text-center py-8"
		>
			<el-alert
				title="載入失敗"
				:description="error.message || '載入評價列表時發生錯誤'"
				type="error"
				show-icon
			/>
			<el-button
				class="mt-4"
				@click="loadComments"
			>
				重新載入
			</el-button>
		</div>

		<!-- List: 公司評價卡片 -->
		<div v-else>
			<div
				v-for="item in visibleReviews"
				:key="item.serial_num"
				class="py-4"
			>
				<div class="flex items-center justify-between">
					<!-- Left: Logo + 公司名稱 + 體驗標籤 + 狀態 -->
					<div class="flex items-center gap-4">
						<el-avatar
							:size="48"
							:src="resolveCompanyLogo(item.company_logo)"
						>
							{{ item.company_name.charAt(0) }}
						</el-avatar>
						<div class="flex items-center flex-wrap gap-x-3 gap-y-2">
							<div class="text-lg font-semibold text-gray-800 tracking-widest">
								{{ item.company_name }}
							</div>
							<el-tag
								effect="plain"
								round
							>
								{{ item.program_name }}
							</el-tag>
						</div>
					</div>

					<!-- Right: 撰寫評價（僅未評價） -->
					<div v-if="item.status_id === 17 && !editingEvaluation[item.serial_num]">
						<el-button
							size="small"
							round
							@click="startEditEvaluation(item)"
						>
							撰寫評價
						</el-button>
					</div>
				</div>

				<!-- 評分/日期/狀態列（已送出狀態） -->
				<div
					v-if="item.status_id !== 17"
					class="mt-3 flex items-center gap-4 text-gray-600"
				>
					<el-rate
						:model-value="item.score || 0"
						disabled
					/>
					<span class="font-semibold">{{ (item.score || 0).toFixed(1) }}</span>
					<span class="text-gray-400">{{ formatEvaluationDate(item.evaluation_at) || '-' }}</span>
					<el-tag
						:type="tagTypeForStatus(statusIdToText(item.status_id))"
						size="small"
						effect="plain"
					>
						{{ statusIdToText(item.status_id) }}
					</el-tag>
				</div>

				<!-- 內文 -->
				<p
					v-if="item.comment"
					class="mt-2 text-gray-700 leading-relaxed tracking-wider"
				>
					{{ item.comment }}
				</p>

				<!-- 評價輸入區域（未評價狀態） -->
				<div
					v-if="item.status_id === 17 && editingEvaluation[item.serial_num]"
					class="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
				>
					<div class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">評分</label>
							<el-rate v-model="editingEvaluation[item.serial_num]!.score" />
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">評價內容</label>
							<el-input
								v-model="editingEvaluation[item.serial_num]!.comment"
								type="textarea"
								:rows="4"
								placeholder="請輸入您的評價..."
								maxlength="500"
								show-word-limit
							/>
						</div>
						<div class="flex justify-end gap-2">
							<el-button
								:disabled="submittingEvaluation[item.serial_num] === true"
								@click="cancelEditEvaluation(item)"
							>
								取消
							</el-button>
							<el-button
								type="primary"
								:loading="submittingEvaluation[item.serial_num] === true"
								:disabled="submittingEvaluation[item.serial_num] === true"
								@click="submitEvaluationForItem(item)"
							>
								提交評價
							</el-button>
						</div>
					</div>
				</div>

				<!-- item divider -->
				<el-divider />
			</div>
		</div>

		<!-- Pagination -->
		<div
			v-if="!loading && !error"
			class="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
		>
			<!-- 每頁顯示 -->
			<div class="flex items-center gap-3 whitespace-nowrap">
				<span class="text-gray-600 tracking-widest">每頁顯示：</span>
				<el-select
					v-model="pageSize"
					placeholder="選擇"
					style="width: 120px;"
				>
					<el-option
						v-for="size in pageSizeOptions"
						:key="size"
						:value="size"
					>
						{{ size }} 筆
					</el-option>
				</el-select>
			</div>

			<!-- 分頁器 -->
			<el-pagination
				v-model:current-page="currentPage"
				:page-size="pageSize"
				:total="totalReviews"
				:pager-count="7"
				layout="prev, pager, next"
				background
			/>
		</div>
	</section>
</template>
