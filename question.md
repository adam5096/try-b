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


# .npmrc 設定
是的，我非常了解 `.npmrc` 檔案，您提出這個問題，正好切中了我們剛才討論的核心！

您會提到 `.npmrc`，想必是已經意識到，它正是解決 `pnpm` 與某些工具（如 VS Code 擴充功能）之間相容性問題的另一種關鍵方法。

### 什麼是 `.npmrc`？

`.npmrc` 是一個設定檔（"npm run commands" 或 "npm configuration" 的縮寫），它能讓您為專案（或您的整個系統）的套件管理器（`npm`、`pnpm`、`yarn` 都會讀取）設定行為。

### `.npmrc` 如何解決我們的問題？

對於 `pnpm` 來說，`.npmrc` 中有一個非常重要的設定，可以直接解決我們遇到的 Tailwind IntelliSense 問題，那就是：

`shamefully-hoist=true`

**這是什麼意思？**
`pnpm` 最引以為傲的特性之一，就是它不會像 `npm` 或 `yarn` 那樣，把所有子依賴都「提升（hoist）」到 `node_modules` 的根目錄，從而建立一個非常嚴格、乾淨的依賴結構。

然而，這也導致了我們遇到的問題：VS Code 的擴充功能按照傳統 `npm` 的思維，在 `node_modules` 的根目錄下找不到 `tailwindcss`，於是就出錯了。

當您在 `.npmrc` 中加入 `shamefully-hoist=true`，您就是在告訴 `pnpm`：「我知道這有點可恥（shamefully），違背了你的原則，但請你把所有子依賴都像 `npm` 一樣提升到根目錄吧。」

這樣一來，`node_modules` 的結構就會變得「扁平」，VS Code 的擴充功能就能順利找到它需要的 `tailwindcss` 套件，智慧提示功能也就恢復正常了。

### 兩種解決方案的比較

現在，我們有了兩種解決方案，它們各有優劣：

| 方案 | `pnpm add -D tailwindcss` (我之前的提議) | 建立 `.npmrc` 並加入 `shamefully-hoist=true` |
| :--- | :--- | :--- |
| **原理** | 手動將 `tailwindcss` 這個套件「釘」在 `node_modules` 的根目錄，讓擴充功能可以找到它。 | 指示 `pnpm` 改變其核心行為，將**所有**子依賴都提升到根目錄，模擬 `npm` 的行為。 |
| **優點** | **精準打擊**。只解決 `tailwindcss` 這一個問題，不影響其他依賴，最大程度地保留了 `pnpm` 的嚴格性優勢。 | **一勞永逸**。如果未來還有其他工具也因為 `pnpm` 的結構而出問題，這個設定可以一次性解決。 |
| **缺點** | 如果未來遇到其他套件有類似問題，需要再次手動處理。 | **犧牲了 `pnpm` 的優勢**。可能會掩蓋「幻影依賴（Phantom Dependencies）」問題，讓您的專案依賴關係變得不那麼嚴格和清晰。 |
| **適用場景** | 當您只想解決單一工具（如 Tailwind IntelliSense）的相容性問題時，這是**首選**。 | 當您的專案中大量使用了一些比較舊、對 `pnpm` 支援不佳的工具鏈時，這是一個有效的「大絕招」。 |

---

既然您之前拒絕了 `pnpm add -D tailwindcss` 的提議，我猜測您可能更傾向於使用 `.npmrc` 這種更根本的 `pnpm` 設定方式。

我是否要為您建立一個 `try-B/.npmrc` 檔案，並在其中加入 `shamefully-hoist=true` 這一行呢？

# 好的，這是一個非常棒的問題，直擊了前端工程化的核心。我為您做一個精闢的總結。

---

### `.npmrc` 在我們情境下的總結

#### 1. 它的作用是什麼？
在我們的場景中，`.npmrc` 的作用是**改變 `pnpm` 套件管理器的預設行為**。透過在檔案中加入 `shamefully-hoist=true`，我們強制 `pnpm` 模仿舊版 `npm` 的運作方式。

#### 2. 它要解決什麼問題？
它要解決的是 **`pnpm` 的高效能依賴結構** 與 **某些開發工具（如 VS Code 的 Tailwind IntelliSense 擴充功能）的傳統思維** 之間的**不相容問題**。

*   **`pnpm` 的世界**：為了效率，`node_modules` 裡只放直接依賴，子依賴都放在一個隱藏的 `.pnpm` 資料夾裡，用符號連結串起來。
*   **舊工具的世界**：它們預期所有需要的套件（無論是直接還是間接依賴）都會被「平鋪」在 `node_modules` 的根目錄下。

當 VS Code 擴充功能在 `node_modules` 根目錄找不到 `tailwindcss`（因為它被 `pnpm` 藏在 `.pnpm` 裡了），它就無法運作，導致我們的自動完成功能失效。

#### 3. 為何這樣做能解決？
`shamefully-hoist=true` 這行指令，就像是給 `pnpm` 下了一個命令：「別藏了，把所有東西都攤開來吧！」

`pnpm` 收到指令後，就會把 `tailwindcss` 以及所有其他的子依賴，都複製或連結一份到 `node_modules` 的根目錄。這樣一來，`node_modules` 的結構就變成了 VS Code 擴充功能所期望的樣子，它就能順利找到 `tailwindcss`，問題因此解決。

#### 4. 在沒有這個方案之前是怎麼解決的？
在我提出 `.npmrc` 方案之前，我給出的解決方案是：

