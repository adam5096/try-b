import type { ProgramDetail } from '~/types/users/programDetail';
import { useUserApiFetch } from './useUserApiFetch';

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
      // 使用 vite proxy 配置的 API 路徑
      const url = `/api/v1/programs/${programId}`;
      
      console.log('Fetching program detail:', { programId, url });
      
      const response = await useUserApiFetch<ProgramDetail>(url, {
        method: 'GET',
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
