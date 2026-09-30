---
name: hanlin-web-basic
description: 翰林 Web 基本規範 — 設計 token、元件規則、無障礙、防破版、去除 AI 感與交付檢查，供 AI 產出符合翰林規範的頁面
---

# 翰林 Web 基本規範

> **這是翰林唯一的基本規範檔。** 2026-09-24 由 `STYLEGUIDE.md`（設計系統規範）、本檔舊版（濃縮版＋UI.md 原文）整併而成，舊檔不再維護。
> 不含任何風格色版；要特定視覺風格，請改用視覺套版平台匯出的 `SKILL-<色版名>.md`（該檔的色彩、Logo、字體、形狀以色版為準，其餘沿用本檔）。
> 對應實作：本資料夾的 `tokens.css`（唯一數值來源）、`hl-style.css`、`app.js`、`index.html`。**本檔與實作不一致時，先回報，不要自行選一邊。**
> 整併時裁定過的衝突列在 §12。

## 0. 使用說明

### 檔案

| 檔案 | 是什麼 | 你會不會改它 |
|---|---|---|
| `index.html` | 示範頁。頁首、Hero、篩選、卡片、按鈕七態、表單、Accordion、頁尾 | 會，這是你的起點 |
| `tokens.css` | 設計 token。**唯一的數值來源** | 換品牌色時只改這裡 |
| `hl-style.css` | 元件樣式。全部引用 token，不含任何色碼 | 加元件時改這裡 |
| `app.js` | 基本互動：chip 鍵盤操作、Accordion、表單驗證 | 視需要 |
| `favicon.svg` | 網站頁簽 icon（翰林 H 標） | 不用改 |

品牌標誌不是獨立檔案：§3.11 要求以 inline SVG 內嵌，文字墨色才能綁定 `--logo-ink`、在淺色底與深色底自動切換。標誌直接寫在 `index.html` 的頁首與頁尾，複製整段 `<a class="logo">` 即可。

### 怎麼跑

直接雙擊 `index.html` 就能看。要完整測試（含字體載入）就用 http 開：`python3 -m http.server 8000`，再開 http://127.0.0.1:8000/。

### 元件 class 對照

`index.html` 就是實際用法的範本，每個區塊上方都有註解。沿用 class，顏色與圓角都從 `tokens.css` 來，不要另寫色碼。

| 元件 | 寫法 |
|---|---|
| 按鈕 | `<button class="btn"><span class="btn__label">動詞</span></button>`；變體 `btn--secondary`／`btn--text`／`btn--danger`／`btn--sm`；載入 `data-loading="true" aria-busy="true"` |
| 輸入框 | `.field > .label + .input + .hint + .error-text`；錯誤加 `aria-invalid="true"` 與 `aria-describedby` |
| 下拉 | `<div class="select"><select>…</select></div>`（原生 select，外層畫箭頭） |
| 核取／單選 | `<label class="choice"><input type="checkbox">文字</label>` |
| 開關 | `<span class="switch" role="switch" aria-checked="false" tabindex="0" data-switch></span>` |
| 分頁 | `<div class="tabs" role="tablist" data-tabs><button class="tab" role="tab" aria-selected="true" aria-controls="panel-id">`；面板 `role="tabpanel"`，非當前加 `hidden` |
| 篩選 chip | `.chip-group[role=tablist] > .chip[role=tab]`（全圓） |
| 狀態標籤 | `<span class="badge badge--info|success|warning|danger">` |
| 提示訊息 | `<div class="alert alert--success|warning|danger" role="status|alert"><span class="alert__icon material-symbols-rounded" aria-hidden="true">info</span><div>文字</div></div>` |
| 教材卡片 | `<a class="resource-card">` 內放 `.resource-card__cover`、`.resource-card__title`、`.resource-card__meta`、`.resource-card__go` |
| Header 導覽 | `.site-header > .container > .logo + .nav-toggle[data-nav-toggle aria-controls] + nav.site-nav-wrap > ul.site-nav`；≤860px 自動收成漢堡選單（點擊開合、Esc／點外面關閉） |
| Footer | `.site-footer .footer-cols > .footer-col(h3+ul)`；桌機三欄，≤640px 單欄 |
| 表格 | `<div class="table-wrap"><table class="table table--stack">`；每個 `<td>` 加 `data-label="欄名"`；次要欄加 `data-priority="optional"`（≤860px 隱藏）；≤640px 變成一筆一卡的直式小表（見 §2.7）；`data-mobile="title"` 的格加粗當卡片標題 |
| Hero 區塊 | `section.section.section--subtle.hero` > `.hero-art`（四個 `<i>` 裝飾形狀）＋ `.container` > `h1`（關鍵詞包 `<mark class="hl">`）、`p.lead`、`.row`（主要／次要按鈕） |
| 內文區塊 | `section.section[.section--subtle]` > `.container.stack`；標題 `h2.accent`（對比色短底線）；橫排用 `.row`、直排用 `.stack` |
| 手風琴 | `.accordion[data-single] > .accordion__item > h3 > button.accordion__trigger[aria-expanded aria-controls] + .accordion__panel` |
| 空狀態 | `.empty-state`（h3 說明＋一顆次要按鈕），篩選無結果時顯示 |
| 回到頂端 | `button.to-top[data-to-top]`，捲動超過一屏才出現 |
| 手機重排 | 靠 class 自動：≤860px `.site-nav` 收成漢堡；≤640px `.table--stack` 直式小表、`.footer-cols` 單欄、`.card-grid` 單欄；不要另外寫縮小或橫向捲軸 |
| 一般卡片 | `.card-grid > .card`；封面 `.card__media` 自動輪替裝飾色形狀 |
| 對比色 | 只用在裝飾形狀：Hero `.hero-art`、`h2.accent` 底線、`mark.hl` 標題底線；不得當文字色或承載文字的底色 |

---

## 1. 目標與最高原則

**設計意圖：** 讓翰林數位教學產品在課前備課、課中教學與作業測驗三個階段中，以一致、可驗證、對鍵盤與螢幕閱讀器友善的介面呈現。

- 品牌：翰林相信學習
- 受眾：國小至技高的教師、學生與教學支援人員
- 無障礙目標：WCAG 2.2 AA

**最高原則（違反任一條即不合格）**

1. **所有介面數值必須來自 `tokens.css`**，不得在元件層寫入色碼或一次性尺寸。
2. **每個互動元件必須具備七種狀態**：default、hover、focus-visible、active、disabled、loading、error（選取類元件另加 selected，資料元件另加 empty）。
3. **每條無障礙規則都必須可以被測試。**
4. 所有產品共用相同的基礎元件、互動行為與無障礙規則；不得因國小、國中、高中、技高、教師端或學生端而複製 Button、Input、Modal 等基礎元件。
5. 各產品只能透過語意 token 調整品牌色彩與視覺主題；教材篩選、課次選擇、AI 產生與命題流程屬於「教育產品模式」（§8），不是 Theme。
6. 優先使用原生 HTML 語意；原生元素不足時才補 ARIA。
7. 防破版是元件與內容模型的共同責任，不得只靠企劃自行縮短文字（§7）。

---

## 2. 設計 token 與基礎

token 定義於 `tokens.css`，是唯一的數值來源。元件層必須引用語意 token。

### 2.1 色彩（Colors）

全文其他章節一律引用此處的語意 token，不得另行寫入色碼。

#### Primary

