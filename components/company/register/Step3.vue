<script setup lang="ts">
const router = useRouter();

// 接收註冊成功的資料
const props = defineProps<{
	formData?: any
	registrationResult?: {
		success: boolean
		data?: {
			company_id: number
			message: string
		}
	}
}>();

function goToLogin() {
	// 跳轉到企業登入頁面
	router.push({ name: 'companyLogin' });
}
</script>

<template>
	<div class="flex flex-col items-center justify-center py-16 text-center">
		<h1 class="mb-4 text-3xl font-bold text-gray-800">
			恭喜您，註冊成功！
		</h1>
		<div
			v-if="props.registrationResult?.data?.company_id"
			class="mb-4"
		>
			<p class="text-lg text-gray-700">
				企業 ID: <span class="font-bold text-primary-blue">{{ props.registrationResult.data.company_id }}</span>
			</p>
		</div>
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
