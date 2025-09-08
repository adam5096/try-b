<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 基礎 SEO 設定，確保每個頁面都有一致的標題格式與預設的社群分享資訊
useSeoMeta({
  // 設定標題範本，%s 會被頁面標題取代
  titleTemplate: '%s - TRY β',
  description: 'TRY β 是一個連結人才與企業的職業體驗平台。我們提供多元的短期體驗計畫，幫助您在投入職場前探索興趣，找到真正適合自己的道路。',
  ogTitle: 'TRY β｜開啟你的職場任意門',
  ogDescription: '履歷和面試，說的跟做的總是有差？🤔 在 TRY β，我們用「短期體驗」取代猜測。親身參與專案、感受團隊文化，為你的下一步做出更踏實的決定。',
  ogImage: 'https://i.imgur.com/your-default-image.jpg', // 強烈建議替換成您自己的圖片 URL
  twitterCard: 'summary_large_image',
});

const isGuardDismissed = ref(false);

onMounted(() => {
  try {
    isGuardDismissed.value = sessionStorage.getItem('viewportGuardDismissed') === '1';
  } catch {}
});

function dismissViewportGuard() {
  isGuardDismissed.value = true;
  try { sessionStorage.setItem('viewportGuardDismissed', '1'); } catch {}
}
</script>

<template>
  <div class="h-screen">
    <div id="viewport-guard" v-if="!isGuardDismissed" data-active="true">
      <div class="guard-card">
        <div class="guard-title">視窗寬度過小</div>
        <div class="guard-text">請調整到 ≥ 370px 以獲得最佳體驗。您也可以關閉提示繼續使用，但介面可能出現擠壓或遮擋。</div>
        <button class="guard-btn" @click="dismissViewportGuard">關閉並繼續</button>
      </div>
    </div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  
</template>
<style>
/* 視窗寬度小於 370px 時顯示遮罩，阻擋互動與滾動（不顯示橫向捲軸、不再縮小 UI） */
@media (max-width: 369.98px) {
  #viewport-guard {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
  }
  html:has(#viewport-guard[data-active="true"]) ,
  body:has(#viewport-guard[data-active="true"]) {
    overflow: hidden !important; /* 鎖住滾動 */
  }
}

/* 卡片樣式（避免引入框架，使用簡單 CSS） */
#viewport-guard .guard-card {
  max-width: 320px;
  width: calc(100% - 32px);
  background: #ffffff;
  border: 1px solid #e5e7eb; /* gray-200 */
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  text-align: center;
  color: #111827;
}
#viewport-guard .guard-title {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 8px;
}
#viewport-guard .guard-text {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}
#viewport-guard .guard-btn {
  display: inline-block;
  width: 100%;
  padding: 10px 12px;
  background: #111827; /* gray-900 */
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
#viewport-guard .guard-btn:active { opacity: .9; }
</style>
