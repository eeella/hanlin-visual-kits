import extract,json,os,sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
data={'user-edcafe':open('samples/user-edcafe.html',encoding='utf-8',errors='ignore').read()}
blob=json.dumps(data,ensure_ascii=False).replace('</script>','<\\/script>')
open('_ed.html','w',encoding='utf-8').write("""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ED</title></head><body><pre id="o">run</pre>
<script>
window.onerror=function(m,s,l,c,e){document.getElementById('o').textContent='JS ERROR: '+m+' @line '+l;document.title='ED-ERR';};
var __s={};
function guidelineTheme(){return JSON.parse(__s['hanlin-brand-theme']).theme}
var localStorage={getItem:function(k){return __s[k]||null},setItem:function(){}};
%s
__s['hanlin-brand-theme']=JSON.stringify({theme:{n:'翰林藍',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},contrast:'auto',logoLight:2,groups:{hd:2,ft:2,hero:1,fm:0,tblsty:0,icon:0},controls:{btn:true,select:true,label:true},memberEntry:true});
var D=%s,L=[];
try{
var r=brandifyHtml(D['user-edcafe'],{});
var d=new DOMParser().parseFromString(r.html,'text/html');
L.push('模型 '+(r.framework||'—')+'  變數定義 '+r.varRole.defs+'  換色命中 '+r.varRole.hits+'  色碼 '+Object.keys(r.map).length+'  icon '+r.iconCount+'  logo '+r.logoCount);
L.push('元件 '+JSON.stringify(r.comps));
var hd=d.querySelector('[data-hl-hd]'),sb=d.querySelector('[data-hl-sb]');
L.push('側欄 '+(sb?('✓ '+(sb.className||sb.tagName)):'✗')
  +'   Header '+(hd?((hd.getAttribute('data-hl-inserted')?'補上':'既有')+'@'+(hd.className||hd.tagName)):'✗')
  +'   Footer '+(d.querySelector('[data-hl-ft]')?'✓':'✗')+'   Hero '+(d.querySelector('[data-hl-hero]')?'✓':'✗'));
if(hd){var pp=hd.parentElement;L.push('Header 父層：'+(pp?(pp.tagName+'.'+(pp.className||'')):'—')+'  父層文字量 '+(pp?(pp.textContent||'').trim().length:0));}
var vis='';
var w=d.createTreeWalker(d.body,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
  var p=n.parentElement;while(p){if(/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;p=p.parentElement}
  return NodeFilter.FILTER_ACCEPT}});
while(w.nextNode())vis+=w.currentNode.nodeValue;
var emo=vis.match(/[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}]/gu)||[];
var uq={};emo.forEach(function(e){uq[e]=1});
L.push('可見 emoji 殘留 '+emo.length+'（'+Object.keys(uq).join('')+'）');
var dots=d.querySelectorAll('.material-symbols-rounded'),tone={};
Array.prototype.forEach.call(dots,function(e){if((e.textContent||'')==='circle'){var m=/color:\\s*([^;]+)/.exec(e.getAttribute('style')||'');if(m)tone[m[1].trim()]=(tone[m[1].trim()]||0)+1}});
L.push('色點配色 '+JSON.stringify(tone));
var tb=d.querySelectorAll('table'),ts=0;
Array.prototype.forEach.call(tb,function(t){if((t.getAttribute('style')||'').length>10)ts++});
L.push('表格 '+ts+'/'+tb.length+'   原站色殘留 '+(/#3e8ed6|#25b2f0|#1e5c9c|#173f66/i.test(r.html)?'有':'無'));
var lg=d.querySelectorAll('img[data-hl-added],[data-hl-sb] img');
L.push('側欄 logo '+lg.length+' 個'+(lg.length?('（'+(lg[0].getAttribute('style')||'').slice(0,40)+'）'):''));
document.getElementById('o').textContent=L.join('\\n');
document.title='ED-DONE';
}catch(e){document.getElementById('o').textContent='CATCH: '+e.message+'\\n'+e.stack;document.title='ED-ERR';}
</script></body></html>"""%(extract.engine('import.html'),blob))
print('_ed.html 已建立')
