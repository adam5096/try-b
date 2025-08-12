<script setup lang="ts">
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';


definePageMeta({
  name: 'pp5-admin-trends',
  layout: 'admin',
});

// UI-only demo state for cutting layout
const keyword = ref('');
const selectedIndustry = ref<string>('');
const selectedJob = ref<string>('');
const selectedRegion = ref<string>('');
const selectedSort = ref('recent');

const industryOptions = [
  { label: '全部產業', value: 'all' },
  { label: '資訊科技', value: 'it' },
  { label: '金融保險', value: 'finance' },
  { label: '製造業', value: 'manufacture' },
];

const jobOptions = [
  { label: '全部職類', value: 'all' },
  { label: '工程研發', value: 'rd' },
  { label: '產品設計', value: 'design' },
  { label: '行銷營運', value: 'marketing' },
];

const regionOptions = [
  { label: '全區域', value: 'all' },
  { label: '台北', value: 'taipei' },
  { label: '新北', value: 'newtaipei' },
  { label: '台中', value: 'taichung' },
];

const sortOptions = [
  { label: '最新', value: 'recent' },
  { label: '最熱門', value: 'popular' },
  { label: '評分高到低', value: 'rating_desc' },
];

</script>


<template>
  <section class="w-full">
    <div class="mx-auto w-full max-w-container-admin">
      <header class="mb-6 md:mb-8">
        <h1 class="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">熱門體驗管理</h1>
        <p class="mt-3 text-sm leading-6 text-gray-600 md:text-base">
          在此頁面，您可以管理平台上顯示的熱門體驗排序、添加或移除體驗。
        </p>
      </header>

      <!-- Filter toolbar -->
      <div class="mb-6 flex flex-wrap items-center gap-3 md:mb-8 md:gap-4 md:flex-nowrap">
        <h2 class="mr-2 whitespace-nowrap text-base font-semibold text-gray-900 md:text-lg">
          當前熱門體驗 (8)
        </h2>

        <el-input
          v-model="keyword"
          placeholder="搜尋體驗..."
          clearable
          :suffix-icon="Search"
          class="w-[260px] md:w-[300px]"
        />

        <el-select v-model="selectedIndustry" placeholder="產業類別" clearable class="w-[150px]">
          <el-option
            v-for="opt in industryOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <el-select v-model="selectedJob" placeholder="職業類別" clearable class="w-[150px]">
          <el-option
            v-for="opt in jobOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <el-select v-model="selectedRegion" placeholder="地區" clearable class="w-[130px]">
          <el-option
            v-for="opt in regionOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <el-select v-model="selectedSort" placeholder="排序" class="w-[120px]">
          <el-option
            v-for="opt in sortOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
    </div>
  </section>
</template>


