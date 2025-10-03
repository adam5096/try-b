/**
 * 通用表單驗證工具
 * 基於 OWASP Top 10 安全原則設計
 * 支援多種欄位類型的智能驗證
 */

// 驗證規則介面
export interface ValidationRule {
	required: boolean
	minLength?: number
	maxLength?: number
	pattern?: RegExp
	message: string
	customValidator?: (_value: string) => string
}

// 驗證規則配置
export const validationRules = {
	name: {
		required: true,
		minLength: 2,
		maxLength: 20,
		pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
		message: '姓名只能包含中文、英文字母和數字，長度 2-20 字元',
	},
	account: {
		required: true,
		minLength: 3,
		maxLength: 20,
		pattern: /^[a-zA-Z0-9_]+$/,
		message: '帳號只能包含英文字母、數字和底線，長度 3-20 字元',
	},
	email: {
		required: true,
		minLength: 5,
		maxLength: 100,
		pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		message: '請輸入有效的電子郵件地址',
	},
	password: {
		required: true,
		minLength: 8,
		maxLength: 12,
		pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
		message: '密碼必須包含大小寫字母、數字和特殊字元，長度 8-12 字元',
	},
} as const;

/**
 * 姓名智能檢查
 * @param value 姓名值
 * @returns 錯誤訊息，空字串表示通過驗證
 */
export function validateName(value: string): string {
	if (!value.trim()) { return '姓名為必填欄位'; }

	const errors: string[] = [];

	// 長度檢查
	if (value.length < 2) {
		errors.push('至少 2 個字元');
	}
	else if (value.length > 20) {
		errors.push('不能超過 20 個字元');
	}

	// 字元類型檢查
	if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value)) {
		const invalidChars = value.match(/[^\u4e00-\u9fa5a-zA-Z0-9]/g);
		if (invalidChars) {
			errors.push(`包含無效字元：${[...new Set(invalidChars)].join('')}`);
		}
	}

	if (errors.length === 0) {
		return '';
	}
	return errors.join('；');
}

/**
 * 帳號智能檢查
 * @param value 帳號值
 * @returns 錯誤訊息，空字串表示通過驗證
 */
export function validateAccount(value: string): string {
	if (!value.trim()) {
		return '帳號為必填欄位';
	}

	const errors: string[] = [];

	// 長度檢查
	if (value.length < 3) {
		errors.push('至少 3 個字元');
	}
	else if (value.length > 20) {
		errors.push('不能超過 20 個字元');
	}

	// 字元類型檢查
	if (!/^[a-zA-Z0-9_]+$/.test(value)) {
		const invalidChars = value.match(/[^a-zA-Z0-9_]/g);
		if (invalidChars) {
			errors.push(`包含無效字元：${[...new Set(invalidChars)].join('')}`);
		}
	}

	// 開頭檢查
	if (value.length > 0 && /^[0-9]/.test(value)) {
		errors.push('不能以數字開頭');
	}

	if (errors.length === 0) {
		return '';
	}
	return errors.join('；');
}

/**
 * 電子郵件智能檢查
 * @param value 電子郵件值
 * @returns 錯誤訊息，空字串表示通過驗證
 */
export function validateEmail(value: string): string {
	if (!value.trim()) {
		return '電子郵件為必填欄位';
	}

	const errors: string[] = [];

	// 長度檢查
	if (value.length < 5) {
		errors.push('至少 5 個字元');
	}
	else if (value.length > 100) {
		errors.push('不能超過 100 個字元');
	}

	// 基本格式檢查
	if (!value.includes('@')) {
		errors.push('缺少 @ 符號');
	}
	else {
		const parts = value.split('@');
		if (parts.length !== 2) {
			errors.push('只能包含一個 @ 符號');
		}
		else {
			const [local, domain] = parts;

			// 本地部分檢查
			if (!local || local.length === 0) {
				errors.push('@ 前不能為空');
			}

			// 域名部分檢查
			if (!domain || domain.length === 0) {
				errors.push('@ 後不能為空');
			}
			else if (!domain.includes('.')) {
				errors.push('缺少域名');
			}
			else if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
				errors.push('域名包含無效字元');
			}
		}
	}

	// 完整格式檢查
	if (errors.length === 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
		errors.push('電子郵件格式不正確');
	}

	if (errors.length === 0) {
		return '';
	}
	return errors.join('；');
}

/**
 * 密碼強度檢查
 * @param value 密碼值
 * @returns 錯誤訊息，空字串表示通過驗證
 */
