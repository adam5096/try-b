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

  // 取得 company auth token 來設定 headers
  const tokenCookie = useCookie<string | null>('companyAuthToken');
  const headers: Record<string, string> = {};
  
  if (tokenCookie.value) {
    headers.authorization = `Bearer ${tokenCookie.value}`;
  }

  const data = await $fetch<UploadProgramImagesResponse>(`/api/v1/company/upload-program-images/${programId}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return data;
}


