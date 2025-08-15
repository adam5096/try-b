<script setup lang="ts">
import { ref } from 'vue';
import { userRoutes } from '~/utils/userRoutes';

definePageMeta({
  name: 'user-program-detail',
  layout: 'user',
});

const router = useRouter();
const isFavorited = ref(false);
const showApply = ref(false); // 新增

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value;
};

const goBack = () => {
  router.push({ name: 'user-landing' });
};

// 假資料：企業資訊（之後可換 API）
const companyId = ref<number | string>(1);
const companyName = ref('某某某科技資訊公司');

// 體驗流程與地點（假資料）
const flowSteps = ref([
  { label: '階段一', text: '企業介紹與數位行銷產業概況 (1小時)、數位行銷工具與平台介紹 (2小時)' },
  { label: '階段二', text: '實際案例分析與討論 (1小時)、分組實作：社群媒體行銷策劃 (2小時)' },
  { label: '階段三', text: '成果發表與專業人員回饋 (3小時)' },
]);
const venue = ref('高雄市三民區');

// 體驗照片（假資料：之後可換實際圖片 URL）
const galleryPhotos = ref([
  { id: 1, src: '', alt: '體驗照片 1' },
  { id: 2, src: '', alt: '體驗照片 2' },
  { id: 3, src: '', alt: '體驗照片 3' },
  { id: 4, src: '', alt: '體驗照片 4' },
]);

const onApplySubmitted = async () => {
  showApply.value = false;
  await navigateTo({ name: 'user-landing' }); // 導到 users/index.vue
};
</script>

