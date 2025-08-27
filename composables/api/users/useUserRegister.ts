import { useApiFetch } from '~/composables/api/shared/useApiFetch';
import type { UserRegisterData } from '~/types/users/user';

interface RegisterResponse {
  status: number;
  message: string;
  id: number;
  Role: string;
  Account: string;
  Email: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const useUserRegister = () => {
  async function register(registerData: UserRegisterData) {
    return await useApiFetch<RegisterResponse>('/v1/users', {
      method: 'POST',
      body: registerData,
    });
  }

  return { register };
};
