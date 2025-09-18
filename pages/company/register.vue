<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import Step1 from '~/components/company/register/Step1.vue';
import Step2 from '~/components/company/register/Step2.vue';
import Step3 from '~/components/company/register/Step3.vue';
import { useCompanyIndustries } from '~/composables/api/company/useCompanyIndustries';

definePageMeta({
	layout: 'main',
	ssr: false, // CSR 模式
});

const steps = [Step1, Step2, Step3];

const currentStep = ref(1);

const formData = reactive({
	// Step 1 data
	account: '',
	email: '',
	password: '',
	confirmPassword: '', // Frontend only, won't be sent to API
	name: '',
	tax_id_num: '',
	industry_id: null as number | null,
	scale_id: null as number | null,
	address: '',
	website: '',
	intro: '',
	CompanyImg: [] as { type: string, img_path: string }[],

	// Step 2 data
	CompanyContact: {
		name: '',
		job_title: '',
		email: '',
		phone: '',
	},
});

// 檔案上傳狀態
const uploadedFiles = reactive({
	logo: null as File | null,
	cover: null as File | null,
	environment: null as File | null,
});

// 註冊結果狀態
const registrationResult = ref<{
	success: boolean
	data?: {
		company_id: number
		message: string
	}
} | null>(null);

// 使用 API 取得產業清單
const { data: industriesData, pending: industriesPending, error: industriesError } = useCompanyIndustries();

// 將 API 資料轉換為 el-option 需要的格式
const industryOptions = computed(() => {
	if (!industriesData.value) {
		return [];
	}
	return industriesData.value.map(item => ({
		value: item.id,
		label: item.title,
	}));
});

const scaleOptions = [
	{ value: 1, label: '1-10人' },
	{ value: 2, label: '11-50人' },
	{ value: 3, label: '51-200人' },
	{ value: 4, label: '201-500人' },
	{ value: 5, label: '501人以上' },
];

function nextStep() {
	if (currentStep.value < 3) {
		currentStep.value++;
	}
}

function previousStep() {
	if (currentStep.value > 1) {
		currentStep.value--;
	}
}

// 處理檔案更新事件
function handleFileUpdate(files: { logo: File | null, cover: File | null, environment: File | null }) {
	uploadedFiles.logo = files.logo;
	uploadedFiles.cover = files.cover;
	uploadedFiles.environment = files.environment;
}

// 處理註冊成功事件
function handleRegistrationSuccess(result: { success: boolean, data?: { company_id: number, message: string } }) {
	registrationResult.value = result;
}
</script>

<template>
	<div class="bg-gray-50 py-12 lg:py-16">
		<div class="mx-auto w-full max-w-4xl rounded-lg bg-white p-8 shadow-sm lg:p-16">
			<!-- Dynamic Stepper -->
			<div class="mb-10 flex items-center">
				<!-- Step 1 -->
				<div class="flex flex-col items-center text-center">
					<div
						:class="[
							'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
							currentStep >= 1 ? 'bg-gray-800 text-white' : 'border-2 border-gray-300 text-gray-400',
						]"
					>
						1
					</div>
					<span :class="['mt-2 w-20 text-sm', currentStep >= 1 ? 'font-bold text-gray-800' : 'text-gray-400']">
						企業資料
					</span>
				</div>
				<div :class="['mx-4 h-px flex-1', currentStep > 1 ? 'bg-gray-800' : 'bg-gray-300']" />
				<!-- Step 2 -->
				<div class="flex flex-col items-center text-center">
					<div
						:class="[
							'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
							currentStep >= 2 ? 'bg-gray-800 text-white' : 'border-2 border-gray-300 text-gray-400',
						]"
					>
						2
					</div>
					<span :class="['mt-2 w-20 text-sm', currentStep >= 2 ? 'font-bold text-gray-800' : 'text-gray-400']">
						聯絡人資料
					</span>
				</div>
				<div :class="['mx-4 h-px flex-1', currentStep > 2 ? 'bg-gray-800' : 'bg-gray-300']" />
				<!-- Step 3 -->
				<div class="flex flex-col items-center text-center">
					<div
						:class="[
							'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
							currentStep >= 3 ? 'bg-gray-800 text-white' : 'border-2 border-gray-300 text-gray-400',
						]"
					>
						3
					</div>
					<span :class="['mt-2 w-20 text-sm', currentStep >= 3 ? 'font-bold text-gray-800' : 'text-gray-400']">
						完成註冊
					</span>
				</div>
			</div>

			<!-- Step Components -->
			<KeepAlive>
				<Transition
					name="fade"
					mode="out-in"
				>
					<component
						:is="steps[currentStep - 1]"
						:form-data="formData"
						:industry-options="industryOptions"
						:scale-options="scaleOptions"
						:industries-pending="industriesPending"
						:industries-error="industriesError"
						:uploaded-files="uploadedFiles"
						:registration-result="registrationResult"
						@next="nextStep"
						@prev="previousStep"
						@update-files="handleFileUpdate"
						@registration-success="handleRegistrationSuccess"
					/>
				</Transition>
			</KeepAlive>
		</div>
	</div>
</template>