| Token | 值 | 用途 |
| --- | --- | --- |
| `color.surface.strong`／`color.action.bg` | `#064EA4` | 主要按鈕、連結、焦點框、徽章文字；其上白字 7.97:1 |
| `color.action.bg.hover` | `#05407F` | 主要按鈕 hover |
| `color.action.bg.active` | `#03305F` | 主要按鈕按下 |

#### Neutral

| Token | 值 | 別名 | 用途 |
| --- | --- | --- | --- |
| `color.surface.muted` | `#FFFFFF` | Neutral 0 | 頁面與卡片底色 |
| `color.page.bg.subtle` | `#F4F7FB` | Neutral 200 | Hero 與區塊大面積底色 |
| `color.disabled.bg` | `#EEF2F7` | — | 停用底色、輸入框 hover 底 |
| `color.text.tertiary` | `#BECAD7` | — | 深色底文字、分隔 |
| `color.text.primary` | `#62778F` | — | 正文（白底 4.61:1） |
| `color.text.on-subtle` | text.primary 以 `color-mix` 壓深 12%（CSS 變數 `--color-text-on-subtle`） | — | 淺底 `#F4F7FB` 上的正文（約 5.26:1） |
| `color.text.secondary` | `#1E3D60` | — | 標題、頁尾底色 |
| `color.surface.base` | `#000000` | — | 最深底色 |

#### 裝飾色（Decorative，限制最嚴、最常被誤用）

| Token | 值 | 用途 |
| --- | --- | --- |
| `color.decor.sun` | `#F5D35B` | 僅限裝飾形狀 |
| `color.decor.warm` | `#EF9D78` | 僅限裝飾形狀 |

- 只用於畫面生動化的視覺點綴（Hero 形狀、插圖、背景幾何、`h2.accent` 底線、`mark.hl`）。
- 不得作為文字色、狀態色，也不得作為承載文字的底色（裝飾黃於白底只有 1.46:1）。
- **不得進入元件層**：按鈕、徽章、標籤、輸入框、卡片等一律不使用。

#### Semantic 與品牌

| Token | 值 | 用途 |
| --- | --- | --- |
| `color.danger` | `#B3261E` | 錯誤訊息 |
| `color.danger.bg` | `#FDF1F0` | 錯誤訊息底色（danger 於其上 5.92:1） |
| `color.success` | `#146C43` | 成功訊息 |
| `color.warning` | `#8F4B00` | 警告、待審核徽章（推導值，見 §12） |
| `color.brand.ink` | `#040000` | 品牌標誌原始墨色（實際使用見 §3.11） |

#### 徽章（Badge）

徽章不使用裝飾色，一律**白底配藍字**：底 `color.surface.muted`、字 `color.surface.strong`（7.97:1）。

#### 對比度限制（必須遵守）

| 組合 | 對比度 | 判定 |
| --- | --- | --- |
| `color.text.primary` on `color.surface.muted` | 4.61:1 | 通過（正文預設） |
| `color.text.primary` on `color.page.bg.subtle` | 4.29:1 | **不通過**，淺底上的正文改用 `color.text.on-subtle` |
| `color.text.tertiary` on `color.surface.muted` | 1.66:1 | **不通過，禁用於白底文字** |
| `color.text.tertiary` on `color.text.secondary` | 6.67:1 | 通過（頁尾） |
| `color.surface.muted` on `color.surface.strong` | 7.97:1 | 通過（主要按鈕） |
| `color.surface.strong` on `color.surface.muted` | 7.97:1 | 通過（徽章） |
| `color.danger` on `color.danger.bg` | 5.92:1 | 通過（錯誤訊息） |

### 2.2 字體與字級（Typography）

- 主要字體：`font.family.primary=Kumbh Sans`，堆疊 `Kumbh Sans, Noto Sans TC, sans-serif`
- 正文：`font.size.base=18px`／`font.line-height.base=30.006px`／`font.weight.base=400`；粗體 `font.weight.bold=700`

| 角色 | Token | 值 |
| --- | --- | --- |
| Heading 1 | `font.size.display.lg` | 56px / 1.25 |
| Heading 2 | `font.size.display.md` | 40px / 1.25 |
| Heading 3 | `font.size.display.sm` | 32px / 1.25 |
| Heading 4 | `font.size.4xl` | 24px / 1.25 |
| Heading 5 | `font.size.3xl` | 20px / 1.25 |
| Heading 6 | `font.size.2xl` | 18px / 1.25 |
| Paragraph Large | `font.size.3xl` | 20px / 1.7 |
| Paragraph Default | `font.size.base` | 18px / 30.006px |
| Paragraph Small | `font.size.md` | 15px / 1.7 |
| 導覽、按鈕、卡片說明 | `font.size.lg` | 16px |
| 提示、錯誤、麵包屑 | `font.size.sm` | 14px |
| 標籤、日期、學制 | `font.size.xs` | 13px |

- Display 三級是既有尺度的等比延伸，**不得再新增中間值**。
- 輔助文字不得小於 13px；不得為了塞入文字把字級縮到尺度以下。
- 不得以字級模擬標題階層；每頁單一 `h1`，階層不跳級。

### 2.3 間距（Spacing）

- 元件內部：`space.1=6px`、`space.2=8px`、`space.3=10px`、`space.4=12px`、`space.5=14px`、`space.6=15px`、`space.7=16px`、`space.8=17px`
- 版面級：`space.9=24px`、`space.10=32px`、`space.11=48px`、`space.12=64px`、`space.13=96px`
- **不得插入其他中間值。**

### 2.4 圓角、陰影、動態（Radius／Shadow／Motion）

| 類別 | Token | 值 | 用途 |
| --- | --- | --- | --- |
| 圓角 | `radius.xs` | 12px | 卡片、選單、面板、圖片、引言 |
| 圓角 | `radius.md` | 14px | 按鈕、輸入框、下拉選單、Alert |
| 圓角 | `radius.sm` | 20px | 大型區塊 |
| 圓角 | `radius.pill-full` | 100px | chip、badge、switch（全圓） |
| 圓角 | `radius.lg` | 1000px | 圓形裝飾 |
| 陰影 | `shadow.1` | `rgba(30,61,96,.03) 0 5px 15px` | hover 抬升 |
| 陰影 | `shadow.2` | 雙層細陰影 | 卡片與面板預設 |
| 動態 | `motion.duration.instant` | 300ms | 互動回饋 |
| 動態 | `motion.duration.fast` | 350ms | 轉場 |
| 動態 | `motion.duration.normal` | 800ms | 載入動畫 |
| 動態 | `motion.easing` | `cubic-bezier(.2,.6,.3,1)` | 統一緩動；只動 `transform` 與 `opacity` |

`prefers-reduced-motion: reduce` 時，所有動畫與轉場縮至 0.01ms（`tokens.css` 已把三個 duration 覆寫為 0.01ms）。

### 2.5 版面

- 容器最大寬度 1180px，左右內距 `space.9`（手機至少 16px）；長文最大寬 760px（約 65 字元）。
- 卡片網格 `repeat(auto-fill, minmax(min(100%, 320px), 1fr))`，間距 `space.10`。1～2 張卡片時不可被拉寬到難以閱讀。
- 斷點只有兩個：**860px**（導覽收合、雙欄轉單欄）、**640px**（Hero 縮小、選單滿寬、表格變卡片）。
- 兄弟元素之間一律用 flex／grid 的 `gap` 排版，不得逐一設定 margin。
- 必須支援 320px 寬與 200% 縮放；元件不得依賴固定高度。
- Sticky 元件不得遮住鍵盤焦點、錯誤訊息與錨點目標。

