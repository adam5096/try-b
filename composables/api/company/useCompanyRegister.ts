import type {
	CompanyRegisterRequest,
	CompanyRegisterSuccessResponse,
	CompanyRegisterErrorResponse,
} from '~/types/company/company';

// 企業註冊 composable
export const useCompanyRegister = () => {
	const register = async (data: CompanyRegisterRequest, files?: { logo?: File | null, cover?: File | null, environment?: File | null }) => {
		try {
			console.log('🚀 開始註冊請求... (v3.0 - 透過 BFF 代理)');

			// 建立 FormData 物件
			const formData = new FormData();

			// 將所有表單資料包裝成 dto 物件
			formData.append('dto', JSON.stringify(data));
			console.log('表單資料已添加到 FormData');

			// 添加檔案到 FormData
			if (files) {
				if (files.logo) {
					formData.append('logo', files.logo);
					console.log('Logo 檔案已添加:', files.logo.name);
				}
				if (files.cover) {
					formData.append('cover', files.cover);
					console.log('Cover 檔案已添加:', files.cover.name);
				}
				if (files.environment) {
					formData.append('environment', files.environment);
					console.log('Environment 檔案已添加:', files.environment.name);
				}
			}

			console.log('開始發送請求到 BFF...');
			const startTime = Date.now();

			// 使用 BFF 端點，統一經過代理處理
			const response = await $fetch<CompanyRegisterSuccessResponse>('/api/v1/company', {
				method: 'POST',
				body: formData, // 使用 FormData 物件
			});

			const endTime = Date.now();
			console.log(`請求完成，耗時: ${endTime - startTime}ms`);

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
