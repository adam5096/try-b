<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

definePageMeta({
  name: 'index',
});

const isMenuOpen = ref(false);

const partners = [
  { name: 'Scuba Schools International', logo: '/img/home/home-SSI-logo.webp' },
  { name: 'Google', logo: '/img/home/home-Google-logo.webp' },
  { name: 'Hexschool', logo: '/img/home/home-Hexschool-logo.webp' },
  { name: 'LinkedIn', logo: '/img/home/home-LinkedIn-logo.webp' },
  { name: '104 Job Bank', logo: '/img/home/home-104-logo.webp' },
  { name: 'Cathay United Bank', logo: '/img/home/home-CathayBK-logo.webp' },
  { name: 'Microsoft', logo: '/img/home/home-Microsoft-logo.webp' }
]

watch(isMenuOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      // 鎖定滾動並補償滾動條寬度以防止畫面位移
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      // 解除鎖定
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    }
  }
});

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <!-- header -->
  <header class="nav-shadow sticky bg-white z-40">
    <div class="h-main-header w-full max-w-screen-full-hd mx-auto p-12">
      <nav class="flex h-full items-center justify-between gap-8">
        <!-- 商標 Section -->
        <h1 class="flex flex-none items-center gap-2 text-2xl">
          <span class="text-4xl font-black">TRY
            <BetaIcon />
          </span>
          <div class="flex flex-col text-sm">
            <div class="font-bold"> 短期職業</div>
            <div class="font-bold">體驗媒合平台</div>
          </div>
        </h1>

        <!-- Desktop Search Bar 搜尋欄 -->
        <div class="hidden lg:flex flex-1 justify-center px-4">
          <div
            class="w-full min-w-[150px] max-w-[1000px] flex items-center justify-center mx-auto border border-gray-200 rounded-lg p-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <input type="text" placeholder="搜尋職業體驗機會..." class="w-full bg-transparent focus:outline-none">
          </div>
        </div>

        <!-- 右側導覽 -->
        <div class="flex items-center">
          <!-- Mobile Menu Button -->
          <button class="lg:hidden" @click="toggleMenu">
            <HamburgerIcon class="h-8 w-8 text-gray-700" />
          </button>

          <!-- 右側導覽 -->
          <div :class="[
              'fixed top-0 left-0 z-50 h-1/2 w-full transform overflow-y-auto bg-white p-8 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:flex lg:h-auto lg:w-auto lg:transform-none lg:overflow-y-visible lg:p-0 lg:bg-transparent',
              isMenuOpen ? 'translate-y-0' : '-translate-y-full',
            ]" class="flex flex-col gap-8 lg:flex-row lg:items-center">
            <!-- Close button for mobile -->
            <button class="absolute top-8 right-8 lg:hidden" @click="toggleMenu">
              <CloseIcon class="h-8 w-8 text-gray-700" />
            </button>

            <!-- 搜尋欄 (Mobile Only) -->
            <div
              class="mt-16 flex w-full justify-center border border-gray-200 rounded-lg p-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 lg:hidden">
              <input type="text" placeholder="搜尋職業體驗機會..." class="w-full bg-transparent focus:outline-none">
            </div>

            <!-- 右側導覽 -->
            <div class="flex flex-col gap-8 lg:flex-row lg:items-center">
              <a href="#" class="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                探索我們
              </a>
              <a href="#" class="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium">
                方案
              </a>
              <div class="px-4 py-2 flex items-center gap-2">
                <UserIcon class="w-6 h-6" />
                <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  登入
                </a>
                <span class="text-gray-400">/</span>
                <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  註冊
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- 遮罩 -->
        <div v-if="isMenuOpen" class="fixed inset-0 z-45 bg-black/30 lg:hidden" @click="toggleMenu"></div>
      </nav>
    </div>
  </header>

  <!-- main -->
  <main>
    <!-- hero -->
    <section class="relative h-hero-section text-white ">
      <!-- Layer 1: Background Image -->
      <div class="absolute inset-0 z-10 mask-fade-from-center-to-left">
        <img src="~/assets/img/hero-background-worker.webp" alt="Office working environment"
          class="h-full w-full  object-cover" />
      </div>

      <!-- Layer 2: Blue Shape with Gradient Mask -->
      <div class="absolute inset-0 z-20 mask-gradient-to-right">
        <img src="~/assets/img/hero-background.webp" alt="Blue decorative shape"
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
              class="mt-8 rounded-md bg-btn-yellow px-8 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-btn-black hover:text-white">
              開始體驗
            </button>
          </div>
        </div>
      </div>
    </section>



    <!-- 誰適合使用 TRY -->
    <section class="py-section-padding bg-brand-gray">
      <div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12 text-center">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">誰適合使用 TRY β</h2>
        <p class="relative z-10 text-lg sm:text-xl md:text-2xl">TRY β 致力於滿足各種角色和行業的特殊需求，讓每個人都能在探索中找到成長與機會</p>
      </div>

      <!-- Cards Container -->
      <div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12 ">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Card 1: 學生與新鮮人 -->
          <div class=" p-6 pt-10 text-left">
            <div class="flex justify-center mb-4">
              <div>
                <img src="~/assets/img/who-is-the-user-01.webp" alt="學生與新鮮人">
              </div>
            </div>
            <h3 class="text-xl font-bold text-center mb-2 min-h-[3.5rem]">學生與新鮮人</h3>
            <p class="text-center text-gray-500 mb-4">先大量體驗，快速累積品</p>
            <div class="flex justify-center lg:justify-start">
              <ul class="space-y-2">
                <li class="flex items-start min-h-[3.5rem]">
                  <CheckIcon class="mr-2 flex-shrink-0" />
                  <span>實習與專案合作機會</span>
                </li>
                <li class="flex items-start min-h-[3.5rem]">
                  <CheckIcon class="mr-2 flex-shrink-0" />
                  <span>職涯探索工作坊</span>
                </li>
                <li class="flex items-start min-h-[3.5rem]">
                  <CheckIcon class="mr-2 flex-shrink-0" />
                  <span>業界導師一對一指導，並提供深度對談</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Card 2: 兼職與轉職者 -->
          <div class="p-6 pt-10 text-left">
            <div class="flex justify-center mb-4">
              <div>
                <img src="~/assets/img/who-is-the-user-02.webp" alt="兼職與轉職者">
              </div>
            </div>
            <h3 class="text-xl font-bold text-center mb-2 min-h-[3.5rem]">兼職與轉職者</h3>
            <p class="text-center text-gray-500 mb-4">低成本試錯，高效率轉職</p>
            <div class="flex justify-center lg:justify-start">
              <ul class="space-y-2">
                <li class="flex items-start min-h-[3.5rem]">
                  <CheckIcon class="mr-2 flex-shrink-0" />
                  <span>彈性時段職業體驗專案</span>
                </li>
                <li class="flex items-start min-h-[3.5rem]">
                  <CheckIcon class="mr-2 flex-shrink-0" />
                  <span>多元職務角色體驗計畫</span>
                </li>
                <li class="flex items-start min-h-[3.5rem]">
                  <CheckIcon class="mr-2 flex-shrink-0" />
                  <span>快速找尋就職方向</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Card 3: 創意工作者、中小企業 -->
          <div class="p-6 pt-10 text-left">
            <div class="flex justify-center mb-4">
              <div>
                  <img src="~/assets/img/who-is-the-user-03.webp" alt="創意工作者、中小企業">
              </div>
            </div>
            <h3 class="text-xl font-bold text-center mb-2 min-h-[3.5rem]">創意工作者、中小企業</h3>
            <p class="text-center text-gray-500 mb-4">錯聘成本太高？先 β 再正聘</p>
            <div class="flex justify-center lg:justify-start">
              <ul class="space-y-2">
                <li class="flex items-start min-h-[3.5rem]">
                  <CheckIcon class="mr-2 flex-shrink-0" />
                  <span>先體驗，後合作</span>
                </li>
                <li class="flex items-start min-h-[3.5rem]">
                  <CheckIcon class="mr-2 flex-shrink-0" />
                  <span>展現企業魅力，不再浪費培訓預算</span>
                </li>
                <li class="flex items-start min-h-[3.5rem]">
                  <CheckIcon class="mr-2 flex-shrink-0" />
                  <span>零長期成本，高回報人才管道</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 熱門體驗活動 -->
    <section class="py-section-padding bg-brand-gray">
      <div class="mx-auto h-full w-full max-w-container-main px-6 md:px-12 text-center">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">熱門體驗活動</h2>
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
              <button class="mt-6 w-full rounded-md bg-btn-yellow py-2 font-bold text-black transition-colors hover:bg-btn-black hover:text-white">
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
              <button class="mt-6 w-full rounded-md bg-btn-yellow py-2 font-bold text-black transition-colors hover:bg-btn-black hover:text-white">
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
              <button class="mt-6 w-full rounded-md bg-btn-yellow py-2 font-bold text-black transition-colors hover:bg-btn-black hover:text-white">
                查看詳情
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 體驗者的聲音 -->
    <section 
        class="relative py-section-padding overflow-hidden bg-cover bg-center bg-testimonial-pattern"
    >
      <!-- Content -->
      <div class="relative z-10 mx-auto h-full w-full max-w-container-main px-6 md:px-12 text-center">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">體驗者的聲音</h2>
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
                <span class="text-gray-400 text-lg font-bold">→</span>
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
            <p class="text-gray-600 flex-grow">「TRY 讓我有夠分享我的消費經驗和見解，同時感覺自己的聲音有被聽見的。每次完成任務後收到的反饋讓我覺得自己的意見被重視。」</p>
            <div class="mt-4 pt-4 border-t flex justify-between items-center text-sm">
              <div class="flex items-center gap-1 text-yellow-500">
                <StarIcon class="w-5 h-5" />
                <StarIcon class="w-5 h-5" />
                <StarIcon class="w-5 h-5" />
                <span class="text-gray-400 text-lg font-bold">→</span>
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
            <p class="text-gray-600 flex-grow">「即使是我這樣的銀髮族，也能在 TRY 找到適合的測試任務。這讓我保持對科技的關連性，也讓我感覺自己的經驗和觀點仍然有價值。」</p>
            <div class="mt-4 pt-4 border-t flex justify-between items-center text-sm">
              <div class="flex items-center gap-1 text-yellow-500">
                <StarIcon class="w-5 h-5" />
                <StarIcon class="w-5 h-5" />
                <StarIcon class="w-5 h-5" />
                <span class="text-gray-400 text-lg font-bold">→</span>
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


    <!-- 當前實作區塊：我們的合作夥伴 -->
    <section class="relative py-section-padding">
      <!-- Background Image with Opacity -->
      <!-- 當前元素背景的常用樣式 class="absolute inset-0 z-0" -->
      <!-- opacity-30 元素淡化與透明 -->
      <div class="absolute inset-0 z-0">
        <img
          src="~/assets/img/home-testimonial-bg.webp"
          alt="Decorative background"
          class="h-full w-full object-cover opacity-30"
        />
      </div>
      
      <!-- Foreground Content -->
      <div class="relative z-10 mx-auto h-full w-full  px-6 md:px-12 text-center">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          我們的合作夥伴
        </h2>
        <div class="mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-10 sm:gap-x-12 lg:gap-x-16">
          <div v-for="partner in partners" :key="partner.name" class="flex h- w-[176px] h-[44px] items-center justify-center">
            <img
              class="max-h-full max-w-full object-cover"
              :src="partner.logo"
              :alt="partner.name"
            >
          </div>
        </div>
      </div>
    </section>

    <section class="h-[1000px]"></section>
  </main>
</template>
