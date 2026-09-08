# 翰林視覺套版平台 Hanlin Visual Kits

讓 AI 生成的網頁延續翰林品牌 DNA 的視覺套版平台。純靜態網站，不需要建置流程。

## 頁面

| 頁面 | 說明 |
|---|---|
| `index.html` | 首頁，快速選擇視覺套版 |
| `templates.html` | 視覺套版列表，含風格與網站類型兩排篩選 |
| `template.html?kit=<id>` | 套版詳細：範本頁、品牌識別、介面套用、版面規範 |
| `ai.html` | AI 指令：把規範交給 AI 的三步引導與可複製指令 |
| `basic.html` | 基本規範 |
| `import.html` | 匯入既有頁面並套版 |

## 資料來源

各組套版的色票、圓角、陰影、字體規格都寫在 `kits.js`，來源規範文件記在每一組的 `src` 欄位。

## 規範封包

在套版詳細走完勾選後可下載 zip，內含：

- `SKILL.md` — 規範本體，含採用設定，直接交給 AI
- `tokens.css` — 可引用的 CSS 變數
- `theme.json` — 採用設定的原始資料

產生邏輯在 `skillpack.js`，套版詳細與 AI 指令頁共用同一份。
