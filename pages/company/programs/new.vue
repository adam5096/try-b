<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { useCompanyProgramStore } from '~/stores/company/useProgramStore';
import type { CreateProgramPayload } from '~/types/company/program';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'company',
  name: 'company-programs-new',
});

const programStore = useCompanyProgramStore();
const router = useRouter();
const isLoading = ref(false);
const agreeToTerms = ref(false);

const form = ref<CreateProgramPayload>({
  name: '',
  intro: '',
  industry_id: 10, // 暫用預設值
  job_title_id: 3, // 暫用預設值
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
    { name: 'AI 應用挑戰', description: '' },
  ],
  images: [], // 圖片上傳邏輯待處理
});

function addStep() {
  if (form.value.steps.length < 5) {
    form.value.steps.push({ name: '自定義項目', description: '' });
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

  isLoading.value = true;
  try {
    const { success, error } = await programStore.createProgram(form.value);

    if (success) {
      ElNotification({
        title: '成功',
        message: '體驗計畫已成功建立！',
        type: 'success',
      });
      router.push({ name: 'company-programs' }); 
    } else {
      ElNotification({
        title: '錯誤',
        message: error?.message || '建立計畫失敗，請稍後再試。',
        type: 'error',
      });
    }
  } catch (e) {
    console.error(e);
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
  <div class="p-6 bg-white rounded-lg shadow-sm">
    <div class="mb-6 flex justify-between items-center" role="alert">
      <div class="text-sm text-red-500">
        目前的方案 <span class="font-medium">已過期</span> 體驗人數 <span class="font-medium">已達上限</span>
      </div>
      <el-button type="primary">
        購買方案
      </el-button>
    </div>
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
        <el-col :span="12">
          <el-form-item label="產業類別">
            <el-select v-model="form.industry_id" placeholder="請選擇產業類別" class="w-full min-w-form-control md:max-w-form-select">
              <!-- TODO: 之後需串接取得產業類別 API -->
              <el-option label="資訊科技" :value="10" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="職務類別">
            <el-select v-model="form.job_title_id" placeholder="請選擇職務類別" class="w-full min-w-form-control md:max-w-form-select">
              <!-- TODO: 之後需串接取得職務類別 API -->
              <el-option label="軟體工程師" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="體驗地址">
        <el-input v-model="form.address" placeholder="請輸入體驗地點的完整地址" />
      </el-form-item>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="聯絡人">
            <el-input v-model="form.contact_name" placeholder="請輸入聯絡人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="電話">
            <el-input v-model="form.contact_phone" placeholder="請輸入聯絡電話" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="聯絡信箱">
        <el-input v-model="form.contact_email" placeholder="請輸入聯絡信箱" />
      </el-form-item>

      <el-form-item label="計畫詳細說明 (計劃說明最多可新增至五個階段)">
        <div v-for="(step, index) in form.steps" :key="index" class="w-full mb-4">
          <el-input v-model="step.name" class="mb-2" placeholder="請輸入此階段的標題" />
          <el-input v-model="step.description" type="textarea" :rows="3" placeholder="描述此階段的內容、時間與目標" />
        </div>
        
        <el-button :icon="Plus" @click="addStep" :disabled="form.steps.length >= 5">
          新增階段
        </el-button>
      </el-form-item>

      <el-form-item label="計畫日期與人數">
        <el-row :gutter="20" class="w-full">
          <el-col :span="12">
            <el-form-item label="體驗最少人數">
               <el-input-number v-model="form.min_people" :min="1" />
            </el-form-item>
            <el-form-item label="體驗最多人數">
               <el-input-number v-model="form.max_people" :min="form.min_people" />
            </el-form-item>
            <el-form-item label="體驗刊登開始日期">
              <el-date-picker v-model="form.publish_start_date" type="date" placeholder="請選擇開始日期" class="w-full" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="刊登期間(天)">
              <el-input-number v-model="form.publish_duration_days" :min="1" />
            </el-form-item>
            <el-form-item label="計畫開始日期">
              <el-date-picker v-model="form.program_start_date" type="date" placeholder="請選擇計畫開始日期" class="w-full" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="計畫結束日期">
              <el-date-picker v-model="form.program_end_date" type="date" placeholder="請選擇計畫結束日期" class="w-full" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="體驗照片 (最多四張)">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                multiple
                :limit="4"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="agreeToTerms">
          我已閱讀並同意 <el-link type="primary">服務條款</el-link> 與 <el-link type="primary">隱私權政策</el-link>
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button>預覽</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">
          送出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 