### 2.6 層次與邊線（2026-09-15 定案）

- 層次一律用色塊／底色深淺表現，**不把顏色用在邊線上**，不可「色塊＋邊線」並用。
- 次要按鈕＝柔色底不外框；輸入框、下拉＝淺底填色不外框（focus 以 outline 表示）；Tabs 當前態＝色塊；卡片＝白底＋陰影；引言＝淺底色塊；分隔用淺底或陰影，不畫線。
- 例外：色版本身以粗邊為識別（例如漫畫貼紙風的 `bd` token），那是色版特徵。

### 2.7 行動裝置（2026-09-15 定案）

- 元件在手機上要依閱讀動線**重新排列組合**，不是等比縮小、也不是丟橫向捲軸。
- Header：≤860px 導覽收成漢堡選單（Logo 左、漢堡右，展開為整寬清單，每項 ≥48px）。行動版 Header 只保留 Logo 與漢堡選單兩樣，Logo 預設靠左；其餘導覽、帳號、CTA 全部收進選單。完整規格見 §3.13「RWD 收合選單」。
- Footer：≤640px 多欄收成單欄置中，連結一列一個。
- 表格：≤640px 每筆資料變成直式小表——每個欄位一列，左邊欄名格（品牌深色底白字、固定寬）、右邊內容，一筆一卡；欄名必須清楚呈現。
- Hero：裝飾形狀（`.hero-art`）≤860px 隱藏，任何寬度都不得壓住文字、按鈕或焦點；若做成雙欄，≤860px 改單欄、文字欄 `min-width: 0`，高度由內容決定。
- 按鈕群組空間不足時換成垂直排列，不可互相擠壓；行動版主要按鈕可以滿寬。

### 2.8 畫面生動化與配色比例

避免整頁只有藍與灰。本節只規範比例與行為，色值一律引用 §2.1。

1. **打破單色調**：`color.decor.sun` 或 `color.decor.warm` 必須在畫面上構成可見的焦點對比，但只能以裝飾形狀、插圖、背景幾何出現（§2.1 裝飾色限制）。需要強調的元件改用徽章規則（白底藍字）與 Semantic 色。
2. **60-30-10**：60% 基礎結構（`color.surface.muted`、`color.page.bg.subtle` 大面積背景）；30% 品牌（`color.surface.strong` 用於主要導覽、主按鈕、重要標題）；10% 對比（裝飾色或 `color.danger`，與主色藍形成互補）。
3. **10% 不足時從背景層補**：放大既有裝飾形狀或增加數量；不得把裝飾色放回徽章、標籤等元件，也不得用 §6.1 列出的手法（裝飾線條、光暈、底紋等）補面積。
4. **微互動**：hover／active 切換對應 token（如 `color.action.bg.hover`），做出明顯的明暗對比；資訊與數據展示可用 `color.success`／`color.danger` 做狀態對比。
5. **禁忌**：整片藍底或全灰底；裝飾色鋪成整片底色超過 10%（放大背景形狀補足 10% 不在此限）。

---

## 3. 元件規則

每個元件都要定義錨點、變體、七種狀態、鍵盤／指標／觸控行為，以及長內容、溢位與空狀態處理。

### 3.1 Button

**錨點：** `.btn > .btn__label`　**變體：** `.btn`（主要）、`.btn--secondary`、`.btn--ghost`、`.btn--text`、`.btn--danger`、`.btn--sm`、`.btn--block`

| 狀態 | 表現 |
| --- | --- |
| default | `color.action.bg` 底＋`color.action.fg`（白）字，圓角 `radius.md`；次要鈕為主色淡底、不外框 |
| hover | 底色轉 `color.action.bg.hover`，加上 `shadow.1` |
| focus-visible | 3px `color.surface.strong` 外框，offset 2px |
| active | 底色轉 `color.action.bg.active`，`translateY(1px)` |
| disabled | `color.disabled.bg` 底＋`color.disabled.fg` 字，`pointer-events: none`；要說明為何不能按 |
| loading | `data-loading="true"`＋`aria-busy="true"`，label 以 `visibility: hidden` 保留寬度，疊上旋轉指示；必須阻止重複送出 |
| error | 按鈕本身不表達錯誤，錯誤顯示在關聯的表單訊息區 |

- 觸控目標 ≥ 44×44px；loading 時版面不得位移。
- 文字必須說明實際動作（「訂閱」「開始命題」「儲存草稿」），不得用「送出」「確定」「是／否」。
- 一個區塊原則上只有一個主要按鈕；一個 Hero 最多 1 主要＋1 次要。
- 預設 `type="button"`，表單送出要明確指定 `type="submit"`。
- 只有圖示時必須有 `aria-label`；不得用 `<div>`／`<span>` 模擬按鈕。

### 3.2 Input／Field

**錨點：** `.field > .label + .input + .hint + .error-text`

| 狀態 | 表現 |
| --- | --- |
| default | 淺底 `color.page.bg.subtle` 填色、**不外框**，圓角 `radius.md`，最小高度 48px |
| hover | 底色轉 `color.disabled.bg` |
| focus-visible | 3px 焦點外框，offset 2px，底色轉白 |
| disabled | `color.disabled.bg` 底＋`color.disabled.fg` 字，`cursor: not-allowed` |
| error | `aria-invalid="true"`，底色 `color.danger.bg`，並顯示 `.error-text` |
| loading | 由送出按鈕承擔 loading，輸入框維持可讀 |

- Label 永遠可見，不得以 placeholder 取代。
- 錯誤必須同時以顏色、文字（最好加圖示）與 `aria-invalid` 表達，不得只用顏色。
- 錯誤訊息以 `aria-describedby` 綁定欄位，放在 `role="alert"` 容器；內容說明發生什麼事、如何修正、資料是否保留。
- 發生錯誤後保留使用者輸入；使用者開始修正後錯誤即時清除。
- 必填規則在送出前就能被理解。

### 3.3 Chip／篩選

**錨點：** `.chip-group[role="tablist"] > .chip[role="tab"]`

| 狀態 | 表現 |
| --- | --- |
| default | `color.page.bg.subtle` 底，全圓，最小高度 40px |
| hover | 底色轉 `color.border` |
| focus-visible | 3px 焦點外框 |
| active | 底色轉 `color.border.strong` |
| selected | `aria-selected="true"`，`color.action.bg` 底＋白字 |
| disabled | `color.disabled.bg` 底＋`color.disabled.fg` 字 |
| loading／error | 由結果區處理，chip 本身不變 |

- 左右方向鍵在群組內循環移動焦點。
- 篩選結果變化以 `aria-live="polite"` 播報數量；無結果時顯示空狀態，不得只留空白。

### 3.4 Dropdown／Select／Combobox

**錨點：** `.dropdown > .dropdown__trigger + .dropdown__menu > .dropdown__item`（輔助：`.dropdown__label`、`.dropdown__divider`、`.dropdown__count`、`.dropdown__message`）

| 狀態 | 表現 |
| --- | --- |
| default | 觸發鈕透明底，箭頭朝下 |
| hover | `color.page.bg.subtle` 底＋`color.action.bg` 字 |
| focus-visible | 3px 焦點外框 |
| active | `color.border` 底 |
| expanded | `aria-expanded="true"`，箭頭旋轉 180 度並維持 hover 底色 |
| disabled | `color.disabled.fg` 字，`pointer-events: none` |
| loading | 選單 `data-loading="true"`＋`aria-busy="true"`，骨架列取代項目 |
| error | 選單內顯示 `.dropdown__message--error`，不得留白 |

