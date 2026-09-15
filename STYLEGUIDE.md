# 翰林相信學習 — 設計系統規範

依 `DESIGN.md` 產出的實作規範。對應實作位於 `site/`,樣式指南頁為 `site/styleguide.html`。

---

## 1. 內容與目標

**設計意圖(一句話):** 讓翰林數位教學產品在課前備課、課中教學與作業測驗三個階段中,以一致、可驗證、對鍵盤與螢幕閱讀器友善的介面呈現。

- 產品/品牌:翰林相信學習
- 受眾:國小至技高的教師與教學支援人員
- 產品型態:內容型網站(產品總覽、分類、產品介紹、搜尋)
- 無障礙目標:WCAG 2.2 AA

**成功條件**

- 所有介面數值必須來自 `tokens.css`,不得在元件層寫入色碼或一次性尺寸。
- 每個互動元件必須具備七種狀態:default、hover、focus-visible、active、disabled、loading、error。
- 每條無障礙規則必須可在實作中被測試。

---

## 2. 設計 token 與基礎

token 定義於 `site/assets/tokens.css`,是唯一的數值來源。元件層必須引用語意 token。

### 2.1 色彩(Colors)

色彩規則與色值統一定義於本節。全文其他章節一律引用此處的語意 token,不得另行寫入色碼。

#### Primary

| Token | 值 | 用途 |
| --- | --- | --- |
| `color.surface.strong` | `#064ea4` | 主要按鈕、連結、焦點框、徽章文字 |
| `color.action.bg.hover` | `#05407f` | 主要按鈕 hover |
| `color.action.bg.active` | `#03305f` | 主要按鈕按下 |

#### Neutral

| Token | 值 | 別名 | 用途 |
| --- | --- | --- | --- |
| `color.surface.muted` | `#ffffff` | Neutral 0 | 頁面與卡片底色 |
| `color.page.bg.subtle` | `#f4f7fb` | **Neutral 200** | Hero 與區塊大面積底色 |
| `color.disabled.bg` | `#eef2f7` | — | 停用底色 |
| `color.text.tertiary` | `#becad7` | — | 深色底文字、分隔 |
| `color.text.primary` | `#62778f` | — | 正文 |
| `color.text.secondary` | `#1e3d60` | — | 標題、頁尾底色 |
| `color.surface.base` | `#000000` | — | 最深底色 |

#### 裝飾色(Decorative)

| Token | 值 | 用途 |
| --- | --- | --- |
| `color.decor.sun` | `#f5d35b` | 僅限裝飾形狀 |
| `color.decor.warm` | `#ef9d78` | 僅限裝飾形狀 |

**裝飾色限制(必須遵守)**

- 裝飾色僅用於畫面生動化的視覺點綴(Hero 形狀、插圖、背景幾何)。
- 不得作為文字色。
- 不得作為狀態色。
- **不得進入元件層**:按鈕、徽章、標籤、輸入框、卡片邊框等一律不使用。

#### Semantic 與品牌

| Token | 值 | 用途 |
| --- | --- | --- |
| `color.danger` | `#b3261e` | 錯誤訊息與邊框 |
| `color.danger.bg` | `#fdf1f0` | 錯誤訊息底色 |
| `color.success` | `#146c43` | 成功訊息 |
| `color.brand.ink` | `#040000` | 僅供品牌標誌文字 |

#### 徽章(Badge)

徽章不使用裝飾色。一律採用**白底配藍字**:底色 `color.surface.muted`、文字 `color.surface.strong`,對比度 7.97:1。

#### 對比度限制(必須遵守)

| 組合 | 對比度 | 判定 |
| --- | --- | --- |
| `color.text.primary` on `color.surface.muted` | 4.61:1 | 通過(正文預設) |
| `color.text.tertiary` on `color.surface.muted` | 1.66:1 | **不通過,禁用於白底文字** |
| `color.text.tertiary` on `color.text.secondary` | 6.67:1 | 通過(頁尾) |
| `color.surface.muted` on `color.surface.strong` | 7.97:1 | 通過(主要按鈕) |
| `color.surface.strong` on `color.surface.muted` | 7.97:1 | 通過(徽章) |
| `color.danger` on `color.danger.bg` | 5.92:1 | 通過(錯誤訊息,WCAG AA) |

