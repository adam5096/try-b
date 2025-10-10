import { createApiHandler } from '~/server/utils/apiHandler';

/**
 * 藍新金流 ReturnURL 端點 (BFF 代理重定向)
 *
 * 用途：處理藍新金流付款完成後的瀏覽器重定向請求
 *
 * 流程：
 * 1. 藍新金流 → 此端點 (POST 請求，包含 TradeInfo, TradeSha, Status)
 * 2. 此端點 → 重定向到 ASP.NET 後端 result 端點 (GET 請求，URL 參數)
 * 3. ASP.NET 後端 → 處理付款結果並重定向到前端 success 頁面
 * 4. 前端頁面 → 渲染完整付款結果 UI
 *
 * 設計理念：
 * - 此端點只負責重定向，不做業務邏輯處理
 * - 前端頁面負責 UI 展示和資料請求
 * - 後端 API 負責資料處理和業務邏輯
 * - 後端已支援完整解析 1024*8 位元長度的 TradeInfo 資料
 * - 避免在 URL 中暴露敏感資料，改為透過 API 請求取得
 */
export default createApiHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { Status, TradeInfo, TradeSha, MerchantID } = body;

		console.log('[藍新金流 ReturnURL] 收到回調:', {
			Status,
			MerchantID,
			hasTradeInfo: !!TradeInfo,
			hasTradeSha: !!TradeSha,
		});

		// 驗證必要欄位
		if (!Status || !TradeInfo || !TradeSha) {
			console.error('[藍新金流 ReturnURL] 缺少必要欄位:', {
				hasStatus: !!Status,
				hasTradeInfo: !!TradeInfo,
				hasTradeSha: !!TradeSha,
			});
			return sendRedirect(event, '/company/purchase/success?error=invalid_callback');
		}

		// 純代理模式：不在此處處理 OrderNo 提取
		// 將 TradeInfo 和 TradeSha 傳遞給前端，讓後端 API 處理解密
		console.log('[藍新金流 ReturnURL] 採用純代理模式，OrderNo 提取由後端 API 負責');

		// 將 TradeInfo 和 TradeSha 編碼後傳遞到 success 頁面
		// 讓前端可以通過這些參數查詢結帳結果
		const encodedTradeInfo = encodeURIComponent(TradeInfo);
		const encodedTradeSha = encodeURIComponent(TradeSha);

		console.log('[藍新金流 ReturnURL] 準備重定向到 ASP.NET 後端 result 端點:', {
			status: Status,
			tradeInfoLength: TradeInfo.length,
			tradeInfoBits: TradeInfo.length * 8,
			tradeShaLength: TradeSha.length,
			backendUrl: 'https://trybeta.rocket-coding.com/api/v1/payments/result',
			note: '後端已支援完整解析 1024*8 位元資料，OrderNo 將由後端 API 自行提取',
		});

		// 重定向到 ASP.NET 後端 result 端點
		// 根據 e-comp-12-3 規格書，應該重定向到外部後端處理
		const backendResultUrl = `https://trybeta.rocket-coding.com/api/v1/payments/result?status=${Status}&tradeInfo=${encodedTradeInfo}&tradeSha=${encodedTradeSha}`;
		return sendRedirect(event, backendResultUrl);
	}
	catch (error) {
		console.error('[藍新金流 ReturnURL] 處理錯誤:', error);

		// 記錄詳細錯誤資訊
		console.log('[藍新金流 ReturnURL] 錯誤詳情:', {
			errorType: error instanceof Error ? error.constructor.name : typeof error,
			errorMessage: error instanceof Error ? error.message : String(error),
			timestamp: new Date().toISOString(),
		});

		// 發生錯誤時也重定向到 success 頁面
		return sendRedirect(event, '/company/purchase/success?error=processing_error');
	}
});
