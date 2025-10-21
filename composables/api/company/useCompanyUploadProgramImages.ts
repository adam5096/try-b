export interface UploadProgramImagesResponseItem {
	id: number
	programplan_id: number
	img_path: string
	created_at: string
}

export interface UploadProgramImagesResponse {
	latest_programplan_id: number
	uploaded_files: UploadProgramImagesResponseItem[]
}

export async function uploadProgramImages(programId: number, files: File[]) {
	const formData = new FormData();
	for (const file of files) {
		formData.append('file', file);
	}

	try {
		// 使用 $fetch 進行圖片上傳，token 處理由 Server API 層負責
		// 根據 Postman 截圖，正確的 API 路徑應該是 /api/v1/programs/{programId}/images
		const data = await $fetch<UploadProgramImagesResponse>(`/api/v1/programs/${programId}/images`, {
			method: 'POST',
			body: formData,
			// 設定較短的超時時間，避免長時間等待
			timeout: 30000, // 30 秒
		});

		return data;
	}
	catch (error) {
		console.error('❌ 圖片上傳失敗:', error);

		// 提供更詳細的錯誤資訊
		if (error instanceof Error) {
			if (error.message.includes('timeout') || error.message.includes('TimeoutError')) {
				throw new Error('上傳超時：圖片上傳時間過長，請檢查網路連線或嘗試壓縮圖片');
			}
			else if (error.message.includes('502') || error.message.includes('Bad Gateway') || error.message.includes('圖片上傳服務暫時維護中')) {
				throw new Error('502 Bad Gateway：圖片上傳服務暫時維護中，請稍後再試');
			}
			else if (error.message.includes('413') || error.message.includes('Payload Too Large')) {
				throw new Error('檔案過大：圖片檔案大小超過限制，請壓縮後再上傳');
			}
		}

		throw error;
	}
}