### 2.2 字體與字級(Typography)

- 主要字體:`font.family.primary=Kumbh Sans`,堆疊 `Kumbh Sans, Noto Sans TC, sans-serif`
- 正文:`font.size.base=18px` / `font.line-height.base=30.006px` / `font.weight.base=400`

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

Display 三級為既有尺度的等比延伸,不得再新增中間值。

### 2.3 間距(Spacing)

`space.1=6px`、`space.2=8px`、`space.3=10px`、`space.4=12px`、`space.5=14px`、`space.6=15px`、`space.7=16px`、`space.8=17px` 為元件內部間距。

版面級間距沿用同一尺度延伸:`space.9=24px`、`space.10=32px`、`space.11=48px`、`space.12=64px`、`space.13=96px`。不得插入其他中間值。

### 2.4 圓角、陰影、動態(Radius / Shadow / Motion)

| 類別 | Token | 值 | 用途 |
| --- | --- | --- | --- |
| 圓角 | `radius.xs` | 12px | 卡片、選單、面板 |
| 圓角 | `radius.sm` | 20px | 大型區塊 |
| 圓角 | `radius.md` | 14px | 按鈕、輸入框、下拉選單（2026-09-15 由 100px 修正；chip／badge 仍用 `radius.lg` 全圓） |
| 圓角 | `radius.lg` | 1000px | 圓形裝飾 |
| 陰影 | `shadow.1` | `rgba(30,61,96,.03) 0 5px 15px` | hover 抬升 |
| 陰影 | `shadow.2` | 雙層細陰影 | 卡片與面板預設 |
| 動態 | `motion.duration.instant` | 300ms | 互動回饋 |
| 動態 | `motion.duration.fast` | 350ms | 轉場 |
| 動態 | `motion.duration.normal` | 800ms | 載入動畫 |

`prefers-reduced-motion: reduce` 時,所有動畫與轉場必須縮至 0.01ms。

### 2.5 版面

- 容器最大寬度 1180px,左右內距 `space.9`
- 卡片網格 `repeat(auto-fill, minmax(320px, 1fr))`,間距 `space.10`
- 斷點:860px(導覽收合、雙欄轉單欄)、640px(Hero 縮小、選單滿寬)
- 兄弟元素之間必須以 flex/grid 的 `gap` 排版,不得使用逐一設定的 margin

---


### 2.6 層次與邊線（2026-09-15 定案）

- 層次一律用色塊／底色深淺表現，**不把顏色用在邊線上**，不可「色塊＋邊線」並用。
- 次要按鈕＝柔色底不外框；輸入框、下拉＝淺底填色不外框（focus 以 outline 表示）；Tabs 當前態＝色塊；卡片＝白底＋陰影；分隔用淺底或陰影，不畫線。
- 例外：色版本身以粗邊為識別（例如漫畫貼紙風的 `bd` token），那是色版特徵。

### 2.7 行動裝置（2026-09-15 定案）

- 元件在手機上要依閱讀動線**重新排列組合**，不是等比縮小、也不是丟橫向捲軸。
- Header：≤860px 導覽收成漢堡選單（Logo 左、漢堡右，展開為整寬清單，每項 ≥44px）。
- Footer：≤640px 多欄收成單欄置中，連結一列一個。
- 表格：≤640px 每筆資料變成直式小表——每個欄位一列，左邊欄名格（品牌深色底白字、固定寬）、右邊內容，一筆一卡；欄名必須清楚呈現。

## 3. 元件規則

每個元件皆定義錨點、變體、狀態、鍵盤/指標/觸控行為,以及長內容、溢位與空狀態處理。

### 3.1 Button

**錨點:** `.btn > .btn__label`

**變體:** `.btn`(主要)、`.btn--secondary`、`.btn--ghost`、`.btn--sm`、`.btn--block`

