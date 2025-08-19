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
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface LoginData {
  account: string;
  psd: string;
}
