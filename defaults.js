/* 預設組合的單一真相源。
   首頁的「使用預設」卡片與各頁頂帶的「預設」按鈕，套的都是這一份。
   原本 index／brand／import／preview 各自寫一份一模一樣的物件，
   只要有人只改其中一份，「按首頁的預設」和「按頂帶的預設」就會得到不同結果——
   跟 Master／data.js 各存一份的老問題是同一個病。
   要改預設值，改這裡，不要在頁面裡再寫一份。 */
window.HL_QUICK_DEFAULT={
  theme:{n:'翰林藍',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},
  contrast:'auto',
  logoLight:2,logoDark:2,logoInv:false,
  groups:{hd:1,ft:2,hero:1,fm:1,opt:1,tblsty:0,icon:0},
  controls:{btn:true,seg:true,select:true,label:true,principles:true,midcolor:true,gray:true,softtile:true,rwd:true,type:true,shape:true},
  memberEntry:true
};

/* 頂帶「預設」按鈕的共用行為：確認後寫入預設組合、清掉匯入紀錄、帶著一次性通行證跳到版型預覽。
   風格庫與套版詳細兩頁用這個掛，不再各抄一份預設值。 */
window.HL_bindQuickDefault=function(){
  document.querySelectorAll('.qd').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      if(localStorage.getItem('hanlin-brand-theme')&&
         !confirm('將套用「預設」組合，覆蓋你目前的採用設定。確定要繼續嗎？'))return;
      localStorage.setItem('hanlin-brand-theme',JSON.stringify(window.HL_QUICK_DEFAULT));
      localStorage.removeItem('hanlin-import-html');
      localStorage.removeItem('hanlin-skill-blocks');
      localStorage.removeItem('hanlin-import-pending');
      try{sessionStorage.setItem('hanlin-handoff',JSON.stringify({to:'preview.html',t:Date.now()}))}catch(err){}
      location.href='preview.html';
    });
  });
};

/* 採用中的那一組要進哪一頁。
   採用設定裡只存中文名，拿它去 kits.js 對得上，就進「套版詳細」看那一組的樣板；
   對不上（例如預設組合的「翰林藍」不是任何一份規範文件的色版）才退回版型預覽。 */
window.HL_adoptedKitId=function(){
  try{
    var n=((JSON.parse(localStorage.getItem('hanlin-brand-theme'))||{}).theme||{}).n||'';
    var ks=window.HL_KITS||[];
    for(var i=0;i<ks.length;i++){if(ks[i].n===n)return ks[i].id}
  }catch(e){}
  return '';
};
window.HL_previewTarget=function(){
  var id=window.HL_adoptedKitId();
  return id?('template.html?kit='+encodeURIComponent(id)):'preview.html';
};

/* ── 乾淨進入時清掉匯入流程的資料 ───────────────────────────────────
   挑風格的三頁（首頁／視覺套版列表／套版詳細）共用這一份，不各寫一份。

   問題：hanlin-import-html 原本是永久保存的，只有匯入頁自己會清。
   結果是匯入過一次之後，之後不管重整幾次、隔幾天再進來挑風格，
   步驟列都還停在「第 3 步 挑視覺套版」，把人綁在一個早就結束的流程裡
   ——使用者只是想重選風格套版而已。

   規則：帶著一次性通行證的跳頁（＝流程進行中）完全不動；
   重新整理，或新分頁／新工作階段進來，就把匯入流程的資料清乾淨。
   hanlin-brand-theme（使用者挑的風格）不在清單裡——那是他正在選的東西，
   清掉就變成「選了風格卻退回預設藍」。 */
window.HL_FLOW_KEYS={
  local:['hanlin-import-html','hanlin-import-opts','hanlin-import-done',
         'hanlin-skill-blocks','hanlin-import-pending','hanlin-show-result',
         'hanlin-settings-saved'],
  session:['hanlin-import-styled','hanlin-import-live']
};
window.HL_freshEntryReset=function(handoff){
  if(handoff)return [];
  var fresh=false;
  try{
    var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||null;
    var reloaded=nav?(nav.type==='reload')
                    :!!(performance.navigation&&performance.navigation.type===1);
    fresh=reloaded||!sessionStorage.getItem('hanlin-session');
  }catch(e){fresh=true}
  try{sessionStorage.setItem('hanlin-session','1')}catch(e){}
  if(!fresh)return [];
  var cleared=[];
  window.HL_FLOW_KEYS.local.forEach(function(k){
    try{if(localStorage.getItem(k)!==null){localStorage.removeItem(k);cleared.push(k)}}catch(e){}
  });
  window.HL_FLOW_KEYS.session.forEach(function(k){
    try{if(sessionStorage.getItem(k)!==null){sessionStorage.removeItem(k);cleared.push(k)}}catch(e){}
  });
  return cleared;
};

/* ── 匯入流程的步驟列（挑選頁專用）───────────────────────────────────
   使用者從匯入頁按「調整樣式」過來挑套版時，步驟列要一路跟著，
   不然一離開匯入頁就沒有進度感，不知道挑完該回哪裡。

   這裡只負責「顯示」，不改任何狀態：
     手上沒有匯入中的檔案就完全不出現；有的話固定停在第 3 步。
   匯入頁自己那一份有完整的四段判定（它才知道 previewReady／lastBranded），
   兩邊不共用邏輯只共用外觀，避免挑選頁去猜匯入頁的內部狀態而說錯話。 */
