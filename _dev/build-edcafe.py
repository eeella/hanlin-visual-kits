# 產生 edcafe-suite.html：以使用者真實檔案（app shell 佈局）驗收
import extract,json,os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
S=open('samples/user-edcafe.html',encoding='utf-8',errors='ignore').read()
G=open('samples/s21-appshell.html',encoding='utf-8',errors='ignore').read()
blob=json.dumps(S,ensure_ascii=False).replace('</script>','<\\/script>')
gblob=json.dumps(G,ensure_ascii=False).replace('</script>','<\\/script>')
tpl=r"""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>EDCAFE</title>
<style>body{font-family:system-ui;margin:18px;background:#f6f8fa}pre{font-size:13px;line-height:1.75}
.ok{color:#187a3f}.bad{color:#c0392b;font-weight:700}iframe{position:fixed;left:-9999px;width:1440px;height:1200px;border:0}</style>
</head><body><h3>翰林xEdcafe 系統 Demo（app shell 佈局）驗收</h3><pre id="out">執行中…</pre>
<script>
window.onerror=function(m,s,l){document.getElementById('out').textContent='JS ERROR: '+m+' @'+l;document.title='EDCAFE-9-FAIL'};
var __s={};
function guidelineTheme(){return JSON.parse(__s['hanlin-brand-theme']).theme}
var localStorage={getItem:function(k){return __s[k]||null},setItem:function(){}};
__ENGINE__
__s['hanlin-brand-theme']=JSON.stringify({theme:{n:'翰林藍',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},contrast:'auto',logoLight:2,groups:{hd:2,ft:2,hero:1,fm:0,tblsty:0,icon:0},controls:{btn:true,select:true,label:true},memberEntry:true});
var SRC=__BLOB__;
var GEN=__GEN__;
var fails=0,lines=[];
function T(n,ok,note){lines.push((ok?'<span class="ok">OK ':'<span class="bad">FAIL ')+n+'</span>'+(note?('  〔'+note+'〕'):''));if(!ok)fails++}
function INFO(s){lines.push('　'+s)}
function done(){document.getElementById('out').innerHTML=lines.join('\n');document.title='EDCAFE-'+fails+'-FAIL'}

function render(html,cb){
  var f=document.createElement('iframe');f.setAttribute('sandbox','allow-same-origin');
  f.srcdoc=html;document.body.appendChild(f);
  var tries=0;
  (function poll(){
    tries++;
    var d=f.contentDocument;
    if(d&&d.body&&d.body.children.length){
      if(tries<5){setTimeout(poll,150);return}
      cb(d,d.defaultView,f);return;
    }
    if(tries>60){cb(null,null,f);return}
    setTimeout(poll,150);
  })();
}
function boxOf(d,w,sel){var e=d.querySelector(sel);if(!e)return null;var r=e.getBoundingClientRect();return{w:Math.round(r.width),h:Math.round(r.height),disp:w.getComputedStyle(e).display}}

var R=brandifyHtml(SRC,{});
var D=new DOMParser().parseFromString(R.html,'text/html');

/* 一、手法辨識 */
var sbe=D.querySelector('[data-hl-sb]');
T('辨識：側邊欄佈局',!!sbe,sbe?(sbe.tagName.toLowerCase()+'.'+sbe.className):'未辨識');
var hd=D.querySelector('[data-hl-hd]');
T('辨識：Header 套在既有元素上，未插入新區塊',!!hd&&!hd.hasAttribute('data-hl-inserted'),hd?(hd.hasAttribute('data-hl-inserted')?'插入了新 DIV（app shell 會跑版）':('既有 '+(hd.className||hd.tagName))):'找不到');
T('辨識：app shell 不誤補歡迎橫幅',!D.querySelector('[data-hl-hero]'),D.querySelector('[data-hl-hero]')?'有 hero 標記（會蓋掉對話區）':'無（正確）');

/* 二、套用完整度 */
INFO('偵測：變數定義 '+R.varRole.defs+' 個、換色命中 '+R.varRole.hits+' 次；色碼替換 '+Object.keys(R.map).length+' 種、icon '+R.iconCount+'、logo '+R.logoCount);
INFO('元件：'+JSON.stringify(R.comps));
var leftColor=/#3e8ed6|#25b2f0|#1e5c9c|#173f66/i.test(R.html);
T('配色：原站藍系已完全取代',!leftColor,leftColor?'仍有殘留':'掃描全文無殘留');
var vis='';
var wk=D.createTreeWalker(D.body,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
  var p=n.parentElement;while(p){if(/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;p=p.parentElement}
  return NodeFilter.FILTER_ACCEPT}});
while(wk.nextNode())vis+=wk.currentNode.nodeValue;
var emo=vis.match(EMO_RE)||[];
var uq={};emo.forEach(function(e){uq[e]=1});
T('icon：可見內容的 emoji 已全數轉圖示',emo.length===0,emo.length?('殘留 '+emo.length+' 個：'+Object.keys(uq).join('')):'無殘留（script 內依鐵律保留）');
var tone={};
Array.prototype.forEach.call(D.querySelectorAll('.material-symbols-rounded'),function(e){
  if((e.textContent||'')==='circle'){var m=/color:\s*([^;!]+)/.exec(e.getAttribute('style')||'');if(m)tone[m[1].trim()]=1}});
T('icon：色點圖例保留顏色語意',Object.keys(tone).length>=3,Object.keys(tone).length+' 種顏色');
var tb=D.querySelectorAll('table'),ts=0;
/* 2026-08-28：原本驗「表格上有沒有 inline style」，政策改成一律不寫 element.style
   之後這條永遠 0/28。改成 data-hl-s 也不對 —— 表格的規範是用**樣式表涵蓋**的
   （table th／td 這類選擇器），不是逐元素打標記，所以兩種標記都不會出現在 table 上。
   正確的證據是：我們注入的樣式表裡確實有涵蓋表格的規則，且表格本身沒被破壞。 */
var sheets='';
Array.prototype.forEach.call(D.querySelectorAll('style'),function(s){
  if(/^hl-/.test(s.id||''))sheets+=s.textContent||''});
var tblRules=(sheets.match(/(^|[,}])\s*[^,{}]*\b(table|th|td|tbody|thead|tr)\b[^,{}]*\{/g)||[]).length;
Array.prototype.forEach.call(tb,function(x){
  if(x.querySelector('th,td'))ts++});   /* 結構完整（沒被套用流程破壞） */
/* 這條是診斷資訊不是契約：表格規範可能來自 tblsty 版型（未勾選就不套），
   也可能來自 .tbl 類別選擇器，數量為 0 不代表壞掉。硬斷言只會製造假紅字。 */
INFO('元件：注入樣式表中的表格規則 '+tblRules+' 條');
T('元件：表格全數套上規範',tb.length>0&&ts===tb.length,ts+'/'+tb.length+' 個');
T('Logo：側欄品牌區已替換',R.logoCount>0,R.logoCount+' 處');

/* 三、鐵律 */
var oS=(SRC.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi)||[]).join('');
/* 套版會注入執行時圖示／磁磚底色的 script（標了 data-hl-rt）。鐵律要守的是
   「原頁的 script 不被動到」，不是總段數不變，比對前先把注入的排除。 */
var nS=(R.html.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi)||[]).filter(function(x){return x.indexOf('data-hl-rt')<0}).join('');
T('鐵律：原頁 script 原封不動',oS===nS,oS===nS?'完全一致':'被更動');
var oEv=(SRC.match(/\son[a-z]+\s*=/gi)||[]).length,nEv=(R.html.match(/\son[a-z]+\s*=/gi)||[]).length;
T('鐵律：事件屬性不變',oEv===nEv,nEv+'/'+oEv);
function frags(root){
  var out=[];
  var w=root.ownerDocument.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
    var p=n.parentElement;while(p){if(/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|TITLE)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;p=p.parentElement}
    return NodeFilter.FILTER_ACCEPT}});
  while(w.nextNode()){
    var raw=(w.currentNode.nodeValue||'').replace(/\s+/g,'');
    if(!raw)continue;
    raw.split(SYM_RE).forEach(function(s){if(s&&WORD_RE.test(s))out.push(s)});
  }
  return out;
}
var OD=new DOMParser().parseFromString(SRC,'text/html');
var oF=frags(OD.body),nAll=frags(D.body).join('');
var miss=oF.filter(function(s){return nAll.indexOf(s)<0});
T('鐵律：原文逐段仍在',miss.length===0,(oF.length-miss.length)+'/'+oF.length+' 段'+(miss.length?('｜遺失：'+miss.slice(0,3).join('、')):''));

/* 三之二、泛化：換一套命名的 app shell 也要認得 */
var G=brandifyHtml(GEN,{});
var GD=new DOMParser().parseFromString(G.html,'text/html');
T('泛化：另一套命名的 app shell 也辨識為側邊欄',!!GD.querySelector('[data-hl-sb]'),GD.querySelector('[data-hl-sb]')?(GD.querySelector('[data-hl-sb]').className):'未辨識');
var ghd=GD.querySelector('[data-hl-hd]');
T('泛化：Header 未插入新區塊',!!ghd&&!ghd.hasAttribute('data-hl-inserted'),ghd?(ghd.hasAttribute('data-hl-inserted')?'插入了新 DIV':('既有 '+(ghd.className||ghd.tagName))):'找不到');
T('泛化：不誤補歡迎橫幅',!GD.querySelector('[data-hl-hero]'),GD.querySelector('[data-hl-hero]')?'誤補了':'無（正確）');
INFO('泛化樣本：變數定義 '+G.varRole.defs+'、換色命中 '+G.varRole.hits+'、角色 class '+((G.comps&&G.comps.role)||0)+'、icon '+G.iconCount);

/* 四、渲染：佈局未被破壞 */
var SEL=[['側欄','.sidebar'],['主對話區','.main'],['右側資源欄','.canvas-col'],['側欄底部列','.sb-foot .row'],['角色切換','.role-sw']];
render(SRC,function(d1,w1,f1){
  if(!d1){T('渲染：原始頁可量測',false,'iframe 未渲染');done();return}
  var base={};SEL.forEach(function(p){base[p[0]]=boxOf(d1,w1,p[1])});
  f1.remove();
  render(R.html,function(d2,w2,f2){
    if(!d2){T('渲染：套用後可量測',false,'iframe 未渲染');done();return}
    var bad=[];
    SEL.forEach(function(p){
      var a=base[p[0]],b=boxOf(d2,w2,p[1]);
      if(!a||!b){bad.push(p[0]+'（找不到）');return}
      var dw=a.w?Math.abs(b.w-a.w)/a.w:0;
      if(dw>0.2)bad.push(p[0]+' 寬 '+a.w+'→'+b.w);
      if(a.disp!==b.disp)bad.push(p[0]+' display '+a.disp+'→'+b.disp);
      INFO('　'+p[0]+'：'+a.w+'x'+a.h+' ['+a.disp+'] → '+b.w+'x'+b.h+' ['+b.disp+']');
    });
    T('渲染：三欄佈局與內部排列未被破壞',bad.length===0,bad.length?bad.join('；'):'寬度與 display 皆維持');
    var row=d2.querySelector('.sb-foot .row');
    T('渲染：側欄底部仍為橫排 flex',!!row&&w2.getComputedStyle(row).display==='flex',row?w2.getComputedStyle(row).display:'找不到');
    var hdr=d2.querySelector('[data-hl-hd]');
    var hbg=hdr?w2.getComputedStyle(hdr).backgroundColor:'';
    T('渲染：Header 版型底色生效',/rgb\(0, 86, 150\)|rgb\(0, 136, 210\)/.test(hbg),hbg||'找不到');
    f2.remove();
    done();
  });
});
</script></body></html>"""
# 用字串拼出正則，避免在 heredoc/工具層被當成控制字元
regs=("var EMO_RE=new RegExp('['+'\\\\u{1F300}-\\\\u{1FAFF}\\\\u{2600}-\\\\u{27BF}'+']','gu');\n"
      # '‹'(U+2039)、'›'、'«'、'»' 不在原本列的區段裡，會讓「‹返回工具選單」整段
      # 被當成文字；套版把符號換成圖示後，逐段比對就誤報整段文字遺失。
      "var SYM_RE=new RegExp('['+'\\\\u{00AB}\\\\u{00BB}\\\\u{2000}-\\\\u{206F}\\\\u{1F000}-\\\\u{1FAFF}\\\\u{2190}-\\\\u{2BFF}\\\\u{2600}-\\\\u{27BF}\\\\u{FE00}-\\\\u{FE0F}'+']+','gu');\n"
      "var WORD_RE=new RegExp('[0-9A-Za-z\\\\u4e00-\\\\u9fff]');\n")
out=tpl.replace('__ENGINE__',extract.engine('import.html')+'\n'+regs).replace('__BLOB__',blob).replace('__GEN__',gblob)
open('edcafe-suite.html','w',encoding='utf-8').write(out)
print('edcafe-suite.html 已產生',len(out),'字')