| 狀態 | 表現 |
| --- | --- |
| default | `color.action.bg` 底 + `color.action.fg` 字,圓角 `radius.md` |
| hover | 底色轉 `color.action.bg.hover`,加上 `shadow.1` |
| focus-visible | 3px `color.surface.strong` 外框,offset 2px |
| active | 底色轉 `color.action.bg.active`,`translateY(1px)` |
| disabled | `color.disabled.bg` 底 + `color.disabled.fg` 字,`pointer-events: none` |
| loading | `data-loading="true"` + `aria-busy="true"`,label 以 `visibility: hidden` 保留位置,疊上旋轉指示 |
| error | 按鈕本身不表達錯誤,錯誤必須顯示於關聯的表單訊息區 |

**規則**

- 觸控目標必須 ≥ 44×44px。
- loading 時版面不得位移,label 必須保留原有寬度。
- 按鈕文字必須說明實際動作(「訂閱」),不得使用「送出」「確定」等無描述性字樣。
- 若按鈕只有圖示,必須提供 `aria-label`。

### 3.2 Input / Field

**錨點:** `.field > .label + .input + .hint + .error-text`

| 狀態 | 表現 |
| --- | --- |
| default | 1px `color.border.strong` 邊框,圓角 `radius.md`,最小高度 48px |
| hover | 邊框轉 `color.surface.strong` |
| focus-visible | 3px 焦點外框,offset 2px |
| disabled | `color.disabled.bg` 底,邊框轉淡,`cursor: not-allowed` |
| error | `aria-invalid="true"`,邊框 `color.danger`,底色 `color.danger.bg`,並顯示 `.error-text` |
| loading | 由送出按鈕承擔 loading,輸入框維持可讀 |

**規則**

- 錯誤必須同時以顏色、文字與 `aria-invalid` 表達,不得只用顏色。
- 錯誤訊息必須以 `aria-describedby` 綁定欄位,並置於 `role="alert"` 容器。
- 錯誤訊息必須說明原因與修正方式,例如「信箱格式不正確,請確認是否包含 @ 與網域。」
- 使用者開始修正後,錯誤應即時清除。

### 3.3 Chip / 篩選

**錨點:** `.chip-group[role="tablist"] > .chip[role="tab"]`

| 狀態 | 表現 |
| --- | --- |
| default | `color.page.bg.subtle` 底,最小高度 40px |
| hover | 底色轉 `color.border` |
| focus-visible | 3px 焦點外框 |
| active | 底色轉 `color.border.strong` |
| selected | `aria-selected="true"`,`color.action.bg` 底 + 白字 |
| disabled | `color.disabled.bg` 底 + `color.disabled.fg` 字 |
| loading / error | 篩選結果的載入與錯誤由結果區處理,chip 本身不變 |

**規則**

- 群組必須以 `role="tablist"` 標記,左右方向鍵在群組內循環移動焦點。
- 篩選結果變化必須以 `aria-live="polite"` 播報數量。
- 篩選後無結果時必須顯示空狀態,不得只留空白區域。

### 3.4 Dropdown / 下拉選單

**錨點:** `.dropdown > .dropdown__trigger + .dropdown__menu > .dropdown__item`

**輔助元素:** `.dropdown__label`(群組標題)、`.dropdown__divider`、`.dropdown__count`、`.dropdown__message`

| 狀態 | 表現 |
| --- | --- |
| default | 觸發鈕透明底,箭頭朝下 |
| hover | `color.page.bg.subtle` 底 + `color.action.bg` 字 |
| focus-visible | 3px 焦點外框 |
| active | `color.border` 底 |
| expanded | `aria-expanded="true"`,箭頭旋轉 180 度並維持 hover 底色 |
| disabled | `color.disabled.fg` 字,`pointer-events: none` |
| loading | 選單 `data-loading="true"` + `aria-busy="true"`,骨架列取代項目 |
| error | 選單內顯示 `.dropdown__message--error`,不得留白 |

**行為**

