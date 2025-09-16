// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
	{
		rules: {
			// 與 nuxt.config.ts 中的 stylistic 配置保持一致
			'semi': ['error', 'always'],
			'quotes': ['error', 'single'],
			'indent': ['error', 'tab'],
			'no-trailing-spaces': 'error'
		}
	}
)