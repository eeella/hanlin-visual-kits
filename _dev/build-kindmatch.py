# -*- coding: utf-8 -*-
"""登入系統／橫向選項卡 元件判定比對監測
   產出 kindmatch-suite.html：把樣本實際跑過 brandifyHtml、渲染量 computedStyle，
   逐元素記帳（期望 vs 實際判定 vs 實際樣式），不抽樣、不看規則字串下結論。"""
import extract, json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# ── 樣本：每個受測元素以 data-expect 人工標註期望判定（規格宣告，非引擎輸出）──
SAMPLES = {}

SAMPLES['login-A 經典置中登入卡'] = """<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>登入</title>
<style>body{margin:0;font-family:system-ui;background:#eef1f6}
.login-wrap{display:flex;justify-content:center;padding:60px}
.login-box{width:360px;background:#fff;border:1px solid #e3e6ec;border-radius:10px;padding:28px}
.login-title{font-size:20px;font-weight:700;margin:0 0 18px}
.form-group{margin-bottom:14px}
.form-label{display:block;font-size:13px;color:#555;margin-bottom:6px}
.form-control{width:100%;box-sizing:border-box;padding:9px 11px;border:1px solid #ccd2dc;border-radius:6px}
.login-btn{width:100%;padding:10px;background:#3b5bdb;color:#fff;border:0;border-radius:6px;font-size:15px}
.login-links{display:flex;justify-content:space-between;margin-top:12px;font-size:13px}
.login-links a{color:#3b5bdb}
.remember{display:flex;align-items:center;gap:6px;font-size:13px;margin:10px 0}
</style></head><body>
<div class="login-wrap"><div class="login-box" data-expect="card">
<h1 class="login-title">系統登入</h1>
<form>
<div class="form-group"><label class="form-label" for="acc">帳號</label>
<input class="form-control" id="acc" type="text" placeholder="請輸入帳號" data-expect="input"></div>
<div class="form-group"><label class="form-label" for="pw">密碼</label>
<input class="form-control" id="pw" type="password" placeholder="請輸入密碼" data-expect="input"></div>
<label class="remember"><input type="checkbox" id="rm" data-expect="check"><span>記住我</span></label>
<button class="login-btn" type="submit" data-expect="button">登入</button>
</form>
<div class="login-links"><a href="#">忘記密碼？</a><a href="#">註冊新帳號</a></div>
</div></div></body></html>"""

SAMPLES['login-B 無 class 舊式表單'] = """<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>系統登入</title>
</head><body bgcolor="#ffffff">
<table width="420" align="center" cellpadding="8"><tr><td colspan="2"><font size="4">校務系統登入</font></td></tr>
<tr><td>帳號</td><td><input type="text" name="u" size="24" data-expect="input"></td></tr>
<tr><td>密碼</td><td><input type="password" name="p" size="24" data-expect="input"></td></tr>
<tr><td>身分</td><td><select name="role" data-expect="input"><option>學生</option><option>教師</option></select></td></tr>
<tr><td></td><td><input type="submit" value="登入" data-expect="button">
<input type="reset" value="清除" data-expect="button"></td></tr>
</table></body></html>"""

SAMPLES['login-C Bootstrap 登入'] = """<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>Login</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head><body class="bg-light"><div class="container py-5"><div class="row justify-content-center"><div class="col-md-4">
<div class="card shadow-sm" data-expect="card"><div class="card-body">
<h5 class="card-title mb-3">會員登入</h5>
<div class="mb-3"><label class="form-label">Email</label>
<input type="email" class="form-control" data-expect="input"></div>
<div class="mb-3"><label class="form-label">密碼</label>
<input type="password" class="form-control" data-expect="input"></div>
<div class="form-check mb-3"><input class="form-check-input" type="checkbox" id="k" data-expect="check">
<label class="form-check-label" for="k">保持登入</label></div>
<button class="btn btn-primary w-100" data-expect="button">登入</button>
<div class="text-center mt-3"><a href="#" class="small">忘記密碼</a></div>
</div></div></div></div></div></body></html>"""

SAMPLES['tabs-A div+button 橫向選項卡'] = """<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>選項卡</title>
<style>body{margin:0;font-family:system-ui}
.tabs{display:flex;gap:4px;border-bottom:2px solid #e5e7eb;padding:0 20px}
.tab{padding:10px 18px;border:0;background:none;font-size:15px;color:#666;cursor:pointer}
.tab.active{color:#2563eb;border-bottom:2px solid #2563eb;margin-bottom:-2px}
.panel{padding:24px}</style></head><body>
<div class="tabs" data-expect="tablist">
<button class="tab active" data-expect="tab">課程總覽</button>
<button class="tab" data-expect="tab">教材下載</button>
<button class="tab" data-expect="tab">測驗紀錄</button>
</div><div class="panel">內容區</div></body></html>"""

