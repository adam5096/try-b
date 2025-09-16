<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const props = defineProps<{
	formData: any;
}>()

const emit = defineEmits(['next', 'previous'])

const formRef = ref<FormInstance>()
const isLoading = ref(false)

const createRequiredValidator = (message: string) => {
	return (rule: any, value: any, callback: (error?: Error) => void) => {
		if (!value) {
			callback(new Error(message))
    }
		else {
			callback()
    }
	};
};

const rules = reactive<FormRules>({
	'CompanyContact.name': [{ validator: createRequiredValidator('聯絡人姓名為必填'), trigger: 'blur' }],
	'CompanyContact.job_title': [{ validator: createRequiredValidator('職稱為必填'), trigger: 'blur' }],
	'CompanyContact.email': [{ validator: createRequiredValidator('電子郵件為必填'), trigger: 'blur' }],
	'CompanyContact.phone': [{ validator: createRequiredValidator('聯絡電話為必填'), trigger: 'blur' }],
})

const handleNextClick = async () => {
	const formEl = formRef.value
  if (!formEl) return

  // 1. 等待 Element Plus 表單驗證通過
  try {
		await formEl.validate()
  }
	catch (validationError) {
		ElMessage({ message: '請檢查表單欄位是否都已正確填寫', type: 'warning' })
    return; // 如果驗證失敗，則停止執行
	}

	isLoading.value = true
  try {
		// 2. 準備要發送到後端的 payload
		// 使用物件解構來建立一個新物件，同時排除僅供前端使用的 'confirmPassword' 欄位
		const { confirmPassword, ...payload } = props.formData

    // 3. 使用統一的 API 函數呼叫 API
    const { data: response, error } = await useFetch('/v1/company', {
			method: 'POST',
			baseURL: '/api',
			body: payload,
		})

    // 4a. 處理成功的回應
    if (error.value) {
			throw error.value
    }

		ElMessage({ message: '註冊成功！', type: 'success' })
    emit('next')
  }
	catch (error: any) {
		// 4b. 處理失敗的回應
		ElMessage({
			message: `註冊失敗: ${error?.data?.message || error?.message || '請檢查您的資料或稍後再試'}`,
			type: 'error',
			duration: 5000, // 讓錯誤訊息停留久一點
		})
  }
	finally {
		// 5. 無論成功或失敗，最後都要結束 loading 狀態
		isLoading.value = false
  }
}

const handlePrevClick = () => {
	emit('previous')
}
</script>

<template>
	<div>
		<h1 class="mb-6 text-2xl font-bold text-gray-800">
			聯絡人資料
		</h1>

		<el-form
			ref="formRef"
			:model="formData"
			:rules="rules"
			label-position="top"
			class="grid grid-cols-2 gap-x-6"
			size="large"
		>
			<el-form-item
				label="聯絡人姓名 *"
				prop="CompanyContact.name"
				class="col-span-2 md:col-span-1"
			>
				<el-input
					v-model="formData.CompanyContact.name"
					placeholder="請輸入聯絡人姓名"
				/>
			</el-form-item>

			<el-form-item
				label="職稱 *"
				prop="CompanyContact.job_title"
				class="col-span-2 md:col-span-1"
			>
				<el-input
					v-model="formData.CompanyContact.job_title"
					placeholder="請輸入聯絡人職稱"
				/>
			</el-form-item>

			<el-form-item
				label="電子郵件 *"
				prop="CompanyContact.email"
				class="col-span-2"
			>
				<el-input
					v-model="formData.CompanyContact.email"
					placeholder="請輸入聯絡人電子郵件"
				/>
			</el-form-item>

			<el-form-item
				label="聯絡電話 *"
				prop="CompanyContact.phone"
				class="col-span-2"
			>
				<el-input
					v-model="formData.CompanyContact.phone"
					placeholder="請輸入聯絡人電話"
				/>
			</el-form-item>

			<div class="col-span-2 mt-8 flex justify-between">
				<el-button
					native-type="button"
					size="large"
					class="px-8 py-6 text-base font-bold"
					@click="handlePrevClick"
				>
					上一步
				</el-button>
				<el-button
					type="primary"
					size="large"
					class="bg-gray-800 px-8 py-6 text-base font-bold text-white hover:bg-gray-700"
					:loading="isLoading"
					@click="handleNextClick"
				>
					註冊
				</el-button>
			</div>
		</el-form>
	</div>
</template>
