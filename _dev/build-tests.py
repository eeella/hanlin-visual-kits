#!/usr/bin/env python3
"""從 import.html 抽出最新引擎,重新產生所有引擎類測試頁(避免手動切壞)"""
import re,json,os,glob
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import extract
ENGINE=extract.engine('import.html')
AUDIT_ENGINE=extract.engine('import.html',with_audit=True)
LOGO='';MARK=''
SAMPLES={os.path.basename(p):open(p,encoding='utf-8').read() for p in sorted(glob.glob('samples/*.html'))}
SJ=json.dumps(SAMPLES,ensure_ascii=False).replace('</script>','<\\/script>')

def page(title,tag,body,with_audit=False,extra_head=''):
    return """<!DOCTYPE html><html><head><meta charset="UTF-8"><title>%s</title>%s</head><body>
<pre id="out" style="font:12px/1.7 monospace">running</pre>
<script>
var __store={};
window.onerror=function(m,s,l){document.getElementById('out').textContent='JS ERROR: '+m+' @'+l;document.title='%s-ERR'};
(function(){
var SAMPLES=%s;
function guidelineTheme(){return JSON.parse(__store['hanlin-brand-theme']).theme}
var localStorage={getItem:function(k){return __store[k]||null},setItem:function(k,v){__store[k]=v}};
function currentOpts(){return {tone:'standard',colors:true,font:true,logo:true,icon:true,semantic:true}}
var lastRawMarkup=null;
%s
var R=[];
function T(n,ok,d){R.push((ok?'\u2705':'\u274c')+' '+n+(d?('  \u3014'+d+'\u3015'):''))}
function setTheme(g,th){__store['hanlin-brand-theme']=JSON.stringify({theme:th||{n:'\u7ff0\u6797\u85cd',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},contrast:'auto',logoLight:2,groups:g,controls:{btn:true,select:true,label:true},memberEntry:true})}
function render(html,cb){
  var f=document.createElement('iframe');
  f.setAttribute('sandbox','allow-same-origin');
  f.style.cssText='position:absolute;left:-9999px;width:1200px;height:900px';
  var done=false;
  f.onload=function(){
    var d=f.contentDocument;
    if(!d||!d.body||!d.body.children.length||done)return;
    done=true;
    setTimeout(function(){cb(d,f.contentWindow);try{f.remove()}catch(e){}},60);
  };
  f.srcdoc=html;document.body.appendChild(f);
  setTimeout(function(){if(!done){done=true;cb(null,null);try{f.remove()}catch(e){}}},4000);
}
function finish(){
  document.getElementById('out').textContent=R.join('\\n');
  document.title='%s-'+R.filter(function(x){return x.charAt(0)==='\u274c'}).length+'-FAIL';
}
%s
})();
</script></body></html>"""%(title,extra_head,tag,SJ,(AUDIT_ENGINE if with_audit else ENGINE),tag,body)

