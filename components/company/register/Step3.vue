<script setup lang="ts">
const router = useRouter()

function goToLogin() {
	router.push({ name: 'companyLogin' })
}
</script>

<template>
	<div class="flex flex-col items-center justify-center py-16 text-center">
		<h1 class="mb-4 text-3xl font-bold text-gray-800">
			恭喜您，註冊成功！
		</h1>
		<p class="mb-8 text-gray-600">
			已發送驗證郵件，請至電子郵件信箱點擊連結進行驗證！
		</p>
		<el-button
			type="primary"
			size="large"
			class="bg-gray-800 px-8 py-6 text-base font-bold text-white hover:bg-gray-700"
			@click="goToLogin"
		>
			前往登入頁面
		</el-button>
	</div>
</template>
