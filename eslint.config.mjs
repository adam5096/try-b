// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
	{
		rules: {
			// 不使用分號
			'semi': ['error', 'never'],
			// 統一使用單引號
			'quotes': ['error', 'single'],
			// 統一使用 2 個空格縮排
			'indent': ['error', 2],
			// 禁止行尾空格
			'no-trailing-spaces': 'error',
    }
	}
)
