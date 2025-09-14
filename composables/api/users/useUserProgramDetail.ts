import type { ProgramDetail } from '~/types/users/programDetail';

/**
 * 取得單一計畫詳情的 API 邏輯
 */
export const useUserProgramDetail = () => {
  /**
   * 取得計畫詳情
   * @param programId 計畫 ID
   * @returns Promise<ProgramDetail>
   */
  const fetchProgramDetail = async (programId: string | number): Promise<ProgramDetail> => {
    try {
      // 使用本地 BFF 端點
      const url = `/api/v1/users/program-detail/${programId}`;
      
      
      // 取得 user auth token 來設定 headers（如果需要認證）
      const { useUserAuthStore } = await import('~/stores/user/useAuthStore');
      const authStore = useUserAuthStore();
      const headers: Record<string, string> = {};
      
      if (authStore.token) {
        headers.authorization = `Bearer ${authStore.token}`;
      }
      
      const response = await $fetch<ProgramDetail>(url, {
        method: 'GET',
        headers,
      });
      
      
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  return {
    fetchProgramDetail,
  };
};
