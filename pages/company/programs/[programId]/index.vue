<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'

definePageMeta({
  name: 'company-programs-detail',
  layout: 'company',
});

const handleDelete = () => {
  ElMessageBox.confirm(
    '您確定要刪除此計畫嗎？此操作無法復原。',
    '警告',
    {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '刪除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消刪除',
      })
    })
}
</script>

<!-- ep7 單一計畫詳情頁 -->
<template>
  <div class="p-6 lg:p-8">
    <div class="mb-6">
      <p class="text-sm text-zinc-500">
        目前的方案 日期：2025/7/1 - 2025/8/1 10:10AM 體驗人數上限 10 人 剩餘體驗人數 5 人
      </p>
    </div>

    <!-- Page Header -->
    <div class="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="mb-1 text-2xl font-bold text-zinc-900">
          數位行銷實習體驗計畫
        </h1>
        <p class="text-sm text-zinc-500">
          計畫ID: PRJ-20230615-001 | 狀態: 已發布
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-6">
      <!-- 申請統計 -->
      <div class="card-base bg-white py-4 px-6">
        <div class="flex items-center justify-between">
          <div class="w-1/2 pr-4">
            <div class="mb-4 flex items-center gap-2">
              <h2 class="card-title">
                申請統計
              </h2>
              <span class="material-icons-outlined text-zinc-400">
                show_chart
              </span>
            </div>
            <div class="space-y-3">
              <div class="flex items-baseline justify-between">
                <p class="text-zinc-600">
                  總申請人數
                </p>
                <p class="text-2xl font-bold text-sky-600">
                  42
                </p>
              </div>
              <div class="flex items-baseline justify-between">
                <p class="text-zinc-600">
                  已審核
                </p>
                <p class="text-2xl font-bold text-emerald-500">
                  28
                </p>
              </div>
              <div class="flex items-baseline justify-between">
                <p class="text-zinc-600">
                  待審核
                </p>
                <p class="text-2xl font-bold text-amber-500">
                  14
                </p>
              </div>
            </div>
          </div>
          <div class="flex shrink-0">
            <button class="btn-brand-yellow">
              查看申請者列表
            </button>
          </div>
        </div>
      </div>

      <!-- 計畫詳情 -->
      <div class="card-base bg-white py-4 px-6">
        <div class="flex items-center justify-between">
          <h2 class="card-title">
            計畫詳情
          </h2>
          <button class="btn-brand-yellow">
            編輯計畫
          </button>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
          <!-- Left Column -->
          <div class="flex flex-col gap-8">
            <!-- 基本資訊 -->
            <div>
              <h3 class="mb-3 font-bold text-zinc-900">
                基本資訊
              </h3>
              <div class="space-y-4">
                <div>
                  <p class="text-sm text-zinc-500">
                    體驗名稱
                  </p>
                  <p class="text-zinc-900">
                    數位行銷實習體驗計畫
                  </p>
                </div>
                <div>
                  <p class="text-sm text-zinc-500">
                    產業類別
                  </p>
                  <p class="text-zinc-900">
                    數位行銷、廣告媒體
                  </p>
                </div>
                <div>
                  <p class="text-sm text-zinc-500">
                    職務類別
                  </p>
                  <p class="text-zinc-900">
                    行銷企劃、社群媒體經營、內容創作
                  </p>
                </div>
                <div>
                  <p class="text-sm text-zinc-500">
                    體驗地點
                  </p>
                  <p class="text-zinc-900">
                    台北市信義區松仁路100號15樓
                  </p>
                </div>
              </div>
            </div>

            <!-- 聯絡資訊 -->
            <div>
              <h3 class="mb-3 font-bold text-zinc-900">
                聯絡資訊
              </h3>
              <div class="space-y-4">
                <div>
                  <p class="text-sm text-zinc-500">
                    聯絡人
                  </p>
                  <p class="text-zinc-900">
                    林小姐 (人資部門)
                  </p>
                </div>
                <div>
                  <p class="text-sm text-zinc-500">
                    電話
                  </p>
                  <p class="text-zinc-900">
                    02-2345-6789
                  </p>
                </div>
                <div>
                  <p class="text-sm text-zinc-500">
                    Email
                  </p>
                  <p class="text-zinc-900">
                    hr@digitalmarketing.com.tw
                  </p>
                </div>
              </div>
            </div>

            <!-- 刊登與體驗 -->
            <div class="space-y-4">
              <div>
                <p class="text-sm text-zinc-500">
                  刊登期間
                </p>
                <p class="text-zinc-900">
                  2023/07/01 - 2023/08/01
                  <span class="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">30天</span>
                </p>
              </div>
              <div>
                <p class="text-sm text-zinc-500">
                  體驗日期
                </p>
                <p class="text-zinc-900">
                  2023/06/15 - 2023/06/17
                  <span class="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">為期三天</span>
                </p>
              </div>
              <div>
                <p class="text-sm text-zinc-500">
                  體驗人數
                </p>
                <p class="text-zinc-900">
                  6-10人
                </p>
              </div>
            </div>
          </div>
          <!-- Right Column -->
          <div class="flex flex-col gap-8">
            <!-- 體驗介紹 -->
            <div>
              <h3 class="mb-3 font-bold text-zinc-900">
                體驗介紹
              </h3>
              <p class="text-zinc-700">
                本計畫提供大學生及研究生一個深入了解數位行銷產業的機會。參與者將有機會參與實際專案，學習SEO、SEM、社群媒體行銷、內容創作等數位行銷技能。我們希望透過這個體驗計畫，讓學生在畢業前就能接觸到業界實務，提升就業競爭力。
              </p>
            </div>
            <!-- 師資介紹 -->
            <div>
              <h3 class="mb-3 font-bold text-zinc-900">
                師資介紹
              </h3>
              <div class="space-y-3">
                <p class="font-bold text-zinc-900">
                  林德榮
                </p>
                <p class="text-sm text-zinc-700">
                  鑽研軟體開發與雲端技術10多年，擔任過後端開發、系統架構設計、技術顧問與團隊技術主管。深入接觸軟體工程、雲端平台、資料庫設計與DevOps 實務，能從不同技術角色面向切入系統設計與開發觀點，並結合實務專案經驗，擅長 B2B 系統架構設計與跨平台服務整合，運用不同的技術視角打開你的軟體開發新觀點。
                </p>
                <div>
                  <h4 class="mb-2 font-bold text-zinc-800">
                    經歷
                  </h4>
                  <ul class="list-disc space-y-2 pl-5 text-sm text-zinc-700">
                    <li>
                      <span class="font-bold">國際雲端服務商 系統架構師</span><br>
                      主導企業級雲端平台的架構設計與部署，協助客戶完成數位轉型，實現高可用、高擴展性的微服務系統。
                    </li>
                    <li>
                      <span class="font-bold">知名新創公司 資深軟體工程師</span><br>
                      負責核心產品的後端開發與API設計，並導入CI/CD 流程，縮短交付週期、提升團隊開發效率。
                    </li>
                    <li>
                      <span class="font-bold">跨國電商平台 技術顧問</span><br>
                      協助規劃資料庫效能優化與分散式架構，改善高流量環境下的系統穩定性，並培訓內部開發團隊。
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- 參加限制 -->
            <div>
              <h3 class="mb-3 font-bold text-zinc-900">
                參加限制
              </h3>
              <ul class="list-decimal space-y-2 pl-5 text-zinc-700">
                <li>了解JS 變數、陳列物件、DOM、監聽、AJAX等知識，尚未熟練也沒關係。</li>
                <li>在履歷上需附近期實作的JS Code, Codepen、GitHub Pages 皆可，或是分享日前 freeCodeCamp 的JS研究進度。</li>
                <li>18歲以上</li>
              </ul>
            </div>
            <!-- 行前須知 -->
            <div>
              <h3 class="mb-3 font-bold text-zinc-900">
                行前須知、注意事項
              </h3>
              <ul class="list-decimal space-y-2 pl-5 text-zinc-700">
                <li>請攜帶個人筆記型電腦，以便參與實作環節</li>
                <li>建議提前了解基本的數位行銷概念</li>
                <li>活動當天請提前15分鐘到達，以便完成報到手續</li>
                <li>午餐將由公司提供</li>
                <li>如有特殊飲食需求，請在申請表中註明</li>
              </ul>
            </div>
            <!-- 準備清單 -->
            <div>
              <h3 class="mb-3 font-bold text-zinc-900">
                準備清單
              </h3>
              <ul class="list-decimal space-y-2 pl-5 text-zinc-700">
                <li>筆記型電腦</li>
                <li>水壺</li>
                <li>證件 (身分證、健保卡)</li>
                <li>雨傘</li>
                <li>長袖外套</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="col-span-1 flex flex-col gap-6">
        <!-- 體驗流程 -->
        <div class="card-base bg-white py-4 px-6">
          <h2 class="card-title mb-4 text-2xl">
            體驗流程
          </h2>
          <div class="space-y-3">
            <div class="grid grid-cols-[80px_1fr] items-start gap-4">
              <p class="font-bold text-zinc-900">
                階段一
              </p>
              <p class="text-zinc-700">
                企業介紹與數位行銷產業概況 (1小時)、數位行銷工具與平台介紹 (2小時)
              </p>
            </div>
            <div class="grid grid-cols-[80px_1fr] items-start gap-4">
              <p class="font-bold text-zinc-900">
                階段二
              </p>
              <p class="text-zinc-700">
                實際案例分析與討論 (1小時)、分組實作：社群媒體行銷策劃 (2小時)
              </p>
            </div>
            <div class="grid grid-cols-[80px_1fr] items-start gap-4">
              <p class="font-bold text-zinc-900">
                階段三
              </p>
              <p class="text-zinc-700">
                成果發表與專業人員回饋 (3小時)
              </p>
            </div>
          </div>
        </div>

        <!-- 瀏覽數據 -->
        <div class="card-base bg-white py-4 px-6">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h2 class="card-title text-2xl">
                瀏覽數據
              </h2>
              <span class="material-icons-outlined text-zinc-400">
                visibility
              </span>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex items-baseline justify-between">
              <p class="text-zinc-600">
                總瀏覽次數
              </p>
              <p class="text-2xl font-bold text-sky-600">
                358
              </p>
            </div>
            <div class="flex items-baseline justify-between">
              <p class="text-zinc-600">
                本週瀏覽
              </p>
              <p class="text-2xl font-bold text-zinc-900">
                87
              </p>
            </div>
            <div class="flex items-baseline justify-between">
              <p class="text-zinc-600">
                轉換率
              </p>
              <p class="text-2xl font-bold text-emerald-500">
                11.7%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-span-1 flex flex-col gap-6">
        <!-- 體驗地點 -->
        <div class="card-base bg-white py-4 px-6">
          <h2 class="card-title text-2xl">
            體驗地點
          </h2>
          <p class="mt-2 text-zinc-700">
            高雄市三民區察哈爾街四段44號
          </p>
          <div class="mt-4 flex h-48 w-full items-center justify-center rounded-lg bg-zinc-200">
            <p class="text-zinc-500">
              地圖
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Button -->
    <div class="mt-8 flex justify-end border-t border-zinc-200 pt-6">
      <button
        class="btn-danger-outline"
        @click="handleDelete"
      >
        刪除計畫
      </button>
    </div>
  </div>
</template> 