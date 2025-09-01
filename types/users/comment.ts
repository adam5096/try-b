// 用戶評價相關的類型定義

export type ReviewStatus = '審核中' | '系統已通過' | '系統已拒絕' | '人工已通過' | '人工已拒絕' | '待處理' | '已發布' | '全部通過' | '全部拒絕' | '未評價';

export interface ReviewItem {
  status_id: number;
  score: number;
  comment: string | null;
  serial_num: string;
  program_name: string;
  program_start_date: string;
  program_end_date: string;
  company_name: string;
  company_logo: string;
  evaluation_date: string;
}

export interface CommentsQueryParams {
  page?: number;
  limit?: number;
  status?: ReviewStatus[];
  sort?: 'newest' | 'oldest';
}

export interface CommentsResponse {
  total: number;
  page: number;
  limit: number;
  data: ReviewItem[];
}

// 評價提交相關類型
export interface SubmitEvaluationPayload {
  score: number;
  comment: string;
}

export interface SubmitEvaluationResponse {
  success: boolean;
  message?: string;
}
