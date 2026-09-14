# Hanlin UI Development Rules

> 本文件是翰林 Web 產品的 UI 開發契約。  
> 適用對象：產品設計師、前端工程師、QA、外包團隊與 AI Coding Agent。  
> 規範強度：`MUST` 必須、`SHOULD` 建議、`MAY` 可選。

---

## 1. 核心原則

1. 所有產品共用相同的基礎元件、互動行為與可及性規則。
2. 各產品只能透過語意化 Design Tokens 調整品牌色彩與視覺主題。
3. 不得因國小、國中、高中、技高、教師端或學生端而複製 Button、Input、Modal 等基礎元件。
4. 教材篩選、課次選擇、AI 產生與命題流程屬於「教育產品模式（Patterns）」，不是 Theme。
5. 優先使用原生 HTML 語意；只有原生元素不足時才補充 ARIA。
6. 所有 Stable 元件 MUST 通過 WCAG 2.2 AA、鍵盤與自動化測試。
7. 企劃套用元件時 MUST 使用受控欄位，不得直接修改元件結構、定位與核心樣式。
8. 防破版是元件與內容模型的共同責任，不得只依靠企劃自行縮短文字。

---

## 2. 套件與目錄

建議套件：

```text
@hanlin/tokens       Design Tokens 與 CSS Variables
@hanlin/icons        統一圖示
@hanlin/ui           基礎與組合元件
@hanlin/patterns     教育產品模式
@hanlin/themes       各產品語意主題
```

建議原始碼：

```text
src/
├─ foundations/
├─ components/
│  ├─ Button/
│  ├─ FormField/
│  ├─ Select/
│  ├─ Tabs/
│  ├─ Card/
│  └─ Dialog/
├─ patterns/
│  ├─ MaterialFilter/
│  ├─ LessonSelector/
│  ├─ AiGeneration/
│  └─ QuestionWorkflow/
├─ themes/
├─ hooks/
└─ utils/
```

每個元件資料夾 SHOULD 包含：

```text
Component.tsx
Component.types.ts
Component.css
Component.stories.tsx
Component.test.tsx
Component.a11y.test.tsx
README.md
```

---

## 3. Design Tokens

### 3.1 Token 分層

```text
Primitive → Semantic → Component
```

- Primitive：原始數值，例如 `blue.600`、`space.4`。
- Semantic：介面用途，例如 `action.primary`、`text.muted`。
- Component：元件局部用途，例如 `button.primary.background`。

元件 MUST 使用 Semantic 或 Component Token，不可直接引用產品色碼。

### 3.2 Token 命名

```text
color.background.canvas
color.background.surface
color.background.subtle
color.text.primary
color.text.secondary
color.text.inverse
color.border.default
color.border.strong
color.action.primary
color.action.primaryHover
color.action.secondary
color.status.success
color.status.warning
color.status.danger
color.focus.ring

space.0
space.1
space.2
space.3
space.4
space.6
space.8
space.12
space.16

radius.sm
radius.md
radius.lg
radius.pill

shadow.none
shadow.low
shadow.medium
shadow.high
```

### 3.3 基準值

```css
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 999px;

  --font-size-caption: 0.875rem;
  --font-size-body: 1rem;
  --font-size-body-lg: 1.125rem;
  --font-size-title-sm: 1.25rem;
  --font-size-title-md: 1.5rem;
  --font-size-title-lg: 2rem;

  --motion-fast: 120ms;
  --motion-normal: 200ms;
  --motion-slow: 320ms;
}
```

### 3.4 預設翰林主題

> 2026-09-14 定案：數值以 STYLEGUIDE.md 為準，變數名沿用 `tokens.css`（`--color-action-bg` 等）；本節先前的 `--color-action-primary`／`hanlin-default` 命名與 `#003DA6` 色值已廢止。

```css
:root, [data-theme="hanlin-blue"] {
  --color-page-bg: #F4F7FB;
  --color-surface: #FFFFFF;
  --color-disabled-bg: #EEF2F7;
  --color-text-primary: #62778F;    /* 正文（STYLEGUIDE 命名） */
  --color-text-secondary: #1E3D60;  /* 標題 */
  --color-text-tertiary: #BECAD7;
  --color-border: #BECAD7;
  --color-border-strong: #7690A8;
  --color-action-bg: #064EA4;
  --color-action-bg-hover: #05407F;
  --color-action-bg-active: #03305F;
  --color-decor-contrast: #F5D35B;
  --color-decor-warm: #EF9D78;
  --color-success: #146C43;
  --color-warning: #8F4B00;
  --color-danger: #B3261E;
  --color-focus: #064EA4;
}
```

