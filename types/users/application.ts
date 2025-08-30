export interface SubmitApplicationPayload {
	participant_id: number;
	participants_count: number;
	resume_type: 'existing resume' | 'new resume';
	resume_id: number;
	motivation_content: string;
	agree_terms: boolean;
}

export interface SubmitApplicationSuccess {
	success: boolean;
	application_number: string;
	message: string;
}

export interface SubmitApplicationAlreadyAppliedError {
	Message: string;
}

export type SubmitApplicationResponse = SubmitApplicationSuccess;