| 輸入方式 | 行為 |
| --- | --- |
| 鍵盤 | Enter / Space / ↓ 開啟並聚焦第一項;↑ 開啟並聚焦最後一項;↑↓ 循環移動;Home / End 跳至首末項;Esc 關閉並將焦點送回觸發鈕;Tab 移出即關閉 |
| 指標 | 點擊觸發鈕開合;選到項目後自動關閉;點擊選單外部關閉;停用項目不接受點擊也不關閉選單 |
| 觸控 | 項目高度 ≥ 44px;640px 以下選單改為滿寬 |

**邊界處理**

- 選單最高 320px,超出時於選單內捲動。
- 靠近視窗右緣時自動改為向左對齊(`.dropdown--end`)。
- 停用項目必須以 `aria-disabled="true"` 標記並排除於鍵盤循環之外,不得以 `display: none` 隱藏。

### 3.5 Accordion / 摺疊面板

**錨點:** `.accordion > .accordion__item > (h3 > .accordion__trigger) + .accordion__panel`

**變體:** `.accordion`(含框)、`.accordion--plain`(無框,用於內文中)、`data-single="true"`(一次只展開一項)

| 狀態 | 表現 |
| --- | --- |
| default | 透明底,標題最小高度 56px,右側加號 |
| hover | `color.page.bg.subtle` 底 + `color.action.bg` 字 |
| focus-visible | 3px 焦點外框,offset -3px |
| active | `color.border` 底 |
| expanded | `aria-expanded="true"`,加號轉為減號,標題轉 `color.action.bg` |
| disabled | `color.disabled.fg` 字,`pointer-events: none` |
| loading | 面板 `data-loading="true"` + `aria-busy="true"`,骨架列取代內容 |
| error | 面板內顯示 `.error-text`,不得只留空面板 |

**行為**

| 輸入方式 | 行為 |
| --- | --- |
| 鍵盤 | Enter / Space 開合目前標題;↑↓ 在標題之間移動;Home / End 跳至首末標題;Tab 依序進入已展開面板內的元素 |
| 指標 | 點擊標題任一處開合,不限於圖示 |
| 觸控 | 標題可點區域高度 ≥ 56px,整列皆可點 |

**規則**

- 標題必須是 `<button>`,並包在符合頁面階層的標題元素內(例如 `<h3>`)。
- 面板必須以 `hidden` 收合並移出無障礙樹,收合內容不得仍可被 Tab 聚焦。
- 展開狀態必須同時以圖示形狀與 `aria-expanded` 表達,不得只用顏色。
- 面板內容不設高度上限,長內容隨展開延伸。

### 3.6 Card

**錨點:** `.card > .card__media + .card__body > (.card__meta + .card__title + .card__excerpt)`

**變體:** `.card`(直式)、`.card--row`(橫式小卡)、`.card--skeleton`(載入骨架)

| 狀態 | 表現 |
| --- | --- |
| default | 1px `color.border` 邊框,`shadow.2`,圓角 `radius.xs` |
| hover | `translateY(-4px)` + `shadow.1` 疊加 |
| focus-visible | 卡片外框由 `:has(.card__link:focus-visible)` 呈現 |
| active | 沿用連結的 active 表現 |
| disabled | 卡片不提供停用狀態;無資料時改用空狀態 |
| loading | `.card--skeleton` + `aria-hidden="true"`,骨架高度須接近實際內容 |
| error | 由列表區塊統一以 `.alert` 呈現 |

**規則**

- 整張卡片可點,但只有標題連結進入 Tab 順序(`.card__link::after` 覆蓋整張卡)。
- 標題最多 3 行、摘要最多 2 行,超出以省略號收尾。
- 圖片必須有 `alt`;裝飾性圖形必須 `aria-hidden="true"`。

### 3.7 Pagination

- 每個項目最小 44×44px,目前頁以 `aria-current="page"` 標記並反白。
- 不可用的上一頁/下一頁必須以 `aria-disabled="true"` 標記並移除 hover 效果,不得直接隱藏。
- 每個項目必須有描述性 `aria-label`,例如「第 2 頁」。

### 3.8 Empty state 與 Alert

- 空狀態必須說明原因並提供至少一個下一步動作。
- 錯誤 `.alert` 必須使用 `role="alert"`,並同時以圖示、顏色與文字表達。
- 兩者皆不得只顯示「查無資料」而無後續指引。

