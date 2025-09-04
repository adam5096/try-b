import type { SubmitEvaluationPayload, SubmitEvaluationResponse } from '~/types/users/comment';
import { useUserApiFetch } from './useUserApiFetch';

export const useUserEvaluation = () => {
  const submitEvaluation = async (
    userId: number,
    programId: number,
    payload: SubmitEvaluationPayload,
  ) => {
    const url = `/api/v1/users/${userId}/programs/${programId}/evaluations`;

    try {
      // 使用 useUserApiFetch 確保 JWT token 被注入
      const data = await useUserApiFetch<SubmitEvaluationResponse>(url, {
        method: 'PUT',
        body: payload,
      });
      
      return { data: { value: data }, error: { value: null }, pending: { value: false } };
    } catch (error) {
      return { data: { value: null }, error: { value: error }, pending: { value: false } };
    }
  };

  return {
    submitEvaluation
  };
};
