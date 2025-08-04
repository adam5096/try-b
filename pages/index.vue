<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import ssiLogo from '@/assets/img/home/partners/ssi-logo.webp';
import googleLogo from '@/assets/img/home/partners/google-logo.webp';
import hexschoolLogo from '@/assets/img/home/partners/hexschool-logo.webp';
import linkedinLogo from '@/assets/img/home/partners/linkedin-logo.webp';
import logo104 from '@/assets/img/home/partners/104-logo.webp';
import cathaybkLogo from '@/assets/img/home/partners/cathaybk-logo.webp';
import microsoftLogo from '@/assets/img/home/partners/microsoft-logo.webp';


definePageMeta({
  name: 'index',
  layout: 'main',
});

// Header-related logic has been moved to layouts/main.vue

const partners = [
  { name: 'Scuba Schools International', logo: ssiLogo },
  { name: 'Google', logo: googleLogo },
  { name: 'Hexschool', logo: hexschoolLogo },
  { name: 'LinkedIn', logo: linkedinLogo },
  { name: '104 Job Bank', logo: logo104 },
  { name: 'Cathay United Bank', logo: cathaybkLogo },
  { name: 'Microsoft', logo: microsoftLogo }
]

// Footer State ---
const quickLinks = ref([
  { name: '關於 TRY B', link: '#' },
  { name: '合作夥伴', link: '#' },
  { name: '隱私權政策', link: '#' },
  { name: '服務條款', link: '#' },
  { name: '聯絡我們', link: '#' }
]);

const testimonials = [
  {
    avatar: 'https://i.imgur.com/JS4g6z4.png',
    name: '某某股份有限公司',
    title: '創意總監',
    rating: 5,
    quote: '「TRY B 幫助我們找到了對品牌設計有幫助的靈感資料，中間還促成了兩個提案出現時的對齊標準，最終我們客戶的 GIG 曝光率提升了 40%。現在她已經成為我們的幕後設計師。」',
    date: '2025年11月'
  },
  {
    avatar: 'https://i.imgur.com/AhGjW3y.png',
    name: '某某個人工作室',
    title: '永續教育顧問',
    rating: 4.5,
    quote: '「TRY B 的形象平台讓我覺得是很靈活體驗，不僅僅是加速準備素材圖像，協助我們設計了更適合年輕群體的課程教案流程。名目負責後來對於簡參與我們的志工培訓計畫。」',
    date: '2025年11月'
  }
]

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    // isMenuOpen.value = false; // This state is now managed by layouts/main.vue
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

const successStories = [
  {
    title: '新創企業營運助理體驗計畫',
    description: '一間快速成長的新創企業，為尋找具潛力的營運助理，透過本平台招募體驗者參與短期體驗計畫。企業在體驗過程中即時評估體驗者能力與適配度，減少錯誤錄用風險。',
    result: '體驗者轉正率達50%，用人決策時間縮短30%。',
    link: '#'
  },
  {
    title: 'ESG顧問公司招募兼職專案助理',
    description: '一家ESG顧問公司需要快速招募短期專案助理，利用平台發布職業體驗計畫，吸引有志轉職者參加。企業在體驗過程中發現其中單位體驗者具備高潛力，後續直接延攬為長期合作人選。',
    result: '人才媒合成功率提升60%，專案執行進度提前完成。',
    link: '#'
  }
]

const stats = [
  { value: '10,000+', label: '活躍體驗者' },
  { value: '500+', label: '合作企業' },
  { value: '2,500+', label: '成功體驗' },
  { value: '98%', label: '滿意度' }
]
</script>