### 3.9 Rich Text / 內文排版

**適用範圍:** 產品介紹頁的 `.prose` 區塊,以及任何由後端輸出的長內容。

| 元素 | 規則 |
| --- | --- |
| 標題 | 依第 2.2 節的 H1–H6 尺度;階層不得跳級,`text-wrap: balance` |
| 段落 | 預設 `font.size.base`;導言用 Paragraph Large,圖說與輔助說明用 Paragraph Small |
| 連結 | `color.surface.strong` + 底線,`text-underline-offset: 3px`;文字必須說明目的地 |
| 粗體 | `font.weight.bold=700`,僅用於強調關鍵資訊,不得整段使用 |
| 斜體 | 中文避免使用,僅用於外文詞彙 |
| 引言 | 左側 4px `color.surface.strong` 邊條 + `color.page.bg.subtle` 底色,圓角 `radius.xs` |
| 清單 | 縮排 `space.9`,項目間距 `space.2`;編號清單僅在內容確實具有順序時使用 |
| 圖片與圖說 | 圓角 `radius.xs`,圖說 `font.size.sm`,圖片必須有 `alt` |
| 程式碼區塊 | `color.page.bg.subtle` 底,`overflow-x: auto`,頁面本體不得出現水平捲軸 |

**規則**

- 區塊之間的垂直間距必須由 `.prose > * + *` 統一控制,不得逐一設定 margin。
- 正文寬度應控制在約 65 字元,長文最大寬度 760px。
- 樣式指南頁展示這些樣本時,標題必須改用 `.type-sample` 純樣式標記(見第 4 節)。

### 3.10 Icons

- 尺寸 24×24px,線寬 1.6px,端點與轉角圓角。
- 顏色使用 `currentColor` 或 `color.surface.strong`;深色底改用 `.icon--inverse`。
- 純裝飾圖示必須加 `aria-hidden="true"`。
- 若圖示是按鈕的唯一內容,按鈕必須另外提供 `aria-label`。

### 3.11 品牌標誌

- 標誌以 inline SVG 內嵌,文字墨色綁定 `--logo-ink`。
- 淺色底使用 `color.brand.ink`;深色底必須覆寫為 `color.surface.muted`。
- 標誌高度:頁首 40px(640px 以下 32px)、頁尾 44px。
- 標誌已含品牌字樣,旁邊不得再重複品牌文字。

### 3.12 Feature Menu / 功能選單

功能選單是一組結構相同、可點擊的大型功能入口卡,分兩種樣式,由採用設定 `groups.fm` 決定
(`fm=0` 有色塊圖示磚版 / `fm=1` 純 icon 版)。以下數值取自 `brand.html#feature` 兩種示範的實際渲染量測。

**色塊(`.fm-tile`)——單色,不得輪替**

- 底色一律 `#FFFFFF`,四張磁磚完全一致。**不隨主題色變化,也不隨磁磚順序輪替。**
- 陰影 `--shadow-sm`(`0 1px 2px rgba(20,45,70,.05)`),圓角 14px,尺寸 58×58px(`.sm` 變體 44×44px、圓角 11px)。
- 套用到匯入頁面時,若圖示沒有既有的色塊容器,自製色塊同樣是白底＋同一組陰影與圓角,不得改用柔色底。

**輪替色只作用在圖示與標題文字**

- 圖示色與 `h4` 標題色同色,依磁磚順序輪替,色票由採用主題推導,並確保對白底達 4.5:1。
- 卡片底色為原設計保留,套用時不覆寫。
- 純 icon 版(`fm=1`)不出現色塊:移除底色、陰影與外框,圖示放大至 34px,顏色沿用同一組輪替色。

**禁止**

- 禁止把輪替色染到色塊底色——這會讓「單色色塊」變成四色,與規範示範不符。
- 禁止為了讓測試通過而把「比較文字色」的斷言改成「比較底色」;色塊底色本來就該永遠相等。

---

## 4. 無障礙需求與驗收條件

所有條件皆可在實作中測試。

