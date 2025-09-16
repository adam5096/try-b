import type { Industry, JobTitle } from './program';

export interface ProgramCreationStep {
	Name: string;
	Description: string;
}

export interface ProgramCreationResponse {
	id: number;
	company_name: string;
	company_logo: string;
	company_cover: string;
	serial_num: string;
	name: string;
	intro: string;
	industry_id: number;
	job_title_id: number;
	address: string;
	address_map: string;
	contact_name: string;
	contact_phone: string;
	contact_email: string;
	min_people: number;
	max_people: number;
	publish_start_date: string;
	publish_duration_days: number;
	publish_end_date: string;
	program_start_date: string;
	program_end_date: string;
	program_duration_days: number;
	status_id: number;
	status_title: string;
	views_count: number;
	favorites_count: number;
	applied_count: number;
	score: number;
	days_left: number;
	total_views: number;
	weekly_views: number;
	daily_views: number;
	Industry: Industry;
	JobTitle: JobTitle;
	Status: null;
	Images: string[];
	Steps: ProgramCreationStep[];
}
