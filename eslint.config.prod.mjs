// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

// 生產環境：最嚴格的規則
export default withNuxt(
	{
		rules: {
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