| 項目 | 通過條件 | 失敗條件 |
| --- | --- | --- |
| 鍵盤操作 | 純鍵盤可完成產品瀏覽、篩選、搜尋、訂閱與摺疊面板操作;焦點順序與視覺順序一致 | 任何互動需要滑鼠才能觸發 |
| 焦點指示 | 所有可聚焦元素具 3px `focus-visible` 外框,offset 2px | 出現 `outline: none` 且無替代指示 |
| 對比度 | 正文 ≥ 4.5:1;大字與元件邊界 ≥ 3:1 | 白底使用 `color.text.tertiary` 作為正文 |
| 觸控目標 | 按鈕、分頁、chip ≥ 44×44px;Accordion 標題 ≥ 56px | 行動版出現小於 44px 的點擊目標 |
| 狀態播報 | 篩選數量、訂閱結果、搜尋結果以 live region 播報 | 狀態只以視覺變化呈現 |
| 收合內容 | 收合的選單與面板以 `hidden` 移出無障礙樹 | 收合內容仍可被 Tab 聚焦 |
| 減少動態 | `prefers-reduced-motion` 下動畫縮至 0.01ms | 骨架動畫在該設定下持續播放 |
| 語意結構 | 每頁單一 h1,標題階層不跳級;地標具 `aria-label` | 以字級模擬標題階層 |
| 圖片替代文字 | 內容圖片有 `alt`,裝飾圖形 `aria-hidden="true"` | 裝飾性圖形被朗讀 |

**樣式指南頁的特殊規則:** 排版樣本必須使用 `.type-sample` 純樣式標記,不得使用真實的 `<h1>`–`<h6>`,否則會在該頁製造重複 h1 與跳級的標題階層。

---

## 5. 文案與語氣

語氣:精確、有把握、以實作為導向。

| 情境 | 應該這樣寫 | 不應該這樣寫 |
| --- | --- | --- |
| 按鈕 | 訂閱 / 搜尋產品 / 瀏覽全部分類 | 送出 / 確定 / 點這裡 |
| 連結 | 查看課前多元備課的全部產品 | 更多 / 詳情 |
| 表單錯誤 | 信箱格式不正確,請確認是否包含 @ 與網域。 | 輸入有誤 |
| 空狀態 | 此分類目前沒有產品。試試其他教學階段,或直接搜尋產品名稱。 | 查無資料 |
| 載入失敗 | 產品分類載入失敗,請重新整理頁面。 | 發生錯誤 |
| 成功訊息 | 訂閱成功,確認信已寄至 name@example.com。 | 完成! |

**規則**

- 動作標籤與其結果必須一致(按「訂閱」後回報「訂閱成功」)。
- 錯誤訊息必須說明問題與修正方式,不得道歉或含糊帶過。
- 以使用者認得的說法命名,而非系統內部用語。

---

## 6. 反模式(禁止事項)

- 在元件樣式中直接寫入色碼,而非引用語意 token。
- 為單一頁面新增一次性的間距或字級例外。
- 移除或以低對比顏色覆蓋 `focus-visible` 外框。
- 使用「點這裡」「更多」等無描述性的連結文字。
- 交付未定義完整七種狀態的互動元件。
- 只用顏色傳達錯誤、選取或展開狀態。
- 以 `display: none` 隱藏停用項目,使其在介面中消失而非標示為停用。
- 以字級模擬標題階層,或在同一頁使用多個 h1。
- 在白底使用 `color.text.tertiary` 作為正文色。
- 將裝飾色用於文字、狀態表達,或帶進元件層(徽章、標籤、按鈕等)。

---

## 7. QA 檢查清單

實作交付前必須逐項通過:

