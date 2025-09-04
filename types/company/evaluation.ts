export interface ParticipantIdentity {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyEvaluationItem {
  Id: number;
  ParticipantName: string;
  ParticipantIdentity: ParticipantIdentity;
  ParticipantAge: number;
  ProgramName: string;
  ProgramPlanId: number;
  Score: number;
  Comment: string;
  EvaluationDate: string;
}

export interface CompanyEvaluationListResponse {
  TotalCount: number;
  Page: number;
  Limit: number;
  Data: CompanyEvaluationItem[];
}