<template>
  <main class="min-h-screen bg-brand-gray">
    <div class="mx-auto max-w-container-users px-6 py-12 md:px-12">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-primary-blue-dark">體驗詳情</h1>
        <div class="flex items-center gap-4">
          <el-button type="primary" size="large" @click="showApply = true">我要申請</el-button>
          <el-button size="large" @click="goBack">返回列表</el-button>
          <el-button size="large" @click="toggleFavorite">
            <div class="flex items-center gap-2">
              <font-awesome-icon :icon="[isFavorited ? 'fas' : 'far', 'heart']" />
              <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
            </div>
          </el-button>
        </div>
      </div>

      <!-- 企業封面區塊 -->
      <section aria-label="企業封面" class="mb-8">
        <div class="relative h-44 w-full rounded-lg bg-gray-300">
          <!-- 圓形 LOGO 佔位 -->
          <div
            class="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-600 bg-white text-sm font-semibold text-gray-700"
          >
            LOGO
          </div>

          <!-- 置中標題 -->
          <h2
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-800"
          >
            企業封面
          </h2>

          <!-- 公司名稱：可點擊前往公司詳情頁 -->
          <button
            type="button"
            class="absolute bottom-6 left-6 text-base font-medium text-primary-blue-dark hover:underline"
            @click="navigateTo(userRoutes.companyDetail(companyId))"
          >
            {{ companyName }}
          </button>
        </div>

        <!-- 軟體工程師一日體驗內容（與企業封面同區塊） -->
        <div class="mt-6 rounded-lg bg-white p-8 shadow-sm">
          <!-- 內容卡抬頭：左標題／右關鍵資訊 -->
          <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div class="md:col-span-2">
              <h3 class="text-xl font-bold">軟體工程師一日體驗營</h3>
              <p class="mt-1 text-sm text-gray-500">科技業／軟體工程師</p>
            </div>
            <div class="flex flex-col gap-2 text-sm text-gray-600">
              <div class="flex items-center justify-between">
                <span>已申請人數：0人</span>
                <span>申請截止還有10天</span>
              </div>
              <div class="flex items-center justify-between">
                <span>招募天數：3天</span>
                <span>招募人數：10-20人</span>
              </div>
              <div class="flex items-center gap-2">
                <font-awesome-icon :icon="['fas','calendar-alt']" />
                <span>2025年10月15日 - 2025年10月17日</span>
              </div>
            </div>
          </div>

          <!-- 內文段落 -->
          <div class="space-y-8 text-gray-800">
            <!-- 體驗介紹 -->
            <section>
              <h4 class="mb-3 text-lg font-bold">體驗介紹</h4>
              <p class="leading-7">
                目具文化探索交流帶您深入了解台灣新世代文化與自然景觀。在活動當中，您將有機會參與實務教學課程、參與團隊站會、系統設計與程式實作，並透過講師經歷穿針引線，掌握基礎的全貌與軟體文化切面，藉此獲得更多的職涯靈感。
              </p>
            </section>

            <!-- 師資介紹 -->
            <section>
              <h4 class="mb-3 text-lg font-bold">師資介紹</h4>
              <p class="mb-2 font-semibold">林德榮</p>
              <p class="leading-7">
                產業軟體與平台架構經驗逾 10 年，歷任後端開發、系統架構與平台穩定度維運，亦擔任內部講師推動
                DevOps 與工程文化。擅長 B2B／平台類產品的模組化與可維運性設計。
              </p>
            </section>

            <!-- 經歷 -->
            <section>
              <h4 class="mb-3 text-lg font-bold">經歷</h4>
              <ul class="list-disc space-y-2 pl-6">
                <li>國際級電商系統架構師：協助平台完成數位轉型，實現高可用與高擴展。</li>
                <li>知名新創公司資深軟體工程師：參與 API 設計、導入 CI/CD 流程、優化交付週期。</li>
                <li>跨部門平台技術顧問：建立高流量環境下的穩定性與監控機制。</li>
              </ul>
            </section>

            <!-- 參加限制 -->
            <section>
              <h4 class="mb-3 text-lg font-bold">參加限制</h4>
              <ol class="list-decimal space-y-1 pl-6">
                <li>了解 JS 語法、陣列物件、DOM、事件、AJAX 等基礎。</li>
                <li>建議具備可瀏覽的程式作品（JS Code、Codepen、GitHub Pages）。</li>
                <li>18 歲以上。</li>
              </ol>
            </section>

            <!-- 行前須知、注意事項 -->
            <section>
              <h4 class="mb-3 text-lg font-bold">行前須知、注意事項</h4>
              <ol class="list-decimal space-y-1 pl-6">
                <li>準時參與並全程配合課程安排，珍惜與講師互動。</li>
                <li>體驗課為入門性質，不保證完成後即能就業。</li>
                <li>活動過程可能拍攝紀錄，僅作為教學回放用途。</li>
                <li>如有不可抗力因素，請提前於平台取消。</li>
              </ol>
            </section>

            <!-- 準備清單 -->
            <section>
              <h4 class="mb-3 text-lg font-bold">準備清單</h4>
              <ol class="list-decimal space-y-1 pl-6">
                <li>筆記型電腦</li>
                <li>水壺</li>
                <li>證件（身份證、健保卡）</li>
                <li>手抄筆記工具</li>
                <li>長效外接電源</li>
              </ol>
            </section>
          </div>
        </div>
      </section>

      <!-- 體驗流程區塊 -->
      <section aria-label="體驗流程" class="mb-8">
        <div class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <!-- 標題 + 流程列表 -->
          <div class="mb-6">
            <h3 class="mb-4 text-lg font-bold">體驗流程</h3>
            <dl class="space-y-4">
              <div v-for="(s, idx) in flowSteps" :key="idx" class="grid grid-cols-12 gap-4">
                <dt class="col-span-12 font-semibold text-gray-700 md:col-span-2">{{ s.label }}</dt>
                <dd class="col-span-12 leading-7 text-gray-700 md:col-span-10">
                  {{ s.text }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- 體驗地點 + 地圖 -->
          <div>
            <h3 class="mb-2 text-lg font-bold">體驗地點</h3>
            <p class="mb-4 text-gray-700">{{ venue }}</p>
            <div class="flex h-80 w-full items-center justify-center rounded bg-gray-300 text-3xl text-gray-700">
              地圖
            </div>
          </div>
        </div>
      </section>

      <!-- 體驗照片區塊 -->
      <section aria-label="體驗照片" class="mb-8">
        <div class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h3 class="mb-6 text-lg font-bold">體驗照片</h3>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div v-for="photo in galleryPhotos" :key="photo.id" class="rounded bg-gray-300">
              <!-- 若未提供圖片，顯示佔位；未來可改成 <img :src="photo.src" :alt="photo.alt" class="h-48 w-full object-cover rounded" /> -->
              <div class="flex h-48 w-full items-center justify-center text-3xl text-gray-700">
                圖片
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
  <el-dialog
    v-model="showApply"
    width="560px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <UsersApplyExperience @submitted="onApplySubmitted" />
  </el-dialog>
</template>
