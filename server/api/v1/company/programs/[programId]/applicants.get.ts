export default defineEventHandler(async (event) => {
  // 從路由參數中獲取 programId
  const programId = getRouterParam(event, 'programId');

  if (!programId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Program ID is required',
    });
  }

  // 模擬的申請者數據
  const applicants = [
    {
      id: 1,
      name: '林小美',
      school: '台灣大學',
      major: '資訊工程學系',
      applyDate: '2025/07/20',
      status: '待審核',
      statusTag: 'warning',
    },
    {
      id: 2,
      name: '王大明',
      school: '成功大學',
      major: '電機工程學系',
      applyDate: '2025/07/21',
      status: '已通過',
      statusTag: 'success',
      approveDate: '2025/07/25',
    },
    {
      id: 3,
      name: '張雅琪',
      school: '交通大學',
      major: '資訊管理學系',
      applyDate: '2025/07/22',
      status: '已拒絕',
      statusTag: 'danger',
      approveDate: '2025/07/26',
    },
    {
      id: 4,
      name: '李宗翰',
      school: '清華大學',
      major: '動力機械工程學系',
      applyDate: '2025/07/23',
      status: '待審核',
      statusTag: 'warning',
    },
    {
      id: 5,
      name: '陳怡君',
      school: '政治大學',
      major: '企業管理學系',
      applyDate: '2025/07/24',
      status: '已通過',
      statusTag: 'success',
      approveDate: '2025/07/27',
    },
  ];

  // 在真實情境中，您會在這裡根據 programId 從資料庫查詢資料
  // 例如: return await db.applicants.find({ where: { programId } });

  return {
    applicants,
  };
});
