<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { useCompanyProgramStore } from '~/stores/company/useProgramStore';
import type { CreateProgramPayload } from '~/types/company/program';
import { useRouter } from 'vue-router';
import { useCompanyIndustries } from '~/composables/api/company/useCompanyIndustries';
import { useCompanyPositions } from '~/composables/api/company/useCompanyPositions';
import { uploadProgramImages } from '~/composables/api/company/useCompanyUploadProgramImages';
import { navigateTo } from '#app';

definePageMeta({
	layout: 'company',
	name: 'company-programs-new',
	ssr: false, // CSR 模式
});

const programStore = useCompanyProgramStore();
const router = useRouter();
const isLoading = ref(false);
const agreeToTerms = ref(false);

// Element Plus 表單驗證規則
const formRef = ref();
const rules = reactive({
	name: [
		{ required: true, message: '請輸入體驗名稱', trigger: 'blur' },
		{ max: 10, message: '體驗名稱最多10個字', trigger: 'blur' }
	],
	intro: [
		{ required: true, message: '請輸入體驗介紹', trigger: 'blur' }
	],
	industry_id: [
		{ required: true, message: '請選擇產業類別', trigger: 'change' }
	],
	job_title_id: [
		{ required: true, message: '請選擇職務類別', trigger: 'change' }
	],
	address: [
		{ required: true, message: '請輸入體驗地址', trigger: 'blur' }
	],
	contact_name: [
		{ required: true, message: '請輸入聯絡人姓名', trigger: 'blur' }
	],
	contact_phone: [
		{ required: true, message: '請輸入聯絡電話', trigger: 'blur' }
	],
	contact_email: [
		{ required: true, message: '請輸入聯絡信箱', trigger: 'blur' },
		{ type: 'email' as const, message: '請輸入正確的電子信箱格式', trigger: 'blur' }
	],
	publish_start_date: [
		{ required: true, message: '請選擇體驗刊登開始日期', trigger: 'change' }
	],
	program_start_date: [
		{ required: true, message: '請選擇計畫開始日期', trigger: 'change' }
	],
	program_end_date: [
		{ required: true, message: '請選擇計畫結束日期', trigger: 'change' }
	]
});

const form = ref<CreateProgramPayload>({
	name: '',
	intro: '',
	industry_id: 0, // 初始為未選，載入後預設第一筆
	job_title_id: 0, // 初始為未選，載入後預設第一筆
	address: '',
	address_map: 'https://maps.example.com', // 暫用預設值
	contact_name: '',
	contact_phone: '',
	contact_email: '',
	min_people: 1,
	max_people: 5,
	publish_start_date: '',
	publish_duration_days: 30, // 暫用預設值
	program_start_date: '',
	program_end_date: '',
	steps: [
		{ name: '報到與簡介', description: '' },
		{ name: '程式設計工作坊', description: '' },
		{ name: '專案分享與回顧', description: '' },
	],
	images: [], // 圖片上傳邏輯待處理
});

// 下拉清單資料與選取值（依需求使用 title 作為 value）
const industries = ref<{ id: number, title: string }[]>([]);
const positions = ref<{ id: number, title: string }[]>([]);
const selectedIndustryTitle = ref<string>('');
const selectedPositionTitle = ref<string>('');

// 檔案上傳暫存與檢核
const uploadFiles = ref<File[]>([]);
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const { data: industriesData, pending: industriesPending, error: industriesError } = useCompanyIndustries();
const { data: positionsData, pending: positionsPending, error: positionsError } = useCompanyPositions();

