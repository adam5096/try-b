import { createApiHandler } from '~/server/utils/apiHandler';
import { createAuthHeaders } from '~/server/utils/headers';

export default createApiHandler(async (event) => {
	const companyId = getRouterParam(event, 'companyId');
	const programId = getRouterParam(event, 'programId');
	const participantId = getRouterParam(event, 'participantId');

	if (!companyId || !programId || !participantId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Missing companyId, programId, or participantId parameter',
		});
	}

	// 使用統一的 headers 處理，包含認證 token
	const headers = createAuthHeaders(event, 'companyAuthToken');

	// 透過 Nitro 的 proxy 設定轉發到真實後端
	// 規則：必須包含 api 並使用 /api-proxy 進行代理
	const data = await event.$fetch(`/api-proxy/api/v1/company/${companyId}/programs/${programId}/applications/${participantId}`, {
		method: 'GET',
		headers,
	});

	return data;
});
