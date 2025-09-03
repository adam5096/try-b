// 有效方案的回應格式
export interface ActivePlan {
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

// 無效方案的回應格式
export interface NoPlan {
  status: 'no_plan';
  message: string;
}

// 聯合型別：支援有效方案和無效方案兩種情況
export type CompanyPlan = ActivePlan | NoPlan;

// 型別守衛函數：檢查是否為有效方案
export function isActivePlan(plan: CompanyPlan): plan is ActivePlan {
  return plan.status !== 'no_plan';
}
