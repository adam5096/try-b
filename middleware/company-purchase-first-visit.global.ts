export default defineNuxtRouteMiddleware((to) => {
	// 僅處理公司端方案列表頁
	if (to.name !== 'company-purchase-index') return;

	const firstVisitFlag = useCookie<boolean>('company_purchase_first_visit_done', {
		default: () => false,
		sameSite: 'lax',
	});

	if (!firstVisitFlag.value) {
		const planStore = useCompanyPlanStore();
		planStore.resetPaid();
		firstVisitFlag.value = true;
	}
});
