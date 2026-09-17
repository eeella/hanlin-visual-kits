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
  controls:{btn:true,seg:true,select:true,label:true,input:true,choice:true,tabs:true,btnstate:true,rescard:true,principles:true,midcolor:true,gray:true,softtile:true,rwd:true,type:true,shape:true},
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
/* ── 色彩分配（60／30／10）：首頁卡片縮圖與範本頁（demo.html／下載範例檔）共用同一份 ──
   每一組的 p/s/i/c 只是色值，「哪個顏色放哪裡」才決定看起來生不生動。規則：
     主視覺底 hero ＝ 覆寫 > 輔色 s > 主色 p（每頁一個深色大塊）
     主要 CTA  btn ＝ 覆寫 > 對比色 c（10% 面積，只放在最想被點的地方）
   HERO 覆寫是給「s 是純黑／hero 該用次級底」那幾組的（2026-09-16 從 index.html 搬到這裡）。 */
window.HL_HERO={
  dawho:   {hero:'#0094DF',btn:'#FF9F1C'},   /* 主要藍取代純黑底 */
  mustard: {hero:'#EEC66F',btn:'#2C1D18'},   /* color.mustard 專題區塊底；按鈕用 espresso */
  pine:    {hero:'#4D692D',btn:'#E3C874'},   /* color.moss 次級底 */
  avocado: {hero:'#D5CB86',btn:'#FF5E03'},   /* color.khaki 次級區塊底（導覽列已是 avocado 綠，主視覺要和它分開） */
  douclass:{hero:'#7747B5',btn:'#E8A33D'},   /* surface.strong 主紫 */
  gov:     {hero:'#FFC551',btn:'#C04C08'},   /* surface.strong 主金；按鈕用 tertiary 橘 */
  neon:    {hero:'#16B5D5',btn:'#FAD852'}    /* color.cyan 次級橫幅 */
};
window.HL_heroSpec=function(k){
  var ov=(k&&window.HL_HERO[k.id])||{};
  return {hero:ov.hero||k.s||k.p, btn:ov.btn||k.c};
};
window.HL_previewTarget=function(){
  var id=window.HL_adoptedKitId();
  return id?('template.html?kit='+encodeURIComponent(id)):'preview.html';
};

/* ── 跨頁流程追蹤 ───────────────────────────────────────────────────
   目的：回答「我選的東西是在哪一步被改掉的」。

   兩個設計決定，都是被前幾次失敗逼出來的：

   1) 不靠人工埋點。先前是我挑幾個地方手動加 HL_trace，結果漏掉
      parseImport 覆蓋 theme、clearPrevious 清旗標這兩個真正的兇手，
      白猜了兩輪。現在改成攔截 localStorage／sessionStorage 的寫入，
      任何對 hanlin-* 的改動都會自己現形，不管是誰寫的。

   2) 開關放 localStorage。先前放 sessionStorage，換一個分頁就失效，
      使用者操作時忘了帶 ?hlmon=1 就什麼都沒記到。現在帶一次 ?hlmon=1
      就持續有效，直到在面板按「停止」或帶 ?hlmon=0。

   關掉時：不攔截、不記錄、不建面板，對正常使用零影響。 */
