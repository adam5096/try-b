export interface AllPlan {
	id: number;
	name: string;
	description: string | null;
	price: number;
	duration_days: number;
	max_participants: number;
	created_at: string;
	updated_at: string;
}
