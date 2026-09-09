# 產生套用後 HTML(供截圖目視驗收)
import extract,json,os,sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
name=sys.argv[1]
src=open('samples/%s.html'%name,encoding='utf-8',errors='ignore').read()
blob=json.dumps(src,ensure_ascii=False).replace('</script>','<\\/script>')
tpl="""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>GEN</title></head><body><textarea id="o"></textarea>
<script>
window.onerror=function(m,s,l){document.getElementById('o').value='ERR '+m+' @'+l;document.title='GEN-ERR'};
var __s={};
function guidelineTheme(){return JSON.parse(__s['hanlin-brand-theme']).theme}
var localStorage={getItem:function(k){return __s[k]||null},setItem:function(){}};
%s
__s['hanlin-brand-theme']=JSON.stringify({theme:{n:'翰林藍',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},contrast:'auto',logoLight:2,groups:{hd:2,ft:2,hero:1,fm:0,tblsty:0,icon:0},controls:{btn:true,select:true,label:true},memberEntry:true});
var SRC=%s;
try{var r=brandifyHtml(SRC,{});document.getElementById('o').value=r.html;document.title='GEN-OK';}
catch(e){document.getElementById('o').value='CATCH '+e.message;document.title='GEN-ERR';}
</script></body></html>"""%(extract.engine('import.html'),blob)
open('_gen.html','w',encoding='utf-8').write(tpl)
print('ok')
