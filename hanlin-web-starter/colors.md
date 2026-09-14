# 翰林視覺套版 色票封包

抓取日期：2026-09-14　來源：各套版的規範文件（DESIGN／SKILL／STYLEGUIDE .md），`md/` 內附原檔。

「kits.js」欄是平台目前實際套用的色；「md 有」表示這個色碼有出現在規範文件裡。

## 執行準則（2026-09-14 定案）

翰林視覺套版平台的基本套版（`engine.js` SG token、`kits.js` 翰林學習藍、`basic.html`）與本設計系統整合時，**一律以 STYLEGUIDE.md 現值為準**：

| 項目 | 採用值 | 未採用的提案 |
|---|---|---|
| 主色／hover／active | `#064EA4`／`#05407F`／`#03305F`（滑過變深） | `#003DA6`／`#2563EB`／`#1E3D6B` |
| 文字色命名 | `text.primary`＝正文 `#62778F`、`text.secondary`＝標題 `#1E3D60` | tokens 慣例的 primary＝標題 `#1E3D6B` |
| 語意色 | danger `#B3261E`(6.54:1)、success `#146C43`(6.45:1)、warning `#8F4B00`(6.62:1)、info `#064EA4` | `#C7353A`／`#16834A`／`#A84D0D`；UI.md 的 warning `#C56A22` 只有 3.85:1 |
| 圓角 | 按鈕／chip／輸入框 `100px`、卡片 `12px`、大區塊 `20px` | UI.md `radius-md 8px` |
| 字級與字體 | 內文 18px／H1 56px、Kumbh Sans → Noto Sans TC | UI.md 內文 16px、Noto Sans TC |
| 七組深色套版 | `kits.js`（各組原 DESIGN.md）色值 | tokens.css 的淡色重製版（下表） |
| 變數命名 | STYLEGUIDE／engine.js 命名 | UI.md §3.4 `--color-action-primary`、`--color-background-canvas`、theme `hanlin-default` |

`tokens.css` 已依上表改回執行值；下方「統一語意分類」與「深色品牌＋淺色內容色版」兩表保留作提案紀錄，**不是執行值**。


## 統一語意分類（所有色版共用）— 提案，未採用

每個色版只需要提供以下語意欄位；元件不得直接引用色碼。換色版時只替換色版資料，Button、Form、Tabs、Card、Header 等結構與互動保持不變。

| 分類 | Token | 用途 | 翰林學習藍目前值 |
|---|---|---|---|
| 品牌／操作 | `action.primary` | 主要按鈕、連結、選取、Focus | `#003DA6` |
| 品牌／操作 | `action.primary.hover` | Hover／滑入 | `#2563EB` |
| 品牌／操作 | `action.primary.active` | 按下／Active | `#1E3D6B` |
| Surface | `surface.page` | 頁面背景 | `#F4F7FB` |
| Surface | `surface.base` | 卡片、面板、輸入框 | `#FFFFFF` |
| Surface | `surface.subtle` | 次要區塊、停用底 | `#EEF3F8` |
| 文字 | `text.primary` | 標題、主要內容 | `#1E3D6B` |
| 文字 | `text.secondary` | 輔助文字、說明 | `#62778F` |
| 邊框 | `border.default` | 一般分隔線、卡片框 | `#E6EBEC` |
| 邊框 | `border.strong` | 輸入框、Focus 外框輔助 | `#BECAD7` |
| 狀態 | `status.success`／`warning`／`danger` | 成功、提醒、錯誤 | 依色版提供 |
| 裝飾 | `decor.contrast`／`decor.warm` | Hero、插圖、視覺強調 | `#F5D35B`／`#EF9D78` |

> （提案原文，已被上方「執行準則」推翻）此表的 `#003DA6` 未採用；執行值是 `#064EA4`，見 tokens.css。

## 深色品牌＋淺色內容色版 — 提案，未採用

以下色版的深色只用於品牌、主要操作或標題；頁面與卡片維持淺色，並以中間輔助色銜接，避免整頁過重。

