# AI 生成頁面手法樣態庫

匯入的檔案幾乎都是 AI 生成的。AI 寫頁面有固定套路,認出套路就知道該怎麼套規範、該驗什麼。
這份文件是**可累積的資料庫**:每匯入一份新檔案,就拆解它的手法、比對下表,命中就補樣本、沒命中就新增一筆並改引擎。

引擎實作在 `import.html` / `preview.html`(兩份必須同步),驗收在 `run-all.sh`。

---

## 一、換色類手法

### P1 CSS 變數採「語意分層」命名 ★最高價值

**辨識**:`:root` 裡定義一整組 `--xxx: #hex`,名稱本身就標明角色,分三層——

| 層 | 常見寫法 |
|---|---|
| 中性層 | `--ink` `--muted` `--muted-2` `--text-primary` `--text-secondary` `--clr-neutral-400` `--c-dim` `--line` `--border-subtle` `--bg` `--surface` `--card` `--shadow` |
| 主題層 | `--brand` `--brand-dark` `--primary` `--accent` `--clr-primary-600` `--c-brand` |
| 狀態層 | `--ok` `--success` `--warn` `--danger` `--error` `--easy` `--hard` |

後綴 `-soft` `-light` `-lite` `-pale` `-tint` `-bg` 代表**淡底版**,與主色成對出現。

**套用策略**(引擎 `VAR_ROLE` / `varMap`):
- 中性層 → **不換色**,只用 `tintHex(...,主色,0.14)` 帶一點品牌色調。
- 主題層 → 依明度映射到品牌色家族(深→輔色壓深、中→主色、淺→亮色);`-soft` → `mixW(主色,.85)`。
- 狀態層 → 映射到規範狀態色 `ROLE_COLOR`;`-soft` → 對應淡底 `ROLE_SOFT`。
- 判定順序:**狀態 → 主題 → 中性**(因為 `--brand-line` 同時含 brand 與 line,該歸主題)。

**為什麼優先於色相判斷**:變數名比色值可靠。`--ink:#1E2A44` 飽和度 0.39 不算低,只看色相會被當藍色主題色換掉,但它其實是主文字色。

**驗收要點**:凡 class 含 `desc|txt|sub|hint|meta` 的元素,其 color 飽和度必須 < 0.32(仍是灰調)。

**還有三種變體要認**（`user-edcafe` 帶出來的）:
- **顏色名當主題變數**:`--blue` `--cyan` `--navy` `--teal`，不寫 brand/primary。純顏色名 + 可選深淺修飾（deep/dark/light/hi/lo/數字）→ 歸主題層。灰階名（gray/grey/slate）除外，歸中性。
- **純淡底變數**:`--soft` `--soft-2` `--wash` `--tint` `--glow` `--grad`，不含任何角色字樣 → 歸主題淡底。
- **非顏色變數**:`--sans` `--mono`（字體）、`--radius` `--round`（圓角）、`--shadow-s`（陰影，值不是純色）→ 值不以 `#`/`rgb`/`hsl` 開頭就跳過，不會誤判。

**樣本**:`user-index_v6`(19 定義／60 命中)、`user-edcafe`(17／33)、`s18-bem-tokens`、`s19-scale-tokens`、`s20-short-prefix`、`s21-appshell`、`s3-cssvar-dark`

---

### P2 沒用變數,色碼直接寫死

**辨識**:hex/rgb/hsl 散落在 style 標籤與 inline style,無 `:root` 定義。

**套用策略**:退回色相語意映射 `toneFor()` + 主導色映射 `domMap()`。守門:
- 純灰(`d===0`)原封不動——**否則色相算出 NaN 會掉到最後分支被染成對比橘色**(曾發生)。
- 飽和度 < 0.28 視為中性灰,只 tint 不映射。
- `hsl()` 必須先轉 rgb 再走同一套(曾整份漏掉)。

**樣本**:`s4-inline-style` `s7-hsl-colors` `s8-attr-colors`

---

### P3 整頁單一色相

**辨識**:`domHue` 統計後某色相佔壓倒性多數。

**套用策略**:主導色整組映射到品牌色家族,**避免把原站主色當成語意色**(紅色系網站曾套完仍是紅色,因為紅被 `toneFor` 判成「危險紅」原地不動)。對比色與中間色用在點綴、標籤、圖示底,增加畫面層次。

---

## 二、結構類手法

### P4 用 `div` + 語意 class 取代語意標籤

**辨識**:沒有 `<header>` `<footer>` `<section>`,改用 `div.nav` `div.topbar` `div.hdr` `div.site-foot` `div.footer-bar` `div.ft` `div.banner` `div.hero` `div.bnr`。

