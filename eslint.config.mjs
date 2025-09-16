// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
	{
		rules: {
			// 程式碼品質規則（stylistic 不包含的）
			'no-console': 'warn',                 // console 警告
			'no-unused-vars': 'error',           // 未使用變數
			'no-debugger': 'error',              // debugger 語句
			'no-duplicate-imports': 'error',     // 重複 import
			
			// 格式化規則（stylistic 可能不包含的）
			'no-trailing-spaces': 'error',       // 尾隨空格
			'no-multiple-empty-lines': 'error', // 多餘空行
		}
	}
)