| 輸入方式 | 行為 |
| --- | --- |
| 鍵盤 | Enter／Space／↓ 開啟並聚焦第一項；↑ 開啟並聚焦最後一項；↑↓ 循環；Home／End 跳首末；Esc 關閉並把焦點送回觸發鈕；Tab 移出即關閉 |
| 指標 | 點觸發鈕開合；選到項目後自動關閉；點外部關閉；停用項目不接受點擊也不關閉選單 |
| 觸控 | 項目高度 ≥ 44px；640px 以下選單滿寬 |

- 選單最高 320px，超出時在選單內捲動；靠近右緣時改為向左對齊（`.dropdown--end`）。
- 停用項目以 `aria-disabled="true"` 標記並排除於鍵盤循環外，不得以 `display: none` 隱藏。
- 選哪一種：選項少、不需搜尋用 Select；選項多、可搜尋或由伺服器載入用 Combobox；多選用 MultiSelect，不用大量 Checkbox 假裝下拉。
- 相依選項必須顯示「為什麼還不能選」。教育資料的選擇順序固定為：學制 → 年級 → 科目 → 學期 → 冊次 → 章節／課次（不需要的層級可以省略，但同一欄位名稱不得改變）。

### 3.5 Accordion／摺疊面板

**錨點：** `.accordion > .accordion__item > (h3 > .accordion__trigger) + .accordion__panel`　**變體：** `.accordion`、`.accordion--plain`（內文用）、`data-single="true"`（一次只展開一項）

| 狀態 | 表現 |
| --- | --- |
| default | 透明底，標題最小高度 56px，右側加號 |
| hover | `color.page.bg.subtle` 底＋`color.action.bg` 字 |
| focus-visible | 3px 焦點外框，offset -3px |
| active | `color.border` 底 |
| expanded | `aria-expanded="true"`，加號轉為減號，標題轉 `color.action.bg` |
| disabled | `color.disabled.fg` 字，`pointer-events: none` |
| loading | 面板 `data-loading="true"`＋`aria-busy="true"`，骨架列取代內容 |
| error | 面板內顯示 `.error-text`，不得只留空面板 |

- 鍵盤：Enter／Space 開合；↑↓ 在標題間移動；Home／End 跳首末；Tab 依序進入已展開面板。指標：點標題任一處開合。觸控：整列可點、高度 ≥ 56px。
- 標題必須是 `<button>`，並包在符合頁面階層的標題元素內（例如 `<h3>`）。
- 面板以 `hidden` 收合並移出無障礙樹，收合內容不得仍可被 Tab 聚焦。
- 展開狀態同時以圖示形狀與 `aria-expanded` 表達；面板內容不設高度上限。

### 3.6 Card

**錨點：** `.card > .card__media + .card__body > (.card__meta + .card__title + .card__excerpt)`　**變體：** `.card`（直式）、`.card--row`（橫式小卡）、`.card--skeleton`（載入骨架）

| 狀態 | 表現 |
| --- | --- |
| default | 白底＋`shadow.2`，圓角 `radius.xs`，**不加邊框** |
| hover | `translateY(-4px)`＋`shadow.1` 疊加 |
| focus-visible | 卡片外框由 `:has(.card__link:focus-visible)` 呈現 |
| active | 沿用連結的 active 表現 |
| disabled | 不提供停用狀態；無資料時改用空狀態 |
| loading | `.card--skeleton`＋`aria-hidden="true"`，骨架高度接近實際內容 |
| error | 由列表區塊統一以 `.alert` 呈現 |

- 內容順序固定：類型／狀態 → 標題 → 摘要 → metadata → 操作。
- 整張卡片可點時，只有標題連結進入 Tab 順序（`.card__link::after` 覆蓋全卡）；卡片內若有多個操作，卡片本身就不可以是單一連結。一張卡直接顯示的操作最多 2 個，其餘收進選單。
- 標題最多 3 行、摘要最多 2 行，超出以省略號收尾；同一列表的圖片比例、標題行數與操作位置一致。
- 卡片高度由內容決定；同列要齊高用 grid stretch，操作區可用 `margin-top: auto` 貼底但不得壓住內容。
- 圖片必須有 `alt`；缺圖、載入中、破圖都要有狀態，不顯示破圖 icon。

### 3.7 Pagination

- 每項最小 44×44px，目前頁 `aria-current="page"` 並反白；每項有描述性 `aria-label`（例如「第 2 頁」）。
- 不可用的上一頁／下一頁以 `aria-disabled="true"` 標記並移除 hover，不得直接隱藏。

### 3.8 Empty state、Alert、Toast、Loading

- **空狀態**：說明為什麼沒有內容、接下來能做什麼，並提供一個主要操作；不得只寫「查無資料」。篩選無結果時保留條件並提供放寬建議。
- **Alert**：頁面內持續存在的警告或錯誤，含標題、說明與需要時的操作；錯誤用 `role="alert"`，同時以圖示、顏色與文字表達。
- **Toast**：只用於短暫、非阻斷的成功訊息，不承載需要使用者處理的錯誤。
- **Loading**：< 300ms 不顯示轉圈避免閃爍；300ms～2s 用局部轉圈或骨架；> 2s 顯示進度或階段說明。Loading 不得造成版面位移。

### 3.9 Rich Text／內文排版

**適用：** 產品介紹頁的 `.prose` 區塊，以及任何由後端或企劃輸出的長內容。

| 元素 | 規則 |
| --- | --- |
| 標題 | 依 §2.2 的 H1–H6 尺度；階層不得跳級，`text-wrap: balance` |
| 段落 | 預設 `font.size.base`；導言用 Paragraph Large，圖說與輔助說明用 Paragraph Small |
| 連結 | `color.surface.strong`＋底線，`text-underline-offset: 3px`；文字必須說明目的地 |
| 粗體 | `font.weight.bold=700`，只用於強調關鍵資訊，不得整段使用 |
| 斜體 | 中文避免使用，僅用於外文詞彙 |
| 引言 | `color.page.bg.subtle` 淺底色塊、圓角 `radius.xs`；**不加左側邊條**（§2.6、§6.1） |
| 清單 | 縮排 `space.9`，項目間距 `space.2`；編號清單只在內容確實有順序時使用 |
| 圖片與圖說 | 圓角 `radius.xs`，圖說 `font.size.sm`，圖片必須有 `alt` |
| 程式碼區塊 | `color.page.bg.subtle` 底，`overflow-x: auto`，頁面本體不得出現水平捲軸 |

- 區塊之間的垂直間距由 `.prose > * + *` 統一控制，不得逐一設定 margin。
- 企劃可用的格式只有：H2、H3、段落、粗體、斜體、連結、項目符號、編號、引用、圖片、表格。禁止任意字級、字體、顏色、文字陰影、浮動、絕對定位、內嵌 iframe、任意 HTML 與 inline style；從 Word／Google Docs 貼上時只保留語意結構。

### 3.10 Icons

- 一律用 **Google Material Symbols Rounded**，同一頁同一套、線條粗細一致；**不得用 emoji 或 Unicode 符號（✓ ! ★ → ◉）代替圖示**。
- 尺寸 24×24px，端點與轉角圓角。
- 顏色用 `currentColor` 或 `color.surface.strong`；深色底改用 `.icon--inverse`。
- 純裝飾圖示加 `aria-hidden="true"`；圖示是按鈕唯一內容時，按鈕必須有 `aria-label`。

