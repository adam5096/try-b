<script setup lang="ts">
import CheckIcon from '~/components/shared/CheckIcon.vue';

// --- SEO Meta ---
// 為方案頁客製化 SEO 資訊
useSeoMeta({
  title: '錯聘成本太高？TRY β 讓您「先試後聘」找到對的人',
  description: '傳統招募流程耗時且昂貴。TRY β 提供彈性的刊登方案，讓企業能快速發布體驗活動，直接觀察候選人表現，找到真正符合企業文化的人才。',
  ogTitle: '錯聘成本太高？TRY β 讓您「先試後聘」找到對的人',
  // 此頁面暫無合適的獨立圖片，將沿用 app.vue 中設定的全域預設 og:image
  ogDescription: '傳統招募流程耗時且昂貴。TRY β 提供彈性的刊登方案，讓企業能快速發布體驗活動，直接觀察候選人表現，找到真正符合企業文化的人才。',
});
// --- End SEO Meta ---

definePageMeta({
  name: 'plan',
  layout: 'main',
});

const pricingOptions = [
  {
    duration: '30天',
    price: 'TWD 1,000',
    limit: '體驗人數最多 10 人',
    audience: '適合小型企業與新創公司'
  },
  {
    duration: '60天',
    price: 'TWD 2,500',
    limit: '體驗人數最多 30 人',
    audience: '適合發展中的企業'
  },
  {
    duration: '90天',
    price: 'TWD 3,500',
    limit: '體驗人數最多 50 人',
    audience: '適合中型企業與快速成長公司'
  },
  {
    duration: '180天',
    price: 'TWD 6,500',
    limit: '體驗人數最多 100 人',
    audience: '適合穩定成長的企業'
  },
  {
    duration: '365天',
    price: 'TWD 10,000',
    limit: '體驗人數最多 200 人',
    audience: '適合大型企業與特殊需求'
  }
];

const statsCards = [
  {
    percentage: '90%',
    description: '體驗者對企業留下正面印象',
  },
  {
    percentage: '75%',
    description: '企業通過體驗計畫找到合適人才',
  },
  {
    percentage: '40%',
    description: '平均每次體驗活動節省招聘成本',
  }
];

// 對應統計卡片由左至右的示意圖片
const statImages = [
  '/img/home/plan/plan-01.webp',
  '/img/home/plan/plan-02.webp',
  '/img/home/plan/plan-03.webp',
];

</script>

<template>
  <main>
    <!-- Section 1: Top - 為企業打造專業人才體驗平台 -->
    <section class="py-section-padding bg-brand-gray">
      <div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <!-- Left Column: Text Content -->
          <div class="text-left">
            <h1 class="text-primary-blue-light text-3xl sm:text-4xl md:text-5xl font-bold mb-8">為企業打造專業人才體驗平台</h1>
            <div class="space-y-4 text-lg text-gray-700">
              <p>提升品牌形象，發掘優質人才</p>
              <p>幫助企業透過真實職業體驗吸引潛在人才</p>
              <p>讓體驗者深入了解您的企業文化與工作內容</p>
              <p>創造雙贏局面！</p>
            </div>
          </div>

          <!-- Right Column: Special Offer Card -->
          <div class="bg-white rounded-lg shadow-xl p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 mr-3 text-blue-500">
                <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clip-rule="evenodd" />
              </svg>
              新企業專屬優惠
            </h2>
            <p class="text-gray-700 leading-relaxed">
              企業新註冊可享<strong class="text-primary-blue-light">「30日內免費刊登不限次數、體驗人數上限10人」</strong>。
              <span class="block mt-2 text-sm text-gray-500">(不同類型的體驗計畫可共用人數額度)</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2: Middle - Stats Cards -->
    <section class="py-section-padding bg-brand-gray">
      <div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(stat, idx) in statsCards" :key="stat.percentage" class="bg-white rounded-lg shadow-lg p-8 text-center flex flex-col items-center">
            <p class="text-5xl font-bold text-primary-blue-dark mb-4">{{ stat.percentage }}</p>
            <p class="mt-2 text-lg text-gray-700 flex-grow" style="min-height: 4.5rem;">{{ stat.description }}</p>
            <NuxtImg
              class="mt-8 w-40 h-40 object-cover rounded-md"
              :src="statImages[idx]"
              alt="stat image"
              format="webp"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Bottom - Pricing Options -->
    <section class="py-section-padding bg-brand-gray">
      <div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12 text-center">
        <h2 class="text-primary-blue-light text-3xl sm:text-4xl md:text-5xl font-bold mb-4">選擇適合您的方案</h2>
        <p class="text-lg text-gray-700">好人才需要好機會，雙向體驗最真實！</p>

        <div class="mt-12 bg-white rounded-xl shadow-lg p-8 lg:p-12 text-left">
          <h3 class="text-2xl font-bold mb-2">刊登收費方式</h3>
          <p class="text-gray-600">不限刊登次數、同時刊登多種體驗計畫<br>(不同類型的體驗計畫可共用人數額度)</p>

          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div v-for="option in pricingOptions" :key="option.duration" class="border rounded-lg p-6 flex flex-col text-center transition-shadow hover:shadow-lg">
              <p class="font-semibold text-lg">{{ option.duration }}</p>
              <p class="text-xl font-bold my-4">{{ option.price }}</p>
              <p class="text-sm text-gray-700 font-bold">{{ option.limit }}</p>
              <p class="text-sm text-gray-500 mt-4 flex-grow">{{ option.audience }}</p>
            </div>
          </div>
          
          <div class="mt-10 text-center">
            <NuxtLink to="/roles" class="mt-12 inline-block rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white">
              我有興趣
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>
