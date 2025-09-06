import { useCompanyApiFetch } from '~/composables/api/company/useCompanyApiFetch';

export interface UploadProgramImagesResponseItem {
  id: number;
  programplan_id: number;
  img_path: string;
  created_at: string;
}

export interface UploadProgramImagesResponse {
  latest_programplan_id: number;
  uploaded_files: UploadProgramImagesResponseItem[];
}

export async function uploadProgramImages(programId: number, files: File[]) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('file', file);
  }

  const { data, error } = await useCompanyApiFetch<UploadProgramImagesResponse>(`/api/v1/programs/${programId}/images`, {
    method: 'POST',
    body: formData,
  });

  if (error.value) {
    throw error.value;
  }

  return data.value as UploadProgramImagesResponse;
}


