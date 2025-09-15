<script setup lang="ts">
// 基礎 SEO 設定，確保每個頁面都有一致的標題格式與預設的社群分享資訊
useSeoMeta({
  // 設定標題範本，%s 會被頁面標題取代
  titleTemplate: '%s - TRY β',
  description: 'TRY β 是一個連結人才與企業的職業體驗平台。我們提供多元的短期體驗計畫，幫助您在投入職場前探索興趣，找到真正適合自己的道路。',
  ogTitle: 'TRY β｜開啟你的職場任意門',
  ogDescription: '履歷和面試，說的跟做的總是有差？🤔 在 TRY β，我們用「短期體驗」取代猜測。親身參與專案、感受團隊文化，為你的下一步做出更踏實的決定。',
  ogImage: 'https://try-b.vercel.app/img/home/home-worker-bg.webp', // 使用絕對路徑的關鍵圖片
  ogImageAlt: 'TRY β 職業體驗平台 - 辦公室工作環境',
  ogUrl: 'https://try-b.vercel.app',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://try-b.vercel.app/img/home/home-worker-bg.webp',
  twitterImageAlt: 'TRY β 職業體驗平台',
});

</script>

<template>
  <div class="h-screen">
    <!-- 路由導航進度條 -->
    <NuxtLoadingIndicator 
      color="#3B82F6"
      error-color="#EF4444"
      :height="6"
    />
    
    <div id="viewport-guard">
      <div class="guard-card">
        <div class="guard-title">視窗寬度過小</div>
        <div class="guard-text">請調整到 ≥ 370px 以獲得最佳體驗。此寬度下介面可能出現擠壓或遮擋。</div>
      </div>
    </div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  
</template>
<style>
/* 預設隱藏提示容器，僅在小螢幕時顯示 */
#viewport-guard { display: none; }

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
}

/* （已移除卡片樣式） */
</style>
