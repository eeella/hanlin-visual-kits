# 全站無差別自我檢查：真實 DOM + computedStyle，不用字串比對下結論。
# 分批非同步執行，避免同步長迴圈把頁面卡死（前一版就是這樣沒有輸出）。
import extract,json,glob,os
SAMPLES={os.path.basename(p):open(p,encoding='utf-8').read() for p in glob.glob('samples/*.html')}
ENG=extract.engine('import.html')
SJ=json.dumps(SAMPLES,ensure_ascii=False).replace('</script>','<\\/script>')
open('selfcheck.html','w',encoding='utf-8').write("""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SC-RUN</title></head>
<body><pre id="out">run</pre><iframe id="fr" style="width:1280px;height:1600px;border:0"></iframe>
<script>var SAMPLES=@@SAMPLES@@;</script><script>@@ENG@@</script><script>
window.onerror=function(m,u,l){document.getElementById('out').textContent='ERR '+m+' @'+l+'\\n'+R.join('\\n');document.title='SC-DONE'};
var R=[],FAIL=[],NA=0,OKN=0,KEEPLOG=[];
function T(n,ok,d){if(ok){OKN++;return}FAIL.push(n+(d?('  〔'+d+'〕'):''))}
function pRgb(c){var m=/(\\d+(?:\\.\\d+)?),\\s*(\\d+(?:\\.\\d+)?),\\s*(\\d+(?:\\.\\d+)?)/.exec(c||'');return m?[+m[1],+m[2],+m[3]]:null}
function pLum(c){return c.map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}).reduce(function(a,b,i){return a+b*[.2126,.7152,.0722][i]},0)}
function pCR(a,b){var l1=pLum(a),l2=pLum(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)}
function hueOf(c){if(!c)return 'none';var r=c[0],g=c[1],b=c[2];
  if(Math.max(r,g,b)-Math.min(r,g,b)<4)return 'gray';
  if(g>r&&g>=b)return 'green'; if(b>=r&&b>=g)return 'blue';
  if(r>g&&g>=b)return (r-g>60?'red':'orange'); return 'other';}
function gradStops(t){var out=[],m,re=/rgba?\\(([^)]+)\\)/g;
  while((m=re.exec(t))){var n=m[1].split(',');
    if(n.length>3&&parseFloat(n[3])<0.35)continue;
    out.push([+n[0],+n[1],+n[2]])}return out}
/* 漸層底改成抽出停駐色、取最暗的當底；先前直接 return null，
   等於整片主視覺（漸層）完全不檢查——這就是漏網的結構盲點。 */
function bgOf(el,W,d){var e=el;while(e&&e!==d.documentElement){var c=W.getComputedStyle(e);
  if(c.backgroundImage&&c.backgroundImage!=='none'){var st=gradStops(c.backgroundImage);
    if(!st.length)return null;
    var wi=st[0],wl=pLum(st[0]);
    for(var q=1;q<st.length;q++){var L=pLum(st[q]);if(L<wl){wl=L;wi=st[q]}}
    return wi}
  var p=pRgb(c.backgroundColor);
  if(p){var al=c.backgroundColor.indexOf('rgba')===0?parseFloat(c.backgroundColor.split(',')[3]):1;
    if(al>=0.95)return p}
  e=e.parentElement}return [255,255,255]}
function cfg(hd,logo,member,hero,fm){return JSON.stringify({
  theme:{n:'翰林藍',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},contrast:'auto',
  logoLight:logo,logoDark:logo,logoInv:false,
  groups:{hd:hd,ft:2,hero:hero,fm:fm,opt:1,tblsty:0,icon:0},
  controls:{btn:true,seg:true,select:true,label:true,principles:true,midcolor:true,gray:true,softtile:true,rwd:true,type:true,shape:true},
  memberEntry:member});}
var F1='user-index_v6.html',F2='s21-appshell.html',F3='user-edcafe.html';
/* 規範 3.12 功能選單標準四色＋原檔刻意的裝飾（紙屑）不算殘留 */
var FMOK={'rgb(231, 242, 251)':1,'rgb(226, 247, 239)':1,'rgb(251, 234, 221)':1,'rgb(238, 246, 222)':1};

/* ═══ 階段 1：字串層矩陣（分批） ═══ */
var JOBS=[];
for(var hd=0;hd<9;hd++)for(var lg=0;lg<4;lg++)for(var mb=0;mb<2;mb++)JOBS.push([F1,hd,lg,mb]);
for(var hd2=0;hd2<9;hd2++){JOBS.push([F2,hd2,hd2%4,1]);JOBS.push([F3,hd2,hd2%4,1])}
var ji=0;
function phase1(){
  var end=Math.min(ji+6,JOBS.length);
  for(;ji<end;ji++){
    var j=JOBS[ji],src=SAMPLES[j[0]];
    if(!src){NA++;continue}
    var tag=j[0].replace('.html','')+'/hd'+j[1]+'/logo'+j[2]+'/member'+j[3];
    localStorage.setItem('hanlin-brand-theme',cfg(j[1],j[2],j[3]===1,1,1));
    var r,h;try{r=brandifyHtml(src,{});h=r.html}catch(e){T('套用未拋錯 '+tag,false,e.message);continue}
    var dd=new DOMParser().parseFromString(h,'text/html');
    var im=dd.querySelector('[data-hl-hd] img[alt="翰林"]');
    if(im)T('Logo 實體＝所選樣式 '+tag,(im.getAttribute('src')||'').length===LOGO_SET[j[2]].length,
      '期望'+LOGO_SET[j[2]].length+' 實得'+(im.getAttribute('src')||'').length);
    if(j[3]===1)T('登入入口已注入 '+tag,!!dd.querySelector('[data-hl-member-btn]'),'');
    T('頁尾已套用 '+tag,!!dd.querySelector('[data-hl-ft]'),'');
    /* 對照表的「未套用」要分兩種：頁面上根本沒有該元件（正常），與有卻漏掉（缺陷）。
       A（Logo）與 B（登入）在這三個檔案都必定該套上，用它們當硬標準；
       C（表單選項卡）／D（功能選單）不是每個檔案都有，只檢查有回報原因。 */
    var ck=r.checklist||[];
    var byk={};ck.forEach(function(x){byk[x.key]=x});
    T('對照表 A Logo 已套用 '+tag,!!(byk.logoReplacement&&byk.logoReplacement.done),
      (byk.logoReplacement&&byk.logoReplacement.why)||'無回報');
    if(j[3]===1)T('對照表 B 登入已套用 '+tag,!!(byk.loginSystemInjection&&byk.loginSystemInjection.done),
      (byk.loginSystemInjection&&byk.loginSystemInjection.why)||'無回報');
    T('對照表 未套用項都有具體原因 '+tag,
      ck.filter(function(x){return !x.done&&!x.why}).length===0,'');
    /* 功能通電：注入的元件都要帶自己的 runtime */
    if(/data-hl-member-btn/.test(h))T('登入 runtime 已注入 '+tag,/data-hl-member-menu\\"\\)/.test(h)||h.indexOf('data-hl-member-btn")')>-1,'');
    if(/data-hl-formopt/.test(h))T('選項卡 runtime 已注入 '+tag,h.indexOf('aria-checked')>-1,'');
  }
  if(ji<JOBS.length){setTimeout(phase1,0);return}
  R.push('階段1 字串層矩陣：'+JOBS.length+' 組（3 檔 × Header × Logo × 登入開關）');
  phase2();
}
/* ═══ 階段 2：真實渲染逐元件量測 ═══ */
var R2=[];
for(var q=0;q<9;q++)R2.push([F1,q]);
for(var q2=0;q2<9;q2+=3)R2.push([F2,q2]);
for(var q3=0;q3<9;q3+=4)R2.push([F3,q3]);
var ri=0,fr=document.getElementById('fr');
function phase2(){
  if(ri>=R2.length){
    R.push('階段2 真實渲染：'+R2.length+' 組 × 全元件 computedStyle 量測');
    R.push('');R.push('通過斷言 '+OKN+' 項');
    if(FAIL.length){
      /* 依「斷言種類」歸類，同一個問題不要洗版 */
      var G={},order=[];
      FAIL.forEach(function(x){
        var k=x.split(' ')[0].replace(/\[\d+\]/,'[n]');
        if(!G[k]){G[k]=[];order.push(k)}
        G[k].push(x);
      });
      R.push('❌ 失敗 '+FAIL.length+' 項，分屬 '+order.length+' 類：');
      order.forEach(function(k){
        R.push('  ── '+k+'（'+G[k].length+' 次）');
        G[k].slice(0,3).forEach(function(x){R.push('     '+x)});
        if(G[k].length>3)R.push('     …同類另 '+(G[k].length-3)+' 次');
      });
    }
    else R.push('✅ 全部通過，無任何遺漏');
    if(KEEPLOG.length){R.push('');R.push('◽ 刻意保留的原檔分類／狀態色（我們從未塗改，改掉會讓語意消失）：');
      KEEPLOG.slice(0,4).forEach(function(x){R.push('   '+x)});}
    document.getElementById('out').textContent=R.join('\\n');document.title='SC-DONE';return;
  }
  var job=R2[ri],src=SAMPLES[job[0]];
  if(!src){ri++;return phase2()}
  localStorage.setItem('hanlin-brand-theme',cfg(job[1],job[1]%4,true,1,1));
  fr.srcdoc=brandifyHtml(src,{}).html;
  setTimeout(function(){
    var d=fr.contentDocument,W=fr.contentWindow,tag=job[0].replace('.html','')+'/hd'+job[1];
    try{
      Array.prototype.forEach.call(d.querySelectorAll('.random-only,.hidden'),function(e){e.classList.remove('hidden');e.style.display=''});
    }catch(e){}
    /* ① 登入 */
    var btn=d.querySelector('[data-hl-member-btn]'),menu=d.querySelector('[data-hl-member-menu]'),it=d.querySelector('[data-hl-member-item]');
    if(btn){
      var fg=pRgb(W.getComputedStyle(btn).color),bg=bgOf(btn,W,d);
      if(fg&&bg)T('登入按鈕文字可讀 '+tag,pCR(fg,bg)>=4.5,pCR(fg,bg).toFixed(2)+':1');
      T('登入按鈕有實際尺寸 '+tag,btn.getBoundingClientRect().width>40,'');
      if(it&&menu){var f2=pRgb(W.getComputedStyle(it).color),b2=pRgb(W.getComputedStyle(menu).backgroundColor);
        if(f2&&b2)T('登入選單文字可讀（不得白底白字）'+tag,pCR(f2,b2)>=4.5,pCR(f2,b2).toFixed(2)+':1');}
    }
    /* ② Logo */
    var im=d.querySelector('[data-hl-hd] img[alt="翰林"]');
    if(im)T('Logo 有實際尺寸 '+tag,im.getBoundingClientRect().width>4&&im.getBoundingClientRect().height>4,
      Math.round(im.getBoundingClientRect().width)+'x'+Math.round(im.getBoundingClientRect().height));
    /* ③ 橫幅 */
    var hero=d.querySelector('[data-hl-hero]');
    if(hero){T('歡迎橫幅有實際高度 '+tag,hero.getBoundingClientRect().height>40,Math.round(hero.getBoundingClientRect().height)+'px');
      var hf=pRgb(W.getComputedStyle(hero).color),hb=bgOf(hero,W,d);
      if(hf&&hb)T('橫幅文字可讀 '+tag,pCR(hf,hb)>=4.5,pCR(hf,hb).toFixed(2)+':1');}
    /* ④ 頁尾 */
    var ft=d.querySelector('[data-hl-ft]');
    if(ft){T('頁尾有實際高度 '+tag,ft.getBoundingClientRect().height>20,Math.round(ft.getBoundingClientRect().height)+'px');
      var ff=pRgb(W.getComputedStyle(ft).color),fb=bgOf(ft,W,d);
      if(ff&&fb)T('頁尾文字可讀 '+tag,pCR(ff,fb)>=4.5,pCR(ff,fb).toFixed(2)+':1');}
    /* ⑤ 側邊欄（app shell） */
    var sb=d.querySelector('[data-hl-sb]');
    if(sb){T('側邊欄有實際寬度 '+tag,sb.getBoundingClientRect().width>60,Math.round(sb.getBoundingClientRect().width)+'px');
      var sf=pRgb(W.getComputedStyle(sb).color),sbb=bgOf(sb,W,d);
      if(sf&&sbb)T('側邊欄文字可讀 '+tag,pCR(sf,sbb)>=4.5,pCR(sf,sbb).toFixed(2)+':1');}
    /* ⑥ 卷種／表單選項卡 */
    var fo=d.querySelectorAll('[data-hl-formopt]');
    Array.prototype.forEach.call(fo,function(e,k){
      var c=pRgb(W.getComputedStyle(e).backgroundColor);
      T('卷種['+k+'] 不帶綠底 '+tag,hueOf(c)!=='green',W.getComputedStyle(e).backgroundColor);
    });
    /* ⑦ 輸入框 */
    Array.prototype.forEach.call(d.querySelectorAll('input[type=text],input[type=search],input:not([type]),select,textarea'),function(e,k){
      if(k>5)return;var rc=e.getBoundingClientRect();if(!rc.width||!rc.height)return;
      var c=W.getComputedStyle(e),f=pRgb(c.color),b=bgOf(e,W,d);
      if(f&&b)T('輸入框['+k+'] 文字可讀 '+tag,pCR(f,b)>=4.5,pCR(f,b).toFixed(2)+':1');
    });
    /* ⑧ 晶片／標籤 */
    Array.prototype.forEach.call(d.querySelectorAll('[data-hl-tag]'),function(e,k){
      if(k>5)return;var rc=e.getBoundingClientRect();if(!rc.width||!rc.height)return;
      var c=W.getComputedStyle(e),f=pRgb(c.color),b=bgOf(e,W,d);
      if(f&&b)T('晶片['+k+'] 文字可讀 '+tag,pCR(f,b)>=4.5,pCR(f,b).toFixed(2)+':1');
    });
    /* ⑨ 按鈕圓角＝100px（STYLEGUIDE 2.4 radius.md） */
    var bad=[];
    Array.prototype.forEach.call(d.querySelectorAll('button,[class*=btn]'),function(e){
      var rc=e.getBoundingClientRect();if(!rc.width||!rc.height)return;
      if(e.closest&&e.closest('[data-hl-formopt]'))return;
      var br=W.getComputedStyle(e).borderTopLeftRadius;
      if(br!=='100px'&&br!=='50%')bad.push(e.tagName+'.'+String(e.className||'').split(' ')[0]+'='+br);
    });
    var ub={},uub=[];bad.forEach(function(x){if(!ub[x]){ub[x]=1;uub.push(x)}});
    T('按鈕圓角一律 100px 藥丸形 '+tag,uub.length===0,uub.slice(0,4).join(' ｜ '));
    /* ⑩ 殘留：非藍相底色／框線（排除規範四色與原檔裝飾） */
    var res=[],ur={},KEEP=[],uk={};
    Array.prototype.forEach.call(d.querySelectorAll('body *'),function(e){
      var c=W.getComputedStyle(e);if(c.display==='none')return;
      var rc=e.getBoundingClientRect();if(!rc.width||!rc.height)return;
      var cls=String(e.className||'');
      /* 先前這裡排除了 confetti/spark/dot——正是漏掉主視覺裝飾殘留的原因。
         裝飾疊在我們重繪的品牌底上，非品牌雜色照樣看得見，必須納入檢查。 */
      if(e.hasAttribute('data-hl-decor'))return;   /* 已由我們接管成規範裝飾色 */
      /* 判準：只有「我們自己塗過的底色／框線」還帶非品牌色才算殘留穿透。
         我們從沒動過的原檔顏色，多半是原設計用來編碼分類或狀態的
         （edcafe 的 .lg.g「🟢 Edcafe」對 .lg.b「🔵 翰林」、.nav-item.ce/.hl 同一套），
         把它改成品牌藍會讓整份對照表兩邊同色、失去意義——
         規範也明訂狀態色保留、裝飾色不得表達狀態。這類列為「刻意保留」。 */
      var ruleAttr=String(e.getAttribute('data-hl-rule')||'');
      var weSetBg=/(^|\|)background(-color|-image)?=/.test(ruleAttr);
      var weSetBd=/(^|\|)(border|outline)(-[a-z]+)?=/.test(ruleAttr);
      var bgc=c.backgroundColor;
      if(bgc.indexOf('rgba(0, 0, 0, 0)')<0&&!FMOK[bgc]&&!e.hasAttribute('data-hl-fmcard')){
        var hh=hueOf(pRgb(bgc));
        if(hh==='green'||hh==='red'){
          var k2=e.tagName+'.'+cls.split(' ')[0]+' 底'+bgc;
          if(weSetBg){if(!ur[k2]){ur[k2]=1;res.push(k2+'（我們塗的）')}}
          else if(!uk[k2]){uk[k2]=1;KEEP.push(k2)}
        }
      }
      if(parseFloat(c.borderTopWidth)>0&&c.borderTopStyle!=='none'){
        var hb2=hueOf(pRgb(c.borderTopColor));
        if(hb2==='green'||hb2==='red'){
          var k3=e.tagName+'.'+cls.split(' ')[0]+' 框'+c.borderTopColor;
          if(weSetBd){if(!ur[k3]){ur[k3]=1;res.push(k3+'（我們塗的）')}}
          else if(!uk[k3]){uk[k3]=1;KEEP.push(k3)}
        }
      }
    });
    T('全站無非品牌色殘留：我們塗過的底色/框線 0 穿透 '+tag,res.length===0,res.slice(0,4).join(' ｜ '));
    if(KEEP.length)KEEPLOG.push(tag+'：'+KEEP.slice(0,3).join(' ｜ ')+(KEEP.length>3?(' …另 '+(KEEP.length-3)+' 個'):''));
    /* ⑪ 隱形文字 */
    var inv=[],ui={};
    Array.prototype.forEach.call(d.querySelectorAll('body *'),function(e){
      var c=W.getComputedStyle(e);
      if(c.display==='none'||c.visibility==='hidden'||parseFloat(c.opacity)<0.15)return;
      var rc=e.getBoundingClientRect();if(!rc.width||!rc.height)return;
      var own='';for(var k4=0;k4<e.childNodes.length;k4++)if(e.childNodes[k4].nodeType===3)own+=e.childNodes[k4].nodeValue;
      own=own.replace(/\\s+/g,'');
      /* 圖示不再豁免：ligature 圖示看不見跟文字看不見一樣是缺陷
         （.spark 裡的圖示被塗成主色疊在深藍漸層上只有 1.6:1）。 */
      var isIc=/material-symbols|material-icons/.test(String(e.className||''));
      if(!isIc&&own.length<2)return;
      if(isIc&&!own.length)return;
      var f=pRgb(c.color),b=bgOf(e,W,d);
      if(!f||!b)return;
      var cr=pCR(f,b);
      if(cr<2.0){var k5=e.tagName+'.'+String(e.className||'').split(' ')[0]+' '+cr.toFixed(2)+':1 「'+own.slice(0,8)+'」 色'+c.color+' rule='+String(e.getAttribute('data-hl-rule')||'-').slice(0,44);
        if(!ui[k5]){ui[k5]=1;inv.push(k5)}}
    });
    T('全頁無隱形文字（對比<2:1）'+tag,inv.length===0,inv.slice(0,4).join(' ｜ '));
    /* ⑫ 歡迎橫幅：兩種變體要有可辨識的差異（不是只差一層看不見的遮罩） */
    if(job[1]===0&&d.querySelector('[data-hl-hero]')){
      var HSIG={};
      [0,1].forEach(function(hv){
        localStorage.setItem('hanlin-brand-theme',cfg(job[1],job[1]%4,true,hv,1));
        var hh=brandifyHtml(src,{}).html;
        var hd2=new DOMParser().parseFromString(hh,'text/html');
        var he2=hd2.querySelector('[data-hl-hero]');
        HSIG[hv]=(he2?(he2.getAttribute('style')||''):'')
          +'|預留位'+(hd2.querySelectorAll('[data-hl-photo]').length);
      });
      T('歡迎橫幅：AI 漸層版與純圖片版結果不同 '+tag,HSIG[0]!==HSIG[1],'兩者相同');
      T('歡迎橫幅：純圖片版有照片或照片預留位 '+tag,
        /url\(/.test(HSIG[1])||/預留位[1-9]/.test(HSIG[1]),HSIG[1].slice(-16));
      localStorage.setItem('hanlin-brand-theme',cfg(job[1],job[1]%4,true,1,1));
    }
    /* ⑬ 功能通電：注入的 runtime 腳本都在 */
    T('runtime 腳本已注入 '+tag,d.querySelectorAll('script[data-hl-rt]').length>0,'');
    ri++;phase2();
  },900);
}
phase1();
</script></body></html>""".replace("@@SAMPLES@@",SJ).replace("@@ENG@@",ENG))
print('selfcheck.html 已產生')
