/* ── 規範封包產生器（套版詳細與 AI 指令頁共用）────────────────────────
   兩個頁面都要能產出同一份 SKILL.md／theme.json／tokens.css，
   各自寫一份遲早會走鐘，所以抽在這裡。
   這一份完全不碰 DOM，輸入就是採用設定物件，輸出就是檔案內容。 */
(function(){
  /* 規範內容產生器：底下的「匯出 skill.md」與右上角的封包共用同一份，
     兩邊的內容保證一致——各寫一份遲早會走鐘。 */
  /* st ＝採用設定（套版詳細用 buildState() 的即時結果，AI 指令頁用 localStorage 存下來的那份）。
     這裡不碰 DOM、不自己存檔，純粹把 state 轉成檔案內容。 */
  function buildSkillPack(st){
    var t=st.theme||{};
    /* 目前採用的風格色版名稱（theme.n），檔名與內容都用它 */
    var _PALN=(t.n||'').trim(),_PALSRC=(t.src||'').trim();
    /* 【md 內容要跟著所選色版走】(使用者回報 2026-09-04)
       先前「形狀與間距」「套用規範到既有頁面」兩段把翰林的值寫死
       （圓角 10px、Teal #22CFC9、灰階 #3A3D42…），
       所以不管選哪一組色版，匯出的 md 讀起來都還是翰林藍那一套。
       這些值採用設定裡本來就有（curTheme 帶了 rd／sh／bd／ink／mu／ln／bg／ex），
       只是沒被引用。以下一律改成有值就用色版的、沒有才退回翰林預設，
       並在行尾標明是哪一種，讓看 md 的人知道這個數字的來源。 */
    var _RD=t.rd||[],_SH=t.sh||[],_BD=t.bd||null,_EX=t.ex||[];
    var _rdComp=_RD[0]||'14px',_rdCard=_RD[1]||'14px',_rdBox=_RD[2]||'14px';
    var _ink=t.ink||'#3A3D42',_mu=t.mu||'#8C9099',_ln=t.ln||'#E6E8EC',_bg=t.bg||'#FFFFFF';
    var _fromPal=_PALN?('（來自色版「'+_PALN+'」）'):'';
    var N={
      hd:['品牌官網（淺色）','品牌官網（深色）','教師平台','國小 / 兒童產品','國中 / 高中 學術','命題大師','行動大師','影音派','AI 數位導覽員'],
      ft:['完整頁尾（版權+社群）','導覽頁尾（連結列+版權）','精簡頁尾（深色置中）'],
      hero:['AI 漸層版','純圖片版'],
      fm:['有色塊圖示磚版','純 icon 版'],
      opt:['有色塊圖示磚版','純 icon 版'],
      tblsty:['斑馬紋 Striped','全框線 Bordered','主色表頭 Primary','深色表頭 Dark'],
      icon:['純圖示 · 品牌色','色底圓形容器']
    };
    var LOGO_N=['① 完整組合','② 中英組合','③ 標準字','④ 品牌標誌'];
    var CTL_N={btn:'按鈕 Button',seg:'選取狀態 Selectable',select:'下拉 Select',label:'標籤 Label',input:'輸入框 Input',choice:'選擇控制 Checkbox / Radio / Switch',tabs:'頁籤 Tabs',btnstate:'按鈕變體與狀態',rescard:'教材卡片 Resource Card',principles:'設計方針',midcolor:'中間色 / 輔助色',gray:'灰階',softtile:'淡色圖示方塊',rwd:'RWD 斷點',type:'文字級距',shape:'形狀與間距'};
    var g=st.groups||{},c=st.controls||{};
    function pickName(key){return (N[key]||[])[g[key]||0]||''}
    var adopted=Object.keys(CTL_N).filter(function(k){return c[k]!==false}).map(function(k){return CTL_N[k]});
    var md=[
      '---',
      'name: hanlin-brand-guideline',
      'description: 翰林產品品牌規範'+(_PALN?('（'+_PALN+'）'):'')+' — 主題色、版型與元件採用設定，供產品開發時套用',
      '---',
      '',
      '# 翰林品牌規範 Skill'+(_PALN?(' — '+_PALN):''),
      '',
      /* 風格色版名稱要能一眼看出來（使用者指定 2026-09-04）：
         七組色版匯出的 md 內容差異只在色碼上，沒有名稱時打開檔案分不出是哪一組。
         名稱來源就是採用設定裡的 theme.n，與檔名同一個值。 */
      (_PALN?('> 風格色版：**'+_PALN+'**'+(_PALSRC?('　來源文件：'+_PALSRC):'')):''),
      '',
      '## 色彩 Colors',
      '- 主色 Primary:'+t.p,
      '- 深色 Secondary:'+t.s,
      '- 強調 Accent:'+t.i,
      '- 對比 Contrast:'+((st.contrast&&st.contrast!=='auto')?st.contrast:t.c)+'（僅用於行內強調：NEW、必填 *、限時、重點數字）',
      '- 柔色 Soft：主色與白 9:1 混合（約 10% 主色），用於柔色底+品牌色字',
      '- 中性色：主要文字 '+_ink+' / 次要文字 '+_mu+' / 分隔線 '+_ln+' / 頁面底色 '+_bg+(t.ink?_fromPal:'（翰林預設三階灰）'),
      (_EX.length?('- 裝飾色：'+_EX.map(function(x){return x[0]+' '+x[1]}).join(' / ')+_fromPal):''),
      '- 狀態色：成功 #26A649 / 警告 #E08A1E / 危險 #DE3535 / 資訊 #2E9BE6（柔色底+同色字，語意固定，不隨色版變）',
      '',
      '## Logo（必要基本樣式 — 不隨色版變，任何一組風格色版都必須照做）',
      '- **翰林 Logo 是必套項目，不是選配**：套版時一律替換為翰林 Logo，'
        +'不得保留原站標誌、不得只換顏色留原圖形、不得因為「原站沒有 logo」就略過（沒有就補上）',
      '- 採用組合：'+(LOGO_N[st.logoLight]||LOGO_N[2])+(st.logoInv?'（反白版，深色背景用）':'（標準版，淺色背景用）'),
      '- 四種組合擇一，標準版與反白版共用同一個選擇：'
        +'① 完整組合 logo.svg／② 中英組合 logo-en.svg／③ 標準字 logo-text.svg／④ 品牌標誌 logo-mark-only.svg',
      '- 尺寸：頁首 40px 高（視窗 640px 以下 32px）、頁尾 44px 高；寬度一律 auto，等比例縮放',
      '- 深色底一律反白：filter: brightness(0) invert(1)（等同規範的「深色底覆寫為 surface.muted」）',
      '- **標誌已含品牌字樣，旁邊不得再重複品牌文字**（不要在 logo 右邊再寫一次「翰林」）',
      '- favicon 一併換成 logo-mark-only.svg',
      '- 禁止：變形拉伸、旋轉、改配色（含改成色版主色）、加外框、加陰影、加底色方塊、'
        +'裁切標誌的任何一部分、把標誌放進圓形頭像框',
      '- 淨空區：標誌四周至少留一個「翰」字高度的空白，不得讓文字或元件貼齊',
      '- 替換判準（套版時逐項比對）：img 的 src／alt／class 含 logo、brand、mark 者；'
        +'以及頁首／側欄品牌區裡的單字母方塊（例如 <div class="hmark">H</div>）'
        +'——這類不是 img 也不是 svg，最容易漏掉',
      '- 替換後要拿掉原站標誌自己的 background／border／box-shadow，避免翰林標誌被裝在別人的色塊裡',
      '',
      '## 版型採用 Layouts',
      '- Header:'+pickName('hd'),
      '- Footer:'+pickName('ft'),
      '- 歡迎橫幅：'+pickName('hero'),
      '- 功能選單：'+pickName('fm'),
      '- 橫向選項卡：'+pickName('opt'),
      '- 表格樣式：'+pickName('tblsty'),
      '- 圖示樣式：'+pickName('icon')+'(Google Material Symbols Rounded)',
      '- Header 會員入口：'+(st.memberEntry?'啟用':'停用'),
      '',
      '## 採用元件 Components',
      adopted.map(function(x){return '- '+x}).join('\n'),
      '',
      /* 元件功能規範：來源 hanlin-design-system/UI.md §7–13、§18（2026-09-14 併入預設規範）。
         這些是行為與可及性的硬規則，不隨色版變；換色版只換 token。 */
      '## 元件功能規範 Component Behavior（不隨色版變）',
      '- 通用：所有元件只引用語意 token，不得寫死色碼；每個互動元件都要有 default / hover / focus-visible / active / disabled / loading / error 七種狀態；觸控目標 ≥ 44×44px；鍵盤可操作、focus-visible 必須看得到（3px 品牌色外框＋2px 偏移）',
      '- Button：主要（品牌色實心白字）／次要（品牌色外框）／文字／危險（#DE3535）四種變體；一個畫面只有一顆主要按鈕；loading 時 aria-busy=true、保留原寬度、不可重複觸發；按鈕名稱用具體動詞（「開始命題」「儲存草稿」），禁止只寫「確定」',
      '- FormField（Input / Textarea）：Label 一律顯示，不得用 placeholder 代替；必填以「*」＋aria-required 標示；錯誤狀態同時具備紅色外框、錯誤文字、aria-invalid=true 與 aria-describedby；錯誤訊息格式＝發生什麼事＋如何修正＋資料是否保留；輸入內容不得因錯誤被清空；最小高度 48px',
      '- Select / Combobox：原生 select 優先；自訂下拉需 role=listbox＋aria-expanded、方向鍵移動、Enter 選取、Esc 關閉；選項超過 8 個提供搜尋',
      '- Checkbox / Radio / Switch：用原生 input 配 accent-color；Switch 用 role=switch＋aria-checked；整列（含文字）可點；狀態不得只靠顏色分辨',
      '- Tabs：role=tablist / tab / tabpanel；目前頁籤以品牌色底線標示並 aria-selected=true；方向鍵切換、Home／End 跳首尾；不得以邊框分辨頁籤',
      '- Card / Resource Card：固定欄位契約（封面、標題、標籤、動作）；標題單行省略或最多兩行；長標題不得覆蓋操作區；整張可點時只放一個連結，不得巢狀連結；不得依賴固定高度',
      '- Dialog / Drawer：role=dialog＋aria-modal＋aria-labelledby；開啟時焦點移入、Esc 關閉、關閉後焦點回到觸發元件；背景不可捲動；行動版 Drawer 全寬',
      '- Toast / Alert：Toast 用 role=status（aria-live=polite）、3–5 秒自動消失且可手動關閉；Alert 用 role=alert；語意色固定（成功 / 警告 / 危險 / 資訊）不隨色版變，且必須同時有圖示與文字',
      '- Empty / Loading：空狀態要有說明＋下一步動作；載入用 Skeleton 保留內容尺寸，不得造成版面位移；動效 120 / 200 / 320ms，尊重 prefers-reduced-motion',
      '- 防破版：文字溢位依欄位契約（標題可限行數、URL 與代碼不中斷字串用 overflow-wrap:anywhere）；卡片格 minmax(320px,1fr)；320 / 768 / 1280px 不得水平溢出',
      '',
      '## 字體與級距 Typography',
      '- 字體：Noto Sans TC（fallback:PingFang TC、Microsoft JhengHei）',
      '- H1 36px / H2 28px / H3 22px / Body 18px / 副文字 13px / 標籤 11px',
      '',
      '## 形狀與間距 Shape & Spacing',
      '- 圓角：按鈕 / chip / 輸入框 '+_rdComp+' / 卡片 '+_rdCard+' / 大區塊 '+_rdBox
        +(_RD.length?_fromPal:'（未指定色版時一律 14px；藥丸 999px、圓形 50% 不在此列）'),
      (_SH[0]?('- 陰影：'+_SH[0]+(_SH[1]?(' / 大陰影 '+_SH[1]):'')+_fromPal):'- 陰影：shadow.1 柔和陰影，不使用邊線分隔'),
      (_BD?('- 邊線：'+_BD+_fromPal+'——這一組色版的元件帶邊線，屬於它的形狀特徵'):'- 邊線：元件一律無邊線，層次用色塊與陰影表達'),
      '- 間距刻度：4 的倍數(4 / 8 / 12 / 16 / 24 / 32)',
      '- RWD 斷點(Tailwind):sm 640 / md 768 / lg 1024 / xl 1280；跨斷點時多欄轉單欄',
      '- Header RWD：≤860px 導覽收成漢堡選單（Logo 左、漢堡右，展開後導覽整寬清單、每項 ≥44px、Esc／點外面關閉）；主要 CTA 保留在 header',
      '- Footer RWD：≤640px 多欄收成單欄置中，連結群可展開、版權置中，每個連結 ≥44px',
      '- 表格 RWD：欄位多時，手機**不是**出現橫向捲軸、也不是等比縮小，而是每筆資料變成一張直式小表——每個欄位一列，左邊是欄名格（品牌深色底白字、固定寬）、右邊是內容，一筆一卡、卡與卡之間留空；欄名必須清楚呈現，不可省略',
      '- 層次一律用色塊表現，不把顏色用在邊線上，不可「色塊＋邊線」並用：次要按鈕＝柔色底不外框、輸入框＝淺底填色不外框、Tabs 當前態＝色塊、卡片＝白底＋陰影、表格手機卡＝色塊分隔；焦點態的 outline 為可及性需求可保留；色版本身以粗邊為識別者（bd token）除外',
      '',
      '## 套用前的檔案分析 Source Analysis',
      '套用前先分析來源檔案，再決定取得元件與改寫的方式：',
      '- 框架：Tailwind（色彩在 class 名稱，需產生 class 覆蓋規則）／Bootstrap（覆蓋 btn-primary、bg-* 等元件類）',
      '- 撰寫方式：Utility class ／ CSS-in-JS 亂數 class ／ inline style ／ BEM ／ 舊式 table 屬性 ／ 語意化 class',
      '- 主導色：統計 hex／rgb／hsl 色相並優先採信 --primary/--main/--brand 變數，該色系一律映射到品牌主色家族',
      '- 深色頁：body/:root 背景亮度 <0.35 時，版型改用品牌深色實色',
      '- 元件識別：解析原始 CSS，padding+border/shadow=卡片；padding+background+radius+inline-block=標籤',
      '- 結構：header／footer／歡迎橫幅依「標準標籤 → class → 結構推斷」三層偵測，找不到即自動補上',
      '',
      '## 套用規範到既有頁面 Restyle Rules',
      '將本規範套用到任何既有 HTML 頁面時，務必遵守：',
      '- **`<script>` 程式碼一律不動**：任何替換不得修改 JS，確保動線與功能不受影響',
      '- **優先權最高**：所有樣式改寫直接寫在元素上（inline style + important），不可只靠注入 style 規則',
      '- **四個判斷依據逐條修改**：HTML 內建 tag → class 關鍵字 → 功能（role／aria／type／互動屬性）→ 語意（文字長度、結構、色相、CSS 規則反推）',
      '- 顏色替換(hex / rgb() / rgba() / 具名顏色)依色相語意映射，不可整頁單一色：',
      '  - 紅色系 → 危險紅 #DE3535；橘、粉色系 → 對比色；黃色系 → 琥珀金 #F5B32F',
      '  - 綠色系 → 成功綠 #26A649；青色系 → 亮色 '+t.i+_fromPal+'；藍、藍紫色系 → 品牌色家族（深 '+t.s+' / 主 '+t.p+' / 淺 '+t.i+'）',
      '  - 灰階與黑白保留不動；依原色亮度保留明暗層次（淺底轉柔色、深色轉深階）',
      '- 行內 SVG icon：黑 / 深灰填色與 currentColor 轉品牌主色；大型插圖不動',
      '- emoji icon 替換為 Material Symbols Rounded 對應圖示（品牌色），僅替換標籤外的可見文字，不碰屬性',
      '- Logo 圖（src / alt / class 含 logo 的 img）與 favicon 替換為翰林 Logo',
      '- 全頁字體改為 Noto Sans TC（圖示字型除外）',
      '- 依 HTML 內建 tag 與 class 語意套用規範樣式層（不覆蓋頁面自有樣式）:',
      '  - a 連結 → 品牌色；button / [class*=btn] → 圓角 '+_rdComp+';input / select / textarea → 圓角 '+_rdComp+' + 淺灰框',
      '  - table → th 淺灰底、格線用淺灰、內距 10x14;blockquote → 品牌色左線；code / pre → 等寬字+淺灰底',
      '  - [class*=card|panel|modal] → 圓角 '+_rdCard+';[class*=tag|badge|chip|pill] → 全圓角',
      '  - [class*=success] → 成功綠；[class*=danger|error] → 危險紅；[class*=warn] → 警告橘；[class*=info|notice] → 資訊藍',
      '  - button[class*=primary] / [type=submit] → 品牌色實心白字',
      '- **單色頁面須重新配色**：不可整頁映射成單一主色，須把完整色盤分配到元件上：',
      '  - 重複元件群組（同層同 class ≥3 個，如功能卡、步驟）：icon 與色塊依「主色 '+t.p+' → 亮色 '+t.i+' → 對比色 '+((st.contrast&&st.contrast!=='auto')?st.contrast:t.c)+(_EX.length?(' → 裝飾色 '+_EX[0][1]):' → 成功綠 #26A649')+'」輪替'+_fromPal,
      '  - 標籤 / 徽章（tag / badge / chip / pill）：輪替柔色底＋同色字',
      '  - 小標 eyebrow / kicker → 對比色；統計數字、步驟編號 → 色盤輪替；清單勾號 → 成功綠；mark 高亮 → 對比色柔底',
      '  - 區塊節奏：原本沒有底色的 section 交替「白 → 主色淡底」，自帶底色的區塊（hero 等）不計；白底至少保留一半',
      '- icon 替換：空的 fa-/bi- 元素與可辨識檔名的圖檔 icon 轉 Material Symbols 對應圖示；emoji 與符號字元（★✓☰►）轉對應圖示；猜不到語意的圖檔 icon 套灰階融入',
      '- 外部圖檔 icon、background-image、canvas 圖形無法語意替換，保留原樣',
      '',
      '## 對比規則 Contrast（硬性，套版時逐一驗證）',
      '- **按鈕底色深 → 文字一律白色／淺色**。判準：底色相對亮度 < 0.35 即為深色底，'
        +'此時文字必須是 #FFFFFF 或該色版的最淺色，不得使用深字',
      '- 任何文字與它實際所在的底色，對比必須 ≥ 4.5:1（18px 以上粗體或 24px 以上大字可放寬到 3:1）',
      '- 白字在該底色上達不到 4.5:1 時（中間調的飽和色常見，例如橘紅、焦糖、珊瑚），'
        +'不可硬留白字，改用「同一色相壓深到剛好 4.5:1」當文字色；底色本身不要改，它是規範值',
      '- 禁止把文字色設成與底色同色系的中間調（會做出看得到、讀不了的字）',
      '- 檢查對象是**實際渲染後**的底色，不是元素自己宣告的 background：'
        +'透明底要往上追到真正畫出顏色的那一層再算',
      '',
      '## 使用規則 Rules',
      '- 選取狀態一律以色塊輕重表達，禁止以邊線分辨',
      '- 同一元件在淺色底用品牌色系、深色底改用白色系，皆無邊線',
      '- 對比色只點綴、不當主色',
      '- 次要文字、圖示、分隔線一律使用三階灰，不隨手用淺灰',
      ''
    ].join('\n');
    /* 【檔名帶上風格名稱】(使用者指定 2026-09-04)
       七組色版都叫 SKILL.md，下載幾組之後只剩 SKILL(1).md、SKILL(2).md，
       分不出哪個是哪個。名稱裡不能出現的字元（/ \ : * ? " < > | 與空白）換成 -。 */
    var slug=_PALN?_PALN.replace(/[\/\\:*?"<>|\s]+/g,'-').replace(/^-+|-+$/g,''):'';
    return {md:md,theme:st,palName:_PALN,slug:slug};
  }

  /* 這一組的 CSS 變數：拿到封包就能直接 @import 進自己的專案 */
  function buildTokensCss(t){
    var RD=t.rd||[],SH=t.sh||[];
    var L=[
      '/* 翰林視覺套版｜'+(t.n||'未命名')+(t.src?('　來源 '+t.src):'')+' */',
      '/* 由套版詳細頁匯出，數值即為這一組規範的值；沒有給的項目已省略。 */',
      ':root{'];
    function add(k,v){if(v)L.push('  '+k+':'+v+';')}
    add('--brand',t.p);add('--brand-dark',t.s);add('--brand-deep',t.s);
    add('--blue-300',t.i);add('--warm',t.c);
    add('--page',t.bg);add('--line',t.ln);
    add('--text-muted',t.mu);add('--text',t.ink);
    add('--r-btn',RD[0]);add('--r-card',RD[1]);add('--r-box',RD[2]);
    add('--shadow-1',SH[0]);add('--shadow-2',SH[1]||SH[0]);
    add('--border-comp',t.bd);
    L.push('}');
    return L.join('\n')+'\n';
  }


  /* ── 基本範例 tokens.css × 風格色版 ＝ 合併後的 tokens.css ──
     下載範例檔應該是「基本範例（index.html／hl-style.css／app.js）＋這一組的顏色」，
     否則拿到 SKILL.md 也不知道怎麼套。作法：拿 starter 的 tokens.css 原文，
     把 STYLEGUIDE 那幾個顏色／圓角／陰影變數的值換成這一組的，其餘（字級、間距、版面）不動。
     後面再附上舊的 --brand／--warm 別名，既有引用不會斷。 */
  function _lum(h){h=String(h||'').replace('#','');if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];if(!/^[0-9a-f]{6}$/i.test(h))return 1;
    var c=[0,2,4].map(function(i){var v=parseInt(h.substr(i,2),16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
  function _cr(a,b){var x=_lum(a)+.05,y=_lum(b)+.05;return x>y?x/y:y/x}
  function _dk(h,f){h=h.replace('#','');return '#'+[0,2,4].map(function(i){return ('0'+Math.round(parseInt(h.substr(i,2),16)*f).toString(16)).slice(-2)}).join('')}
  function _onWhite(h){var p=h,n=0;while(_cr(p,'#fff')<4.5&&n++<10)p=_dk(p,.88);return p}
  function mergeStarterTokens(css,t){
    if(!css||!t||!t.p)return css;
    var RD=t.rd||[],SH=t.sh||[],EX=t.ex||[];
    var dark=_lum(t.bg||'#fff')<.4;
    var p=_onWhite(t.p), s=t.s||_dk(p,.85), a=_dk(s,.85);
    var page=dark?((t.i&&_lum(t.i)>.6)?t.i:'#F4F7FB'):(t.bg||'#F4F7FB');
    var heading=dark?'#1E3D60':(t.ink||'#1E3D60'), body=dark?'#62778F':(t.mu||'#62778F');
    var line=dark?'#E1E8F0':(t.ln||'#E1E8F0');
    /* 暖裝飾色：從裝飾色裡挑第一個有彩度的（灰、黑、白不算），沒有就用亮色 */
    function _chroma(h){h=String(h||'').replace('#','');if(h.length!==6)return 0;var r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16);return Math.max(r,g,b)-Math.min(r,g,b)}
    var warm=null;EX.forEach(function(x){if(!warm&&x&&x[1]&&_chroma(x[1])>40)warm=x[1]});
    warm=warm||((t.i&&_chroma(t.i)>40&&String(t.i).toUpperCase()!==String(t.bg||'').toUpperCase())?t.i:(t.s||t.c));   /* 亮色若就是頁面底（奶油底那種）畫不出形狀，退回輔色 */
    var map={
      '--color-surface-strong':p,'--color-action-bg':p,'--color-action-bg-hover':s,'--color-action-bg-active':a,
      '--color-page-bg-subtle':page,'--color-decor-sun':t.c,'--color-decor-warm':warm,
      '--color-text-secondary':heading,'--color-text-primary':_onWhite(body),'--color-text-tertiary':t.i||'#BECAD7',
      '--color-border':line,'--color-border-strong':_onWhite(body),'--color-brand-ink':heading,
      '--radius-md':RD[0]||'14px','--radius-xs':RD[1]||'12px','--radius-sm':RD[2]||'20px'
    };
    if(SH[0])map['--shadow-1']=SH[0];
    if(SH[1])map['--shadow-2']=SH[1];
    /* ── 色彩分配（2026-09-16）：讓範本頁跟首頁卡片縮圖長一樣 ──
       原本 p 只落在按鈕與連結、c 只落在裝飾形狀，其餘全是白底灰字，15 組換過去都像同一組。
       這裡多產出一組「分配」token（hl-style.css 有 fallback，沒給就維持原樣）：
         hero 底＝深色大塊（30% 裡最重的一筆）、hero CTA＝對比色 c（10%，只放這一顆）、
         次要鈕＝主色 12% 淡底、hero 裝飾圓點避免跟 hero 底同色。
       2026-09-16 先開三組給使用者看過，確認後全部套用。 */
    var extra='';
    if(window.HL_heroSpec){
      var hs=window.HL_heroSpec(t.id?t:_kitOf(t)||t);
      var hero=hs.hero,cta=hs.btn;
      function _best(bg,prefer){ /* 字色：ink 夠深且對比 ≥4.5 就用 ink；否則在白／近黑裡挑對比高的 */
        if(prefer&&_lum(prefer)<.2&&_cr(prefer,bg)>=4.5)return prefer;
        var cw=_cr('#ffffff',bg),cd=_cr('#16202B',bg);
        return cw>=cd?'#ffffff':'#16202B';
      }
      var heroFg=_best(hero,t.ink),ctaFg=_best(cta,t.ink);
      var heroLight=heroFg!=='#ffffff';
      var dot=_cr(p,hero)>=1.6?p:((t.i&&_cr(t.i,hero)>=1.6)?t.i:(heroLight?'rgba(0,0,0,.12)':'rgba(255,255,255,.35)'));
      extra='\n/* 色彩分配：hero 深色大塊＋對比色 CTA（由 HL_heroSpec 決定，與首頁卡片同一份） */\n:root{\n'+
        '  --color-hero-bg: '+hero+';\n'+
        '  --color-hero-fg: '+heroFg+';\n'+
        '  --color-hero-fg-muted: '+(heroLight?'rgba(0,0,0,.72)':'rgba(255,255,255,.86)')+';\n'+
        '  --color-cta-bg: '+cta+';\n'+
        '  --color-cta-fg: '+ctaFg+';\n'+
        '  --color-cta-bg-hover: '+_dk(cta,.9)+';\n'+
        '  --color-hero-btn2-bg: '+(heroLight?'rgba(0,0,0,.08)':'rgba(255,255,255,.16)')+';\n'+
        '  --color-hero-btn2-fg: '+heroFg+';\n'+
        '  --color-hero-dot: '+dot+';\n'+
        '  --color-btn-soft-bg: color-mix(in srgb, '+p+' 12%, #fff);\n'+
        '}\n';
    }
    var out=css.split('\n').map(function(line){
      var m=/^(\s*)(--[a-z0-9-]+)\s*:\s*([^;]*);(.*)$/i.exec(line);
      if(!m||!map.hasOwnProperty(m[2]))return line;
      return m[1]+m[2]+': '+map[m[2]]+';  /* 色版「'+(t.n||'')+'」 */';
    }).join('\n');
    return '/* 翰林視覺套版｜基本範例 tokens × 色版「'+(t.n||'')+'」'+(t.src?('　來源 '+t.src):'')+'　由套版詳細頁合併產出 */\n'
      +out.replace(/^\/\*[\s\S]*?\*\/\n?/,'')+extra+'\n'+buildTokensCss(t);
  }
  /* theme 物件多半沒有 id（採用設定只存中文名），用名字對回 kits.js 那一組 */
  function _kitOf(t){var ks=window.HL_KITS||[];for(var i=0;i<ks.length;i++){if(ks[i].n===t.n)return ks[i]}return null}

  /* ── 把基本規範併進色版 SKILL.md ──
     只取基本規範裡「色版沒有的」段落（使用說明、最高原則、無障礙、文案語氣、反模式、規範缺口、檢查清單、完整 UI 開發規範）；
     色彩／Logo／字體／形狀／元件狀態兩邊都有，以色版那份為準，不重複放。 */
  function mergeBasicSkill(kitMd,basicMd){
    if(!basicMd)return kitMd;
    var keep=['使用說明','最高原則','無障礙','文案語氣','反模式','已知的規範缺口','交付檢查清單','完整 UI 開發規範'];
    var parts=basicMd.split(/\n(?=## )/);
    var picked=parts.filter(function(p){var h=(p.match(/^## ([^\n]*)/)||[])[1]||'';return keep.some(function(k){return h.indexOf(k)===0})});
    if(!picked.length)return kitMd;
    return kitMd.replace(/\s*$/,'')+'\n\n---\n\n# 基本規範（通用，不隨色版變；來源 hanlin-web-starter/skill.md）\n\n'
      +picked.map(function(p){return p.replace(/^## /,'## ')}).join('\n\n').replace(/^(#{2,4}) /gm,function(m,h){return h+'# '})+'\n';
  }
  function dlBlob(blob,name){
    var a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=name;
    document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000);
  }


  /* 右上角「下載規範檔」：依目前的勾選打成一包 */
  function downloadKitZip(btn,st){
    if(typeof JSZip==='undefined'){
      alert('封包元件沒有載入，請重新整理後再試一次。');return;
    }
    var lab=btn?btn.innerHTML:'';
    if(btn){btn.disabled=true;
      btn.innerHTML='<span class="material-symbols-rounded" style="font-size:17px">hourglass_top</span>打包中…';}
    var pk=buildSkillPack(st);
    var zip=new JSZip();
    zip.file('theme.json',JSON.stringify(pk.theme,null,2));
    /* 基本範例檔（index.html／hl-style.css／app.js／favicon.svg／skill-basic.md）一起打包，
       tokens.css 用「starter 原文 × 這一組色值」的合併版；抓不到 starter（離線開本機檔）就退回只給色版 tokens。 */
    var theme=pk.theme.theme||{};
    var files=['index.html','hl-style.css','app.js','favicon.svg','skill.md','tokens.css'];
    Promise.all(files.map(function(f){return fetch('hanlin-web-starter/'+f).then(function(r){return r.ok?r.text():null}).catch(function(){return null})}))
    .then(function(rs){
      var starterTokens=rs[5];
      zip.file('tokens.css',starterTokens?mergeStarterTokens(starterTokens,theme):buildTokensCss(theme));
      if(rs[0])zip.file('index.html',rs[0]);
      if(rs[1])zip.file('hl-style.css',rs[1]);
      if(rs[2])zip.file('app.js',rs[2]);
      if(rs[3])zip.file('favicon.svg',rs[3]);
      /* SKILL.md ＝ 前半色版專屬（顏色、版型採用、Restyle）＋後半基本規範通用段落，一份就好 */
      zip.file('SKILL.md',mergeBasicSkill(pk.md,rs[4]));
      return zip.generateAsync({type:'blob'});
    }).then(function(blob){
      /* 檔名用 kit 的英文 id（對得上就用），中文組名在部分系統會變亂碼 */
      var kk=_kitOf(theme)||{};
      dlBlob(blob,'hanlin-'+(kk.id||pk.slug||'kit')+'-kit.zip');
    }).catch(function(){
      alert('打包時發生問題，請重新整理後再試一次。');
    }).then(function(){
      if(btn){btn.disabled=false;btn.innerHTML=lab}
    });
  }

  window.HL_buildSkillPack=buildSkillPack;
  window.HL_buildTokensCss=buildTokensCss;
  window.HL_mergeStarterTokens=mergeStarterTokens;   /* demo.html 也用同一份合併邏輯畫範本頁 */
  window.HL_dlBlob=dlBlob;
  window.HL_downloadKitZip=downloadKitZip;
})();
