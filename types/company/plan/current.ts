export interface CompanyPlan {
  plan_id: number;
  status_id: number;
  status_name: string;
  plan_name: string;
  plan_price: number;
  plan_duration_days: number;
  max_participants: number;
  used_participants: number;
  remaining_people: number;
  start_date: string;
  end_date: string;
  remaining_days: number;
}
