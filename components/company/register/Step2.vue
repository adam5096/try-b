<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import type { CompanyRegisterRequest } from '~/types/company/company';
import { useCompanyRegister } from '~/composables/api/company/useCompanyRegister';

const props = defineProps<{
	formData: any
	uploadedFiles?: { logo: File | null, cover: File | null, environment: File | null }
}>();

const emit = defineEmits(['next', 'prev', 'registration-success']);

const formRef = ref<FormInstance>();
const isLoading = ref(false);

const createRequiredValidator = (message: string) => {
	return (rule: any, value: any, callback: (error?: Error) => void) => {
		if (!value) {
			callback(new Error(message));
		}
		else {
			callback();
		}
	};
};

const rules = reactive<FormRules>({
	'CompanyContact.name': [{ validator: createRequiredValidator('聯絡人姓名為必填'), trigger: 'blur' }],
	'CompanyContact.job_title': [{ validator: createRequiredValidator('職稱為必填'), trigger: 'blur' }],
	'CompanyContact.email': [{ validator: createRequiredValidator('電子郵件為必填'), trigger: 'blur' }],
	'CompanyContact.phone': [{ validator: createRequiredValidator('聯絡電話為必填'), trigger: 'blur' }],
});

const handleNextClick = async () => {
	const formEl = formRef.value;
	if (!formEl) {
		return;
	}

	// 1. 等待 Element Plus 表單驗證通過
	try {
		await formEl.validate();
	}
	catch (validationError) {
		ElMessage({ message: '請檢查表單欄位是否都已正確填寫', type: 'warning' });
		return; // 如果驗證失敗，則停止執行
	}

	isLoading.value = true;
	try {
		// 2. 準備要發送到後端的 payload
		// 排除不需要的欄位並轉換 CompanyContact 格式
		const { confirmPassword, CompanyContact, CompanyImg, ...restData } = props.formData;

		const payload: CompanyRegisterRequest = {
			...restData,
			company_contact: {
				name: CompanyContact.name,
				job_title: CompanyContact.job_title,
				email: CompanyContact.email,
				phone: CompanyContact.phone,
			},
		};

		// 3. 使用 useCompanyRegister composable
		const { register } = useCompanyRegister();
		const result = await register(payload, props.uploadedFiles);

		// 4a. 處理成功的回應
		if (result.success) {
			ElMessage({
				message: `註冊成功！企業 ID: ${result.data?.company_id}`,
				type: 'success',
			});
			// 發送註冊成功事件給父組件
			emit('registration-success', result);
			// 先跳轉到 Step3 展示成功頁面
			emit('next');
		}
		else {
			// 4b. 處理失敗的回應
			const errorMessage = result.error?.errors?.length
				? result.error.errors.join('、')
				: result.error?.message || '註冊失敗，請檢查您的資料或稍後再試';
			ElMessage({
				message: `註冊失敗: ${errorMessage}`,
				type: 'error',
				duration: 5000,
			});
		}
	}
	catch (error: any) {
		// 4c. 處理其他錯誤
		ElMessage({
			message: `註冊失敗: ${error?.message || '請檢查您的資料或稍後再試'}`,
			type: 'error',
			duration: 5000,
		});
	}
	finally {
		// 5. 無論成功或失敗，最後都要結束 loading 狀態
		isLoading.value = false;
	}
};

const handlePrevClick = () => {
	emit('prev');
};
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
				label="聯絡人姓名"
				prop="CompanyContact.name"
				class="col-span-2 md:col-span-1"
			>
				<el-input
					v-model="formData.CompanyContact.name"
					placeholder="請輸入聯絡人姓名"
					:disabled="isLoading"
				/>
			</el-form-item>

			<el-form-item
				label="職稱"
				prop="CompanyContact.job_title"
				class="col-span-2 md:col-span-1"
			>
				<el-input
					v-model="formData.CompanyContact.job_title"
					placeholder="請輸入聯絡人職稱"
					:disabled="isLoading"
				/>
			</el-form-item>

			<el-form-item
				label="電子郵件"
				prop="CompanyContact.email"
				class="col-span-2"
			>
				<el-input
					v-model="formData.CompanyContact.email"
					placeholder="請輸入聯絡人電子郵件"
					:disabled="isLoading"
				/>
			</el-form-item>

			<el-form-item
				label="聯絡電話"
				prop="CompanyContact.phone"
				class="col-span-2"
			>
				<el-input
					v-model="formData.CompanyContact.phone"
					placeholder="請輸入聯絡人電話"
					:disabled="isLoading"
				/>
			</el-form-item>

			<div class="col-span-2 mt-8 flex justify-between">
				<el-button
					native-type="button"
					size="large"
					class="px-8 py-6 text-base font-bold"
					:disabled="isLoading"
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
