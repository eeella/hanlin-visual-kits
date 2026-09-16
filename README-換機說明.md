# 翰林視覺套版平台 — 換機使用說明

## 怎麼跑起來
這是純靜態站，但**必須用 http 開，不能直接雙擊 html**
（範本頁縮圖是 iframe，採用設定用 localStorage，file:// 會被瀏覽器擋掉）。

解壓縮後在資料夾裡：

    python3 -m http.server 8765

然後開 http://127.0.0.1:8765/

## 頁面
| 檔案 | 是什麼 |
|---|---|
| `index.html` | 首頁。Hero ＋ 前 6 組套版 ＋ CTA |
| `templates.html` | 視覺套版列表。風格／網站類型兩排篩選 ＋ 全部 15 組 |
| `template.html` | 套版詳細（`?kit=<id>`）。**同時是規範細節**：色彩系統／品牌識別／介面元件／版面規範／AI 指令 |
| `demo.html` | 通用套版範本（`?kit=<id>`），沒有指定 demoFile 的組會用它 |
| `import.html` | 匯入既有頁面並套版 |
| `preview.html` | 版型預覽（依採用設定） |
| `demo/` | 各組實際套好的範本頁 |

`brand.html` 已整併進 `template.html`，不再存在。

## 改資料的規矩（重要）
**色版資料的唯一編寫處是 `template.html` 裡的 `var PALETTES`。**
改完一定要重跑產生器，否則 `kits.js` 會落後：

    python3 build-kits.py          # 產生 kits.js，並同步各頁的破快取版本
    python3 build-kits.py --check  # 只檢查有沒有落後（CI 用）

新增一組套版時，`build-kits.py` 裡的 `IDS`（英文代號）與 `CATS`（風格分類）
兩張對照表也要補上該組的中文名，否則 id 會變成 `kit1` 這種序號。

套用引擎同理，唯一編寫處是 `import.html`：

    python3 build-engine.py        # 產生 engine.js
    python3 build-engine.py --check

## Git 線上位置
- Repo：https://github.com/eeella/hanlin-visual-kits（分支 `main`，repo 根目錄＝本資料夾 `翰林視覺套版平台/翰林視覺套版平台/`）
- 線上網址（GitHub Pages）：https://eeella.github.io/hanlin-visual-kits/
- 本資料夾不是 git 版本庫；發布方式＝把這裡的檔案同步到 repo 後 push（不含 `_archive`、`_backup`、`bak-archive`、`_dev`、`*.bak-*`）。

## 幫某一組套一份現成頁面
把要套的 html 放進資料夾，然後：

    http://127.0.0.1:8765/_apply-runner.html?src=<檔名>&kit=<套版id>

這支只給無頭瀏覽器用，畫面上的 textarea 就是套好的完整 HTML，
存進 `demo/` 之後在 PALETTES 該組加一行 `demoFile:'demo/xxx.html'` 即可。

## 目前 15 組的 id
hanlin / musical / istockapp / navy / spike / dopamine / moroccan / dawho /
mustard / pine / clash / avocado / trail / neon / douclass / gov
