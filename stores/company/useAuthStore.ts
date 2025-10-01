import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import type {
	LoginData,
	CompanyUser,
	CompanyProfile,
} from '~/types/company/company';

export const useCompanyAuthStore = defineStore('companyAuth', () => {
	// 統一 Cookie 選項，確保會被瀏覽器保存並於路由間持久化
	const cookieOptions = {
		path: '/',
		sameSite: 'lax' as const,
		maxAge: 60 * 60 * 24 * 7, // 7 天
		secure: import.meta.env.PROD ?? false,
	};
	const tokenCookie = useCookie<string | null>('companyAuthToken', cookieOptions);
	const userCookie = useCookie<CompanyProfile | null>('companyAuthUser', cookieOptions);
	const companyIdCookie = useCookie<number | null>('companyId', cookieOptions);
	// 保存登入回應中的基本使用者資訊（含 Role、Account）以供版頭顯示
	const basicUserCookie = useCookie<CompanyUser | null>('companyAuthBasic', cookieOptions);

	const token = ref<string | null>(tokenCookie.value ?? null);
	const user = ref<CompanyProfile | null>(userCookie.value ?? null);
	const companyId = ref<number | null>(companyIdCookie.value ?? null);
	const basicUser = ref<CompanyUser | null>(basicUserCookie.value ?? null);

	const { $api } = useNuxtApp();
	const _api = $api as typeof $fetch;

	const isLoggedIn = computed(() => !!token.value && !!user.value);

	// ✅ 使用 useFetch 提供快取和 SSR 安全性
	const {
		data: fetchedUserData,
		pending: isLoadingUser,
		error: userError,
		execute: refreshUser,
		clear: clearUserData,
	} = useFetch<CompanyProfile>('/v1/company', {
		baseURL: '/api',
		key: 'company-user-profile', // 唯一快取 key，避免重複請求
		server: false, // 僅在客戶端執行
		immediate: false, // 不立即執行，手動控制
		watch: false, // 不自動監聽參數變化
		// 添加快取控制，確保登入後獲取最新資料
		default: () => null,
	});

	// 監聽 fetchedUserData 變化並同步到 store
	watch(fetchedUserData, (newUserData) => {
		if (newUserData) {
			user.value = newUserData;
			userCookie.value = newUserData;
		}
	});

	// 監聽錯誤並處理登出
	watch(userError, (error) => {
		if (error) {
			console.error('Company user fetch error:', error);
			logout();
		}
	});

	/**
   * @description 優化的取得企業使用者資料函式 - 避免重複請求
   *              使用 useFetch 內建快取機制，確保資料不會重複載入
   */
	async function fetchUser() {
		if (!token.value) {
			return;
		}

		// ✅ 如果已有使用者資料且無錯誤，不重複請求
		if (user.value && !userError.value) {
			console.log('Company user data already exists, skipping fetch');
			return;
		}

		// ✅ 如果正在載入中，避免重複請求
		if (isLoadingUser.value) {
			console.log('Company user fetch already in progress');
			return;
		}

		try {
			// 登入後清除快取，確保獲取最新資料
			clearUserData();
			await refreshUser();
		}
		catch (error) {
			console.error('Failed to fetch company user:', error);
			// 錯誤會自動觸發 userError watch 處理登出
		}
	}

	/**
   * @description 企業使用者登入流程
   *              1. 呼叫登入 API (POST /v1/company/login) 以取得 token
   *              2. 成功後，儲存 token
   *              3. 接著呼叫 fetchUser() 取得完整的企業使用者資料
   */
	async function login(loginData: LoginData) {
		const { login: performLogin } = useCompanyLogin();
		try {
			// 使用 composable 統一 API 調用方式，與 user 端保持一致
			const response = await performLogin(loginData);

			if (response && response.token) {
				token.value = response.token;
				tokenCookie.value = response.token;

				// 從登入回應中取得並儲存 CompanyId
				companyId.value = response.user.companyId;
				companyIdCookie.value = response.user.companyId;

				// 保存登入回應中的基本使用者資訊（Account/Role）
				basicUser.value = response.user;
				basicUserCookie.value = response.user;

				// ✅ 登入成功後立即獲取完整的使用者資料
				// 清除快取並強制重新獲取，確保資料一致性
				clearUserData();
				await fetchUser();

				// 登入成功後，重置企業付款狀態持久化並同步到 store
				const companyPayedCookie = useCookie<boolean>('company_is_payed', {
					path: '/',
					sameSite: 'lax',
				});
				companyPayedCookie.value = false;
				try {
					const { useCompanyPlanStore } = await import('~/stores/company/usePlanStore');
					const planStore = useCompanyPlanStore();
					planStore.resetPaid();
				}
				catch (_e) {
					// 忽略可能的循環依賴問題，至少 Cookie 已重置
				}
			}
			else {
				throw new Error('登入失敗：無效的回應格式');
			}
		}
		catch (error) {
			await logout();
			throw error;
		}
	}

	/**
   * @description 企業使用者登出流程 - 清理所有快取和狀態
   */
	async function logout() {
		if (token.value) {
			try {
				await useFetch('/v1/company/logout', {
					method: 'POST',
					baseURL: '/api',
				});
			}
			catch (_error) {
				// 忽略登出時的錯誤
			}
		}

		// ✅ 清理 useFetch 快取
		clearUserData();

		// 清理所有狀態
		user.value = null;
		userCookie.value = null;
		token.value = null;
		tokenCookie.value = null;
		companyId.value = null;
		companyIdCookie.value = null;
		basicUser.value = null;
		basicUserCookie.value = null;

		// 也一併清除企業付款狀態的持久化 Cookie
		const companyPayedCookie = useCookie<boolean | null>('company_is_payed', {
			path: '/',
			sameSite: 'lax',
		});
		companyPayedCookie.value = null;

		// 清除「首次進入方案列表」的旗標 Cookie
		const firstVisitFlag = useCookie<boolean | null>('company_purchase_first_visit_done', {
			path: '/',
			sameSite: 'lax',
		});
		firstVisitFlag.value = null;
	}

	return {
		user,
		token,
		companyId,
		basicUser,
		isLoggedIn,
		isLoadingUser, // ✅ 暴露載入狀態
		userError, // ✅ 暴露錯誤狀態
		login,
		logout,
		fetchUser,
		refreshUser, // ✅ 暴露手動重新整理函數
	};
});