- [ ] 所有顏色、間距、字級、圓角、陰影、動態皆來自 `tokens.css`。
- [ ] 每個互動元件的七種狀態皆可在樣式指南頁重現。
- [ ] 320px、768px、1280px 三個斷點下無水平捲軸、無元素重疊。
- [ ] 長標題、長摘要、空清單、載入中、錯誤五種內容情境皆有處理。
- [ ] Tab 走訪全頁,焦點始終可見且不進入隱藏元素。
- [ ] 下拉選單與 Accordion 的鍵盤行為符合第 3.4、3.5 節的行為表。
- [ ] 篩選、搜尋、訂閱的狀態變化皆有 live region 播報。
- [ ] 每頁單一 h1,標題階層無跳級。
- [ ] 螢幕閱讀器可讀出每張卡片的分類、適用學制與產品名稱。
- [ ] `prefers-reduced-motion` 開啟時無持續播放的動畫。
- [ ] 第一批畫面套版後立即進 Design QA 走查,實測裝飾色視覺面積達 10%;不足時只在背景盲區增加裝飾色區塊,不得回頭修改元件層。

---

## 8. 實作對照

| 規範章節 | 實作位置 |
| --- | --- |
| 設計 token | `site/assets/tokens.css` |
| 元件樣式 | `site/assets/styles.css` |
| 互動行為 | `site/assets/app.js` |
| 視覺樣本 | `site/styleguide.html` |
| 產品總覽 / 分類 / 介紹 / 搜尋 / 404 | `site/index.html`、`category.html`、`article.html`、`search.html`、`404.html` |

產品名稱與說明文字取自翰林數位產品頁(hanlindigi.hle.com.tw/depot/2/7),分為課前備課、課中教學、作業測驗三類。

## 畫面生動化與對比配色規則 (Vibrant & Contrast Guidelines)

本節只規範比例與行為。色值一律引用 §2.1 的語意 token,不得在此另寫色碼。

為了避免畫面過於單調、陷入單一藍藍灰灰的「AI 模板感」,在渲染或生成 UI 畫面時,必須嚴格執行以下配色比例與對比規則:

1. **打破單色調(啟用對比色)**
   - 禁止全畫面只使用 Primary 藍色系與 Neutral 灰色系。
   - 必須讓 `color.decor.sun` 或 `color.decor.warm` 在畫面上構成可見的焦點對比。
   - 這兩色只能以**裝飾形狀、插圖、背景幾何**的形式出現;依 §2.1 裝飾色限制,不得用於徽章、標籤、文字或任何元件層。
   - 需要強調的元件改用 §2.1 的徽章規則(白底藍字)與 Semantic 色,不得改用裝飾色。

2. **實施 60-30-10 配色視覺原則**
   - **60% 基礎結構:** `color.surface.muted`(Neutral 0)與 `color.page.bg.subtle`(Neutral 200)作為大面積背景。
   - **30% 品牌認同:** `color.surface.strong` 用於主要導覽列、大顆主按鈕、重要標題。
   - **10% 活潑靈魂(核心對比):** 必須有 10% 的視覺面積分配給裝飾色或 `color.danger`,與 Primary 藍形成強烈的互補對比。

3. **10% 面積的補足機制(背景層優先)**
   - 徽章已禁用裝飾色,少了一個上色管道,裝飾色面積會自然縮水。**必須主動在背景層補回來**,不得因此讓畫面退回單色調。
   - 補足手段限定為**非元件管道**:背景幾何裝飾、插圖、點綴線條、大面積視覺形狀。
   - 作法是**放大既有裝飾形狀的尺寸**或**增加其數量**,直接在背景層把 10% 的色彩面積撐滿。
   - **絕不走回頭路動元件層。** 面積不足時一律加背景裝飾,不得把裝飾色改回徽章、標籤或任何元件。

4. **微互動與生動細節**
   - Hover / Active 時必須切換對應 token(如 `color.action.bg.hover`),做出明顯的明暗與彩度對比。
   - 資訊卡片與數據展示中,運用 `color.success` 與 `color.danger` 做狀態對比,增加視覺層次。

5. **禁忌事項**
   - 嚴禁將畫面做成一整片藍底或全灰底。
   - 嚴禁把裝飾色鋪成整片底色而超出 10% 的面積上限。放大背景裝飾形狀以補足 10%(第 3 條)不在此限,兩者的分界就是 10% 這條線。
   - 嚴禁為了補足 10% 而把裝飾色放回元件層。
   - 嚴禁在本節或元件樣式中直接寫入色碼,而非引用 §2.1 的語意 token。
