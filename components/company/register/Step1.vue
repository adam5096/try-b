<script setup lang="ts">
import { reactive, ref, nextTick, watch, onUnmounted } from 'vue';
import type { FormInstance, FormRules, UploadRawFile } from 'element-plus';
import { ElMessage } from 'element-plus';

const props = defineProps<{
	formData: any
	industryOptions: { value: number, label: string }[]
	scaleOptions: { value: number, label: string }[]
	industriesPending?: boolean
	industriesError?: any
	uploadedFiles?: { logo: File | null, cover: File | null, environment: File | null }
}>();

const emit = defineEmits(['next', 'update-files']);

const formRef = ref<FormInstance>();

// 檔案上傳狀態 - 使用 props 中的狀態
const logoFile = ref<File | null>(props.uploadedFiles?.logo || null);
const coverFile = ref<File | null>(props.uploadedFiles?.cover || null);
const environmentFile = ref<File | null>(props.uploadedFiles?.environment || null);

// 檔案預覽 URL
const logoPreview = ref<string>('');
const coverPreview = ref<string>('');
const environmentPreview = ref<string>('');

// 初始化預覽 URL（如果已有檔案）
if (logoFile.value) {
	logoPreview.value = URL.createObjectURL(logoFile.value);
}
if (coverFile.value) {
	coverPreview.value = URL.createObjectURL(coverFile.value);
}
if (environmentFile.value) {
	environmentPreview.value = URL.createObjectURL(environmentFile.value);
}

// 監聽 props 變化，當從 Step2 回到 Step1 時重新初始化檔案狀態
watch(() => props.uploadedFiles, (newFiles) => {
	if (newFiles) {
		// 清理舊的預覽 URL
		if (logoPreview.value) {
			URL.revokeObjectURL(logoPreview.value);
		}
		if (coverPreview.value) {
			URL.revokeObjectURL(coverPreview.value);
		}
		if (environmentPreview.value) {
			URL.revokeObjectURL(environmentPreview.value);
		}

		// 更新檔案狀態
		logoFile.value = newFiles.logo;
		coverFile.value = newFiles.cover;
		environmentFile.value = newFiles.environment;

		// 重新建立預覽 URL
		if (logoFile.value) {
			logoPreview.value = URL.createObjectURL(logoFile.value);
		}
		else {
			logoPreview.value = '';
		}
		if (coverFile.value) {
			coverPreview.value = URL.createObjectURL(coverFile.value);
		}
		else {
			coverPreview.value = '';
		}
		if (environmentFile.value) {
			environmentPreview.value = URL.createObjectURL(environmentFile.value);
		}
		else {
			environmentPreview.value = '';
		}
	}
}, { deep: true });

// 清理預覽 URL，避免記憶體洩漏
onUnmounted(() => {
	if (logoPreview.value) {
		URL.revokeObjectURL(logoPreview.value);
	}
	if (coverPreview.value) {
		URL.revokeObjectURL(coverPreview.value);
	}
	if (environmentPreview.value) {
		URL.revokeObjectURL(environmentPreview.value);
	}
});

// 檔案上傳處理
const handleLogoUpload = (file: UploadRawFile) => {
	if (!file) { return false; }

	// 檔案類型驗證
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
	if (!allowedTypes.includes(file.type)) {
		ElMessage.error('企業標誌只支援 JPG、PNG、WEBP 格式');
		return false;
	}

	// 檔案大小驗證 (5MB)
	if (file.size > 5 * 1024 * 1024) {
		ElMessage.error('企業標誌檔案大小不能超過 5MB');
		return false;
	}

	logoFile.value = file;

	// 建立預覽 URL
	if (logoPreview.value) {
		URL.revokeObjectURL(logoPreview.value);
	}
	logoPreview.value = URL.createObjectURL(file);

	return true;
};

const handleCoverUpload = (file: UploadRawFile) => {
	if (!file) { return false; }

	// 檔案類型驗證
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
	if (!allowedTypes.includes(file.type)) {
		ElMessage.error('企業封面只支援 JPG、PNG、WEBP 格式');
		return false;
	}

	// 檔案大小驗證 (10MB)
	if (file.size > 10 * 1024 * 1024) {
		ElMessage.error('企業封面檔案大小不能超過 10MB');
		return false;
	}

	coverFile.value = file;

	// 建立預覽 URL
	if (coverPreview.value) {
		URL.revokeObjectURL(coverPreview.value);
	}
	coverPreview.value = URL.createObjectURL(file);

	return true;
};

const handleEnvironmentUpload = (file: UploadRawFile) => {
	if (!file) { return false; }

	// 檔案類型驗證
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
	if (!allowedTypes.includes(file.type)) {
		ElMessage.error('企業環境照片只支援 JPG、PNG、WEBP 格式');
		return false;
	}

	// 檔案大小驗證 (10MB)
	if (file.size > 10 * 1024 * 1024) {
		ElMessage.error('企業環境照片檔案大小不能超過 10MB');
		return false;
	}

	environmentFile.value = file;

	// 建立預覽 URL
	if (environmentPreview.value) {
		URL.revokeObjectURL(environmentPreview.value);
	}
	environmentPreview.value = URL.createObjectURL(file);

	return true;
};

