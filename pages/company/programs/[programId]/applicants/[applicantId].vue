<script setup lang="ts">
definePageMeta({
  name: 'company-program-applicant-detail',
  layout: 'company',
});

import { computed, ref, reactive } from 'vue';
import { useCompanyApplicant } from '~/composables/api/company/useCompanyApplicant';
import { useCompanySubmitReview } from '~/composables/api/company/useCompanySubmitReview';
import { ElMessageBox, ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import {
  User,
  Briefcase,
  MapLocation,
  Link,
  Phone,
  Document,
  Download,
} from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import type { ApplicantDetail, ProgramPlan } from '~/types/company/applicant';

const route = useRoute();
const {
  submit: submitReviewApi,
  loading: isSubmitting,
  error: submitError,
  data: submitResult,
} = useCompanySubmitReview();

const formRef = ref<FormInstance>();

const authStore = useCompanyAuthStore();

const { data: applicantData, pending } = useCompanyApplicant(
  computed(() => authStore.companyId),
  computed(() => String(route.params.programId)),
  computed(() => String(route.params.applicantId)),
);

const applicant = computed<Partial<ApplicantDetail>>(() => applicantData.value || {});
const programPlan = computed<Partial<ProgramPlan>>(() => applicant.value?.program_plan || {});
const skills = computed(() => applicant.value?.Skills || []);
const attachments = computed(() => (applicant.value?.PortfolioFiles || []).map(file => ({
  name: file.title,
  size: file.file_size,
  date: 'N/A', // API does not provide date
  icon: Document,
  path: file.portfolio_path,
})));
const pastPrograms = computed(() => applicant.value?.past_programs || []);

const decisionForm = ref({
  status: 'pending', // 'pending' = 核准申請, 'rejected' = 婉拒申請
  feedback: '',
  notifyMethod: 'email',
});

const rules = reactive<FormRules>({
  feedback: [
    { required: true, message: '請填寫審核意見。', trigger: 'blur' },
  ],
});

const submitReview = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      const programId = String(route.params.programId);
      const applicantId = String(route.params.applicantId);

      await submitReviewApi(authStore.companyId, programId, applicantId, {
        status_id: decisionForm.value.status === 'pending' ? 2 : 3, // 2=核准申請, 3=婉拒申請
        comment: decisionForm.value.feedback,
      });

      if (submitError.value) {
        // 直接顯示 HTTP 400 的 response body 內容
        const responseBody = submitError.value.data?.Message || submitError.value.data?.message || submitError.value.message || '未知錯誤';
        
        await ElMessageBox.alert(
          responseBody,
          '錯誤',
          { type: 'error' },
        );
      } else if (submitResult.value) {
        await ElMessageBox.alert(submitResult.value.comment, '審核完成', {
          type: 'success',
          callback: async () => {
            await navigateTo({
              name: 'company-program-applicants-list',
              params: {
                programId,
              },
            });
          },
        });
      }
    }
  });
};
</script>

