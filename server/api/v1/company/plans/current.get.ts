import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  // 模擬回傳當前企業方案
  const currentPlan = {
    planName: '尊榮企業夥伴方案',
    status: 'active',
    period: {
      startDate: '2025-07-01',
      endDate: '2025-08-01',
    },
    usageQuota: {
      limit: 10,
      used: 5,
      remaining: 5,
    },
  };

  return {
    status: 'success',
    data: currentPlan,
  };
});
