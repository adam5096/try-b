export default defineEventHandler((event) => {
  const companyId = getRouterParam(event, 'companyId');

  if (!companyId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Company ID is required',
    });
  }

  // 模擬回傳該公司的計畫列表
  const mockPrograms = [
    {
      id: 'prj-001',
      title: '數位行銷實習體驗計畫',
      status: '已發布',
      applicants: 42,
      views: 358,
      startDate: '2025/08/15',
      endDate: '2025/08/17',
    },
    {
      id: 'prj-002',
      title: '軟體工程師一日工作坊',
      status: '審核中',
      applicants: 15,
      views: 210,
      startDate: '2025/09/01',
      endDate: '2025/09/01',
    },
    {
      id: 'prj-003',
      title: 'UI/UX 設計師實戰營',
      status: '已通過',
      applicants: 33,
      views: 450,
      startDate: '2025/09/10',
      endDate: '2025/09/12',
    },
    {
      id: 'prj-004',
      title: '產品經理養成計畫',
      status: '已拒絕',
      applicants: 20,
      views: 180,
      startDate: '2025/10/05',
      endDate: '2025/10/07',
    },
  ];

  return {
    status: 'success',
    data: mockPrograms,
  };
});