**手動安裝特定套件：`pnpm add -D tailwindcss`**

這個方法可以理解為一種「精準打擊」。我們不去改變 `pnpm` 的整體行為，而是只針對出問題的 `tailwindcss` 這一個套件進行處理。

*   **原理**：執行 `pnpm add -D tailwindcss` 會告訴 `pnpm`：「`tailwindcss` 是我專案的一個**直接開發依賴**，請務必在 `node_modules` 的根目錄給我一個它的實體或快捷方式。」
*   **效果**：`pnpm` 遵守了這個指令，在根目錄放了一個 `tailwindcss` 的連結。VS Code 擴充功能高興地找到了它，問題同樣解決。

這個方法更為**外科手術式**，它在不犧牲 `pnpm` 整體優勢的前提下，解決了單一工具的相容性問題。而 `.npmrc` 方案則更像是**廣譜抗生素**，一次性解決所有潛在的類似問題，但代價是犧牲了 `pnpm` 原本的嚴格性。

兩者都是有效的解決方案，選擇哪一個取決於專案的需求和開發者的偏好。

# .npmrc 是出自誰或哪個團隊的方案？
.npmrc 這個檔案本身，是 npm (Node Package Manager) 團隊所設計和提出來的。
它是 npm 這個工具最核心的設定檔之一。
歷史與演進
創始者：npm
最早，npm 作為 Node.js 預設的套件管理器，需要一個地方來儲存使用者的設定，例如私有套件庫的登入權杖、代理伺服器的設定、腳本執行的預設行為等等。.npmrc 因此誕生，成為了 npm 的官方設定檔格式。
生態系的跟進：yarn 和 pnpm
後來，社群中出現了像 yarn 和 pnpm 這些新的套件管理器，它們旨在解決 npm 在當時所面臨的一些效能和依賴管理上的問題。
為了讓開發者能夠無痛地從 npm 遷移過來，yarn 和 pnpm 都選擇了相容 npm 的核心設定檔，也就是 .npmrc。
因此，雖然 yarn 有自己的 yarnrc.yml，pnpm 也有自己獨特的設定，但它們都會讀取並尊重 .npmrc 中的通用設定。
誰提出了 shamefully-hoist 這個方案？
而我們討論到的 shamefully-hoist 這個特定的設定，則是 pnpm 團隊提出來的。
背景：pnpm 的主要賣點就是它不「提升 (hoist)」 依賴，這讓依賴關係非常乾淨。但他們也意識到，這種作法會與許多現存的、基於 npm 傳統行為的工具產生相容性問題。
解決方案：為了提供一個「逃生口」，pnpm 團隊設計了 shamefully-hoist=true 這個選項。它的命名（"可恥地提升"）本身就帶有一點自嘲的意味，像是在說：「我知道這違背了我們的設計哲學，但如果你真的需要跟那些舊工具相容，就用這個『可恥』的選項吧。」
總結
.npmrc 檔案：由 npm 團隊提出，是 Node.js 生態系的通用設定檔標準。
shamefully-hoist 設定：由 pnpm 團隊提出，是專門為了處理其獨特依賴結構與舊工具相容性問題的特定解決方案。

# 在npm第幾版本後出現這個方法的？

這個問題非常好，它其實涉及了兩個不同的歷史，一個是關於 `.npmrc` 檔案本身的，另一個是關於 `shamefully-hoist` 這個特定設定的。

我為您分別說明：

---

### 1. `.npmrc` 檔案：來自 `npm` 的遠古時代

`.npmrc` 這個檔案的出現，幾乎可以追溯到 **`npm` 最早期的版本**，例如 **`npm v1.x`** 的時代（大約在 2011-2012 年）。

它並不是在某個後期版本中才「新增」的功能，而是從一開始就是 `npm` 設計中不可或缺的一部分。它的定位是 `npm` 的核心設定檔（**npm** **r**un **c**ommands / **n**pm **c**onfiguration），用來存放所有關於 `npm` 行為的設定。

所以，關於 `.npmrc`：
*   **誰提出？**：`npm` 團隊。
*   **何時出現？**：**`npm` 的創始時期**，是一個非常古老且基礎的檔案。

---

### 2. `shamefully-hoist` 設定：來自 `pnpm` 的創新與妥協

`shamefully-hoist` 這個設定**與 `npm` 無關**，它是 **`pnpm`** 這個套件管理器**獨有的功能**。

它的出現時間大約在 **`pnpm` 的早期發展階段**，例如 `pnpm v1.x` 的後期到 `pnpm v2.x` 期間（大約在 2017-2018 年）。

它的誕生背景是：
1.  **`pnpm` 的創新**：`pnpm` 為了徹底解決「幻影依賴」和磁碟空間佔用的問題，發明了非扁平化的、基於符號連結的 `node_modules` 結構。這是一個革命性的改變。
2.  **現實的挑戰**：這個新結構導致許多既有的、為 `npm` 傳統扁平化結構設計的開發工具（例如我們遇到的 VS Code 擴充功能）無法正常工作。
3.  **`pnpm` 的妥協**：為了讓開發者能在享受 `pnpm` 帶來的好處的同時，也能相容於廣大的既有生態，`pnpm` 團隊提出了 `shamefully-hoist=true` 這個「逃生艙」設定。它允許開發者在需要時，犧牲 `pnpm` 的嚴格性，以換取對舊工具的相容性。

