import { createApiHandler } from '~/server/utils/apiHandler';
import { createAuthHeaders } from '~/server/utils/headers';

export default createApiHandler(async (event) => {
	const programId = getRouterParam(event, 'programId');

	if (!programId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing programId parameter',
		});
	}

	// 讀取 FormData 請求體
	const formData = await readFormData(event);

	// 使用統一的認證 headers 處理
	const headers = createAuthHeaders(event, 'companyAuthToken');

	try {
		// 根據規格書，正確的 API 路徑應該是 /api/v1/programs/{program_id}/images
		// 透過 Nitro 的 proxy 設定轉發到真實後端
		const data = await event.$fetch(`/api-proxy/api/v1/programs/${programId}/images`, {
			method: 'POST',
			headers: {
				...headers,
				// 確保 Content-Type 正確設定
				'Content-Type': 'multipart/form-data',
			},
			body: formData,
			// 設定較長的超時時間
			timeout: 60000, // 60 秒
		});

		return data;
	}
	catch (error) {
		console.error('❌ 後端圖片上傳失敗:', error);
		throw error;
	}
});
