import type { SubmitEvaluationPayload, SubmitEvaluationResponse } from '~/types/users/comment';

export const useUserEvaluation = () => {
  const submitEvaluation = async (serialNum: string | number, payload: SubmitEvaluationPayload) => {
    const url = `/api-proxy/v1/comments/${serialNum}/evaluation`;

    try {
      const data = await $fetch<SubmitEvaluationResponse>(url, {
        method: 'POST',
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