| 色版 | Theme | 深色品牌／操作 | 中間輔助色 | 內容底色 |
|---|---|---|---|---|
| 午夜金融藍 | `midnight-finance-blue` | `#123B73` | `#8FB7E8` | `#F3F7FC` |
| 芥黃刊物 | `mustard-publication` | `#806000` | `#B7795A` | `#FCFAF4` |
| 墨綠聖誕 | `forest-christmas` | `#1F5B4A` | `#C96F5B` | `#F2F8F5` |
| 酪梨青檸 | `avocado-lime` | `#4E6B2C` | `#D79B55` | `#F6FAF0` |
| 學堂紫 | `academy-purple` | `#5A4A8A` | `#C887A6` | `#F7F5FC` |
| 公務金黃 | `public-gold` | `#765B12` | `#B88356` | `#FCFAF2` |
| 藍夜霓虹 | `blue-night-neon` | `#163B66` | `#FF7AD9` | `#F1F7FF` |

## 翰林學習藍（hanlin）
來源 `STYLEGUIDE.md`　路徑 `翰林視覺套版平台/STYLEGUIDE.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#064EA4` | ✓ |
| 輔色 | `#05407F` | ✓ |
| 亮色／區塊底 | `#BECAD7` | ✓ |
| 對比色 | `#F5D35B` | ✓ |
| 頁面底 | `#F4F7FB` | ✓ |
| 主要文字 | `#1E3D60` | ✓ |
| 次要文字 | `#62778F` | ✓ |
| 分隔線 | `#EEF2F7` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.surface.strong` | `#064EA4` | 主要按鈕、連結、焦點框、徽章文字 |
| `color.action.bg.hover` | `#05407F` | 主要按鈕 hover |
| `color.action.bg.active` | `#03305F` | 主要按鈕按下 |
| `color.surface.muted` | `#FFFFFF` | Neutral 0 |
| `color.page.bg.subtle` | `#F4F7FB` | **Neutral 200** |
| `color.disabled.bg` | `#EEF2F7` | — |
| `color.text.tertiary` | `#BECAD7` | — |
| `color.text.primary` | `#62778F` | — |
| `color.text.secondary` | `#1E3D60` | — |
| `color.surface.base` | `#000000` | — |
| `color.decor.sun` | `#F5D35B` | 僅限裝飾形狀 |
| `color.decor.warm` | `#EF9D78` | 僅限裝飾形狀 |
| `color.danger` | `#B3261E` | 錯誤訊息與邊框 |
| `color.danger.bg` | `#FDF1F0` | 錯誤訊息底色 |
| `color.success` | `#146C43` | 成功訊息 |
| `color.brand.ink` | `#040000` | 僅供品牌標誌文字 |

全部色碼（16）：#000000 #03305F #040000 #05407F #064EA4 #146C43 #1E3D60 #62778F #B3261E #BECAD7 #EEF2F7 #EF9D78 #F4F7FB #F5D35B #FDF1F0 #FFFFFF

## 清新小森林（musical）
來源 `Musical-DESIGN.md`　路徑 `資料/測試/規範產出/Musical-DESIGN.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#268270` | ✓ |
| 輔色 | `#314D4A` | ✓ |
| 亮色／區塊底 | `#FDEEBF` | ✓ |
| 對比色 | `#F3A93A` | ✓ |
| 頁面底 | `#FDEEBF` | ✓ |
| 主要文字 | `#314D4A` | ✓ |
| 次要文字 | `#454545` | ✓ |
| 分隔線 | `—` | — |

| token | 色碼 | 用途 |
|---|---|---|
| `color.text.primary` | `#314D4A` |  |
| `color.text.secondary` | `#454545` |  |
| `color.text.tertiary` | `#FFFFFF` |  |
| `color.text.inverse` | `#F3A93A` |  |
| `color.surface.base` | `#000000` |  |
| `color.surface.muted` | `#FDEEBF` |  |
| `color.surface.strong` | `#268270` |  |

全部色碼（7）：#000000 #268270 #314D4A #454545 #F3A93A #FDEEBF #FFFFFF

## 漫畫貼紙風（istockapp）
來源 `istockapp-SKILL.md`　路徑 `資料/測試/規範產出/md/istockapp-SKILL.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#2C89D8` | ✓ |
| 輔色 | `#08284C` | ✓ |
| 亮色／區塊底 | `#04FDBC` | ✓ |
| 對比色 | `#FF5933` | ✓ |
| 頁面底 | `—` | — |
| 主要文字 | `#08284C` | ✓ |
| 次要文字 | `#333333` | ✓ |
| 分隔線 | `—` | — |

