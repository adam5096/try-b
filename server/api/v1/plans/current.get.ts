import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
  // 根據 @e company 5 當前企業方案 筆記中的規格回傳模擬資料
  return {
    planName: '尊榮企業夥伴方案', // 方案名稱
    status: 'active', // 當前狀態 (active, expired, cancelled)
    period: {
      startDate: '2025-07-01', // 方案啟用日
      endDate: '2025-08-01', // 方案到期日
    },
    usageQuota: {
      limit: 10, // 人數上限 (limit 或 total)
      used: 5, // 已使用人數
      remaining: 5, // 剩餘可用人數
    },
  };
});