**套用策略**:靠 class 關鍵字 + 位置(前 2 個／最後 1 個頂層區塊)推斷,標上 `data-hl-hd` / `data-hl-ft` / `data-hl-hero`。
**必要守門**:候選若含 `table` / `form` / `ul` / `h1-h4` / 多段文字就排除——曾把整個內容區誤判成 header,導致整頁白字。

**找不到就強制補上**,不是略過(使用者明確要求)。


### P4b 應用程式外殼（app shell）佈局 ★最容易做壞

**辨識**:`body` 有 `height:100vh`（**不是** `min-height:100vh`——那是「footer 貼底」的常見寫法）＋ `overflow:hidden` 或 `display:flex/grid`。多欄並排、各欄內部各自捲動。後台、AI 助手、編輯器、主控台都是這型。

**為什麼要特別處理**:這類頁面**沒有文件流的 header／歡迎橫幅／footer 概念**。硬插區塊會把 flex/grid 撐爆——實際踩過的三個坑:
- 補的 header 插進 fixed 定位的展開鈕裡 → 中欄被壓成窄條
- 對話區的 `<h1>` 被當成 hero 標題 → 整個對話區套成深色漸層橫幅
- `[data-hl-ft] *{text-align:center}` → 側欄底部的姓名被擠成直排；`[data-hl-hd]{padding:18px 32px}` → 品牌區被撐開

**套用策略（三層都要過濾，缺一層就白做）**:
1. **不新增區塊**——Header 改套在側欄品牌區（`[class*=brand|logo|head|title]`）；Footer 套在側欄底部（`[class*=foot|bottom]`）；歡迎橫幅**完全不補**，也不用 `<h1>` 推斷。
2. **inline 樣式只套視覺屬性**——`visualOnly()` 濾掉 `display / flex / padding / margin / height / width / position / text-align / grid* / overflow*`，只留底色、文字色、邊框、圓角、陰影。元件層的 `setS()` 同樣要濾（按鈕的 `padding:8px 16px` 會擠壞 flex 兄弟元素）。
3. **注入的 CSS 也要濾**——`layoutCss` 併入前跑一次同樣的過濾。只濾 inline 不濾注入等於沒濾。

**這符合鐵律**:佈局屬於結構，只改視覺才是「只改 UI，不改文字與功能」。

**驗收要點**:渲染原始與套用後，比對各欄的 `getBoundingClientRect().width` 與 `display`，差異須在 20% 內且 display 不變。這是「沒跑版」的硬證據，比看截圖可靠。

**樣本**:`user-edcafe`（aside.sidebar + 三欄，1232 段文字全數保留）、`s21-appshell`（div.drawer + 兩欄 grid，換一套命名）

---

### P4c 側邊欄取代頂部 header

**辨識**:`<aside>` 或 `[class*=sidebar|side-nav|sidenav|side-bar|drawer]`，內含 2+ 個 a/button 且有實質文字。頁面通常沒有 `<header>`/`.topbar`。

**必要守門**:側欄的品牌區含一個收合鈕就會被當成 header 橫條（實際踩過:`.sb-brand` 被判成 header）。**header 候選必須排除側欄內的元素**。

**若非 app shell 而需補 header**:插進「側欄之後第一個有實質內容的容器」，不是 body 最前面——側欄後面常跟著 fixed 定位的展開鈕、遮罩、toast，插進去會壞（實際踩過:header 被插進 `button.sb-open` 裡）。

---

### P4d 單字母方塊當 logo mark

**辨識**:`<div class="hmark">H</div>`、`<div class="drawer-mark">Q</div>`——不是 `img` 也不是 `svg`，所以 logo 規則會整個漏掉。
**套用**:在品牌區內找「無子元素、內容 1–2 字」的元素，換成 logo 圖並清掉它原本的底色與邊框。

---

### P5 狀態用附加 class

**辨識**:`.row-status.is-late` `.eq.skip` `.card.on` `.item.edited`。修飾詞:`is-` `has-` `on` `off` `active` `skip` `done` `edited` `blank`。

**套用策略**:主 class 決定元件樣式,修飾 class 決定狀態色。

---

### P6 class 縮寫前綴 + 角色後綴 ★最高價值

**辨識**:`fc-title` `fc-desc` `eq-head` `eq-body` `dz-ico` `dz-txt` `fi-name` `bb-count` `bx-tit` `bx-txt` `bx-num` `card__description` `panel-heading`。

**前綴是區塊代號**(每份檔案都不同,無法列舉);**後綴才是角色**,而且後綴用詞高度一致。所以判角色一律看後綴:

