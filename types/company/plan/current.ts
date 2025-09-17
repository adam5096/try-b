// 有效方案的回應格式
export interface ActivePlan {
	plan_id: number
	status_id: number
	status_name: string
	plan_name: string
	plan_price: number
	plan_duration_days: number
	max_participants: number
	used_participants: number
	remaining_people: number
	start_date: string
	end_date: string
	remaining_days: number
}

// 無效方案的回應格式
export interface NoPlan {
	status: 'no_plan'
	message: string
}

// 聯合型別：支援有效方案和無效方案兩種情況
export type CompanyPlan = ActivePlan | NoPlan;

// 型別守衛函數：檢查是否為有效方案
export function isActivePlan(plan: CompanyPlan): plan is ActivePlan {
	return 'plan_id' in plan;
}