| token | 色碼 | 用途 |
|---|---|---|
| `color.surface.base` | `#000000` |  |
| `color.text.secondary` | `#04FDBC` |  |
| `color.text.tertiary` | `#FFFFFF` |  |
| `color.text.inverse` | `#333333` |  |
| `color.surface.raised` | `#2C89D8` |  |
| `color.surface.strong` | `#FF5933` |  |
| `color.border.strong` | `#08284C` |  |

全部色碼（7）：#000000 #04FDBC #08284C #2C89D8 #333333 #FF5933 #FFFFFF

## 復古文青風（navy）
來源 `navy-ivory-gold-DESIGN.md`　路徑 `資料/測試/規範產出/md/navy-ivory-gold-DESIGN.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#0E2A48` | ✓ |
| 輔色 | `#021B39` | ✓ |
| 亮色／區塊底 | `#F7F0E8` | ✓ |
| 對比色 | `#F4A910` | ✓ |
| 頁面底 | `#F7F0E8` | ✓ |
| 主要文字 | `#0E2A48` | ✓ |
| 次要文字 | `#6B6455` | ✓ |
| 分隔線 | `#ECE5DA` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.navy` | `#0E2A48` | メインカラー |
| `color.navy.deep` | `#021B39` | — |
| `color.navy.soft` | `#153252` | — |
| `color.ivory` | `#F7F0E8` | ベースカラー |
| `color.sand` | `#DED5C6` | — |
| `color.gold` | `#F4A910` | アクセントカラー |
| `color.white` | `#FFFFFF` | — |
| `color.gold.deep` | `#8A5A00` | gold 加深 |
| `color.gold.soft` | `#F7ECD8` | gold 淺色階 |
| `color.stone` | `#6B6455` | sand 加深 |
| `color.line` | `#DED5C6` | = sand |
| `color.line.soft` | `#ECE5DA` | sand 淺化 |
| `color.info` | `#E8EEF4` | navy 極淺色階 |
| `color.ok` | `#3F6B52` | 低彩度綠 |
| `color.ok.soft` | `#E6ECE7` | ok 淺色階 |
| `color.warn` | `#8A5A00` | = gold.deep |
| `color.warn.soft` | `#F7ECD8` | = gold.soft |
| `color.danger` | `#8C3A2E` | 低彩度磚紅 |
| `color.danger.soft` | `#F3E3DF` | danger 淺色階 |

全部色碼（19）：#021B39 #0E2A48 #153252 #173A5E #3F6B52 #6B6455 #8A5A00 #8C3A2E #DD9600 #DED5C6 #E6ECE7 #E8EEF4 #ECE5DA #F3E3DF #F4A910 #F7ECD8 #F7F0E8 #FFB929 #FFFFFF

## 多巴胺潮風（dopamine）
來源 `DESIGN-dopamine.md`　路徑 `資料/測試/規範產出/md/DESIGN-dopamine.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#171315` | ✓ |
| 輔色 | `#5B4FA8` | ✓ |
| 亮色／區塊底 | `#FBE472` | ✓ |
| 對比色 | `#F2BBDB` | ✓ |
| 頁面底 | `#FBF5E9` | ✓ |
| 主要文字 | `#171315` | ✓ |
| 次要文字 | `#6B645F` | ✓ |
| 分隔線 | `#E6DFD3` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.ink` | `#171315` | Near-black. Text, nav, primary action, footer |
| `color.surface.base` | `#FBF5E9` | Cream. Page ground |
| `color.surface.card` | `#FFFFFF` | Card ground |
| `color.surface.muted` | `#EEECFB` | Quiet section ground |
| `color.surface.strong` | `#FBE472` | Hero / feature block |
| `color.accent.yellow` | `#FBE472` | Hero block, current state, hover flip |
| `color.accent.pink` | `#F2BBDB` | Cards, CTA blocks |
| `color.accent.coral` | `#FD9D9E` | Secondary action, alert decoration |
| `color.accent.mint` | `#BAE3DF` | Cards, success semantics |
| `color.accent.lilac` | `#C5C0F0` | Cards, AI / smart features |
| `color.accent.sage` | `#C6CDA1` | Reserve hue |
| `color.accent.yellow.soft` | `#FEF8DC` | yellow tint |
| `color.accent.pink.soft` | `#FCEBF4` | pink tint |
| `color.accent.coral.soft` | `#FFE5E5` | coral tint |
| `color.accent.mint.soft` | `#E4F4F2` | mint tint |
| `color.accent.lilac.soft` | `#EEECFB` | lilac tint |
| `color.line` | `#E6DFD3` | cream, darkened |
| `color.text.primary` | `#171315` | ink |
| `color.text.secondary` | `#6B645F` | ink, lightened |
| `color.text.inverse` | `#FBF5E9` | cream |
| `color.text.onAccent` | `#171315` | ink |
| `color.danger` | `#C0392B` | low-chroma brick |
| `color.success` | `#1E6F50` | low-chroma green |
| `color.warn` | `#8A5A00` | deepened warm |
| `color.info` | `#5B4FA8` | deepened lilac |

