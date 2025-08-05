<script setup lang="ts">
import { ref } from 'vue';
import {
  User,
  Briefcase,
  MapLocation,
  Link,
  Phone,
  Document,
  Download,
} from '@element-plus/icons-vue';

const route = useRoute();

definePageMeta({
  name: 'company-program-applicant-detail',
  layout: 'company',
});

const applicant = {
  name: '林威廷',
  id: 'AP-2025-0458',
  university: '台灣大學資訊工程學系',
  experience: '3 年工作經驗',
  age: '大學生 | 22 歲',
  location: '台北市松山區南京東路一段210號',
  rating: 4,
  ratingCount: 12,
  email: 'waiting.lin@example.com',
  phone: '0912-345-678',
};

const application = {
  programName: '前端工程師一日體驗',
  programId: 'PRJ-2025-0102',
  date: '2025年10月15日 - 2025年10月16日 為期 2 天',
  location: '台北市信義區松仁路100號',
  motivation:
    '我對前端開發抱有濃厚的興趣，希望透過這次體驗營了解實際工作環境和流程。自己雖自學了HTML、CSS和JavaScript，但缺乏專案實作經驗。我相信這次體驗營能幫助我補足這塊的不足，提升我的技術實力。我期待能與貴公司的專業團隊交流學習，並貢獻我的想法。',
};

const skills = ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Git', 'UI/UX設計'];

const attachments = [
  {
    name: '個人履歷.pdf',
    size: '2.4MB',
    date: '2025/07/28',
    icon: Document,
  },
  {
    name: '作品集.jpg',
    size: '3.2MB',
    date: '2025/07/28',
    icon: Document,
  },
  {
    name: '自我介紹.docx',
    size: '1.2MB',
    date: '2025/07/28',
    icon: Document,
  },
];

const pastPrograms = [
  {
    name: '軟體工程師體驗營',
    date: '2025年7月21日 - 2025年7月22日',
    status: '已參加',
    review: '表現優良，準時有禮貌',
    rating: 5,
  },
  {
    name: '軟體工程師體驗營',
    date: '2025年7月21日 - 2025年7月22日',
    status: '已參加',
    review: '表現優良，準時有禮貌',
    rating: 5,
  },
  {
    name: '軟體工程師體驗營',
    date: '2025年7月21日 - 2025年7月22日',
    status: '已參加',
    review: '表現優良，準時有禮貌',
    rating: 5,
  },
  {
    name: '軟體工程師體驗營',
    date: '2025年7月21日 - 2025年7月22日',
    status: '已參加',
    review: '表現優良，準時有禮貌',
    rating: 5,
  },
];

const decisionForm = ref({
  status: 'pending',
  feedback: '',
  notifyMethod: 'email',
});
</script>

<template>
  <div class="p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <p class="text-sm text-zinc-500">
        目前的方案 日期：2025/7/1 - 2025/8/1 10:10AM 體驗人數上限 10 人 剩餘體驗人數 5 人
      </p>
    </div>

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
    <div class="space-y-6">
      <!-- Applicant Info -->
      <el-card>
        <div class="flex flex-col md:flex-row items-start gap-6">
          <el-avatar
            :size="100"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <div class="flex-1">
            <h2 class="text-xl font-bold">
              {{ applicant.name }}
            </h2>
            <p class="text-sm text-zinc-500 mb-4">
              {{ applicant.id }}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-zinc-700">
              <div class="flex items-center gap-2">
                <el-icon><User /></el-icon>
                <span>{{ applicant.age }}</span>
              </div>
              <div class="flex items-center gap-2">
                <el-icon><Briefcase /></el-icon>
                <span>{{ applicant.university }}</span>
              </div>
              <div class="flex items-center gap-2">
                <el-icon><Briefcase /></el-icon>
                <span>{{ applicant.experience }}</span>
              </div>
              <div class="flex items-center gap-2">
                <el-icon><MapLocation /></el-icon>
                <span>{{ applicant.location }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 mt-4">
              <el-rate v-model="applicant.rating" disabled />
              <span class="text-sm text-zinc-500">({{ applicant.ratingCount }} 次評價)</span>
            </div>
          </div>
          <div class="text-sm text-zinc-700 space-y-2">
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
          <el-descriptions-item label="前端工程師一日體驗">{{ application.programId }}</el-descriptions-item>
          <el-descriptions-item label="計畫時間">
            {{ application.date }}
          </el-descriptions-item>
          <el-descriptions-item label="體驗地點">
            {{ application.location }}
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
          {{ application.motivation }}
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
            附件資料
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
                {{ file.size }} | {{ file.date }}
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
          <el-table-column prop="name" label="體驗計畫名稱" />
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="status" label="體驗參與狀態" />
          <el-table-column prop="review" label="訪談單位" />
          <el-table-column label="體驗評價">
            <template #default="{ row }">
              <el-rate v-model="row.rating" disabled />
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
        <el-form :model="decisionForm" label-position="top">
          <el-form-item label="審核結果">
            <el-radio-group v-model="decisionForm.status">
              <el-radio label="pending">
                核准申請
              </el-radio>
              <el-radio label="rejected">
                婉拒申請
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="審核意見">
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
              <el-button type="primary">
                提交審核結果
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
