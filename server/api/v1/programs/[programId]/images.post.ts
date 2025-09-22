import { getCookie } from 'h3';

export default defineEventHandler(async (event) => {
	const programId = getRouterParam(event, 'programId');

	if (!programId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing programId parameter',
		});
	}

	console.log('📤 後端收到圖片上傳請求，programId:', programId);

	// 讀取 FormData 請求體
	const formData = await readFormData(event);
	console.log('📤 FormData 內容:', Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? `${value.name} (${value.size} bytes)` : value]));

	// 手動建立認證 headers，避免自動轉發 content-type
	const token = getCookie(event, 'companyAuthToken');
	const authHeaders = {
		authorization: token ? `Bearer ${token}` : '',
		accept: '*/*',
	};
	console.log('📤 認證 headers:', authHeaders);

	try {
		// 使用 Node.js 原生 fetch 而不是 Nuxt 的 $fetch
		// 這可以避免 Nuxt 對 FormData 的額外處理
		const response = await fetch(`https://trybeta.rocket-coding.com/api/v1/programs/${programId}/images`, {
			method: 'POST',
			headers: authHeaders,
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();

		console.log('✅ 後端圖片上傳成功:', data);
		return data;
	}
	catch (error: any) {
		console.error('❌ 後端圖片上傳失敗:', error);

		// 提供更詳細的錯誤資訊
		if (error.statusCode === 502) {
			throw createError({
				statusCode: 502,
				statusMessage: '圖片上傳服務暫時維護中，請稍後再試',
				data: {
					originalError: 'Bad Gateway',
					message: '後端圖片伺服器暫時無法處理請求',
					programId,
				},
			});
		}
		else if (error.statusCode === 500) {
			throw createError({
				statusCode: 500,
				statusMessage: '圖片上傳服務內部錯誤，請稍後再試',
				data: {
					originalError: error.message,
					programId,
				},
			});
		}
		else {
			// 其他錯誤直接拋出
			throw createError({
				statusCode: error.statusCode || 500,
				statusMessage: error.message || '圖片上傳失敗',
				data: {
					originalError: error,
					programId,
				},
			});
		}
	}
});