所以，關於 `shamefully-hoist`：
*   **誰提出？**：**`pnpm` 團隊**。
*   **何時出現？**：**`pnpm` 的早期版本**，作為其創新結構下的配套相容性方案。

---

### 總結

| 項目 | `.npmrc` 檔案 | `shamefully-hoist=true` 設定 |
| :--- | :--- | :--- |
| **提出者** | `npm` 團隊 | `pnpm` 團隊 |
| **出現時間** | `npm` 極早期版本 (v1.x 或更早) | `pnpm` 早期版本 (約 v1.x - v2.x) |
| **屬於哪個工具**| `npm`, `yarn`, `pnpm` 皆相容 | 僅 `pnpm` 擁有 |
| **目的** | `npm` 生態系的通用設定檔 | `pnpm` 為了解決相容性問題的特定選項 |

# 頁面細節打磨與 RWD 優化

### Nuxt `compatibilityDate` 警告
- **問題**: 專案啟動時出現 `WARN We recommend adding compatibilityDate: '2025-07-16' to your nuxt.config file.` 的警告。
- **分析**: 這是 Nuxt 為了向前相容性、避免未來版本升級時出現非預期破壞性更新的建議。設定後，Nuxt 會確保專案行為與指定日期前的版本一致。
- **解決方案**: 在 `nuxt.config.ts` 中加入 `compatibilityDate: '2025-07-16'` 設定。

### 「誰適合使用 TRY」區塊 RWD 優化
#### 1. 卡片標題 (`h3`) 不等高問題
- **問題**: 在特定螢幕寬度下，因標題文字長度不同導致換行，破壞了卡片間的垂直對齊，視覺上不整齊。
- **解決方案**: 為所有卡片的 `h3` 元素統一設定 `min-h-[3.5rem]`，確保它們無論是否換行都佔據相同的高度，從而讓下方的元素能從一個統一的基準線開始排列。

#### 2. 行動裝置上列表對齊問題
- **問題**: 在窄螢幕下，希望列表項目能整體置中，但同時內部的勾選圖示又能沿著一條垂直線對齊，而非跟隨文字長度左右浮動。
- **解決方案**:
    1. 將 `<ul>` 包裹在一個新的 `<div>` 容器中。
    2. 對此 `div` 容器使用 `flex justify-center lg:justify-start`。這使得 `<ul>` 區塊在手機上作為一個整體置中，但在桌面版恢復靠左。
    3. 移除原先在 `<li>` 上的對齊 class，讓其內容（圖示和文字）自然地從其容器（`<ul>`）的左側開始排列，從而實現「區塊置中，內容左對齊」的精細效果。

#### 3. 列表項目 (`li`) 不等高問題
- **問題**: 當列表項目的文字因換行而超過一行時，會導致不同卡片對應位置的項目高度不一，影響了跨卡片的視覺對齊。
- **解決方案**: 為所有 `<li>` 元素統一設定 `min-h-[3.5rem]`，確保它們即使內容換行，也能保持一致的高度，維持版面的穩定與整齊。

### Header 行動版漢堡選單修正
#### 1. 選單層級 (`z-index`) 過低與點擊穿透問題
- **問題**: 展開的漢堡選單被頁面其他內容（如 Hero 區塊）遮擋，導致選單內的連結無法點擊。
- **分析**: 這是典型的堆疊上下文（Stacking Context）問題。`position: sticky` 的 `<header>` 未設定 `z-index`，導致其建立的堆疊上下文層級不夠高，其子元素的 `z-index` 再高也無法超越其他區塊。
- **解決方案**: 建立一套清晰、可維護的層級系統：
    - `<header>`: `z-40` (建立高於頁面內容的基準)
    - 黑色遮罩: `z-45` (介於 Header 和選單之間)
    - 選單面板: `z-50` (確保在最頂層)

#### 2. 選單開合時畫面橫向位移問題
- **問題**: 選單打開時，程式碼為了鎖定背景滾動而隱藏了 `<body>` 的滾動條，導致頁面可用寬度瞬間改變，產生了視覺上不舒服的「跳動」。
- **解決方案**: 升級 `watch` 函式。在打開選單時，用 JavaScript 精準計算當前瀏覽器滾動條的寬度 (`window.innerWidth - document.documentElement.clientWidth`)，並將該寬度作為 `padding-right` 動態應用於 `<body>`，以此「撐住」版面，完美補償因滾動條消失而產生的空隙，防止畫面位移。

#### 3. 視窗縮放時選單狀態未同步問題
- **問題**: 在手機版打開選單後，若將視窗拉寬到桌面版（>= 1024px），選單的打開狀態 (`isMenuOpen` 為 `true`) 被保留了下來，這不符合預期。
- **解決方案**: 使用 Vue 的 `onMounted` 和 `onBeforeUnmount` 生命週期鉤子，安全地掛載和卸載一個 `resize` 事件監聽器。此監聽器會持續偵測視窗寬度，一旦超過 `1024px` 的斷點，就自動將 `isMenuOpen` 狀態設為 `false`，強制關閉選單，確保元件狀態在不同響應式斷點之間能正確同步。

# 圖片資源無法讀取問題：`assets` vs `public` 的深度解析

### 1. 問題現象
在「我們的合作夥伴」區塊中，透過 `v-for` 動態渲染的 Logo 圖片全數破圖，瀏覽器開發者工具顯示 404 (Not Found) 錯誤。

