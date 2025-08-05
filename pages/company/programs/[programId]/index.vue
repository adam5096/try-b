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
          <div class="space-y-3 md:max-w-xs">
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
    <div class="mt-6">
      <el-card>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-zinc-800">
            計畫詳情
          </h2>
          <el-button type="primary" plain>
            編輯計畫
          </el-button>
        </div>
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="md:col-span-1 space-y-6">
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                基本資訊
              </h3>
              <dl class="space-y-4 text-sm">
                <div>
                  <dt class="text-zinc-500">
                    體驗名稱
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    數位行銷實習體驗計畫
                  </dd>
                </div>
                <div>
                  <dt class="text-zinc-500">
                    產業類別
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    數位行銷、廣告媒體
                  </dd>
                </div>
                <div>
                  <dt class="text-zinc-500">
                    職務類別
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    行銷企劃、社群媒體經營、內容創作
                  </dd>
                </div>
                <div>
                  <dt class="text-zinc-500">
                    體驗地點
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    台北市信義區松仁路100號15樓
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                聯絡資訊
              </h3>
              <dl class="space-y-4 text-sm">
                <div>
                  <dt class="text-zinc-500">
                    聯絡人
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    林小姐 (人資部門)
                  </dd>
                </div>
                <div>
                  <dt class="text-zinc-500">
                    電話
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    02-2345-6789
                  </dd>
                </div>
                <div>
                  <dt class="text-zinc-500">
                    Email
                  </dt>
                  <dd class="text-zinc-800 mt-1">
                    hr@digitalmarketing.com.tw
                  </dd>
                </div>
              </dl>
            </div>
            <div class="space-y-4 text-sm">
              <div>
                <p class="text-zinc-500">
                  刊登期間
                </p>
                <p class="text-zinc-800 mt-1">
                  2023/07/01 - 2023/08/01 <span class="ml-2 text-zinc-500">30天</span>
                </p>
              </div>
              <div>
                <p class="text-zinc-500">
                  體驗日期
                </p>
                <p class="text-zinc-800 mt-1">
                  2023/06/15 - 2023/06/17 <span class="ml-2 text-zinc-500">為期三天</span>
                </p>
              </div>
              <div>
                <p class="text-zinc-500">
                  體驗人數
                </p>
                <p class="text-zinc-800 mt-1">
                  6-10人
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="md:col-span-2 space-y-8">
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                體驗介紹
              </h3>
              <p class="text-zinc-700 leading-relaxed text-sm">
                本計畫提供大學生及研究生一個深入了解數位行銷產業的機會。參與者將有機會參與實際專案，學習SEO、SEM、社群媒體行銷、內容創作等數位行銷技能。我們希望透過這個體驗計畫，讓學生在畢業前就能接觸到業界實務，提升就業競爭力。
              </p>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                師資介紹
              </h3>
              <div class="space-y-4 text-sm">
                <div>
                  <h4 class="font-medium text-zinc-800">
                    林德榮
                  </h4>
                  <p class="text-zinc-700 mt-1 leading-relaxed">
                    資深研發顧問與雲端架構師 10 多年，擔任過後端開發、系統架構設計、技術顧問與團隊技術主管。深入理解敏捷開發、雲端平台、資料庫設計與 DevOps 實務，並從不同技術角色面向切入系統設計與開發經驗觀點，並結合實務專案經驗，擅長 B2B 系統架構設計與跨平台服務整合，運用不同的技術視角打開你的軟體開發新觀點。
                  </p>
                </div>
                <div>
                  <h4 class="font-medium text-zinc-800">
                    經歷
                  </h4>
                  <ul class="list-disc list-inside text-zinc-700 mt-1 space-y-1">
                    <li>國際雲端服務商 系統架構師</li>
                    <li>主導企業雲端平台架構設計與開發，協助客戶完成數位轉型，實現高可用、高擴展性的微服務系統。</li>
                    <li>知名新創公司 資深軟體工程師</li>
                    <li>負責核心產品的後端開發與 API 設計，並導入 CI/CD 流程，縮短交付週期、提升團隊開發效率。</li>
                    <li>跨境電商平台 技術顧問</li>
                    <li>協助規劃新資料庫架構與分散式架構，改善高流量環境下的系統穩定性，並培訓內部開發團隊。</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                參加限制
              </h3>
              <ul class="list-decimal list-inside text-zinc-700 text-sm space-y-1">
                <li>了解 JS 變數、陣列物件、DOM、監聽、AJAX 等知識，尚未熟練也沒關係。</li>
                <li>在履歷上需附上最近寫過的 JS Code、Codepen、Github Pages 皆可，或是分享目前 freeCodeCamp 的 JS 研究進度。</li>
                <li>18歲以上</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                行前須知、注意事項
              </h3>
              <ul class="list-decimal list-inside text-zinc-700 text-sm space-y-1">
                <li>請攜帶個人筆記型電腦，以便參與實作環節</li>
                <li>建議課前了解基本的數位行銷概念</li>
                <li>活動當天請提早 15 分鐘到達，以便完成報到手續</li>
                <li>午餐將由公司提供</li>
                <li>如有特殊飲食需求，請在申請表中註明</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-zinc-800 mb-2">
                準備清單
              </h3>
              <ul class="list-decimal list-inside text-zinc-700 text-sm space-y-1">
                <li>筆記型電腦</li>
                <li>水壺</li>
                <li>證件(身分證、健保卡)</li>
                <li>手帕</li>
                <li>長袖外套</li>
              </ul>
            </div>
          </div>
        </div>
      </el-card>
    </div>


    <!-- Section 3 -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Experience Process -->
      <el-card class="md:row-span-1">
        <template #header>
          <h3 class="font-bold text-zinc-900">
            體驗流程
          </h3>
        </template>
        <dl class="space-y-4 text-sm">
          <div>
            <dt class="font-semibold text-zinc-800">
              階段一
            </dt>
            <dd class="text-zinc-600 mt-1">
              企業介紹與數位行銷產業概況 (1小時)、數位行銷工具與平台介紹 (2小時)
            </dd>
          </div>
          <div>
            <dt class="font-semibold text-zinc-800">
              階段二
            </dt>
            <dd class="text-zinc-600 mt-1">
              實際案例分析與討論 (1小時)、分組實作：社群媒體行銷策劃 (2小時)
            </dd>
          </div>
          <div>
            <dt class="font-semibold text-zinc-800">
              階段三
            </dt>
            <dd class="text-zinc-600 mt-1">
              成果發表與專業人員回饋 (3小時)
            </dd>
          </div>
        </dl>
      </el-card>

      <!-- Location -->
      <el-card class="md:row-span-2">
        <template #header>
          <h3 class="font-bold text-zinc-900">
            體驗地點
          </h3>
        </template>
        <p class="text-sm text-zinc-700 mb-4">
          高雄市三民區察哈爾街四段44號
        </p>
        <div class="aspect-video bg-zinc-200 rounded-lg flex items-center justify-center">
          <p class="text-zinc-500">
            地圖
          </p>
        </div>
      </el-card>

      <!-- Analytics -->
      <el-card class="md:row-span-1">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-zinc-900">
              瀏覽數據
            </h3>
            <el-icon class="text-zinc-500">
              <i-ep-view />
            </el-icon>
          </div>
        </template>
        <div class="space-y-3">
          <div class="flex items-baseline justify-between">
            <p class="text-base text-zinc-600">
              總瀏覽次數
            </p>
            <p class="text-2xl font-bold text-blue-500">
              358
            </p>
          </div>
          <div class="flex items-baseline justify-between">
            <p class="text-base text-zinc-600">
              本週瀏覽
            </p>
            <p class="text-2xl font-bold text-zinc-800">
              87
            </p>
          </div>
          <div class="flex items-baseline justify-between">
            <p class="text-base text-zinc-600">
              轉換率
            </p>
            <p class="text-2xl font-bold text-green-600">
              11.7%
            </p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
