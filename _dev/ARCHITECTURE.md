# 翰林視覺套版平台 — 架構與資料流

寫作時間 2026-09-09。目的是讓下一次接手的人不必再從 68 萬字元的 `import.html` 逆推。
只記「從程式碼看不出來、或看錯會付代價」的部分；規範內容一律看 `STYLEGUIDE.md`。

## 1. 建置關係：哪些檔案是產物，不可手改

```
template.html                import.html                    （資料夾全部）
  var PALETTES                 function brandifyHtml           |
      |                              |                         |
      | _dev/build-kits.py           | _dev/build-engine.py    | _dev/build-starter.py
      v                              v                         v
   kits.js  ──────┐            engine.js  ──────┐        hanlin-web-starter.zip
   （15 組色盤）  │            （套用引擎）      │
                  │                              │
   消費端 8 頁     │            消費端 2 頁       │
   index/templates│            preview.html      │
   template/demo  │            selfcheck.html    │
   import/ai      │                              │
   brand/selfcheck│                              │
                  v                              v
        defaults.js（手寫，非產物）── 消費端 7 頁
          預設組合的單一真相源；?v 由 _dev/build-bust.py 同步
```

**唯一的編寫處是左邊那一欄。** `engine.js` 與 `kits.js` 開頭都寫著「請勿手改」，
改了會在下一次建置被無聲覆蓋。三支腳本都有 `--check`（CI 用，落後就 exit 1）：

```
python3 _dev/build-engine.py --check   # engine.js 是否落後於 import.html
python3 _dev/build-kits.py   --check   # kits.js 是否落後於 template.html
python3 _dev/build-bust.py   --check   # 手寫資產（defaults.js）的 ?v 是否過期
```

### 為什麼引擎要抽成產物
`preview.html` 以前自帶第二份引擎。兩份漸漸分岔到「同一批 27 份樣本、數字全不一致」，
所以改成 `import.html` 是唯一編寫處、`preview.html` 只消費 `engine.js`。
`preview.html` 內還留著舊引擎的殘骸註解，但**已不再當備援**（那份會算錯）。

### 破快取版本號（`?v=`）是功能的一部分，不是裝飾
三支腳本都會把消費端的 `?v=指紋` 一起改掉。少了這一步的實際代價：
內容換了但網址沒換 → 瀏覽器繼續吃快取 → 修好的東西在使用者機器上等於沒發生。
2026-09-09 實測踩到三種變體，都已修：
- 消費端清單寫死 → 漏掉 `import/ai/brand`，`kits.js?v` 停在四個版本前
- `defaults.js` 沒有任何腳本負責 → `?v` 停在 `d0777c2d097c`（實際 `16974f4afe52`）
- `selfcheck.html` 根本沒寫 `?v` → 永遠吃快取
現在三支腳本都「錨在行首的 `<script>` 標籤」做取代，缺 `?v` 會補上，
而且不會誤改 JS 字串裡的說明文字（`'請確認 <script src="engine.js"> 有載到'`）。

## 2. 頁面流程與 storage 資料流

沒有後端，跨頁狀態全靠 `localStorage`／`sessionStorage`，鍵一律 `hanlin-` 前綴。

| 鍵 | 寫入方 | 讀取方 | 意義 |
|---|---|---|---|
| `hanlin-brand-theme` | index, templates, template, import, defaults.js | 同左 + preview | 目前採用的品牌組合（色盤／字體／版型） |
| `hanlin-handoff` | 幾乎每一頁 | 幾乎每一頁 | 頁間交棒的當前狀態 |
| `hanlin-import-html` | import | templates, template, preview, defaults.js | 使用者匯入的原始 HTML |
| `hanlin-import-opts` | import | import, preview | 套用項目勾選（colors/font/icon/logo/semantic＋tone＋layoutMode） |
| `hanlin-import-styled` | index, templates, template | import | 「使用者已經挑過某一組套版」的旗標 |
| `hanlin-import-live` / `-pending` / `-done` | import | template, import, defaults.js | 匯入流程的階段狀態 |
| `hanlin-skill-blocks` | preview | preview | 產出的技能區塊 |
| `hanlin-show-result` | templates, template, preview | import | 回到匯入頁時直接展開結果 |

**這裡是歷史 bug 的溫床**，三個已修的都同一型：某一頁少寫一個旗標、或多清一次，
畫面就變成「選了 A 卻出 B」。追流程用 `?hlmon=1`（加一次之後持續有效，開關存在
localStorage），它會攔截所有 `hanlin-*` 的寫入並記下呼叫來源 `@檔名:行號`。

## 3. 套用引擎 `brandifyHtml(html, opts)`

`opts`：`tone`（standard/…）、`colors`/`font`/`icon`/`logo`/`semantic`（布林，對應匯入頁勾選）、
`layoutMode`（`'auto'`（不傳）／`'page'`／`'appshell'`）。

回傳物件的關鍵欄位：`html`、`appShell`、`appShellNoHero`、`layoutMode`、
`checklist`／`checklistMissing`（比對帳本）、`ruleTrace.{writes,overrides}`（規則歸屬）、
`swallowed`（被吞掉的例外）、`comps`／`framework`／`det`。

### 版面型態判定（2026-09-09 大改，這裡最容易再壞）
判定 app shell（側欄＋主工作區的應用型版面）要**同時**成立：