### 2. 偵錯與分析過程
整個過程像是在剝洋蔥，層層深入，最終找到問題根源：

*   **初步嘗試與錯誤**：
    *   **路徑語法錯誤**：一開始嘗試了各種路徑寫法，如 `~/assets/...`, `/~/assets/...`, `../assets/...`，但都因為 Vue Router 將其誤判為頁面路由而產生警告。
    *   **核心誤解**：未能區分靜態 `src` 與動態 `:src` 對路徑處理方式的根本不同。

*   **關鍵認知：Build Time vs. Runtime**
    *   **Build Time (建置期)**：開發者在電腦上執行 `pnpm run dev` 的階段。`Vite` (Nuxt的建置工具) 在此期間會掃描原始碼。
        *   當它看到 `<img src="~/assets/...">` 這種**靜態路徑**時，它會將其視為一個模組，進行處理和優化，並替換成最終的、帶有 hash 值的 URL。`~` 別名是給 Vite 看的**指令**。
    *   **Runtime (執行期)**：使用者的**瀏覽器**載入網頁並執行 JavaScript 的階段。
        *   當 Vue 處理 `<img :src="imageUrl">` 這種**動態綁定**時，它只是將 `imageUrl` 這個**變數的字串值**原封不動地交給瀏覽器。
        *   瀏覽器不認識 `~` 或 `../` 這種原始碼層面的路徑，它只會根據當前網址去請求這個字串，因此導致 404。

*   **`assets` vs `public` 的正確定位**
    *   **`assets`**：給 **Build Time** 使用。存放需要被 Vite 處理、優化的資源。適合**靜態路徑**。
    *   **`public`**：給 **Runtime** 使用。存放不需要處理、會被原封不動複製到網站根目錄的資源。其路徑是穩定、公開、可預測的。適合**動態路徑**。

*   **最終問題定位**：
    *   我們將圖片放到了 `assets` 資料夾，並在程式碼中嘗試用動態路徑引用，這是導致 Vite 無法在建置期處理它們的根本原因。

### 3. 解決方案與未來應對策略

#### 解決方案
1.  **方法一 (推薦)：明確匯入 (Explicit Import)**
    *   **作法**：在 `<script setup>` 中，像匯入元件一樣，明確地將每一張需要的圖片匯入為一個模組。
    *   **範例**：
        ```javascript
        import googleLogo from '~/assets/img/home/partners/google-logo.webp';
        // ...
        const partners = [
          { name: 'Google', logo: googleLogo },
          // ...
        ];
        ```
    *   **優點**：
        *   **效能最佳**：Vite 在建置期就能知道這些圖片是依賴項，會對其進行最佳化處理（如 tree-shaking、hash命名），並正確地打包。
        *   **路徑穩定**：完全不用擔心路徑問題，因為是直接引用變數。
        *   **型別安全**：在 TypeScript 環境下，路徑錯誤會在開發階段就被發現。
    *   **適用時機**：圖片數量不多、列表相對固定時的最佳選擇。

2.  **方法二：移至 `public` 資料夾**
    *   **作法**：將所有動態綁定的 Logo 圖片從 `assets` **移動到** `public` 資料夾（例如 `public/img/partners/`）。
    *   **路徑寫法**：在 `partners` 陣列中，將 `logo` 路徑修改為從網站根目錄開始的**絕對路徑**，例如：`'/img/partners/google-logo.webp'`。
    *   **優點**：簡單直觀，不需要在 `<script>` 中額外匯入。
    *   **缺點**：這些圖片會**失去 Vite 的建置期優化**，它們會被原封不動地複製到最終產出的資料夾中，不會有 hash 命名，瀏覽器快取策略會比較弱。
    *   **適用時機**：圖片數量龐大，或圖片路徑本身需要由後端 API 提供時。

#### 未來如何分類圖片資源
為了避免重蹈覆轍，請遵循以下決策流程：

1.  **問：這個圖片的路徑，是寫死在 `<template>` 裡的靜態字串嗎？**
    *   **是** (例如 `<img src="~/assets/img/hero-bg.webp">`) → 放到 **`assets`** 資料夾。這是 Vite 最喜歡的方式。
    *   **否** (例如 `<img :src="partner.logo">`) → 進入下一個問題。

2.  **問：這個動態圖片的數量多嗎？列表是否經常變動？**
    *   **不多，且相對固定** → **優先使用「明確匯入」** 的方式，將圖片放在 **`assets`** 資料夾。這是兼顧效能與開發體驗的最佳實踐。
    *   **數量龐大或由後端決定** → 將圖片放在 **`public`** 資料夾，並使用絕對路徑引用。

這個簡單的決策樹可以解決絕大多數的資源存放問題。

# 角色扮演：一場前端開發的工程大戲

### 1. 核心概念：建置期 (Build Time) vs. 執行期 (Runtime)
理解現代前端框架的關鍵，在於區分兩個核心階段：

*   **Build Time (建置期 / 設計期)**：發生在開發者的電腦上，當我們執行 `pnpm run dev` 或 `pnpm run build` 時。此階段由「建築師」(Vite) 主導，負責將我們的原始碼藍圖轉換成標準化的施工圖。
*   **Runtime (執行期 / 施工期)**：發生在使用者的瀏覽器中，當使用者打開網站時。此階段由「工頭」(Vue) 和「工地」(瀏覽器) 合作，負責將施工圖蓋成可互動的房子。

### 2. 角色職責

