// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

// 極簡配置：只檢查最關鍵的問題，最大化開發效率
export default withNuxt(
	{
		name: 'minimal-config',
		rules: {
			// 🔴 只保留 4 個最關鍵的安全規則
			'no-undef': 'error', // 防止未定義變數
			'no-redeclare': 'error', // 防止重複聲明
			'no-var': 'error', // 禁止使用 var
			'no-debugger': 'error', // 禁止 debugger

			// 🟢 其他所有規則都關閉 - 專注於開發效率
			'@stylistic/semi': 'off',
			'@stylistic/semi-spacing': 'off',
			'no-unexpected-multiline': 'off',
			'no-return-await': 'off',
			'no-unused-vars': 'off',
			'no-empty': 'off',
			'no-unused-expressions': 'off',
			'no-duplicate-imports': 'off',
			'eqeqeq': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'vue/no-mutating-props': 'off',
			'vue/no-multiple-template-root': 'off',
			'vue/no-v-html': 'off',
			'no-console': 'off',
			'no-trailing-spaces': 'off',
			'no-multiple-empty-lines': 'off',
			'curly': 'off',
			'@stylistic/max-statements-per-line': 'off',
		},
	},
);
