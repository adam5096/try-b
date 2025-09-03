<script setup lang="ts">
definePageMeta({
  name: 'company-program-applicants-list',
  layout: 'company',
});

import { ref, computed, onMounted } from 'vue'
import { useApplicants } from '~/composables/api/company/useApplicants';

const route = useRoute()
const authStore = useCompanyAuthStore();

const { data: applicantsData, pending, error: applicantsError, refresh: refreshApplicants } = useApplicants(
  computed(() => authStore.companyId),
  computed(() => Array.isArray(route.params.programId) ? route.params.programId[0] : route.params.programId),
);

onMounted(() => {
  console.log('🔍 申請者列表頁面載入');
  console.log('Company ID:', authStore.companyId);
  console.log('Program ID:', route.params.programId);
  console.log('Auth Store:', authStore);
  refreshApplicants();
});

// 監聽錯誤
watch(applicantsError, (error) => {
  if (error) {
    console.error('❌ 申請者 API 請求失敗:', error);
  }
}, { immediate: true });

// 監聽資料變化
watch(applicantsData, (data) => {
  console.log('📊 申請者資料更新:', data);
}, { immediate: true });

const pendingApplicants = computed(() => applicantsData.value?.PendingApplications || []);
const reviewedApplicants = computed(() => applicantsData.value?.ReviewedApplications || []);
const totalApplicants = computed(() => applicantsData.value?.Statistics?.TotalApplicants || 0);
const allApplicants = computed(() => [
  ...(applicantsData.value?.PendingApplications || []),
  ...(applicantsData.value?.ReviewedApplications || []),
]);

const pendingSort = ref('date-desc')
const approvedSort = ref('date-desc')
const approvedStatus = ref('all')
</script>

<template>
  <div class="p-6 lg:p-8">
    <CompanyPlanStatusHeader />

    <!-- Page Header -->
    <div class="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-zinc-900 flex-shrink-0 whitespace-nowrap">
        體驗者申請列表
      </h1>
      <el-input placeholder="搜尋申請者姓名、計畫名稱..." class="w-full md:w-72">
        <template #append>
          <el-button>
            <span class="material-icons-outlined">search</span>
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- Pending Applicants -->
    <div class="card-base mb-6 bg-white">
      <div class="flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <h2 class="card-title">
          待審核申請 ({{ pendingApplicants.length }})
        </h2>
          <div class="flex items-center gap-2">
          <span class="text-sm text-zinc-500 whitespace-nowrap">排序方式：</span>
          <ClientOnly>
              <el-select v-model="pendingSort" size="small" class="w-full min-w-form-control md:max-w-form-select">
              <el-option label="日期 - 新到舊" value="date-desc" />
              <el-option label="日期 - 舊到新" value="date-asc" />
            </el-select>
          </ClientOnly>
        </div>
      </div>
      <el-table :data="pendingApplicants" style="width: 100%" v-loading="pending">
        <el-table-column label="申請者" min-width="150">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <div>
                <p class="font-bold">
                  {{ row.applicant_name }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="submit_date" label="申請日期" min-width="150" />
        <el-table-column label="審核日期" min-width="150">
          <template #default>
            <span>-</span>
          </template>
        </el-table-column>
        <el-table-column label="狀態" min-width="150">
          <template #default="{ row }">
            <span class="tag-amber">{{ row.review_status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <template #default="{ row }">
            <NuxtLink
              :to="{
                name: 'company-program-applicant-detail',
                params: { programId: route.params.programId, applicantId: row.participant_id },
              }"
            >
              <el-button type="primary">
                查看
              </el-button>
            </NuxtLink>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Approved Applicants -->
    <div class="card-base mb-6 bg-white">
      <div class="flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <h2 class="card-title">
          已審核申請 ({{ reviewedApplicants.length }})
        </h2>
        <div class="flex flex-wrap items-center justify-end gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-zinc-500 whitespace-nowrap">排序方式：</span>
            <ClientOnly>
              <el-select placeholder="排序方式" v-model="approvedSort" size="small" class="w-full min-w-form-control md:max-w-form-select">
                <el-option label="日期 - 新到舊" value="date-desc" />
                <el-option label="日期 - 舊到新" value="date-asc" />
              </el-select>
            </ClientOnly>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-zinc-500 whitespace-nowrap">狀態：</span>
            <ClientOnly>
              <el-select v-model="approvedStatus" size="small" class="w-full min-w-form-control md:max-w-form-select">
                <el-option label="全部" value="all" />
                <el-option label="已通過" value="approved" />
                <el-option label="已拒絕" value="rejected" />
              </el-select>
            </ClientOnly>
          </div>
        </div>
      </div>
      <el-table :data="reviewedApplicants" style="width: 100%" v-loading="pending">
        <el-table-column label="申請者" min-width="150">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <div>
                <p class="font-bold">
                  {{ row.applicant_name }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="submit_date" label="申請日期" min-width="150" />
        <el-table-column label="審核日期" min-width="150">
          <template #default="{ row }">
            <span>{{ row.review_date || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="狀態" min-width="150">
          <template #default="{ row }">
            <span :class="{ 'tag-green': row.review_status === 'Approved', 'tag-red': row.review_status === 'Cancelled' }">{{
              row.review_status
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <template #default="{ row }">
            <NuxtLink
              :to="{
                name: 'company-program-applicant-detail',
                params: { programId: route.params.programId, applicantId: row.participant_id },
              }"
            >
              <el-button type="primary">
                查看
              </el-button>
            </NuxtLink>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-zinc-500">
        顯示 1-{{ totalApplicants }} 筆，共 {{ totalApplicants }} 筆申請
      </p>
      <el-pagination background layout="prev, pager, next" :total="totalApplicants" />
    </div>
  </div>
</template> 