#### 角色一：建築師 (Vite)
*   **職責**：**翻譯與轉換**。
*   **工作內容**：他是唯一看過我們原始設計草圖 (`.vue`, `.ts` 檔案) 的角色。他負責將這些充滿想法的草圖，轉換成工班能看懂的、標準化的最終施工藍圖 (編譯、優化、打包後的 HTML, CSS, JS 檔案)。
*   **何時反應**：僅在 **Build Time**。
*   **對什麼反應**：對原始碼中的特定語法（如 `~/assets/...` 的靜態路徑）做出反應，並將其轉換。對於他看不懂或不歸他管的指令（如 `:src` 中的 JS 變數），他會選擇忽略，原封不動地交給下一階段。

#### 角色二：工頭 (Vue.js)
*   **職責**：**啟動與管理**。
*   **工作內容**：他從未見過原始草圖，只會拿著建築師給的最終施工藍圖 (編譯後的 JS) 在工地 (瀏覽器) 工作。
    1.  **盤點與啟動 (Hydration)**：當他剛到達工地時，會先對著已經送達的樣品屋 (靜態 HTML) 進行盤點，為所有門窗、開關「接上電線」(綁定事件監聽)，為其注入生命力。
    2.  **長期駐點管理 (Reactivity)**：啟動完成後，他會留在工地，隨時監控並回應使用者的所有操作（點擊、輸入），並即時更新畫面上對應的數據與狀態。
*   **何時反應**：主要在 **Runtime**。
*   **對什麼反應**：對使用者的互動、數據的變化做出反應，並嚴格執行施工藍圖 (JS) 中的所有指令。

#### 角色三：工地 (瀏覽器)
*   **職責**：**呈現與執行**。
*   **工作內容**：他是最終的施工現場。他負責接收建築師的結構圖 (HTML)，貼上裝潢指南 (CSS)，並提供一個環境讓工頭 (Vue) 執行他的互動說明書 (JS)。瀏覽器只看得懂最標準的網址路徑，不認識 `~` 這種原始碼層面的別名。

### 3. 關係鏈：一場接力賽
Vite 和 Vue 之間是**上下游的接力關係**，而非共同開會。
`Vite (建築師) -> 編譯後的程式碼 (施工藍圖) -> Vue (工頭)`
建築師負責處理最原始的材料，產出標準化的藍圖；工頭則完全依賴這份藍圖來進行施工與管理。各司其職，完美合作。

#### 角色四：總設計師兼專案經理 (Nuxt)
*   **職責**：**制定規範、整合資源、管理專案**。
*   **工作內容**：如果說 Vite 是建築師，Vue 是工頭，那麼 Nuxt 就是這家建築公司的「總設計師」兼「專案經理 (PM)」。
    1.  **制定藍圖規範 (Convention over Configuration)**：他為整個專案制定了一套標準流程，例如 `pages` 資料夾自動生成路由、`components` 資料夾自動引入元件。這讓我們免於繁瑣的設定，專注於核心業務。
    2.  **管理分包商**：他負責協調建築師 (Vite) 和工頭 (Vue)。他會根據 `nuxt.config.ts` 的設定去指揮 Vite 如何打包；同時，他也為 Vue 提供了大量預製好的高級工具（如 `useFetch`），讓 Vue 在伺服器和瀏覽器兩端都能聰明地工作。
    3.  **負責樣品屋預施工 (SSR)**：他引入了伺服器端渲染機制，能在伺服器上預先蓋好一個靜態的樣品屋，第一時間呈現給使用者，帶來極佳的效能和 SEO 優勢。
*   **與他人關係**：**總包商與分包商**。Nuxt 是核心的決策者，他選擇並整合了 Vite 和 Vue，並圍繞它們建立了一整套自動化的開發體系，賦予了它們處理複雜現代化專案的超能力。我們開發時，主要是在遵循 Nuxt 這位總設計師的規範與哲學。

### 4. 終極角色：業主兼總建築設計師 (您，前端工程師)
*   **職責**：**提出願景、繪製藍圖、最終驗收**。
*   **工作內容**：您是這一切的起點與最終決策者。
    1.  **提出願景 (The Visionary)**：專案要蓋成什麼樣子，最初的構想與需求來自於您。
    2.  **繪製藍圖 (The Blueprint Creator)**：您親手撰寫的每一行程式碼 (`.vue`, `.ts`, `nuxt.config.ts`)，就是整個建案最詳細、最精確的設計藍圖。
    3.  **最終驗收 (The Final Inspector)**：網站完成後，您是那個打開瀏覽器，親自檢驗每一個功能與細節是否符合您設計的人。
*   **與他人關係**：**委託與管理的頂層**。
    *   您是整個專案的「業主」，您將您的設計藍圖（程式碼）全權委託給專案經理 (Nuxt)。
    *   您通常不直接與第一線的建築師 (Vite) 或工頭 (Vue) 溝通，而是透過 Nuxt 來傳達您的設計意圖。他們是實現您願景的專業執行團隊。

#### 完整流程總結
`您 (業主/總設計師) -> Nuxt (專案經理) -> Vite (建築師) & Vue (工頭)`
這就是一場完整的前端工程大戲，而您，正是這場大戲的導演。

# 動態圖片管理策略：手動 `import` vs. 自動化 `import.meta.glob`

### 1. 問題情境
當專案中需要在 JavaScript 中動態引用大量圖片時（例如一個由 `v-for` 渲染的合作夥伴 Logo 列表），開發者會面臨一個技術選型：應該繼續手動、明確地 `import` 每一張圖片，還是採用更自動化的方案？

