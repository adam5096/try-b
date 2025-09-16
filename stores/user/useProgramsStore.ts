import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Program, ProgramsQueryParams } from '~/types/users/program';
import { useUserPrograms } from '~/composables/api/users/useUserPrograms';

export const useUserProgramsStore = defineStore('userPrograms', () => {
	const programs = ref<Program[]>([]);
	const backendPopularPrograms = ref<Program[]>([]);
	const total = ref(0);
	const currentPage = ref(1);
	const currentLimit = ref(6);
	const loading = ref(false);
	const error = ref<string | null>(null);

	// 熱門邏輯：預留擴展點
	const isPopularProgram = (program: Program): boolean => {
		// 目前規則：Score > 10 才視為熱門
		// 未來可擴充：加入 FavoritesCount、ViewsCount、近7日成長率等加權計算
		const score = program.Score ?? 0;
		return score > 10;
	};

	const computePopularPrograms = (list: Program[]): Program[] => {
		// 預留擴展：可改為多指標加權排序或時間區間篩選
		return [...list]
			.filter(isPopularProgram)
			.sort((a, b) => (b.Score ?? 0) - (a.Score ?? 0))
			.slice(0, 5);
	};

	// Computed properties
	const items = computed(() => programs.value);
	const popular = computed(() =>
		backendPopularPrograms.value.length > 0
			? backendPopularPrograms.value
			: computePopularPrograms(programs.value),
	);

	const { fetchPrograms: apiFetchPrograms } = useUserPrograms();

	const fetchPrograms = async (params: ProgramsQueryParams = {}) => {
		try {
			loading.value = true;
			error.value = null;

			const queryParams = {
				page: params.page || currentPage.value,
				limit: params.limit || currentLimit.value,
				...params,
			};

			const { data, error: apiError } = await apiFetchPrograms(queryParams);

			if (apiError.value) {
				const err = apiError.value as { data?: { message?: string }; message?: string };
				throw new Error(err?.data?.message ?? err?.message ?? '取得計畫列表失敗');
			}

			if (data.value) {
				// 正規化：確保每一筆清單都有可用的 Program Id
				const normalizeImageUrl = (u?: string | null) => {
					if (!u) return null;
					const httpsUrl = u.trim().replace(/^http:\/\//i, 'https://');
					try {
						return encodeURI(httpsUrl);
					}
					catch {
						return httpsUrl.replace(/\s/g, '%20');
					}
				};
				const normalizeProgram = (raw: unknown): Program => ({
					...(raw as Record<string, unknown>),
					Id: (raw as Record<string, unknown>)?.Id ?? null,
					CoverImage: normalizeImageUrl((raw as Record<string, unknown>)?.CoverImage),
					imageLoaded: false, // 初始化圖片載入狀態
				} as unknown as Program);

				const normalizedItems = (data.value.items || []).map(normalizeProgram);

				programs.value = normalizedItems;
				total.value = data.value.total || 0;
				currentPage.value = data.value.page || 1;
				currentLimit.value = data.value.limit || 6;

				// 熱門清單：優先採用後端傳回的 PopularPrograms
				const rawPopular = (data.value as Record<string, unknown>).PopularPrograms || [];
				backendPopularPrograms.value = Array.isArray(rawPopular)
					? rawPopular.map(normalizeProgram)
					: [];
			}
			else {
				programs.value = [];
				backendPopularPrograms.value = [];
				total.value = 0;
			}
		}
		catch (err) {
			error.value = err instanceof Error ? err.message : '取得計畫列表時發生未知錯誤';
			programs.value = [];
			total.value = 0;
		}
		finally {
			loading.value = false;
		}
	};

	const clearPrograms = () => {
		programs.value = [];
		total.value = 0;
		currentPage.value = 1;
		error.value = null;
	};

	return {
		// State
		programs,
		total,
		currentPage,
		currentLimit,
		loading,
		error,

		// Computed
		items,
		popular,

		// Actions
		fetchPrograms,
		clearPrograms,
	};
});
