<template>
  <div class="mx-auto w-full max-w-container-admin space-y-6">
    <!-- Title & Meta -->
    <section class="space-y-1">
      <h1 class="text-2xl font-semibold text-gray-900 md:text-3xl">
        {{ program.title }}
      </h1>
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-600">
        <span>計畫 ID: {{ program.planId }}</span>
        <span class="hidden text-gray-400 md:inline">|</span>
        <span>提交日期: {{ program.submittedAt }}</span>
        <span class="hidden text-gray-400 md:inline">|</span>
        <span :class="reviewStatusClassMap[program.reviewStatus]">{{ reviewStatusLabelMap[program.reviewStatus] }}</span>
      </div>
    </section>

    <!-- Basic Info -->
    <section class="rounded border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <h2 class="mb-4 text-xl font-semibold text-gray-900">體驗計畫基本資訊</h2>
      <div class="grid gap-8 md:grid-cols-2">
        <!-- Left column -->
        <dl class="space-y-4">
          <div>
            <dt class="text-sm text-gray-500">體驗名稱</dt>
            <dd class="mt-0.5 text-gray-900">{{ program.experienceName }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">企業名稱</dt>
            <dd class="mt-0.5 text-gray-900">{{ program.companyName }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">體驗地點</dt>
            <dd class="mt-0.5 text-gray-900">{{ program.location }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">聯絡電話</dt>
            <dd class="mt-0.5 text-gray-900">{{ program.contactPhone }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">體驗計畫刊登時間</dt>
            <dd class="mt-0.5 text-gray-900">{{ program.publishFrom }} 至 {{ program.publishTo }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">體驗計畫進行時間</dt>
            <dd class="mt-0.5 text-gray-900">{{ program.runFrom }} 至 {{ program.runTo }}　{{ program.durationNote }}</dd>
          </div>
        </dl>

        <!-- Right column -->
        <dl class="space-y-4">
          <div>
            <dt class="text-sm text-gray-500">產業類別</dt>
            <dd class="mt-0.5 text-gray-900">{{ program.industry }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">職務類別</dt>
            <dd class="mt-0.5 text-gray-900">{{ program.jobCategory }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">聯絡人</dt>
            <dd class="mt-0.5 text-gray-900">{{ program.contactName }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">電子郵件</dt>
            <dd class="mt-0.5 break-all text-gray-900">{{ program.contactEmail }}</dd>
          </div>
          <div>
            <dt class="text-sm text-gray-500">參與人數</dt>
            <dd class="mt-0.5 text-gray-900">{{ program.participantRange }}</dd>
          </div>
        </dl>
      </div>
    </section>
    
    <!-- Intro / Teacher / Resume / Requirements -->
    <section class="rounded border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <div class="space-y-8">
        <!-- Intro -->
        <div>
          <h2 class="mb-3 text-xl font-semibold text-gray-900">體驗介紹</h2>
          <p class="leading-7 text-gray-800">{{ program.intro }}</p>
        </div>

        <!-- Teacher -->
        <div>
          <h2 class="mb-3 text-xl font-semibold text-gray-900">師資介紹</h2>
          <h3 class="text-lg font-semibold text-gray-900">{{ program.teacher.name }}</h3>
          <p class="mt-2 leading-7 text-gray-800">{{ program.teacher.bio }}</p>
        </div>

        <!-- Resume List -->
        <div>
          <h2 class="mb-3 text-xl font-semibold text-gray-900">經歷</h2>
          <ul class="list-disc space-y-2 pl-6 text-gray-800">
            <li v-for="(exp, idx) in program.experiences" :key="idx">
              <div class="font-semibold">{{ exp.title }}</div>
              <div class="text-gray-700">{{ exp.description }}</div>
            </li>
          </ul>
        </div>

        <!-- Requirements -->
        <div>
          <h2 class="mb-3 text-xl font-semibold text-gray-900">參加限制</h2>
          <ol class="list-decimal space-y-1 pl-6 text-gray-800">
            <li v-for="(req, idx) in program.requirements" :key="idx">{{ req }}</li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Pre-Notes / Checklist / Flow / Location -->
    <section class="rounded border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <div class="space-y-8">
        <!-- Pre-Notes -->
        <div>
          <h2 class="mb-3 text-xl font-semibold text-gray-900">行前須知、注意事項</h2>
          <ol class="list-decimal space-y-1 pl-6 text-gray-800">
            <li v-for="(n, i) in program.preNotes" :key="i">{{ n }}</li>
          </ol>
        </div>

        <!-- Checklist -->
        <div>
          <h2 class="mb-3 text-xl font-semibold text-gray-900">準備清單</h2>
          <ol class="list-decimal space-y-1 pl-6 text-gray-800">
            <li v-for="(item, i) in program.checklist" :key="i">{{ item }}</li>
          </ol>
        </div>

        <!-- Flow -->
        <div>
          <h2 class="mb-3 text-xl font-semibold text-gray-900">體驗流程</h2>
          <div class="space-y-3 text-gray-800">
            <div v-for="(d, i) in program.itinerary" :key="i" class="flex gap-4">
              <div class="w-14 shrink-0 font-semibold text-gray-900">{{ d.day }}</div>
              <div class="flex-1 leading-7">{{ d.description }}</div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div>
          <h2 class="mb-3 text-xl font-semibold text-gray-900">體驗地點</h2>
          <p class="flex items-center gap-2 text-gray-800">
            <LocationPinIcon class="h-5 w-5 text-gray-600" />
            <span>{{ program.location }}</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Photos -->
    <section class="rounded border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <h2 class="mb-4 text-xl font-semibold text-gray-900">體驗照片</h2>
      <!-- Map placeholder -->
      <div class="flex h-[260px] w-full items-center justify-center rounded bg-gray-200 text-gray-600 md:h-[360px]">
        地圖
      </div>
      <!-- Photo grid -->
      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <figure v-for="(photo, i) in program.photos" :key="i" class="space-y-2">
          <div class="flex h-[180px] w-full items-center justify-center rounded bg-gray-200 text-gray-600 md:h-[220px]">
            圖片(體驗環境)
          </div>
          <figcaption class="text-center text-gray-700">{{ photo.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- Review History -->
    <section class="rounded border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <h2 class="mb-4 text-xl font-semibold text-gray-900">審核歷史</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-brand-gray">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">操作時間</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">操作人員</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">操作類型</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">備註</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="(h, idx) in program.reviewHistory" :key="idx" class="hover:bg-brand-gray/50">
              <td class="px-6 py-4 text-gray-900">{{ h.time }}</td>
              <td class="px-6 py-4 text-gray-700">{{ h.operator }}</td>
              <td class="px-6 py-4 text-gray-700">{{ h.kind }}</td>
              <td class="px-6 py-4 text-gray-700">{{ h.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Review Form -->
    <section class="rounded border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <h2 class="mb-4 text-xl font-semibold text-gray-900">審核意見</h2>
      <form class="space-y-4" @submit.prevent="onSubmitReview">
        <div class="space-y-1">
          <label class="block text-sm text-gray-600" for="reviewResult">審核結果</label>
          <select id="reviewResult" v-model="reviewResult" class="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue">
            <option value="approved">通過</option>
            <option value="rejected">拒絕</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="block text-sm text-gray-600" for="reviewNote">審核意見</label>
          <textarea
            id="reviewNote"
            v-model="reviewNote"
            rows="5"
            placeholder="請輸入審核意見..."
            class="w-full resize-y rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
          />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800">提交審核</button>
        </div>
      </form>
    </section>
  </div>
  
</template>

<script setup lang="ts">
definePageMeta({ name: 'admin-single-program-info', layout: 'admin' as any })
import LocationPinIcon from '~/components/LocationPinIcon.vue'
import { ref } from 'vue'

type ReviewStatus = 'systemApproved' | 'systemRejected' | 'manualConfirmed' | 'manualRejected'

const reviewStatusLabelMap: Record<ReviewStatus, string> = {
  systemApproved: '已通過(系統)',
  systemRejected: '已拒絕(系統)',
  manualConfirmed: '已確認(人工)',
  manualRejected: '已拒絕(人工)'
}

const reviewStatusClassMap: Record<ReviewStatus, string> = {
  systemApproved: 'text-green-600',
  systemRejected: 'text-red-600',
  manualConfirmed: 'text-blue-600',
  manualRejected: 'text-red-600'
}

interface ProgramDetails {
  title: string
  planId: string
  submittedAt: string
  reviewStatus: ReviewStatus

  experienceName: string
  companyName: string
  location: string
  contactPhone: string
  publishFrom: string
  publishTo: string
  runFrom: string
  runTo: string
  durationNote: string

  industry: string
  jobCategory: string
  contactName: string
  contactEmail: string
  participantRange: string

  // next section contents
  intro: string
  teacher: { name: string; bio: string }
  experiences: Array<{ title: string; description: string }>
  requirements: string[]

  // this section
  preNotes: string[]
  checklist: string[]
  itinerary: Array<{ day: string; description: string }>

  // photos
  photos: Array<{ caption: string }>

  // review history
  reviewHistory: Array<{ time: string; operator: string; kind: string; note: string }>
}

const program: ProgramDetails = {
  title: '台北文化探索之旅',
  planId: 'TW-TPE-2023-0142',
  submittedAt: '2023-10-15',
  reviewStatus: 'systemApproved',

  experienceName: '軟體工程師體驗營',
  companyName: '台灣科技創新有限公司',
  location: '台北市大同區迪化街一段61號 (台北故事館)',
  contactPhone: '0912-345-678',
  publishFrom: '2025-11-15',
  publishTo: '2025-12-15',
  runFrom: '2025-12-20',
  runTo: '2025-12-22',
  durationNote: '為期3天',

  industry: '科技業',
  jobCategory: '工程師',
  contactName: '林美玲',
  contactEmail: 'mei.lin@tpcf.org.tw',
  participantRange: '1-5人',

  intro:
    '日月潭文化探索之旅帶您深入了解台灣原住民文化與自然景觀。在這次體驗中，您將有機會參與傳統織繡工藝、品嚐部落美食、乘船遊覽日月潭，並探訪周邊歷史古蹟。專業導遊將全程陪伴，講解當地文化歷史，讓您獲得獨特的旅遊體驗。',
  teacher: {
    name: '林德榮',
    bio:
      '鑽研軟體開發與雲端技術 10 多年，擅任過後端開發、系統架構設計、技術顧問與團隊技術主管。深入接觸軟體工程、雲端平台、資料庫設計與 DevOps 實務，能從不同技術的角度向切入系統設計與開發觀點，擁合跨部門整體、提高 B2B 系統架構設計與跨平台服務整合，運用不同的技術視角打開你的軟體開發新觀點。',
  },
  experiences: [
    {
      title: '國際雲端服務商 系統架構師',
      description:
        '主導企業級雲端平台的架構設計與部署，協助客戶完成數位轉型，實現高可用、高擴展性的微服務系統。',
    },
    {
      title: '知名新創公司 資深軟體工程師',
      description:
        '負責核心產品的後端開發與 API 設計，並導入 CI/CD 流程，縮短交付週期、提升團隊開發效率。',
    },
    {
      title: '跨國電商平台 技術顧問',
      description:
        '協助規劃資料庫效能優化與分散式架構，改善高流量環境下的系統穩定性，並培訓內部開發團隊。',
    },
  ],
  requirements: [
    '了解 JS 變數、陣列物件、DOM、監聽、AJAX 等知識，尚未熟練也沒關係。',
    '在履歷上標示近期練過的 JS Code、Codepen、GitHub Pages 皆可，或是分享目前 {freeCodeCamp} 的 JS 研習進度。',
    '18 歲以上',
  ],

  preNotes: [
    '請攜帶個人筆記型電腦，以便參與實作環節',
    '建議提前了解基本的數位行銷概念',
    '活動當天請提前15分鐘到達，以便完成報到手續',
    '午餐將由公司提供',
    '如有特殊飲食需求，請在申請表中註明',
  ],
  checklist: ['筆記型電腦', '水壺', '證件(身分證、健保卡)', '手套', '長袖外套'],
  itinerary: [
    {
      day: '第一天',
      description: '企業介紹與數位行銷產業概況 (1小時)、數位行銷工具與平台介紹 (2小時)',
    },
    {
      day: '第二天',
      description: '實際案例分析與討論 (1小時)、分組實作：社群媒體行銷策劃 (2小時)',
    },
    {
      day: '第三天',
      description: '成果發表與專業人員回饋 (3小時)',
    },
  ],
  photos: [
    { caption: '照片描述' },
    { caption: '照片描述' },
    { caption: '照片描述' },
    { caption: '照片描述' },
  ],

  reviewHistory: [
    {
      time: '2025-09-15 15:10:23',
      operator: '系統',
      kind: '自動審核',
      note: '系統偵測到有敏感字眼，審核狀態為「已拒絕」，等待人工確認。',
    },
    {
      time: '2025-09-16 09:15:22',
      operator: '李主管',
      kind: '人工審核',
      note: '確認內容為系統誤判，無不雅、辱罵、攻擊、猥褻等字眼，標記為已通過。',
    },
  ],
}

const reviewResult = ref<'approved' | 'rejected'>('approved')
const reviewNote = ref('')

const onSubmitReview = () => {
  // 僅示意 UI 提交行為；之後可串接 API
  // eslint-disable-next-line no-console
  console.log('submit review =>', reviewResult.value, reviewNote.value)
}
</script>

<style scoped>
/* 調整章節標題層級與行距，貼近設計稿的閱讀感 */
h2 + dl > div + div { margin-top: 16px; }
</style>