### 3.11 品牌標誌

**Logo（必套項目，不是選配）**

- 使用正式資產，以 inline SVG 內嵌，文字墨色綁定 `--logo-ink`；不得用文字重新拼排取代。
- **淺色底用主色藍 `#064EA4`**（白底 7.97:1）；深色底覆寫為 `color.surface.muted`（白）。
- 尺寸：頁首 28px（640px 以下 22px）、頁尾 31px；寬度 auto 等比縮放。
- 標誌已含品牌字樣，旁邊不得再重複品牌文字。`favicon` 一併換成翰林 H 標（`favicon.svg`）。
- 禁止：變形拉伸、旋轉、改配色、加外框／陰影／底色方塊、裁切、放在對比不足的背景上。
- 淨空區：四周至少留一個「翰」字高度的空白。
- 首頁連結的 Logo，accessible name 為「翰林首頁」；純裝飾時替代文字留空。

### 3.12 Feature Menu／功能選單

功能選單是一組結構相同、可點擊的大型功能入口卡，分兩種樣式，由採用設定 `groups.fm` 決定（`fm=0` 有色塊圖示磚版／`fm=1` 純 icon 版）。數值取自平台 `brand.html#feature` 兩種示範的實際渲染量測。

**色塊（`.fm-tile`）——單色，不得輪替**

- 底色一律 `#FFFFFF`，四張磁磚完全一致；**不隨主題色變化，也不隨磁磚順序輪替。**
- 陰影 `--shadow-sm`（`0 1px 2px rgba(20,45,70,.05)`），圓角 14px，尺寸 58×58px（`.sm` 變體 44×44px、圓角 11px）。
- 套用到匯入頁面時，若圖示沒有既有的色塊容器，自製色塊同樣是白底＋同一組陰影與圓角，不得改用柔色底。

**輪替色只作用在圖示與標題文字**

- 圖示色與 `h4` 標題色同色，依磁磚順序輪替，色票由採用主題推導，並確保對白底達 4.5:1。
- 卡片底色為原設計保留，套用時不覆寫。
- 純 icon 版（`fm=1`）不出現色塊：移除底色、陰影與外框，圖示放大至 34px，顏色沿用同一組輪替色。

**禁止**

- 把輪替色染到色塊底色（「單色色塊」會變成四色）。
- 為了讓測試通過，把「比較文字色」的斷言改成「比較底色」；色塊底色本來就該永遠相等。

### 3.13 Tabs、導覽與 Header

- Tabs 只用於同頁內容切換；跨頁使用導覽或連結。
- 當前項目用色塊表現（§2.6），並同時用位置、形狀或圖示區分，不能只靠顏色。
- 鍵盤行為遵循 WAI-ARIA APG；行動版超出寬度可以橫向捲動，但要露出下一項的一部分或提供捲動提示。

**Header**

- Global Header（跨產品入口）、Product Header（單一產品導覽與帳號）、Context Header（教材／課次／命題流程上下文）、Mobile Header（只有 Logo＋漢堡選單）分成不同元件，不用一個元件塞進所有情境。
- 桌機插槽順序固定：Logo、主要導覽、產品切換、帳號入口。導覽放不下時改用「更多」選單，不得擠壓 Logo 或帳號入口。行動裝置（≤860px）只剩 Logo＋漢堡選單，見下方「RWD 收合選單」。
- Header 高度不得寫死，要能承受兩行標題、長產品名稱與字體放大；Sticky Header 不得遮住焦點、錯誤訊息或錨點目標。

**RWD 收合選單（漢堡選單）**

數值取自範例 `index.html` 在 390px 寬的實際渲染量測。

| 項目 | 規則 |
|---|---|
| 斷點 | ≤860px 主要導覽收進漢堡選單；>860px 漢堡隱藏、導覽恢復橫排。展開中把視窗拉寬，導覽自動復原，不殘留收合狀態 |
| 結構 | `button.nav-toggle[aria-expanded][aria-controls="<nav id>"][data-nav-toggle]` 放在 Logo 之後、`<nav>` 之前；收合用 `hidden` 屬性，讓內容移出無障礙樹 |
| 位置 | Logo 預設靠左、漢堡靠右（`margin-inline-start: auto`），Header 內沒有第三樣東西；手機 Header 最小高度 64px |
| 按鈕 | 44×44px，無外框、透明底，圖示色 `color.text.secondary`；hover 淺底色塊 `color.page.bg.subtle`；focus 用 3px `focus-ring` outline |
| 圖示 | 三條線，每條 22×2px、間距 7px、圓角 2px；展開時轉成 ✕（上下兩條各旋轉 ±45°、中間那條隱藏），轉場用 `motion.duration.instant` |
| 面板 | 由 Header 下緣往下展開、左右滿寬；白底（`color.surface.muted`）＋`shadow-1`，不畫邊線；內距上 12px、左右與下 24px |
| 選單項目 | 一列一項、滿寬，高度 ≥48px，字級 `font-size.2xl`（18px），左右內距 `space.7`；目前頁面用主色色塊＋`aria-current="page"` |
| 開啟 | 點漢堡開合；開啟後焦點移到第一個項目；`aria-label` 在「開啟選單／關閉選單」之間切換 |
| 關閉 | 再點一次漢堡、按 Esc（焦點回到漢堡按鈕）、點選單外任何地方、點選單內的連結，都會關閉 |

- **行動版 Header 只保留 Logo 與漢堡選單兩樣**，Logo 預設靠左、漢堡靠右。主要導覽、產品切換、帳號入口、CTA 按鈕、頁面名稱都不留在 Header，一律收進選單；不得在手機 Header 橫排硬擠或出現橫向捲軸。
- 選單是往下推開的面板，不是全螢幕遮罩：不加半透明背景，也不鎖住頁面捲動。
- 禁止：只用 CSS `:hover` 展開（觸控裝置打不開）、收合後的項目仍能被 Tab 聚焦、漢堡按鈕小於 44px、用文字「選單」取代圖示卻沒有 `aria-label`。
- 沿用方式：直接複製範例的 `.nav-toggle` 按鈕與 `nav.site-nav-wrap`，開合行為由 `app.js` 負責，不要另外重寫。

### 3.14 Dialog 與 Drawer

- 開啟後焦點移入，關閉後焦點回到觸發元件；非破壞性的 Dialog 支援 Esc。
- 不得在 Modal 裡再開第二層 Modal；長流程改用獨立頁面或 Stepper。不需要打斷操作的任務不要用彈窗。
- 刪除等高風險操作要說明具體影響；按鈕寫「取消／刪除這份試卷」，不寫「否／是」。Footer 最多 1 個主要操作＋1 個取消。

### 3.15 Table

- 放在可橫向捲動的容器內（`.table-wrap`）；第一欄或識別欄保持可見。
- 欄位分優先級（essential／important／optional）；≤860px 隱藏 optional 欄，但資料必須能從明細查看；≤640px 變成一筆一卡（§2.7）。
- 不得用極小字體塞入所有欄位；長字串、URL、檔名用 `overflow-wrap: anywhere`。

---

## 4. 無障礙需求與驗收條件

所有條件都要能在實作中測試。最低標準 WCAG 2.2 AA；Modal、Tabs、Menu、Combobox 遵循 WAI-ARIA APG。

