<script setup lang="ts">
definePageMeta({ name: 'admin-programs', layout: 'admin' as any });

import { computed, ref } from 'vue';

type ProgramStatus = 'draft' | 'recruiting' | 'ongoing' | 'finished' | 'canceled';

interface ProgramItem {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  applicants: number;
  slots: number;
  status: ProgramStatus;
}

const query = ref('');
const selectedStatuses = ref<ProgramStatus[]>([]);
const sortBy = ref<'newest' | 'oldest'>('newest');

const allPrograms = ref<ProgramItem[]>([
  {
    id: 101,
    title: 'AI 產品經理一日體驗',
    company: '星河數據科技',
    location: '台北市',
    startDate: '2025-09-15',
    endDate: '2025-09-15',
    applicants: 42,
    slots: 50,
    status: 'recruiting',
  },
  {
    id: 102,
    title: '雲端DevOps工程師實作營',
    company: '雲原生股份有限公司',
    location: '新北市',
    startDate: '2025-08-22',
    endDate: '2025-08-24',
    applicants: 30,
    slots: 30,
    status: 'ongoing',
  },
  {
    id: 103,
    title: '前端工程師Try Before You Dive',
    company: '未來網路',
    location: '台中市',
    startDate: '2025-07-01',
    endDate: '2025-07-01',
    applicants: 120,
    slots: 100,
    status: 'finished',
  },
  {
    id: 104,
    title: '資料分析師一日見習',
    company: '洞察智能',
    location: '高雄市',
    startDate: '2025-09-05',
    endDate: '2025-09-05',
    applicants: 5,
    slots: 20,
    status: 'draft',
  },
  {
    id: 105,
    title: '行銷實習工作坊',
    company: '品牌引擎',
    location: '台北市',
    startDate: '2025-08-10',
    endDate: '2025-08-11',
    applicants: 18,
    slots: 25,
    status: 'canceled',
  },
]);

const statusLabelMap: Record<ProgramStatus, string> = {
  draft: '草稿',
  recruiting: '招募中',
  ongoing: '進行中',
  finished: '已結束',
  canceled: '已取消',
};

const statusClassMap: Record<ProgramStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 border border-gray-200',
  recruiting: 'bg-green-50 text-green-700 border border-green-200',
  ongoing: 'bg-blue-50 text-blue-700 border border-blue-200',
  finished: 'bg-gray-50 text-gray-500 border border-gray-200',
  canceled: 'bg-red-50 text-red-700 border border-red-200',
};

const toggleStatus = (s: ProgramStatus) => {
  const idx = selectedStatuses.value.indexOf(s);
  if (idx >= 0) selectedStatuses.value.splice(idx, 1);
  else selectedStatuses.value.push(s);
};

const visiblePrograms = computed(() => {
  const q = query.value.trim().toLowerCase();
  const filtered = allPrograms.value.filter((p) => {
    const matchQuery = q
      ? p.title.toLowerCase().includes(q) || p.company.toLowerCase().includes(q)
      : true;
    const matchStatus = selectedStatuses.value.length
      ? selectedStatuses.value.includes(p.status)
      : true;
    return matchQuery && matchStatus;
  });
  const sorted = filtered.sort((a, b) => {
    const aDate = a.startDate;
    const bDate = b.startDate;
    if (sortBy.value === 'newest') return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
    return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
  });
  return sorted;
});

const total = computed(() => visiblePrograms.value.length);
</script>