watchEffect(() => {
	if (industriesData?.value) {
		industries.value = industriesData.value;
		// 預設從第一筆開始展示；若已有既定 id 則依 id 對應
		if (!selectedIndustryTitle.value) {
			if (form.value.industry_id) {
				const found = industries.value.find(i => i.id === form.value.industry_id);
				if (found) {
					selectedIndustryTitle.value = found.title;
				}
				else if (industries.value.length > 0) {
					selectedIndustryTitle.value = industries.value[0].title;
					form.value.industry_id = industries.value[0].id;
				}
			}
			else if (industries.value.length > 0) {
				selectedIndustryTitle.value = industries.value[0].title;
				form.value.industry_id = industries.value[0].id;
			}
		}
	}
	if (positionsData?.value) {
		positions.value = positionsData.value;
		if (!selectedPositionTitle.value) {
			if (form.value.job_title_id) {
				const found = positions.value.find(p => p.id === form.value.job_title_id);
				if (found) {
					selectedPositionTitle.value = found.title;
				}
				else if (positions.value.length > 0) {
					selectedPositionTitle.value = positions.value[0].title;
					form.value.job_title_id = positions.value[0].id;
				}
			}
			else if (positions.value.length > 0) {
				selectedPositionTitle.value = positions.value[0].title;
				form.value.job_title_id = positions.value[0].id;
			}
		}
	}
	if (industriesError?.value) {
		ElNotification({ title: '載入產業失敗', message: String(industriesError.value), type: 'error' });
	}
	if (positionsError?.value) {
		ElNotification({ title: '載入職務失敗', message: String(positionsError.value), type: 'error' });
	}
});

function addStep() {
	if (form.value.steps.length < 5) {
		form.value.steps.push({ name: '自定義項目', description: '' });
	}
}

function onUploadChange(file: any) {
	const raw: File | undefined = file?.raw;
	if (!raw) { return false; }
	if (!ACCEPTED_MIME_TYPES.includes(raw.type)) {
		ElNotification({ title: '格式不支援', message: '僅支援 jpg、jpeg、webp', type: 'warning' });
		return false;
	}
	if (raw.size > MAX_FILE_SIZE_BYTES) {
		ElNotification({ title: '檔案過大', message: '單檔大小不可超過 5MB', type: 'warning' });
		return false;
	}
	if (uploadFiles.value.length >= 4) {
		ElNotification({ title: '數量超過上限', message: '最多僅可上傳 4 張', type: 'warning' });
		return false;
	}
	uploadFiles.value.push(raw);
	return false;
}

function onUploadRemove(file: any) {
	const raw: File | undefined = file?.raw;
	if (!raw) { return; }
	uploadFiles.value = uploadFiles.value.filter(f => f !== raw);
}

// 背景處理圖片上傳，不阻塞用戶操作
async function handleImageUploadInBackground(programId: number, files: File[]) {
	// 顯示上傳開始通知
	ElNotification({
		title: '圖片上傳中',
		message: '正在背景上傳圖片，請稍候...',
		type: 'info',
		duration: 8000, // 延長到 8 秒
	});

	try {
		// 設定上傳超時時間（30秒）
		const uploadPromise = uploadProgramImages(programId, files);
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => reject(new Error('上傳超時')), 30000);
		});

		// 使用 Promise.race 來處理超時
		const result = await Promise.race([uploadPromise, timeoutPromise]);
		
		// 上傳成功，重新抓取程式列表
		await programStore.fetchPrograms();
		
		ElNotification({
			title: '上傳完成',
			message: '圖片已成功上傳並更新！',
			type: 'success',
			duration: 6000, // 延長到 6 秒
		});
	} catch (error) {
		
		// 根據錯誤類型顯示不同的通知
		if (error instanceof Error && error.message === '上傳超時') {
			ElNotification({
				title: '上傳超時',
				message: '圖片上傳時間過長，請稍後手動重新上傳。',
				type: 'warning',
				duration: 8000, // 延長到 8 秒
			});
		} else if (error instanceof Error && (error.message.includes('502') || error.message.includes('Bad Gateway'))) {
			ElNotification({
				title: '圖片伺服器維護中',
				message: '圖片上傳服務暫時維護中，計畫已建立完成，圖片將在服務恢復後自動上傳。',
				type: 'warning',
				duration: 10000, // 延長到 10 秒
			});
		} else {
			ElNotification({
				title: '上傳失敗',
				message: '圖片上傳失敗，請稍後手動重新上傳。',
				type: 'error',
				duration: 8000, // 延長到 8 秒
			});
		}
	}
}

