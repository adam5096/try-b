import { createApiHandler } from '../../../utils/apiHandler';
import { getForwardHeaders } from '../../../utils/headers';

export default createApiHandler(async (event) => {
	try {
		console.log('BFF 開始處理企業註冊請求...');

		// 檢查請求大小限制（Hobby 計劃限制）
		const contentLength = getHeader(event, 'content-length');
		if (contentLength && parseInt(contentLength) > 4.5 * 1024 * 1024) { // 4.5MB 限制
			throw createError({
				statusCode: 413,
				statusMessage: 'Payload Too Large',
				message: '檔案大小超過限制，請壓縮圖片後再試',
			});
		}

		// 對於檔案上傳，我們需要直接轉發原始的請求體
		// 使用 readRawBody 來保持 multipart/form-data 的完整性
		const body = await readRawBody(event);
		console.log('BFF 接收到的原始請求體長度:', body?.length);

		if (!body || body.length === 0) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: '請求體為空',
			});
		}

		// 使用統一的 headers 處理（註冊不需要 Authorization）
		const headers = getForwardHeaders(event);
		
		// 確保 Content-Type 正確傳遞
		const contentType = getHeader(event, 'content-type');
		if (contentType) {
			headers['content-type'] = contentType;
		}
		
		// 確保 Content-Length 正確傳遞
		if (contentLength) {
			headers['content-length'] = contentLength;
		}
		
		console.log('BFF 轉發的 headers:', headers);

		// 透過 Nitro 的 proxy 設定轉發到真實後端
		// 規則：必須包含 api 並使用 /api-proxy 進行代理
		console.log('BFF 嘗試轉發到: /api-proxy/api/v1/company');

		const data = await event.$fetch('/api-proxy/api/v1/company', {
			method: 'POST',
			headers,
			body,
			// 根據環境設定不同的超時時間
			timeout: process.env.NODE_ENV === 'development' ? 25000 : 8000, // 開發環境 25 秒，生產環境 8 秒
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

		// 處理超時錯誤
		if (error.message?.includes('timeout') || error.message?.includes('TIMEOUT')) {
			throw createError({
				statusCode: 504,
				statusMessage: 'Gateway Timeout',
				message: '請求處理時間過長，請壓縮圖片後再試',
			});
		}

		throw error;
	}
});