全部色碼（20）：#171315 #1E6F50 #5B4FA8 #6B645F #8A5A00 #BAE3DF #C0392B #C5C0F0 #C6CDA1 #E4F4F2 #E6DFD3 #EEECFB #F2BBDB #FBE472 #FBF5E9 #FCEBF4 #FD9D9E #FEF8DC #FFE5E5 #FFFFFF

## 摩洛哥風情（moroccan）
來源 `摩洛哥-DESIGN.md`　路徑 `資料/測試/規範產出/md/摩洛哥-DESIGN.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#0C3B2E` | ✓ |
| 輔色 | `#072A20` | ✓ |
| 亮色／區塊底 | `#6D9773` | ✓ |
| 對比色 | `#FFBA00` | ✓ |
| 頁面底 | `#EDEFEA` | ✓ |
| 主要文字 | `#0C3B2E` | ✓ |
| 次要文字 | `#5C6B60` | ✓ |
| 分隔線 | `#DCE6DD` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.forest` | `#0C3B2E` | 深墨綠。Hero／Footer／標題文字／當前位置／強調卡 |
| `color.sage` | `#6D9773` | 鼠尾草綠。**僅色塊與裝飾，不可承載小字** |
| `color.camel` | `#BB8A52` | 焦糖。**僅色塊與裝飾，不可承載小字** |
| `color.amber` | `#FFBA00` | 琥珀黃。主要動作／CTA 區塊／深色底上的強調 |
| `color.forest.deep` | `#072A20` | forest 加深 |
| `color.forest.mid` | `#3D6B52` | forest 提亮 |
| `color.paper` | `#EDEFEA` | sage 極淺色階 |
| `color.sage.soft` | `#E4EAE3` | sage 淺色階 |
| `color.camel.soft` | `#F5EDE0` | camel 淺色階 |
| `color.amber.soft` | `#FFF4D6` | amber 淺色階 |
| `color.amber.deep` | `#8A5A00` | amber 加深 |
| `color.camel.deep` | `#8A6534` | camel 加深 |
| `color.line` | `#DCE6DD` | sage 淺化 |
| `color.muted` | `#5C6B60` | forest 淺化 |
| `color.ok` | `#1E6F50` | 低彩度綠 |
| `color.warn` | `#8A5A00` | = amber.deep |
| `color.danger` | `#B3261E` | 低彩度紅 |

全部色碼（16）：#072A20 #0C3B2E #1E6F50 #3D6B52 #5C6B60 #6D9773 #8A5A00 #8A6534 #B3261E #BB8A52 #DCE6DD #E4EAE3 #EDEFEA #F5EDE0 #FFBA00 #FFF4D6

## 午夜金融藍（dawho）
來源 `dawho-DESIGN.md`　路徑 `資料/dawho-DESIGN.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#0094DF` | ✓ |
| 輔色 | `#000000` | ✓ |
| 亮色／區塊底 | `#2DB6FB` | ✓ |
| 對比色 | `#FF9F1C` | ✗ |
| 頁面底 | `#E5F6FF` | ✓ |
| 主要文字 | `#06283A` | ✗ |
| 次要文字 | `#5A7080` | ✗ |
| 分隔線 | `#B8E7FF` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.text.primary` | `#FFFFFF` |  |
| `color.surface.base` | `#000000` |  |
| `color.text.tertiary` | `#0094DF` |  |
| `color.text.inverse` | `#2DB6FB` |  |
| `color.surface.raised` | `#B8E7FF` |  |
| `color.surface.strong` | `#E5F6FF` |  |

全部色碼（6）：#000000 #0094DF #2DB6FB #B8E7FF #E5F6FF #FFFFFF

