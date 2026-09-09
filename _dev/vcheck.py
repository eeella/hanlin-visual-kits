import extract,json,glob,os
S={os.path.basename(p):open(p,encoding='utf-8').read() for p in glob.glob('samples/user-index_v6.html')}
ENG=extract.engine('import.html')
open('vcheck.html','w',encoding='utf-8').write("""<!DOCTYPE html><html><head><meta charset="UTF-8"><title>VC-RUN</title></head>
<body><pre id="out">x</pre><iframe id="fr" style="width:1280px;height:900px;border:0"></iframe>
<script>var SAMPLES=@@S@@;</script><script>@@E@@</script><script>
window.onerror=function(m,u,l){document.getElementById('out').textContent='ERR '+m+' @'+l;document.title='VC-DONE'};
var R=[],SRC=SAMPLES['user-index_v6.html'];
function cfg(hero,opt,fm){return JSON.stringify({theme:{n:'翰林藍',p:'#0088D2',s:'#005696',i:'#40B4E5',c:'#FF9A3C'},contrast:'auto',
  logoLight:0,logoDark:0,logoInv:false,groups:{hd:1,ft:2,hero:hero,fm:fm,opt:opt,tblsty:0,icon:0},
  controls:{btn:true,seg:true,select:true,label:true,principles:true,midcolor:true,gray:true,softtile:true,rwd:true,type:true,shape:true},
  memberEntry:true});}
var CASES=[[0,0,0],[1,1,1],[1,0,0],[0,1,1]],ci=0,fr=document.getElementById('fr');
(function nx(){
  if(ci>=CASES.length){
    /* 型態／缺值防護：groups 缺失、-1、字串 */
    [['缺 groups','{}'],['groups.hero=-1','{"groups":{"hero":-1,"opt":-1,"fm":-1}}']].forEach(function(t){
      var base=JSON.parse(cfg(1,1,1));
      if(t[0]==='缺 groups')delete base.groups; else base.groups=JSON.parse(t[1]).groups;
      localStorage.setItem('hanlin-brand-theme',JSON.stringify(base));
      var h=brandifyHtml(SRC,{}).html;
      var v=/var V=(\\{.*?\\});/.exec(h);
      R.push('  '+t[0]+' → '+(v?v[1].replace(/"/g,'').slice(0,110):'讀不到'));
    });
    document.getElementById('out').textContent=R.join('\\n');document.title='VC-DONE';return;
  }
  var c=CASES[ci];
  localStorage.setItem('hanlin-brand-theme',cfg(c[0],c[1],c[2]));
  var res=brandifyHtml(SRC,{});
  fr.srcdoc=res.html;
  setTimeout(function(){
    var d=fr.contentDocument,W=fr.contentWindow;
    Array.prototype.forEach.call(d.querySelectorAll('.random-only,.hidden'),function(e){e.classList.remove('hidden');e.style.display=''});
    var he=d.querySelector('[data-hl-hero]');
    var hbg=he?W.getComputedStyle(he).backgroundImage:'';
    var isPhoto=/url\\(/.test(hbg), isGrad=/radial-gradient|140deg|135deg/.test(hbg);
    var ph=d.querySelectorAll('[data-hl-photo]').length;
    var ico=d.querySelector('[data-hl-formopt] [class*=ico]');
    var ibg=ico?W.getComputedStyle(ico).backgroundColor:'（無）';
    var icoIsTile=ico?(ibg.indexOf('rgba(0, 0, 0, 0)')<0):false;
    R.push('hero='+c[0]+'（'+(c[0]===1?'純圖片版':'AI 漸層版')+'） opt='+c[1]+'（'+(c[1]===1?'純icon':'色塊')+'）');
    if(c[0]===1&&c[1]===1){
      var dd=new DOMParser().parseFromString(res.html,'text/html');
      var he0=dd.querySelector('[data-hl-hero]');
      R.push('   [診斷] 輸出的 hero style 屬性 background 部分：');
      var sa=String((he0&&he0.getAttribute('style'))||'');
      R.push('      style 長度='+sa.length+'  前 170 字：'+sa.slice(0,170));
      R.push('      hero outerHTML 前 130 字：'+String((he0&&he0.outerHTML)||'').slice(0,130));
      var php=dd.querySelector('[data-hl-photo]');
      R.push('      預留位的父層='+(php&&php.parentElement?(php.parentElement.tagName+'.'+String(php.parentElement.className||'')):'（無）'));
      R.push('   [診斷] hero 內 img 數='+(he0?he0.querySelectorAll('img').length:0));
    }
    R.push('   橫幅底：'+(isPhoto?'照片':(isGrad?'品牌漸層':'中性淺底'))+'　照片預留位='+ph
      +'　'+((c[0]===1)===(!isGrad)?'✅ 與勾選相符':'❌ 與勾選不符'));
    R.push('   選項卡圖示：'+(icoIsTile?'有色塊 '+ibg:'無色塊（透明）')
      +'　'+((c[1]===1)===(!icoIsTile)?'✅ 與勾選相符':'❌ 與勾選不符'));
    ci++;nx();
  },800);
})();
</script></body></html>""".replace('@@S@@',json.dumps(S,ensure_ascii=False).replace('</script>','<\\/script>')).replace('@@E@@',ENG))
