import { createApiHandler } from '~/server/utils/apiHandler';

/**
 * 藍新金流 ReturnURL 端點 (簡化版)
 * 接收藍新金流付款完成後的瀏覽器重定向 POST 請求
 *
 * 簡化策略：
 * - 移除解密邏輯，避免後端連線問題
 * - 直接重定向到前端，讓前端處理查詢
 * - 保持必要的參數驗證和錯誤處理
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

		// 將 TradeInfo 和 TradeSha 編碼後傳遞到 success 頁面
		// 讓前端可以通過這些參數查詢結帳結果
		const encodedTradeInfo = encodeURIComponent(TradeInfo);
		const encodedTradeSha = encodeURIComponent(TradeSha);

		console.log('[藍新金流 ReturnURL] 準備重定向到 success 頁面:', {
			status: Status,
			hasOrderNum: !!orderNum,
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
