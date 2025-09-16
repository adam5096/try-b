// 用戶評價相關的類型定義

export type ReviewStatus = '審核中' | '系統已通過' | '系統已拒絕' | '人工已通過' | '人工已拒絕' | '待處理' | '已發布' | '全部通過' | '全部拒絕' | '未評價';

export interface ReviewItem {
	program_id: number;
	status_id: number;
	score: number;
	comment: string | null;
	serial_num: string;
	program_name: string;
	program_start_date: string;
	program_end_date: string;
	company_name: string;
	company_logo: string;
	evaluation_at: string;
}

export interface CommentsQueryParams {
	page?: number;
	limit?: number;
	status?: ReviewStatus[];
	sort?: 'newest' | 'oldest';
}

// 修正：根據 API 規格書，回應直接是 ReviewItem 陣列
export interface CommentsResponse {
	TotalCount: number;
	Page: number;
	Limit: number;
	Data: ReviewItem[];
}

// 評價提交相關類型
export interface SubmitEvaluationPayload {
	score: number;
	comment: string;
}

// 修改評價成功回應
export interface SubmitEvaluationSuccessResponse {
	ProgramName: string;
	ProgramStartDate: string;
	ProgramEndDate: string;
	CompanyName: string;
	Score: number;
	Comment: string;
	SerialNum: string;
	AiStatus: number;
}

// 修改評價錯誤回應
export interface SubmitEvaluationErrorResponse {
	Message: string;
}

// 修改評價回應（成功或錯誤）
export type SubmitEvaluationResponse = SubmitEvaluationSuccessResponse | SubmitEvaluationErrorResponse;
