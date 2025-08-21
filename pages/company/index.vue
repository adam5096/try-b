<script lang="ts" setup>
import {
  Search,
  Briefcase,
  Location,
  User,
} from '@element-plus/icons-vue';
import { computed, onMounted, watch } from 'vue';
import dayjs from 'dayjs';
import { useCompanyProgramStore } from '~/stores/company/useProgramStore';
import type { Program } from '~/types/company/program';

definePageMeta({
  layout: 'company',
  name: 'company-index',
});

const searchForm = {
  name: '',
  industry: '',
  job_type: '',
  sort: 'date_desc',
};

const programStore = useCompanyProgramStore();
const programs = computed<Program[]>(() => programStore.programs);

onMounted(() => {
  programStore.fetchPrograms();
});

watch(programs, (newPrograms) => {
  if (newPrograms && newPrograms.length > 0) {
    console.log('API Response (Programs):', JSON.parse(JSON.stringify(newPrograms)));
  }
}, { immediate: true });

const handlePageChange = (page: number) => {
  programStore.setPage(page);
};
</script>

<template>
  <div>
    <!-- Header -->
    <div class="p-4 bg-white rounded-lg">
      <p class="text-sm text-gray-500">
        目前的方案 日期：2025/7/1 - 2025/8/1 10:10AM 體驗人數上限 10 人 剩餘體驗人數 5 人
      </p>
    </div>

    <!-- Main Content -->
    <div class="mt-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">
            所有計畫列表
          </h1>
          <p class="text-gray-500">
            管理您的所有體驗計畫，查看各計畫狀態及詳情
          </p>
        </div>
      </div>

      <!-- Filters -->
      <el-card class="mt-4">
        <div class="flex items-center gap-4">
          <el-input v-model="searchForm.name" placeholder="搜尋計畫名稱..." :prefix-icon="Search" class="w-full md:max-w-form-search" />
          <el-select v-model="searchForm.industry" placeholder="產業類別" class="w-full min-w-form-control md:max-w-form-select">
            <el-option label="資訊科技" value="tech" />
            <el-option label="行銷廣告" value="marketing" />
          </el-select>
          <el-select v-model="searchForm.job_type" placeholder="職務類別" class="w-full min-w-form-control md:max-w-form-select">
            <el-option label="軟體工程師" value="swe" />
            <el-option label="產品設計師" value="pd" />
          </el-select>
          <el-select v-model="searchForm.sort" placeholder="排序方式" class="w-full min-w-form-control md:max-w-form-select">
            <el-option label="日期：由新到舊" value="date_desc" />
            <el-option label="日期：由舊到新" value="date_asc" />
          </el-select>
        </div>
      </el-card>

      <!-- Tabs -->
      <el-tabs model-value="all" class="mt-4">
        <el-tab-pane label="全部計畫 (6)" name="all" />
        <el-tab-pane label="已通過 (4)" name="passed" />
        <el-tab-pane label="已發布 (2)" name="published" />
        <el-tab-pane label="待發布 (2)" name="pending" />
        <el-tab-pane label="已拒絕 (1)" name="rejected" />
        <el-tab-pane label="審核中 (1)" name="reviewing" />
      </el-tabs>

      <!-- Plan Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <el-card v-for="program in programs" :key="program.Id">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-bold">{{ program.Name }}</span>
              <el-tag type="info">
                狀態待確認
              </el-tag>
            </div>
          </template>
          <div class="text-gray-600 mb-4">
            {{ program.Intro }}
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <el-icon><Briefcase /></el-icon>
              <span>{{ program.Industry.Title }}</span>
              <span class="ml-auto text-gray-500">{{ dayjs(program.ProgramStartDate).format('YYYY/MM/DD') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <el-icon><Location /></el-icon>
              <span>地點待確認</span>
            </div>
            <div class="flex items-center gap-2">
              <el-icon><User /></el-icon>
              <span>成行人數：人數待確認</span>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between items-center">
              <span>已申請人數：
                <span class="text-red-500">
                  人數待確認
                </span>
              </span>
              <NuxtLink :to="`/company/programs/${program.Id}`">
                <el-button type="primary" plain>
                  查看詳情
                </el-button>
              </NuxtLink>
            </div>
          </template>
        </el-card>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-8">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="programStore.total"
          :page-size="programStore.limit"
          :current-page="programStore.page"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style> 