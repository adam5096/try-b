<script setup lang="ts">
import { ref } from 'vue';
import {
  User,
  Briefcase,
  MapLocation,
  Calendar,
  Document,
  Edit,
  Delete,
  Plus,
  DataLine,
} from '@element-plus/icons-vue';

const route = useRoute();

definePageMeta({
  name: 'company-program-detail',
  layout: 'company',
});

const program = {
  title: '軟體工程師體驗日',
  status: '審核中',
  statusTag: 'info',
  description:
    '此體驗計畫旨在提供參與者深入了解軟體工程師的日常工作與挑戰。內容涵蓋前端與後端開發、版本控制、敏捷開發流程等。學員將有機會與業界資深工程師互動，並參與小型專案實作。',
  industry: '資訊科技',
  location: '台北市信義區松仁路100號',
  headcount: '5-10人',
  startDate: '2025/08/15',
  endDate: '2025/08/16',
  publishDate: '2025/07/15',
  applicationDeadline: '2025/08/01',
};

const applicants = [
  {
    id: 1,
    name: '林小美',
    school: '台灣大學',
    major: '資訊工程學系',
    applyDate: '2025/07/20',
    status: '待審核',
    statusTag: 'warning',
  },
  {
    id: 2,
    name: '王大明',
    school: '成功大學',
    major: '電機工程學系',
    applyDate: '2025/07/21',
    status: '已通過',
    statusTag: 'success',
  },
  {
    id: 3,
    name: '張雅琪',
    school: '交通大學',
    major: '資訊管理學系',
    applyDate: '2025/07/22',
    status: '已拒絕',
    statusTag: 'danger',
  },
];

const timeline = [
  {
    content: '發布體驗計畫',
    timestamp: '2025-07-15',
    type: 'primary',
  },
  {
    content: '收到新的申請',
    timestamp: '2025-07-20',
  },
  {
    content: '審核通過一位申請者',
    timestamp: '2025-07-23',
  },
  {
    content: '計畫開始',
    timestamp: '2025-08-15',
  },
];
</script>

<template>
  <div class="p-6 lg:p-8">
    <!-- Top info bar -->
    <div class="mb-6 rounded-lg bg-zinc-100 p-4">
      <p class="text-sm text-zinc-600">
        目前的方案 日期：2025/7/1 - 2025/8/1 10:10AM 體驗人數上限 10 人 剩餘體驗人數 5 人
      </p>
    </div>

    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-zinc-900">
        數位行銷實習體驗計畫
      </h1>
      <p class="text-sm text-zinc-500">
        計畫ID: PRJ-20230615-001 | 狀態: 已發布
      </p>
    </div>

    <!-- Stats Card -->
    <el-card class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="text-lg font-bold text-zinc-800">
              申請統計
            </h3>
            <el-icon><DataLine /></el-icon>
          </div>
          <div class="space-y-3">
            <div class="flex items-baseline justify-between">
              <p class="text-base text-zinc-600">
                總申請人數
              </p>
              <p class="text-3xl font-bold text-blue-500">
                42
              </p>
            </div>
            <div class="flex items-baseline justify-between">
              <p class="text-base text-zinc-600">
                已審核
              </p>
              <p class="text-3xl font-bold text-green-600">
                28
              </p>
            </div>
            <div class="flex items-baseline justify-between">
              <p class="text-base text-zinc-600">
                待審核
              </p>
              <p class="text-3xl font-bold text-amber-500">
                14
              </p>
            </div>
          </div>
        </div>
        <div class="w-full md:w-auto flex-shrink-0">
          <NuxtLink
            :to="{
              name: 'company-program-applicants-list',
              params: { programId: route.params.programId },
            }"
          >
            <el-button type="primary" size="large" class="w-full">
              查看申請者列表
            </el-button>
          </NuxtLink>
        </div>
      </div>
    </el-card>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Program Details -->
        <el-card>
          <template #header>
            <h3 class="font-bold text-zinc-900">
              計畫詳細資訊
            </h3>
          </template>
          <p class="text-zinc-700 leading-relaxed mb-6">
            {{ program.description }}
          </p>
          <el-descriptions border :column="2">
            <el-descriptions-item>
              <template #label>
                <div class="flex items-center gap-2">
                  <el-icon><Briefcase /></el-icon>
                  <span>產業類別</span>
                </div>
              </template>
              {{ program.industry }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="flex items-center gap-2">
                  <el-icon><User /></el-icon>
                  <span>成行人數</span>
                </div>
              </template>
              {{ program.headcount }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="flex items-center gap-2">
                  <el-icon><MapLocation /></el-icon>
                  <span>體驗地點</span>
                </div>
              </template>
              {{ program.location }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="flex items-center gap-2">
                  <el-icon><Calendar /></el-icon>
                  <span>體驗日期</span>
                </div>
              </template>
              {{ program.startDate }} - {{ program.endDate }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Applicants -->
        <el-card>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-zinc-900">
                已申請者 (3)
              </h3>
              <NuxtLink
                :to="{
                  name: 'company-program-applicants-list',
                  params: { programId: route.params.programId },
                }"
              >
                <el-button type="primary" plain>
                  查看所有申請者
                </el-button>
              </NuxtLink>
            </div>
          </template>
          <el-table :data="applicants" style="width: 100%">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="school" label="學校" />
            <el-table-column prop="major" label="科系" />
            <el-table-column prop="applyDate" label="申請日期" />
            <el-table-column label="狀態">
              <template #default="{ row }">
                <el-tag :type="row.statusTag">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <NuxtLink
                  :to="{
                    name: 'company-program-applicant-detail',
                    params: { programId: route.params.programId, applicantId: row.id },
                  }"
                >
                  <el-button type="primary" size="small">
                    查看
                  </el-button>
                </NuxtLink>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Key Dates -->
        <el-card>
          <template #header>
            <h3 class="font-bold text-zinc-900">
              重要日期
            </h3>
          </template>
          <el-descriptions direction="vertical" :column="1">
            <el-descriptions-item label="發布日期">
              {{ program.publishDate }}
            </el-descriptions-item>
            <el-descriptions-item label="申請截止日期">
              {{ program.applicationDeadline }}
            </el-descriptions-item>
            <el-descriptions-item label="體驗開始日期">
              {{ program.startDate }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Timeline -->
        <el-card>
          <template #header>
            <h3 class="font-bold text-zinc-900">
              計畫動態
            </h3>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in timeline"
              :key="index"
              :timestamp="activity.timestamp"
              :type="activity.type"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </div>
    </div>
  </div>
</template>
