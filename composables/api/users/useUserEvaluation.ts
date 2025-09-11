import type { SubmitEvaluationPayload, SubmitEvaluationResponse } from '~/types/users/comment';

export const useUserEvaluation = () => {
  const submitEvaluation = async (
    userId: number,
    programId: number,
    payload: SubmitEvaluationPayload,
  ) => {
    const url = `/api/v1/users/evaluation/${userId}/${programId}`;

    try {
      // 取得 user auth token 來設定 headers
      const tokenCookie = useCookie<string | null>('userAuthToken');
      const headers: Record<string, string> = {};
      
      if (tokenCookie.value) {
        headers.authorization = `Bearer ${tokenCookie.value}`;
      }

      // 使用 $fetch 呼叫本地 BFF 端點
      const data = await $fetch<SubmitEvaluationResponse>(url, {
        method: 'PUT',
        headers,
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