### 2. 兩種方案比較

#### 方案一：手動明確匯入 (Manual Explicit Import)
*   **作法**：在 `<script setup>` 區塊頂部，為每一張圖片編寫一行 `import` 語句，並在陣列或物件中直接使用這些匯入的變數。
    ```javascript
    import ssiLogo from '~/assets/img/partners/ssi.webp';
    import googleLogo from '~/assets/img/partners/google.webp';

    const partners = [{ logo: ssiLogo }, { logo: googleLogo }];
    ```
*   **優點**：
    *   **直觀清晰**：程式碼意圖明確，一眼就能看出所有依賴。
    *   **完全的靜態分析**：Vite 在建置期能完美處理，享受所有優化（tree-shaking, hashing）。
    *   **類型安全**：路徑錯誤在開發階段就能被捕捉。
*   **缺點**：
    *   **維護成本**：當圖片數量增加時，`import` 列表會變得很長，每次增刪都需要修改兩個地方（檔案系統和 `import` 列表）。

#### 方案二：自動化全域匯入 (Automated Glob Import)
*   **作法**：使用 Vite 提供的 `import.meta.glob` 功能，一次性地、異步地匯入所有符合特定模式的圖片模組。
    ```javascript
    const imageModules = import.meta.glob('~/assets/img/partners/*.webp');

    // 需要進一步處理 imageModules 來匹配到正確的 logo
    // 這通常涉及從檔案路徑中提取檔案名稱
    ```
*   **優點**：
    *   **可擴展性強**：新增或刪除圖片時，**完全不需要修改程式碼**，只需操作檔案系統即可。
    *   **程式碼簡潔**：無論有多少張圖片，程式碼都只有幾行。
*   **缺點**：
    *   **輕微的複雜性**：需要額外的邏輯來從 `import.meta.glob` 返回的物件中，根據檔案名稱動態地匹配到正確的圖片模組。
    *   **執行期成本**：`glob` 匯入可能是異步的，且在執行期需要多一步處理，但對於本地圖片，此效能影響通常可忽略不計。

### 3. 決策框架：何時應該切換？
沒有絕對的數字，但可以根據以下幾個維度進行權衡。當滿足其中 **2 個或更多**條件時，就是考慮切換的好時機：

*   **數量閾值 (The "Annoyance" Threshold)**：
    *   **< 15 張**：手動 `import` 是最佳選擇。
    *   **> 25 張**：強烈建議切換到自動化方案，因為手動維護已顯著影響效率。
*   **變動頻率 (The "Frequency" Threshold)**：
    *   **低頻率** (一年更新一次)：手動 `import` 的維護成本很低。
    *   **高頻率** (每週都有增刪)：自動化方案能大幅簡化工作流程，避免出錯。
*   **未來預期 (The "Growth" Threshold)**：
    *   如果預見到列表在未來會**持續、大量地增長**，那麼在專案初期就採用可擴展的自動化方案，是一個有遠見的架構決策。

### 4. 總結建議
對於目前的專案，合作夥伴 Logo 數量不多且固定，**繼續使用手動、明確的 `import` 是最清晰、最合適的選擇**。

將 `import.meta.glob` 視為工具箱中的一個強大選項，當未來專案規模擴大，手動維護的「痛苦」超過了實作自動化方案的「成本」時，再充滿信心地進行重構。

# Vercel 部署失敗偵錯：從 Git 到資產管理的紀錄

### 1. 問題現象
專案在 Vercel 上進行部署時，建置 (Build) 過程失敗。查看 Vercel 的部署日誌 (Build Logs)，發現關鍵錯誤訊息為：
`[vite:asset] Could not load /vercel/path0/assets/img/... (imported by ...): ENOENT: no such file or directory`
這個錯誤最初指向 `try-before-you-dive-bg.webp`，在修正並推送後，又變成了 `try-beta-logo.webp`，這表明問題並非出在單一檔案，而是一個系統性的問題。

### 2. 偵錯與分析的洋蔥模型
這次的偵錯過程就像剝洋蔥，從最表層的 Git 操作問題，一路深入到最核心的 Vite 資產處理機制。

#### 第一層：Git 同步問題 (程式碼未更新)
*   **狀況**：在本地修正了圖片路徑後，`git push` 卻顯示 `Everything up-to-date`，導致 Vercel 始終都在用舊的、有問題的程式碼進行建置。
*   **原因**：
    1.  對 Git 工作流的誤解，例如在 `feat` 分支上試圖 `push` 到 `main`。
    2.  本地分支與遠端分支追蹤關係混亂，甚至一度將本地 commit 推送到一個已被刪除的遠端分支上。
*   **使用的工具與概念**：
    *   `git status`, `git log`: 確認本地工作區與提交歷史的狀態。
    *   `git remote -v`: 檢查遠端倉庫的設定。
    *   `git reflog`: 找回因錯誤操作而「遺失」的 commit。
    *   `git cherry-pick`: 將找回的 commit 精準地應用到正確的修復分支上。
    *   `git push origin <branch-name>`: 明確指定要推送的目標分支。
*   **教訓**：部署失敗時，**第一步永遠是確認部署平台所使用的程式碼版本，是否真的包含了你本地的最新修正**。

