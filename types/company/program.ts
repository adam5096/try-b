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

export interface Program {
  Id: number;
  Name: string;
  Intro: string;
  Industry: Industry;
  JobTitle: JobTitle;
  PublishStartDate: string;
  PublishEndDate: string;
  ProgramStartDate: string;
  ProgramEndDate: string;
  Steps: ProgramStep[];
}

export interface ProgramsResponse {
  total: number;
  page: number;
  limit: number;
  items: Program[];
  message: string | null;
}