Theme MAY 覆寫語意色彩，但 MUST 保持文字、控制項與 Focus 對比要求。

---

## 4. 字體與內容

- 預設字體：`Noto Sans TC`, `PingFang TC`, system-ui, sans-serif。
- Body 預設 MUST ≥ 16px；輔助文字 MUST ≥ 14px。
- 內文行高 SHOULD 為 1.5～1.75。
- 按鈕名稱 MUST 使用具體動詞，例如「開始命題」、「儲存草稿」。
- 禁止用「確定」代表所有動作。
- Label 不得以 placeholder 取代。
- 錯誤訊息格式：發生什麼事＋如何修正＋資料是否保留。

---

## 5. 共用元件清單

### P0 基礎元件

- LogoLockup、BrandMark、GlobalHeader、ProductHeader。
- Button、IconButton、Link。
- TextInput、Textarea、SearchInput、PasswordInput。
- FormField、Checkbox、Radio、Switch。
- Select、MultiSelect、Combobox、FileUpload。
- Header、SideNavigation、Breadcrumb、Tabs、Pagination、Stepper。
- Card、ResourceCard、ActionCard、Badge、Tag、Accordion。
- Alert、Toast、Loading、Skeleton、Progress、EmptyState、ErrorState。
- Dialog、Drawer、Tooltip、Popover。
- Table、DataTable。
- Image、Video、Audio 容器。

### P1 教育產品模式

- GradeSubjectSelector。
- SemesterBookSelector。
- LessonSelector。
- MaterialFilterBar。
- ResourceGrid／ResourceList。
- QuestionCard／QuestionNavigator。
- ScoreSummary。
- AiPromptForm／AiGenerationStatus／AiResult。
- QuestionWorkflow。
- CopyrightNotice／PermissionNotice。

---

## 6. 共通元件 API 規則

所有互動元件 MUST 支援：

```ts
type CommonControlProps = {
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  loading?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
};
```

規則：

- `disabled` 與 `loading` 的語意不可混用。
- Loading MUST 阻止重複提交並保持原寬度。
- 元件需轉交合理的原生 HTML attributes。
- 不提供任意 `color`、`padding`、`borderRadius` Props。
- 樣式差異透過 `variant`、`size` 與 Theme Tokens 處理。
- Controlled 與 uncontrolled 模式不可在生命週期中互換。

---

## 7. Button

```ts
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
};
```

MUST：

- 區塊內原則上只出現一個 Primary。
- 預設 `type="button"`，表單提交需明確指定。
- Icon-only 使用 `IconButton`，並提供 accessible name。
- 觸控目標建議 ≥ 44×44px，最低符合 WCAG 2.2。
- Focus 不得只使用陰影或不明顯變色。

禁止：

- 用 `<div>` 模擬按鈕。
- Disabled 後不說明原因。
- 同時出現多個相同權重的主要操作。

---

## 8. FormField

```ts
type FormFieldProps = {
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  children: ReactElement;
};
```

結構：

```html
<div class="field">
  <label for="school-name">學校名稱</label>
  <input id="school-name" aria-describedby="school-name-help" />
  <p id="school-name-help">請輸入正式校名</p>
</div>
```

MUST：

- Label 永遠可見。
- Error 與輸入欄位程式化關聯。
- Error 同時有文字與圖示，不只使用紅色。
- 發生錯誤後保留輸入內容。
- 必填規則在提交前可被理解。

---

## 9. Select 與 Combobox

- 選項少且不需搜尋：Select。
- 選項多、可搜尋或由伺服器載入：Combobox。
- 多選：MultiSelect，不使用大量 Checkbox 假裝下拉選單。
- 相依選項必須顯示尚未可選原因。
- MUST 支援方向鍵、Enter、Escape 與正確焦點管理。
- MUST 設計 Loading、Empty、Error、Disabled 與 Selected。

教育資料選擇順序原則：

```text
學制 → 年級 → 科目 → 學期 → 冊次 → 章節／課次
```

