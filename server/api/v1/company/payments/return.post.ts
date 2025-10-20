import { createApiHandler } from '~/server/utils/apiHandler';

/**
 * 藍新金流重定向端點 (Return URL Handler)
 *
 * 用途：接收藍新金流的 POST 回調並重定向到前端成功頁面
 *
 * 流程：
 * 1. 藍新金流 → POST 到此端點 (包含 Status, TradeInfo, TradeSha)
 * 2. 此端點 → 重定向瀏覽器到 success.vue 頁面 (帶 URL 參數)
 * 3. success.vue → 使用 URL 參數查詢結帳結果並渲染 UI
 *
 * 設計理念：
 * - 此端點負責重定向，不處理業務邏輯
 * - 將敏感資料 (TradeInfo, TradeSha) 透過 URL 參數傳遞給前端
 * - 前端頁面負責查詢數據和 UI 渲染
 * - 保持藍新金流標準的 Return URL 行為
 */
export default createApiHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { Status, TradeInfo, TradeSha, MerchantID } = body;


		// 驗證必要欄位
		if (!TradeInfo || !TradeSha) {
			console.error('[重定向處理] 缺少必要欄位:', {
				hasTradeInfo: !!TradeInfo,
				hasTradeSha: !!TradeSha,
			});

			// 重定向到錯誤頁面
			const errorUrl = `/company/purchase/success?error=invalid_callback&status=${Status || 'UNKNOWN'}`;
			return sendRedirect(event, errorUrl, 302);
		}

		// 構建重定向 URL，將必要參數編碼後傳遞給前端
		const redirectParams = new URLSearchParams({
			status: Status || 'UNKNOWN',
			tradeInfo: encodeURIComponent(TradeInfo),
			tradeSha: encodeURIComponent(TradeSha),
		});

		// 如果有 MerchantID，也一併傳遞
		if (MerchantID) {
			redirectParams.set('merchantID', MerchantID);
		}

		const successUrl = `/company/purchase/success?${redirectParams.toString()}`;


		// 重定向到前端成功頁面
		return sendRedirect(event, successUrl, 302);
	}
	catch (error) {
		console.error('[重定向處理] 處理錯誤:', error);

		// 發生錯誤時重定向到錯誤頁面
		const errorUrl = `/company/purchase/success?error=processing_error&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`;
		return sendRedirect(event, errorUrl, 302);
	}
});
