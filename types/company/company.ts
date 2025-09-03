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
  companyId: number;
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

export interface CompanyImg {
  type: 'logo' | 'cover' | 'environment';
  img_path: string;
}

export interface CompanyContact {
  name: string;
  job_title: string;
  email: string;
  phone: string;
}

export interface CompanyProfile {
  name: string;
  industry_id: number;
  tax_id_num: string;
  address: string;
  website: string;
  intro: string;
  scale_id: number;
  account: string;
  email: string;
  CompanyContact: CompanyContact;
  CompanyImg: CompanyImg[];
}
