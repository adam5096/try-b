<script setup lang="ts">
definePageMeta({
  name: 'user-applications',
  layout: 'user',
});

import { ref, computed } from 'vue';

type ApplicationStatus = '待審核' | '已通過' | '未通過' | '已取消' | '已完成';

interface ApplicationItem {
  id: number;
  title: string;
  company: string;
  appliedAt: string; // YYYY/MM/DD
  status: ApplicationStatus;
  location: string;
  dateFrom: string; // YYYY/MM/DD
  dateTo: string;   // YYYY/MM/DD
  participantsRange: string; // e.g. "2-5人"
  description: string;
  organizer: string;
}

const isFilterDialogVisible = ref(false);
const selectedStatus = ref<ApplicationStatus | ''>('');
const selectedDateRange = ref<[Date, Date] | ''>('');

const statusOptions: ApplicationStatus[] = ['待審核', '已通過', '未通過', '已取消', '已完成'];

const applicationList = ref<ApplicationItem[]>([
  {
    id: 101,
    title: '太魯閣峽谷健行體驗',
    company: '花蓮山岳協會',
    appliedAt: '2025/10/15',
    status: '待審核',
    location: '花蓮縣秀林鄉',
    dateFrom: '2025/11/20',
    dateTo: '2025/11/22',
    participantsRange: '2-5人',
    description:
      '這個三天兩夜的健行體驗將帶您探索台灣最壯麗的峽谷地形，沿途欣賞大理石峭壁與清澈溪流，感受太魯閣國家公園的自然之美。',
    organizer: '花蓮山岳協會',
  },
  {
    id: 102,
    title: 'UI/UX 設計師工作坊',
    company: '設計工作室 E',
    appliedAt: '2025/07/15',
    status: '已通過',
    location: '台北市大安區',
    dateFrom: '2025/08/01',
    dateTo: '2025/08/02',
    participantsRange: '10-20人',
    description: '深入設計思維流程，從用戶研究到原型製作，體驗數位產品設計的完整過程。',
    organizer: '台灣設計推廣協會',
  },
  {
    id: 103,
    title: '數位行銷實戰體驗',
    company: '電商平台 B',
    appliedAt: '2025/07/10',
    status: '未通過',
    location: '新北市板橋區',
    dateFrom: '2025/09/05',
    dateTo: '2025/09/06',
    participantsRange: '5-8人',
    description: '體驗數位行銷專案的企劃與執行，從廣告投放到成效追蹤。',
    organizer: '台灣數位行銷協會',
  },
]);

const visibleApplications = computed(() => {
  const data = applicationList.value;
  return data.filter((item) => {
    const byStatus = selectedStatus.value ? item.status === selectedStatus.value : true;
    const byDate = (() => {
      if (!Array.isArray(selectedDateRange.value)) return true;
      const [start, end] = selectedDateRange.value as [Date, Date];
      const ts = new Date(item.appliedAt).getTime();
      return ts >= start.getTime() && ts <= end.getTime();
    })();
    return byStatus && byDate;
  });
});

function resetFilters() {
  selectedStatus.value = '';
  selectedDateRange.value = '';
}

function getTagType(status: ApplicationStatus): 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case '已通過':
      return 'success';
    case '待審核':
      return 'warning';
    case '未通過':
      return 'danger';
    case '已取消':
      return 'info';
    case '已完成':
      return 'success';
  }
}

function getStatusText(status: ApplicationStatus): string {
  return status === '待審核' ? '審核中' : status;
}

function onCancel(appId: number): void {
  // 預留事件掛鉤（僅 UI 任務）
  // eslint-disable-next-line no-console
  console.log('cancel application', appId);
}
</script>

<!-- up6 申請活動的狀態追蹤頁 -->
<template>
  <main class="bg-white">
    <div class="mx-auto max-w-container-users px-6 md:px-12 py-12">
      <!-- Heading + Actions -->
      <section class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold tracking-tight">申請體驗清單</h2>
          <p class="mt-2 text-gray-500">查看並管理您已申請的體驗活動</p>
        </div>
        <div>
          <el-button round class="min-w-[96px]" @click="isFilterDialogVisible = true">篩選</el-button>
        </div>
      </section>

      <!-- Cards (UI 第二部分) -->
      <section class="mt-8 grid grid-cols-1 gap-6">
        <el-card
          v-for="item in visibleApplications"
          :key="item.id"
          shadow="hover"
          class="border border-gray-200 !rounded-xl"
        >
          <div class="flex flex-col gap-4">
            <!-- Top meta -->
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div>
                申請日期：<span>{{ item.appliedAt }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 text-gray-400">
                  <span class="w-2 h-2 rounded-full bg-gray-300"></span>
                  {{ getStatusText(item.status) }}
                </span>
              </div>
            </div>

            <!-- Title -->
            <h3 class="text-xl font-bold text-gray-800">{{ item.title }}</h3>

            <!-- Brief meta line -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
              <span class="inline-flex items-center gap-2">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="w-4" />
                {{ item.location }}
              </span>
              <span class="text-gray-300">|</span>
              <span class="inline-flex items-center gap-2">
                <font-awesome-icon :icon="['fas', 'calendar-alt']" class="w-4" />
                活動日期 {{ item.dateFrom }} - {{ item.dateTo }}
              </span>
              <span class="text-gray-300">|</span>
              <span class="inline-flex items-center gap-2">
                <font-awesome-icon :icon="['fas', 'user-circle']" class="w-4" />
                參與人數 {{ item.participantsRange }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-gray-600 leading-relaxed">
              {{ item.description }}
            </p>

            <!-- Footer actions -->
            <div class="flex items-center justify-between pt-2">
              <div class="text-gray-500 text-sm">{{ item.organizer }}</div>
              <div class="flex items-center gap-3">
                <NuxtLink :to="{ name: 'user-programs-programId', params: { programId: item.id } }">
                  <el-button size="large">查看詳情</el-button>
                </NuxtLink>
                <el-button class="btn-danger-outline" size="large" @click="onCancel(item.id)">取消申請</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </section>

      <!-- Table List -->
      <section class="mt-8">
        <el-card shadow="never">
          <el-table :data="visibleApplications" stripe>
            <el-table-column prop="title" label="申請活動" min-width="220" />
            <el-table-column prop="company" label="公司" min-width="160" />
            <el-table-column prop="appliedAt" label="申請日期" width="140" />
            <el-table-column label="狀態" width="140">
              <template #default="{ row }">
                <el-tag :type="getTagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <NuxtLink :to="{ name: 'user-programs-programId', params: { programId: row.id } }">
                  <el-button size="small" type="primary">查看詳情</el-button>
                </NuxtLink>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </section>
    </div>

    <!-- Filter Dialog -->
    <el-dialog v-model="isFilterDialogVisible" title="篩選申請" width="480px">
      <div class="space-y-6">
        <div>
          <label class="mb-2 block text-sm text-gray-600">狀態</label>
          <el-select v-model="selectedStatus" placeholder="選擇狀態" clearable class="w-full">
            <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </div>
        <div>
          <label class="mb-2 block text-sm text-gray-600">申請日期區間</label>
          <el-date-picker
            v-model="selectedDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex w-full justify-between">
          <el-button @click="resetFilters">重置</el-button>
          <div>
            <el-button @click="isFilterDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="isFilterDialogVisible = false">套用</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </main>
</template>