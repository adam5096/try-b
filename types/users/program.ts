// 基於 API response body 結構定義的型別

export interface Industry {
	Id: number;
	Title: string;
}

export interface JobTitle {
	Id: number;
	Title: string;
}

export interface Program {
	Id: number;
	Name: string;
	Intro: string;
	Address: string;
	Industry?: Industry;
	JobTitle?: JobTitle;
	PublishStartDate?: string;
	PublishEndDate?: string;
	ProgramStartDate: string;
	ProgramEndDate: string;
	CoverImage?: string;
	AppliedCount?: number;
	DaysLeft?: number;
	IsOngoing?: boolean | null;
	ViewsCount?: number;
	FavoritesCount?: number;
	Score?: number;
	imageLoaded?: boolean; // 圖片載入狀態
}

export interface ProgramsResponse {
	total: number;
	page: number;
	limit: number;
	items: Program[];
	message: string | null;
}

// 用於 API 請求的參數介面
export interface ProgramsQueryParams {
	page?: number;
	limit?: number;
	keyword?: string;
	industry?: string;
	jobType?: string;
	location?: string;
	sort?: string;
}