## 芥黃刊物（mustard）
來源 `芥黃刊物-DESIGN.md`　路徑 `資料/測試/規範產出/芥黃刊物-DESIGN.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#2C1D18` | ✓ |
| 輔色 | `#1C1616` | ✓ |
| 亮色／區塊底 | `#E0C4C0` | ✓ |
| 對比色 | `#EEC66F` | ✓ |
| 頁面底 | `#E7D4C3` | ✓ |
| 主要文字 | `#2C1D18` | ✓ |
| 次要文字 | `#5B4B43` | ✓ |
| 分隔線 | `#C5B3A4` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.paper` | `#E7D4C3` | 頁面底。米色紙感 |
| `color.mustard` | `#EEC66F` | 主要強調。專題區塊底 |
| `color.espresso` | `#2C1D18` | 主要文字、頁首 |
| `color.charcoal` | `#1C1616` | 極深階。影像壓底、頁尾 |
| `color.blush` | `#E0C4C0` | 次級區塊底 |
| `color.lilac` | `#BD9FC3` | 欄位分隔 |
| `color.taupe` | `#A89586` | 次要文字、細線 |
| `color.sage` | `#78A58E` | 欄位分隔 |

全部色碼（16）：#000000 #1A6045 #1C1616 #2C1D18 #5B4B43 #754C00 #78A58E #9B2E23 #A89586 #BD9FC3 #C5B3A4 #E0C4C0 #E7D4C3 #EEC66F #F3E9E0 #FFFFFF

## 墨綠聖誕（pine）
來源 `墨綠聖誕-DESIGN.md`　路徑 `資料/測試/規範產出/墨綠聖誕-DESIGN.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#183A22` | ✓ |
| 輔色 | `#142C15` | ✓ |
| 亮色／區塊底 | `#4D692D` | ✓ |
| 對比色 | `#E3C874` | ✓ |
| 頁面底 | `#183A22` | ✓ |
| 主要文字 | `#ECF3E4` | ✓ |
| 次要文字 | `#D7E1D1` | ✓ |
| 分隔線 | `#3E5B45` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.pine` | `#183A22` | 頁面底。深墨綠 |
| `color.moss` | `#4D692D` | 次級底、卡片 |
| `color.gold` | `#E3C874` | 主要強調。標題、金額、focus 外框 |
| `color.spruce` | `#142C15` | 最深階。頁尾、浮層 |
| `color.snow` | `#ECF3E4` | 主要文字 |
| `color.amber` | `#FF9831` | 側欄標籤、次要按鈕底 |
| `color.berry` | `#ED5A5A` | 促銷徽章底 |

全部色碼（17）：#000000 #111111 #142C15 #183A22 #304761 #39522A #3E5B45 #4D692D #C6E6C8 #D7E1D1 #E3C874 #ECF3E4 #ED5A5A #EEDDA8 #FAD6D6 #FF9831 #FFFFFF

## 撞色旅途（clash）
來源 `撞色旅途-DESIGN.md`　路徑 `資料/測試/規範產出/撞色旅途-DESIGN.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#000000` | ✓ |
| 輔色 | `#F1DABB` | ✓ |
| 亮色／區塊底 | `#F39C80` | ✓ |
| 對比色 | `#FDF032` | ✓ |
| 頁面底 | `#FFFFFF` | ✓ |
| 主要文字 | `#000000` | ✓ |
| 次要文字 | `#595959` | ✓ |
| 分隔線 | `#D1D1D1` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.white` | `#FFFFFF` | 頁面底、商品卡底 |
| `color.coral` | `#F39C80` | 分區底 |
| `color.aqua` | `#52C4DF` | 分區底 |
| `color.rose` | `#EF9CB0` | 分區底 |
| `color.lemon` | `#FDF032` | 分區底、促銷帶 |
| `color.ink` | `#000000` | 線稿、標題、價格 |
| `color.sand` | `#F1DABB` | 柔和區塊底 |
| `color.azure` | `#00A0FE` | 連結色塊、資訊標籤 |

全部色碼（14）：#000000 #00A0FE #039F6F #1E6D4F #52C4DF #595959 #845600 #AF3427 #D1D1D1 #EF9CB0 #F1DABB #F39C80 #FDF032 #FFFFFF

