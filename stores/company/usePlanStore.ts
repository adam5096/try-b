import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { CompanyPlan } from '~/types/company/plan/current';
import { isActivePlan } from '~/types/company/plan/current';

export const useCompanyPlanStore = defineStore('companyPlan', () => {
	const authStore = useCompanyAuthStore();
	// 付款狀態持久化：使用 Cookie 保存，避免重整遺失
	const isPayedCookie = useCookie<boolean>('company_is_payed', {
		default: () => false,
		sameSite: 'lax',
	});
	const isPayed = ref<boolean>(isPayedCookie.value ?? false);
	const {
		data: plan,
		pending: isLoading,
		error,
		execute: fetchCurrentPlan,
	} = useFetch<CompanyPlan>('/v1/plans/current', {
		baseURL: '/api',
		key: 'company-current-plan', // ✅ 加入快取 key，避免重複請求
		immediate: false, // 不立即執行，手動控制
		server: false, // 僅在客戶端執行
	});

	// ✅ 監聽登入狀態變化，確保認證完全完成後才獲取 plan
	watch(
		() => authStore.isLoggedIn,
		(isLoggedIn) => {
			if (isLoggedIn && !plan.value && !isLoading.value) {
				// 直接執行，不使用 nextTick 避免阻塞
				fetchCurrentPlan();
			}
		},
		{ immediate: true }, // 立即執行一次，以處理頁面刷新時已登入的情況
	);

	// 同步 isPayed 與 Cookie
	watch(
		isPayed,
		(val) => {
			isPayedCookie.value = val;
		},
		{ immediate: true },
	);

	const hasPlan = computed(() => plan.value && isActivePlan(plan.value));
	const planStatusText = computed(() => {
		if (isLoading.value && !plan.value) {
			return '方案資訊載入中...';
		}
		if (error.value) {
			return '無法載入方案資訊';
		}
		if (!plan.value) {
			return '無法載入方案資訊';
		}

		const p = plan.value;

		// 檢查是否為無效方案
		if (!isActivePlan(p)) {
			// 優先使用 API 的 message，但提供合理的備用文字
			return p.message || '目前尚無有效方案';
		}

		// 有效方案的顯示邏輯
		// 統一顯示為西元年/月/日（與頁面其它處一致）
		const startDate = new Date(p.start_date).toLocaleDateString('zh-TW');
		const endDate = new Date(p.end_date).toLocaleDateString('zh-TW');

		return `目前的方案 ${p.plan_name} | 日期：${startDate} - ${endDate} | 體驗人數上限 ${p.max_participants} 人 | 剩餘 ${p.remaining_people} 人`;
	});

	// 在 SSR 階段使用的初始化：確保伺服端渲染前已取得方案
	async function init() {
		if (!plan.value && authStore.token) {
			try {
				await fetchCurrentPlan();
			}
			catch {
				// 靜默失敗，交由頁面在客戶端再處理
			}
		}
	}

	function markPaid() {
		isPayed.value = true;
	}

	function resetPaid() {
		isPayed.value = false;
	}

	return {
		plan,
		isLoading,
		error,
		hasPlan,
		planStatusText,
		fetchCurrentPlan,
		init,
		// 付款狀態對外暴露
		isPayed,
		markPaid,
		resetPaid,
	};
});
