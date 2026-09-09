# -*- coding: utf-8 -*-
"""引擎監測比對：同一批樣本、同一支 KM.measure，分別跑
   ① import.html 抽出的引擎（使用者按「套用」實際走的那一份）
   ② preview.html 內嵌的引擎（預覽畫面實際走的那一份）
   兩邊數字並列，差異就是「預覽看到的」與「匯出拿到的」之間的落差。"""
import extract, json, glob, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))

SAMPLES={}
for p in sorted(glob.glob('samples/*.html')):
    SAMPLES[os.path.basename(p)]=open(p,encoding='utf-8').read()
# 針對使用者點名的兩類元件另加合成樣本（真實樣本裡不一定同時具備）
SAMPLES['_combo 登入＋四種選項卡.html']=open('samples/_km-combo.html',encoding='utf-8').read()

ENG_IMPORT=extract.engine('import.html')
ENG_PREVIEW=extract.engine('preview.html')

SJ=json.dumps(SAMPLES,ensure_ascii=False).replace('</script>','<\\/script>')
TPL=r"""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>CMP-RUN</title></head>
<body><pre id="out" style="font:12px/1.6 ui-monospace,monospace">running</pre>
<iframe id="fr" style="width:1280px;height:900px;border:1px solid #ccc"></iframe>
<script src="km-monitor.js"></script>
<script>var SAMPLES=@@S@@;var WHICH='@@W@@';</script>
<script>@@ENG@@</script>
<script>
window.onerror=function(m,u,l){document.getElementById('out').textContent='ERR '+m+' @'+l;document.title='CMP-ERR'};
localStorage.setItem('hanlin-brand-theme',JSON.stringify({
  theme:{n:'翰林藍',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},contrast:'auto',
  logoLight:0,logoDark:0,logoInv:false,
  groups:{hd:1,ft:2,hero:1,fm:1,opt:1,tblsty:0,icon:0},
  controls:{btn:true,seg:true,select:true,label:true,principles:true,midcolor:true,
            gray:true,softtile:true,rwd:true,type:true,shape:true},
  memberEntry:true}));
var names=Object.keys(SAMPLES),i=0,OUT={},R=[],fr=document.getElementById('fr');
function step(){
  if(i>=names.length){
    document.getElementById('out').textContent=R.join('\n');
    window.__CMP=JSON.stringify(OUT);document.title='CMP-DONE';return;
  }
  var nm=names[i],res=null,err='';
  try{res=brandifyHtml(SAMPLES[nm],{})}catch(e){err=(e&&e.message)||String(e)}
  if(err){OUT[nm]={error:err};R.push(nm+' 套用例外 '+err);i++;return step()}
  fr.onload=function(){setTimeout(function(){
    var d=fr.contentDocument,W=fr.contentWindow,m;
    try{m=KM.measure(d,W)}catch(e){OUT[nm]={error:'量測例外 '+e.message};R.push(nm+' 量測例外 '+e.message);i++;return step()}
    OUT[nm]={stats:m.stats,tabs:m.tabs.length,tabMiss:m.tabMiss,login:m.login.length,
             loginFlag:m.loginFlag,invis:m.invis.length,lack:m.lack.map(function(x){return x[0]}),
             optDbg:(res.optDbg||null),swallowed:(res.swallowed||[]).length};
    R.push(nm.padEnd(30)+' 元素'+m.stats.total+' 判定'+m.stats.kinded+' 寫樣式'+m.stats.styled+
           ' opt標記'+m.stats.optd+' 未觸及'+m.stats.untouched+' 落點'+m.stats.land+
           ' 選項卡'+m.tabs.length+'/未接管'+m.tabMiss+' 登入'+m.login.length+
           ' 隱形字'+m.invis.length);
    i++;step();
  },240)};
  fr.srcdoc=res.html;
}
step();
</script></body></html>"""
os.makedirs('samples',exist_ok=True)
for tag,eng in [('import',ENG_IMPORT),('preview',ENG_PREVIEW)]:
    open('enginecmp-%s.html'%tag,'w',encoding='utf-8').write(
        TPL.replace('@@S@@',SJ).replace('@@ENG@@',eng).replace('@@W@@',tag))
print('樣本',len(SAMPLES),'／import 引擎',len(ENG_IMPORT),'位元組／preview 引擎',len(ENG_PREVIEW),'位元組')
