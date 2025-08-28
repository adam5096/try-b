// 基於 API response body 結構定義的型別

export interface Industry {
  Id: number;
  Title: string;
}

export interface JobTitle {
  Id: number;
  Title: string;
}

export interface ProgramStep {
  Name: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Program {
  Id: number;
  ApplicationId?: number; // 新增：申請 ID
  Name?: string; // 可選：名稱
  ProgramName: string; // 主要名稱欄位
  Intro: string;
  Address: string;
  Industry?: Industry; // 可選：產業資訊
  JobTitle?: JobTitle; // 可選：職位資訊
  PublishStartDate?: string; // 可選：發布開始日期
  PublishEndDate?: string; // 可選：發布結束日期
  ProgramStartDate: string;
  ProgramEndDate: string;
  CoverImage?: string; // 可選：封面圖片
  Steps?: ProgramStep[]; // 可選：計畫步驟
  AppliedCount?: number; // 可選：已申請人數
  DaysLeft?: number; // 可選：剩餘天數
  IsOngoing?: boolean | null; // 可選：是否進行中
  ViewsCount?: number; // 可選：瀏覽次數
  FavoritesCount?: number; // 可選：收藏次數
  Score?: number; // 可選：評分
  SubmitAt?: string; // 新增：提交時間
  Status?: string; // 新增：計畫狀態
  CompanyName?: string; // 新增：公司名稱
  MaxParticipants?: number; // 新增：最大參與人數
  MinParticipants?: number; // 新增：最小參與人數
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
