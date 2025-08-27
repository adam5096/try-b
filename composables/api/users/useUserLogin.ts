import { useApiFetch } from '~/composables/api/shared/useApiFetch';
import type { User, UserLoginData } from '~/types/users/user';

interface LoginResponse {
  status: number;
  message: string;
  token: string;
  user: User;
}

export const useUserLogin = () => {
  async function login(loginData: UserLoginData) {
    return await useApiFetch<LoginResponse>('/v1/users/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: {
        identifier: loginData.account,
        password: loginData.password,
      },
    });
  }

  return { login };
};