// 移除檔案
const removeLogo = () => {
	logoFile.value = null;
	if (logoPreview.value) {
		URL.revokeObjectURL(logoPreview.value);
		logoPreview.value = '';
	}
};

const removeCover = () => {
	coverFile.value = null;
	if (coverPreview.value) {
		URL.revokeObjectURL(coverPreview.value);
		coverPreview.value = '';
	}
};

const removeEnvironment = () => {
	environmentFile.value = null;
	if (environmentPreview.value) {
		URL.revokeObjectURL(environmentPreview.value);
		environmentPreview.value = '';
	}
};

const createRequiredValidator = (message: string) => {
	return (rule: any, value: any, callback: (error?: Error) => void) => {
		if (!value && value !== 0) {
			callback(new Error(message));
		}
		else {
			callback();
		}
	};
};

const validateEmail = (rule: any, value: any, callback: (error?: Error) => void) => {
	if (!value) {
		callback(new Error('Email為必填'));
		return;
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(value)) {
		callback(new Error('請輸入有效的 Email 格式'));
	}
	else {
		callback();
	}
};

const validateConfirmPassword = (rule: any, value: any, callback: (error?: Error) => void) => {
	if (value === '') {
		callback(new Error('確認密碼為必填'));
	}
	else if (value !== props.formData.password) {
		callback(new Error('兩次輸入的密碼不一致'));
	}
	else {
		callback();
	}
};

const rules = reactive<FormRules>({
	name: [{ validator: createRequiredValidator('企業名稱為必填'), trigger: 'blur' }],
	account: [{ validator: createRequiredValidator('帳號為必填'), trigger: 'blur' }],
	email: [{ validator: validateEmail, trigger: ['blur', 'change'] }],
	password: [{ validator: createRequiredValidator('密碼為必填'), trigger: 'blur' }],
	confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
	industry_id: [{ validator: createRequiredValidator('產業類別為必填'), trigger: 'change' }],
	scale_id: [{ validator: createRequiredValidator('企業規模為必填'), trigger: 'change' }],
	address: [{ validator: createRequiredValidator('企業地址為必填'), trigger: 'blur' }],
});

const handleNextClick = async () => {
	const formEl = formRef.value;
	if (!formEl) {
		return;
	}

	try {
		await formEl.validate();

		// 每次點擊下一步都更新檔案狀態，確保狀態同步
		emit('update-files', {
			logo: logoFile.value,
			cover: coverFile.value,
			environment: environmentFile.value,
		});

		emit('next');
	}
	catch (fields) {
		// 驗證失敗後，Element Plus 會更新其內部狀態以顯示錯誤。
		// 這個更新不是同步的。我們必須使用 nextTick 等待下一個 DOM 更新週期，
		// 以確保當 Playwright 進行下一步斷言時，錯誤訊息的 DOM 元素已經被渲染出來。
		await nextTick();
	}
};
</script>

