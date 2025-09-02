import { useUserApiFetch } from '~/composables/api/users/useUserApiFetch';
import type { User, UserLoginData } from '~/types/users/user';

// API 回應中的 User 格式（大寫欄位名）
interface ApiUser {
  Id: number;
  Account: string;
  Email: string;
  Role: string;
}

interface LoginResponse {
  status: number;
  message: string;
  token: string;
  user: ApiUser;
}

export const useUserLogin = () => {
  async function login(loginData: UserLoginData) {
    return await useUserApiFetch<LoginResponse>('/api/v1/users/login', {
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
