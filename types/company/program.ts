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
}

export interface ProgramImage {
  Id: number;
  ImgPath: string;
}

export interface ProgramStatus {
  Id: number;
  Title: string;
}

export interface ProgramStatistics {
  TotalApplicants: number;
  ReviewedCount: number;
  PendingCount: number;
}

export interface ProgramViews {
  TotalViews: number;
  WeeklyViews: number;
  DailyViews: number;
}

export interface Program {
  Id: number;
  Name: string;
  Intro: string;
  Industry: Industry;
  JobTitle: JobTitle;
  address: string; // API schema shows lowercase, but template uses uppercase. Let's align with what template expects.
  Address: string;
  contact_name: string; // API schema shows lowercase
  ContactName: string; // Aligning with PascalCase convention from other fields
  contact_phone: string; // API schema shows lowercase
  ContactPhone: string; // Aligning with PascalCase
  contact_email: string; // API schema shows lowercase
  ContactEmail: string; // Aligning with PascalCase
  min_people: number;
  MinPeople: number;
  max_people: number;
  MaxPeople: number;
  publish_start_date: string;
  PublishStartDate: string;
  publish_duration_days: number;
  PublishDurationDays: number;
  publish_end_date: string;
  PublishEndDate: string;
  program_start_date: string;
  ProgramStartDate: string;
  program_end_date: string;
  ProgramEndDate: string;
  program_duration_days: number;
  ProgramDurationDays: number;
  status_id: number;
  status_title: string;
  Status: ProgramStatus;
  applied_count: number;
  Images: ProgramImage[];
  Steps: ProgramStep[];
  Statistics: ProgramStatistics;
  Views: ProgramViews;
}

export interface ProgramsListItem {
  Id: number;
  Name: string;
  StatusTitle: string;
  applied_count: number;
  views: number;
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