import { createApiHandler } from '~/server/utils/apiHandler';

/**
 * 藍新金流 ReturnURL 端點
 * 接收藍新金流付款完成後的瀏覽器重定向 POST 請求
 *
 * 根據藍新金流文件 4.2.2：
 * - ReturnURL 接收付款完成後的前景通知
 * - 數據通過 POST 表單提交
 * - 包含 Status, MerchantID, TradeInfo, TradeSha, Version
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
			console.error('[藍新金流 ReturnURL] 缺少必要欄位');
			// 即使驗證失敗，也重定向到 success 頁面讓用戶看到錯誤訊息
			return sendRedirect(event, '/company/purchase/success?error=invalid_callback');
		}

		// 解析 TradeInfo 需要後端解密，這裡我們從 TradeInfo 或查詢參數取得訂單編號
		// 根據藍新金流文件，訂單編號可能在 TradeInfo 解密後或作為獨立參數傳遞

		// 方案 A：如果藍新金流在 URL 查詢參數中包含訂單號
		const query = getQuery(event);
		const orderNum = query.orderNum || query.order;

		// 方案 B：嘗試從 TradeInfo 解密取得訂單號
		// 根據藍新金流文件，TradeInfo 包含加密的訂單資訊
		if (!orderNum && TradeInfo) {
			try {
				// 調用後端 API 解密 TradeInfo 取得訂單號
				const decryptResponse = await event.$fetch('/api-proxy/api/v1/payments/decrypt', {
					method: 'POST',
					headers: getForwardHeaders(event),
					body: { TradeInfo, TradeSha },
				});

				if (decryptResponse && decryptResponse.OrderNum) {
					console.log('[藍新金流 ReturnURL] 從 TradeInfo 解密取得訂單號:', decryptResponse.OrderNum);
					return sendRedirect(event, `/company/purchase/success?order=${decryptResponse.OrderNum}&status=${Status}`);
				}
			}
			catch (error) {
				console.error('[藍新金流 ReturnURL] 解密 TradeInfo 失敗:', error);
			}
		}

		if (!orderNum) {
			// 暫時方案：重定向到 success 頁面，讓前端顯示處理中狀態
			// 前端可以通過輪詢方式查詢最新的付款狀態
			console.log('[藍新金流 ReturnURL] 無法取得訂單號，重定向到處理中狀態');
			return sendRedirect(event, '/company/purchase/success?status=processing');
		}

		// 重定向到成功頁面，附帶訂單編號
		console.log('[藍新金流 ReturnURL] 重定向到 success 頁面:', orderNum);
		return sendRedirect(event, `/company/purchase/success?order=${orderNum}&status=${Status}`);
	}
	catch (error) {
		console.error('[藍新金流 ReturnURL] 處理錯誤:', error);
		// 發生錯誤時也重定向到 success 頁面
		return sendRedirect(event, '/company/purchase/success?error=processing_error');
	}
});