| 項目 | 通過條件 | 失敗條件 |
| --- | --- | --- |
| 鍵盤操作 | 純鍵盤可完成全部操作；焦點順序與視覺順序一致 | 任何互動需要滑鼠才能觸發 |
| 焦點指示 | 所有可聚焦元素有 3px `focus-visible` 外框，offset 2px，且不被遮住 | 出現 `outline: none` 且無替代指示；只靠陰影或微弱變色 |
| 對比度 | 正文 ≥ 4.5:1；大字、控制項與圖示 ≥ 3:1 | 白底使用 `color.text.tertiary` 作為正文 |
| 觸控目標 | 按鈕、分頁、chip ≥ 44×44px；Accordion 標題 ≥ 56px | 行動版出現小於 44px 的點擊目標 |
| 狀態播報 | 篩選數量、送出結果、搜尋結果以 live region 播報 | 狀態只以視覺變化呈現 |
| 資訊表達 | 錯誤、選取、展開同時有顏色以外的線索（文字、形狀、圖示） | 只用顏色傳達 |
| 收合內容 | 以 `hidden` 移出無障礙樹 | 收合內容仍可被 Tab 聚焦 |
| 減少動態 | `prefers-reduced-motion` 下動畫縮至 0.01ms | 骨架或裝飾動畫在該設定下持續播放 |
| 語意結構 | 每頁單一 h1，標題階層不跳級；地標有 `aria-label` | 以字級模擬標題階層 |
| 圖片替代文字 | 內容圖片有 `alt`，裝飾圖形 `aria-hidden="true"` 或空 alt | 裝飾性圖形被朗讀 |
| 縮放 | 320px 寬與 200% 縮放下仍可使用 | 出現水平捲軸或內容重疊 |

**樣式指南頁的特殊規則：** 排版樣本必須用 `.type-sample` 純樣式標記，不得用真實的 `<h1>`–`<h6>`，否則會在該頁製造重複 h1 與跳級的標題階層。

---

## 5. 文案與語氣

語氣：精確、有把握、以實作為導向。

| 情境 | 應該這樣寫 | 不應該這樣寫 |
| --- | --- | --- |
| 按鈕 | 訂閱／搜尋產品／瀏覽全部分類 | 送出／確定／點這裡 |
| 連結 | 查看課前多元備課的全部產品 | 更多／詳情 |
| 表單錯誤 | 信箱格式不正確，請確認是否包含 @ 與網域。 | 輸入有誤 |
| 空狀態 | 此分類目前沒有產品。試試其他教學階段，或直接搜尋產品名稱。 | 查無資料 |
| 載入失敗 | 產品分類載入失敗，請重新整理頁面。 | 發生錯誤 |
| 成功訊息 | 訂閱成功，確認信已寄至 name@example.com。 | 完成！ |

- 動作標籤與結果必須一致（按「訂閱」後回報「訂閱成功」）。
- 錯誤訊息說明問題與修正方式，不得道歉或含糊帶過。
- 用使用者認得的說法命名，不用系統內部用語。
- 文案避免行銷空話與金句式句型（見 §6.1）。

---

## 6. 反模式（禁止事項）

- 在元件樣式中直接寫入色碼、間距、圓角或 z-index，而非引用 token。
- 為單一頁面新增一次性的間距或字級例外。
- 移除或以低對比顏色覆蓋 `focus-visible` 外框。
- 使用「點這裡」「更多」等無描述性連結文字。
- 交付未定義完整七種狀態的互動元件。
- 只用顏色傳達錯誤、選取或展開狀態。
- 以 `display: none` 隱藏停用項目，使其消失而非標示為停用。
- 以字級模擬標題階層，或同一頁使用多個 h1。
- 在白底使用 `color.text.tertiary` 作為正文色。
- 將裝飾色用於文字、狀態，或帶進元件層（徽章、標籤、按鈕等）。
- 用 `<div>`／`<span>` 當作按鈕、連結或核取方塊；用 placeholder 代替 Label。
- 巢狀 Modal；錯誤後清除使用者已輸入的資料。
- 在產品內重新做一個已有的共用元件；讓產品 Theme 改變元件語意或鍵盤行為。

### 6.1 去除 AI 感（2026-09-24 定案）

以下手法是 AI 生成頁面最常見的特徵，一律不做。參考 impeccable（github.com/pbakaus/impeccable）的偵測規則，依翰林現況調整。

**版面**

- 標題上方的小標籤（eyebrow／kicker）：標題上面一行大寫英文小字、短槓＋小字這類。標題本身就要撐得起層級。
- 中文標題旁加英文翻譯小字（例如「色彩系統 COLOR SYSTEM」、頁首「基本規範 Basic Guideline」）。英文只是把中文再講一次，沒有新資訊。
- 01／02／03 區塊編號。只有順序本身有意義（例如操作步驟）才可以用。
- 整頁骨架是一排同尺寸「圖示＋標題＋一段文字」的特色卡；卡片裡再包卡片。例外：§3.12 功能選單與產品／教材卡片網格（內容列表）不算。
- 「大數字＋小標籤＋幾個輔助數據」的 Hero 數據模板，除非數字是真實資料。
- 不需要打斷使用者的操作卻用彈窗。

**表面效果**

- 漸層文字。要強調用字重或字級。
- 紫藍漸層、深底配青色霓虹。
- 彩色光暈陰影（零位移的彩色 `box-shadow`／`text-shadow`）。陰影只用 shadow token。
- 當裝飾用的毛玻璃（`backdrop-filter`）、柔光、放射狀光暈背景。
- 格線、網格、斜紋等底紋背景。
- 裝飾線條：側邊直線＋編號、四角括號、直排 SCROLL、連接線、掃描線。
- 卡片、提示框、清單、引言左右超過 1px 的彩色邊條（§2.6）。
- 無模糊的硬位移陰影（例如 `box-shadow: 4px 4px 0`）。
- 閃爍游標、脈動狀態小圓點、自動跑馬燈。
- 用假的迷你折線圖、進度環或空白圓角方塊充當內容。
- 用 emoji 或 Unicode 符號（✓ ! ★ → ✨）當圖示（§3.10）。
- 不是程式碼或數據，卻用等寬字體營造「技術感」。

**文案**

- 行銷空話：賦能、無縫、一站式、全方位、極致、革命性、打造〇〇新體驗。
- 金句式短句連發、刻意營造戲劇感（「不只是 X，更是 Y」）。
- 破折號（——）堆疊：一段最多一個。

**檢查方式**：用平台的 `aicheck.html`（AI 感檢查）在本機直接打開，把 HTML 連同它的 CSS 一起拖進去，會實際渲染後逐條比對本節並標出位置；桌機與手機寬度都要各看一次。規則程式在 `aicheck.js`，功能選單與加了 `data-ai-ok` 屬性的元素不檢查（確認是正當用法時才加）。「需確認」的項目要人工判斷；彈窗、假內容、整體文案語氣只能人工看。另可用 impeccable 偵測器（`impeccable detect <網址> --json`）交叉比對，它的 `icon-tile-stack` 抓到功能選單、`cream-palette` 抓到品牌淺底時屬於誤報。

---

## 7. 防破版與企劃內容

合法輸入下破版一律視為元件缺陷，不得要求企劃用空白、手動換行或縮短必要資訊來修補。

### 7.1 企劃可以改什麼