| 角色 | 後綴 | 套用 |
|---|---|---|
| 說明文 | `desc` `description` `sub` `subtitle` `hint` `note` `meta` `caption` `tip` `txt` `tx` `info` | 中性灰、13.5px、行距 1.85 |
| 標題 | `title` `tit` `heading` `hd` `headline` `name` `label` `lab` | 輔色、700、字距 .02em |
| 標籤 | `badge` `chip` `tag` `pill` `status` `state` `flag` | 淡底藥丸 999px |
| 數據 | `count` `num` `number` `value` `val` `score` `total` `amount` `qty` | 主色、700 |

**守門**:版型區(`data-hl-hd/ft/hero`)內不套,交給版型規則;`button/input/select/a/svg/img` 不套;說明文若有 >1 子元素代表是容器,不套。

**樣本**:全部 4 個變數樣本 + `s2-bootstrap` `s15-components` `s16-bulma` `s17-antd`

---

### P7 JS 模板字串產生 class

**辨識**:`class="${on?'':'skip'}"` `${state.lessons.has(i)?'on':''}`。

**影響**:靜態 HTML 掃不到全部 class,注入 CSS 規則會漏。
**對策**:這正是**一律用 inline style + `!important` 寫在元素上**的理由——執行時才生成的元素雖掃不到,但已存在的元素一定套得到,且優先權最高蓋不掉。

---

## 三、圖示類手法

### P8 emoji 當 icon

**辨識**:文字節點裡混著 🚀 📄 💪 ⏰ ✨。
**套用策略**:70+ 組 emoji → Material Symbols ligature 對照表。
**鐵律**:`<script>` / `<style>` / `<template>` 內的 emoji **一律不動**(那是程式碼)。

**色點圖例要保留顏色語意**:AI 很愛用 ⚪🟢🔵🟡🔴 當狀態圖例（`user-edcafe` 的「⚪ 雙方都有／🟢 Edcafe／🔵 翰林」）。全部換成同色的 `circle` 圖示，圖例就失去意義。對照表要另存 `DOT_TONE`，把每個色點映射到語意色（綠→成功綠、黃橘→警示、紅→危險、藍紫→主色、白灰→中性），替換時套上對應顏色。

### P9 圖示字型

**辨識**:`<i class="fa-solid fa-user">` `bi-` `[data-lucide]` `[data-feather]` `<ion-icon>` `.material-icons`,多為空元素。
**套用策略**:依所選圖示樣式替換為對應形態,套上規範的尺寸、底色、圓角。

### P10 inline SVG

**辨識**:直接嵌 `<svg><path d="...">`。
**套用策略**:改 `fill` / `stroke` 為品牌色,尺寸與容器套規範。

---

## 四、框架類手法

引擎依**特徵專屬度**排序偵測 11 種:Ant Design → Material UI → Element Plus → Vuetify → Chakra → Semantic UI → Bulma → Foundation → WordPress → Bootstrap → Tailwind。命中後用該框架的元件 class 精準取元素。

**注意**:Tailwind 等 utility framework 的 class 規則可能後載入,注入 CSS 會被蓋 → 仍須 inline + important。

---

## 五、驗收陷阱(踩過的坑,務必遵守)

1. **不可用字數差驗「文字未被更動」**。系統會補介面元件與圖示 ligature,字數必然變動;扣除法會扣過頭甚至算出負數(曾造成 17 項假失敗)。
   **正確做法**:取原檔可見文字節點(排除 `script/style/template/noscript`),依 emoji 與符號**切分成子片段**(emoji 被換成圖示元素會把文字節點切開,例如「開始生成🚀」變兩截),確認每個含文字的子片段在套用後仍存在。字數只當資訊列。

2. **不可把 `<script>` 內的 emoji 算成殘留**。掃描範圍必須排除 script/style。

3. **不可只驗「規則字串有注入」**。要真實渲染 iframe + `getComputedStyle` 驗,並加渲染守門(iframe 未渲染時 total=0 會誤判 100% 通過)。

4. **兩份引擎必須同步，而且要有測試會抓到不同步**。`import.html` 與 `preview.html` 各有一份引擎。實際踩過:改了 import 沒改 preview，使用者在預覽頁看到的是舊引擎（會跑版）。
   兩邊介面不同（preview 用 `t`／`mix()`／`mixBk()`，import 用 `guidelineTheme()`／`mixW()`／`mixB()`），已加介面墊片讓兩邊共用同一份引擎程式碼。
   **另一個坑**:引擎回傳 `{html,...}` 物件，preview 的呼叫端原本當字串用（`srcdoc=brandifyHtml(...)`），結果 srcdoc 收到 `[object Object]`，整個 iframe 空白但測試只報「找不到 header」，很難聯想。改引擎回傳值時**務必檢查所有呼叫端**。

