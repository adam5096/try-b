import { createApiHandler } from '~/server/utils/apiHandler';

/**
 * 藍新金流 ReturnURL 端點 (BFF 代理重定向)
 *
 * 用途：當 ASP.NET 後端需要重定向到前端時，可以透過此端點
 *
 * 流程：
 * 1. 藍新金流 → ASP.NET 後端 Return URL
 * 2. ASP.NET 後端 → BFF return.post.ts (此檔案)
 * 3. BFF → 前端 success 頁面
 *
 * 這樣可以避免跨網域重定向的問題
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

		// 檢查是否有查詢參數中的訂單號（備用方案）
		const query = getQuery(event);
		const orderNum = query.orderNum || query.order;

		// 純代理模式：不在此處處理 OrderNo 提取
		// 將 TradeInfo 和 TradeSha 傳遞給前端，讓後端 API 處理解密
		console.log('[藍新金流 ReturnURL] 採用純代理模式，OrderNo 提取由後端 API 負責');

		// 將 TradeInfo 和 TradeSha 編碼後傳遞到 success 頁面
		// 讓前端可以通過這些參數查詢結帳結果
		const encodedTradeInfo = encodeURIComponent(TradeInfo);
		const encodedTradeSha = encodeURIComponent(TradeSha);

		console.log('[藍新金流 ReturnURL] 準備重定向到 success 頁面:', {
			status: Status,
			hasOrderNum: !!orderNum,
			orderNum: orderNum || 'null',
			tradeInfoLength: TradeInfo.length,
			tradeShaLength: TradeSha.length,
		});

		// 重定向到 success 頁面
		if (orderNum) {
			return sendRedirect(event, `/company/purchase/success?order=${orderNum}&status=${Status}&tradeInfo=${encodedTradeInfo}&tradeSha=${encodedTradeSha}`);
		}
		else {
			return sendRedirect(event, `/company/purchase/success?status=${Status}&tradeInfo=${encodedTradeInfo}&tradeSha=${encodedTradeSha}`);
		}
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
