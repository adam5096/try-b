export interface CompanyPlan {
  planName: string;
  status: 'active' | 'expired' | 'cancelled';
  period: {
    startDate: string;
    endDate: string;
  };
  usageQuota: {
    limit: number;
    used: number;
    remaining: number;
  };
}