無需的層級 MAY 省略，但不得改變相同欄位的命名。

---

## 10. Tabs 與導覽

- Tabs 只用於同頁內容切換。
- 跨頁使用 Navigation 或 Link。
- 當前項目必須同時使用位置、形狀或 icon，不能只靠顏色。
- Tabs 鍵盤行為遵循 WAI-ARIA APG。
- 行動版超出寬度時可捲動，但需露出下一項的一部分或提供捲動提示。

---

## 11. Card

內容順序固定：

```text
類型／狀態
標題
摘要
Metadata
Actions
```

- 同一列表的圖片比例、標題行數與 Action 位置一致。
- 整張 Card 可點與 Card 內多操作不可同時存在。
- 若有多個 Action，Card 本身不可成為單一 Link。
- Empty Image、Loading Image 與 Broken Image 都需有狀態。

---

## 12. Dialog 與 Drawer

- 開啟後焦點移至 Dialog。
- 關閉後焦點回到觸發元件。
- 非破壞性 Dialog 支援 Escape。
- Modal 內不得再開第二層 Modal。
- 長流程改用獨立頁面或 Stepper。
- 刪除等高風險操作應說明具體影響。

按鈕範例：

```text
[取消] [刪除這份試卷]
```

禁止：

```text
[否] [是]
```

---

## 13. Feedback 與資料狀態

### Toast

- 用於短暫且非阻斷的成功訊息。
- 不承載需要使用者採取行動的錯誤。

### Alert

- 用於頁面內持續存在的警告或錯誤。
- 包含標題、說明與需要時的 Action。

### Empty State

必須包含：

1. 為什麼沒有內容。
2. 使用者接下來可以做什麼。
3. 一個主要 Action。

### Loading

- < 300ms：不顯示 Spinner，避免閃爍。
- 300ms～2s：局部 Spinner 或 Skeleton。
- > 2s：顯示進度或階段說明。
- Loading 不得造成 Layout Shift。

---

## 14. AI 產品模式

AI 流程 MUST 具有：

```text
Idle → Validating → Queued → Generating → Success
                                  └→ Partial
                                  └→ Error
                                  └→ Cancelled
```

必要操作：

- 停止產生。
- 重新產生。
- 編輯結果。
- 複製結果。
- 回復上一版本。

必要規則：

- Error 不得清除 Prompt 與設定。
- 顯示 AI 內容需人工確認的提示。
- 來源存在時必須可檢查。
- 長時間等待必須顯示合理進度。
- 使用者修改後的版本不可被重新產生直接覆蓋。

---

## 15. 教材篩選模式

```ts
type MaterialFilterValue = {
  degree?: string;
  grade?: string;
  subject?: string;
  semester?: string;
  book?: string;
  lesson?: string;
  keyword?: string;
};
```

MUST：

- 顯示目前已套用的條件。
- 提供「清除全部」。
- 相依條件改變時，只重設受影響的下游條件。
- 結果更新時回報數量與 Loading 狀態。
- URL SHOULD 保存可分享的篩選狀態。
- 無結果時保留條件並提供放寬建議。

---

## 16. 命題流程模式

建議步驟：

```text
選擇範圍 → 設定題型與題數 → 預覽與調整 → 輸出
```

MUST：

- Stepper 顯示目前位置、已完成與不可進入狀態。
- 上一步不得清除已選題目。
- 各步驟離開前自動儲存草稿或明確詢問。
- 題目大量選取提供批次操作與撤銷。
- 輸出前提供完整摘要與錯誤檢查。

---

## 17. 響應式