SAMPLES['tabs-B ul.nav-tabs（Bootstrap）'] = """<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>Tabs</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head><body><div class="container py-4">
<ul class="nav nav-tabs" data-expect="tablist">
<li class="nav-item"><a class="nav-link active" href="#" data-expect="tab">總覽</a></li>
<li class="nav-item"><a class="nav-link" href="#" data-expect="tab">成績</a></li>
<li class="nav-item"><a class="nav-link" href="#" data-expect="tab">設定</a></li>
</ul><div class="p-3">內容</div></div></body></html>"""

SAMPLES['tabs-C role=tablist（ARIA）'] = """<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>ARIA Tabs</title>
<style>body{margin:0;font-family:system-ui;padding:20px}
[role=tablist]{display:flex;gap:8px}
[role=tab]{padding:9px 16px;border:1px solid #dde1e8;background:#f6f7f9;border-radius:8px 8px 0 0}
[role=tab][aria-selected=true]{background:#fff;color:#1d4ed8;border-bottom-color:#fff}</style>
</head><body>
<div role="tablist" data-expect="tablist">
<button role="tab" aria-selected="true" aria-controls="p1" data-expect="tab">第一冊</button>
<button role="tab" aria-selected="false" aria-controls="p2" data-expect="tab">第二冊</button>
<button role="tab" aria-selected="false" aria-controls="p3" data-expect="tab">第三冊</button>
</div><div id="p1">內容</div></body></html>"""

SAMPLES['tabs-D nav.tabs（包在 nav 裡）'] = """<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>Nav Tabs</title>
<style>body{margin:0;font-family:system-ui}
nav.tabs{display:flex;gap:2px;padding:0 16px;background:#fff;border-bottom:1px solid #e5e7eb}
nav.tabs a{padding:12px 16px;color:#555;text-decoration:none}
nav.tabs a.current{color:#0d6efd;box-shadow:inset 0 -3px 0 #0d6efd}</style></head><body>
<main><nav class="tabs" data-expect="tablist">
<a href="#" class="current" data-expect="tab">全部</a>
<a href="#" data-expect="tab">國小</a>
<a href="#" data-expect="tab">國中</a>
</nav><section style="padding:20px">列表</section></main></body></html>"""

SAMPLES['tabs-E 分段控制 segmented'] = """<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><title>Segmented</title>
<style>body{margin:0;font-family:system-ui;padding:24px}
.segmented{display:inline-flex;background:#eef0f4;border-radius:10px;padding:3px}
.seg-item{padding:7px 18px;border-radius:8px;font-size:14px;color:#555;cursor:pointer}
.seg-item.on{background:#fff;color:#111;box-shadow:0 1px 3px rgba(0,0,0,.12)}</style></head><body>
<div class="segmented" data-expect="tablist">
<span class="seg-item on" data-expect="tab">日</span>
<span class="seg-item" data-expect="tab">週</span>
<span class="seg-item" data-expect="tab">月</span>
</div></body></html>"""

ENG = extract.engine('import.html')
SJ = json.dumps(SAMPLES, ensure_ascii=False).replace('</script>', '<\\/script>')

