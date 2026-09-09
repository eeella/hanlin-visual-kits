# -*- coding: utf-8 -*-
"""登入系統（會員入口）注入探針：memberEntry=true 時，每份樣本到底有沒有套進去，
   以及卡在哪一關（沒有 hd／頁面已有登入入口／設定沒被讀到）。"""
import extract, json, glob, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
SRC=sys.argv[1] if len(sys.argv)>1 else 'import.html'
TAG=sys.argv[2] if len(sys.argv)>2 else 'cur'
SAMPLES={os.path.basename(p):open(p,encoding='utf-8').read() for p in sorted(glob.glob('samples/*.html'))}
ENG=extract.engine(SRC)
SJ=json.dumps(SAMPLES,ensure_ascii=False).replace('</script>','<\\/script>')
open('memberprobe-%s.html'%TAG,'w',encoding='utf-8').write(
"""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>MP-RUN</title></head>
<body><pre id="out">run</pre><script>var SAMPLES=@@S@@;</script><script>@@E@@</script><script>
window.onerror=function(m,u,l){document.getElementById('out').textContent='ERR '+m+' @'+l;document.title='MP-ERR'};
localStorage.setItem('hanlin-brand-theme',JSON.stringify({
  theme:{n:'翰林藍',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},contrast:'auto',
  logoLight:0,groups:{hd:1,ft:2,hero:1,fm:1,opt:1,tblsty:0,icon:0},
  controls:{btn:true},memberEntry:true}));   /* 使用者親自勾選「登入系統」 */
var R=[],OUT={};
Object.keys(SAMPLES).forEach(function(nm){
  var o,err='';
  try{o=brandifyHtml(SAMPLES[nm],{})}catch(e){err=e.message}
  if(err){OUT[nm]={error:err};R.push(nm+' 例外 '+err);return}
  var d=new DOMParser().parseFromString(o.html,'text/html');
  var hd=d.querySelector('[data-hl-hd]');
  var mem=d.querySelectorAll('[data-hl-member]').length;
  var ck=(o.checklist||[]).filter(function(r){return /登入/.test(r.label||'')})[0];
  var hdTxt=hd?(hd.textContent||'').replace(/\\s+/g,'').slice(0,24):'';
  OUT[nm]={hd:!!hd,hdTag:hd?hd.tagName.toLowerCase()+'.'+(hd.getAttribute('class')||'').split(' ')[0]:'—',
           member:mem,already:/會員|登入|註冊|帳號/.test(hdTxt),
           ck:ck?(ck.done?'done':'skip'):'—'};
  R.push(nm.padEnd(26)+' hd='+(hd?'有':'無').padEnd(2)+' 會員入口='+mem+
         ' 版頭已有登入字樣='+(OUT[nm].already?'是':'否')+' 清單='+OUT[nm].ck);
});
document.getElementById('out').textContent=R.join('\\n');
window.__MP=JSON.stringify(OUT);document.title='MP-DONE';
</script></body></html>""".replace('@@S@@',SJ).replace('@@E@@',ENG))
print('memberprobe-%s.html 已產生（%d 份樣本）'%(TAG,len(SAMPLES)))
