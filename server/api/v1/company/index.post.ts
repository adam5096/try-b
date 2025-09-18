import { createApiHandler } from '../../../utils/apiHandler';
import { getForwardHeaders } from '../../../utils/headers';

export default createApiHandler(async (event) => {
	try {
		console.log('BFF 開始處理企業註冊請求...');

		// 對於檔案上傳，我們需要直接轉發原始的請求體
		// 使用 readRawBody 來保持 multipart/form-data 的完整性
		const body = await readRawBody(event);
		console.log('BFF 接收到的原始請求體長度:', body?.length);

		// 使用統一的 headers 處理（註冊不需要 Authorization）
		const headers = getForwardHeaders(event);
		console.log('BFF 轉發的 headers:', headers);

		// 透過 Nitro 的 proxy 設定轉發到真實後端
		// 規則：必須包含 api 並使用 /api-proxy 進行代理
		console.log('BFF 嘗試轉發到: /api-proxy/api/v1/company');

		const data = await event.$fetch('/api-proxy/api/v1/company', {
			method: 'POST',
			headers,
			body,
		});

		console.log('BFF 收到後端回應:', data);
		return data;
	}
	catch (error: any) {
		console.error('BFF 轉發錯誤:', error);
		console.error('錯誤詳情:', {
			message: error.message,
			statusCode: error.statusCode,
			statusMessage: error.statusMessage,
			data: error.data,
		});

		// 如果是代理錯誤，提供更詳細的錯誤資訊
		if (error.statusCode === 502) {
			throw createError({
				statusCode: 502,
				statusMessage: 'Bad Gateway',
				message: '後端服務暫時無法使用，請稍後再試',
			});
		}

		throw error;
	}
});
