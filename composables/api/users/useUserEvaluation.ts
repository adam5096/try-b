import type { SubmitEvaluationPayload, SubmitEvaluationResponse } from '~/types/users/comment';
import { useUserApiFetch } from './useUserApiFetch';

export const useUserEvaluation = () => {
  const submitEvaluation = async (serialNum: string | number, payload: SubmitEvaluationPayload) => {
    // 使用硬編碼的 programId (45) 和 userId (2) 作為測試值
    const url = `/api-proxy/v1/users/2/programs/45/evaluations`;

    try {
      // 使用 useUserApiFetch 確保 JWT token 被注入
      const data = await useUserApiFetch<SubmitEvaluationResponse>(url, {
        method: 'PUT',
        body: payload,
      });
      
      return {
        data: { value: data },
        error: { value: null },
        pending: { value: false }
      };
    } catch (error) {
      return {
        data: { value: null },
        error: { value: error },
        pending: { value: false }
      };
    }
  };

  return {
    submitEvaluation
  };
};
