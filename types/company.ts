export interface CompanyRegisterForm {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyPerson: string;
  companyPersonPhone: string;
  companyUrl: string;
  companyLogo: string;
  companyCat: string;
  companyIntro: string;
}

export interface CompanyUser {
  Id: number;
  Account: string;
  Email: string;
  Role: 'Company';
  NickName?: string;
}

export interface LoginData {
  account: string;
  psd: string;
}

export interface CompanyLoginResponse {
  status: number;
  message: string;
  token: string;
  user: CompanyUser;
}