async function handleSubmit() {
	if (!agreeToTerms.value) {
		ElNotification({
			title: '提示',
			message: '您必須同意服務條款與隱私權政策才能繼續。',
			type: 'warning',
		});
		return;
	}

	// 送出前：將使用者選到的 title 轉回對應 id
	const industryId = industries.value.find(i => i.title === selectedIndustryTitle.value)?.id;
	const positionId = positions.value.find(p => p.title === selectedPositionTitle.value)?.id;
	if (industryId) { form.value.industry_id = industryId; }
	if (positionId) { form.value.job_title_id = positionId; }

	// 使用 Element Plus 表單驗證
	if (!formRef.value) return;
	
	try {
		await formRef.value.validate();
	} catch (error) {
		// 驗證失敗，Element Plus 會自動顯示錯誤訊息
		return;
	}

	isLoading.value = true;
	try {
		const createResult: any = await programStore.createProgram(form.value);
		if (!createResult?.success) {
			ElNotification({ title: '錯誤', message: createResult?.error?.message || '建立計畫失敗，請稍後再試。', type: 'error' });
			return;
		}

		const newProgramId: number | undefined = createResult?.data?.id;
		if (!newProgramId) {
			ElNotification({ title: '錯誤', message: '建立成功但無法取得新計畫 ID。', type: 'error' });
			return;
		}

		// 顯示計畫建立成功的通知
		ElNotification({ 
			title: '成功', 
			message: '體驗計畫已建立完成！', 
			type: 'success',
			duration: 5000, // 延長到 5 秒
		});

		// 如果有圖片需要上傳，使用非阻塞方式處理
		if (uploadFiles.value.length > 0) {
			// 立即導航到公司首頁，不等待圖片上傳
			await navigateTo('/company');
			
			// 在背景處理圖片上傳
			handleImageUploadInBackground(newProgramId, uploadFiles.value);
		} else {
			// 沒有圖片，直接導航
			await navigateTo('/company');
		}
	}
	catch (e) {
		ElNotification({
			title: '系統錯誤',
			message: '發生未知錯誤，請聯繫管理員。',
			type: 'error',
			duration: 8000, // 延長到 8 秒
		});
	}
	finally {
		isLoading.value = false;
	}
}
</script>

