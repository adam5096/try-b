// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

// 一般環境：寬鬆的規則，平衡開發效率與程式碼品質
export default withNuxt(
	{
		rules: {
			// 關閉分號要求
			'@stylistic/semi': 'off',
			'@stylistic/semi-spacing': 'off',

			// 🔴 核心安全規則（必須修復）- 防止運行時錯誤
			'no-undef': 'error', // 防止未定義變數
			'no-redeclare': 'error', // 防止重複聲明
			'no-var': 'error', // 禁止使用 var
			'no-debugger': 'error', // 禁止 debugger 語句

			// 🟡 程式碼品質規則（警告級別）- 不阻塞開發
			'no-unexpected-multiline': 'warn',
			'no-return-await': 'warn',
			'no-unused-vars': 'warn', // 未使用變數改為警告
			'no-empty': 'warn', // 空程式碼塊改為警告
			'no-unused-expressions': 'warn', // 未使用表達式改為警告
			'no-duplicate-imports': 'warn', // 重複 import 改為警告
			'eqeqeq': 'warn', // 嚴格相等改為警告

			// TypeScript 規則（警告級別）
			'@typescript-eslint/no-explicit-any': 'warn', // any 類型改為警告
			'@typescript-eslint/no-unused-vars': 'warn', // TypeScript 未使用變數改為警告
			'@typescript-eslint/no-non-null-assertion': 'warn', // 非空斷言警告

			// Vue.js 規則（警告級別）
			'vue/no-mutating-props': 'warn', // 修改 props 改為警告
			'vue/no-multiple-template-root': 'warn', // 多個根元素改為警告
			'vue/no-v-html': 'warn', // v-html 使用警告

			// 🟢 格式化規則（保持程式碼一致性）
			'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn', // 環境區分
			'no-trailing-spaces': 'warn', // 尾隨空格改為警告
			'no-multiple-empty-lines': 'off', // 關閉空行檢查
			'curly': 'off', // 關閉大括號要求
			'@stylistic/max-statements-per-line': 'off', // 關閉語句檢查
		},
	},
);