PAGE = r"""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>KM-RUN</title></head>
<body><pre id="out" style="font:12px/1.6 ui-monospace,monospace">running</pre>
<iframe id="fr" style="width:1280px;height:900px;border:1px solid #ccc"></iframe>
<script>var SAMPLES=@@S@@;</script>
<script>@@ENG@@</script>
<script>
window.onerror=function(m,u,l){document.getElementById('out').textContent='ERR '+m+' @'+l;document.title='KM-ERR'};
var R=[],LEDGER=[],miss=0,tot=0;
localStorage.setItem('hanlin-brand-theme',JSON.stringify({
  theme:{n:'翰林藍',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},contrast:'auto',
  logoLight:0,logoDark:0,logoInv:false,
  groups:{hd:1,ft:2,hero:1,fm:1,opt:1,tblsty:0,icon:0},
  controls:{btn:true,seg:true,select:true,label:true,principles:true,midcolor:true,
            gray:true,softtile:true,rwd:true,type:true,shape:true},
  memberEntry:true}));
function kmRgb(c){var m=/(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/.exec(c||'');return m?[+m[1],+m[2],+m[3]]:null}
function kmLum(c){if(!c)return null;return c.map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}).reduce(function(a,b,i){return a+b*[.2126,.7152,.0722][i]},0)}
function kmCr(a,b){var l1=kmLum(a),l2=kmLum(b);if(l1===null||l2===null)return null;return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)}
var BRAND={'#0088D2':'主色','#005696':'輔色','#40B4E5':'亮色','#FF9A3C':'對比色'};
function kmAlpha(c){var m=/rgba\(([^)]*)\)/.exec(c||'');if(!m)return 1;var a=m[1].split(',')[3];return a===undefined?1:parseFloat(a)}
function kmHex(c){var p=kmRgb(c);if(!p)return '—';if(kmAlpha(c)<0.04)return '透明';
  return '#'+p.slice(0,3).map(function(v){return ('0'+Math.round(v).toString(16)).slice(-2)}).join('').toUpperCase()}
/* 實際可見底色：往上走到第一個不透明底（漸層取最暗停駐色），才算得出真對比 */
function kmStops(t){var out=[],m,re=/rgba?\(([^)]+)\)/g;while((m=re.exec(t))){var n=m[1].split(',');
  if(n.length>3&&parseFloat(n[3])<0.35)continue;out.push([+n[0],+n[1],+n[2]])}return out}
function kmEffBg(el,W,d){var e=el;while(e&&e!==d.documentElement){var c=W.getComputedStyle(e);
  if(c.backgroundImage&&c.backgroundImage!=='none'){var st=kmStops(c.backgroundImage);
    if(st.length){var wi=st[0],wl=kmLum(st[0]);for(var q=1;q<st.length;q++){var L=kmLum(st[q]);if(L<wl){wl=L;wi=st[q]}}return wi}}
  if(kmAlpha(c.backgroundColor)>=0.95){var p=kmRgb(c.backgroundColor);if(p)return p}
  e=e.parentElement}return [255,255,255]}
function kmHasText(el){for(var i=0;i<el.childNodes.length;i++){var n=el.childNodes[i];
  if(n.nodeType===3&&n.nodeValue.trim())return true}return false}
/* 祖先版型標記：選項卡若被當成頁首／版尾／主視覺，會整條吃到那一層的配色 */
function kmZone(el){var z=[],n=el;
  while(n&&n.nodeType===1){['data-hl-hd','data-hl-ft','data-hl-hero','data-hl-fm','data-hl-fmcard'].forEach(function(a){
    if(n.hasAttribute&&n.hasAttribute(a)&&z.indexOf(a)<0)z.push(a.replace('data-hl-',''))});n=n.parentElement}
  return z.join(',')}
function kmBrand(c){var p=kmRgb(c);if(!p)return '';var best='',bd=1e9;
  for(var k in BRAND){var q=[parseInt(k.slice(1,3),16),parseInt(k.slice(3,5),16),parseInt(k.slice(5,7),16)];
    var d=Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])+Math.abs(p[2]-q[2]);if(d<bd){bd=d;best=BRAND[k]}}
  return bd<=40?best:''}
function kmPath(el){var s=el.tagName.toLowerCase();var c=(el.getAttribute('class')||'').trim();
  if(c)s+='.'+c.split(/\s+/).slice(0,3).join('.');return s}
var names=Object.keys(SAMPLES),si=0,fr=document.getElementById('fr');
function finish(){
  var head=['══ 元件判定比對監測（登入系統／橫向選項卡）══',
    '樣本 '+names.length+' 份　受測標註元素 '+tot+' 個　判定未命中 '+miss+' 個',''];
  document.getElementById('out').textContent=head.concat(R).join('\n');
  window.__LEDGER=JSON.stringify(LEDGER);
  document.title='KM-DONE-'+miss+'-MISS';
}
function step(){
  if(si>=names.length){finish();return}
  var nm=names[si],src=SAMPLES[nm],res;
  try{res=brandifyHtml(src,{})}catch(e){R.push('❌ '+nm+' 套用丟例外：'+e.message+'\n     '+String(e.stack||'').split('\n').slice(1,4).join('\n     '));si++;return step()}
  fr.onload=function(){
    setTimeout(function(){
      var d=fr.contentDocument,W=fr.contentWindow;
      R.push('── '+nm+' ──');
      var dbg=res.optDbg||{};
      R.push('  optDbg: scan='+dbg.scan+' sized='+dbg.sized+' skipHdFt='+dbg.skipHdFt+
             ' skipFm='+dbg.skipFm+' 單一狀態='+dbg.st1+' 兄弟同型='+dbg.shape+
             ' 候選='+dbg.cand+' 卡片='+dbg.cards+' 標記='+dbg.marked+(dbg.err?(' err='+dbg.err):''));
      if(res.swallowed&&res.swallowed.length)R.push('  吞例外 '+res.swallowed.length+' 件：'+res.swallowed.slice(0,3).join(' ｜ '));
      var els=d.querySelectorAll('[data-expect]');
      R.push('  受測元素 '+els.length+' 個');
      Array.prototype.forEach.call(els,function(el){
        tot++;
        var exp=el.getAttribute('data-expect');
        var k=el.getAttribute('data-hl-k')||'';
        var opt=el.getAttribute('data-hl-opt')||el.getAttribute('data-hl-optcard')||'';
        var s=el.getAttribute('data-hl-s')||'';
        var rule=el.getAttribute('data-hl-rule')||'';
        var cs=W.getComputedStyle(el);
        var bg=cs.backgroundColor,fg=cs.color,bd=cs.borderBottomColor+'/'+cs.borderTopWidth;
        if(kmAlpha(bg)<0.04)bg='rgba(0,0,0,0)';
        var nb=kmBrand(kmAlpha(cs.backgroundColor)>=.5?cs.backgroundColor:'')||kmBrand(fg)||kmBrand(kmAlpha(cs.borderBottomColor)>=.5?cs.borderBottomColor:'');
        var zone=kmZone(el);
        var CRv=null;
        if(kmHasText(el)){var fgp=kmRgb(cs.color);var bgp=kmEffBg(el,W,d);
          if(fgp&&bgp){var L1=kmLum(fgp),L2=kmLum(bgp);CRv=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05)}}
        /* 判定命中：tab/tablist 對應 data-hl-opt 系列；其餘對應 data-hl-k */
        var hit;
        if(exp==='tab')hit=!!(opt||k);
        else if(exp==='tablist')hit=true;           /* 容器本來就不該被判定，記錄用 */
        else hit=(k===exp);
        var touched=!!(s||rule||opt);
        if(exp!=='tablist'&&!hit)miss++;
        var row={sample:nm,el:kmPath(el),expect:exp,kind:k,opt:opt,styled:!!s,rule:rule,
                 bg:kmHex(cs.backgroundColor),fg:kmHex(cs.color),brand:nb,zone:zone,cr:CRv?+CRv.toFixed(2):null,hit:hit,touched:touched};
        if(CRv!==null&&CRv<3)R.push('   ⚠ 隱形字風險 '+kmPath(el)+' 對比 '+CRv.toFixed(2)+':1（字'+kmHex(cs.color)+' 於底'+kmHex('rgb('+kmEffBg(el,W,d).join(',')+')')+'）');
        LEDGER.push(row);
        R.push('   '+((exp==='tablist')?'·':(hit?'✅':'❌'))+' '+kmPath(el).padEnd(28)+
               ' 期望='+exp.padEnd(8)+' 判定='+(k||'—').padEnd(9)+
               ' opt='+(opt||'—').padEnd(5)+
               ' 寫樣式='+(s?'有':'無')+' 底='+kmHex(cs.backgroundColor).padEnd(8)+' 字='+kmHex(cs.color).padEnd(8)+
               (zone?(' 位於['+zone+']'):'')+
               (nb?(' ←品牌'+nb):'')+(rule?(' 規則='+rule.slice(0,26)):''));
      });
      /* 品牌色落點：整份樣本有沒有任何一處吃到品牌色 */
      var land=0;
      Array.prototype.forEach.call(d.querySelectorAll('body *'),function(e2){
        var c2=W.getComputedStyle(e2);
        if((kmAlpha(c2.backgroundColor)>=.5&&kmBrand(c2.backgroundColor))||kmBrand(c2.color)||
           (kmAlpha(c2.borderBottomColor)>=.5&&kmBrand(c2.borderBottomColor)))land++;
      });
      R.push('  品牌色落點元素數='+land+'　（0 表示這份樣本完全沒被套到品牌色）');
      R.push('');
      si++;step();
    },260);
  };
  fr.srcdoc=res.html;
}
step();
</script></body></html>"""
open('kindmatch-suite.html','w',encoding='utf-8').write(
    PAGE.replace('@@S@@',SJ).replace('@@ENG@@',ENG))
print('已產生 kindmatch-suite.html  樣本數',len(SAMPLES))
