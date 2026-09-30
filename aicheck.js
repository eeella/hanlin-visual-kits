/* ══ AI 感檢查引擎（2026-09-24）══
   對照 基本規範 skill.md §6.1「去除 AI 感」逐條檢查一份「已經畫出來」的文件。
   用法：HL_aiCheck(document, window) → {findings:[…], errors:[…], manual:[…]}
   - 必須在渲染後呼叫：大部分規則讀 getComputedStyle 與實際尺寸。
   - aicheck.html 與命令列驗收共用這一份，不可各自另寫判定。
   - 例外：功能選單（.fm-*，§3.12 定案元件）與加了 data-ai-ok 的元素整個略過。
   - 每條規則各自 try/catch，失敗寫進 errors 並顯示在報告上，不可默默跳過。 */
(function(g){
  var SKIP_TAGS=/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|META|LINK|HEAD|TITLE|BR|HR|IFRAME|svg|path|g|circle|rect|line|polyline|polygon|use|defs|symbol|clipPath|mask|linearGradient|radialGradient|stop)$/;
  var EXEMPT='[data-ai-ok],.fm-grid,.fm-card,.fm-tile,.fm-icon';
  var CODE='code,pre,kbd,samp,var,tt';
  var ICON_FONT=/material|icon|font ?awesome|bootstrap-icons|remixicon|iconfont|symbols/i;
  /* Unicode 符號／emoji 當圖示：箭頭、技術符號、幾何圖形、雜項符號、裝飾符號、emoji */
  var SYM=/[\u2190-\u21FF\u2300-\u23FF\u25A0-\u25FF\u2600-\u27BF\u2B00-\u2BFF\u{1F000}-\u{1FAFF}]/u;
  var SYM_ONLY=/^[\s\u2190-\u21FF\u2300-\u23FF\u25A0-\u25FF\u2600-\u27BF\u2B00-\u2BFF\u{1F000}-\u{1FAFF}\uFE0F\u200D]+$/u;
  var CJK=/[\u3400-\u9FFF]/;
  var LATIN_LABEL=/^[A-Za-z][A-Za-z0-9 &.,:'’\-\/·|]*$/;
  var BUZZ=['賦能','無縫','一站式','全方位','極致','革命性','顛覆','新體驗','全新升級','次世代','引領未來','重新定義','seamless','empower','revolutionary','next-gen','next generation','unlock','elevate'];

  /* 規則表：id、名稱、等級（fail＝違規；warn＝需人工確認）。順序即報告順序。 */
  var RULES=[
    ['eyebrow','標題上方的小標籤（眉標）','fail'],
    ['bilingual','標題旁的英文小字','fail'],
    ['section-number','01／02 區塊編號','warn'],
    ['feature-cards','一排同款「圖示＋標題＋文字」卡片','warn'],
    ['hero-metric','大數字數據模板','warn'],
    ['gradient-text','漸層文字','fail'],
    ['purple-gradient','紫藍漸層','fail'],
    ['glow','彩色光暈陰影','fail'],
    ['backdrop','毛玻璃（backdrop-filter）','fail'],
    ['pattern-bg','格線／斜紋底紋背景','fail'],
    ['radial-halo','放射狀光暈背景','warn'],
    ['side-line','裝飾線條（側邊直線、直排文字）','fail'],
    ['side-border','左右彩色邊條','fail'],
    ['hard-shadow','無模糊的硬位移陰影','fail'],
    ['infinite-anim','閃爍／脈動／跑馬燈（無限動畫）','fail'],
    ['symbol-icon','用 emoji 或符號當圖示','fail'],
    ['mono-costume','非程式碼卻用等寬字體','warn'],
    ['buzzword','行銷空話','warn'],
    ['aphorism','金句式句型（不只是…更是…）','warn'],
    ['em-dash','破折號堆疊（一段超過一個）','fail']
  ];
  var MANUAL=['不需要打斷操作卻用彈窗','用假的迷你折線圖、進度環或空白方塊充當內容','整體文案是否在刻意營造戲劇感'];

  function rgba(s){
    var m=/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?/.exec(s||'');
    if(!m)return null;
    var a=m[4]===undefined?1:(/%$/.test(m[4])?parseFloat(m[4])/100:parseFloat(m[4]));
    return [+m[1],+m[2],+m[3],a];
  }
  function chroma(c){return c?Math.max(c[0],c[1],c[2])-Math.min(c[0],c[1],c[2]):0}
  function hue(c){
    var r=c[0]/255,g=c[1]/255,b=c[2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;
    if(!d)return -1;
    var h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;
    h*=60;return h<0?h+360:h;
  }
  function colorsIn(s){return (String(s||'').match(/rgba?\([^)]*\)/g)||[]).map(rgba).filter(Boolean)}
  function splitTop(s){return String(s||'').split(/,(?![^(]*\))/).map(function(x){return x.trim()}).filter(Boolean)}
  function shadows(s){
    if(!s||s==='none')return [];
    return splitTop(s).map(function(p){
      var col=(p.match(/rgba?\([^)]*\)/)||[''])[0];
      var nums=p.replace(col,'').replace('inset','').trim().split(/\s+/).map(parseFloat).filter(function(n){return !isNaN(n)});
      return {c:rgba(col),inset:/inset/.test(p),x:nums[0]||0,y:nums[1]||0,blur:nums[2]||0,spread:nums[3]||0};
    });
  }

  g.HL_aiCheck=function(doc,win){
    win=win||doc.defaultView;
    var out=[],errors=[];
    var VW=win.innerWidth,VH=win.innerHeight;
    var all=Array.prototype.filter.call(doc.body?doc.body.querySelectorAll('*'):[],function(el){
      return !SKIP_TAGS.test(el.tagName)&&!el.closest(EXEMPT)&&!(el.ownerSVGElement);
    });
    var csCache=new Map();
    function cs(el){var c=csCache.get(el);if(!c){c=win.getComputedStyle(el);csCache.set(el,c)}return c}
    function vis(el){var r=el.getBoundingClientRect();var c=cs(el);return r.width>0&&r.height>0&&c.visibility!=='hidden'}
    function fs(el){return parseFloat(cs(el).fontSize)||16}
    function txt(el){return (el.innerText!==undefined?el.innerText:el.textContent||'').replace(/\s+/g,' ').trim()}
    function ownText(el){var t='';el.childNodes.forEach(function(n){if(n.nodeType===3)t+=n.nodeValue});return t.replace(/\s+/g,' ').trim()}
    function add(rule,el,note){out.push({rule:rule,el:el,note:note||'',hidden:!vis(el)})}
    function run(rule,fn){try{fn()}catch(e){errors.push(rule+'：'+(e&&e.message||e))}}
    var headings=all.filter(function(el){return /^H[1-6]$/.test(el.tagName)||el.getAttribute('role')==='heading'});

    /* 眉標：標題前一個元素是短字、而且是追蹤字距／全大寫／前面帶短槓；h1、h2 另抓膠囊小標 */
    var eyebrowSet=new Set();
    run('eyebrow',function(){
      headings.forEach(function(h){
        /* 卡片裡的分類／日期（.card__meta + .card__title）是內容結構，不是眉標：h3 以下在卡片、清單項目內一律不看 */
        if(!/^H[12]$/.test(h.tagName)&&h.closest('article,li,[class*=card]'))return;
        var p=h.previousElementSibling;
        while(p&&(SKIP_TAGS.test(p.tagName)||!txt(p)&&!vis(p)))p=p.previousElementSibling;
        if(!p||p.closest(EXEMPT)||/^(A|BUTTON|INPUT|SELECT|NAV|IMG|UL|OL|TABLE|FORM)$/.test(p.tagName))return;
        if(p.querySelector('h1,h2,h3,h4,h5,h6,a,button,img,input'))return;
        var t=txt(p);if(!t||t.length>48)return;
        var tEl=p;while(tEl.children.length===1&&!ownText(tEl))tEl=tEl.children[0];
        var pf=fs(tEl),hf=fs(h);
        if(pf>hf*0.7||pf>16)return;
        var c=cs(tEl),ls=parseFloat(c.letterSpacing)||0;
        var bf=win.getComputedStyle(tEl,'::before');
        var dash=bf.content&&bf.content!=='none'&&bf.content!=='normal'&&parseFloat(bf.width)<=48&&parseFloat(bf.height)<=6;
        var caps=/[A-Za-z]{2}/.test(t)&&(c.textTransform==='uppercase'||(LATIN_LABEL.test(t)&&/[A-Z]{2}/.test(t)&&!/[a-z]/.test(t)));
        var tracked=ls>=pf*0.06;
        var pc=cs(p),pill=/^H[12]$/.test(h.tagName)&&rgba(pc.backgroundColor)&&rgba(pc.backgroundColor)[3]>0.05&&parseFloat(pc.borderTopLeftRadius)>=10&&pf<=14;
        if(caps||tracked||dash||pill){
          eyebrowSet.add(p);
          add('eyebrow',p,'「'+t+'」在 '+h.tagName.toLowerCase()+' 上方'+(dash?'（帶短槓）':pill?'（膠囊）':caps?'（全大寫）':'（拉寬字距）'));
        }
      });
    });

    /* 標題旁的英文小字：中文標題裡／緊鄰一段純英文、字比較小 */
    run('bilingual',function(){
      headings.forEach(function(h){
        var ht=txt(h);
        Array.prototype.forEach.call(h.querySelectorAll('*'),function(c){
          if(c.closest(EXEMPT)||c.children.length)return;
          var t=txt(c);
          if(!LATIN_LABEL.test(t)||(t.match(/[A-Za-z]/g)||[]).length<3)return;
          var rest=ht.replace(t,'');
          if(!CJK.test(rest))return;
          if(fs(c)<fs(h)*0.85||cs(c).textTransform==='uppercase')add('bilingual',c,'「'+rest.trim()+'」旁的「'+t+'」');
        });
        if(!CJK.test(ht))return;
        [h.nextElementSibling,h.previousElementSibling].forEach(function(s){
          if(!s||eyebrowSet.has(s)||s.closest(EXEMPT)||s.children.length>1)return;
          var t=txt(s);
          if(t.length<=40&&LATIN_LABEL.test(t)&&(t.match(/[A-Za-z]/g)||[]).length>=3&&fs(s)<fs(h)*0.7)
            add('bilingual',s,'「'+ht+'」旁的「'+t+'」');
        });
      });
    });

    /* 區塊編號：標題前後或標題開頭的 01、02… 出現兩次以上 */
    run('section-number',function(){
      var hits=[];
      headings.forEach(function(h){
        if(h.closest('ol,[class*=step],[class*=timeline]'))return;
        var ht=txt(h);
        if(/^0\d[\s.．、\/／|｜—-]/.test(ht)){hits.push([h,'標題開頭「'+ht.slice(0,6)+'」']);return}
        [h.previousElementSibling,h.firstElementChild].forEach(function(s){
          if(s&&/^0\d\s*[.．\/／|｜—-]?\s*$/.test(txt(s)))hits.push([s,'「'+txt(s)+'」接在標題「'+ht.slice(0,12)+'」']);
        });
      });
      if(hits.length>=2)hits.forEach(function(x){add('section-number',x[0],x[1]+'（若順序本身有意義，例如操作步驟，可保留）')});
    });

    /* 同款特色卡：同一層 ≥3 張同 class、同尺寸，每張都是「小圖示＋標題＋文字」、沒有內容大圖 */
    run('feature-cards',function(){
      var seen=new Set();
      all.forEach(function(par){
        if(seen.has(par)||par.children.length<3)return;
        var groups={};
        Array.prototype.forEach.call(par.children,function(c){var k=c.tagName+'.'+(typeof c.className==='string'?c.className.trim():'');(groups[k]=groups[k]||[]).push(c)});
        Object.keys(groups).forEach(function(k){
          var cs3=groups[k].filter(vis);if(cs3.length<3)return;
          var r0=cs3[0].getBoundingClientRect();
          var same=cs3.every(function(c){var r=c.getBoundingClientRect();return Math.abs(r.width-r0.width)<=r0.width*0.06&&Math.abs(r.height-r0.height)<=r0.height*0.15});
          if(!same)return;
          var tile=cs3.every(function(c){
            if(Array.prototype.some.call(c.querySelectorAll('img,picture,video'),function(i){return i.getBoundingClientRect().width>120}))return false;
            var icon=c.querySelector('svg,[class*=icon],[class*=material-symbols],i[class]');
            var head=c.querySelector('h2,h3,h4,h5,strong,b,[class*=title]');
            var body=c.querySelector('p');
            return icon&&head&&body&&(icon.compareDocumentPosition(head)&4);
          });
          if(tile){seen.add(par);add('feature-cards',par,cs3.length+' 張同款卡片（'+k.toLowerCase()+'）；若這是實際功能入口或內容列表可保留')}
        });
      });
    });

    /* 大數字模板：同一層 ≥3 個，最大字是純數字且 ≥28px */
    run('hero-metric',function(){
      var NUM=/^[\d.,]+\s*(%|\+|萬|億|K|M|倍|x|×)?\+?$/;
      var found=new Set();
      all.forEach(function(par){
        if(par.children.length<3)return;
        var n=Array.prototype.filter.call(par.children,function(c){
          var big=Array.prototype.find.call([c].concat(Array.prototype.slice.call(c.querySelectorAll('*'))),function(x){return !x.children.length&&NUM.test(txt(x))&&fs(x)>=28});
          return !!big;
        });
        if(n.length>=3&&!found.has(par)){found.add(par);add('hero-metric',par,n.length+' 個大數字並排；若是真實資料可保留')}
      });
    });

    all.forEach(function(el){
      var c=cs(el);
      run('gradient-text',function(){
        if((c.backgroundClip==='text'||c.webkitBackgroundClip==='text')&&/gradient/.test(c.backgroundImage))add('gradient-text',el,'「'+txt(el).slice(0,20)+'」');
      });
      run('purple-gradient',function(){
        if(!/gradient/.test(c.backgroundImage))return;
        var cols=colorsIn(c.backgroundImage).filter(function(x){return chroma(x)>=50&&x[3]>0.2});
        if(cols.some(function(x){var h=hue(x);return h>=255&&h<=300}))add('purple-gradient',el,'背景漸層含紫色');
      });
      run('glow',function(){
        shadows(c.boxShadow).concat(shadows(c.textShadow)).forEach(function(s){
          if(!s.inset&&s.x===0&&s.y===0&&s.blur>=4&&s.c&&s.c[3]>=0.15&&chroma(s.c)>=40)add('glow',el,'零位移彩色陰影 '+s.blur+'px');
        });
      });
      run('backdrop',function(){
        var b=c.backdropFilter||c.webkitBackdropFilter;
        if(b&&b!=='none')add('backdrop',el,b);
      });
      run('pattern-bg',function(){
        var bi=c.backgroundImage;if(!bi||bi==='none')return;
        if(/repeating-(linear|radial|conic)-gradient/.test(bi)){add('pattern-bg',el,'重複漸層底紋');return}
        var layers=splitTop(bi).filter(function(x){return /gradient/.test(x)}).length;
        var sizes=(c.backgroundSize||'').match(/[\d.]+px/g)||[];
        if(layers>=2&&sizes.length&&sizes.every(function(s){return parseFloat(s)<=100}))add('pattern-bg',el,'小尺寸重複的漸層格線');
      });
      run('radial-halo',function(){
        if(!/radial-gradient/.test(c.backgroundImage)||!vis(el))return;
        var r=el.getBoundingClientRect();
        if(r.width*r.height>=VW*VH*0.2&&/transparent|rgba\([^)]*,\s*0(\.\d+)?\)/.test(c.backgroundImage))add('radial-halo',el,'大面積放射狀漸層');
      });
      run('side-line',function(){
        ['::before','::after'].forEach(function(ps){
          var p=win.getComputedStyle(el,ps);
          if(!p.content||p.content==='none'||p.content==='normal')return;
          var w=parseFloat(p.width)||0,h=parseFloat(p.height)||0,bg=rgba(p.backgroundColor);
          if(w>0&&w<=6&&h>=24&&((bg&&bg[3]>0.1)||parseFloat(p.borderLeftWidth)>0))add('side-line',el,ps+' 直線 '+w+'×'+h+'px');
        });
        if(!el.children.length&&!txt(el)&&vis(el)){
          var r=el.getBoundingClientRect(),bg2=rgba(c.backgroundColor);
          if(r.width<=4&&r.height>=40&&bg2&&bg2[3]>0.1)add('side-line',el,'空元素直線 '+Math.round(r.width)+'×'+Math.round(r.height)+'px');
        }
        if(/vertical/.test(c.writingMode)&&/[A-Za-z]{3}/.test(ownText(el)))add('side-line',el,'直排英文「'+ownText(el).slice(0,16)+'」');
      });
      run('side-border',function(){
        var tw=parseFloat(c.borderTopWidth)||0;
        [['Left','左'],['Right','右']].forEach(function(s){
          var w=parseFloat(c['border'+s[0]+'Width'])||0,st=c['border'+s[0]+'Style'],col=rgba(c['border'+s[0]+'Color']);
          if(w>=2&&st!=='none'&&col&&col[3]>0.1&&w>tw+0.5)add('side-border',el,s[1]+'側 '+w+'px 邊條');
        });
      });
      run('hard-shadow',function(){
        shadows(c.boxShadow).forEach(function(s){
          if(!s.inset&&s.blur===0&&(Math.abs(s.x)>=2||Math.abs(s.y)>=2)&&s.c&&s.c[3]>=0.3)add('hard-shadow',el,s.x+'px '+s.y+'px 0 硬陰影');
        });
      });
      run('infinite-anim',function(){
        if(el.tagName==='MARQUEE'){add('infinite-anim',el,'marquee 跑馬燈');return}
        if(c.animationName&&c.animationName!=='none'&&/infinite/.test(c.animationIterationCount)){
          var id=(typeof el.className==='string'?el.className:'')+' '+(el.getAttribute('role')||'');
          if(/skeleton|spin|loading|loader|progress|busy/i.test(id)||el.getAttribute('aria-busy')==='true')return;
          add('infinite-anim',el,'無限動畫 '+c.animationName);
        }
      });
      run('symbol-icon',function(){
        if(el.closest(CODE)||ICON_FONT.test(c.fontFamily))return;
        ['::before','::after'].forEach(function(ps){
          var ct=win.getComputedStyle(el,ps).content;
          if(ct&&ct!=='none'&&ct!=='normal'&&/^["']/.test(ct)&&SYM.test(ct))add('symbol-icon',el,ps+' 內容 '+ct);
        });
        el.childNodes.forEach(function(n){
          if(n.nodeType!==3)return;
          var t=n.nodeValue.replace(/\s+/g,' ').trim();if(!t||!SYM.test(t))return;
          if(SYM_ONLY.test(t)&&t.length<=4){add('symbol-icon',el,'「'+t+'」');return}
          if(t.length<=40&&(SYM.test(t.slice(0,2))||SYM.test(t.slice(-2))))add('symbol-icon',el,'「'+t+'」');
        });
      });
      run('mono-costume',function(){
        if(el.closest(CODE))return;
        /* 數值、尺寸、斷點代號（640px、sm、≥ 768px）屬於「數據」，等寬是對的；只抓一般文字 */
        var t=ownText(el);if(!t||/\d/.test(t)||t.length<=4||!/[A-Za-z\u3400-\u9FFF]/.test(t))return;
        var first=(c.fontFamily.split(',')[0]||'').toLowerCase();
        if(/mono|courier|consolas|menlo|monaco/.test(first))add('mono-costume',el,'「'+t.slice(0,20)+'」用 '+first.replace(/"/g,''));
      });
    });

    /* 文案：只看有直接文字的區塊，位置才準 */
    run('copy',function(){
      var blocks=all.filter(function(el){return /^(P|LI|H[1-6]|TD|TH|DD|DT|BLOCKQUOTE|FIGCAPTION|LABEL|SPAN|DIV|A|BUTTON|SMALL|STRONG|EM)$/.test(el.tagName)&&ownText(el)&&!el.closest(CODE)});
      blocks.forEach(function(el){
        var t=ownText(el),low=t.toLowerCase();
        BUZZ.forEach(function(w){if(low.indexOf(w.toLowerCase())>=0)add('buzzword',el,'「'+w+'」：'+t.slice(0,30))});
        if(/不(只|僅)(僅)?是?[^。！？!?\n]{1,24}(更是|而是)/.test(t))add('aphorism',el,t.slice(0,40));
        var d=(t.match(/—+/g)||[]).length;
        if(d>=2&&t.replace(/[—\s]/g,'').length)add('em-dash',el,d+' 個破折號：'+t.slice(0,30));
      });
    });

    return {findings:out,errors:errors,rules:RULES,manual:MANUAL};
  };

  /* 給報告與命令列用：元素 → 簡短路徑（tag#id.class 往上三層） */
  g.HL_aiPath=function(el){
    var p=[];
    for(var i=0;el&&el.nodeType===1&&i<3&&el.tagName!=='BODY';i++,el=el.parentElement){
      var s=el.tagName.toLowerCase();
      if(el.id)s+='#'+el.id;
      else if(typeof el.className==='string'&&el.className.trim())s+='.'+el.className.trim().split(/\s+/).slice(0,2).join('.');
      p.unshift(s);
    }
    return p.join(' > ');
  };
})(window);