export function validatePasswordStrength(value: string): string {
	if (!value) {
		return '密碼為必填欄位';
	}

	const errors: string[] = [];

	// 長度檢查
	if (value.length < 8) {
		errors.push('至少 8 個字元');
	}
	else if (value.length > 12) {
		errors.push('不能超過 12 個字元');
	}

	// 字元類型檢查
	if (!/[a-z]/.test(value)) {
		errors.push('小寫字母');
	}
	if (!/[A-Z]/.test(value)) {
		errors.push('大寫字母');
	}
	if (!/\d/.test(value)) {
		errors.push('數字');
	}
	if (!/[@$!%*?&]/.test(value)) {
		errors.push('特殊字元 (@$!%*?&)');
	}

	// 格式檢查
	if (!/^[A-Za-z\d@$!%*?&]+$/.test(value)) {
		errors.push('包含無效字元');
	}

	if (errors.length === 0) {
		return '';
	}

	// 如果只有長度問題，顯示簡潔訊息
	if (errors.length === 1 && (errors[0].includes('字元'))) {
		return errors[0];
	}

	// 多個問題時，顯示缺少的元素
	const missingElements = errors.filter(error =>
		!error.includes('字元') && !error.includes('無效'),
	);

	if (missingElements.length > 0) {
		return `缺少：${missingElements.join('、')}`;
	}

	return errors.join('；');
}

/**
 * 密碼確認檢查
 * @param password 原始密碼
 * @param confirmPassword 確認密碼
 * @returns 錯誤訊息，空字串表示通過驗證
 */
export function validatePasswordMatch(password: string, confirmPassword: string): string {
	if (password && confirmPassword && password !== confirmPassword) {
		return '兩次輸入的密碼不一致';
	}
	return '';
}

/**
 * 通用欄位驗證器
 * @param value 欄位值
 * @param rule 驗證規則
 * @returns 錯誤訊息，空字串表示通過驗證
 */
export function validateField(value: string, rule: ValidationRule): string {
	// 必填檢查
	if (rule.required && !value.trim()) {
		return `${rule.message.split('，')[0]}為必填欄位`;
	}

	// 如果為空且非必填，直接通過
	if (!value.trim() && !rule.required) {
		return '';
	}

	// 長度檢查
	if (rule.minLength && value.length < rule.minLength) {
		return `至少 ${rule.minLength} 個字元`;
	}
	if (rule.maxLength && value.length > rule.maxLength) {
		return `不能超過 ${rule.maxLength} 個字元`;
	}

	// 格式檢查
	if (rule.pattern && !rule.pattern.test(value)) {
		return rule.message;
	}

	// 自定義驗證器
	if (rule.customValidator) {
		return rule.customValidator(value);
	}

	return '';
}

/**
 * 表單驗證結果介面
 */
export interface FormValidationResult {
	isValid: boolean
	errors: Record<string, string>
}

/**
 * 批量驗證表單欄位
 * @param formData 表單資料
 * @param validators 驗證器配置
 * @returns 驗證結果
 */
export function validateForm(
	formData: Record<string, string>,
	validators: Record<string, (_value: string) => string>,
): FormValidationResult {
	const errors: Record<string, string> = {};

	// 執行所有驗證器
	for (const [fieldName, validator] of Object.entries(validators)) {
		const value = formData[fieldName] || '';
		const error = validator(value);
		if (error) {
			errors[fieldName] = error;
		}
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
}

/**
 * 檢查欄位是否通過驗證（用於顯示「可使用」狀態）
 * @param value 欄位值
 * @param validator 驗證器函數
 * @returns 是否通過驗證
 */
export function isFieldValid(value: string, validator: (_value: string) => string): boolean {
	return value.trim() !== '' && validator(value) === '';
}

/**
 * 企業註冊表單驗證器（範例擴展）
 * 展示如何為不同模組擴展驗證邏輯
 */
export const companyValidators = {
	companyName: (value: string): string => {
		if (!value.trim()) {
			return '公司名稱為必填欄位';
		}

		const errors: string[] = [];

		// 長度檢查
		if (value.length < 2) {
			errors.push('至少 2 個字元');
		}
		else if (value.length > 50) {
			errors.push('不能超過 50 個字元');
		}

		// 字元類型檢查（公司名稱允許更多字元）
		if (!/^[\u4e00-\u9fa5a-zA-Z0-9\s\-()有限公司股份有限公司]+$/.test(value)) {
			const invalidChars = value.match(/[^\u4e00-\u9fa5a-zA-Z0-9\s\-()有限公司股份有限公司]/g);
			if (invalidChars) {
				errors.push(`包含無效字元：${[...new Set(invalidChars)].join('')}`);
			}
		}

		if (errors.length === 0) {
			return '';
		}
		return errors.join('；');
	},

	companyEmail: validateEmail, // 重用現有驗證器

	phoneNumber: (value: string): string => {
		if (!value.trim()) {
			return '電話號碼為必填欄位';
		}

		// 台灣手機號碼格式檢查
		if (!/^09\d{8}$/.test(value)) {
			return '請輸入有效的台灣手機號碼（09開頭，共10碼）';
		}

		return '';
	},
};
