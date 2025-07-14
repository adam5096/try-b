# 路由問題
使用命名存取 /pages/company/index.vue 檔案時，
nuxtlink :to 中路徑物件應該為{ name: 'company' }而不是{ name: 'company-index' }

# ep7 單一計畫詳情頁 與 ep8 體驗者申請列表頁面 路由設計
小結：
對開發人員體驗，
在瀏覽器中 url(地址欄、網址欄)處眼睛所見地址(也就是存取資源時真實書寫的地址)
並不100%等於專案目錄中的檔案路徑。(我們只能說高度相似)
這是因為nuxt對/pages目錄下的檔案進行路由抽象化處理(把底層細節藏起來)，特別是 index.vue 檔案。
舉例來說，
如果我們在/pages/company/programs/index.vue 中使用 NuxtLink 跳轉到 /pages/company/programs/1/index.vue，
在瀏覽器中 url 會顯示 /company/programs/1，
但實際上專案目錄中並沒有 /company/programs/1 這個目錄，
而是 /pages/company/programs/[programId]/index.vue。
這就是nuxt的路由抽象化處理。

pages/
└─ company/
   └─ programs/
      └─ [programId]/
         ├─ index.vue      // <-- 對應 /company/programs/1
         └─ applicants.vue // <-- 對應 /company/programs/1/applicants


# layouts/default.vue 中 nuxtlink 路徑可讀性太差