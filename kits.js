/* 自動產生，請勿手改。來源：template.html 的 var PALETTES／產生器：build-kits.py
   指紋 cd67361477e4　共 15 組

   為什麼要有這個檔：index.html（套版列表）與 template.html（套版詳細）也要用同一份風格資料。
   若各自存一份，就會重演「兩邊各存一份、改了不同步」的問題。
   要改風格色版，改 template.html 裡的 var PALETTES，然後重跑 build-kits.py。

   欄位：
     id          英文代號，template.html?kit= 用（由產生器依中文名補上）
     cat         列表頁分類篩選用的分堆（同樣由產生器補上）
     n/en/src    中文名／英文名／來源規範文件
     bg/ln/mu/ink  頁面底色／分隔線／次要文字／主要文字
     tk/tkEn     四個主色的中文名與其來源 token 名
     rd[3]       圓角：按鈕chip輸入框／卡片／大區塊
     sh[2]       陰影：一般／大
     bd          元件邊線（null＝無邊線）
     ex          裝飾色 [[名稱,色碼],…]
     btn         風格色版按鈕的底色
     p/s/i/c     主色／輔色／亮色／對比色
     d           這一組的說明 */
window.HL_KITS=[
    {id:'hanlin',cat:'專業',n:'翰林學習藍',en:'STYLEGUIDE',src:'STYLEGUIDE.md',
     /* 字體排版與適用情境：這一組要長什麼樣、用在哪、不要做什麼。
        色票之外的判斷，寫在這裡才會一起進 kits.js 給列表頁與範本頁用。 */
     ty:['Noto Sans TC / 700 / 32px','Noto Sans TC / 400 / 15px / 1.8','Noto Sans TC / 500 / 15px'],tyFam:'sans',
     kw:['Professional','Trust','Education','Stable'],fit:'教育平台、後台系統、資訊密度高的產品頁',
     /* 網站類型：風格說的是長相，這個說的是拿來做什麼——列表用兩排篩選交叉過濾 */
     wt:['教育平台','後台工具','品牌官網'],
     avoid:'不用紫藍漸層與玻璃擬態；裝飾黃只作點綴，黃底一律配深藍字',
     /* 範本頁的文案：不同風格的範本，內容也不該長一樣（假資料照適用情境寫） */
     cp:{hl:'剛上國中就跟上，全科系統化學習',
         sub:'國文、英文、數學、自然、社會五科跟著學校進度走，每週一份診斷卷抓出弱點，補在該補的地方。',
         st:[['118','支課程影片'],['85.5','平均進步分'],['1046','題題庫']],
         f:[['跟課進度','對齊各版本教科書章節，開學到段考不用自己排。'],
            ['診斷測驗','每週一份，作答完立刻標出還沒穩的觀念。'],
            ['學習歷程','一學期的作答與訂正紀錄，家長端也看得到。']]},
     bg:'#F4F7FB',ln:'#EEF2F7',mu:'#62778F',ink:'#1E3D60',  /* page.bg.subtle / disabled.bg / text.primary / text.secondary */
     tk:['主要藍','深藍（hover 態）','淺藍灰','裝飾黃'],
     tkEn:['surface.strong','action.bg.hover','text.tertiary','decor.sun'],
     rd:['100px','12px','20px'],sh:['rgba(30,61,96,.03) 0 5px 15px',null],bd:null,  /* 文件寫明：radius.md 100px 給按鈕／chip／輸入框，xs 12px 卡片，sm 20px 大區塊 */
     /* 範本頁＝「技國_白話文小老師」用這一組實際套過的結果（走 engine.js，不是手改） */
     demoFile:'demo/hanlin-baihuawen-hanlin.html',
     ex:[['裝飾暖橘','#EF9D78'],['淺藍底','#F4F7FB']],
     btn:'#064EA4',  /* 風格色版按鈕底色：STYLEGUIDE surface.strong 主要藍（＝主色） */
     p:'#064EA4',s:'#05407F',i:'#BECAD7',c:'#F5D35B',
     d:'主色為主要藍，輔色是按鈕滑過時的深藍，對比色取自裝飾用的裝飾黃。'},
    {id:'musical',cat:'自然',n:'清新小森林',en:'Musical',src:'Musical-DESIGN.md',
     /* 字體排版與適用情境：這一組要長什麼樣、用在哪、不要做什麼。
        色票之外的判斷，寫在這裡才會一起進 kits.js 給列表頁與範本頁用。 */
     ty:['Noto Serif TC / 700 / 34px','Noto Sans TC / 400 / 16px / 1.85','Noto Sans TC / 500 / 15px'],tyFam:'serif',
     kw:['Natural','Calm','Warm','Life'],fit:'自然生活、food & drink、慢步調的內容型網站',
     /* 網站類型：風格說的是長相，這個說的是拿來做什麼——列表用兩排篩選交叉過濾 */
     wt:['品牌官網','電商選物','內容閱讀'],
     avoid:'不用高彩度霓虹色；奶油底不放淺灰字',
     /* 範本頁的文案：不同風格的範本，內容也不該長一樣（假資料照適用情境寫） */
     cp:{hl:'一杯手沖，把早晨慢下來',
         sub:'從產區到杯中的每一步都寫清楚：豆子怎麼來、怎麼烘、怎麼沖，回家也複製得出來。',
         st:[['12','支單品豆'],['48','場沖煮課'],['6','個合作產區']],
         f:[['產區直送','每一批都附烘焙日期與杯測分數，不做混豆。'],
            ['沖煮課程','小班制，兩小時上手手沖與義式基礎。'],
            ['訂閱配送','每月換一支當季豆，喝完再寄，不囤貨。']]},
     bg:'#FDEEBF',ln:null,mu:'#454545',ink:'#314D4A',      /* surface.muted / （無線色，推導） / text.secondary / text.primary */
     tk:['綠松石','深墨綠','奶油','琥珀'],
     tkEn:['surface.strong','text.primary','surface.muted','text.inverse'],
     rd:['30px','4px','27px'],sh:[null,null],bd:null,  /* 文件只給 xs4／sm27／md30 沒寫用途，判斷：md 給按鈕、xs 給卡片、sm 給區塊 */
     /* 這一組有一份實際套好的頁面，範本頁直接用它，不用通用的 demo.html */
     demoFile:'demo/hanlin-cloud-musical.html',
     ex:[['深灰','#454545']],
     btn:'#268270',  /* 風格色版按鈕底色：Musical surface.strong 綠松石（＝主色） */
     p:'#268270',s:'#314D4A',i:'#FDEEBF',c:'#F3A93A',
     d:'綠松石主色配奶油底，對比取琥珀。低彩度、暖調。'},
    {id:'istockapp',cat:'活潑',n:'漫畫貼紙風',en:'istockapp',src:'istockapp-SKILL.md',
     /* 字體排版與適用情境：這一組要長什麼樣、用在哪、不要做什麼。
        色票之外的判斷，寫在這裡才會一起進 kits.js 給列表頁與範本頁用。 */
     ty:['Noto Sans TC / 900 / 36px','Noto Sans TC / 400 / 15px / 1.8','Noto Sans TC / 700 / 15px'],tyFam:'sans',
     kw:['Bold','Playful','Sticker','Youth'],fit:'活動網站、兒童與青少年產品、社群互動頁',
     /* 網站類型：風格說的是長相，這個說的是拿來做什麼——列表用兩排篩選交叉過濾 */
     wt:['行銷活動','教育平台'],
     avoid:'不用柔和陰影；硬投影與 2px 邊線是這一組的識別，不可拿掉',
     /* 範本頁的文案：不同風格的範本，內容也不該長一樣（假資料照適用情境寫） */
     cp:{hl:'一整個暑假，都是遊戲場',
         sub:'十天營隊、二十場關卡、一比六的師生比。玩得起來，也帶得回去。',
         st:[['5','天營期'],['20','場關卡'],['1:6','師生比']],
         f:[['闖關任務','每天一個主題關卡，破關拿貼紙集點。'],
            ['小隊制度','六人一小隊配一位隊輔，全程不落單。'],
            ['成果發表','最後一天把作品貼滿整面牆，家長一起來。']]},
     bg:null,ln:null,mu:'#333333',ink:'#08284C',           /* 文件的 surface.base 是純黑，不適合當規範頁底，改用推導淺底 */
     tk:['金融藍','深海軍藍','螢光薄荷','橘紅'],
     tkEn:['surface.raised','border.strong','text.secondary','surface.strong'],
     rd:['39px','23px','39px'],sh:['#08284C 0 6.5px 0 0','#08284C 0 8.2px 0 0'],
     bd:'2px solid #08284C',  /* 貼紙感的兩個來源：陰影沒有模糊（0 6.5px 0 0 實心投影）＋ 有 border.strong token。
        圓角照 md 39／sm 23。這是判斷：文件沒明寫邊線寬度，取 2px 才撐得住硬投影 */
     ex:[['深灰','#333333']],
     /* 這一組有一份實際套好的頁面，範本頁直接用它，不用通用的 demo.html。
        註：這份頁面的形狀特徵（2px 邊線＋無模糊硬投影）有套到，
        但色票大多仍是 STYLEGUIDE 的藍，不是這一組的金融藍／橘紅。 */
     demoFile:'demo/hanlin-cloud-istockapp.html',
     btn:'#FF5933',  /* 風格色版按鈕底色：istockapp surface.strong 橘紅（使用者指定） */
     p:'#2C89D8',s:'#08284C',i:'#04FDBC',c:'#FF5933',
     d:'金融藍配深海軍藍，亮色是螢光薄荷，對比為橘紅。反差最強的一組。'},
    {id:'navy',cat:'人文',n:'復古文青風',en:'Navy / Ivory / Gold',src:'navy-ivory-gold-DESIGN.md',
     /* 字體排版與適用情境：這一組要長什麼樣、用在哪、不要做什麼。
        色票之外的判斷，寫在這裡才會一起進 kits.js 給列表頁與範本頁用。 */
     ty:['Noto Serif TC / 700 / 34px','Noto Sans TC / 400 / 16px / 1.85','Noto Sans TC / 500 / 15px'],tyFam:'serif',
     kw:['Editorial','Classic','Quiet','Culture'],fit:'文化、出版、品牌故事、長文閱讀',
     /* 網站類型：風格說的是長相，這個說的是拿來做什麼——列表用兩排篩選交叉過濾 */
     wt:['內容閱讀','品牌官網'],
     avoid:'金黃只作行動色，不當大面積底；不用漸層',
     /* 範本頁的文案：不同風格的範本，內容也不該長一樣（假資料照適用情境寫） */
     cp:{hl:'一本書的重量，值得慢慢讀',
         sub:'四個書系、九十六篇專欄，一年讀完一個主題。紙本與線上同步，斷點自動接續。',
         st:[['32','位專欄作者'],['96','篇長文'],['4','個書系']],
         f:[['主題書系','文學、歷史、生活、影像，一季一個主題。'],
            ['長文閱讀','為長文調過的行高與級距，讀一小時不累。'],
            ['編輯手記','每篇附編輯的選文理由，知道為什麼是這篇。']]},
     bg:'#F7F0E8',ln:'#ECE5DA',mu:'#6B6455',ink:'#0E2A48',  /* ivory / line.soft / stone / navy */
     tk:['深藍','最深藍','米白','金黃'],
     tkEn:['navy','navy.deep','ivory','gold'],
     rd:['10px','16px','22px'],sh:['0 1px 2px rgba(2,27,57,.05)','0 12px 32px -16px rgba(2,27,57,.24)'],bd:null,  /* 文件寫明：s10 按鈕／輸入框，m16 卡片，l22 大區塊 */
     /* 這一組有一份實際套好的頁面，範本頁直接用它，不用通用的 demo.html */
     demoFile:'demo/hanlin-edcafe-navy.html',
     ex:[['沙色','#DED5C6'],['次深藍','#153252'],['石灰褐','#6B6455']],
     btn:'#0E2A48',  /* 風格色版按鈕底色：navy-ivory-gold navy 深藍（＝主色） */
     p:'#0E2A48',s:'#021B39',i:'#F7F0E8',c:'#F4A910',
     d:'深藍、米白、金黃三色分工。金黃與深藍互為 7.29:1，兩者互當底色與文字都成立。'},
    /* 這套的分層邏輯與其他組不同：不是同色深淺，而是不同色相，
       「黑色是唯一的重量」。色票以 Master/assets/data.js 的 dopamine 為準：
       主色 ink（近黑，只給文字／Nav／主要動作）、輔色 violet、亮色 yellow、
       對比色 pink（＝文件版面骨架裡的 CTA 區塊底）。
       原本輔色也放 ink（跟主色同一色，色帶少一條）、對比色放 coral
       （文件裡 coral 的用途是「次要動作、警示裝飾」，不是 CTA）——都已改正。 */
    {id:'dopamine',cat:'潮流',n:'多巴胺潮風',en:'Dopamine',src:'DESIGN-dopamine.md',
     /* 字體排版與適用情境。字級照 font.size.4xl 30px 上限；base 字重 300 是文件給的，
        標題字重文件沒寫，取 700（判斷）。字體是 Inter，不是其他組的 Noto Sans TC。 */
     ty:['Inter / 700 / 30px','Inter / 300 / 15px / 1.5','Inter / 500 / 15px'],tyFam:'inter',
     kw:['Dopamine','Playful','Pastel','Multi-hue'],fit:'行銷網站、活動頁、社群與潮流型產品',
     /* 網站類型：風格說的是長相，這個說的是拿來做什麼——列表用兩排篩選交叉過濾 */
     wt:['行銷活動','品牌官網'],
     avoid:'近黑不可當頁面、Hero 或整段背景（面積 ≤15%）；粉彩底不可放淺色文字；語義色不可提高彩度；已用色相分隔的區塊不要再加邊線',
     /* 範本頁的文案：不同風格的範本，內容也不該長一樣（假資料照適用情境寫） */
     cp:{hl:'這個週末，把城市變成調色盤',
         sub:'三天、十八個攤位、七種顏色。走完一圈，手裡會多出一堆不知道什麼時候買的東西。',
         st:[['3','天展期'],['18','個攤位'],['7','種主題色']],
         f:[['選物市集','每一攤都有自己的顏色，好找也好拍。'],
            ['現場工作坊','三十分鐘做一個帶得走的小東西。'],
            ['集章換物','走滿五攤換限定貼紙，走滿十攤換托特包。']]},
     bg:'#FBF5E9',ln:'#E6DFD3',mu:'#6B645F',ink:'#171315',  /* surface.base / line / text.secondary / text.primary */
     tk:['近黑','深化薰衣草','亮黃','粉'],
     tkEn:['ink','info','surface.strong / accent.yellow','accent.pink'],
     /* 文件只給 radius.xs 4／sm 27／md 30，沒有 pill token。
        判斷：md 30 給按鈕／chip／輸入框（文件說 pill buttons，30px 在 48px 高的按鈕上已接近膠囊）、
        xs 4 給卡片、sm 27 給大區塊。文件沒有 shadow token，陰影留空＝不加陰影。 */
     rd:['30px','4px','27px'],sh:[null,null],bd:null,
     /* 版面骨架照文件：ink 只能用在文字、圖示、主要動作、Nav／Tab 與頁尾，
        不可當頁面底、Hero 底或整段背景；Hero 用 surface.strong 亮黃、CTA 用 pink。
        ink 底上的文字是 text.inverse 米白 #FBF5E9，不是純白。 */
     lay:{nav:'#171315',navFg:'#FBF5E9',hero:'#FBE472',cta:'#F2BBDB',footer:'#171315'},
     /* 這一組有一份實際套好的頁面，範本頁直接用它，不用通用的 demo.html。
        沒有這一欄的組就用 demo.html?kit= 產生。 */
     demoFile:'demo/hanlin-expo-dopamine.html',
     /* 第三欄是用途，照來源文件的 token 表寫，不是自己編的 */
     ex:[['surface.card','#FFFFFF','卡片底'],
         ['surface.muted','#EEECFB','安靜區段的底'],
         ['text.inverse','#FBF5E9','只用於 ink 實底上的文字'],
         ['accent.coral','#FD9D9E','次要動作、警示裝飾'],
         ['accent.mint','#BAE3DF','卡片、成功語意'],
         ['accent.lilac','#C5C0F0','卡片、AI 與智慧功能'],
         ['accent.sage','#C6CDA1','備用色相'],
         ['yellow.soft','#FEF8DC','警示底、hover 底'],
         ['pink.soft','#FCEBF4','區段底'],
         ['coral.soft','#FFE5E5','危險底'],
         ['mint.soft','#E4F4F2','成功底'],
         ['lilac.soft','#EEECFB','資訊底'],
         ['danger','#C0392B','錯誤，白底 5.44:1'],
         ['success','#1E6F50','成功，白底 6.10:1'],
         ['warn','#8A5A00','警示，白底 5.93:1']],
     btn:'#FD9D9E',  /* 風格色版按鈕底色：多巴胺 coral 珊瑚（使用者指定） */
     p:'#171315',s:'#5B4FA8',i:'#FBE472',c:'#F2BBDB',
     d:'多色粉彩鋪在米白底上，近黑是全頁唯一的重量但只佔 15% 以內；色相負責分工，不負責層級（並排兩張卡是粉與薄荷，不是同色深淺兩階）。'},

    /* 這套的識別來自「區塊之間的強弱落差」，不是整體明暗。
       主色取 color.forest（Hero／Footer／標題／當前位置），深色取 forest.deep，
       亮色取 sage、對比取 amber —— 後兩者在原文件裡都標明「僅色塊與裝飾，
       不可承載小字」，要當文字色得改用 amber.deep #8A5A00。 */
    {id:'moroccan',cat:'人文',n:'摩洛哥風情',en:'Moroccan',src:'摩洛哥-DESIGN.md',
     /* 字體排版與適用情境：這一組要長什麼樣、用在哪、不要做什麼。
        色票之外的判斷，寫在這裡才會一起進 kits.js 給列表頁與範本頁用。 */
     ty:['Noto Serif TC / 700 / 34px','Noto Sans TC / 400 / 16px / 1.85','Noto Sans TC / 500 / 15px'],tyFam:'serif',
     kw:['Earthy','Craft','Warm','Travel'],fit:'旅遊、選物、手作與生活風格網站',
     /* 網站類型：風格說的是長相，這個說的是拿來做什麼——列表用兩排篩選交叉過濾 */
     wt:['電商選物','品牌官網','內容閱讀'],
     avoid:'鼠尾草綠與琥珀黃僅供色塊，不承載小字；要當文字色改用 #8A5A00',
     /* 範本頁的文案：不同風格的範本，內容也不該長一樣（假資料照適用情境寫） */
     cp:{hl:'從麥地那的巷子，帶回來的顏色',
         sub:'九條路線、三座城市、二十四件選物。每一件都寫得出它從哪裡來、誰做的。',
         st:[['9','條深度路線'],['24','件手作選物'],['3','座城市']],
         f:[['深度路線','不趕點，一天只走一區，走進巷子裡。'],
            ['職人選物','陶器、地毯、銅器，全部標明工坊與作者。'],
            ['旅程手記','回來以後才寄出的紙本手記，補完沒說完的部分。']]},
     bg:'#EDEFEA',ln:'#DCE6DD',mu:'#5C6B60',ink:'#0C3B2E',  /* paper / line / muted / forest */
     tk:['深墨綠','最深墨綠','鼠尾草綠','琥珀黃'],
     tkEn:['forest','forest.deep','sage','amber'],
     rd:['999px','16px','22px'],sh:['0 1px 2px rgba(12,59,46,.05)','0 12px 32px -16px rgba(12,59,46,.24)'],bd:null,  /* 文件寫明：pill 999 按鈕／chip，m16 卡片，l22 大區塊 */
     ex:[['焦糖','#BB8A52'],['中綠','#3D6B52'],['深焦糖','#8A6534']],
     btn:'#BB8A52',  /* 風格色版按鈕底色：摩洛哥 caramel 焦糖（使用者指定） */
     p:'#0C3B2E',s:'#072A20',i:'#6D9773',c:'#FFBA00',
     d:'深墨綠扛主結構，琥珀黃做主要動作與行動呼籲。鼠尾草綠與琥珀黃僅供色塊，不承載小字。'},
    {id:'dawho',cat:'科技',n:'午夜金融藍',en:'dawho',src:'dawho-DESIGN.md',
     /* 字體排版與適用情境：這一組要長什麼樣、用在哪、不要做什麼。
        色票之外的判斷，寫在這裡才會一起進 kits.js 給列表頁與範本頁用。 */
     ty:['Noto Sans TC / 700 / 32px','Noto Sans TC / 400 / 15px / 1.8','Noto Sans TC / 500 / 15px'],tyFam:'sans',
     kw:['Tech','Night','Finance','Clean'],fit:'金融、數據儀表板、深色介面產品',
     /* 網站類型：風格說的是長相，這個說的是拿來做什麼——列表用兩排篩選交叉過濾 */
     wt:['後台工具','電商選物'],
     avoid:'對比暖橘只用於行內強調；純黑底不放低彩度灰字',
     /* 範本頁的文案：不同風格的範本，內容也不該長一樣（假資料照適用情境寫） */
     cp:{hl:'盤後十分鐘，看完一天的部位',
         sub:'六個帳戶合併成一張表，二十四小時監控，兩百毫秒更新一次。該看的都在第一屏。',
         st:[['6','個帳戶合併'],['24h','不間斷監控'],['0.2s','報價更新']],
         f:[['部位總覽','跨券商合併計算，不用自己開試算表。'],
            ['風險警示','跌破設定值立刻推播，不必盯盤。'],
            ['盤後報表','收盤後自動產出，隔天開盤前寄到信箱。']]},
     bg:'#E5F6FF',ln:'#B8E7FF',mu:'#5A7080',ink:'#06283A',  /* surface.strong / surface.raised /（文件無次要文字與主要文字的淺底版本，推導）*/
     tk:['亮藍','純黑','天藍','琥珀橘'],
     tkEn:['text.tertiary','surface.base','text.inverse','（文件未給，判斷）'],
     rd:['32px','8px','32px'],sh:[null,null],bd:null,  /* 文件給 xs4／sm8／md32／lg60／xl100 但沒寫用途，判斷：md 32 給按鈕／chip／輸入框、sm 8 給卡片、大區塊沿用 32（lg 60 留給主視覺圖，當區塊圓角過大）。文件沒有 shadow token，陰影留空＝退回頁面原本的樣式 */
     ex:[['純黑底','#000000'],['淺藍底','#B8E7FF'],['極淺藍','#E5F6FF']],
     btn:'#0094DF',  /* 風格色版按鈕底色：dawho text.tertiary 亮藍（＝主色）*/
     p:'#0094DF',s:'#000000',i:'#2DB6FB',c:'#FF9F1C',
     d:'純黑底配亮藍，是文件本身的深色介面配色；淺藍與極淺藍作淺底層次。文件沒有給對比色，判斷取主色的互補暖橘，只用於行內強調。'},
    /* ── 以下 8 組來自 測試/規範產出，2026-09-04 新增 ──
       六份「-DESIGN」共用同一組形狀 token：radius sm 12／md 20／pill 999，
       沒有 shadow token（文件明寫「不得靠陰影做層級，明度差不足時改用另一個底色」）。
       本結構的 rd[0] 是按鈕／chip／輸入框共用，塞不下 radius-sm 12px 給輸入框那一項。 */

    {id:'mustard',cat:'人文',n:'芥黃刊物',en:'Mustard Journal',src:'芥黃刊物-DESIGN.md',
     ty:['Noto Sans TC / 700 / 34px / 行高 1.2','Noto Sans TC / 400 / 16px / 1.8','Noto Sans TC / 700 / 15px'],tyFam:'sans',
     kw:['Editorial','Paper','Warm','Retro'],fit:'刊物、專題報導、品牌故事與長文閱讀',
     wt:['內容閱讀','品牌官網'],
     avoid:'不得靠陰影做層級，明度差不足時改用另一個底色；中文標題不套襯線；淡紫與灰綠只做欄位分隔，不當大面積底',
     cp:{hl:'紙的重量，螢幕上也留得住',
         sub:'米色紙感底配深褐文字，芥黃只出現在該被看見的地方。一次一個專題，不趕稿。',
         st:[['24','篇專題'],['6','位特約作者'],['4','期／年']],
         f:[['專題企劃','一期一個主題，從企劃到成稿全程留紀錄。'],
            ['作者專欄','每位作者一個固定欄位，讀者追得到人。'],
            ['紙本訂閱','線上先讀，紙本季刊寄到家。']]},
     bg:'#E7D4C3',ln:'#C5B3A4',mu:'#5B4B43',ink:'#2C1D18',  /* paper / line / muted / espresso */
     tk:['深咖啡','極深階','淡粉','芥黃'],
     tkEn:['espresso','charcoal','blush','mustard'],
     rd:['999px','20px','20px'],sh:[null,null],bd:null,
     lay:{nav:'#2C1D18',navFg:'#FFFFFF',hero:'#EEC66F',cta:'#EEC66F',footer:'#1C1616'},
     ex:[['paper','#E7D4C3','頁面底。米色紙感，佔比 50.5%'],
         ['card','#F3E9E0','卡片底'],
         ['lilac','#BD9FC3','欄位分隔'],
         ['taupe','#A89586','次要文字、細線'],
         ['sage','#78A58E','欄位分隔']],
     btn:'#EEC66F',
     p:'#2C1D18',s:'#1C1616',i:'#E0C4C0',c:'#EEC66F',
     d:'米色紙感底配深褐文字，芥黃是唯一的大面積強調，淡紫與灰綠只做欄位分隔。'},

    /* 深色介面：文件本身就設計成深墨綠底配淺綠白文字，不是抽取瑕疵 */
    {id:'pine',cat:'人文',n:'墨綠聖誕',en:'Pine & Gold',src:'墨綠聖誕-DESIGN.md',
     ty:['Noto Sans TC / 700 / 34px / 行高 1.2','Noto Sans TC / 400 / 16px / 1.8','Noto Sans TC / 700 / 15px'],tyFam:'sans',
     kw:['Festive','Deep','Gold','Winter'],fit:'節慶檔期、禮盒選物與限時活動頁',
     wt:['電商選物','行銷活動'],
     avoid:'金色只做主要行動與強調，不可大面積鋪；深底上不放中灰字，一律用 snow 或 muted',
     cp:{hl:'今年的禮，想好了嗎',
         sub:'深墨綠底把商品襯出來，金色只留給真正要被點的地方。十二月一日開跑。',
         st:[['128','款禮盒'],['12/1','檔期開跑'],['3','種包裝']],
         f:[['禮盒選配','三種包裝、兩種卡片，結帳前都能改。'],
            ['指定日到貨','選好日期，當天早上送到。'],
            ['企業採購','五十份以上專人對接，可客製卡片。']]},
     bg:'#183A22',ln:'#3E5B45',mu:'#D7E1D1',ink:'#ECF3E4',  /* pine / line / muted / snow */
     tk:['深墨綠','最深階','苔綠','金'],
     tkEn:['pine','spruce','moss','gold'],
     rd:['999px','20px','20px'],sh:[null,null],bd:null,
     lay:{nav:'#111111',navFg:'#FFFFFF',hero:'#183A22',cta:'#E3C874',footer:'#111111'},
     ex:[['moss','#4D692D','卡片底、次級底'],
         ['spruce','#142C15','最深階。頁尾、浮層'],
         ['amber','#FF9831','側欄標籤、次要按鈕底'],
         ['berry','#ED5A5A','促銷徽章底'],
         ['snow','#ECF3E4','主要文字']],
     btn:'#E3C874',
     p:'#183A22',s:'#142C15',i:'#4D692D',c:'#E3C874',
     d:'深墨綠底配淺綠白文字，金色只做主要行動與強調。苔綠當卡片底，靠色相分層不靠深淺。'},

    {id:'clash',cat:'活潑',n:'撞色旅途',en:'Clash Trip',src:'撞色旅途-DESIGN.md',
     ty:['Noto Sans TC / 900 / 36px / 行高 1.2','Noto Sans TC / 400 / 16px / 1.8','Noto Sans TC / 700 / 15px'],tyFam:'sans',
     kw:['Bold','Clash','Pop','Travel'],fit:'旅遊商品、促銷檔期與高反差的行銷頁',
     wt:['電商選物','行銷活動'],
     avoid:'螢光黃只做分區底與促銷帶，不承載小字；黑色線稿是識別，不可改成灰',
     cp:{hl:'下一站，隨便挑一個顏色',
         sub:'白底把顏色讓出來，珊瑚、水藍、玫瑰各自分區，螢光黃留給促銷帶。',
         st:[['36','條路線'],['8','個國家'],['24h','客服']],
         f:[['自由配行程','挑城市、挑天數，剩下的我們排。'],
            ['機加酒一次搞定','價格直接顯示，不用再點進去算。'],
            ['出發前提醒','簽證、天氣、行李規定，出發前七天一次寄給你。']]},
     bg:'#FFFFFF',ln:'#D1D1D1',mu:'#595959',ink:'#000000',  /* white / line / muted / ink */
     tk:['黑','沙色','珊瑚','螢光黃'],
     tkEn:['ink','sand','coral','lemon'],
     rd:['999px','20px','20px'],sh:[null,null],bd:null,
     lay:{nav:'#000000',navFg:'#FFFFFF',hero:'#FDF032',cta:'#FDF032',footer:'#000000'},
     ex:[['coral','#F39C80','分區底'],
         ['aqua','#52C4DF','分區底'],
         ['rose','#EF9CB0','分區底'],
         ['sand','#F1DABB','柔和區塊底'],
         ['azure','#00A0FE','連結色塊、資訊標籤']],
     btn:'#FDF032',
     p:'#000000',s:'#F1DABB',i:'#F39C80',c:'#FDF032',
     d:'白底讓位給顏色，珊瑚、水藍、玫瑰各自分區，螢光黃只留給促銷帶。黑色線稿是識別。'},

    {id:'avocado',cat:'自然',n:'酪梨青檸',en:'Avocado & Lime',src:'酪梨青檸-DESIGN.md',
     ty:['Noto Sans TC / 700 / 34px / 行高 1.2','Noto Sans TC / 400 / 16px / 1.8','Noto Sans TC / 700 / 15px'],tyFam:'sans',
     kw:['Fresh','Organic','Green','Food'],fit:'食品、有機選物與生活風格品牌',
     wt:['品牌官網','電商選物'],
     avoid:'橘只做標題強調與 CTA 色塊，不當大面積底；卡其底上不放淺字',
     cp:{hl:'今天的菜，昨天還在土裡',
         sub:'酪梨綠鋪滿整頁，橘色只出現在要你動手的地方。產地到餐桌不超過二十四小時。',
         st:[['24h','產地直送'],['48','家合作農場'],['0','化學添加']],
         f:[['當季配送','當週採收什麼就配什麼，不冷藏囤貨。'],
            ['農場履歷','每一箱附產地與採收日，掃碼看得到人。'],
            ['份量自選','一人份到四人份，隨時可以改。']]},
     bg:'#CDDEB2',ln:'#B6C39C',mu:'#544F3C',ink:'#4E4736',  /* avocado / line / muted / bark */
     tk:['橄欖褐','黑','卡其','橘'],
     tkEn:['bark','ink','khaki','vermilion'],
     rd:['999px','20px','20px'],sh:[null,null],bd:null,
     lay:{nav:'#4E4736',navFg:'#FFFFFF',hero:'#CDDEB2',cta:'#FF5E03',footer:'#4E4736'},
     ex:[['pale','#E6EFD9','卡片底'],
         ['khaki','#D5CB86','次級區塊底、影片牆'],
         ['mint','#98DEBB','分區色塊'],
         ['moss','#919777','次要文字、分隔'],
         ['ink','#000000','線稿、極重標題']],
     btn:'#FF5E03',
     p:'#4E4736',s:'#000000',i:'#D5CB86',c:'#FF5E03',
     d:'酪梨綠當頁面底佔六成五，橘色只做標題強調與 CTA。層級靠色相分區，不靠同色深淺。'},

    {id:'trail',cat:'自然',n:'林蔭野趣',en:'Forest Trail',src:'林蔭野趣-DESIGN.md',
     ty:['Noto Sans TC / 700 / 34px / 行高 1.2','Noto Sans TC / 400 / 16px / 1.8','Noto Sans TC / 700 / 15px'],tyFam:'sans',
     kw:['Natural','Outdoor','Calm','Trail'],fit:'戶外、自然教育與慢步調的內容型網站',
     wt:['內容閱讀','品牌官網'],
     avoid:'金色只做標籤與按鈕底，不承載小字；分區標籤的四個色相不可拿來當大面積底',
     cp:{hl:'走進林子，把速度留在入口',
         sub:'米黃底配深綠字，薄荷色切分章節。九條步道，一次只走一條。',
         st:[['9','條步道'],['4','季導覽'],['2h','平均行程']],
         f:[['步道地圖','離線可看，沿途標示水源與遮蔽點。'],
            ['季節導覽','每季換一批解說主題，看得到當季的東西。'],
            ['親子路線','三公里以內、坡度平緩，推車也走得過。']]},
     bg:'#FEFEDE',ln:'#D3DBC0',mu:'#3F6159',ink:'#0F3A38',  /* cream / line / muted / forest */
     tk:['深森綠','草綠','薄荷','金'],
     tkEn:['forest','grass','mint','gold'],
     rd:['999px','20px','20px'],sh:[null,null],bd:null,
     lay:{nav:'#0F3A38',navFg:'#FFFFFF',hero:'#C0DFD5',cta:'#DEAF5F',footer:'#0F3A38'},
     /* 這一組有一份實際套好的頁面，範本頁直接用它 */
     demoFile:'demo/map-history-trail.html',
     ex:[['mint','#C0DFD5','次級區塊底。切分章節'],
         ['lemon','#E8E6AD','第三層區塊底'],
         ['sage','#618C81','次要文字、圖說'],
         ['grass','#8AAE4C','分區標籤'],
         ['sky','#5AB6FE','分區標籤、連結色塊'],
         ['apricot','#D58147','秋季分區標籤'],
         ['brick','#D16544','強調數字底']],
     btn:'#DEAF5F',
     p:'#0F3A38',s:'#8AAE4C',i:'#C0DFD5',c:'#DEAF5F',
     d:'米黃底配深森綠文字，薄荷色切分章節，金色只做標籤與按鈕底。'},

    /* 深色介面：文件本身就是深藍紫底，不是抽取瑕疵。
       這一組的對比色與主要行動底不同色——accent 是黃、cta 是桃紅，照文件分開填。 */
    {id:'neon',cat:'潮流',n:'藍夜霓虹',en:'Neon Night',src:'藍夜霓虹-DESIGN.md',
     ty:['Noto Sans TC / 900 / 36px / 行高 1.2','Noto Sans TC / 400 / 16px / 1.8','Noto Sans TC / 700 / 15px'],tyFam:'sans',
     kw:['Neon','Night','Vivid','Sale'],fit:'夜間檔期、促銷活動與高彩度的行銷頁',
     wt:['行銷活動','電商選物'],
     avoid:'桃紅是裝飾色塊，不可承載文字；深底上不放中灰字，一律用白或 muted',
     cp:{hl:'晚上十點，全站開跑',
         sub:'深藍紫底把霓虹色撐起來，黃色只給重點數字與當前狀態，桃紅只做行動。',
         st:[['22:00','開跑時間'],['48h','檔期'],['1,200+','參與品項']],
         f:[['限時加碼','整點翻牌，每小時換一批。'],
            ['滿額回饋','門檻直接顯示在購物車，不用自己算。'],
            ['到貨提醒','缺貨的先登記，補到就推播。']]},
     bg:'#1F2969',ln:'#475084',mu:'#A5A9C3',ink:'#FFFFFF',  /* navy / line / muted / white */
     tk:['深藍紫','最深階','水藍','黃'],
     tkEn:['navy','alt','cyan','accent'],
     rd:['999px','20px','20px'],sh:[null,null],bd:null,
     lay:{nav:'#111111',navFg:'#FFFFFF',hero:'#1F2969',cta:'#DD1F72',footer:'#111111'},
     ex:[['card','#2A3480','卡片底'],
         ['cyan','#16B5D5','次級橫幅、資訊區塊'],
         ['magenta','#FB2381','裝飾色塊（不可承載文字）'],
         ['gold','#F5B715','次級強調、標籤底'],
         ['crimson','#CA3843','頁籤列、次級促銷底'],
         ['orange','#FF6920','裝飾形狀、次要標籤']],
     btn:'#FAD852',
     p:'#1F2969',s:'#151C4A',i:'#16B5D5',c:'#FAD852',
     d:'深藍紫底撐起霓虹色，黃色給重點數字與當前狀態，桃紅只做主要行動。裝飾桃紅不承載文字。'},

    /* 這兩組來自「-規範」那一批（自動抽取）。文件把 surface.base 標成純黑並自己註明
       「幾乎確定是抽取瑕疵，來源站不是純黑底頁」——頁面底改抓文件裡的淺輔助色，
       其餘色票照文件值，判斷處都標在下面。 */
    {id:'douclass',cat:'專業',n:'學堂紫',en:'douclass',src:'douclass-DESIGN-規範.md',
     ty:['Noto Sans TC / 700 / 24px','Noto Sans TC / 400 / 16px / 1.5','Noto Sans TC / 700 / 15px'],tyFam:'sans',
     kw:['Purple','Learning','Clean','Calm'],fit:'線上課程、學習平台與後台系統',
     wt:['教育平台','後台工具'],
     avoid:'文件把 text.primary 訂為 #666666，壓在主色上只有 1.09:1，深紫底一律改用白字；font.size.xs 是 0px，不可使用',
     cp:{hl:'一堂課，從報名到結業都在這裡',
         sub:'紫色只出現在主要動作與當前位置，其餘一律留白。介面安靜，內容才看得見。',
         st:[['320','門課程'],['48','位講師'],['92%','完課率']],
         f:[['課程管理','章節、教材與作業一頁排完。'],
            ['學習進度','看得到每個人卡在哪一章。'],
            ['結業證明','完課自動產出，可驗證。']]},
     bg:'#F7F4FB',ln:'#E0E0E0',mu:'#666666',ink:'#333333',  /* 淺紫底（文件的淺輔助色）/ line / text.primary / text.secondary */
     tk:['主紫','深灰','淺紫','琥珀'],
     tkEn:['surface.strong','text.secondary','lilac.soft','（文件未給對比色，判斷）'],
     rd:['999px','25px','30px'],sh:[null,null],bd:null,  /* 文件給 xs8／sm20／md25／lg28／xl30／2xl50，判斷：按鈕 pill、卡片 md25、大區塊 xl30 */
     lay:{nav:'#7747B5',navFg:'#FFFFFF',hero:'#7747B5',cta:'#E8A33D',footer:'#333333'},
     ex:[['surface.soft','#F7F4FB','頁面底（文件的淺輔助色，取代純黑的 surface.base）'],
         ['lilac.soft','#EFE9F6','區塊底'],
         ['lilac','#DED3ED','卡片底、標籤底'],
         ['lilac.mid','#B49AD6','次級強調'],
         ['slate','#9499A6','次要文字、圖示'],
         ['gray.soft','#F6F6F6','停用底']],
     btn:'#7747B5',
     p:'#7747B5',s:'#333333',i:'#DED3ED',c:'#E8A33D',   /* 對比色文件沒給，判斷取主紫的互補暖琥珀，只用於行內強調與 CTA */
     d:'主紫只出現在主要動作與當前位置，其餘用淺紫階做層次。文件沒給對比色，判斷取互補暖琥珀。'},

    {id:'gov',cat:'專業',n:'公務金黃',en:'gov',src:'gov-DESIGN-規範.md',
     ty:['Noto Sans TC / 700 / 26px','Noto Sans TC / 400 / 16px / 1.7','Noto Sans TC / 700 / 15px'],tyFam:'sans',
     kw:['Official','Warm','Clear','Trust'],fit:'公部門、公告佈告與資訊型網站',
     wt:['品牌官網','內容閱讀'],
     avoid:'金黃底一律配近黑字（白字只有 1.57:1，文件已標為不合格）；純黑的 surface.base 不可當頁面底',
     cp:{hl:'該辦的事，一頁就查得到',
         sub:'米白底配深褐字，金黃只用在要被點的地方。公告、表單、進度，分三區不混在一起。',
         st:[['186','項線上服務'],['24h','線上申辦'],['3','個工作天']],
         f:[['線上申辦','表單填完直接送出，不用臨櫃。'],
            ['進度查詢','案件編號一查到底，每一關都看得到。'],
            ['公告佈告','依單位與日期分類，可訂閱通知。']]},
     bg:'#FFF8EA',ln:'#E2DEDC',mu:'#6B4632',ink:'#3B2117',  /* color.soft 淺奶油（取代純黑的 surface.base）/ line / text.primary / text.secondary */
     tk:['磚橘','深褐','淺金','金黃'],
     tkEn:['text.tertiary','text.secondary','mid','surface.strong'],
     rd:['999px','20px','20px'],sh:[null,null],bd:null,  /* 文件只給 radius.xs=999px，判斷：按鈕與 chip 用 pill，卡片與大區塊取 20px */
     lay:{nav:'#3B2117',navFg:'#FFFFFF',hero:'#FFC551',cta:'#FFC551',footer:'#3B2117'},
     ex:[['soft','#FFF8EA','頁面底（文件的淺輔助色，取代純黑的 surface.base）'],
         ['soft.2','#FFFCF5','最淺階'],
         ['soft.3','#FFF1D5','次級區塊底'],
         ['mid','#FFDF9F','淺金。標籤底、hover 底'],
         ['raised','#AAA39B','浮起層、停用底']],
     btn:'#FFC551',
     p:'#C04C08',s:'#3B2117',i:'#FFDF9F',c:'#FFC551',
     d:'米白底配深褐文字，磚橘撐結構，金黃只做主要行動。金黃底一律配近黑字，文件實測白字只有 1.57:1。'},

];
window.HL_KITS_VERSION='cd67361477e4';