```
IS_APPSHELL = body 自己就是 app shell
            或 (bodyHidden && 有側欄 && 欄數>=2)
            或 (有側欄 && 欄數>=2 && (滿版高度 || 百分比高度 || utility class))
```

三段裡最脆弱的是「有側欄」（`SBEL`）。**所有放寬都掛在它下面**——
2026-09-09 有一輪只放寬了高度與欄數，使用者那邊毫無變化，就是因為側欄選擇器沒動。
現在 `SBEL` 是四段式，順序不可調換：

1. `aside` 或 class 含 `sidebar`/`side-nav`/`sidenav`/`side-bar`/`drawer`（信心最高）
2. **詞界 token** 命中命名白名單（`side`/`left-panel`/`q-list`/`toc`/`thread-list`…）
   且本身像清單。用 token 而不是 `[class*=side]`，否則 `outside`／`beside` 會誤中
3. 結構推斷：分欄容器（CSS 或 class 有 flex/grid）的第一欄，且那一欄在 CSS 裡是
   固定窄寬（≤420px 或 Tailwind `w-\d+`）
4. 不在 header／footer 內、且限成窄欄的 `<nav>`／`role=navigation`

**「窄欄」與「排除選項卡列」兩個條件不可省。** 少了它們，
`<nav class="tabs" role="tablist">`（橫向章節分頁）會被當成側欄——迴歸實測抓到過，
與 2026-08-31「選項卡列被塗成頁首配色」是同一個坑的反面。
`tabLike()` 排除 `role=tablist|menubar|toolbar` 與 class token `tabs`/`tab-bar`/
`breadcrumb`/`pagination`/`segmented`/`pills`。

**整段結構判定掛在「套用項目」的「語意結構」底下，而它預設不勾。**
沒勾的時候不做判定、也不補橫幅，回報必須說「未判定」——不可以拿 `appShell` 的初始值
`false` 去講「一般頁面」，那是把沒發生的判斷講成結論（`res.structRan` 就是為此存在）。

判錯的代價是**整片版面被歡迎橫幅蓋掉**，所以匯入頁一定要保留「版面型態」手動覆寫
（自動／一般頁面／應用型版面），使用者不必等人改判定。自動判定的結果仍會回報，
讓他知道預設是什麼。

### 三本比對帳（缺一就出現假 100%）
元素帳（`body *` 全掃，未比對是預設狀態）／條文帳（`RULEBOOK`，`todo≠0` 不得宣稱全面覆蓋）／
規則歸屬（`data-hl-rule`，分辨「規則沒生效」與「生效後被覆寫」）。
匯出閘門 `exportGate()` 要求 `lastAudit` 存在且 `conclusive`、`fail=0`、`probs=0`；
重新套用會把 `lastAudit` 清成 null 鎖住匯出。

## 4. 診斷工具

| 工具 | 用途 |
|---|---|
| `selfcheck.html` | 拖檔案進去，判斷是「檔案本身的特性」還是「平台的問題」，可複製診斷資料（只含結構與佈局 CSS） |
| 匯入頁「套入資訊」 | 平台怎麼看這份檔案：版面型態／補不補 hero／框架／認出的元件／換掉的色碼／寫入樣式的元素數／被吞掉的例外 |
| `HL_diagnose('frameRaw'\|'frameBranded')` | console 查某一格為什麼是空的 |
| `?hlmon=1` | 全站流程追蹤面板，攔截 `hanlin-*` 寫入並記錄呼叫來源 |

## 5. 環境與常用指令

```
python3 -m http.server 8790          # 專案根目錄；file:// 在 Chrome 151+ 會卡住，一定要用 http
python3 _dev/build-engine.py         # import.html  → engine.js（並同步 ?v）
python3 _dev/build-kits.py           # template.html → kits.js（並同步 ?v）
python3 _dev/build-bust.py           # 手寫資產（defaults.js）的 ?v
python3 _dev/build-starter.py        # 資料夾 → hanlin-web-starter.zip
```

### 驅動匯入頁 UI 做端到端測試的三個前置條件（都踩過）
1. 樣本必須含可辨識的品牌色，否則 `alert('匯入失敗…')` 擋下；CDP 要掛
   `Page.javascriptDialogOpening` 自動接受，不然 `Runtime.evaluate` 永不回應而靜默卡死
2. 要讓右邊真的套版，`hanlin-brand-theme` 的 `theme.n` 必須對得上某一組 kit 的名稱
   （`HL_QUICK_DEFAULT` 的「翰林藍」對不上「翰林學習藍」），否則 `hasPickedKit()` 為 false，
   `clearPrevious()` 會把「已挑樣式」旗標清掉，只顯示對照不套版
3. 「套入資訊」在 `<details>` 裡，收合時 `innerText` 是空的，要 `open=true` 或讀 `textContent`

驗收一律「實際渲染後量測」，不能只看規則有沒有寫進檔案。做法與陷阱見
`headless-cdp-audit` 那份記憶；重點：注入式優於 iframe、別等 `load`、
375px 一定要用 CDP `Emulation.setDeviceMetricsOverride`（`--window-size=375` 會被夾到 500）、
量有 `transition` 的屬性要等動畫跑完、macOS 沒有 `timeout` 指令。