5. **正則吃掉分隔字元會漏讀**。用 `/(?:^|[},])\s*body\s*\{/g` 逐條掃 CSS 時，第一條規則的 `}` 已被消耗，第二條 `body{...}` 前面只剩換行就匹配不到（實際踩過:只讀到 `html,body{height:100vh}`，漏掉真正含 `overflow:hidden` 的那條，導致 app shell 沒被辨識）。改用 lookbehind `/(?<![\w.#-])body\s*\{/g`。

6. **自製樣本會造成循環論證**。本庫 17 個早期樣本中有 15 個連 CSS 變數都沒有,完全不像真實 AI 產出——所以「驗收 0 失敗但實際失敗一堆」。
   **對策**:以真實匯入檔為準(`samples/user-index_v6.html`,獨立測試頁 `user-suite.html`),新規則必須再用**換一套命名**的樣本驗泛化,不能只在來源檔上通過。

---

## 六、新增一筆的流程

1. 把檔案複製進 `samples/`(自動被 `audit-suite` 納入,無須改設定)。
2. 拆解手法:`grep -oE '\-\-[a-z0-9-]+:'` 看變數命名、`grep -oE 'class="[^"]+"'` 看 class 命名、看結構標籤與圖示形態。
3. 比對本文件:命中既有手法就結案;沒命中就在對應章節**新增一筆**,寫清楚辨識訊號、套用策略、驗收要點。
4. 改引擎(`import.html` + `preview.html` 兩份同步)。
5. **再寫一個換命名的樣本驗泛化**,確認不是為單一檔案硬寫。
6. `bash run-all.sh` 全站 0 失敗才算完成。

---

## 七、目前覆蓋

樣本 23 個，驗收 23 組全過（含兩份真實匯入檔各自的獨立測試頁 `user-suite` / `edcafe-suite`）。

**變數語意分層**:`user-index_v6` 19 定義／60 次、`user-edcafe` 17／33、`s18` 13／16、`s20` 13／15、`s19` 11／11、`s21` 9／12、`s3` 6／9。
**角色 class**:`s19` 14、`s20` 12、`s18` 11、`s21` 10、`user-index_v6` 9、`user-edcafe` 69。
**說明文保持中性**:12/12。
**app shell**:`user-edcafe` 三欄 294/549/549 套用前後完全一致、原文 1232/1232 段、事件屬性 242/242、script 完全一致；`s21-appshell` 換一套命名同樣辨識成功。

---

## 八、品牌資產（logo SVG）的坑

Illustrator 匯出的 SVG 常有兩個問題，會讓 logo 在 `<img>` 裡**完全不顯示**：

**一、viewBox 停在舊畫板座標**
一個 AI 檔多個畫板時，匯出的每個 SVG 都含**全部**變體圖形，只靠 viewBox 框選其中一個。若圖形被平移過而 viewBox 沒更新，框就會落在圖形之外 → 整張空白（或框到兩個變體中間的空白處 → 顯示不完整）。

**怎麼查**：把 SVG inline 進頁面，用 `getBBox()` 取真實邊界，跟 viewBox 比對。量測時要**排除白色元素**（`fill:#FFFFFF`）——它們在白底上不可見，卻會把邊界撐到畫布外，讓量測失準。

**怎麼修**：依 x 座標分群找出各變體邊界（間隔 150 以上算不同變體），依檔名語意挑目標變體，用「目標變體置中於原 viewBox 尺寸」重算 x/y。原 viewBox 的**寬高是設計師定的、通常正確**，錯的只有位置。

**二、Illustrator 私有命名空間**
`<!DOCTYPE svg [<!ENTITY ns_ai ...>]>`、`xmlns:i="&ns_ai;"`、`<switch><foreignObject requiredExtensions="&ns_ai;">`、`i:extraneous="self"`。

inline 到 HTML 時解析寬鬆不會壞，但 `<img src="x.svg">` 走**嚴格 XML 解析**，只要有未宣告命名空間的 `i:` 前綴就整份解析失敗 → 破圖。

**關鍵**：移除 `xmlns:i` 時，必須連同所有 `i:` 前綴的元素與屬性一起移除，只刪宣告會讓原本能顯示的檔案變破圖。清乾淨後檔案通常從 90KB 降到 21KB。

**驗收**：不能只看 inline 渲染，要用 `<img>` 實際載入並截圖，淺底與深底（`filter:brightness(0) invert(1)`）都要看。

原檔備份在 `logo-orig/`。