<template>
	<div>
		<h1 class="mb-6 text-2xl font-bold text-gray-800">
			企業資料
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
				label="帳號"
				prop="account"
				class="col-span-2 md:col-span-1"
			>
				<el-input
					v-model="formData.account"
					placeholder="請輸入帳號"
				/>
			</el-form-item>

			<el-form-item
				label="Email"
				prop="email"
				class="col-span-2 md:col-span-1"
			>
				<el-input
					v-model="formData.email"
					placeholder="請輸入Email"
				/>
			</el-form-item>

			<el-form-item
				label="密碼"
				prop="password"
				class="col-span-2 md:col-span-1"
			>
				<el-input
					v-model="formData.password"
					type="password"
					placeholder="請輸入密碼"
					show-password
				/>
			</el-form-item>

			<el-form-item
				label="確認密碼"
				prop="confirmPassword"
				class="col-span-2 md:col-span-1"
			>
				<el-input
					v-model="formData.confirmPassword"
					type="password"
					placeholder="再次輸入密碼"
					show-password
				/>
			</el-form-item>

			<el-form-item
				label="企業名稱"
				prop="name"
				class="col-span-2 md:col-span-1"
			>
				<el-input
					v-model="formData.name"
					placeholder="請輸入企業的名稱"
				/>
			</el-form-item>

			<el-form-item
				label="統一編號"
				class="col-span-2 md:col-span-1"
			>
				<el-input
					v-model="formData.tax_id_num"
					placeholder="請輸入有效的統一編號（個人工作室可不填）"
				/>
			</el-form-item>

			<el-form-item
				label="產業類別"
				class="col-span-2 md:col-span-1"
			>
				<el-select
					v-model="formData.industry_id"
					placeholder="請選擇企業的產業類別"
					class="w-full"
					:loading="industriesPending"
					:disabled="industriesPending || !!industriesError"
				>
					<el-option
						v-for="item in industryOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
				<!-- 錯誤訊息顯示 -->
				<div
					v-if="industriesError"
					class="mt-1 text-sm text-red-500"
				>
					載入產業清單失敗，請重新整理頁面
				</div>
			</el-form-item>

			<el-form-item
				label="企業規模"
				class="col-span-2 md:col-span-1"
			>
				<el-select
					v-model="formData.scale_id"
					placeholder="請選擇企業的規模"
					class="w-full"
				>
					<el-option
						v-for="item in scaleOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>

			<el-form-item
				label="企業地址"
				prop="address"
				class="col-span-2"
			>
				<el-input
					v-model="formData.address"
					placeholder="請輸入完整地址"
				/>
			</el-form-item>

			<el-form-item
				label="企業網站"
				class="col-span-2"
			>
				<el-input
					v-model="formData.website"
					placeholder="請輸入有效的網址"
				/>
			</el-form-item>

			<el-form-item
				label="企業簡介"
				class="col-span-2"
			>
				<el-input
					v-model="formData.intro"
					type="textarea"
					:rows="4"
					placeholder="請輸入企業完整的介紹與描述"
				/>
			</el-form-item>

			<div class="col-span-2 mt-2 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
				<!-- 企業標誌上傳 -->
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-900">企業標誌</label>
					<div
						class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4"
					>
						<div
							v-if="logoPreview"
							class="relative aspect-[16/9] w-full rounded-md overflow-hidden"
						>
							<img
								:src="logoPreview"
								alt="企業標誌預覽"
								class="h-full w-full object-cover"
							>
							<button
								type="button"
								class="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
								@click="removeLogo"
							>
								×
							</button>
						</div>
						<div
							v-else
							class="aspect-[16/9] w-full rounded-md bg-gray-200 flex items-center justify-center"
						>
							<svg
								class="h-12 w-12"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<el-upload
							:show-file-list="false"
							:before-upload="handleLogoUpload"
							accept="image/jpeg,image/jpg,image/png,image/webp"
							class="upload-demo"
						>
							<el-button type="primary">
								{{ logoFile ? '更換標誌' : '上傳標誌' }}
							</el-button>
						</el-upload>
						<p class="text-xs text-gray-500">
							建議尺寸：16:9，最大 5MB
						</p>
					</div>
				</div>

				<!-- 企業封面上傳 -->
				<div>
					<label class="mb-2 block text-sm font-medium text-gray-900">企業封面</label>
					<div
						class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4"
					>
						<div
							v-if="coverPreview"
							class="relative aspect-[16/9] w-full rounded-md overflow-hidden"
						>
							<img
								:src="coverPreview"
								alt="企業封面預覽"
								class="h-full w-full object-cover"
							>
							<button
								type="button"
								class="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
								@click="removeCover"
							>
								×
							</button>
						</div>
						<div
							v-else
							class="aspect-[16/9] w-full rounded-md bg-gray-200 flex items-center justify-center"
						>
							<svg
								class="h-12 w-12 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<el-upload
							:show-file-list="false"
							:before-upload="handleCoverUpload"
							accept="image/jpeg,image/jpg,image/png,image/webp"
							class="upload-demo"
						>
							<el-button type="primary">
								{{ coverFile ? '更換封面' : '上傳封面' }}
							</el-button>
						</el-upload>
						<p class="text-xs text-gray-500">
							建議尺寸：16:9，最大 10MB
						</p>
					</div>
				</div>
			</div>

			<!-- 企業環境照片上傳 -->
			<div class="col-span-2 mt-4">
				<label class="mb-2 block text-sm font-medium text-gray-900">企業環境照片</label>
				<div
					class="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4"
				>
					<div
						v-if="environmentPreview"
						class="relative aspect-[16/9] w-full max-w-md rounded-md overflow-hidden"
					>
						<img
							:src="environmentPreview"
							alt="企業環境照片預覽"
							class="h-full w-full object-cover"
						>
						<button
							type="button"
							class="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
							@click="removeEnvironment"
						>
							×
						</button>
					</div>
					<div
						v-else
						class="aspect-[16/9] w-full max-w-md rounded-md bg-gray-200 flex items-center justify-center"
					>
						<svg
							class="h-12 w-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<el-upload
						:show-file-list="false"
						:before-upload="handleEnvironmentUpload"
						accept="image/jpeg,image/jpg,image/png,image/webp"
						class="upload-demo"
					>
						<el-button type="primary">
							{{ environmentFile ? '更換環境照片' : '上傳環境照片' }}
						</el-button>
					</el-upload>
					<p class="text-xs text-gray-500">
						建議尺寸：16:9，最大 10MB
					</p>
				</div>
			</div>

			<div class="col-span-2 mt-8 flex justify-end">
				<el-button
					type="primary"
					size="large"
					class="bg-gray-800 px-8 py-6 text-base font-bold text-white hover:bg-gray-700"
					@click="handleNextClick"
				>
					下一步
				</el-button>
			</div>
		</el-form>
	</div>
</template>