```text
sm: 480px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

- 斷點最終仍應由內容破版點決定。
- 行動版頁面左右 Padding MUST ≥ 16px。
- 元件不得依賴固定高度。
- MUST 支援 320 CSS px 與 200% Zoom。
- DataTable 必須定義欄位優先、橫向捲動或 Card 化策略。
- Sticky 元件不得遮蔽鍵盤焦點與錯誤訊息。

---

## 18. 可及性

最低標準：WCAG 2.2 AA。

MUST：

- 一般文字對比 ≥ 4.5:1。
- 大型文字對比 ≥ 3:1。
- Focus 明顯且不被遮蔽。
- 所有流程可只用鍵盤完成。
- 資訊不只靠顏色表示。
- Icon-only Control 有 accessible name。
- 圖片有適當 alt；純裝飾使用空 alt。
- 動態狀態使用合適 live region。
- 動畫支援 `prefers-reduced-motion`。
- Modal、Tabs、Menu、Combobox 遵循 WAI-ARIA APG。

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 19. 元件狀態矩陣

每個互動元件 MUST 定義：

| 狀態 | 視覺 | 鍵盤 | ARIA／語意 | 測試 |
|---|---|---|---|---|
| Default | 必須 | 必須 | 必須 | 必須 |
| Hover | 必須 | 不適用 | 不適用 | Visual |
| Focus | 必須 | 必須 | 必須 | Interaction |
| Active | 必須 | 必須 | 視元件 | Interaction |
| Selected | 視元件 | 必須 | 必須 | Interaction |
| Disabled | 必須 | 必須 | 必須 | Unit |
| Loading | 視元件 | 必須 | 必須 | Unit |
| Error | 視元件 | 必須 | 必須 | A11y |
| Empty | 資料元件 | 必須 | 必須 | Unit |

---

## 20. 元件文件模板

```yaml
name: ComponentName
status: beta | stable | deprecated
owner: team-name
version: 1.0.0
purpose: 元件解決的使用者問題
when_to_use:
  - 適用情境
when_not_to_use:
  - 不適用情境
