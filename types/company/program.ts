export interface Industry {
  Id: number;
  Title: string;
}

export interface JobTitle {
  Id: number;
  Title: string;
}

export interface ProgramStep {
  Id: number;
  Name: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// export interface Program {
//   Id: number;
//   Name: string;
//   Intro: string;
//   Industry: Industry;
//   JobTitle: JobTitle;
//   PublishStartDate: string;
//   PublishEndDate: string;
//   ProgramStartDate: string;
//   ProgramEndDate: string;
//   Steps: ProgramStep[];
// }

export interface Program {
  Id: number;
  Name: string;
  StatusTitle: string;
  applied_count: number;
  views: number; // 假設 views 欄位 API 會提供
  PublishStartDate: string;
  ProgramEndDate: string;
}

export interface ProgramsResponse {
  total: number;
  page: number;
  limit: number;
  items: Program[];
  message: string | null;
}

export interface ProgramStepPayload {
  name: string;
  description: string;
}

export interface CreateProgramPayload {
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
  program_start_date: string;
  program_end_date: string;
  steps: ProgramStepPayload[];
  images: string[];
}