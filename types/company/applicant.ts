export interface ProgramPlan {
	program_name: string;
	serial_num: string;
	program_start_date: string;
	program_end_date: string;
	program_duration_days: number;
	address: string;
}

export interface PortfolioFile {
	Id: number;
	title: string;
	portfolio_path: string;
	file_size: string;
}

export interface PastProgram {
	program_name: string;
	program_start_date: string;
	program_end_date: string;
	participation_status: string;
	cancel_reason: string | null;
	review_score: number;
}

export interface ApplicantDetail {
	review_status_id: number;
	review_status_name: string;
	name: string;
	phone: string;
	age: number;
	gender: string;
	identity_id: number;
	identity_name: string;
	address: string;
	email: string;
	headshot: string;
	participant_serial_num: string;
	school_name: string;
	major: string;
	status_id: number;
	status_name: string;
	review_count: number;
	average_score: number;
	program_plan: ProgramPlan;
	motivation_content: string;
	Skills: string[];
	PortfolioFiles: PortfolioFile[];
	past_programs: PastProgram[];
}