variants: []
sizes: []
states: []
content_rules: []
keyboard: []
accessibility: []
api: []
events: []
tests: []
```

每個元件文件 MUST 提供：

- 可互動範例。
- Do／Don't。
- 桌面與行動版。
- 長文字、空值、Loading、Error。
- Props／Slots／Events。
- 鍵盤操作。
- 可及性說明。
- 變更紀錄。

---

## 21. 測試與 CI

Stable 元件 MUST 通過：

- Type checking。
- Unit tests。
- Interaction tests。
- axe-core accessibility tests。
- Visual regression tests。
- Keyboard manual tests。
- NVDA + Chrome。
- VoiceOver + Safari。
- 320px、200% Zoom、慢速網路與錯誤情境。

CI 在以下情況 MUST 阻擋合併：

- Accessibility violation。
- Token schema error。
- Stable 元件測試失敗。
- 未核准的 Visual Regression。
- Breaking API 未升 Major Version。

---

## 22. 禁止事項

- 禁止在產品內重新建立已有的 P0 元件。
- 禁止硬編碼品牌色、間距、圓角與 z-index。
- 禁止用顏色作為唯一狀態訊號。
- 禁止移除 Focus Outline 而沒有替代樣式。
- 禁止把 `<div>` 或 `<span>` 當作 Button、Link 或 Checkbox。
- 禁止用 placeholder 代替 Label。
- 禁止巢狀 Modal。
- 禁止 Error 後清除使用者資料。
- 禁止產品 Theme 改變元件語意或鍵盤行為。
- 禁止未提供 Migration Guide 就移除 Stable API。

---

## 23. 新功能開發流程

1. 先查詢 `@hanlin/ui` 與 `@hanlin/patterns`。
2. 優先組合既有元件。
3. 單一產品專用區塊留在產品端。
4. 至少兩個產品需要、行為穩定後，才提案成為共用元件。
5. 提案需包含使用者問題、狀態、鍵盤、API、設計稿與測試。
6. 經 Design、Engineering、Accessibility Owner Review。
7. Beta 實測後才能進入 Stable。

---

## 24. Definition of Done

元件只有在以下項目全部完成後才能標記 Stable：

- [ ] 使用 Design Tokens。
- [ ] 所有狀態完整。
- [ ] Desktop／Tablet／Mobile 完整。
- [ ] 320px 與 200% Zoom 不破版。
- [ ] 繁體中文長文字不破版。
- [ ] Keyboard 操作完整。
- [ ] WCAG 2.2 AA 通過。
- [ ] Props／Slots／Events 有文件。
- [ ] Unit、Interaction、A11y、Visual Tests 通過。
- [ ] Figma 與程式元件一致。
- [ ] Owner、版本與 Changelog 完整。
- [ ] Breaking Change 有 Migration Guide。

---

## 25. 開發優先順序

第一批先完成：

```text
Tokens
Button
FormField
TextInput
Select / Combobox
Checkbox / Radio / Switch
Tabs
Card / ResourceCard
Alert / Toast
Loading / Empty / Error
Dialog / Drawer
MaterialFilterBar
LessonSelector
AiGenerationStatus
QuestionWorkflow Stepper
```

不要先投入低使用率的複雜元件。先讓自學、教材資源、AI 與命題產品共享同一批高頻元件，再根據實際缺口擴充。

---

## 26. 參考文件

- [完整規範建議書](./hanlin-web-component-guidelines.md)
- [Design System 視覺預覽](./hanlin-design-system-preview.png)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Design Tokens Format Module](https://www.designtokens.org/tr/drafts/format/)

---

## 27. 企劃操作與防破版規則（必要）

### 27.1 基本原則

- 企劃只能編輯「內容」與經核准的「變體」，不能自由調整 Width、Height、Position、Margin、Padding、Font Size、z-index 或任意色碼。
- 元件 MUST 預設支援合理的最短、最長與空內容，不得以固定高度假設文案永遠只有一行。
- CMS MUST 在輸入階段顯示建議字數、硬上限與即時預覽。
- 超過建議長度時先警告；超過硬上限時禁止發布，並說明如何修正。
- 發布前 MUST 提供 Desktop、Tablet、Mobile 三種預覽。
- 若企劃內容不符合元件規格，系統不得靜默裁切重要資訊。

### 27.2 可編輯層級

企劃可編輯：

```text
標題、副標、內文、標籤、按鈕文字、連結、圖片、影片、替代文字、排列順序、核准的 Variant
```

企劃不可編輯：

```text
DOM 結構、ARIA、Heading Level、Focus Order、字級、行高、固定座標、任意間距、任意圓角、任意陰影、任意色碼
```

若有品牌活動需要特殊視覺，應新增經審核的 Theme 或 Variant，不應開放自由 CSS。

### 27.3 內容欄位契約

每個可編輯欄位 MUST 在 Schema 定義：

```ts
type ContentFieldRule = {
  label: string;
  required: boolean;
  recommendedMin?: number;
  recommendedMax?: number;
  hardMax?: number;
  linePolicy?: 'wrap' | 'clamp' | 'scroll' | 'expand';
  maxLines?: number;
  allowLineBreak?: boolean;
  fallback?: string;
  sanitize?: 'plain-text' | 'limited-rich-text';
};
```

欄位文件 MUST 同時說明：

- 最佳長度。
- 最大長度。
- 是否可換行。
- 超長後的行為。
- 空值後的行為。
- 行動版顯示方式。
- 是否影響 SEO 或無障礙名稱。

### 27.4 建議字數與行數

以下是初始基準，應依正式中文字型與元件寬度做視覺回歸驗證：

| 欄位 | 建議長度 | 硬上限 | 顯示策略 |
|---|---:|---:|---|
| Global Navigation | 2～6 字 | 8 字 | 不換行；超限禁止發布 |
| Button | 2～8 字 | 12 字 | 優先擴寬；Mobile 可滿版 |
| Tab | 2～6 字 | 10 字 | 不換行；過多時橫向捲動 |
| Badge／Tag | 2～6 字 | 10 字 | 單行；不得省略關鍵狀態 |
| Card Title | 6～20 字 | 36 字 | 最多 2 行；列表高度一致 |
| Card Summary | 20～60 字 | 120 字 | 最多 3 行；提供完整內容入口 |
| Page H1 | 6～24 字 | 40 字 | 自動換行，不使用省略號 |
| Section Heading | 4～18 字 | 32 字 | 自動換行，區塊隨內容增高 |
| Hero Title | 8～24 字 | 40 字 | Desktop 最多 2 行；Mobile 最多 3 行 |
| Hero Description | 20～60 字 | 120 字 | Desktop 最多 3 行；Mobile 可完整展開 |
| Table Header | 2～8 字 | 16 字 | 可換行 2 行或設定欄寬 |
| Toast Title | 4～16 字 | 24 字 | 最多 2 行 |
| Error Message | 12～60 字 | 160 字 | 完整顯示，不截斷 |

硬上限不是 CSS 截斷值，而是 CMS 的發布驗證值。

### 27.5 文字溢位規則

元件依內容重要性採用以下策略：

#### 必須完整顯示

- 頁面主標題。
- 表單 Label、Help Text、Error Message。
- 法律、授權、隱私與版權訊息。
- AI 產生結果。
- 命題內容與作答選項。
- 付款、刪除、發布等高風險操作說明。

處理方式：自動換行、容器增高，不得 Ellipsis。

#### 可以限制行數

- 資源卡摘要。
- 推薦內容摘要。
- 非關鍵 metadata。

處理方式：使用 line-clamp，並提供可存取的完整內容入口。不得只靠 `title` attribute。

#### 維持單行

- Navigation Item。
- 短 Badge。
- Table 中的短代碼。

處理方式：CMS 限字、容器保留合理寬度；必要時改為縮短名稱，不自動縮小字體。

禁止：

- 為塞入文字而把字體縮到規範以下。
- 使用負 margin 遮掩溢位。
- 用固定高度搭配 `overflow: hidden` 隱藏重要內容。
- 讓文字覆蓋圖片或按鈕。

### 27.6 圖片與媒體規則

每個圖片欄位 MUST 指定比例，而非只指定 pixel：

| 用途 | 建議比例 | 最低尺寸 | 裁切方式 |
|---|---|---:|---|
| Hero | 16:9 或 3:2 | 1600×900 | `cover`，提供焦點位置 |
| Resource Card | 4:3 | 800×600 | `cover` |
| Product Card | 16:9 | 960×540 | `cover` |
| Avatar | 1:1 | 256×256 | `cover`，中心裁切 |
| Logo | 保持原比例 | SVG 優先 | `contain`，不可裁切 |
| 教材封面 | 3:4 | 600×800 | `contain` 或完整顯示 |

CMS MUST：

- 驗證檔案格式、容量、比例與最低尺寸。
- 提供裁切預覽與焦點設定。
- 要求替代文字，純裝飾圖可勾選「裝飾圖片」。
- 自動產生響應式尺寸與 WebP／AVIF 等適合格式。
- 圖片載入失敗時顯示可理解的替代狀態。

元件 MUST 使用 `aspect-ratio` 保留空間，避免載入時版面跳動。

### 27.7 按鈕與操作數量

- 一個 Hero 最多 2 個 Action：1 Primary + 1 Secondary。
- 一張 Card SHOULD 最多 2 個直接顯示的 Action；其他操作收進 Menu。
- 一個 Dialog Footer 最多 1 個主要操作與 1 個取消操作。
- Button 文字不得由企劃輸入換行字元。
- Button 群組在空間不足時 MUST 換成垂直排列，不可互相擠壓。
- 行動版主要按鈕 MAY 滿寬，但文字與 icon 不得重疊。

```css
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