## 酪梨青檸（avocado）
來源 `酪梨青檸-DESIGN.md`　路徑 `資料/測試/規範產出/酪梨青檸-DESIGN.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#4E4736` | ✓ |
| 輔色 | `#000000` | ✓ |
| 亮色／區塊底 | `#D5CB86` | ✓ |
| 對比色 | `#FF5E03` | ✓ |
| 頁面底 | `#CDDEB2` | ✓ |
| 主要文字 | `#4E4736` | ✓ |
| 次要文字 | `#544F3C` | ✓ |
| 分隔線 | `#B6C39C` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.avocado` | `#CDDEB2` | 頁面底。酪梨綠 |
| `color.khaki` | `#D5CB86` | 次級區塊底、影片牆 |
| `color.bark` | `#4E4736` | 主要文字 |
| `color.vermilion` | `#FF5E03` | 標題強調、CTA 色塊 |
| `color.ink` | `#000000` | 線稿、極重標題 |
| `color.moss` | `#919777` | 次要文字、分隔 |
| `color.mint` | `#98DEBB` | 分區色塊 |
| `color.pale` | `#E6EFD9` | 卡片底 |

全部色碼（16）：#000000 #1A5E44 #36BF6A #4E4736 #544F3C #68CEB9 #734B00 #919777 #982D22 #98DEBB #B6C39C #CDDEB2 #D5CB86 #E6EFD9 #FF5E03 #FFFFFF

## 林蔭野趣（trail）
來源 `林蔭野趣-DESIGN.md`　路徑 `資料/測試/規範產出/林蔭野趣-DESIGN.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#0F3A38` | ✓ |
| 輔色 | `#8AAE4C` | ✓ |
| 亮色／區塊底 | `#C0DFD5` | ✓ |
| 對比色 | `#DEAF5F` | ✓ |
| 頁面底 | `#FEFEDE` | ✓ |
| 主要文字 | `#0F3A38` | ✓ |
| 次要文字 | `#3F6159` | ✓ |
| 分隔線 | `#D3DBC0` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.cream` | `#FEFEDE` | 頁面底。米黃 |
| `color.mint` | `#C0DFD5` | 次級區塊底。薄荷，用來切分章節 |
| `color.lemon` | `#E8E6AD` | 第三層區塊底 |
| `color.forest` | `#0F3A38` | 主要文字、頁首深色帶 |
| `color.sage` | `#618C81` | 次要文字、圖說 |
| `color.gold` | `#DEAF5F` | 標籤、按鈕底 |
| `color.grass` | `#8AAE4C` | 分區標籤 |
| `color.sky` | `#5AB6FE` | 分區標籤、連結色塊 |
| `color.apricot` | `#D58147` | 秋季分區標籤 |
| `color.brick` | `#D16544` | 強調數字底 |

全部色碼（18）：#000000 #0F3A38 #1C684B #3F6159 #5AB6FE #618C81 #805300 #829344 #8AAE4C #A93226 #C0DFD5 #D16544 #D3DBC0 #D58147 #DEAF5F #E8E6AD #FEFEDE #FFFFFF

## 藍夜霓虹（neon）
來源 `藍夜霓虹-DESIGN.md`　路徑 `資料/測試/規範產出/藍夜霓虹-DESIGN.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#1F2969` | ✓ |
| 輔色 | `#151C4A` | ✓ |
| 亮色／區塊底 | `#16B5D5` | ✓ |
| 對比色 | `#FAD852` | ✓ |
| 頁面底 | `#1F2969` | ✓ |
| 主要文字 | `#FFFFFF` | ✓ |
| 次要文字 | `#A5A9C3` | ✓ |
| 分隔線 | `#475084` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.navy` | `#1F2969` | 頁面底。深藍紫 |
| `color.cyan` | `#16B5D5` | 次級橫幅、資訊區塊 |
| `color.white` | `#FFFFFF` | 主要文字、反白區塊 |
| `color.yellow` | `#FFCC10` | 重點數字、當前狀態、focus 外框 |
| `color.magenta` | `#FB2381` | 裝飾色塊（不可承載文字） |
| `color.red` | `#EC0000` | 促銷徽章底 |
| `color.gold` | `#F5B715` | 次級強調、標籤底 |
| `color.crimson` | `#CA3843` | 頁籤列、次級促銷底 |
| `color.orange` | `#FF6920` | 裝飾形狀、次要標籤 |
| `color.blue` | `#008FCC` | 連結色塊 |

