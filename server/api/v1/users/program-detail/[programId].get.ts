import { createApiHandler } from '~/server/utils/apiHandler';
import { getForwardHeaders } from '~/server/utils/headers';

export default createApiHandler(async (event) => {
	const programId = getRouterParam(event, 'programId');

	if (!programId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing programId parameter',
		});
	}

	// 使用統一的 headers 處理（程式詳情可能需要認證）
	const headers = getForwardHeaders(event);

	// 透過 Nitro 的 proxy 設定轉發到真實後端
	// 規則：必須包含 api 並使用 /api-proxy 進行代理
	const data = await event.$fetch(`/api-proxy/api/v1/programs/${programId}`, {
		method: 'GET',
		headers,
	});

	return data;
});