window.HL_importFlowBar=function(){
  /* 判定依據是 sessionStorage 的 hanlin-import-live，不是 localStorage 有沒有檔案。
     hanlin-import-html 已改成永久保存，拿它當「正在匯入」的依據等於永遠成立——
     匯入過一次之後，之後每次進來挑風格都會看到停在第 3 步的步驟列。
     （import.html 自己早就是用 import-live 判斷「本分頁匯入過」，這裡沿用同一個旗標。）
     檔案也要還在：使用者手動清掉之後就不該再顯示流程。 */
  var live=false,has=false;
  try{ live=sessionStorage.getItem('hanlin-import-live')==='1' }catch(e){}
  try{ has=!!localStorage.getItem('hanlin-import-html') }catch(e){}
  if(!live||!has)return;
  var main=document.querySelector('main');
  if(!main||document.getElementById('flow'))return;

  var nm='';
  try{ nm=((JSON.parse(localStorage.getItem('hanlin-brand-theme')||'{}').theme)||{}).n||'' }catch(e){}

  var css=document.createElement('style');
  css.textContent=
   '.flow{display:flex;flex-wrap:wrap;gap:10px;list-style:none;margin:0 0 20px;padding:0}'
  /* 未開始用白底（使用者回報淺灰看不清楚），層次用淡陰影不加邊線 */
  +'.flow li{flex:1 1 190px;display:flex;align-items:flex-start;gap:12px;background:#fff;'
  +'border-radius:14px;padding:15px 18px;box-shadow:0 1px 3px rgba(20,45,70,.09)}'
  +'.flow-n{flex:none;width:28px;height:28px;border-radius:50%;background:#EEF2F7;color:#626A78;'
  +'font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;'
  +'margin-top:1px}'
  +'.flow-t{min-width:0}'
  +'.flow-t b{display:block;font-size:14px;font-weight:700;color:#3A3D42;letter-spacing:.02em}'
  /* 副標 #626A78 在 #EEF2F7 上 4.85:1；--gray-2 #8C9099 只有 2.85:1，11.5px 不合格 */
  +'.flow-t i{display:block;font-style:normal;font-size:11.5px;color:#626A78;line-height:1.7;margin-top:3px}'
  /* 已完成用米底＋橘（使用者指定）：#8A4508 on #F8EDE0 = 6.19:1、白字 on #B45309 = 5.02:1 */
  +'.flow li.done{background:#F8EDE0}'
  +'.flow li.done .flow-n{background:#B45309;color:#fff;font-size:0;box-shadow:none}'
  +'.flow li.done .flow-n::after{content:"\\2713";font-size:15px;font-weight:700}'
  +'.flow li.done .flow-t b{color:#8A4508}.flow li.done .flow-t i{color:#5C5248}'
  /* 目前這一步用 #005696：白字 7.58:1；用 #0088D2 只有 3.85:1，粗體小字不合格 */
  +'.flow li.now{background:#005696;box-shadow:0 4px 14px rgba(0,86,150,.22)}'
  +'.flow li.now .flow-n{background:#fff;color:#005696;box-shadow:none}'
  +'.flow li.now .flow-t b{color:#fff}'
  +'.flow li.now .flow-t i{color:rgba(255,255,255,.86)}'
  +'.flow li.now .flow-t b::after{content:"\\3000現在這一步";font-size:11px;font-weight:400;'
  +'color:rgba(255,255,255,.8);letter-spacing:.04em}'
  +'@media (max-width:640px){.flow li{flex:1 1 100%}}';
  document.head.appendChild(css);

  var STEPS=[
    ['1','匯入頁面','已讀進你的 HTML','done'],
    ['2','看對照預覽','已確認檔案讀對了','done'],
    ['3','挑視覺套版',(nm?('目前選用：'+nm):'挑一組，或直接套用這一組'),'now'],
    ['4','下載成果','回匯入頁存成 HTML','']
  ];
  var ol=document.createElement('ol');
  ol.className='flow'; ol.id='flow';
  ol.innerHTML=STEPS.map(function(s){
    return '<li data-step="'+s[0]+'"'+(s[3]?(' class="'+s[3]+'"'):'')+'>'
      +'<span class="flow-n">'+s[0]+'</span>'
      +'<span class="flow-t"><b>'+s[1]+'</b><i>'+s[2]+'</i></span></li>';
  }).join('');
  /* 掛在頁面自己的內容容器裡，不然會滿版跑掉：
       視覺套版列表的 <main> 沒有寬度限制，內容都靠 .pin（1160px＋左右 24px）；
       套版詳細的 main.wrap 本身就有 max-width 與內距，直接插入即可。 */
  var mount=ol;
  if(main.querySelector('.pin')&&!main.classList.contains('wrap')){
    var pin=document.createElement('div');
    pin.className='pin';
    /* 視覺套版列表的 <main> 沒有上內距，步驟列會緊貼頁首；
       套版詳細的 main.wrap 自帶 30px 上內距，所以只有這一種情況要補。 */
    pin.style.marginTop='28px';
    pin.appendChild(ol);
    mount=pin;
  }
  main.insertBefore(mount,main.firstChild);
};