全部色碼（22）：#000000 #008FCC #111111 #151C4A #16B5D5 #1F2969 #2A3480 #475084 #7BC47F #85D13E #A5A9C3 #CA3843 #DD1F72 #E3C874 #EC0000 #F28C8C #F5B715 #FAD852 #FB2381 #FF6920 #FFCC10 #FFFFFF

## 學堂紫（douclass）
來源 `douclass-DESIGN-規範.md`　路徑 `資料/測試/規範產出/douclass-DESIGN-規範.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#7747B5` | ✓ |
| 輔色 | `#333333` | ✓ |
| 亮色／區塊底 | `#DED3ED` | ✓ |
| 對比色 | `#E8A33D` | ✗ |
| 頁面底 | `#F7F4FB` | ✓ |
| 主要文字 | `#333333` | ✓ |
| 次要文字 | `#666666` | ✓ |
| 分隔線 | `#E0E0E0` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.surface.base` | `#000000` |  |
| `color.text.primary` | `#666666` | 5.74:1 |
| `color.text.secondary` | `#333333` | 12.63:1 |
| `color.text.tertiary` | `#9499A6` | 6.62:1 |
| `color.surface.muted` | `#FFFFFF` | 18.88:1 |
| `color.surface.raised` | `#F6F6F6` | 17.47:1 |
| `color.surface.strong` | `#7747B5` | 6.26:1 |
| `頁面底` | `#FFFFFF` | 原規範 token |
| `卡片底` | `#F7F4FB` | **預覽推導，非原規範** |
| `主色` | `#7747B5` | 原規範 token |
| `深色` | `#333333` | 原規範 token |
| `次要文字` | `#666666` | 原規範 token |
| `color.soft` | `#EFE9F6` | 主色混入頁面底 88% |
| `color.soft2` | `#DED3ED` | 主色混入頁面底 76% |
| `color.mid` | `#B49AD6` | 主色混入頁面底 45% |
| `color.line` | `#E0E0E0` | 深色混入頁面底 85% |

全部色碼（13）：#000000 #111111 #333333 #666666 #7747B5 #9499A6 #B49AD6 #DED3ED #E0E0E0 #EFE9F6 #F6F6F6 #F7F4FB #FFFFFF

## 公務金黃（gov）
來源 `gov-DESIGN-規範.md`　路徑 `資料/測試/規範產出/gov-DESIGN-規範.md`

| 用途 | kits.js | md 有 |
|---|---|---|
| 主色 | `#C04C08` | ✓ |
| 輔色 | `#3B2117` | ✓ |
| 亮色／區塊底 | `#FFDF9F` | ✓ |
| 對比色 | `#FFC551` | ✓ |
| 頁面底 | `#FFF8EA` | ✓ |
| 主要文字 | `#3B2117` | ✓ |
| 次要文字 | `#6B4632` | ✓ |
| 分隔線 | `#E2DEDC` | ✓ |

| token | 色碼 | 用途 |
|---|---|---|
| `color.surface.base` | `#000000` |  |
| `color.text.primary` | `#6B4632` | 8.24:1 |
| `color.text.secondary` | `#3B2117` | 14.83:1 |
| `color.text.tertiary` | `#C04C08` | 4.91:1 |
| `color.text.inverse` | `#FFFFFF` | 18.88:1 |
| `color.surface.raised` | `#AAA39B` | 7.57:1 |
| `color.surface.strong` | `#FFC551` | 12.01:1 |
| `頁面底` | `#FFFFFF` | 原規範 token |
| `卡片底` | `#FFFCF5` | **預覽推導，非原規範** |
| `主色` | `#FFC551` | 原規範 token |
| `深色` | `#3B2117` | 原規範 token |
| `次要文字` | `#C04C08` | 原規範 token |
| `color.soft` | `#FFF8EA` | 主色混入頁面底 88% |
| `color.soft2` | `#FFF1D5` | 主色混入頁面底 76% |
| `color.mid` | `#FFDF9F` | 主色混入頁面底 45% |
| `color.line` | `#E2DEDC` | 深色混入頁面底 85% |

全部色碼（13）：#000000 #111111 #3B2117 #6B4632 #AAA39B #C04C08 #E2DEDC #FFC551 #FFDF9F #FFF1D5 #FFF8EA #FFFCF5 #FFFFFF
