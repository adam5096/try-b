<script lang="ts" setup>
import {
  Search,
  Briefcase,
  Location,
  User,
} from '@element-plus/icons-vue';

type TagType = 'success' | 'info' | 'warning' | 'danger';

interface Plan {
  id: number;
  title: string;
  status: string;
  status_tag: TagType;
  description: string;
  industry: string;
  location: string;
  headcount: string;
  applicants: number | string;
  applicant_status: string;
  date?: string;
}

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

const plans: Plan[] = [
  {
    id: 1,
    title: '軟體工程師體驗日',
    status: '審核中',
    status_tag: 'info',
    description: '體驗前端與後端開發工作，了解軟體工程師的日常工作內容與挑戰',
    industry: '資訊科技',
    location: '台北市信義區松仁路100號',
    headcount: '5-10人',
    applicants: 0,
    applicant_status: '開放',
  },
  {
    id: 2,
    title: '數位行銷實務工作坊',
    status: '已發佈',
    status_tag: 'success',
    description: '學習數位行銷策略規劃、社群媒體經營與數據分析，體驗行銷人員的工作日常',
    industry: '行銷廣告',
    date: '2025/10/12',
    location: '台北市大安區忠孝東路四段',
    headcount: '8-15人',
    applicants: '已額滿',
    applicant_status: '額滿',
  },
  {
    id: 3,
    title: '金融分析師一日體驗',
    status: '待發佈',
    status_tag: 'warning',
    description: '體驗金融市場分析、投資組合管理，了解金融分析師的專業技能與工作內容',
    industry: '金融服務',
    date: '2025/10/08',
    location: '台北市信義區松智路17號',
    headcount: '4-8人',
    applicants: 0,
    applicant_status: '開放',
  },
  {
    id: 4,
    title: '人力資源專員工作體驗',
    status: '待發佈',
    status_tag: 'warning',
    description: '了解招聘流程、員工培訓與績效管理，體驗HR專業人員的日常工作',
    industry: '人力資源',
    date: '2025/10/05',
    location: '台北市內湖區瑞光路399號',
    headcount: '5-10人',
    applicants: 0,
    applicant_status: '開放',
  },
  {
    id: 5,
    title: '產品設計師工作坊',
    status: '已發佈',
    status_tag: 'success',
    description: '體驗UI/UX設計流程, 學習使用者研究與原型設計, 了解產品設計師的工作職責',
    industry: '設計創意',
    date: '2025/10/03',
    location: '台北市松山區南京東路三段',
    headcount: '5-10人',
    applicants: 5,
    applicant_status: '開放',
  },
  {
    id: 6,
    title: '客戶服務體驗日',
    status: '已拒絕',
    status_tag: 'danger',
    description: '體驗客戶服務流程, 學習溝通技巧與問題解決能力, 了解客服人員的工作挑戰',
    industry: '客戶服務',
    date: '2025/09/28',
    location: '新北市板橋區民生路三段',
    headcount: '10-20人',
    applicants: 0,
    applicant_status: '拒絕',
  },
  {
    id: 7,
    title: '軟體工程師體驗日',
    status: '審核中',
    status_tag: 'info',
    description: '體驗前端與後端開發工作，了解軟體工程師的日常工作內容與挑戰',
    industry: '資訊科技',
    location: '台北市信義區松仁路100號',
    headcount: '5-10人',
    applicants: 0,
    applicant_status: '開放',
  },
  {
    id: 8,
    title: '數位行銷實務工作坊',
    status: '已發佈',
    status_tag: 'success',
    description: '學習數位行銷策略規劃、社群媒體經營與數據分析，體驗行銷人員的工作日常',
    industry: '行銷廣告',
    date: '2025/10/12',
    location: '台北市大安區忠孝東路四段',
    headcount: '8-15人',
    applicants: '已額滿',
    applicant_status: '額滿',
  },
  {
    id: 9,
    title: '金融分析師一日體驗',
    status: '待發佈',
    status_tag: 'warning',
    description: '體驗金融市場分析、投資組合管理，了解金融分析師的專業技能與工作內容',
    industry: '金融服務',
    date: '2025/10/08',
    location: '台北市信義區松智路17號',
    headcount: '4-8人',
    applicants: 0,
    applicant_status: '開放',
  },
  {
    id: 10,
    title: '人力資源專員工作體驗',
    status: '待發佈',
    status_tag: 'warning',
    description: '了解招聘流程、員工培訓與績效管理，體驗HR專業人員的日常工作',
    industry: '人力資源',
    date: '2025/10/05',
    location: '台北市內湖區瑞光路399號',
    headcount: '5-10人',
    applicants: 0,
    applicant_status: '開放',
  },
  {
    id: 11,
    title: '產品設計師工作坊',
    status: '已發佈',
    status_tag: 'success',
    description: '體驗UI/UX設計流程, 學習使用者研究與原型設計, 了解產品設計師的工作職責',
    industry: '設計創意',
    date: '2025/10/03',
    location: '台北市松山區南京東路三段',
    headcount: '5-10人',
    applicants: 5,
    applicant_status: '開放',
  },
  {
    id: 12,
    title: '客戶服務體驗日',
    status: '已拒絕',
    status_tag: 'danger',
    description: '體驗客戶服務流程, 學習溝通技巧與問題解決能力, 了解客服人員的工作挑戰',
    industry: '客戶服務',
    date: '2025/09/28',
    location: '新北市板橋區民生路三段',
    headcount: '10-20人',
    applicants: 0,
    applicant_status: '拒絕',
  },
];
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
          <el-input v-model="searchForm.name" placeholder="搜尋計畫名稱..." :prefix-icon="Search" />
          <el-select v-model="searchForm.industry" placeholder="產業類別">
            <el-option label="資訊科技" value="tech" />
            <el-option label="行銷廣告" value="marketing" />
          </el-select>
          <el-select v-model="searchForm.job_type" placeholder="職務類別">
            <el-option label="軟體工程師" value="swe" />
            <el-option label="產品設計師" value="pd" />
          </el-select>
          <el-select v-model="searchForm.sort" placeholder="排序方式">
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
        <el-card v-for="(plan, index) in plans" :key="index">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-bold">{{ plan.title }}</span>
              <el-tag :type="plan.status_tag">
                {{ plan.status }}
              </el-tag>
            </div>
          </template>
          <div class="text-gray-600 mb-4">
            {{ plan.description }}
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <el-icon><Briefcase /></el-icon>
              <span>{{ plan.industry }}</span>
              <span v-if="plan.date" class="ml-auto text-gray-500">{{ plan.date }}</span>
            </div>
            <div class="flex items-center gap-2">
              <el-icon><Location /></el-icon>
              <span>{{ plan.location }}</span>
            </div>
            <div class="flex items-center gap-2">
              <el-icon><User /></el-icon>
              <span>成行人數：{{ plan.headcount }}</span>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between items-center">
              <span>已申請人數：
                <span :class="{ 'text-red-500': plan.applicant_status === '額滿' }">
                  {{ plan.applicants }}
                </span>
              </span>
              <NuxtLink :to="{ name: 'company-program-detail', params: { programId: plan.id } }">
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
          :total="12"
          :page-size="6"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style> 