(function(){
  var KEY='hanlin-trace', SW='hanlin-trace-on';
  function on(){
    try{
      if(/[?&]hlmon=0/.test(location.search)){localStorage.removeItem(SW);return false}
      if(/[?&]hlmon=1/.test(location.search)){localStorage.setItem(SW,'1');return true}
      return localStorage.getItem(SW)==='1';
    }catch(e){return false}
  }
  if(!on())return;   /* 沒開就整段不做事 */

  function themeName(){
    try{
      var st=JSON.parse(localStorage.getItem('hanlin-brand-theme'))||{};
      return ((st.theme||{}).n)||'(無)';
    }catch(e){return '(讀不到)'}
  }
  function kid(){
    try{return (window.HL_adoptedKitId&&window.HL_adoptedKitId())||'(對不上任何一組)'}catch(e){return '-'}
  }
  /* 誰改的：從堆疊取第一個不屬於追蹤自己的位置 */
  function caller(){
    try{
      var st=(new Error()).stack||'';
      var lines=st.split('\n').slice(1);
      for(var i=0;i<lines.length;i++){
        var L=lines[i];
        if(/defaults\.js/.test(L))continue;
        var m=L.match(/([\w.-]+\.(?:html|js))[?:][^)]*?(\d+):(\d+)/);
        if(m)return m[1]+':'+m[2];
        m=L.match(/([\w.-]+\.(?:html|js)):(\d+)/);
        if(m)return m[1]+':'+m[2];
      }
    }catch(e){}
    return '';
  }
  function brief(v){
    v=String(v==null?'':v);
    if(v.length>90){
      /* 是 JSON 就抽關鍵欄位，不要貼一大串 */
      try{
        var o=JSON.parse(v);
        if(o&&o.theme)return '{theme.n='+(o.theme.n||'?')+', groups='+(o.groups?'有':'無')+', '+v.length+' bytes}';
      }catch(e){}
      return '('+v.length+' bytes) '+v.slice(0,60)+'…';
    }
    return v;
  }
  var rows=[];
  try{rows=JSON.parse(sessionStorage.getItem(KEY)||'[]')}catch(e){rows=[]}
  function push(o){
    rows.push(o);
    if(rows.length>400)rows=rows.slice(-400);
    try{sessionStorage.setItem(KEY,JSON.stringify(rows))}catch(e){}
  }
  window.HL_trace=function(evt,extra){
    push({t:new Date().toTimeString().slice(0,8),
          page:(location.pathname.split('/').pop()||'index.html'),
          evt:evt, kit:themeName(), kid:kid(),
          extra:extra?JSON.stringify(extra):'', kind:'event'});
  };
  window.HL_traceDump=function(){return rows.slice()};
  window.HL_traceClear=function(){rows=[];try{sessionStorage.removeItem(KEY)}catch(e){}};
  window.HL_traceStop=function(){try{localStorage.removeItem(SW)}catch(e){};location.reload()};

  /* ── 攔截 storage：所有 hanlin-* 的寫入與刪除都自己現形 ── */
  ['localStorage','sessionStorage'].forEach(function(kind){
    var st; try{st=window[kind]}catch(e){return}
    if(!st)return;
    var _set=st.setItem.bind(st), _rm=st.removeItem.bind(st), _clr=st.clear.bind(st);
    var tag=kind==='localStorage'?'L':'S';
    st.setItem=function(k,v){
      var before=(k==='hanlin-brand-theme')?themeName():null;
      var out=_set(k,v);
      if(/^hanlin-/.test(k)&&k!==KEY&&k!==SW){
        var after=(k==='hanlin-brand-theme')?themeName():null;
        push({t:new Date().toTimeString().slice(0,8),
              page:(location.pathname.split('/').pop()||'index.html'),
              evt:'寫入 '+tag+':'+k, kit:themeName(), kid:kid(),
              extra:brief(v), by:caller(), kind:'write',
              themeChanged:(before!==null&&before!==after)?(before+' → '+after):''});
      }
      return out;
    };
    st.removeItem=function(k){
      if(/^hanlin-/.test(k)&&k!==KEY&&k!==SW){
        push({t:new Date().toTimeString().slice(0,8),
              page:(location.pathname.split('/').pop()||'index.html'),
              evt:'刪除 '+tag+':'+k, kit:themeName(), kid:kid(),
              extra:'', by:caller(), kind:'del'});
      }
      return _rm(k);
    };
    st.clear=function(){
      push({t:new Date().toTimeString().slice(0,8),
            page:(location.pathname.split('/').pop()||'index.html'),
            evt:'清空 '+tag+'（整個）', kit:themeName(), kid:kid(),
            extra:'', by:caller(), kind:'del'});
      return _clr();
    };
  });

  /* ── 面板 ── */
  function panel(){
    if(document.getElementById('hlTrace'))return;
    var d=document.createElement('div');
    d.id='hlTrace';
    d.setAttribute('style','position:fixed;left:12px;bottom:12px;z-index:2147483646;'
      +'width:560px;max-height:52vh;overflow:auto;background:#0F1621;color:#D8E4F0;'
      +'font:11px/1.55 Consolas,Menlo,monospace;border-radius:10px;'
      +'box-shadow:0 8px 30px rgba(0,0,0,.45)');
    function esc(x){return String(x==null?'':x).replace(/[&<>]/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
    function render(){
      var html='<div style="position:sticky;top:0;background:#17212F;padding:7px 11px;'
        +'border-radius:10px 10px 0 0;display:flex;align-items:center;gap:7px">'
        +'<b style="color:#6FD3FF">流程追蹤</b>'
        +'<span style="color:#7C8CA0;font-size:10px">'+rows.length+' 筆 · 攔截所有 hanlin-* 寫入</span>'
        +'<button id="hlTC" style="margin-left:auto;background:#2A3A4D;color:#D8E4F0;border:0;'
        +'border-radius:6px;padding:3px 9px;font:inherit;cursor:pointer">清空</button>'
        +'<button id="hlTS" style="background:#5A2A2A;color:#FFD8D8;border:0;'
        +'border-radius:6px;padding:3px 9px;font:inherit;cursor:pointer">停止</button>'
        +'<button id="hlTH" style="background:#2A3A4D;color:#D8E4F0;border:0;'
        +'border-radius:6px;padding:3px 9px;font:inherit;cursor:pointer">收起</button></div>'
        +'<div style="padding:8px 11px 11px">';
      if(!rows.length)html+='<div style="color:#7C8CA0">還沒有記錄。操作一次就會出現。</div>';
      var prevKit=null, prevPage=null;
      rows.forEach(function(r){
        if(r.page!==prevPage){
          html+='<div style="margin:7px 0 3px;color:#6FD3FF;border-top:1px solid #24354A;'
            +'padding-top:5px">▸ '+esc(r.page)+'</div>';
          prevPage=r.page;
        }
        var changed=prevKit!==null&&prevKit!==r.kit;
        var color=r.kind==='write'?'#9BE8A0':(r.kind==='del'?'#FFB08A':'#C5D2E0');
        html+='<div style="padding:3px 0 3px 8px">'
          +'<span style="color:#7C8CA0">'+r.t+'</span> '
          +'<span style="color:'+color+'">'+esc(r.evt)+'</span>'
          +(r.by?' <span style="color:#7C8CA0">@'+esc(r.by)+'</span>':'')
          +(r.extra?'<div style="padding-left:14px;color:#8FA3B8">'+esc(r.extra)+'</div>':'')
          +(r.themeChanged?'<div style="padding-left:14px;color:#FF8A6B">採用的組：'
              +esc(r.themeChanged)+'</div>':'')
          +(changed&&!r.themeChanged?'<div style="padding-left:14px;color:#FF8A6B">'
              +'採用的組變成 '+esc(r.kit)+'（原本 '+esc(prevKit)+'）</div>':'')
          +'</div>';
        prevKit=r.kit;
      });
      html+='</div>';
      d.innerHTML=html;
      var c=document.getElementById('hlTC'); if(c)c.onclick=function(){window.HL_traceClear();render()};
      var st2=document.getElementById('hlTS'); if(st2)st2.onclick=function(){window.HL_traceStop()};
      var h=document.getElementById('hlTH'); if(h)h.onclick=function(){d.style.display='none'};
    }
    document.body.appendChild(d);
    render();
    setInterval(render,1200);
  }
  function boot(){window.HL_trace('進入頁面');panel()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
  window.addEventListener('pagehide',function(){window.HL_trace('離開頁面')});
})();

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
/* hanlin-import-html（使用者上傳的檔案本體）刻意不在清單裡：
   使用者要解決的是「步驟列一直咬著上一次的匯入」，那由 hanlin-import-live
   這個 sessionStorage 旗標決定，清掉它步驟列就不再出現。
   把檔案本體也清掉會直接弄丟人家上傳的東西——實測兩條路都會踩到：
     (a) 帶票到「挑選頁」（templates／template）之後按 F5；
     (b) 分頁的第一頁就是匯入頁，上傳完點導覽列跳頁（第一跳就被當成新進入）。
   注意 (a) 指的是挑選頁；在匯入頁自己按 F5 仍會清掉檔案，
   那是 import.html 自己的規則（無通行證載入＝一次新的匯入），不歸這裡管。
   檔案只有使用者自己按「清除紀錄」、或重新進匯入頁時才會消失。 */
window.HL_FLOW_KEYS={
  local:['hanlin-import-opts',
         'hanlin-skill-blocks','hanlin-import-pending','hanlin-show-result',
         'hanlin-settings-saved'],
  /* hanlin-import-done 是 sessionStorage 的旗標（import.html:6461／6590），
     放在 local 桶等於對不存在的 key 做 removeItem，真正的旗標一次都沒清到。 */
  session:['hanlin-import-styled','hanlin-import-live','hanlin-import-done']
};
/* 「現在是不是真的在匯入流程中」：手上有檔案，而且是這個分頁匯入的。
   只看檔案存在的話，隔了幾天直接開挑選頁，畫面還會說「你的頁面已經讀進來了」——
   那是早就結束的流程。步驟列、回匯入頁提示都用這一個判定，不各寫一份。 */
window.HL_inImportFlow=function(){
  try{
    return sessionStorage.getItem('hanlin-import-live')==='1'
        && !!localStorage.getItem('hanlin-import-html');
  }catch(e){return false}
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
  /* 2026-09-16 動線整理：進度改由底部流程條 HL_flowDock 呈現，這排卡片不再注入（函式保留給既有呼叫點）。 */
  return;
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

/* ── 流程條（2026-09-16 動線整理）───────────────────────────────────
   全站「下一步」唯一的家。四步：挑風格 → 套版詳細 → 匯入頁面 → 下載成果。
   HL_flowDock({step, primary:{label,icon,onClick,href,disabled,done}, note})
   可重複呼叫：第一次建 DOM，之後只更新內容，不會弄丟事件。 */
window.HL_FLOW_STEPS=[
  {n:'挑風格',href:'index.html#kits'},
  {n:'套版詳細',href:''},
  {n:'匯入頁面',href:'import.html'},
  {n:'下載成果',href:''}
];
function goWithTicket(href){
  var file=href.split('?')[0].split('#')[0];
  try{sessionStorage.setItem('hanlin-handoff',JSON.stringify({to:file,t:Date.now()}))}catch(_){}
  location.href=href;
}
window.HL_flowDock=function(o){
  o=o||{};
  var d=document.getElementById('flowDock');
  if(!d){
    d=document.createElement('div');d.id='flowDock';d.className='flow-dock';
    d.setAttribute('role','navigation');d.setAttribute('aria-label','流程');

    d.innerHTML='<div class="fd-in"><ol class="fd-steps"></ol><span class="fd-mobile"></span>'+
      '<span class="fd-act"><span class="fd-note" id="flowNote"></span>'+
      '<span id="flowSecondaries"></span>'+
      '<button type="button" class="btn soft" id="flowSecondary" hidden></button>'+
      '<button type="button" class="btn primary" id="flowPrimary"></button></span></div>';
    /* inline：接在內容最後、不固定浮動（首頁／套版詳細用，使用者指定 2026-09-17）；其餘頁固定在畫面底部 */
    if(o.inline){d.classList.add('flow-inline');(document.querySelector('main')||document.body).appendChild(d);}
    else{document.body.appendChild(d);document.body.classList.add('has-flow-dock');}
    d.querySelector('#flowPrimary').addEventListener('click',function(e){
      var b=e.currentTarget;if(b.disabled)return;
      if(typeof d._onClick==='function'){d._onClick(e);return}
      if(d._href)goWithTicket(d._href);
    });
    d.querySelector('#flowSecondary').addEventListener('click',function(e){
      if(typeof d._onClick2==='function'){d._onClick2(e);return}
      if(d._href2)goWithTicket(d._href2);
    });
  }
  var step=o.step||1,S=window.HL_FLOW_STEPS;
  d.querySelector('.fd-steps').innerHTML=S.map(function(st,i){
    var n=i+1,cls=n<step?'done':(n===step?'now':'');
    return '<li class="'+cls+'"><i><span>'+n+'</span></i>'+st.n+'</li>';
  }).join('');
  d.querySelector('.fd-mobile').innerHTML='<b>步驟 '+step+'／'+S.length+'</b>'+(S[step-1]?S[step-1].n:'');
  var pr=o.primary||{},b=d.querySelector('#flowPrimary');
  b.innerHTML=(pr.icon?'<span class="material-symbols-rounded" style="font-size:18px">'+pr.icon+'</span>':'')+(pr.label||'下一步');
  b.disabled=!!pr.disabled;
  b.classList.toggle('done',!!pr.done);
  d._onClick=pr.onClick||null;d._href=pr.href||'';
  /* 次要動作（可選）：例如首頁的「已有頁面？直接匯入」，淺底、放在主鈕左邊 */
  var sc=o.secondary||null,b2=d.querySelector('#flowSecondary');
  /* 次要動作可以給陣列（多顆淺底鈕）；給單一物件則走原本那顆 #flowSecondary */
  var multi=d.querySelector('#flowSecondaries');multi.innerHTML='';
  if(Array.isArray(sc)){
    sc.forEach(function(x){
      var bt=document.createElement('button');bt.type='button';bt.className='btn soft';
      bt.innerHTML=(x.icon?'<span class="material-symbols-rounded" style="font-size:18px">'+x.icon+'</span>':'')+(x.label||'');
      bt.addEventListener('click',function(e){if(typeof x.onClick==='function')x.onClick(e);else if(x.href)goWithTicket(x.href)});
      multi.appendChild(bt);
    });
    sc=null;
  }
  if(sc){
    b2.hidden=false;
    b2.innerHTML=(sc.icon?'<span class="material-symbols-rounded" style="font-size:18px">'+sc.icon+'</span>':'')+(sc.label||'');
    d._onClick2=sc.onClick||null;d._href2=sc.href||'';
  }else{b2.hidden=true;d._onClick2=null;d._href2='';}
  var note=d.querySelector('#flowNote');note.textContent=o.note||'';note.style.display=o.note?'':'none';
  d.hidden=!!o.hidden;if(!d.classList.contains('flow-inline'))document.body.classList.toggle('has-flow-dock',!o.hidden);
  return d;
};
