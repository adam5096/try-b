import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useCompanyAuthStore } from '~/stores/company/useAuthStore';
import type { ProgramsResponse, CreateProgramPayload, Program } from '~/types/company/program';
import type { ProgramCreationResponse } from '~/types/company/programCreation';

export const useCompanyProgramStore = defineStore('company-program', () => {
	const authStore = useCompanyAuthStore();
	// 路徑固定使用 /v1/...，透過 BFF 架構處理 baseURL
	const page = ref(1);
	const limit = ref(21);

	const { data, pending: isLoading, error, execute } = useFetch<ProgramsResponse>(() => authStore.companyId ? `/v1/company/programs/${authStore.companyId}` : '', {
		key: 'company-programs',
		baseURL: '/api',
		server: true,
		lazy: false,
		immediate: false, // We will trigger this manually
		params: {
			page,
			limit,
		},
	});

	// Watch for companyId to become available and then fetch programs
	watch(
		() => authStore.companyId,
		(newCompanyId) => {
			if (newCompanyId) {
				execute(); // This is the new fetchPrograms trigger
			}
		},
		{ immediate: true },
	);

	const programs = computed(() => (data.value?.items || []).map((p: unknown) => {
		const normalizeToHttps = (u?: string | null) => (u ? u.replace(/^http:\/\//i, 'https://') : null);
		const rawObj = p as Record<string, unknown>;
		return {
			...rawObj,
			CoverImage: normalizeToHttps(rawObj?.CoverImage as string | null),
			imageLoaded: false, // 初始化圖片載入狀態
		} as Program;
	}));
	const total = computed(() => data.value?.total || 0);

	function setPage(newPage: number) {
		page.value = newPage;
		// execute(); // useFetch will re-run automatically when `page` param changes
	}

	// Expose `execute` as `fetchPrograms` for external use if needed (e.g., manual refresh)
	const fetchPrograms = execute;

	// SSR 初始化：在伺服端渲染前預抓資料
	async function init() {
		if (!data.value && authStore.companyId) {
			try {
				await execute();
			}
			catch {
				// ignore and let client retry
			}
		}
	}

	async function createProgram(payload: CreateProgramPayload) {
		if (!authStore.companyId) {
			return { success: false, error: new Error('User not authenticated') };
		}

		try {
			const responseData = await $fetch<ProgramCreationResponse>(`/api/v1/company/programs/${authStore.companyId}`, {
				method: 'POST',
				body: payload,
			});

			if (responseData) {
				await fetchPrograms();
				return { success: true, data: responseData };
			}

			return { success: false, error: new Error('No data returned') };
		}
		catch (fetchError: unknown) {
			console.error('❌ 建立計畫請求失敗:', fetchError);
			return { success: false, error: fetchError };
		}
	}

	return {
		programs,
		total,
		page,
		limit,
		isLoading,
		error,
		fetchPrograms,
		setPage,
		createProgram,
		init,
	};
});
