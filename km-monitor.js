/* ══ 套用比對監測：唯一一份量測邏輯 ═══════════════════════════════════
   預覽頁（preview.html 內嵌面板）與離線比對套件（enginecmp-suite.html）
   都呼叫這一支。兩邊各寫一份的話，數字對不起來時分不出是引擎差異還是
   量法差異——那正是先前「稽核自己另取期望值」踩過的坑。
   本檔只負責「量」與「記帳」，不負責渲染，也絕不修改被量的文件。 */
(function(g){
  function rgb(c){var m=/(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/.exec(c||'');return m?[+m[1],+m[2],+m[3]]:null}
  function alph(c){var m=/rgba\(([^)]*)\)/.exec(c||'');if(!m)return 1;var a=m[1].split(',')[3];return a===undefined?1:parseFloat(a)}
  function hx(c){var p=rgb(c);if(!p)return '—';if(alph(c)<0.04)return '透明';
    return '#'+p.slice(0,3).map(function(v){return ('0'+Math.round(v).toString(16)).slice(-2)}).join('').toUpperCase()}
  function lm(p){return p.map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}).reduce(function(a,b,i){return a+b*[.2126,.7152,.0722][i]},0)}
  function stops(t){var o=[],m,re=/rgba?\(([^)]+)\)/g;while((m=re.exec(t))){var n=m[1].split(',');
    if(n.length>3&&parseFloat(n[3])<0.35)continue;o.push([+n[0],+n[1],+n[2]])}return o}
  /* 有效底色：往上追到第一個不透明底；漸層取最暗停駐色。
     只看 backgroundColor 會一路穿到 body 白色，把深底白字誤報成 1.00:1。 */
  function effBg(el,W,d){var e=el;while(e&&e!==d.documentElement){var c=W.getComputedStyle(e);
    if(c.backgroundImage&&c.backgroundImage!=='none'){var st=stops(c.backgroundImage);
      if(st.length){var wi=st[0],wl=lm(st[0]);for(var q=1;q<st.length;q++){var L=lm(st[q]);if(L<wl){wl=L;wi=st[q]}}return wi}}
    if(alph(c.backgroundColor)>=0.95){var p=rgb(c.backgroundColor);if(p)return p}
    e=e.parentElement}return [255,255,255]}
  /* 只檢查有「直接文字節點」的元素：容器繼承色會把 td 之類誤報成隱形字 */
  function hasText(el){for(var i=0;i<el.childNodes.length;i++){var n=el.childNodes[i];
    if(n.nodeType===3&&n.nodeValue.trim())return true}return false}
  /* 看不見的元素不算隱形字：display:none／visibility:hidden／尺寸為 0。
     實測偽陽性來源：登入膠囊收成純圖示時，被隱藏的文字 span 仍帶文字節點，
     量出白字白底 → 4 份樣本各多報 1 處，隱形字總數從 48 變成 52。 */
  function visible(el,W){
    try{var c=W.getComputedStyle(el);
      if(c.display==='none'||c.visibility==='hidden'||parseFloat(c.opacity||'1')===0)return false;
      var r=el.getBoundingClientRect();return r.width>0.5&&r.height>0.5;
    }catch(e){return true}}
  function crOf(el,W,d){if(!hasText(el)||!visible(el,W))return null;var f=rgb(W.getComputedStyle(el).color);if(!f)return null;
    var b=effBg(el,W,d),L1=lm(f),L2=lm(b);return (Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05)}
  function sel(el){var t=el.tagName.toLowerCase(),c=(el.getAttribute('class')||'').trim();
    return c?(t+'.'+c.split(/\s+/).slice(0,3).join('.')):t}
  function zone(el){var z=[],n=el;while(n&&n.nodeType===1){
    ['data-hl-hd','data-hl-ft','data-hl-hero','data-hl-fm'].forEach(function(a){
      if(n.hasAttribute&&n.hasAttribute(a)&&z.indexOf(a)<0)z.push(a.replace('data-hl-',''))});n=n.parentElement}
    return z.join(',')}
  var BRAND={'#0088D2':'主色','#005696':'輔色','#40B4E5':'亮色','#FF9A3C':'對比色'};
  function nearBrand(c){var p=rgb(c);if(!p||alph(c)<0.5)return '';var best='',bd=1e9;
    for(var k in BRAND){var q=[parseInt(k.slice(1,3),16),parseInt(k.slice(3,5),16),parseInt(k.slice(5,7),16)];
      var dd=Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])+Math.abs(p[2]-q[2]);if(dd<bd){bd=dd;best=BRAND[k]}}
    return bd<=40?best:''}
  var STATE_RE=/(^|\s)(active|selected|current|checked|is-active|is-selected|on)(\s|$)/i;
  var TABWORD=/(^|\s)(tab|tabs|segment|segmented|seg|switcher|pills)(\s|$)/i;
  function optSignal(el){var n=0,r=(el.getAttribute('role')||'').toLowerCase();
    if(/^(tab|radio|option)$/.test(r))n+=2;
    if(el.hasAttribute('aria-selected')||el.hasAttribute('aria-checked'))n+=2;
    if(el.hasAttribute('aria-controls'))n+=2;
    if(el.querySelector&&el.querySelector('input[type=radio]'))n+=2;
    return n}
  function tokenish(el,re){return re.test(' '+String(el.getAttribute('class')||'').replace(/[-_]/g,' ')+' ')}

  /* 量測一份已套用完成的文件。回傳純資料，呈現交給呼叫端。 */
  /* opts.sourceOfTruth=true：這一頁自己就是引擎的編寫處（import.html），
     它不該、也不需要載入 engine.js 產物 —— 對它做「有沒有走單一真相源」的
     判斷是沒有意義的，會變成永遠紅字。 */
  function measure(d,W,opts){
    opts=opts||{};
    var all=d.querySelectorAll('body *');
    var st={total:all.length,kinded:0,styled:0,optd:0,untouched:0,land:0};
    var invis=[];
    Array.prototype.forEach.call(all,function(el){
      if(el.hasAttribute('data-hl-k'))st.kinded++;
      if(el.hasAttribute('data-hl-s'))st.styled++;
      if(el.hasAttribute('data-hl-opt')||el.hasAttribute('data-hl-optcard'))st.optd++;
      if(!el.hasAttribute('data-hl-s')&&!el.hasAttribute('data-hl-k')&&
         !el.hasAttribute('data-hl-opt')&&!el.hasAttribute('data-hl-optcard'))st.untouched++;
      var c=W.getComputedStyle(el);
      if(nearBrand(c.backgroundColor)||nearBrand(c.color)||nearBrand(c.borderBottomColor))st.land++;
      var cr=crOf(el,W,d);
      if(cr!==null&&cr<3)invis.push({el:sel(el),cr:+cr.toFixed(2),fg:hx(c.color)});
    });
    /* ── 登入元件帳：以密碼欄為錨，沒有密碼欄才退回 form ── */
    var loginRows=[],scope=[];
    Array.prototype.forEach.call(d.querySelectorAll('input[type=password]'),function(i){
      var f=i.closest('form')||i.parentElement;
      while(f&&f!==d.body&&f.querySelectorAll('input').length<2)f=f.parentElement;
      if(f&&scope.indexOf(f)<0)scope.push(f)});
    if(!scope.length&&/登入|帳號|密碼|sign\s*in|log\s*in/i.test(d.body.textContent||''))
      Array.prototype.forEach.call(d.querySelectorAll('form'),function(f){if(scope.indexOf(f)<0)scope.push(f)});
    scope.forEach(function(f){
      [f].concat(Array.prototype.slice.call(f.querySelectorAll('input,select,textarea,button,a'))).forEach(function(el){
        var c=W.getComputedStyle(el),cr=crOf(el,W,d);
        loginRows.push({el:sel(el),kind:el.getAttribute('data-hl-k')||'',
          styled:el.hasAttribute('data-hl-s'),zone:zone(el),
          bg:hx(c.backgroundColor),fg:hx(c.color),
          brand:nearBrand(c.backgroundColor)||nearBrand(c.color),
          cr:cr===null?null:+cr.toFixed(2),
          flag:(el.tagName==='INPUT'&&/^(submit|reset|button)$/i.test(el.getAttribute('type')||'')
                &&el.getAttribute('data-hl-k')!=='button')?'按鈕未判定為 button':''});
      });
    });
    /* ── 登入系統（會員入口）注入帳 ────────────────────────────────
       【為什麼要單獨列一區】先前監測只看「頁面自己的登入表單」，
       完全沒有把「brand.html 勾的登入系統有沒有真的被注入」納入比對，
       所以它整整壞著（死碼路徑，勾了永遠 skip）都沒有被任何一份報告抓到。
       這裡直接讀套用結果自己留下的憑證，不做推測：
         body[data-hl-rule] 裡的 loginSystemInjection:done|skip
         [data-hl-member]／[data-hl-member-btn]／[data-hl-member-menu]
       未套用時把三個可判讀的攔截點各自標出來，才知道卡在哪一關。 */
    var mem=(function(){
      var rule=String(d.body.getAttribute('data-hl-rule')||'');
      var mm=/loginSystemInjection:(\w+)/.exec(rule);
      var wrap=d.querySelector('[data-hl-member]');
      var btn=d.querySelector('[data-hl-member-btn]');
      var hd=d.querySelector('[data-hl-hd]');
      var o={state:mm?mm[1]:'—',injected:!!wrap,
             hd:!!hd, hdSel:hd?sel(hd):'—',
             hdHasLogin:hd?/會員|登入|註冊|帳號/.test(hd.textContent||''):false,
             inHd:!!(wrap&&hd&&hd.contains(wrap)),
             items:d.querySelectorAll('[data-hl-member-item]').length,
             rule:wrap?(wrap.getAttribute('data-hl-rule')||''):'',
             text:btn?(btn.textContent||'').trim():'',bg:'',fg:'',cr:null,why:''};
      if(btn){var c=W.getComputedStyle(btn);o.bg=hx(c.backgroundColor);o.fg=hx(c.color);
        var f=rgb(c.color),b=effBg(btn,W,d);
        if(f&&b){var L1=lm(f),L2=lm(b);o.cr=+(((Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05))).toFixed(2)}}
      if(!o.injected){
        o.why = !o.hd ? '頁面沒有可辨識的頁首（不新建 header 是既有鐵律）'
              : o.hdHasLogin ? '頁首本來就有登入入口，避免重複注入'
              : '未勾選「登入系統」，或設定沒被讀到';
      }
      return o;
    })();

    /* ── 橫向選項卡候選帳（訊號推定，不是期望值）── */
    var tabRows=[];
    Array.prototype.forEach.call(all,function(par){
      var kids=par.children;if(!kids||kids.length<2||kids.length>12)return;
      var sig=0,stc=0,deep=0,tagOk=true,tag=kids[0].tagName;
      for(var i=0;i<kids.length;i++){
        var k=kids[i];
        if(k.tagName!==tag)tagOk=false;
        if(optSignal(k)>=2)sig++;
        if(STATE_RE.test(' '+String(k.getAttribute('class')||'').replace(/[-_]/g,' ')+' '))stc++;
        for(var j=0;j<k.children.length;j++){var gch=k.children[j];
          if(optSignal(gch)>=2||STATE_RE.test(' '+String(gch.getAttribute('class')||'').replace(/[-_]/g,' ')+' ')){deep++;break}}
      }
      var byName=tokenish(par,TABWORD)||tokenish(kids[0],TABWORD)||
                 (par.getAttribute('role')||'').toLowerCase()==='tablist';
      if(!((sig>=2)||(deep>=2)||byName||(stc===1&&tagOk&&kids.length>=3)))return;
      var why=[];
      if(sig>=2)why.push('子項 role/aria×'+sig);
      if(deep>=2)why.push('孫層狀態×'+deep);
      if(byName)why.push('命名訊號');
      if(stc===1)why.push('單一選取狀態');
      var c=W.getComputedStyle(par);
      tabRows.push({el:sel(par),kids:kids.length,why:why.join('、'),
        taken:!!par.querySelector('[data-hl-opt],[data-hl-optcard]'),
        zone:zone(par),bg:hx(c.backgroundColor),kid:sel(kids[0]),
        kidKind:kids[0].getAttribute('data-hl-k')||'',
        kidStyled:kids[0].hasAttribute('data-hl-s')});
    });
    /* ── 引擎項目盤點：兩份引擎版本不同時，判定欄位會整欄是空的 ── */
    var need=[['classifyEl','三條件精準判定'],['markKinds','類型標記'],
              ['precisifySelectors','選擇器精準化'],['writeStyle','樣式寫入閘門']];
    /* ── 規則生效帳（純量測，不碰套用機制）────────────────────────
       writeStyle() 會把每一條樣式寫成置底規則表裡的一條
       html body [data-hl-s="A"] [data-hl-s="B"]{prop:value !important}。
       實測同一個元素同一個屬性常被寫不只一次，後寫的贏，前面那些
       就成了純噪音 —— 在 DevTools 上看到的就是「規則被劃掉」。
       這裡只讀已渲染的結果做比對，不修改任何東西。 */
    var rules=(function(){
      var out={total:0,live:0,dead:0,unknown:0,byProp:{},samples:[]};
      /* 【只判定量得準的屬性】shorthand 被 CSSOM 展開後會產生無法直接比對的值：
         border:none → border-width:medium（computed 0px）、
         border-color:currentcolor（computed 取自 color）、
         outline:none → computed 是 "rgb(...) none 3" 複合字串。
         這些一律歸「無法判定」，不能算成未生效 —— 否則報表會虛報一堆假問題。 */
      var CHECKABLE=/^(color|background-color|background-image|font-family|font-weight|font-size|opacity|display|visibility|border-style|outline-style|text-decoration-line|border-radius|box-shadow)$/;
      var probe=null;
      function toRgb(v){
        /* transparent／具名色也要換算：background-color:transparent 的 computed 是
           rgba(0, 0, 0, 0)，字面比對永遠不相等，會虛報成「未生效」。 */
        if(!/^#|^rgb|^hsl|^transparent$|^[a-z]+$/i.test(v))return null;
        try{
          if(!probe){probe=d.createElement('span');
            probe.style.cssText='position:absolute;left:-9999px';d.body.appendChild(probe)}
          probe.style.color='';probe.style.color=v;
          var out2=W.getComputedStyle(probe).color;
          if(/^transparent$/i.test(v))out2='rgba(0, 0, 0, 0)';
          return out2;
        }catch(e){return null}
      }
      function norm(v){return String(v).replace(/\s+/g,'').replace(/!important/gi,'').toLowerCase()}
      try{
        Array.prototype.forEach.call(d.styleSheets,function(sh){
          var rs;try{rs=sh.cssRules}catch(e){return}
          Array.prototype.forEach.call(rs||[],function(r){
            if(!r.selectorText||r.selectorText.indexOf('[data-hl-s=')<0)return;
            if(!/^html body \[data-hl-s=/.test(r.selectorText))return;
            /* 用 cssText 取「原始寫下的宣告」，不要走 r.style 逐項列舉 ——
               CSSOM 會把 background:none 展開成 8 個 longhand，
               條數虛增（v6-real 155→731），還會把 background-position-x:initial
               這種展開產物誤判成「未生效」。 */
            var body2=(/\{([^}]*)\}/.exec(r.cssText)||[])[1]||'';
            var decls=body2.split(';').map(function(x){return x.trim()}).filter(Boolean);
            for(var i=0;i<decls.length;i++){
              var ci=decls[i].indexOf(':');
              if(ci<1)continue;
              var prop=decls[i].slice(0,ci).trim(),want=decls[i].slice(ci+1).trim();
              out.total++;
              var el;try{el=d.querySelector(r.selectorText.replace(/^html body /,''))}catch(e){el=null}
              if(!el){out.unknown++;continue}          /* 選不到元素：不下結論 */
              want=want.replace(/!important/gi,'').trim();
              if(!CHECKABLE.test(prop)||/^(initial|unset|revert|auto)$/i.test(want)){out.unknown++;continue}
              var got=W.getComputedStyle(el).getPropertyValue(prop);
              var ok;
              if(/^inherit$/i.test(want)){
                /* inherit 要跟父層的 computed 比，跟字面比永遠不相等 */
                var par=el.parentElement;
                ok=par?(norm(got)===norm(W.getComputedStyle(par).getPropertyValue(prop))):null;
                if(ok===null){out.unknown++;continue}
              }else{
                var wr=toRgb(want);
                ok=(norm(got)===norm(want))||(!!wr&&norm(got)===norm(wr));
                if(!ok&&prop==='font-family')ok=(norm(got).indexOf(norm(want).split(',')[0])>=0);
              }
              if(ok)out.live++;
              else{
                out.dead++;out.byProp[prop]=(out.byProp[prop]||0)+1;
                if(out.samples.length<8)out.samples.push({el:sel(el),prop:prop,
                  want:want.slice(0,24),got:String(got).slice(0,24)});
              }
            }
          });
        });
      }catch(e){}
      if(probe&&probe.parentNode)probe.parentNode.removeChild(probe);
      return out;
    })();

    /* ── 引擎一致性 ────────────────────────────────────────────────
       先前這裡探測 window.classifyEl／markKinds／precisifySelectors／writeStyle，
       但那四個在 import.html 裡本來就巢狀定義在 brandifyHtml 內（大括號深度 2），
       任何頁面的全域都不會有它們 —— 那個探測從一開始就必然回報「缺 4 項」，
       是偽陽性。改看唯一可靠的憑證：共用產物 engine.js 有沒有載入、指紋是多少。 */
    var E=g.HL_ENGINE||null;
    var lack=(opts.sourceOfTruth||(E&&typeof E.brandifyHtml==='function'))?[]
             :[['HL_ENGINE','共用引擎產物 engine.js 未載入，本頁改用自帶的舊引擎']];
    return {stats:st,login:loginRows,member:mem,tabs:tabRows,invis:invis,rules:rules,lack:lack,
            engine:opts.sourceOfTruth?'本頁內嵌（引擎真相源 import.html）'
                   :(E?('engine.js '+E.version):'本頁內嵌（舊版）'),
            tabMiss:tabRows.filter(function(r){return !r.taken}).length,
            loginFlag:loginRows.filter(function(r){return r.flag}).length};
  }
  g.KM={measure:measure,hx:hx,sel:sel,zone:zone,nearBrand:nearBrand,crOf:crOf};
})(window);
