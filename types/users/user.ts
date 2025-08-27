import type { CompanyUser } from './company';

// Based on the API spec for user registration and login
export interface User {
  id: number;
  name: string;
  account: string;
  email: string;
  role: 'Participant' | string; // Assuming 'Participant' is a possible role
  avatar?: string; // Optional avatar
  createdAt?: string;
  updatedAt?: string;
}

// Based on the request body for user registration API
export interface UserRegisterData extends UserLoginData {
  name: string;
  email: string;
}

// Based on the request body for user login API (assumed)
export interface UserLoginData {
  account: string;
  password: string;
}