#### 第二層：檔案名稱大小寫問題 (跨平台陷阱)
*   **狀況**：即使確認最新的程式碼已推送，Vercel 依然報錯找不到檔案。
*   **原因**：
    1.  **作業系統差異**：開發環境 (Windows/macOS) 的檔案系統預設是「大小寫不敏感」的，而 Vercel 的建置環境 (Linux) 是「大小寫敏感」的。
    2.  **Git 預設行為**：Git 在大小寫不敏感的系統上，預設也遵循系統的規則 (`core.ignorecase = true`)。這導致如果你僅僅在檔案總管中將 `Logo.webp` 改為 `logo.webp`，Git 可能無法偵測到這是一個變更。
*   **解決方案**：
    *   偵錯時，實際採取的行動是在檔案總管中直接將檔名從大寫改為小寫 (e.g., `Try-Beta-Logo.webp` -> `try-beta-logo.webp`)。
    *   這個操作**未能解決問題**，反而是一個常見陷阱。因為 Git 在 Windows/macOS 上預設會忽略檔名大小寫的變更，導致這個「修正」從未被提交。
*   **正確的處理方式**：
    *   要讓 Git 正確追蹤檔名大小寫的變更，必須使用 `git mv` 指令。
    *   `git mv Try-Beta-Logo.webp try-beta-logo.webp`
    *   理解這一點是避免未來發生同樣問題的關鍵。
*   **教訓**：**在前端專案中，強烈建議所有檔案與資料夾名稱都使用小寫，並用中橫線 (`-`) 連接**，以從根本上避免這類跨平台問題。

#### 第三層：Nuxt/Vite 資產處理機制 (根本原因)
*   **狀況**：在解決了前兩層問題後，我們終於觸及了問題的核心，也就是 `assets` 和 `public` 資料夾的根本區別。
*   **原因**：這與我們在另一章節「圖片資源無法讀取問題」中的分析完全一致：
    1.  Vite 在**建置期 (Build Time)** 處理 `assets` 資料夾中的資源，但它只認得在 `<template>` 中寫死的**靜態路徑** (e.g., `<img src="~/assets/...">`)。
    2.  當我們在 `<script>` 中用一個變數去動態綁定 `:src` 時，這個路徑是在**執行期 (Runtime)** 才被解析的。Vite 在建置期對此一無所知，因此不會處理和打包這些圖片。
    3.  最終，瀏覽器在執行期拿到一個它不認識的原始碼路徑 (`~/assets/...`)，因此發出請求並得到 404 錯誤。
*   **教訓**：**一個資源應該放在 `assets` 還是 `public`，取決於它的路徑是「靜態的」還是「動態的」**，這是決定性的判斷標準。

### 3. 最終解決方案
遵循了「圖片資源無法讀取問題」章節中總結的最佳實踐：

*   對於「我們的合作夥伴」這類動態列表，且圖片數量可控的情況下，採用**明確匯入 (Explicit Import)** 的方案。
*   在 `pages/index.vue` 的 `<script setup>` 中，為每一張 Logo 圖片編寫 `import` 語句，並將匯入的模組直接用於 `partners` 陣列。
*   這個方案讓 Vite 在建置期就能識別、優化並正確打包所有圖片資源，從而徹底解決了 Vercel 上的部署失敗問題。

# EP10 開發偵錯紀錄：從樣式告警到 SSR 錯誤的完整解決方案

### 1. Element Plus API 棄用警告
- **問題現象**: 專案啟動後，終端機出現大量 `[el-radio] [API] label act as value is about to be deprecated...` 的警告。
- **分析**: 這是因為 Element Plus 在新版本中，推薦使用 `value` 屬性來取代 `label` 屬性，以作為 `el-radio` 的唯一值標識。這是一個為了 API 一致性和向前相容性的變更。
- **解決方案**: 在 `pages/company/purchase/payment.vue` 中，將所有 `<el-radio>` 元件的 `label="..."` 屬性，全部替換為 `value="..."`。

### 2. Font Awesome 圖示缺失錯誤
- **問題現象**: 瀏覽器主控台報錯 `Could not find one or more icon(s) { prefix: 'fab', iconName: 'cc-visa' }`，導致信用卡 Logo 無法顯示。
- **偵錯與分析**:
  1.  初步判斷是圖示未被註冊。
  2.  在 `plugins/fontawesome.ts` 中嘗試引入圖示，但錯誤地引入了需要額外付費或安裝其他套件的 `solid` 和 `regular` 圖示庫，導致了 `Cannot find module` 的 linter 錯誤。
  3.  透過檢查 `package.json`，確認 `@fortawesome/free-brands-svg-icons` 套件已安裝。
  4.  最終確認問題根源是：**圖示雖然來自已安裝的套件，但沒有在 `fontawesome.ts` 的 `library.add()` 中被正確註冊。**
- **解決方案**: 修改 `plugins/fontawesome.ts`，從 `@fortawesome/free-brands-svg-icons` 中明確匯入 `faCcVisa`, `faCcMastercard`, `faCcJcb`，並將它們加入到 `library` 中。

### 3. SSR 水合作用不匹配錯誤 (Hydration Mismatch)
- **問題現象**: 瀏覽器主控台報錯 `Cannot read properties of null (reading 'ce')`，且錯誤堆疊指向 Element Plus 的 `header` 元件。
- **分析**:
  - 這是一個典型的 SSR Hydration 錯誤，意指伺服器端渲染出的 HTML 結構，與瀏覽器端 Vue.js 預期要「激活」的結構不一致。
  - 問題根源在於共用的佈局檔案 `layouts/company.vue`。根據 Element Plus 官方文件，`<el-header>` 元件必須是 `<el-container>` 的直接子層。但在我們的程式碼中，它被錯誤地放置在了 `<el-container>` 之外。
