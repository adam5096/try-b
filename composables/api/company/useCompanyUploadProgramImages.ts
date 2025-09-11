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

  // 使用統一的 useFetch，token 處理由 Server API 層負責
  const { data } = await useFetch<UploadProgramImagesResponse>(`/v1/company/upload-program-images/${programId}`, {
    method: 'POST',
    baseURL: '/api',
    body: formData,
  });

  return data.value;
}


