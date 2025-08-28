import { useUserApiFetch } from '~/composables/api/users/useUserApiFetch';
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
    return await useUserApiFetch<RegisterResponse>('/api-proxy/v1/users/register', {
      method: 'POST',
      body: registerData,
    });
  }

  return { register };
};