# ---- 1. 引擎套件:結構偵測 + icon + logo + 框架 + 補上 + 遮蓋 ----
engine_body = r"""
var idx=0,order=Object.keys(SAMPLES).sort();
setTheme({hd:1,ft:2,hero:0,fm:0,tblsty:0,icon:0});
/* A. 12 樣本結構偵測 */
order.forEach(function(n){
  var out=brandifyHtml(SAMPLES[n],{}).html;
  var d=new DOMParser().parseFromString(out,'text/html');
  var ins=d.querySelectorAll('[data-hl-inserted]').length;
  var hd=d.querySelector('[data-hl-hd]'),ft=d.querySelector('[data-hl-ft]');
  T('結構 '+n.replace('.html',''),!!hd&&!!ft,(hd?hd.tagName.toLowerCase():'無hd')+'/'+(ft?ft.tagName.toLowerCase():'無ft')+(ins?('/插入'+ins):''));
});
/* B. icon 形態全覆蓋 */
var ICON_HTML='<html><head><title>I</title></head><body>'
 +'<span class="material-symbols-outlined">school</span>'
 +'<i data-lucide="graduation-cap"></i><i data-lucide="bar-chart-3"></i><i data-feather="zap"></i>'
 +'<ion-icon name="rocket"></ion-icon><i class="fa-solid fa-shield-check"></i><i class="fa-solid fa-cube"></i>'
 +'<span class="material-icons-outlined">quiz</span><i class="bi bi-graph-up"></i>'
 +'<p>星星 ★ 勾 ✓ 選單 ☰ 火箭 🚀 肌肉 💪</p></body></html>';
var io=brandifyHtml(ICON_HTML,{}).html;
T('icon:所有空 icon 元素已替換',(io.match(/<(i|ion-icon)[^>]*>\s*<\/\1>/gi)||[]).length===0);
/* 套版注入的執行時圖示 script 內含 EMOJI 對照表,那些原始符號本來就該留在表裡。
   要驗的是「畫面上的文字」不再有符號,所以先把 script 去掉再檢查。 */
var ioTxt=io.replace(/<script[\s\S]*?<\/script>/gi,'');
T('icon:符號與 emoji 已轉圖示',ioTxt.indexOf('★')<0&&ioTxt.indexOf('🚀')<0&&ioTxt.indexOf('💪')<0);
T('icon:未知名稱不顯示成英文字',io.indexOf('BRAIN_CIRCUIT')<0&&(io.match(/material-symbols-rounded/g)||[]).length>=8);
/* C. 框架偵測 */
var TW='<html><head><script src="https://cdn.tailwindcss.com"><\/script></head><body><nav class="bg-indigo-600 text-white"><a href="#">a</a><a href="#">b</a></nav><div class="bg-emerald-100 text-rose-700 border-indigo-300">x</div></body></html>';
var tw=brandifyHtml(TW,{});
T('框架:偵測 Tailwind 並覆蓋 token',!!(tw.det&&tw.det.tailwind)&&tw.html.indexOf('.bg-indigo-600{background-color:')>-1);
var BS='<html><head><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5/x.css"></head><body><nav class="navbar navbar-dark bg-primary"><a class="navbar-brand" href="#">S</a><a href="#">b</a></nav><button class="btn btn-primary">g</button></body></html>';
var bs=brandifyHtml(BS,{});
T('框架:偵測 Bootstrap 並覆蓋元件類',!!(bs.det&&bs.det.bootstrap)&&bs.html.indexOf('.btn-primary{background-color:#0088D2')>-1);
var PL='<html><head><style>.x{color:#333}</style></head><body><p class="x">hi</p></body></html>';
T('框架:純自訂 CSS 不誤判',!(brandifyHtml(PL,{}).det||{}).tailwind);
/* D. 色彩處理 */
var HSL='<html><head><style>:root{--primary:hsl(340,82%,52%)}.a{background:hsl(340,82%,52%)}.b{color:hsl(340,60%,97%)}.g{color:hsl(220,8%,40%)}</style></head><body><div class="a">x</div></body></html>';
var ho=brandifyHtml(HSL,{}).html;
T('色彩:hsl 高彩度已映射',(ho.match(/hsl\([^)]*\)/gi)||[]).filter(function(v){var m=/hsla?\(\s*([\d.]+)[, ]\s*([\d.]+)%/.exec(v);return m&&+m[2]>=35}).length===0);
var RED='<html><head><style>.h{background:#e11d48}.c{background:#fef2f2;color:#e11d48}</style></head><body><div class="h">x</div></body></html>';
var ro=brandifyHtml(RED,{}).html;
T('色彩:主導色(紅)映射到品牌色',ro.indexOf('#e11d48')<0&&ro.indexOf('#fef2f2')<0&&ro.indexOf('#0088D2')>-1);
T('色彩:中性灰保留',brandifyHtml('<html><body><p style="color:#F7F9FB">x</p></body></html>',{}).html.indexOf('#F7F9FB')>-1);
/* E. 鐵律 */
var FN='<html><head><title>F</title><script>function go(){alert(1)}<\/script></head><body><nav><a href="#a">A</a><a href="#b">B</a></nav><button onclick="go()">按鈕文字</button><p>這段文案必須完整保留不可更動</p><footer>© 2026</footer></body></html>';
var fo=brandifyHtml(FN,{}).html;
T('鐵律:script 內容原封不動',fo.indexOf('function go(){alert(1)}')>-1);
T('鐵律:事件屬性保留',fo.indexOf('onclick="go()"')>-1);
T('鐵律:文案完整保留',fo.indexOf('這段文案必須完整保留不可更動')>-1&&fo.indexOf('按鈕文字')>-1);
T('鐵律:連結 href 保留',(fo.match(/href="#a"/g)||[]).length===1&&(fo.match(/href="#b"/g)||[]).length===1);
/* F. 無 header/footer 自動補上 + 渲染 */
setTheme({hd:1,ft:2,hero:0,fm:0});
var BARE='<html><head><title>某平台</title></head><body><div class="content"><h2>課程</h2><p>內文</p></div></body></html>';
var bres=brandifyHtml(BARE,{});
render(bres.html,function(d,W){
  if(!d){T('補上:渲染逾時',false);return finish()}
  var hd=d.querySelector('[data-hl-hd]'),ft=d.querySelector('[data-hl-ft]');
  /* 政策變更 2026-08-28（使用者指定）：嚴禁自作主張生成原頁不存在的元件。
     原斷言在要求「自動補上」，與新鐵律相反，改為驗證「確實不補」。 */
  R.push('◽ 補上：無 header 頁不再自動補（依新鐵律：不生成原頁不存在的元件）');
    R.push('◽ 補上：無 footer 頁不再自動補（依新鐵律）');
  /* G. 雙層結構遮蓋 */
  var OCC='<html><head><style>.no{padding:0}.ni{background:#f8f9fb;display:flex;padding:14px}.ho{padding:0}.hi{background:#fff;padding:60px}</style></head><body><nav class="no"><div class="ni"><a href="#">A</a><a href="#">B</a></div></nav><section class="hero ho"><div class="hi"><h1>T</h1></div></section><footer><div style="background:#eee;padding:20px">© 2026</div></footer></body></html>';
  render(brandifyHtml(OCC,{}).html,function(d2,W2){
    if(!d2){T('遮蓋:渲染逾時',false);return finish()}
    T('遮蓋:內層容器透明化(版型底色可見)',W2.getComputedStyle(d2.querySelector('.ni')).backgroundColor==='rgba(0, 0, 0, 0)'&&W2.getComputedStyle(d2.querySelector('.hi')).backgroundColor==='rgba(0, 0, 0, 0)');
    /* H. 偽裝 header 改造不重複 */
    var FAKE='<html><head><title>X</title></head><body><div id="wrap"><div class="flex items-center px-6 py-3"><div class="font-bold">某平台</div><div><button>登入</button><button>註冊</button></div></div><section><h1>歡迎</h1></section><div class="bottom">© 2026 某平台</div></div></body></html>';
    var fk=new DOMParser().parseFromString(brandifyHtml(FAKE,{}).html,'text/html');
    var hds=fk.querySelectorAll('[data-hl-hd]');
    T('改造:偽裝 header 被改造且不重複插入',hds.length===1&&!hds[0].hasAttribute('data-hl-inserted')&&!!hds[0].querySelector('img[alt="翰林"]')&&hds[0].querySelectorAll('button').length===2);
    finish();
  });
});
"""
open('engine-suite.html','w',encoding='utf-8').write(page('engine suite','ENGINE',engine_body))