<template>
  <div class="mx-auto w-full max-w-container-admin space-y-6">
    <!-- Title & Action -->
    <section class="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 md:text-3xl">所有活動總覽</h1>
        <p class="mt-1 text-sm text-gray-600">瀏覽並管理平台上的所有體驗活動</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800">新增活動</button>
      </div>
    </section>

    <!-- Filters -->
    <section class="rounded border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <!-- Search -->
        <div class="flex w-full items-center gap-2 xl:max-w-md">
          <div class="relative w-full">
            <input
              v-model="query"
              type="search"
              inputmode="search"
              placeholder="搜尋活動標題 / 公司名稱"
              class="w-full rounded border border-gray-300 px-4 py-2 pr-9 text-gray-900 placeholder-gray-400 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
            />
            <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 104.243 11.93l3.788 3.789a.75.75 0 101.06-1.06l-3.789-3.789A6.75 6.75 0 0010.5 3.75zm0 1.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        <!-- Status filter -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="mr-1 text-sm text-gray-600">狀態：</span>
          <button
            v-for="s in (['draft','recruiting','ongoing','finished','canceled'] as ProgramStatus[])"
            :key="s"
            type="button"
            class="rounded border px-3 py-1 text-sm transition-colors"
            :class="selectedStatuses.includes(s) ? 'bg-primary-blue text-white border-primary-blue' : 'bg-white text-gray-700 border-gray-300 hover:bg-brand-gray'"
            @click="toggleStatus(s)"
          >
            {{ statusLabelMap[s] }}
          </button>
          <button
            type="button"
            class="ml-1 rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-brand-gray"
            @click="selectedStatuses = []"
          >全部</button>
        </div>

        <!-- Sort -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">排序：</span>
          <select
            v-model="sortBy"
            class="rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
          >
            <option value="newest">新到舊</option>
            <option value="oldest">舊到新</option>
          </select>
        </div>
      </div>
    </section>

    <!-- List (Table on md+/Cards on < md) -->
    <section class="space-y-4">
      <!-- Table -->
      <div class="hidden overflow-hidden rounded border border-gray-200 bg-white shadow-sm md:block">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-brand-gray">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">活動名稱</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">公司</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">地點</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">日期</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">申請/名額</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">狀態</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="p in visiblePrograms" :key="p.id" class="hover:bg-brand-gray/50">
              <td class="px-6 py-4 text-gray-900">
                <div class="font-medium">{{ p.title }}</div>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ p.company }}</td>
              <td class="px-6 py-4 text-gray-700">{{ p.location }}</td>
              <td class="px-6 py-4 text-gray-700">{{ p.startDate }}<span v-if="p.endDate && p.endDate !== p.startDate"> – {{ p.endDate }}</span></td>
              <td class="px-6 py-4 text-gray-700">{{ p.applicants }} / {{ p.slots }}</td>
              <td class="px-6 py-4">
                <span class="inline-block rounded px-2 py-1 text-xs" :class="statusClassMap[p.status]">{{ statusLabelMap[p.status] }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-brand-gray">查看</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Cards -->
      <div class="space-y-3 md:hidden">
        <div
          v-for="p in visiblePrograms"
          :key="p.id"
          class="rounded border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div class="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-gray-900">{{ p.title }}</h3>
              <p class="mt-0.5 text-sm text-gray-600">{{ p.company }} ・ {{ p.location }}</p>
            </div>
            <span class="shrink-0 rounded px-2 py-1 text-xs" :class="statusClassMap[p.status]">{{ statusLabelMap[p.status] }}</span>
          </div>
          <div class="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div>
              <span class="text-gray-500">日期：</span>{{ p.startDate }}<span v-if="p.endDate && p.endDate !== p.startDate"> – {{ p.endDate }}</span>
            </div>
            <div><span class="text-gray-500">申請/名額：</span>{{ p.applicants }} / {{ p.slots }}</div>
          </div>
          <div class="mt-3 flex justify-end">
            <button class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-brand-gray">查看</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer / Pagination info -->
    <section class="flex items-center justify-between text-sm text-gray-600">
      <div>共 {{ total }} 筆結果</div>
      <div class="flex items-center gap-2">
        <button class="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-brand-gray">上一頁</button>
        <button class="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-brand-gray">下一頁</button>
      </div>
    </section>
  </div>
</template>


