import { createApiHandler } from '~/server/utils/apiHandler';

/**
 * 藍新金流結帳結果查詢端點 (BFF 數據代理)
 *
 * 用途：前端頁面向後端取得結帳相關數據以渲染 UI
 *
 * 流程：
 * 1. 藍新金流 → 重定向瀏覽器到前端頁面 (已完成)
 * 2. 前端頁面 → 此端點 (POST 請求，包含 TradeInfo, TradeSha)
 * 3. 此端點 → 轉發到 ASP.NET 後端 result 端點 (POST 請求，body 包含敏感資料)
 * 4. ASP.NET 後端 → 返回結帳結果數據
 * 5. 此端點 → 返回結帳結果給前端頁面渲染 UI
 *
 * 設計理念：
 * - 此端點負責數據查詢，不涉及重定向
 * - 前端頁面負責 UI 展示和用戶互動
 * - 後端 API 負責資料處理和業務邏輯
 * - 後端已支援完整解析 1024*8 位元長度的 TradeInfo 資料
 * - 敏感資料透過 POST body 傳遞，確保安全性
 */
export default createApiHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { Status, TradeInfo, TradeSha, MerchantID } = body;

		console.log('[結帳結果查詢] 收到查詢請求:', {
			hasTradeInfo: !!TradeInfo,
			hasTradeSha: !!TradeSha,
			tradeInfoLength: TradeInfo?.length || 0,
			tradeShaLength: TradeSha?.length || 0,
		});

		// 驗證必要欄位
		if (!TradeInfo || !TradeSha) {
			console.error('[結帳結果查詢] 缺少必要欄位:', {
				hasTradeInfo: !!TradeInfo,
				hasTradeSha: !!TradeSha,
			});
			return {
				status: 'Error',
				message: '缺少必要的交易資料',
			};
		}

		console.log('[結帳結果查詢] 準備向 ASP.NET 後端查詢結帳結果:', {
			tradeInfoLength: TradeInfo.length,
			tradeInfoBits: TradeInfo.length * 8,
			tradeShaLength: TradeSha.length,
			backendUrl: 'https://trybeta.rocket-coding.com/api/v1/payments/result',
			note: '後端已支援完整解析 1024*8 位元資料，OrderNo 將由後端 API 自行提取',
		});

		// 向 ASP.NET 後端查詢結帳結果
		const backendResultUrl = 'https://trybeta.rocket-coding.com/api/v1/payments/result';

		try {
			// 轉發 POST 請求到後端查詢結帳結果
			const response = await $fetch(backendResultUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					TradeInfo: TradeInfo,
					TradeSha: TradeSha,
				},
			});

			console.log('[結帳結果查詢] 後端回應:', response);

			// 直接返回後端的結帳結果給前端
			return response;
		}
		catch (queryError) {
			console.error('[結帳結果查詢] 查詢失敗:', queryError);
			// 查詢失敗時返回錯誤訊息
			return {
				status: 'Error',
				message: '查詢結帳結果失敗',
				error: queryError instanceof Error ? queryError.message : 'Unknown error',
			};
		}
	}
	catch (error) {
		console.error('[結帳結果查詢] 處理錯誤:', error);

		// 記錄詳細錯誤資訊
		console.log('[結帳結果查詢] 錯誤詳情:', {
			errorType: error instanceof Error ? error.constructor.name : typeof error,
			errorMessage: error instanceof Error ? error.message : String(error),
			timestamp: new Date().toISOString(),
		});

		// 發生錯誤時返回錯誤訊息
		return {
			status: 'Error',
			message: '處理結帳結果查詢時發生錯誤',
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
});
