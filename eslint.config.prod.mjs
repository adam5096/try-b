// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

// 生產環境：最嚴格的規則
export default withNuxt(
	{
		rules: {
			// 關閉分號要求
			'@stylistic/semi': 'off',
			'@stylistic/semi-spacing': 'off',

			// ASI 錯誤檢查（不強制分號，但檢查潛在問題）
			'no-unexpected-multiline': 'error', // 檢查意外的多行語句
			'no-return-await': 'error', // 檢查 return await 問題
			// 🔴 核心安全規則（錯誤級別）
			'no-undef': 'error',
			'no-redeclare': 'error',
			'no-var': 'error',
			'no-debugger': 'error',

			// 🟡 程式碼品質規則（錯誤級別）
			'no-unused-vars': 'error',
			'no-empty': 'error',
			'no-unused-expressions': 'error',
			'no-duplicate-imports': 'error',
			'eqeqeq': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': 'error',
			'vue/no-mutating-props': 'error',
			'vue/no-multiple-template-root': 'error',

			// 🟢 格式化規則（錯誤級別）- 所有環境都嚴格
			'no-console': 'error', // 生產環境禁止 console
			'no-trailing-spaces': 'error',
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'curly': 'error',
		},
	},
);
