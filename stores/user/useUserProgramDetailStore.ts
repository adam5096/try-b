import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ProgramDetail } from '~/types/users/programDetail';
import { useUserProgramDetail } from '~/composables/api/users/useUserProgramDetail';

export const useUserProgramDetailStore = defineStore('userProgramDetail', () => {
	// State
	const programDetail = ref<ProgramDetail | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const currentProgramId = ref<string | number | null>(null);

	// Computed
	const hasData = computed(() => programDetail.value !== null);
	const hasError = computed(() => error.value !== null);

	// API
	const { fetchProgramDetail } = useUserProgramDetail();

	/**
   * 取得計畫詳情
   * @param programId 計畫 ID
   */
	const fetchDetail = async (programId: string | number) => {
		try {
			// 如果已經載入過相同 ID 的資料，直接返回
			if (currentProgramId.value === programId && programDetail.value) {
				return programDetail.value;
			}

			loading.value = true;
			error.value = null;
			currentProgramId.value = programId;

			const detail = await fetchProgramDetail(programId);
			if (!detail) throw new Error('無效的 API 回應格式');
			programDetail.value = detail;
		}
		catch (err) {
			// 根據錯誤類型設定不同的錯誤訊息
			if (err instanceof Error) {
				if (err.message.includes('404') || err.message.includes('Not Found')) {
					error.value = '找不到指定的體驗計畫，可能已被移除或不存在。';
				}
				else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
					error.value = '您沒有權限查看此計畫，請確認登入狀態。';
				}
				else if (err.message.includes('500') || err.message.includes('Internal Server Error')) {
					error.value = '伺服器發生錯誤，請稍後再試。';
				}
				else {
					error.value = err.message || '載入計畫詳情時發生未知錯誤。';
				}
			}
			else {
				error.value = '載入計畫詳情時發生未知錯誤。';
			}

			// 清空資料
			programDetail.value = null;
		}
		finally {
			loading.value = false;
		}
	};

	/**
   * 清空資料
   */
	const clearDetail = () => {
		programDetail.value = null;
		error.value = null;
		currentProgramId.value = null;
	};

	/**
   * 重新載入當前計畫詳情
   */
	const refreshDetail = async () => {
		if (currentProgramId.value) {
			await fetchDetail(currentProgramId.value);
		}
	};

	return {
		// State
		programDetail,
		loading,
		error,
		currentProgramId,

		// Computed
		hasData,
		hasError,

		// Actions
		fetchDetail,
		clearDetail,
		refreshDetail,
	};
});
