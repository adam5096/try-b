// 單一計畫詳情的型別定義
// 基於 API response body 結構

export interface CompanyInfo {
	company_name: string;
	company_logo: string;
	company_cover: string;
}

export interface IndustryInfo {
	Id: number;
	Title: string;
}

export interface JobTitleInfo {
	Id: number;
	Title: string;
}

export interface StatusInfo {
	Id: number;
	Title: string;
}

export interface ProgramStep {
	Name: string;
	Description: string;
}

export interface ProgramDetail {
	// 主鍵與序號
	id: number;
	serial_num: string;

	// 公司相關資訊
	company_name: string;
	company_logo: string;
	company_cover: string;

	// 計畫基本資訊
	name: string;
	intro: string;
	industry_id: number;
	job_title_id: number;

	// 地點資訊
	address: string;
	address_map: string | null;

	// 聯絡資訊
	contact_name: string;
	contact_phone: string;
	contact_email: string;

	// 人數限制
	min_people: number;
	max_people: number;

	// 發布相關日期
	publish_start_date: string;
	publish_duration_days: number;
	publish_end_date: string;

	// 計畫執行日期
	program_start_date: string;
	program_end_date: string;
	program_duration_days: number;

	// 狀態資訊
	status_id: number;
	status_title: string | null;

	// 申請與統計
	applied_count: number;
	days_left: number;
	views_count: number;
	favorites_count: number;
	score: number;
	total_views: number;
	weekly_views: number;
	daily_views: number;

	// 關聯物件
	Industry: IndustryInfo;
	JobTitle: JobTitleInfo;
	Status: StatusInfo;

	// 圖片與步驟
	Images: string[];
	Steps: ProgramStep[];
}

// API 回應的型別
export interface ProgramDetailResponse {
	data: ProgramDetail;
	message?: string;
	success?: boolean;
}
