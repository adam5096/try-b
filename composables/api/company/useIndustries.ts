export interface BasicOptionItem {
  id: number;
  title: string;
}

// 取得產業清單
export const useIndustries = () => {
  // 取得 company auth token 來設定 headers
  const tokenCookie = useCookie<string | null>('companyAuthToken');
  
  return useFetch<BasicOptionItem[]>('/api/v1/company/industries', {
    key: 'company-industries',
    server: true,
    lazy: false,
    headers: computed(() => {
      const headers: Record<string, string> = {};
      if (tokenCookie.value) {
        headers.authorization = `Bearer ${tokenCookie.value}`;
      }
      return headers;
    }),
  });
};


