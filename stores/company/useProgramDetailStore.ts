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
      totalViews: programDetail.value.total_views,
      weeklyViews: programDetail.value.weekly_views,
      dailyViews: programDetail.value.daily_views,
      appliedCount: programDetail.value.applied_count,
      favoritesCount: programDetail.value.favorites_count,
      score: programDetail.value.score,
      daysLeft: programDetail.value.days_left,
    };
  });

  const programInfo = computed(() => {
    if (!programDetail.value) return null;
    
    return {
      id: programDetail.value.id,
      name: programDetail.value.name,
      intro: programDetail.value.intro,
      companyName: programDetail.value.company_name,
      companyLogo: programDetail.value.company_logo,
      companyCover: programDetail.value.company_cover,
      serialNum: programDetail.value.serial_num,
      address: programDetail.value.address,
      addressMap: programDetail.value.address_map,
      contactName: programDetail.value.contact_name,
      contactPhone: programDetail.value.contact_phone,
      contactEmail: programDetail.value.contact_email,
      minPeople: programDetail.value.min_people,
      maxPeople: programDetail.value.max_people,
      publishStartDate: programDetail.value.publish_start_date,
      publishDurationDays: programDetail.value.publish_duration_days,
      publishEndDate: programDetail.value.publish_end_date,
      programStartDate: programDetail.value.program_start_date,
      programEndDate: programDetail.value.program_end_date,
      programDurationDays: programDetail.value.program_duration_days,
      statusId: programDetail.value.status_id,
      statusTitle: programDetail.value.status_title,
      industry: programDetail.value.Industry,
      jobTitle: programDetail.value.JobTitle,
      status: programDetail.value.Status,
      images: programDetail.value.Images,
      steps: programDetail.value.Steps,
    };
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
  };
});
