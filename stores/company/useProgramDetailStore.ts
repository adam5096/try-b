import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ProgramDetailResponse } from '~/types/company/program';

export const useCompanyProgramDetailStore = defineStore('company-program-detail', () => {
	// State
	const programDetail = ref<ProgramDetailResponse | null>(null);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	// Getters
	const hasProgramDetail = computed(() => !!programDetail.value);

	const programStats = computed(() => {
		if (!programDetail.value) return null;

		return {
			totalViews: programDetail.value.Views?.TotalViews ?? 0,
			weeklyViews: programDetail.value.Views?.WeeklyViews ?? 0,
			dailyViews: programDetail.value.Views?.DailyViews ?? 0,
			appliedCount: 0, // 這個欄位在新 API 中不存在，使用 Statistics 替代
			favoritesCount: 0, // 這個欄位在新 API 中不存在
			score: 0, // 這個欄位在新 API 中不存在
			daysLeft: 0, // 這個欄位在新 API 中不存在
			// 從新的 Statistics 物件中取得申請統計
			totalApplicants: programDetail.value.Statistics?.TotalApplicants ?? 0,
			reviewedCount: programDetail.value.Statistics?.ReviewedCount ?? 0,
			pendingCount: programDetail.value.Statistics?.PendingCount ?? 0,
		}
	});

	const programInfo = computed(() => {
		if (!programDetail.value) return null;

		return {
			id: programDetail.value.Id,
			name: programDetail.value.Name,
			intro: programDetail.value.Intro,
			companyName: '', // 這個欄位在新 API 中不存在
			companyLogo: '', // 這個欄位在新 API 中不存在
			companyCover: '', // 這個欄位在新 API 中不存在
			serialNum: '', // 這個欄位在新 API 中不存在
			address: programDetail.value.Address,
			addressMap: '', // 這個欄位在新 API 中不存在
			contactName: programDetail.value.ContactName,
			contactPhone: programDetail.value.ContactPhone,
			contactEmail: '', // 這個欄位在新 API 中不存在
			minPeople: programDetail.value.MinPeople,
			maxPeople: programDetail.value.MaxPeople,
			publishStartDate: programDetail.value.PublishStartDate,
			publishDurationDays: programDetail.value.PublishDurationDays,
			publishEndDate: programDetail.value.PublishEndDate,
			programStartDate: programDetail.value.ProgramStartDate,
			programEndDate: programDetail.value.ProgramEndDate,
			programDurationDays: programDetail.value.ProgramDurationDays,
			statusId: programDetail.value.Status.Id,
			statusTitle: programDetail.value.Status.Title,
			industry: programDetail.value.Industry,
			jobTitle: programDetail.value.JobTitle,
			status: programDetail.value.Status,
			images: programDetail.value.Images,
			steps: programDetail.value.Steps,
		}
	});

	// Actions
	const setProgramDetail = (data: ProgramDetailResponse | null) => {
		programDetail.value = data;
		error.value = null;
	};

	const setLoading = (loading: boolean) => {
		isLoading.value = loading;
	};

	const setError = (err: string | null) => {
		error.value = err;
		programDetail.value = null;
	};

	const clearProgramDetail = () => {
		programDetail.value = null;
		error.value = null;
		isLoading.value = false;
	};

	return {
		// State
		programDetail,
		isLoading,
		error,

		// Getters
		hasProgramDetail,
		programStats,
		programInfo,

		// Actions
		setProgramDetail,
		setLoading,
		setError,
		clearProgramDetail,
	}
});