- 可編輯：標題、副標、內文、標籤、按鈕文字、連結、圖片、影片、替代文字、排列順序、經核准的變體。
- 不可編輯：DOM 結構、ARIA、標題層級、焦點順序、字級、行高、固定座標、任意間距、圓角、陰影、色碼。品牌活動需要特殊視覺時，新增經審核的 Theme 或變體，不開放自由 CSS。
- 每個可編輯欄位要定義：最佳長度、硬上限、可否換行、超長行為、空值行為、行動版顯示方式、是否影響 SEO 或無障礙名稱。CMS 在輸入時顯示建議字數與即時預覽；超過建議長度先警告，超過硬上限禁止發布。

### 7.2 建議字數與顯示策略

以下是初始基準，要依正式中文字型與元件寬度做視覺回歸驗證。硬上限是 CMS 的發布驗證值，不是 CSS 截斷值。

| 欄位 | 建議長度 | 硬上限 | 顯示策略 |
|---|---:|---:|---|
| 主導覽 | 2～6 字 | 8 字 | 不換行；超限禁止發布 |
| 按鈕 | 2～8 字 | 12 字 | 優先擴寬；行動版可滿版 |
| 分頁 Tab | 2～6 字 | 10 字 | 不換行；過多時橫向捲動 |
| 徽章／標籤 | 2～6 字 | 10 字 | 單行；不得省略關鍵狀態 |
| 卡片標題 | 6～20 字 | 36 字 | 最多 3 行；列表高度一致 |
| 卡片摘要 | 20～60 字 | 120 字 | 最多 2 行；提供完整內容入口 |
| 頁面 H1 | 6～24 字 | 40 字 | 自動換行，不用省略號 |
| 區塊標題 | 4～18 字 | 32 字 | 自動換行，區塊隨內容增高 |
| Hero 標題 | 8～24 字 | 40 字 | 桌機最多 2 行、手機最多 3 行 |
| Hero 說明 | 20～60 字 | 120 字 | 桌機最多 3 行；手機完整展開 |
| 表頭 | 2～8 字 | 16 字 | 可換 2 行或設定欄寬 |
| Toast 標題 | 4～16 字 | 24 字 | 最多 2 行 |
| 錯誤訊息 | 12～60 字 | 160 字 | 完整顯示，不截斷 |

### 7.3 溢位處理

- **必須完整顯示**（自動換行、容器增高，不得省略號）：頁面主標題；表單 Label、說明與錯誤；法律、授權、隱私與版權訊息；AI 產生結果；命題內容與作答選項；付款、刪除、發布等高風險說明。
- **可以限制行數**（line-clamp＋可存取的完整內容入口，不得只靠 `title` 屬性）：資源卡摘要、推薦內容摘要、非關鍵 metadata。
- **維持單行**（CMS 限字、容器保留合理寬度）：導覽項目、短徽章、表格中的短代碼。
- 所有內容容器預設 `min-width: 0; overflow-wrap: anywhere;`；Email、URL、教材代碼與檔名不得撐出容器。
- 超出時依序採用：自動換行 → 容器增高 → 按鈕群組／網格換行或單欄 → 次要內容 line-clamp → 顯示「查看完整內容」。
- 永遠不得：把字縮到尺度以下、用負 margin 遮掩溢位、用固定高度加 `overflow: hidden` 藏住重要內容、讓元素互相覆蓋、隱藏主要操作、裁切錯誤／警告／法律內容。

### 7.4 圖片與媒體

| 用途 | 比例 | 最低尺寸 | 裁切 |
|---|---|---:|---|
| Hero | 16:9 或 3:2 | 1600×900 | `cover`，提供焦點位置 |
| 教材卡片 | 4:3 | 800×600 | `cover` |
| 產品卡片 | 16:9 | 960×540 | `cover` |
| 頭像 | 1:1 | 256×256 | `cover`，中心裁切 |
| Logo | 保持原比例 | SVG 優先 | `contain`，不可裁切 |
| 教材封面 | 3:4 | 600×800 | `contain` 或完整顯示 |

- 元件用 `aspect-ratio` 保留空間，避免載入時版面跳動；圖片載入失敗時顯示可理解的替代狀態。
- CMS 要驗證格式、容量、比例與最低尺寸，提供裁切與焦點預覽，要求替代文字（純裝飾圖可勾選「裝飾圖片」）。

### 7.5 空值與缺漏

- 選填欄位為空時移除整個欄位容器，不留多餘間距或分隔；必填欄位為空時禁止發布。
- 缺圖時用預設圖或純文字版，不顯示破圖；metadata 缺項時分隔符號不得殘留；列表為空時顯示空狀態。

### 7.6 防破版測試資料

- **文字**：空字串、1 個中文字、建議最大長度、硬上限、超過硬上限 1 字、連續 100 個無空白英數字、超長 URL、中英數混排、emoji 與全形標點、200% 字體縮放。
- **資料**：0、1、2、3、10、100 個列表項目；缺圖、過大、比例錯誤；所有選填欄位缺失；兩行以上的錯誤訊息；一顆或兩顆按鈕；3、8、20 欄的表格。
- **寬度**：320、375、768、1024、1280、1440、1920px。
- **必須成立**：無頁面水平捲動（表格與程式碼容器除外）；文字不覆蓋圖片、圖示或按鈕；按鈕不超出容器；焦點框完整可見；Sticky Header 不遮住焦點與錨點；錯誤出現後版面仍可操作；圖片載入前後沒有明顯位移；企劃允許的最大內容可以正常發布與閱讀。

---

## 8. 教育產品模式

以下屬於「模式」，由共用元件組合而成，不是 Theme。

- **常見模式**：學制年級科目選擇、學期冊次選擇、課次選擇、教材篩選列、資源格狀／清單、題目卡與題目導覽、成績摘要、AI 提示表單／產生狀態／結果、命題流程、版權與權限提示。
- **AI 流程**：狀態必須涵蓋 Idle → Validating → Queued → Generating → Success，以及 Partial、Error、Cancelled。必須能停止產生、重新產生、編輯、複製、回復上一版。錯誤不得清除提示詞與設定；顯示「AI 內容需人工確認」；有來源就要能檢查；長時間等待顯示合理進度；使用者修改過的版本不可被重新產生直接覆蓋。
- **教材篩選**：顯示目前已套用的條件、提供「清除全部」；相依條件改變時只重設受影響的下游條件；結果更新時回報數量與載入狀態；網址保存可分享的篩選狀態；無結果時保留條件並提供放寬建議。
- **命題流程**：選擇範圍 → 設定題型與題數 → 預覽與調整 → 輸出。Stepper 顯示目前位置、已完成與不可進入狀態；上一步不得清除已選題目；離開步驟前自動存草稿或明確詢問；大量選題提供批次操作與復原；輸出前提供完整摘要與錯誤檢查。

---

## 9. Theme 與色版

- 所有元件只引用語意 token；token 分三層：原始值 → 語意 → 元件局部（例如 `button.primary.background`），元件不可直接引用產品色碼。
- 換色版只允許覆寫 Theme token，不得複製或修改 Button、Card、Tabs 等元件樣式；切換 Theme 後，元件 DOM、互動、ARIA 與響應式行為不得改變。
- 可替換（Theme）：主色與 hover、focus；背景、文字、邊框；success／danger 語意色；Logo 墨色；裝飾黃、暖橘；色版自己的圓角與陰影。
  共用（不隨色版變）：按鈕結構與七種狀態、輸入框與下拉行為、Tabs／Accordion 鍵盤操作、卡片內容契約、斷點與防破版規則。