- **解決方案**:
  1.  修改 `layouts/company.vue` 的根元素，將其從 `<div>` 改為 `<el-container>`。
  2.  調整內部結構，確保 `<el-header>` 和另一個包含 `<el-aside>` 及 `<el-main>` 的 `<el-container>`，都成為頂層 `<el-container>` 的直接子元素，使其完全符合官方文件的結構規範。

### 4. `@apply` 語法告警與編譯錯誤
- **問題現象**:
  1.  在 `<style>` 區塊中使用 `@apply` 時，編輯器 (VS Code) 出現 `Unknown at rule @apply` 的告警。
  2.  為了解決告警而加上 `lang="scss"` 後，開發伺服器報錯 `Preprocessor dependency "sass-embedded" not found`。
- **分析**:
  - **`@apply` 告警**：這是因為編輯器預設將 `<style>` 視為標準 CSS，而不認識 `@apply` 這個屬於 Tailwind CSS 的特殊指令。
  - **`sass` 依賴缺失**：當我們加上 `lang="scss"` 時，等於是告訴 Nuxt/Vite 要使用 SCSS 預處理器來編譯這段樣式。這個動作啟用了更完整的 PostCSS 處理流程（這才能讓 `@apply` 生效），但也同時觸發了對 `sass` 編譯工具本身的依賴檢查。由於專案中並未安裝 `sass`，因此編譯失敗。
- **解決方案 (探索過程)**:
  1.  **安裝依賴**: 執行 `pnpm add -D sass`，為專案補上 SCSS 預處理器。
  2.  **添加語言標籤**: 在 `.vue` 檔案的 `<style>` 標籤中加入 `lang="scss"`。
  3.  **配置編輯器**: 為了讓 VS Code 本身也認識 `@apply`，在專案根目錄的 `.vscode/settings.json` 中，加入 `"css.lint.unknownAtRules": "ignore"`。
- **最終實踐**:
  - 考量到專案以 Tailwind CSS 為核心，為了避免未來因 `lang="scss"` 標籤而無意中引入 SCSS 語法，導致樣式管理複雜化，最終採取了更簡潔的策略。
  - **我們移除了 `index.vue` 與 `payment.vue` 中 `<style>` 標籤的 `lang="scss"` 屬性，並接受了編輯器層級的 `@apply` 視覺告警**，因為它不影響專案的實際編譯與運行，以此換取了更純粹、單一的樣式技術棧。

# 首頁「誰適合使用」區塊樣式修正與元件隔離

### 1. 問題現象
在首頁 (`index.vue`) 的「誰適合使用 TRY β」區塊中，列表項目的打勾圖示 (`<CheckIcon />`) 尺寸異常巨大，導致其旁邊的文字被推擠換行，完全破壞了設計稿的排版。

### 2. 根本原因分析
經分析，問題根源在於共用的 `CheckIcon.vue` 元件。
- **通用性設計的副作用**：`CheckIcon.vue` 被設計為一個通用的 SVG 元件，其內部沒有設定固定的寬高尺寸，目的是為了讓使用它的地方能自由決定其大小。
- **Flex 佈局下的尺寸失控**：在 `index.vue` 的 `<li>` 中，這個沒有內在尺寸的 SVG 圖示被放在一個 `flex` 容器內，且沒有被賦予明確的 `w-*` 或 `h-*` class。這導致瀏覽器錯誤地將其拉伸以填充可用空間，造成尺寸失控。

### 3. 解決方案與實作過程

#### 第一步：隔離衝突，建立專用元件
為了避免修改共用元件 `CheckIcon.vue` 而影響到其他未知頁面，我們採取了隔離策略。
1. 建立一個專為首頁使用的 `components/HomeCheckIcon.vue` 元件。
2. 在 `index.vue` 中，全面將原本使用的 `<CheckIcon />` 替換為新的 `<HomeCheckIcon />`，立即修復了排版問題。

#### 第二步：根據需求，升級圖示樣式
根據使用者提出的新需求，希望圖示為「帶有圓圈的打勾」。
1. 我們意識到這與專案已安裝的 Element Plus UI 函式庫風格一致。
2. 因此，我們再次修改 `HomeCheckIcon.vue`，將其內容從原生的 SVG 程式碼，替換為直接從 `@element-plus/icons-vue` 引入的 `<CircleCheckFilled />` 元件。
3. 同時為其添加了 `text-major-blue-light` 的 class，使其顏色與網站主視覺保持一致。

### 4. 關鍵學習與總結
- **元件化風險管理**：修改通用元件具有潛在風險。當只需要針對特定頁面做樣式調整時，建立一個專用的、隔離的元件是更安全、可維護性更高的作法。
- **SVG 與尺寸**：在使用無內在尺寸的 SVG 元件時，必須在使用它的地方明確提供尺寸限制（如 `w-6 h-6`），尤其是在 Flex 或 Grid 這種彈性佈局中，以防止非預期的尺寸擴張。
- **善用既有技術棧**：當需要新的 UI 元素時，應優先考慮從專案現有的 UI 函式庫（本例中為 Element Plus）中尋找解決方案，以確保風格的統一性並減少開發成本。