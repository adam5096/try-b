<script setup lang="ts">
definePageMeta({
  layout: 'company',
  name: 'company-programs-new',
  ssr: false, // CSR 模式
});

import { ref, watchEffect } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { useCompanyProgramStore } from '~/stores/company/useProgramStore';
import type { CreateProgramPayload } from '~/types/company/program';
import { useRouter } from 'vue-router';
import { useCompanyIndustries } from '~/composables/api/company/useCompanyIndustries';
import { useCompanyPositions } from '~/composables/api/company/useCompanyPositions';
import { uploadProgramImages } from '~/composables/api/company/useCompanyUploadProgramImages';

const programStore = useCompanyProgramStore();
const router = useRouter();
const isLoading = ref(false);
const agreeToTerms = ref(false);

const form = ref<CreateProgramPayload>({
  name: '',
  intro: '',
  industry_id: 0, // 初始為未選，載入後預設第一筆
  job_title_id: 0, // 初始為未選，載入後預設第一筆
  address: '',
  address_map: 'https://maps.example.com', // 暫用預設值
  contact_name: '',
  contact_phone: '0933-456-789',
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
const industries = ref<{ id: number; title: string }[]>([]);
const positions = ref<{ id: number; title: string }[]>([]);
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
        } else if (industries.value.length > 0) {
          selectedIndustryTitle.value = industries.value[0].title;
          form.value.industry_id = industries.value[0].id;
        }
      } else if (industries.value.length > 0) {
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
        } else if (positions.value.length > 0) {
          selectedPositionTitle.value = positions.value[0].title;
          form.value.job_title_id = positions.value[0].id;
        }
      } else if (positions.value.length > 0) {
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
  if (!raw) return false;
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
  if (!raw) return;
  uploadFiles.value = uploadFiles.value.filter(f => f !== raw);
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
  if (industryId) form.value.industry_id = industryId;
  if (positionId) form.value.job_title_id = positionId;

  // 開發模式下輸出選擇結果，便於除錯

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

    if (uploadFiles.value.length > 0) {
      try {
        const uploadResult = await uploadProgramImages(newProgramId, uploadFiles.value);
        
        // 圖片上傳後，重新抓取程式列表以確保 CoverImage 更新
        await programStore.fetchPrograms();
      } catch (e) {
        ElNotification({ title: '部分失敗', message: '計畫已建立，但圖片上傳失敗。', type: 'warning' });
        return; // 停留在本頁讓使用者可重試
      }
    }

    ElNotification({ title: '成功', message: '體驗計畫與圖片已上傳完成！', type: 'success' });
    await navigateTo('/company');
  } catch (e) {
    ElNotification({
      title: '系統錯誤',
      message: '發生未知錯誤，請聯繫管理員。',
      type: 'error',
    });
  } finally {
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
      <el-form :model="form" label-position="top" @submit.prevent="handleSubmit">
      <el-form-item label="體驗名稱 (最多10個字)">
        <el-input v-model="form.name" placeholder="請輸入體驗計畫的正式名稱" />
      </el-form-item>
      <el-form-item label="體驗介紹">
        <el-input
          v-model="form.intro"
          type="textarea"
          :rows="6"
          placeholder="您可以描述&#10;1. 體驗計畫的內容與目標&#10;2. 師資陣容與經歷&#10;3. 行前須知和注意事項&#10;4. 參加體驗的門檻或限制"
        />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="產業類別">
            <el-select v-model="selectedIndustryTitle" placeholder="請選擇產業類別" class="w-full min-w-form-control" :loading="industriesPending">
              <template #empty>
                <div class="py-2 text-gray-500">{{ industriesPending ? '載入中…' : '無可選清單' }}</div>
              </template>
              <el-option v-for="i in industries" :key="i.id" :label="i.title" :value="i.title" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="職務類別">
            <el-select v-model="selectedPositionTitle" placeholder="請選擇職務類別" class="w-full min-w-form-control" :loading="positionsPending">
              <template #empty>
                <div class="py-2 text-gray-500">{{ positionsPending ? '載入中…' : '無可選清單' }}</div>
              </template>
              <el-option v-for="p in positions" :key="p.id" :label="p.title" :value="p.title" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="體驗地址">
        <el-input v-model="form.address" placeholder="請輸入體驗地點的完整地址" />
      </el-form-item>
      
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="聯絡人">
            <el-input v-model="form.contact_name" placeholder="請輸入聯絡人姓名" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item label="電話">
            <el-input v-model="form.contact_phone" placeholder="請輸入聯絡電話" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="聯絡信箱">
        <el-input v-model="form.contact_email" placeholder="請輸入聯絡信箱" />
      </el-form-item>

      <el-form-item label="計畫詳細說明">
        <div v-for="(step, index) in form.steps" :key="index" class="w-full mb-4">
          <el-input v-model="step.name" class="mb-2" placeholder="請輸入此階段的標題" />
          <el-input v-model="step.description" type="textarea" :rows="3" placeholder="描述此階段的內容、時間與目標" />
        </div>
        
        <!-- <el-button :icon="Plus" @click="addStep" :disabled="form.steps.length >= 5">
          新增階段
        </el-button> -->
      </el-form-item>

      <el-form-item label="計畫日期與人數">
        <el-row :gutter="20" class="w-full">
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="體驗最少人數">
               <el-input-number v-model="form.min_people" :min="1" style="width: 100%" />
            </el-form-item>
            <el-form-item label="體驗最多人數">
               <el-input-number v-model="form.max_people" :min="form.min_people" style="width: 100%" />
            </el-form-item>
            <el-form-item label="體驗刊登開始日期">
              <el-date-picker v-model="form.publish_start_date" type="date" placeholder="請選擇開始日期" class="w-full" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
            <el-form-item label="刊登期間(天)">
              <el-input-number v-model="form.publish_duration_days" :min="1" style="width: 100%" />
            </el-form-item>
            <el-form-item label="計畫開始日期">
              <el-date-picker v-model="form.program_start_date" type="date" placeholder="請選擇計畫開始日期" class="w-full" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
            <el-form-item label="計畫結束日期">
              <el-date-picker v-model="form.program_end_date" type="date" placeholder="請選擇計畫結束日期" class="w-full" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
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
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">
          送出
        </el-button>
      </el-form-item>
      </el-form>
    </el-card>
  </div>
</template> 