<template>
  <div>
    <!-- Header -->
    <CompanyPlanStatusHeader />

    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900">
          體驗者審核
        </h1>
        <p class="text-sm text-zinc-500">
          審核申請者資料決定是否錄取其參與體驗計畫
        </p>
      </div>
      <NuxtLink
        :to="{
          name: 'company-program-applicants-list',
          params: { programId: route.params.programId },
        }"
      >
        <el-button>返回申請列表</el-button>
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <div v-if="pending" class="text-center">
      資料載入中...
    </div>
    <div v-else-if="applicantData" class="space-y-6">
      <!-- Applicant Info -->
      <el-card>
        <div class="flex flex-col md:flex-row items-start gap-6">
          <el-avatar
            :size="100"
            :src="applicant.headshot"
          />
          <div class="flex-1">
            <h2 class="text-xl font-bold">
              {{ applicant.name }}
            </h2>
            <p class="text-sm text-zinc-500 mb-4">
              {{ applicant.participant_serial_num }}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-zinc-700">
              <div class="flex items-center gap-2">
                <el-icon><User /></el-icon>
                <span>{{ applicant.identity_name }} | {{ applicant.age }} 歲</span>
              </div>
              <div class="flex items-center gap-2">
                <el-icon><Briefcase /></el-icon>
                <span>{{ applicant.school_name }} {{ applicant.major }}</span>
              </div>
              <div class="flex items-center gap-2">
                <el-icon><Briefcase /></el-icon>
                <span>{{ applicant.status_name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <el-icon><MapLocation /></el-icon>
                <span>{{ applicant.address }}</span>
              </div>
              <div class="flex items-center gap-2">
              <el-icon><Link /></el-icon>
              <a :href="`mailto:${applicant.email}`" class="text-blue-500 hover:underline">{{
                applicant.email
              }}</a>
            </div>
            <div class="flex items-center gap-2">
              <el-icon><Phone /></el-icon>
              <span>{{ applicant.phone }}</span>
            </div>
            </div>
            <div class="flex items-center gap-2 mt-4">
              <el-rate :model-value="applicant.average_score || 0" disabled />
              <span class="text-sm text-zinc-500">({{ applicant.review_count || 0 }} 次評價)</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- Application Details -->
      <el-card>
        <template #header>
          <h3 class="font-bold text-zinc-900">
            申請計畫
          </h3>
        </template>
        <el-descriptions border :column="1">
          <el-descriptions-item label="計畫名稱">
            {{ programPlan.program_name }}
          </el-descriptions-item>
          <el-descriptions-item label="計畫編號">
            {{ programPlan.serial_num }}
          </el-descriptions-item>
          <el-descriptions-item label="計畫時間">
            {{ dayjs(programPlan.program_start_date).format('YYYY/MM/DD') }} - {{ dayjs(programPlan.program_end_date).format('YYYY/MM/DD') }} (共 {{ programPlan.program_duration_days }} 天)
          </el-descriptions-item>
          <el-descriptions-item label="體驗地點">
            {{ programPlan.address }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- Motivation -->
      <el-card>
        <template #header>
          <h3 class="font-bold text-zinc-900">
            申請動機
          </h3>
        </template>
        <p class="text-zinc-700 leading-relaxed">
          {{ applicant.motivation_content }}
        </p>
      </el-card>

      <!-- Skills -->
      <el-card>
        <template #header>
          <h3 class="font-bold text-zinc-900">
            技能與專長
          </h3>
        </template>
        <div class="flex flex-wrap gap-2">
          <el-tag v-for="skill in skills" :key="skill" type="info">
            {{ skill }}
          </el-tag>
        </div>
      </el-card>

      <!-- Attachments -->
      <el-card>
        <template #header>
          <h3 class="font-bold text-zinc-900">
            附件資料 (作品集)
          </h3>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="file in attachments"
            :key="file.name"
            class="border rounded-lg p-4 flex items-center gap-4 hover:bg-zinc-50 transition"
          >
            <el-icon :size="32" class="text-zinc-500">
              <component :is="file.icon" />
            </el-icon>
            <div class="flex-1">
              <p class="font-medium text-zinc-800">
                {{ file.name }}
              </p>
              <p class="text-xs text-zinc-500">
                {{ file.size }}
              </p>
            </div>
            <el-button :icon="Download" circle plain />
          </div>
        </div>
      </el-card>

      <!-- Past Programs -->
      <el-card>
        <template #header>
          <h3 class="font-bold text-zinc-900">
            過去參加的體驗計畫
          </h3>
        </template>
        <el-table :data="pastPrograms" style="width: 100%">
          <el-table-column prop="program_name" label="體驗計畫名稱" />
          <el-table-column label="日期">
            <template #default="{ row }">
              {{ dayjs(row.program_start_date).format('YYYY/MM/DD') }} - {{ dayjs(row.program_end_date).format('YYYY/MM/DD') }}
            </template>
          </el-table-column>
          <el-table-column prop="participation_status" label="體驗參與狀態" />
          <el-table-column prop="cancel_reason" label="取消原因">
            <template #default="{ row }">
              {{ row.cancel_reason || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="體驗評價">
            <template #default="{ row }">
              <el-rate :model-value="row.review_score || 0" disabled />
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- Decision -->
      <el-card>
        <template #header>
          <h3 class="font-bold text-zinc-900">
            審核決定
          </h3>
        </template>
        <el-form
          ref="formRef"
          :model="decisionForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="審核結果" prop="status">
            <el-radio-group v-model="decisionForm.status">
              <el-radio :value="'pending'">
                核准申請
              </el-radio>
              <el-radio :value="'rejected'">
                婉拒申請
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="審核意見" prop="feedback">
            <el-input
              v-model="decisionForm.feedback"
              type="textarea"
              :rows="4"
              placeholder="請輸入您對此申請的意見或要求補充的資料..."
            />
          </el-form-item>
          <el-form-item label="通知方式">
            <p class="text-sm text-zinc-600">
              電子郵件
            </p>
          </el-form-item>
          <el-form-item class="mt-6">
            <div class="flex-1 flex justify-end gap-4">
              <el-button>取消</el-button>
              <el-button
                type="primary"
                :loading="isSubmitting"
                @click="submitReview(formRef)"
              >
                提交審核結果
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
