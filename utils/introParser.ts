/**
 * Intro 內容解析工具
 * 用於解析 e comp 7 API 回應中的 intro 欄位內容
 * 支援新格式（結構化）和舊格式（純文字）的向後相容
 */

export interface ParsedIntro {
	experienceIntro?: string;
	teacherIntro?: string;
	requirements?: string[];
	preparation?: string[];
	fallback?: string; // 原始內容，用於向後相容
}

/**
 * 解析 intro 內容
 * @param intro 原始 intro 字串
 * @returns 解析後的結構化內容
 */
export function parseIntroContent(intro: string): ParsedIntro {
	if (!intro || typeof intro !== 'string') {
		return { fallback: intro || '' }
	}

	// 檢查是否為新格式（包含 \r\n\r\n 或 \n\n 分隔符）
	if (!intro.includes('\r\n\r\n') && !intro.includes('\n\n')) {
		return { fallback: intro }
	}

	try {
		// 按 \r\n\r\n 或 \n\n 分割主要區塊
		const separator = intro.includes('\r\n\r\n') ? '\r\n\r\n' : '\n\n'
		const blocks = intro.split(separator).map(block => block.trim()).filter(block => block.length > 0)

		const result: ParsedIntro = {}

		for (const block of blocks) {
			const blockLower = block.toLowerCase()

			// 體驗介紹
			if (blockLower.includes('體驗介紹：') || blockLower.includes('體驗介紹')) {
				result.experienceIntro = extractContentAfterColon(block)
			}
			// 師資介紹
			else if (blockLower.includes('師資介紹：') || blockLower.includes('師資介紹')) {
				result.teacherIntro = extractContentAfterColon(block)
			}
			// 參加限制
			else if (blockLower.includes('參加限制：') || blockLower.includes('參加限制')) {
				result.requirements = extractListItems(block)
			}
			// 行前須知與準備清單
			else if (blockLower.includes('行前須知') || blockLower.includes('準備清單')) {
				result.preparation = extractListItems(block)
			}
		}

		// 如果沒有解析到任何結構化內容，回退到原始內容
		if (!result.experienceIntro && !result.teacherIntro && !result.requirements && !result.preparation) {
			return { fallback: intro }
		}

		return result
	}
	catch (error) {
		// 解析失敗時回退到原始內容
		// Intro 解析失敗，使用原始內容
		return { fallback: intro }
	}
}

/**
 * 提取冒號後的內容
 * @param text 包含冒號的文字
 * @returns 冒號後的內容
 */
function extractContentAfterColon(text: string): string {
	const colonIndex = text.indexOf('：')
	if (colonIndex === -1) {
		return text
	}
	return text.substring(colonIndex + 1).trim()
}

/**
 * 提取列表項目
 * @param text 包含列表的文字
 * @returns 列表項目陣列
 */
function extractListItems(text: string): string[] {
	const content = extractContentAfterColon(text)

	// 按 \r\n 或 \n 分割，然後過濾空行
	const lineSeparator = content.includes('\r\n') ? '\r\n' : '\n'
	const lines = content.split(lineSeparator).map(line => line.trim()).filter(line => line.length > 0)

	// 處理編號列表（如 "1.項目" 或 "1)項目"）
	return lines.map((line) => {
		// 移除開頭的編號（如 "1."、"1)"、"1、" 等）
		return line.replace(/^\d+[\.\)、]\s*/, '').trim()
	});
}

/**
 * 檢查是否為新格式的 intro 內容
 * @param intro intro 字串
 * @returns 是否為新格式
 */
export function isNewFormatIntro(intro: string): boolean {
	return Boolean(intro && (intro.includes('\r\n\r\n') || intro.includes('\n\n')))
}

/**
 * 產生卡片摘要字串：
 * - 先嘗試使用結構化解析的 experienceIntro 或 fallback
 * - 移除多餘換行與空白
 * - 依照指定長度截斷並補上省略號
 */
export function extractIntroSummaryForCard(intro: string, maxLength = 120): string {
	const parsed = parseIntroContent(intro || '')
	const raw = parsed.experienceIntro || parsed.fallback || ''

	const singleLine = String(raw)
		.replace(/\r\n|\n|\r/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()

	if (singleLine.length <= maxLength) return singleLine
	return singleLine.slice(0, Math.max(0, maxLength - 1)).trimEnd() + '…'
}
