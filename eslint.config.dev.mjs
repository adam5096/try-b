// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

// 開發環境：最寬鬆的規則，專注於核心問題
export default withNuxt(
	{
		rules: {
			// 🔴 只保留最關鍵的安全規則
			'no-undef': 'error', // 防止未定義變數
			'no-redeclare': 'error', // 防止重複聲明
			'no-var': 'error', // 禁止使用 var
			'no-debugger': 'error', // 禁止 debugger

			// 🟡 其他規則全部改為警告或關閉
			'no-unused-vars': 'warn',
			'no-empty': 'warn',
			'no-unused-expressions': 'warn',
			'no-duplicate-imports': 'warn',
			'eqeqeq': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
			'vue/no-mutating-props': 'warn',
			'vue/no-multiple-template-root': 'warn',

			// 🟢 格式化規則（開發環境也保持啟用）- 保持一致性
			'no-console': 'warn', // 開發環境允許 console 但警告
			'no-trailing-spaces': 'error', // 尾隨空格錯誤
			'no-multiple-empty-lines': ['error', { max: 1 }], // 限制連續空行
			'curly': 'error', // 要求控制語句使用大括號
		},
	},
);