<template>
	<div>
		<CompanyPlanStatusHeader />
		<el-card class="mt-6">
			<h2 class="text-2xl font-bold mb-6">
				新增體驗計畫
			</h2>
			<el-form
				ref="formRef"
				:model="form"
				:rules="rules"
				label-position="top"
				@submit.prevent="handleSubmit"
			>
				<el-form-item label="體驗名稱 (最多10個字)" prop="name" required>
					<el-input
						v-model="form.name"
						placeholder="請輸入體驗計畫的正式名稱"
					/>
				</el-form-item>
				<el-form-item label="體驗介紹" prop="intro" required>
					<el-input
						v-model="form.intro"
						type="textarea"
						:rows="6"
						placeholder="您可以描述&#10;1. 體驗計畫的內容與目標&#10;2. 師資陣容與經歷&#10;3. 行前須知和注意事項&#10;4. 參加體驗的門檻或限制"
					/>
				</el-form-item>

				<el-row :gutter="20">
					<el-col
						:xs="24"
						:sm="24"
						:md="12"
					>
						<el-form-item label="產業類別" prop="industry_id" required>
							<el-select
								v-model="selectedIndustryTitle"
								placeholder="請選擇產業類別"
								class="w-full min-w-form-control"
								:loading="industriesPending"
							>
								<template #empty>
									<div class="py-2 text-gray-500">
										{{ industriesPending ? '載入中…' : '無可選清單' }}
									</div>
								</template>
								<el-option
									v-for="i in industries"
									:key="i.id"
									:label="i.title"
									:value="i.title"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col
						:xs="24"
						:sm="24"
						:md="12"
					>
						<el-form-item label="職務類別" prop="job_title_id" required>
							<el-select
								v-model="selectedPositionTitle"
								placeholder="請選擇職務類別"
								class="w-full min-w-form-control"
								:loading="positionsPending"
							>
								<template #empty>
									<div class="py-2 text-gray-500">
										{{ positionsPending ? '載入中…' : '無可選清單' }}
									</div>
								</template>
								<el-option
									v-for="p in positions"
									:key="p.id"
									:label="p.title"
									:value="p.title"
								/>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="體驗地址" prop="address" required>
					<el-input
						v-model="form.address"
						placeholder="請輸入體驗地點的完整地址"
					/>
				</el-form-item>

				<el-row :gutter="20">
					<el-col
						:xs="24"
						:sm="24"
						:md="12"
					>
						<el-form-item label="聯絡人" prop="contact_name" required>
							<el-input
								v-model="form.contact_name"
								placeholder="請輸入聯絡人姓名"
							/>
						</el-form-item>
					</el-col>
					<el-col
						:xs="24"
						:sm="24"
						:md="12"
					>
						<el-form-item label="電話" prop="contact_phone" required>
							<el-input
								v-model="form.contact_phone"
								placeholder="請輸入聯絡電話"
							/>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="聯絡信箱" prop="contact_email" required>
					<el-input
						v-model="form.contact_email"
						placeholder="請輸入聯絡信箱"
					/>
				</el-form-item>

				<el-form-item label="計畫詳細說明">
					<div
						v-for="(step, index) in form.steps"
						:key="index"
						class="w-full mb-4"
					>
						<el-input
							v-model="step.name"
							class="mb-2"
							placeholder="請輸入此階段的標題"
						/>
						<el-input
							v-model="step.description"
							type="textarea"
							:rows="3"
							placeholder="描述此階段的內容、時間與目標"
						/>
					</div>

					<!-- <el-button :icon="Plus" @click="addStep" :disabled="form.steps.length >= 5">
          新增階段
        </el-button> -->
				</el-form-item>

				<el-form-item label="計畫日期與人數">
					<el-row
						:gutter="20"
						class="w-full"
					>
						<el-col
							:xs="24"
							:sm="24"
							:md="12"
						>
							<el-form-item label="體驗最少人數">
								<el-input-number
									v-model="form.min_people"
									:min="1"
									style="width: 100%"
								/>
							</el-form-item>
							<el-form-item label="體驗最多人數">
								<el-input-number
									v-model="form.max_people"
									:min="form.min_people"
									style="width: 100%"
								/>
							</el-form-item>
							<el-form-item label="體驗刊登開始日期" prop="publish_start_date" required>
								<el-date-picker
									v-model="form.publish_start_date"
									type="date"
									placeholder="請選擇開始日期"
									class="w-full"
									value-format="YYYY-MM-DD"
									style="width: 100%"
								/>
							</el-form-item>
							<el-form-item label="刊登期間(天)">
								<el-input-number
									v-model="form.publish_duration_days"
									:min="1"
									style="width: 100%"
								/>
							</el-form-item>
							<el-form-item label="計畫開始日期" prop="program_start_date" required>
								<el-date-picker
									v-model="form.program_start_date"
									type="date"
									placeholder="請選擇計畫開始日期"
									class="w-full"
									value-format="YYYY-MM-DD"
									style="width: 100%"
								/>
							</el-form-item>
							<el-form-item label="計畫結束日期" prop="program_end_date" required>
								<el-date-picker
									v-model="form.program_end_date"
									type="date"
									placeholder="請選擇計畫結束日期"
									class="w-full"
									value-format="YYYY-MM-DD"
									style="width: 100%"
								/>
							</el-form-item>
						</el-col>
						<el-col
							:xs="24"
							:sm="24"
							:md="12"
						>
							<el-form-item label="體驗照片 (可以留白，最多四張)">
								<el-upload
									action="#"
									list-type="picture-card"
									:auto-upload="false"
									multiple
									:limit="4"
									accept=".jpg,.jpeg,.webp"
									:before-upload="() => false"
									:on-change="onUploadChange"
									:on-remove="onUploadRemove"
									style="width: 100%"
								>
									<el-icon><Plus /></el-icon>
								</el-upload>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form-item>

				<el-form-item>
					<el-checkbox v-model="agreeToTerms">
						我已閱讀並同意 服務條款 與 隱私權政策
					</el-checkbox>
				</el-form-item>

				<el-form-item>
					<!-- <el-button>預覽</el-button> -->
					<el-button
						type="primary"
						:loading="isLoading"
						@click="handleSubmit"
					>
						送出
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
