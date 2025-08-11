<script setup lang="ts">
definePageMeta({
  name: 'user-applications',
  layout: 'user',
});

import { ref, computed, watch } from 'vue';
import { userRoutes } from '~/utils/userRoutes';

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

// Filter state (applied)
const isFilterOpen = ref(false);
const selectedStatuses = ref<ApplicationStatus[]>([]); // 空陣列 = 全部狀態
type SortOrder = 'desc' | 'asc';
const sortOrder = ref<SortOrder>('desc'); // 日期排序（申請日期）
const popoverWidthCss = 'clamp(320px, 92vw, 520px)';

// Filter state (draft, inside popover)
const draftSelectedStatuses = ref<ApplicationStatus[]>([]);
const draftSortOrder = ref<SortOrder>('desc');

// 下拉選單顯示的狀態選項（不包含「已完成」）
const statusOptions: ApplicationStatus[] = ['待審核', '已通過', '未通過', '已取消'];

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
  // 狀態過濾
  const filtered = applicationList.value.filter((item) => {
    if (selectedStatuses.value.length === 0) return true;
    return selectedStatuses.value.includes(item.status);
  });
  // 日期排序（appliedAt）
  const sorted = filtered.slice().sort((a, b) => {
    const ta = new Date(a.appliedAt).getTime();
    const tb = new Date(b.appliedAt).getTime();
    return sortOrder.value === 'desc' ? tb - ta : ta - tb;
  });
  return sorted;
});

// Pagination state
const pageSize = ref<number>(5);
const currentPage = ref<number>(1);

// Derived pagination info
const totalItems = computed<number>(() => visibleApplications.value.length);
const pageStartDisplay = computed<number>(() => {
  if (totalItems.value === 0) return 0;
  return (currentPage.value - 1) * pageSize.value + 1;
});
const pageEndDisplay = computed<number>(() => {
  if (totalItems.value === 0) return 0;
  return Math.min(currentPage.value * pageSize.value, totalItems.value);
});

const paginatedApplications = computed<ApplicationItem[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return visibleApplications.value.slice(start, end);
});

// Reset page when filters change
watch(visibleApplications, () => {
  currentPage.value = 1;
});

// Popover open → 複製目前套用的濾鏡到草稿
watch(isFilterOpen, (open) => {
  if (open) {
    draftSelectedStatuses.value = [...selectedStatuses.value];
    draftSortOrder.value = sortOrder.value;
  }
});

function toggleDraftStatus(status: ApplicationStatus): void {
  const set = new Set(draftSelectedStatuses.value);
  if (set.has(status)) {
    set.delete(status);
  } else {
    set.add(status);
  }
  draftSelectedStatuses.value = Array.from(set);
}

function resetDraftFilters(): void {
  draftSelectedStatuses.value = [];
  draftSortOrder.value = 'desc';
}

function applyDraftFilters(): void {
  selectedStatuses.value = [...draftSelectedStatuses.value];
  sortOrder.value = draftSortOrder.value;
  isFilterOpen.value = false;
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
          <el-popover
            v-model:visible="isFilterOpen"
            trigger="click"
            placement="bottom-end"
            :show-arrow="false"
            popper-class="shadow-lg"
            :popper-style="{ width: popoverWidthCss, maxWidth: '92vw' }"
          >
            <template #reference>
              <el-button round class="min-w-[96px]">篩選</el-button>
            </template>
            <div class="space-y-5">
              <!-- 狀態 -->
              <div class="space-y-3">
                <div class="flex items-center gap-3 text-gray-600">
                  <span class="inline-block px-3 py-1 border rounded-md">全部狀態</span>
                </div>
                <div class="flex flex-wrap gap-3">
                  <el-check-tag
                    v-for="s in statusOptions"
                    :key="s"
                    :checked="draftSelectedStatuses.includes(s)"
                    @change="() => toggleDraftStatus(s)"
                  >
                    {{ getStatusText(s) }}
                  </el-check-tag>
                </div>
              </div>

              <!-- 日期排序 -->
              <div class="flex flex-wrap items-center gap-3 md:gap-4">
                <div class="inline-block px-3 py-1 border rounded-md text-gray-600">日期</div>
                <el-radio-group v-model="draftSortOrder" class="flex flex-wrap">
                  <el-radio-button :value="'desc'">新到舊</el-radio-button>
                  <el-radio-button :value="'asc'">舊到新</el-radio-button>
                </el-radio-group>
              </div>

              <!-- Footer actions -->
              <div class="flex w-full justify-between pt-1">
                <el-button @click="resetDraftFilters">重置</el-button>
                <div>
                  <el-button @click="isFilterOpen = false">取消</el-button>
                  <el-button type="primary" @click="applyDraftFilters">套用</el-button>
                </div>
              </div>
            </div>
          </el-popover>
        </div>
      </section>

      <!-- Cards (UI 第二部分) -->
      <section class="mt-8 grid grid-cols-1 gap-6">
        <el-card
          v-for="item in paginatedApplications"
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
                <NuxtLink :to="userRoutes.programDetail(item.id)">
                  <el-button size="large">查看詳情</el-button>
                </NuxtLink>
                <el-button class="btn-danger-outline" size="large" @click="onCancel(item.id)">取消申請</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </section>


      <!-- Pagination -->
      <section class="mt-6 flex items-center justify-between text-gray-500">
        <div>
          顯示 {{ pageStartDisplay }}-{{ pageEndDisplay }} 筆，共 {{ totalItems }} 筆結果
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalItems"
          layout="prev, pager, next"
          :pager-count="7"
        />
      </section>
    </div>

    <!-- end popover -->
  </main>
</template>