<template>
  <!-- The <header> has been moved to layouts/main.vue -->

  <!-- main -->
  <main>
    <!-- Hero Section -->
    <section class="relative h-hero-section text-white ">
      <!-- Layer 1: Background Image -->
      <div class="absolute inset-0 z-10 mask-fade-from-center-to-left">
        <img src="@/assets/img/home/home-worker-bg.webp" alt="Office working environment"
          class="h-full w-full  object-cover" />
      </div>

      <!-- Layer 2: Blue Shape with Gradient Mask -->
      <div class="absolute inset-0 z-20 mask-gradient-to-right">
        <img src="@/assets/img/home/hero-bg.webp" alt="Blue decorative shape"
          class="h-full w-full  object-cover lg:object-fill" />
      </div>

      <!-- Layer 3: Foreground Content Layer -->
      <div class="absolute inset-0 z-30">
        <div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12">
          <div class="flex h-full flex-col  justify-center items-center 2xl:items-start">
            <h1 class="text-2xl font-bold sm:text-3xl lg:text-4xl xl:text-5xl">
              Try Before You Dive
            </h1>
            <p class="mt-4 max-w-xl text-sm sm:text-base lg:text-lg">
              「每個正式版的前身，都是測試版」，在投入正式職缺前，大量且動態地嘗試，讓您零風險職場探索，找到真正適合的路。
            </p>
            <p class="mt-2 text-sm sm:text-base lg:text-lg">
              讓轉職從博弈變成科學
            </p>
            <h2 class="mt-16 text-xl font-bold sm:text-2xl lg:text-3xl xl:text-4xl">
              開啟職場任意門，體驗你的無限可能。
            </h2>
            <button
              class="mt-8 rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white">
              開始體驗
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- User Personas Section -->
    <section class="py-section-padding bg-brand-gray">
      <div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12 text-center">
        <h2 class="text-primary-blue-light text-3xl sm:text-4xl md:text-5xl font-bold mb-4">誰適合使用 TRY β</h2>
        <p class="relative z-10 text-lg sm:text-xl md:text-2xl">TRY β 致力於滿足各種角色和行業的特殊需求，讓每個人都能在探索中找到成長與機會</p>
      </div>

      <!-- Cards Container -->
      <div class="mx-auto mt-12 h-full w-full max-w-container-main px-6 md:px-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Card 1: 學生與新鮮人 -->
          <div
            class="bg-white text-black rounded-lg p-6 pt-10 text-center flex flex-col shadow-lg transition-transform duration-300 hover:-translate-y-2"
          >
            <div class="flex justify-center mb-4">
              <div>
                <img src="~/assets/img/home/who-is-the-user-01.webp" alt="學生與新鮮人" />
              </div>
            </div>
            <h3 class="text-xl font-bold text-center mb-2 min-h-[3.5rem]">學生與新鮮人</h3>
            <p class="text-center text-gray-600 mb-4">先大量體驗，快速累積品</p>
            <div class="flex justify-center mt-auto">
              <ul class="space-y-2 text-left">
                <li class="flex items-start min-h-[2rem]">
                  <HomeCheckIcon class="mr-2 flex-shrink-0" />
                  <span>實習與專案合作機會</span>
                </li>
                <li class="flex items-start min-h-[2rem]">
                  <HomeCheckIcon class="mr-2 flex-shrink-0" />
                  <span>職涯探索工作坊</span>
                </li>
                <li class="flex items-start min-h-[2rem]">
                  <HomeCheckIcon class="mr-2 flex-shrink-0" />
                  <span>業界導師一對一指導與深度對談</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Card 2: 兼職與轉職者 -->
          <div
            class="bg-white text-black rounded-lg p-6 pt-10 text-center flex flex-col shadow-lg transition-transform duration-300 hover:-translate-y-2"
          >
            <div class="flex justify-center mb-4">
              <div>
                <img src="~/assets/img/home/who-is-the-user-02.webp" alt="兼職與轉職者" />
              </div>
            </div>
            <h3 class="text-xl font-bold text-center mb-2 min-h-[3.5rem]">兼職與轉職者</h3>
            <p class="text-center text-gray-600 mb-4">低成本試錯，高效率轉職</p>
            <div class="flex justify-center mt-auto">
              <ul class="space-y-2 text-left">
                <li class="flex items-start min-h-[2rem]">
                  <HomeCheckIcon class="mr-2 flex-shrink-0" />
                  <span>彈性時段職業體驗專案</span>
                </li>
                <li class="flex items-start min-h-[2rem]">
                  <HomeCheckIcon class="mr-2 flex-shrink-0" />
                  <span>多元職務角色體驗計畫</span>
                </li>
                <li class="flex items-start min-h-[2rem]">
                  <HomeCheckIcon class="mr-2 flex-shrink-0" />
                  <span>快速找尋就職方向</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Card 3: 創意工作者、中小企業 -->
          <div
            class="bg-white text-black rounded-lg p-6 pt-10 text-center flex flex-col shadow-lg transition-transform duration-300 hover:-translate-y-2"
          >
            <div class="flex justify-center mb-4">
              <div>
                <img src="~/assets/img/home/who-is-the-user-03.webp" alt="創意工作者、中小企業" />
              </div>
            </div>
            <h3 class="text-xl font-bold text-center mb-2 min-h-[3.5rem]">
              創意工作者、中小企業
            </h3>
            <p class="text-center text-gray-600 mb-4">錯聘成本太高？先 β 再正聘</p>
            <div class="flex justify-center mt-auto">
              <ul class="space-y-2 text-left">
                <li class="flex items-start min-h-[2rem]">
                  <HomeCheckIcon class="mr-2 flex-shrink-0" />
                  <span>先體驗，後合作</span>
                </li>
                <li class="flex items-start min-h-[2rem]">
                  <HomeCheckIcon class="mr-2 flex-shrink-0" />
                  <span>展現企業魅力，不再浪費培訓預算</span>
                </li>
                <li class="flex items-start min-h-[2rem]">
                  <HomeCheckIcon class="mr-2 flex-shrink-0" />
                  <span>零長期成本，高回報人才管道</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Programs Section -->
    <section class="py-section-padding bg-brand-gray">
      <div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12 text-center">
        <h2 class="text-primary-blue-light text-3xl sm:text-4xl md:text-5xl font-bold mb-4">熱門體驗活動</h2>
        <p class="text-lg sm:text-xl md:text-2xl">TRY β 致力於滿足各種角色和行業的特殊需求，讓每個人都能在探索中找到成長與機會</p>
      </div>

      <!-- Cards Container -->
      <div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12 mt-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Card 1 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
            <div class="relative">
              <img class="w-full h-48 object-cover" src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1911&auto=format&fit=crop" alt="投資理財顧問體驗">
              <button class="absolute top-4 right-4 text-white hover:text-red-500 transition-colors">
                <HeartIcon class="w-8 h-8" />
              </button>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <p class="text-sm text-gray-500">投資理財顧問體驗</p>
              <h3 class="text-xl font-bold mt-1">投資理財顧問體驗</h3>
              <p class="mt-2 text-gray-600 text-sm flex-grow">跟隨資深理財顧問了解金融市場分析、學習投資組合規劃，體驗為客戶制定理財策略的專業服務流程。</p>
              <div class="mt-4 space-y-2 text-sm text-gray-700">
                <div class="flex items-center gap-2">
                  <LocationPinIcon class="w-5 h-5 flex-shrink-0" />
                  <span>台北市大安區</span>
                </div>
                <div class="flex items-center gap-2">
                  <CalendarIcon class="w-5 h-5 flex-shrink-0" />
                  <span>2025/09/10 - 2023/11/20</span>
                </div>
              </div>
              <div class="mt-4 flex justify-between text-sm text-gray-500 border-t pt-4">
                <span>已申請人數：0 人</span>
                <span>申請截止還有 40 天</span>
              </div>
              <button class="mt-6 w-full rounded-md bg-btn-yellow py-2 font-bold text-black transition-colors hover:bg-primary-blue-dark hover:text-white">
                查看詳情
              </button>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
            <div class="relative">
              <img class="w-full h-48 object-cover" src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop" alt="UI/UX設計師工作坊">
              <button class="absolute top-4 right-4 text-white hover:text-red-500 transition-colors">
                <HeartIcon class="w-8 h-8" />
              </button>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <p class="text-sm text-gray-500">設計體驗</p>
              <h3 class="text-xl font-bold mt-1">UI/UX設計師工作坊</h3>
              <p class="mt-2 text-gray-600 text-sm flex-grow">深入設計思維流程，從用戶研究到原型製作，體驗數位產品設計的完整過程，了解設計師的創作思路。</p>
              <div class="mt-4 space-y-2 text-sm text-gray-700">
                <div class="flex items-center gap-2">
                  <LocationPinIcon class="w-5 h-5 flex-shrink-0" />
                  <span>金門縣烈嶼鄉</span>
                </div>
                <div class="flex items-center gap-2">
                  <CalendarIcon class="w-5 h-5 flex-shrink-0" />
                  <span>2025/10/01 - 2023/12/20</span>
                </div>
              </div>
              <div class="mt-4 flex justify-between text-sm text-gray-500 border-t pt-4">
                <span>已申請人數：0 人</span>
                <span>申請截止還有 10 天</span>
              </div>
              <button class="mt-6 w-full rounded-md bg-btn-yellow py-2 font-bold text-black transition-colors hover:bg-primary-blue-dark hover:text-white">
                查看詳情
              </button>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
            <div class="relative">
              <img class="w-full h-48 object-cover" src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop" alt="新創企業營運體驗">
              <button class="absolute top-4 right-4 text-white hover:text-red-500 transition-colors">
                <HeartIcon class="w-8 h-8" />
              </button>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <p class="text-sm text-gray-500">新創企業體驗</p>
              <h3 class="text-xl font-bold mt-1">新創企業營運體驗</h3>
              <p class="mt-2 text-gray-600 text-sm flex-grow">加入新創團隊實際參與產品開發、市場策略制定，體驗創業家的決策焦慮，了解新創生態的運作模式。</p>
              <div class="mt-4 space-y-2 text-sm text-gray-700">
                <div class="flex items-center gap-2">
                  <LocationPinIcon class="w-5 h-5 flex-shrink-0" />
                  <span>屏東縣恆春鎮</span>
                </div>
                <div class="flex items-center gap-2">
                  <CalendarIcon class="w-5 h-5 flex-shrink-0" />
                  <span>2025/07/01 - 2025/10/31</span>
                </div>
              </div>
              <div class="mt-4 flex justify-between text-sm text-gray-500 border-t pt-4">
                <span>已申請人數：0 人</span>
                <span>申請截止還有 10 天</span>
              </div>
              <button class="mt-6 w-full rounded-md bg-btn-yellow py-2 font-bold text-black transition-colors hover:bg-primary-blue-dark hover:text-white">
                查看詳情
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- User Testimonials Section -->
    <section 
        class="relative py-section-padding overflow-hidden bg-cover bg-center bg-testimonial-pattern"
    >
      <!-- Content -->
      <div class="relative z-10 mx-auto h-full w-full max-w-container-main px-6 md:px-12 text-center">
        <h2 class="text-primary-blue-light text-3xl sm:text-4xl md:text-5xl font-bold mb-4">體驗者的聲音</h2>
        <p class="text-lg sm:text-xl md:text-2xl text-gray-700">聽聽其他人怎麼說</p>
      
        <!-- Testimonial Cards Container -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          <!-- Card 1 -->
          <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <div class="flex items-center mb-4">
              <img class="w-16 h-16 rounded-full mr-4 object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop" alt="Avatar of 周O萱">
              <div>
                <p class="font-bold text-lg">周O萱</p>
                <p class="text-sm text-gray-500">大學生 | 23歲</p>
              </div>
            </div>
            <p class="text-gray-600 flex-grow">「參與 TRYβ 的產品測試讓我不僅能接觸到最新的科技產品，還能賺取額外的收入。平台使用非常方便，任務說明清晰，是學生兼職的好選擇！」</p>
            <div class="mt-4 pt-4 border-t flex justify-between items-center text-sm">
              <div class="flex items-center gap-1 text-yellow-500">
                <StarIcon class="w-5 h-5" />
                <StarIcon class="w-5 h-5" />
                <StarIcon class="w-5 h-5" />
              </div>
              <div class="flex items-center gap-2 text-gray-500">
                <CalendarIcon class="w-5 h-5" />
                <span>2023/11/20</span>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <div class="flex items-center mb-4">
              <img class="w-16 h-16 rounded-full mr-4 object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop" alt="Avatar of 林O偉">
              <div>
                <p class="font-bold text-lg">林O偉</p>
                <p class="text-sm text-gray-500">上班族 | 35歲</p>
              </div>
            </div>
            <p class="text-gray-600 flex-grow">「TRY β 讓我有夠分享我的消費經驗和見解，同時感覺自己的聲音有被聽見的。每次完成任務後收到的反饋讓我覺得自己的意見被重視。」</p>
            <div class="mt-4 pt-4 border-t flex justify-between items-center text-sm">
              <div class="flex items-center gap-1 text-yellow-500">
                <StarIcon class="w-5 h-5" />
                <StarIcon class="w-5 h-5" />
                <StarIcon class="w-5 h-5" />
              </div>
              <div class="flex items-center gap-2 text-gray-500">
                <CalendarIcon class="w-5 h-5" />
                <span>2023/09/28</span>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <div class="flex items-center mb-4">
              <img class="w-16 h-16 rounded-full mr-4 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" alt="Avatar of 張O伯">
              <div>
                <p class="font-bold text-lg">張O伯</p>
                <p class="text-sm text-gray-500">退休人士 | 68歲</p>
              </div>
            </div>
            <p class="text-gray-600 flex-grow">「即使是我這樣的銀髮族，也能在 TRY  找到適合的測試任務。這讓我保持對科技的關連性，也讓我感覺自己的經驗和觀點仍然有價值。」</p>
            <div class="mt-4 pt-4 border-t flex justify-between items-center text-sm">
              <div class="flex items-center gap-1 text-yellow-500">
                <StarIcon class="w-5 h-5" />
                <StarIcon class="w-5 h-5" />
                <StarIcon class="w-5 h-5" />
              </div>
              <div class="flex items-center gap-2 text-gray-500">
                <CalendarIcon class="w-5 h-5" />
                <span>2023/09/28</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Partners Section -->
    <section class="relative overflow-hidden py-section-padding bg-brand-gray">
      <!-- Foreground Content -->
      <div class="relative z-10 mx-auto h-full w-full px-6 text-center md:px-12">
       

        <h2 class="text-primary-blue-light mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
          我們的合作夥伴
        </h2>
        <div
            class="relative h-[247px] mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-10 sm:gap-x-12 lg:gap-x-16"
        >
          <!-- Background Text -->
          <div class="absolute inset-0 z-0">
            <img src="@/assets/img/home/try-before-you-dive.webp" alt="Try Before You Dive" class="w-full h-full object-contain" />
          </div>
          <div
            v-for="partner in partners"
            :key="partner.name"
            class="flex max-h-partner-logo-height max-w-partner-logo-width items-center justify-center"
          >
            <img
              class="max-h-full max-w-full object-contain"
              :src="partner.logo"
              :alt="partner.name"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Client Testimonials Section -->
    <section class="relative py-section-padding bg-brand-gray overflow-hidden">
      <!-- Giant Beta Icon - REMOVED -->

      <div class="relative z-20 mx-auto h-full w-full max-w-container-main px-6 md:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <!-- Left Column: Title and Navigation -->
          <div class="lg:col-span-1 text-left flex flex-col justify-center">
            <div>
              <h2 class="text-primary-blue-light text-3xl sm:text-4xl md:text-5xl font-bold mb-4">企業客戶評價</h2>
              <p class="text-lg sm:text-xl md:text-2xl max-w-3xl">
                探索我們企業客戶的真實體驗和反饋，了解 TRY β 如何幫助企業和探索者創造價值
              </p>
              <div class="mt-8 flex items-center gap-4">
                <button class="p-2 rounded-full text-primary-blue-light hover:bg-gray-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                </button>
                <button class="p-2 rounded-full text-primary-blue-light hover:bg-gray-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Testimonial Cards -->
          <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <!-- Testimonial Card -->
            <div v-for="(testimonial, index) in testimonials" :key="index" class="relative bg-white rounded-lg shadow-lg p-8 flex flex-col gap-4 overflow-hidden">
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                <BetaIcon class="w-full h-full object-contain" />
              </div>
              <div class="relative z-10 flex items-center gap-4">
                <img :src="testimonial.avatar" alt="Client Avatar" class="w-16 h-16 rounded-full object-cover">
                <div>
                  <h3 class="font-bold text-lg">{{ testimonial.name }}</h3>
                  <p class="text-gray-500">{{ testimonial.title }}</p>
                </div>
              </div>
              <div class="relative z-10 flex items-center">
                <template v-for="i in 5" :key="i">
                  <StarIcon v-if="testimonial.rating >= i" class="w-5 h-5 text-yellow-400" />
                  <StarIcon v-else-if="testimonial.rating > i - 1" class="w-5 h-5 text-yellow-400" :style="{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }" />
                  <StarIcon v-else class="w-5 h-5 text-gray-300" />
                </template>
              </div>
              <p class="relative z-10 text-gray-700 leading-relaxed flex-grow">{{ testimonial.quote }}</p>
              <div class="relative z-10 flex items-center gap-2 text-gray-500 mt-auto pt-4">
                <CalendarIcon class="w-5 h-5" />
                <span>{{ testimonial.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>



    <!-- Success Stories Section -->
     <section class="py-section-padding bg-brand-gray overflow-hidden">
       <div class="relative z-20 mx-auto h-full w-full max-w-container-main px-6 md:px-12">
         <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
         

          <!-- Left Column: Success Story Cards -->
          <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch order-2 lg:order-1">
            <div v-for="(story, index) in successStories" :key="index" class="relative bg-white rounded-lg shadow-lg p-8 flex flex-col gap-4 overflow-hidden min-h-[400px]">
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                <BetaIcon class="w-full h-full object-contain" />
              </div>

              <div class="relative z-10 flex flex-col flex-grow">
                <h3 class="font-bold text-lg mb-4 min-h-[3.5rem]">{{ story.title }}</h3>
                <p class="text-gray-700 leading-relaxed flex-grow">{{ story.description }}</p>
                <p class="mt-4 text-gray-700">
                  <span class="font-bold text-primary-blue-light">結果：</span>
                  <span class="font-bold text-primary-blue-light">{{ story.result }}</span>
                </p>
                <a :href="story.link" class="mt-6 inline-flex items-center justify-center rounded-md bg-btn-yellow px-6 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white self-start">
                  <span>查看詳細案例</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

           <!-- Right Column: Title and Navigation -->
           <div class="lg:col-span-1 text-left flex flex-col justify-center order-1 lg:order-2">
            <div>
              <h2 class="text-primary-blue-light text-3xl sm:text-4xl md:text-5xl font-bold mb-4">成功案例</h2>
              <p class="text-lg sm:text-xl md:text-2xl max-w-3xl">
                探索我們如何幫助企業實現目標
              </p>
              <div class="mt-8 flex items-center gap-4">
                <button class="p-2 rounded-full text-primary-blue-light hover:bg-gray-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                </button>
                <button class="p-2 rounded-full text-primary-blue-light hover:bg-gray-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Stats Section -->
     <section class="relative overflow-hidden py-section-padding bg-brand-gray">
      <!-- Background Text -->
      <div class="absolute inset-0 z-0">
            <img src="@/assets/img/home/try-before-you-dive.webp" alt="Try Before You Dive" class="w-full h-full object-contain" />
          </div>
      <!-- Foreground Content -->
      <div class="relative z-10 mx-auto h-full w-full max-w-container-main px-6 text-center md:px-12">
        <h2 class="text-primary-blue-light mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
          已有萬人在使用TRY β
        </h2>
        <p class="mx-auto max-w-2xl text-lg text-gray-700 sm:text-xl">
          探索我們如何幫助企業實現目標
        </p>

        <!-- Stats -->
        <div class="relative h-[247px] mt-12 grid grid-cols-2 gap-y-10 gap-x-6 text-center md:grid-cols-4">
          
          <div v-for="stat in stats" :key="stat.label">
            <p class="text-4xl font-bold text-gray-900 lg:text-5xl">{{ stat.value }}</p>
            <p class="mt-2 text-base text-gray-600">{{ stat.label }}</p>
          </div>
        </div>
        
        <NuxtLink
          to="/plan"
          class="mt-12 inline-block rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary-blue-dark hover:text-white"
        >
          企業開始體驗
        </NuxtLink>
      </div>
    </section>
  </main>
</template>