---
name: hanlin-web-basic
description: 翰林 Web 基本規範 — 設計 token、元件狀態、無障礙與 Logo 使用規則，供 AI 產出符合翰林規範的頁面
---

# 翰林 Web 基本規範 Skill

> 這是**基本規範**，不含任何風格色版。需要特定視覺風格請改用視覺套版平台匯出的 `SKILL-<色版名>.md`。
> 來源文件：`STYLEGUIDE.md`（翰林相信學習 — 設計系統規範）
> 對應實作：`hanlin-web-starter/`（tokens.css / styles.css / app.js / index.html）

## 最高原則

- **所有介面數值必須來自 `tokens.css`**，不得在元件層寫入色碼或一次性尺寸。
- **每個互動元件必須具備七種狀態**：default、hover、focus-visible、active、disabled、loading、error。
- 無障礙目標：WCAG 2.2 AA。每條規則都必須可被測試。

## 色彩 Colors

- 主色 surface.strong / action.bg：`#064EA4`（主要按鈕、連結、焦點框）
- 主色 hover：`#05407F`　主色 active：`#03305F`　主色上的文字：`#FFFFFF`（7.97:1）
- 區塊底色 page.bg.subtle：`#F4F7FB`
- 正文 text.primary：`#62778F`（白底 4.61:1）
- 標題與頁尾底 text.secondary：`#1E3D60`
- 深色底文字／分隔 text.tertiary：`#BECAD7`（於 `#1E3D60` 上 6.67:1）
- 停用底 disabled.bg：`#EEF2F7`
- 頁面與卡片底 surface.muted：`#FFFFFF`
- 語意色：danger `#B3261E`（於 `#FDF1F0` 上 5.92:1）／success `#146C43`
- 品牌標誌墨色 brand.ink：`#040000`

### 裝飾色（限制最嚴，最常被誤用）

- 裝飾黃 decor.sun `#F5D35B`、裝飾暖橘 decor.warm `#EF9D78`
- **只能用於 Hero 與插圖形狀。**不得作為文字色、狀態色，也不得作為承載文字的底色。
- 裝飾黃於白底只有 1.46:1。徽章、標籤、色塊一律**白底配藍字**（`#FFFFFF` + `#064EA4`，7.97:1）。

### 禁用組合

- **白底不得使用 `#BECAD7` 作為正文色**（1.66:1）。
- 不得只用顏色傳達錯誤、選取或展開狀態。

## Logo（必套項目，不是選配）

- 標誌以 **inline SVG** 內嵌，文字墨色綁定 `--logo-ink`。
- 淺色底用主色藍 `#064EA4`（白底 7.97:1）；深色底必須覆寫為 `surface.muted`。
- 註：規範 §3.11 原文寫淺色底用 `brand.ink`（近黑 `#040000`），此處依翰林指示改為主色藍。
- 尺寸：頁首 40px（視窗 640px 以下 32px）、頁尾 44px；寬度 auto 等比縮放。
- **標誌已含品牌字樣，旁邊不得再重複品牌文字。**
- `favicon` 一併換成翰林 H 標（`favicon.svg`）。
- 禁止：變形拉伸、旋轉、改配色、加外框／陰影／底色方塊、裁切標誌任何一部分。
- 淨空區：四周至少留一個「翰」字高度的空白。

## 字體與級距 Typography

- 字體堆疊：`Kumbh Sans, Noto Sans TC, sans-serif`
- 正文 18px / 行高 30.006px / 400
- H1 56px、H2 40px、H3 32px、H4 24px、H5 20px、H6 18px，行高一律 1.25
- Paragraph Large 20px/1.7、Paragraph Small 15px/1.7
- 導覽與按鈕 16px、提示與錯誤 14px、標籤與日期 13px
- Display 三級是既有尺度的等比延伸，**不得再新增中間值**。
- 不得以字級模擬標題階層；每頁單一 `h1`，階層不跳級。

## 形狀與間距 Shape & Spacing

- 圓角：卡片／選單／面板 12px、大型區塊 20px、按鈕／chip／輸入框 100px、圓形裝飾 1000px
- 陰影：hover 抬升 `rgba(30,61,96,.03) 0 5px 15px`；卡片預設為雙層細陰影
- 間距尺度：6 / 8 / 10 / 12 / 14 / 15 / 16 / 17 / 24 / 32 / 48 / 64 / 96 px，**不得插入中間值**
- 動態：互動回饋 300ms、轉場 350ms、載入 800ms
- 容器最大寬 1180px，左右內距 24px；長文最大寬 760px（約 65 字元）
- 卡片網格 `repeat(auto-fill, minmax(320px, 1fr))`、間距 32px
- 斷點：860px（導覽收合、雙欄轉單欄）、640px（Hero 縮小、選單滿寬）
- **兄弟元素之間一律用 flex/grid 的 `gap` 排版，不得逐一設定 margin。**

## 元件狀態 Components