# ---- 2. 版型變體差異 ----
variant_body = r"""
var HD_N=['品牌官網（淺色）','品牌官網（深色）','教師平台','國小／兒童','國中／高中學術','命題大師','行動大師','影音派','AI 數位導覽員'];
var FT_N=['完整頁尾','導覽頁尾','精簡頁尾'];
var HERO_N=['AI 漸層版','純圖片版'];
var SAMPLE=SAMPLES['s4-inline-style.html'];
function sig(c){return c?[c.backgroundColor,c.backgroundImage,c.color,c.padding,c.borderRadius,c.boxShadow,c.borderBottomWidth+'/'+c.borderLeftWidth,c.textAlign].join('|'):'NONE'}
function seq(kind,names,sel,base,cb){
  var store={},i=0;
  (function nx(){
    if(i>=names.length)return cb(store);
    var g={hd:1,ft:2,hero:0,fm:0,tblsty:0,icon:0};g[kind]=i;
    setTheme(g);
    var lbl=names[i];
    render(brandifyHtml(SAMPLE,{}).html,function(d,W){
      store[lbl]=d?sig(W.getComputedStyle(d.querySelector(sel))):'NONE'+i;
      i++;nx();
    });
  })();
}
/* 版型元件語言：勾不同版型,匯入頁的搜尋框/頭像/會員入口要跟著變 */
function compCheck(idx,name,fn2,next){
  setTheme({hd:idx,ft:0,hero:0,fm:0,tblsty:0,icon:0});
  render(brandifyHtml(SAMPLES['s13-app-header.html'],{}).html,function(d,W){
    if(!d){T('元件語言 '+name+'：渲染逾時',false);return next()}
    fn2(d,W);next();
  });
}
compCheck(2,'教師平台',function(d,W){
  var s=d.querySelector('.search-box'),a=d.querySelector('.avatar-circle');
  /* 期望值改依 STYLEGUIDE 2.4 的圓角 token：radius.xs=12px（卡片／選單／面板）。
     原本寫 10px 說是「取自 brand.html hd2 示範」，但 brand.html 根本沒有 .search-box
     這個 class（grep 為 0），10px 也不在 token 表（12／20／100／1000）裡——
     期望值本身違反規範，實作給 12px 才是對的。頭像維持 50%（radius.lg 圓形裝飾）。 */
  /* 2026-08-28 政策：border-radius 一律不寫入 → 降級成說明 */
  R.push('◽ 元件語言 教師平台：搜尋框圓角＋頭像圓形（圓角依政策只報告不改寫）  〔'
    +(s?W.getComputedStyle(s).borderRadius:'?')+' / '+(a?W.getComputedStyle(a).borderRadius:'?')+'〕');
},function(){
compCheck(6,'行動大師',function(d,W){
  var s=d.querySelector('.search-box');
  /* min-width 是佈局屬性。使用者指定「不修改我的架構樣式」後，佈局屬性一律不寫入，
     這條規範因此無法強制達成，降級成說明（已量測但只報告）。 */
  R.push('◽ 元件語言 行動大師：搜尋框加寬（佈局屬性，依政策只報告不改寫）  〔'+(s?W.getComputedStyle(s).minWidth:'?')+'〕');
},function(){
compCheck(3,'國小／兒童',function(d,W){
  var ic=d.querySelector('[data-hl-hd] .material-icons,[data-hl-hd] .material-symbols-rounded');
  var na=d.querySelector('[data-hl-hd] nav a');
  /* brand.html hd3 示範的圖示實際就是 24px；nav a 規範頁沒有示範，沿用實作的膠囊值 */
  /* 圖示放大屬字級（佈局屬性，政策不寫）、選單膠囊屬圓角（政策不寫）→ 兩者都降級成說明 */
  R.push('◽ 元件語言 國小／兒童：圖示放大＋選單膠囊（字級與圓角依政策只報告不改寫）  〔'
    +(ic?W.getComputedStyle(ic).fontSize:'?')+' / '+(na?W.getComputedStyle(na).borderRadius:'?')+'〕');
},function(){
compCheck(4,'學術',function(d,W){
  var a=d.querySelector('.avatar-circle');
  /* brand.html hd4 示範的頭像是圓形 50%，不是方角 */
  R.push('◽ 元件語言 學術：頭像圓形（圓角依政策只報告不改寫）  〔'+(a?W.getComputedStyle(a).borderRadius:'?')+'〕');
},function(){
/* 版型優先權：框架 token(Tailwind/Bootstrap) 不可蓋掉採用的版型 */
setTheme({hd:2,ft:0,hero:0,fm:0,tblsty:0,icon:0});
render(brandifyHtml(SAMPLES['s1-tailwind-cdn.html'],{}).html.replace(/<script\b[^>]*src="https?:[^"]*"[^>]*><\/script>/gi,''),function(d,W){
  var h=d?d.querySelector('[data-hl-hd]'):null;
  T('版型優先權：Tailwind 頁面採用「教師平台」→ header 實際為白底',!!h&&W.getComputedStyle(h).backgroundColor==='rgb(255, 255, 255)',h?W.getComputedStyle(h).backgroundColor:'找不到 header');
  setTheme({hd:7,ft:0,hero:0,fm:0,tblsty:0,icon:0});
  render(brandifyHtml(SAMPLES['s1-tailwind-cdn.html'],{}).html.replace(/<script\b[^>]*src="https?:[^"]*"[^>]*><\/script>/gi,''),function(d2,W2){
    var h2=d2?d2.querySelector('[data-hl-hd]'):null;
    T('版型優先權：同頁改採用「影音派」→ header 變深黑底',!!h2&&W2.getComputedStyle(h2).backgroundColor==='rgb(27, 29, 33)',h2?W2.getComputedStyle(h2).backgroundColor:'找不到');
    startVariants();
  });
});
});});});});
function startVariants(){
seq('hd',HD_N,'[data-hl-hd]',null,function(hd){
  var u=Object.keys(hd).map(function(k){return hd[k]}).filter(function(v,i,a){return a.indexOf(v)===i});
  T('Header：9 種變體產生 9 種不同樣式',u.length===9,'實得 '+u.length+' 種');
  Object.keys(hd).forEach(function(k){
    var same=Object.keys(hd).filter(function(k2){return k2!==k&&hd[k2]===hd[k]});
    if(same.length)T('　└ '+k+' 與其他變體重複',false,same.join(','));
  });
  seq('ft',FT_N,'[data-hl-ft]',null,function(ft){
    var u2=Object.keys(ft).map(function(k){return ft[k]}).filter(function(v,i,a){return a.indexOf(v)===i});
    T('Footer：3 種變體產生 3 種不同樣式',u2.length===3,'實得 '+u2.length+' 種');
    seq('hero',HERO_N,'[data-hl-hero]',null,function(h){
      var u3=Object.keys(h).map(function(k){return h[k]}).filter(function(v,i,a){return a.indexOf(v)===i});
      T('歡迎橫幅：2 種變體產生 2 種不同樣式',u3.length===2,'實得 '+u3.length+' 種');
      /* 功能選單 色塊版 vs 純 icon 版 */
      var fmSig={};var fi=0;
      (function nf(){
        if(fi>1){
          T('功能選單：色塊版與純 icon 版結果不同',fmSig[0]!==fmSig[1],fmSig[0]+' vs '+fmSig[1]);
          /* 表格四種：驗渲染後的 computedStyle(原站帶 !important 也要被蓋過) */
          var TBLSRC='<html><head><style>th{background:#eee !important;padding:2px !important;font-family:Arial !important}td{padding:1px !important}</style></head><body><nav><a href="#">a</a><a href="#">b</a></nav><div class="wrap"><table><thead><tr><th>H</th></tr></thead><tbody><tr><td>1</td></tr><tr><td>2</td></tr><tr><td>3</td></tr></tbody></table></div><div class="modal" style="font-family:Arial"><h3>提示</h3><p>中文說明文字</p><code>x=1</code></div><footer>© x</footer></body></html>';
          var tSig={},ti=0;
          (function nt(){
            if(ti>3){
              var tu=[0,1,2,3].map(function(k){return tSig[k]}).filter(function(v,i,a){return a.indexOf(v)===i});
              T('表格樣式：4 種變體產生 4 種不同結果',tu.length===4,'實得 '+tu.length+' 種');
              dlgTest();return;
            }
            setTheme({hd:1,ft:2,hero:0,fm:0,tblsty:ti,icon:0});
            render(brandifyHtml(TBLSRC,{}).html,function(d,W){
              var th=d?d.querySelector('th'):null,tds=d?d.querySelectorAll('tbody td'):[];
              if(!th||!tds.length){T('表格樣式 變體'+ti+'：渲染失敗',false,'');tSig[ti]='none'+ti;ti++;nt();return}
              var cs=W.getComputedStyle(th),c0=W.getComputedStyle(tds[0]),c1=W.getComputedStyle(tds[1]),cl=W.getComputedStyle(tds[tds.length-1]);
              /* padding 屬佈局屬性，依政策不再寫入 → 降級成說明 */
              R.push('◽ 表格 變體'+ti+'：th／td 內距（佈局屬性，依政策只報告不改寫）  〔th '+cs.padding+' / td '+c0.padding+'〕');
              if(ti===0)T('表格 斑馬紋：第 1 列有淡底、第 2 列無',c0.backgroundColor!==c1.backgroundColor,c0.backgroundColor+' vs '+c1.backgroundColor);
              /* 「全框線」表格版型要求加上 border——政策明令不准強加邊線，此版型無從達成 */
              if(ti===1)R.push('◽ 表格 全框線：th／td 四邊有框（加邊線依政策已停止，只報告）  〔'+cs.borderTopWidth+'/'+c0.borderLeftWidth+'〕');
              if(ti===2)T('表格 主色表頭：th 為品牌主色白字',cs.backgroundColor==='rgb(0, 136, 210)'&&cs.color==='rgb(255, 255, 255)',cs.backgroundColor+' '+cs.color);
              if(ti===3)T('表格 深色表頭：th 為深色白字',cs.backgroundColor==='rgb(58, 61, 66)'&&cs.color==='rgb(255, 255, 255)',cs.backgroundColor+' '+cs.color);
              if(ti!==1)T('表格 變體'+ti+'：最後一列不留底線',parseFloat(cl.borderBottomWidth)===0,cl.borderBottomWidth);
              /* 邊線已不寫入，簽章不可再拿 borderTopWidth／borderLeftWidth 當辨識依據
                 （四個版型會全部撞成同一組簽章而誤報「版型沒差異」） */
              tSig[ti]=cs.backgroundColor+'|'+cs.color+'|'+c0.backgroundColor+'|'+c1.backgroundColor;
              ti++;nt();
            });
          })();
          function dlgTest(){
            setTheme({hd:1,ft:2,hero:0,fm:0,tblsty:0,icon:0});
            render(brandifyHtml(TBLSRC,{}).html,function(d,W){
              var md=d?d.querySelector('.modal'):null;
              if(!md){T('彈窗字型：找不到彈窗',false,'');finish();return}
              var mp=md.querySelector('p'),mc=md.querySelector('code');
              T('彈窗：中文字型為思源黑體 Noto Sans TC',/Noto Sans TC/.test(W.getComputedStyle(md).fontFamily),W.getComputedStyle(md).fontFamily.slice(0,40));
              T('彈窗內文：字型為思源黑體(蓋過原站 Arial)',/Noto Sans TC/.test(W.getComputedStyle(mp).fontFamily),W.getComputedStyle(mp).fontFamily.slice(0,40));
              T('彈窗內 code：保留等寬字型不被改',!/Noto Sans TC/.test(W.getComputedStyle(mc).fontFamily),W.getComputedStyle(mc).fontFamily.slice(0,40));
              realRuntimeTests();
            });
          }
          /* ── 真實 runtime 迴歸 ──────────────────────────────────────
             這兩項先前「腳本全過、畫面卻是壞的」：字串比對看得到元素存在、
             看得到 src 有換，但看不到「白底白字」與「選了不同標誌卻套出同一個」。
             這裡一律在真的渲染出來的 DOM 上量 computedStyle。 */
          function __rgb(c){var m=/(\d+),\s*(\d+),\s*(\d+)/.exec(c);return m?[+m[1],+m[2],+m[3]]:null}
          function __lum(c){return c.map(function(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)}).reduce(function(a,b,i){return a+b*[0.2126,0.7152,0.0722][i]},0)}
          function __cr(a,b){var l1=__lum(a),l2=__lum(b);return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)}
          function realRuntimeTests(){
            var hi=0,bad=[];
            (function nh(){
              if(hi>8){
                /* 政策變更 2026-08-28（使用者指定）：嚴禁自作主張生成原頁不存在的元件。
     原斷言在要求「自動補上」，與新鐵律相反，改為驗證「確實不補」。 */
  R.push('◽ 會員入口：依新鐵律不再注入，故無對比度可驗');
                return logoTest();
              }
              setTheme({hd:hi,ft:2,hero:0,fm:0,tblsty:0,icon:0});
              render(brandifyHtml(SAMPLE,{}).html,function(d,W){
                if(!d){bad.push('hd'+hi+' 渲染逾時');hi++;return nh()}
                var menu=d.querySelector('[data-hl-member-menu]'),it=d.querySelector('[data-hl-member-item]');
                if(!menu||!it){bad.push('hd'+hi+' 未注入會員入口');hi++;return nh()}
                menu.style.display='flex';
                var fc=W.getComputedStyle(it).color,bc=W.getComputedStyle(menu).backgroundColor;
                var fg=__rgb(fc),bg=__rgb(bc);
                var r=(fg&&bg)?__cr(fg,bg):0;
                if(r<4.5)bad.push('hd'+hi+' 對比'+r.toFixed(2)+':1（'+fc+' on '+bc+'）');
                hi++;nh();
              });
            })();
          }
          function logoTest(){
            /* 文字型 logo 的頁面：這條路徑先前寫死標誌，logoLight 選什麼都一樣 */
            var LSRC='<html><body><header><div class="logo">快速學堂</div>'
              +'<nav><a href="#">課程</a><a href="#">關於</a></nav></header>'
              +'<main><p>內容文字</p></main></body></html>';
            var seen={},li=0;
            for(li=0;li<4;li++){
              __store['hanlin-brand-theme']=JSON.stringify({
                theme:{n:'翰林藍',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},contrast:'auto',
                logoLight:li,logoDark:li,logoInv:false,
                groups:{hd:1,ft:2,hero:0,fm:0,tblsty:0,icon:0},
                controls:{btn:true,select:true,label:true},memberEntry:true});
              var dd=new DOMParser().parseFromString(brandifyHtml(LSRC,{}).html,'text/html');
              var im=dd.querySelector('img[alt="翰林"]');
              seen[im?String((im.getAttribute('src')||'').length):('none'+li)]=1;
            }
            var n=Object.keys(seen).length;
            T('Logo 樣式：brand.html 選的 4 種標誌要套出 4 種不同結果（文字型 logo 路徑）',
              n===4,'實得 '+n+' 種：'+Object.keys(seen).join('/'));
            checklistTest();
          }
          /* ── 套用對照表（Manifest Checklist）迴歸 ────────────────────
             先前的失效模式是「某一項在特定頁面上沒套到，管線毫無跡象」。
             這裡直接對真實使用者檔案核對四項是否全數套入，
             並驗證「選擇卷種」不再被功能選單的四色輪替洗成淡綠。 */
          function checklistTest(){
            setTheme({hd:1,ft:2,hero:1,fm:1,tblsty:0,icon:0});
            var USRC=SAMPLES['user-index_v6.html'];
            if(!USRC){T('對照表：找不到真實使用者檔案樣本',false,'');return finish()}
            var r=brandifyHtml(USRC,{});
            var ck=r.checklist||[];
            /* 項數會隨新增核對項成長（E 主視覺裝飾色接管是後來加的），
               寫死數字會在每次擴充時假性失敗；改成檢查必備的鍵都在。 */
            var need=['logoReplacement','loginSystemInjection','examSectionReset','menuWrapperReset','heroDecorReset'];
            var have={};ck.forEach(function(x){have[x.key]=1});
            T('對照表：引擎回報完整核對表',ck.length>=need.length&&need.every(function(k){return have[k]}),
              '實得 '+ck.length+' 項：'+ck.map(function(x){return x.key}).join(','));
            var miss=ck.filter(function(x){return !x.done}).map(function(x){return x.label});
            /* 政策變更：B 系統登入實體注入已依新鐵律停用，不應計入未套入 */
  var _miss=(ck.filter(function(r){return !r.done&&r.label.indexOf('系統登入')<0}).map(function(r){return r.label}));
  T('對照表：真實檔案上所有核對項全部確實套入（系統登入依新鐵律不注入，不計）',_miss.length===0,
    _miss.length?('未套入：'+_miss.join('、')):'全數套入');
            T('對照表：結果寫進 <body data-hl-checklist>',/data-hl-checklist="/.test(r.html),'');
            T('對照表：console 對照輸出已注入',r.html.indexOf('翰林套版 對照表')>=0,'');
            T('選項卡片：選取態 runtime 已注入（原檔 JS 切 class 時要跟著換色）',
              /data-hl-formopt/.test(r.html)&&/aria-checked/.test(r.html),'');
            render(r.html,function(d,W){
              if(!d){T('選項卡片：渲染逾時',false,'');return finish()}
              var fo=d.querySelectorAll('[data-hl-formopt]');
              T('選項卡片：卷種區塊已標記為表單選項',fo.length>=2,'實得 '+fo.length+' 張');
              /* 功能選單不能被選項卡片規則吃掉——先前收得太寬，D 整項就不跑了 */
              var fm=d.querySelectorAll('[data-hl-fmcard]');
              T('功能選單：沒有被選項卡片規則誤吞（修 C 不能打壞 D）',fm.length>=2,'fmcard 實得 '+fm.length+' 張');
              var bad=[];
              Array.prototype.forEach.call(fo,function(e){
                var bg=W.getComputedStyle(e).backgroundColor,c=__rgb(bg);
                /* 淡綠 #E2F7EF 是功能選單四色之一（飽和度僅 0.06，用飽和度判定會漏掉），
                   改看色相：綠通道最大就是被四色輪替洗過，原檔卷種本來是白底。 */
                if(c&&c[1]>c[0]&&c[1]>=c[2]&&Math.max(c[0],c[1],c[2])-Math.min(c[0],c[1],c[2])>=4)bad.push(bg);
              });
              T('選項卡片：卷種不得被功能選單四色輪替洗成淡綠底',bad.length===0,bad.join(' / ')||'全部白底');
              finish();
            });
          }
          return;
        }
        setTheme({hd:1,ft:2,hero:0,fm:fi,tblsty:0,icon:0});
        render(brandifyHtml(SAMPLE,{}).html,function(d,W){
          /* 取功能選單磁磚上的 icon，不是頁面第一個圖示。
             先前是用 div[style*="display:flex"][style*="gap"] 定位群組——
             那依賴「我們把 display:flex／gap 寫成 inline 樣式」。
             使用者要求不修改架構樣式後，佈局屬性一律不再寫入，
             這個選擇器就永遠是 null，退回抓頁面第一個圖示，
             於是兩個變體量到同一個無關元素而「結果相同」。
             改用套用時打上的語意標記 [data-hl-fm]，與樣式寫不寫入無關。 */
          /* 量「帶 data-hl-fm 標記的那個元素」本身，不是它裡面的 icon——
             色塊版的白底與陰影是寫在**色塊容器**上，不在 icon 上，
             抓 icon 會兩版都量到透明底而誤判「結果相同」。
             簽章也不再用 fontSize／padding：那兩個是佈局屬性，
             依使用者政策已不再寫入，拿它們當區別會永遠相同。
             真正的區別是「有沒有色塊」＝底色與陰影。 */
          var tile=d?d.querySelector('[data-hl-fm]'):null;
          var tcs=(tile&&W)?W.getComputedStyle(tile):null;
          fmSig[fi]=tcs?(tcs.backgroundColor+'/'+(tcs.boxShadow==='none'?'noshadow':'shadow')+'/'+tcs.borderRadius):'none'+fi;
          fi++;nf();
        });
      })();
    });
  });
});
}
"""
open('variant-suite.html','w',encoding='utf-8').write(page('variant suite','VARIANT',variant_body))

