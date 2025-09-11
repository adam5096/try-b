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
      
      console.log('Fetching program detail:', { programId, url });
      
      // 取得 user auth token 來設定 headers（如果需要認證）
      const tokenCookie = useCookie<string | null>('userAuthToken');
      const headers: Record<string, string> = {};
      
      if (tokenCookie.value) {
        headers.authorization = `Bearer ${tokenCookie.value}`;
      }
      
      const response = await $fetch<ProgramDetail>(url, {
        method: 'GET',
        headers,
      });
      
      console.log('Program detail response:', response);
      
      return response;
    } catch (error) {
      console.error('Error fetching program detail:', error);
      throw error;
    }
  };
  
  return {
    fetchProgramDetail,
  };
};