@media (max-width: 480px) {
  .button-group {
    flex-direction: column;
  }

  .button-group > * {
    width: 100%;
  }
}
```

### 27.8 Card Grid 防破版

- 使用 CSS Grid／Flex，不使用絕對定位排列內容。
- Card 高度由內容決定；同列需要齊高時使用 Grid stretch。
- Actions 可用 `margin-top: auto` 固定在 Card 底部，但不得壓住內容。
- Card Title 與摘要採一致行數政策。
- 1～2 張卡片時不可被強制拉寬到難以閱讀。

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: var(--space-6);
}

.card {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.card__actions {
  margin-top: auto;
}
```

### 27.9 Hero 防破版

- Desktop 可使用雙欄；Mobile MUST 改為單欄。
- 文字欄使用 `min-width: 0`，避免長內容撐破 Grid。
- 圖片不可設定不可縮小的固定寬度。
- Hero 高度由內容決定，不設固定 `height`。
- 裝飾物不得壓住文字、Action 或焦點。

```css
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.72fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: center;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }
}
```

### 27.10 Table 防破版

- Table MUST 放在可橫向捲動容器內。
- 第一欄或重要識別欄 SHOULD 保持可見。
- 欄位需定義 Priority：essential、important、optional。
- Mobile 可隱藏 optional 欄，但資料必須可由明細查看。
- 不得用極小字體塞入所有欄位。
- 長字串、URL 與檔名需支援 `overflow-wrap: anywhere`。

### 27.11 Rich Text 限制

企劃用 Rich Text Editor 只允許：

```text
H2、H3、段落、粗體、斜體、連結、項目符號、編號、引用、圖片、表格
```

禁止：