- `tokens.css` 的值與平台 `engine.js` 的 SG token 一致；`tokens.css` 只載入目前啟用的色版，切換色版只改 `data-theme` 或 Theme token。
- 各風格色版（15 組）的資料在翰林視覺套版平台維護，不隨本基本範例打包。每個色版必須映射到同一組語意 token，補齊品牌／操作、底色、文字、邊框、狀態、裝飾六類，並通過 §2.1 的對比驗證。

---

## 10. 交付檢查清單

交付前必須逐項通過：

- [ ] 所有顏色、間距、字級、圓角、陰影、動態都來自 `tokens.css`。
- [ ] 每個互動元件的七種狀態都能重現。
- [ ] 320、768、1280px 三個寬度下無水平捲軸、無元素重疊；200% 縮放仍可使用。
- [ ] 長標題、長摘要、空清單、載入中、錯誤五種內容情境都有處理（§7.6）。
- [ ] Tab 走訪全頁，焦點始終可見且不進入隱藏元素。
- [ ] 下拉與 Accordion 的鍵盤行為符合 §3.4、§3.5。
- [ ] 篩選、搜尋、送出的狀態變化都有 live region 播報。
- [ ] 每頁單一 h1，標題階層無跳級。
- [ ] 螢幕閱讀器可讀出每張卡片的分類、適用學制與產品名稱。
- [ ] `prefers-reduced-motion` 開啟時沒有持續播放的動畫。
- [ ] 裝飾色視覺面積達 10%；不足時只在背景層補，不回頭改元件層（§2.8）。
- [ ] 沒有 §6.1 列出的任何 AI 感手法（用 `aicheck.html` 檢查，桌機與手機都沒有「違規」）。

---

## 11. 元件庫開發（工程團隊）

給開發共用元件庫的工程師；只產出頁面時可略過。

- **建議套件**：`@hanlin/tokens`（token 與 CSS 變數）、`@hanlin/icons`、`@hanlin/ui`（基礎與組合元件）、`@hanlin/patterns`（教育產品模式）、`@hanlin/themes`（各產品語意主題）。
- **每個元件資料夾**：元件本體、型別、樣式、Storybook、單元測試、無障礙測試、README。
- **P0 基礎元件**：LogoLockup、BrandMark、GlobalHeader、ProductHeader；Button、IconButton、Link；TextInput、Textarea、SearchInput、PasswordInput；FormField、Checkbox、Radio、Switch；Select、MultiSelect、Combobox、FileUpload；SideNavigation、Breadcrumb、Tabs、Pagination、Stepper；Card、ResourceCard、ActionCard、Badge、Tag、Accordion；Alert、Toast、Loading、Skeleton、Progress、EmptyState、ErrorState；Dialog、Drawer、Tooltip、Popover；Table、DataTable；圖片、影片、音訊容器。
- **共通 API**：所有互動元件支援 `id`、`disabled`、`readOnly`、`required`、`loading`、`className`、`aria-label`、`aria-describedby`。`disabled` 與 `loading` 語意不可混用；不提供任意 `color`、`padding`、`borderRadius` 屬性，樣式差異只透過 `variant`、`size` 與 Theme token；受控與非受控模式不可在生命週期中互換。
- **元件文件**：名稱、狀態（beta／stable／deprecated）、負責人、版本、用途、何時用／何時不用、變體、尺寸、狀態、內容規則、鍵盤、無障礙、API、事件、測試；並提供可互動範例、Do／Don't、桌機與行動版、長文字／空值／Loading／Error 範例、變更紀錄。
- **Stable 元件必須通過**：型別檢查、單元測試、互動測試、axe-core 無障礙測試、視覺回歸、鍵盤手動測試、NVDA＋Chrome、VoiceOver＋Safari、320px／200% 縮放／慢速網路／錯誤情境。CI 遇到無障礙違規、token 格式錯誤、Stable 測試失敗、未核准的視覺回歸、未升主版號的破壞性變更時必須擋下合併。
- **新功能流程**：先查既有元件與模式 → 優先組合既有元件 → 單一產品專用的留在產品端 → 至少兩個產品需要且行為穩定才提案成共用元件（提案含使用者問題、狀態、鍵盤、API、設計稿、測試）→ 經設計、工程、無障礙負責人審查 → Beta 實測後才進 Stable；移除 Stable API 必須附遷移指南。
- **第一批優先完成**：Tokens、Button、FormField、TextInput、Select／Combobox、Checkbox／Radio／Switch、Tabs、Card／ResourceCard、Alert／Toast、Loading／Empty／Error、Dialog／Drawer、MaterialFilterBar、LessonSelector、AiGenerationStatus、QuestionWorkflow Stepper。
- **參考**：[WCAG 2.2](https://www.w3.org/TR/WCAG22/)、[WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)、[Design Tokens Format](https://www.designtokens.org/tr/drafts/format/)。

---

## 12. 已知缺口與整併裁定

### 推導值（規範原文未給值，`tokens.css` 的值為推導）

- `color.border` → `#BECAD7`（等於 text.tertiary）
- `color.border.strong` → `#7690A8`（白底 3.32:1，滿足元件邊界 ≥ 3:1）
- `color.disabled.fg` → `#8A9AAB`
- `color.warning` → `#8F4B00`
- `--logo-ink` → 規範有規則但原本沒有 token 名

取得正式值後直接覆蓋 `tokens.css`。

### 2026-09-24 整併時裁定的衝突（一律以實作與較新的定案為準）

| 項目 | 舊檔寫法 | 裁定 |
|---|---|---|
| 按鈕、輸入框圓角 | 舊濃縮版與 UI.md §31 寫 100px | **14px**（2026-09-15 修正，`tokens.css` 已用）；chip／badge／switch 維持全圓 |
| 間距尺度 | UI.md 寫 4／8／12／16／24／32／48／64 | **§2.3 的 6～96px 尺度**（`tokens.css` 已用） |
| 動態時間 | UI.md 寫 120／200／320ms | **300／350／800ms**（§2.4） |
| 斷點 | UI.md 寫 480／768／1024／1280／1536 | **860／640px**（§2.5）；320／768／1280 只是驗收寬度 |
| 字體與正文字級 | UI.md 寫 Noto Sans TC、正文 ≥16px | **Kumbh Sans＋Noto Sans TC、正文 18px**（§2.2） |
| token 命名 | UI.md 用 `color.background.*`、`color.decor.contrast` | **§2.1 的命名**（`tokens.css` 已用，舊名只保留為別名） |
| 輸入框、卡片外框 | STYLEGUIDE §3.2、§3.6 寫 1px 邊框 | **不外框**：輸入框淺底填色、卡片白底加陰影（§2.6，實作已如此） |
| 引言 | STYLEGUIDE §3.9 寫左側 4px 邊條 | **淺底色塊，不加邊條**（§2.6、§6.1） |
| 卡片行數 | UI.md 寫標題 2 行、摘要 3 行 | **標題 3 行、摘要 2 行**（`hl-style.css` 已用） |
| Logo 墨色 | STYLEGUIDE §3.11 寫淺底用近黑 `#040000` | **淺底用主色藍 `#064EA4`**（翰林指示） |
| 生動化附錄 | 舊附錄曾要求裝飾色當徽章底、色值與 §2.1 不同 | **已改為只引用 §2.1 token，徽章一律白底藍字**（§2.8） |
| 圖示 | STYLEGUIDE 寫線寬 1.6px 的線條圖示 | **Material Symbols Rounded**（平台與範例實際使用，§3.10） |
