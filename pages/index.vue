<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

definePageMeta({
  name: 'index',
});

const isMenuOpen = ref(false);

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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Card 1: 學生與新鮮人 -->
          <div class=" p-6 pt-10 text-left">
            <div class="flex justify-center mb-4">
              <div>
                <img src="~/assets/img/誰適合使用_01.webp" alt="學生與新鮮人">
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
                <img src="~/assets/img/誰適合使用_02.webp" alt="兼職與轉職者">
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
                <img src="~/assets/img/誰適合使用_03.webp" alt="創意工作者、中小企業">
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
    </section>

    <!-- 暫時墊高 -->
    <section class="h-[1000px]">
    </section>
  </main>
</template>