```text
任意字級、任意字體、任意顏色、文字陰影、浮動、絕對定位、內嵌 iframe、任意 HTML、inline style
```

貼上 Word／Google Docs 內容時 MUST 清除不支援的樣式，只保留語意結構。

### 27.12 URL、代碼與不中斷字串

所有內容容器 SHOULD 預設：

```css
.content-safe {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: normal;
}
```

Email、URL、教材代碼與檔名不得撐出容器。需要複製的代碼可使用水平捲動 Code Block，不強制斷字。

### 27.13 空值與缺漏資料

- Optional 欄位為空時移除整個欄位容器，不留下多餘間距或分隔線。
- Required 欄位為空時 CMS 禁止發布。
- 圖片缺失時依元件規則使用預設圖或純文字版，不顯示破圖 icon。
- Metadata 缺少部分項目時，分隔符號不得殘留。
- 列表為空時顯示 Empty State，不顯示空白頁。

### 27.14 CMS 編輯體驗

CMS MUST 提供：

- 欄位旁的建議長度與剩餘字數。
- Desktop／Tablet／Mobile 即時預覽。
- 圖片比例與焦點裁切預覽。
- 連結有效性檢查。
- 必填與可及性欄位檢查。
- 發布前問題摘要，可直接跳到錯誤欄位。
- Draft／Preview／Scheduled／Published 狀態。
- 版本紀錄與回復。

建議錯誤文案：

> 標題目前 43 字，超過 40 字上限。請縮短標題，避免行動版超出三行。

禁止只顯示：

> 輸入錯誤。

### 27.15 自動降級策略

若內容超出推薦範圍，元件依序採用：

1. 自動換行。
2. 容器自動增高。
3. Button Group／Grid 改為下一列或單欄。
4. 次要內容採核准的 line-clamp。
5. 顯示「查看完整內容」。

永遠不得採用：

1. 自動縮小到最低字級以下。
2. 讓元素互相覆蓋。
3. 隱藏主要操作。
4. 裁切錯誤、警告或法律內容。

---

## 28. 防破版測試資料集

每個元件 MUST 使用以下內容做自動或視覺測試：

### 文字案例

- 空字串。
- 1 個中文字。
- 建議最大長度。
- 硬上限長度。
- 超過硬上限 1 字。
- 連續 100 個無空白英數字元。
- 超長 URL。
- 中英數混排。
- Emoji、全形標點與特殊符號。
- 200% 字體縮放。

### 資料案例

- 0、1、2、3、10、100 個列表項目。
- 圖片缺失、圖片過大、圖片比例錯誤。
- 所有 Optional 欄位缺失。
- Error Message 兩行以上。
- Button 只有一個或有兩個。
- Table 3 欄、8 欄、20 欄。

### Viewport 案例

```text
320×568
375×667
768×1024
1024×768
1280×720
1440×900
1920×1080
```

### 必要視覺斷言

- [ ] 無水平頁面捲動；明確需要的 Table／Code 容器除外。
- [ ] 文字不覆蓋圖片、Icon 或 Button。
- [ ] Button 不超出容器。
- [ ] 焦點框完整可見。
- [ ] Sticky Header 不遮住 Focus 與 Anchor Target。
- [ ] Error 出現後 Layout 仍可操作。
- [ ] 圖片載入前後沒有顯著 Layout Shift。
- [ ] 企劃允許輸入的最大內容可以正常發布與閱讀。

---

## 29. 企劃套用元件檢查表

發布前由 CMS 自動檢查，企劃只需確認內容：

- [ ] 標題與按鈕未超過欄位上限。
- [ ] 圖片比例與焦點正確。
- [ ] 非裝飾圖片有替代文字。
- [ ] 每個區塊只有一個 Primary Action。
- [ ] 連結目的與開啟方式正確。
- [ ] Desktop／Tablet／Mobile 預覽可讀。
- [ ] 沒有空標題、殘留分隔符號或破圖。
- [ ] 錯誤、授權與 AI 提示文字完整。
- [ ] 發布時間、可見對象與權限正確。

若元件在上述合法輸入下破版，應視為元件缺陷，不應要求企劃用空白、手動換行或縮短必要資訊修補。

---

## 30. Logo 與 Header 規範

### LogoLockup