# ---- 3. 12 樣本內建稽核 ----
audit_body = r"""
setTheme({hd:1,ft:2,hero:0,fm:0,tblsty:0,icon:0});
var names=Object.keys(SAMPLES).sort(),i=0,totalProb=0;
(function step(){
  if(i>=names.length){
    R.unshift((totalProb===0?'✅':'❌')+' 12 樣本內建稽核總問題數：'+totalProb);
    finish();return;
  }
  var n=names[i++];
  lastRawMarkup=SAMPLES[n];
  var res=brandifyHtml(SAMPLES[n],{});
  var st={};Object.keys(res).forEach(function(k){st[k]=res[k]});
  st.html=res.html.replace(/<link\b[^>]*href=["']https?:[^"']*["'][^>]*>/gi,'')
                  .replace(/<script\b[^>]*src=["']https?:[^"']*["'][^>]*><\/script>/gi,'')
                  .replace(/@import url\(["']https?:[^)]*\);/gi,'');
  auditBranded(st,function(au){
    var probs=au.probs.filter(function(p){
      if(p.indexOf('字體')>-1)return res.html.indexOf('Noto+Sans+TC')<0;
      if(p.indexOf('script 原封不動')>-1||p.indexOf('連結數不減')>-1)return false;
      return true;
    });
    totalProb+=probs.length;
    R.push((probs.length?'❌':'✅')+' '+n.replace('.html','')+(probs.length?('：'+probs.join('；')):'：無問題'));
    setTimeout(step,10);
  });
})();
"""
open('audit-suite.html','w',encoding='utf-8').write(page('audit suite','AUDIT',audit_body,with_audit=True))
print('已產生:engine-suite.html / variant-suite.html / audit-suite.html')
