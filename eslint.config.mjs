// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
	{
		rules: {
			// 不使用分號
			semi: ['error', 'never'],
		},
	},
)
