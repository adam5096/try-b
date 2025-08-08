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
}

const isFilterDialogVisible = ref(false);
const selectedStatus = ref<ApplicationStatus | ''>('');
const selectedDateRange = ref<[Date, Date] | ''>('');

const statusOptions: ApplicationStatus[] = ['待審核', '已通過', '未通過', '已取消', '已完成'];

const applicationList = ref<ApplicationItem[]>([
  { id: 101, title: '軟體工程師體驗營', company: '科技公司 A', appliedAt: '2025/07/28', status: '待審核' },
  { id: 102, title: 'UI/UX 設計師工作坊', company: '設計工作室 E', appliedAt: '2025/07/15', status: '已通過' },
  { id: 103, title: '數位行銷實戰體驗', company: '電商平台 B', appliedAt: '2025/07/10', status: '未通過' },
  { id: 104, title: '新創企業營運體驗', company: '新創公司 F', appliedAt: '2025/06/30', status: '已完成' },
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