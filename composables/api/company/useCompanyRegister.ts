import type {
	CompanyRegisterRequest,
	CompanyRegisterSuccessResponse,
	CompanyRegisterErrorResponse,
} from '~/types/company/company';

// 企業註冊 composable
export const useCompanyRegister = () => {
	const register = async (data: CompanyRegisterRequest, files?: { logo?: File | null, cover?: File | null, environment?: File | null }) => {
		try {
			// 檢查檔案大小（適應 Vercel Hobby 計劃限制）
			const maxFileSize = 1.5 * 1024 * 1024; // 1.5MB 限制
			if (files) {
				if (files.logo && files.logo.size > maxFileSize) {
					throw new Error('Logo 檔案大小超過 1.5MB 限制，請壓縮後再上傳');
				}
				if (files.cover && files.cover.size > maxFileSize) {
					throw new Error('Cover 檔案大小超過 1.5MB 限制，請壓縮後再上傳');
				}
				if (files.environment && files.environment.size > maxFileSize) {
					throw new Error('Environment 檔案大小超過 1.5MB 限制，請壓縮後再上傳');
				}
			}

			// 建立 FormData 物件
			const formData = new FormData();

			// 將所有表單資料包裝成 dto 物件
			formData.append('dto', JSON.stringify(data));

			// 添加檔案到 FormData
			if (files) {
				if (files.logo) {
					formData.append('logo', files.logo);
				}
				if (files.cover) {
					formData.append('cover', files.cover);
				}
				if (files.environment) {
					formData.append('environment', files.environment);
				}
			}

			const startTime = Date.now();

			// 使用 BFF 端點，統一經過代理處理
			const response = await $fetch<CompanyRegisterSuccessResponse>('/api/v1/company', {
				method: 'POST',
				body: formData, // 使用 FormData 物件
				// 根據環境設定不同的超時時間
				timeout: process.env.NODE_ENV === 'development' ? 30000 : 8000, // 開發環境 30 秒，生產環境 8 秒
			});

			const endTime = Date.now();

			return {
				success: true,
				data: response,
				error: null,
			};
		}
		catch (error: any) {
			console.error('❌ 註冊請求失敗:', error);
			console.error('錯誤詳情:', {
				message: error.message,
				status: error.status,
				statusCode: error.statusCode,
				data: error.data,
			});

			// 處理 API 錯誤回應
			if (error.data && error.data.status === 400) {
				const errorData = error.data as CompanyRegisterErrorResponse;
				return {
					success: false,
					data: null,
					error: {
						message: errorData.message,
						errors: errorData.errors,
					},
				};
			}

			// 處理超時錯誤
			if (error.message?.includes('timeout') || error.message?.includes('TimeoutError') || error.statusCode === 504) {
				return {
					success: false,
					data: null,
					error: {
						message: process.env.NODE_ENV === 'development'
							? '請求處理時間過長，請檢查後端服務狀態'
							: '請求處理時間過長，請壓縮圖片後再試',
						errors: [],
					},
				};
			}

			// 處理檔案大小錯誤
			if (error.statusCode === 413) {
				return {
					success: false,
					data: null,
					error: {
						message: '檔案大小超過限制，請壓縮圖片後再試',
						errors: [],
					},
				};
			}

			// 處理其他錯誤
			return {
				success: false,
				data: null,
				error: {
					message: error.message || '註冊失敗，請稍後再試',
					errors: [],
				},
			};
		}
	};

	return {
		register,
	};
};