- Logo MUST 使用正式資產，不得以文字重新拼排取代。
- 標誌與「翰林」文字組合為一個可辨識單位，提供深色、淺色與單色版本。
- 最小顯示尺寸、保護距離與可用背景 MUST 在 Figma 與程式碼文件中同步。
- Logo 不得拉伸、旋轉、加陰影、加外框或放在對比不足的背景上。
- 若 Logo 僅為裝飾，替代文字可為空；若是首頁連結，accessible name 應為「翰林首頁」。

### Header

- Global Header、Product Header 與內容頁 Header 必須分成不同元件，不用同一個元件塞入所有情境。
- Header MUST 定義 Logo、主要導覽、產品切換、帳號入口與行動版 Menu 的插槽順序。
- Desktop 導覽不足時，改用 More Menu；不得讓導覽文字擠壓 Logo 或帳號入口。
- Mobile Header MUST 保留 Logo、Menu 與目前頁面名稱；次要導覽放入 Drawer。
- Sticky Header 不得遮住焦點、錯誤訊息或 Anchor Target。
- Header 高度不得依內容硬編碼；支援兩行標題、長產品名稱與字體放大。

### Header 變體

```text
GlobalHeader：翰林跨產品入口
ProductHeader：單一產品導覽與帳號
ContextHeader：教材／課次／命題流程上下文
MobileHeader：Logo＋頁面名稱＋Menu
```

企劃只能選擇核准的 Header 變體與導覽項目，不得自行調整 Logo 尺寸、間距或固定定位。

---

## 31. Theme Token 與 Starter 整合規則

### 31.1 唯一色彩來源

- 所有元件只引用 semantic color token，不得在元件 CSS 寫入品牌色碼。
- `tokens.css` 是色彩、字級、間距、圓角、陰影與動態的唯一數值來源；其值與 STYLEGUIDE.md／平台 `engine.js` SG token 一致（見 §3.4、colors.md「執行準則」）。
- 換色版只允許覆寫 Theme token；不得複製或修改 Button、Card、Tabs 等元件樣式。
- 圓角依 STYLEGUIDE：按鈕／chip／輸入框 `--radius-md: 100px`、卡片 `--radius-xs: 12px`；§3.3 的 `4/8/12px` 級距不適用於這些元件。

### 31.2 從基本 Starter 併入的元件

- Accordion：標題使用 button；面板以 `hidden` 控制收合。
- Pagination：每項最小 44×44px；目前頁使用 `aria-current="page"`。
- Skeleton：載入時保留內容尺寸，不得造成版面位移。
- Chip／Filter：使用 `role="tablist"`、方向鍵操作與 `aria-live` 結果播報。
- Form validation：錯誤需同時具備色彩、文字、`aria-invalid` 與 `aria-describedby`。

### 31.3 共用與可替換邊界

| 可替換（Theme） | 共用（Component） |
|---|---|
| 主色、Hover、Focus | Button 結構與七種狀態 |
| 背景、文字、邊框 | Input／Select 行為 |
| Success、Danger 語意色 | Tabs／Accordion 鍵盤操作 |
| Logo 墨色 | Card、Resource Card 內容契約 |
| 裝飾黃、暖橘 | Responsive 斷點與防破版規則 |

### 31.4 驗收

- 切換任一 Theme 後，元件 DOM、互動、ARIA 與響應式行為不得改變。
- 以 320、768、1280px 檢查無水平溢出與內容重疊。
- 以長標題、長 URL、空狀態、載入中、錯誤狀態重跑元件檢查表。

### 31.5 色版資料庫整合

- [colors.md](./colors.md) 是翰林各產品色版的完整資料庫，包含翰林學習藍、清新小森林、漫畫貼紙風、復古文青風、多巴胺潮風等色版。
- `colors.md` 只負責記錄色版，不直接被元件引用；每個色版必須映射到 31.1 的統一 semantic token。
- `tokens.css` 只載入目前頁面啟用的色版；切換色版時只改 `data-theme` 或 Theme token。
- 若 `colors.md` 與舊 Starter／歷史規範出現不同色碼，以目前 `tokens.css` 啟用值為執行準則，並在 `colors.md` 保留來源註記。
- 新增色版時，必須補齊品牌／操作、Surface、文字、邊框、狀態、裝飾六類欄位，並完成 WCAG 對比驗證。