| 元件 | 關鍵規則 |
|---|---|
| Button | 觸控目標 ≥ 44×44px；loading 時 label 用 `visibility:hidden` 保留寬度，版面不得位移；只有圖示時必須有 `aria-label` |
| Input / Field | 最小高度 48px；錯誤同時以顏色、文字、`aria-invalid` 表達；訊息用 `aria-describedby` 綁定並放在 `role="alert"` 容器 |
| Chip / 篩選 | `role="tablist"`；左右方向鍵在群組內循環；結果數量以 `aria-live="polite"` 播報；無結果必須顯示空狀態 |
| Accordion | 標題必須是 `<button>` 且包在標題元素內；面板以 `hidden` 收合並移出無障礙樹；標題可點高度 ≥ 56px |
| Card | 整張可點，但只有標題連結進 Tab 順序（`.card__link::after` 覆蓋全卡）；標題最多 3 行、摘要 2 行 |
| Pagination | 每項 ≥ 44×44px；目前頁 `aria-current="page"`；不可用項目標 `aria-disabled` 而非隱藏 |
| Icons | 24×24px、線寬 1.6px、圓角端點；顏色用 `currentColor`；裝飾性加 `aria-hidden="true"` |

## 無障礙 Accessibility（硬性，逐項驗證）

- 所有可聚焦元素：3px focus-visible 外框、offset 2px。**出現 `outline:none` 且無替代指示即為失敗。**
- 正文對比 ≥ 4.5:1；大字與元件邊界 ≥ 3:1。
- 純鍵盤可完成全部操作；焦點順序與視覺順序一致。
- 收合的選單與面板必須以 `hidden` 移出無障礙樹，收合內容不得仍可被 Tab 聚焦。
- `prefers-reduced-motion: reduce` 時所有動畫與轉場縮至 0.01ms。
- 內容圖片有 `alt`；裝飾圖形 `aria-hidden="true"`。

## 文案語氣 Copy

語氣：精確、有把握、以實作為導向。

| 情境 | 應該這樣寫 | 不應該這樣寫 |
|---|---|---|
| 按鈕 | 訂閱／搜尋產品／瀏覽全部分類 | 送出／確定／點這裡 |
| 連結 | 查看課前多元備課的全部產品 | 更多／詳情 |
| 表單錯誤 | 信箱格式不正確，請確認是否包含 @ 與網域。 | 輸入有誤 |
| 空狀態 | 此分類目前沒有產品。試試其他教學階段，或直接搜尋產品名稱。 | 查無資料 |
| 載入失敗 | 產品分類載入失敗，請重新整理頁面。 | 發生錯誤 |
| 成功訊息 | 訂閱成功，確認信已寄至 name@example.com。 | 完成！ |

- 動作標籤與其結果必須一致（按「訂閱」後回報「訂閱成功」）。
- 錯誤訊息必須說明問題與修正方式，不得道歉或含糊帶過。

## 反模式 Anti-patterns（禁止）

- 在元件樣式中直接寫入色碼，而非引用語意 token
- 為單一頁面新增一次性的間距或字級例外
- 移除或以低對比顏色覆蓋 focus-visible 外框
- 使用「點這裡」「更多」等無描述性連結文字
- 交付未定義完整七種狀態的互動元件
- 只用顏色傳達錯誤、選取或展開狀態
- 以 `display:none` 隱藏停用項目，使其消失而非標示為停用
- 以字級模擬標題階層，或在同一頁使用多個 `h1`
- 在白底使用 `#BECAD7` 作為正文色
- 將裝飾色用於文字或狀態表達

## 已知的規範缺口（產出時請留意）

以下 token 在規範 §3 被引用但 §2.1 未定義，`tokens.css` 中的值為推導，非規範原文：

- `color.border` → `#BECAD7`（等於 text.tertiary，其用途已含「分隔」）
- `color.border.strong` → `#7690A8`（白底 3.32:1，滿足「元件邊界 ≥ 3:1」；原本的 `#BECAD7` 只有 1.66:1 不合格）
- `color.disabled.fg` → `#8A9AAB`
- `--logo-ink` → 規範有規則但未給 token 名

另外規範文末「畫面生動化」附錄的色值（`#FCD12E`／`#EF9D55`／`#D32F2F`）與 §2.1 的色彩表不一致，
且附錄要求拿裝飾色當徽章底、與 §2.1「裝飾色不得作為文字色或狀態色」相衝突。
**一律以 §2.1 的色彩 token 表為準。**

## 交付檢查清單

- [ ] 所有顏色、間距、字級、圓角、陰影、動態皆來自 `tokens.css`
- [ ] 每個互動元件的七種狀態皆可重現
- [ ] 320 / 768 / 1280 三個斷點下無水平捲軸、無元素重疊
- [ ] 長標題、長摘要、空清單、載入中、錯誤五種內容情境皆有處理
- [ ] Tab 走訪全頁，焦點始終可見且不進入隱藏元素
- [ ] 篩選、搜尋、訂閱的狀態變化皆有 live region 播報
- [ ] 每頁單一 `h1`，標題階層無跳級
- [ ] `prefers-reduced-motion` 開啟時無持續播放的動畫
