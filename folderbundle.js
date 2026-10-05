/* ── 資料夾匯入：把多檔案的網頁專案合併成單一 HTML（2026-09-30）──────────
   問題：匯入頁一次只收一個檔案。專案若把樣式、資料、圖片拆成多個檔案
   （<link href="assets/css/style.css">、<script src="data/x.js">、assets/img/…），
   只上傳 HTML 時那些檔案都不會跟著進來——靠程式讀資料才長出來的內容整片空白。
   實例：任務中心「素材示意總覽.html」素材卡 0 張、兩張表格全空。

   作法：使用者選整個資料夾，這裡在瀏覽器裡把主 HTML 用到的東西全部內嵌：
     <link rel=stylesheet> → <style>（@import 逐層展開，url() 圖片／字型轉 data URI）
     <script src>          → 內嵌 <script>
     <img>／<source>／<video poster>／<input type=image>、inline style 的 url() → data URI
   程式執行時才組出來的路徑（'assets/img/real/' + name）靜態看不到，
   所以把資料夾裡的圖片另外放進 window.__HL_ASSETS，配一個 MutationObserver，
   畫面長出相對路徑的 <img> 時就換成對應的 data URI。

   HL_bundleFolder(files, mainPath) → Promise<{html, name, report}>
     files   ：File 陣列，每個要有 relPath（資料夾內的相對路徑，用 / 分隔）
     mainPath：要匯入的那個 HTML 的 relPath
   report：{css, js, img, font, dynamic, missing:[…], skipped:[…], bytes} */
(function(g){
  'use strict';

  var IMG_EXT=/\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)$/i;
  var FONT_EXT=/\.(woff2?|ttf|otf|eot)$/i;
  var MIME={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',webp:'image/webp',svg:'image/svg+xml',
    avif:'image/avif',bmp:'image/bmp',ico:'image/x-icon',woff:'font/woff',woff2:'font/woff2',ttf:'font/ttf',otf:'font/otf',
    eot:'application/vnd.ms-fontobject',css:'text/css',js:'text/javascript',mp4:'video/mp4',webm:'video/webm',mp3:'audio/mpeg'};
  /* 動態圖片對照表的上限：整份 HTML 過大，iframe 與 localStorage 都會吃不消 */
  var DYN_LIMIT=12*1024*1024;

  function extOf(p){var m=/\.([a-z0-9]+)$/i.exec(p);return m?m[1].toLowerCase():''}
  function isExternal(u){return !u||/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(u)}
  function dirOf(p){var i=p.lastIndexOf('/');return i<0?'':p.slice(0,i+1)}
  /* 相對路徑解析成資料夾內的正規化路徑；超出資料夾（../ 太多）回傳 null */
  function resolve(url,fromDir){
    var u=String(url).split('#')[0].split('?')[0];
    try{u=decodeURIComponent(u)}catch(e){}
    var parts=(u.charAt(0)==='/'?u.slice(1):fromDir+u).split('/'),out=[];
    for(var i=0;i<parts.length;i++){
      var s=parts[i];
      if(!s||s==='.')continue;
      if(s==='..'){if(!out.length)return null;out.pop();continue}
      out.push(s);
    }
    return out.join('/');
  }
  function readText(f){return new Promise(function(ok,no){var r=new FileReader();r.onload=function(){ok(r.result)};r.onerror=no;r.readAsText(f)})}
  function readData(f,path){return new Promise(function(ok,no){var r=new FileReader();
    r.onload=function(){var s=r.result;var m=MIME[extOf(path)];if(m)s=s.replace(/^data:[^;,]*/,'data:'+m);ok(s)};
    r.onerror=no;r.readAsDataURL(f)})}

  /* 只在「真正的 HTML 標籤」上動手：<script>／<style> 的內容與註解跳過（同 importbase.js 的教訓：
     JS 字串裡的 '<img src="…">' 被當成標籤改掉，程式就壞了）。script 開頭標籤仍交給 fn 處理。 */
  var SKIP_RE=/(<script\b[^>]*>)([\s\S]*?)(<\/script\s*>)|(<style\b[^>]*>)([\s\S]*?)(<\/style\s*>)|<!--[\s\S]*?-->/gi;
  function mapOutside(html,fnTag,fnScript,fnStyle){
    var out=[],last=0,m;
    SKIP_RE.lastIndex=0;
    while((m=SKIP_RE.exec(html))){
      out.push(fnTag(html.slice(last,m.index)));
      if(m[1]!==undefined)out.push(fnScript(m[1],m[2],m[3]));
      else if(m[4]!==undefined)out.push(fnStyle(m[4],m[5],m[6]));
      else out.push(m[0]);
      last=SKIP_RE.lastIndex;
    }
    out.push(fnTag(html.slice(last)));
    return out;
  }

  g.HL_bundleFolder=function(files,mainPath){
    var byPath={};
    files.forEach(function(f){byPath[f.relPath]=f});
    var rep={css:0,js:0,img:0,font:0,dynamic:0,missing:[],skipped:[],bytes:0};
    var dataCache={},used={};
    function miss(p,why){if(rep.missing.indexOf(p)<0)rep.missing.push(p+(why?'（'+why+'）':''))}
    function data(path){
      if(!dataCache[path])dataCache[path]=readData(byPath[path],path);
      used[path]=1;
      return dataCache[path];
    }
    /* 字串裡的非同步替換：先收集所有工作，再依序換回去 */
    function replaceAsync(str,re,fn){
      var jobs=[];
      str.replace(re,function(){var a=arguments;jobs.push(fn.apply(null,a));return a[0]});
      return Promise.all(jobs).then(function(vals){var i=0;return str.replace(re,function(){return vals[i++]})});
    }

    /* CSS：@import 逐層展開、url() 轉 data URI。外部網址（Google Fonts）原樣保留並提到最前面 */
    function processCss(css,cssPath,seen,extImports){
      var dir=dirOf(cssPath);
      /* 網址可能含分號（Google Fonts 的 wght@300;400），引號內的內容要整段吃下 */
      return replaceAsync(css,/@import\s+(?:url\(\s*(['"]?)(.*?)\1\s*\)|(['"])(.*?)\3)\s*([^;]*);/gi,function(whole,q1,u1,q2,u2,media){
        var u=(u1!==undefined&&u1!=='')?u1:u2;
        if(isExternal(u)){extImports.push(whole.trim());return Promise.resolve('')}
        var p=resolve(u,dir);
        if(!p||!byPath[p]){miss(u,'被 '+cssPath+' 引用');return Promise.resolve('')}
        if(seen[p])return Promise.resolve('');
        seen[p]=1;rep.css++;used[p]=1;
        return readText(byPath[p]).then(function(t){return processCss(t,p,seen,extImports)})
          .then(function(t){var body='\n/* ── '+p+' ── */\n'+t+'\n';return media.trim()?'@media '+media.trim()+'{'+body+'}':body});
      }).then(function(c){
        return replaceAsync(c,/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,function(whole,q,u){
          if(isExternal(u)||/^data:/i.test(u))return Promise.resolve(whole);
          var p=resolve(u,dir);
          if(!p||!byPath[p]){miss(u,'被 '+cssPath+' 引用');return Promise.resolve(whole)}
          if(FONT_EXT.test(p))rep.font++;else rep.img++;
          return data(p).then(function(d){return 'url("'+d+'")'});
        });
      });
    }
    function cssBlock(css,cssPath){
      var ext=[];
      return processCss(css,cssPath,{},ext).then(function(c){
        var head=ext.filter(function(x,i){return ext.indexOf(x)===i}).join('\n');
        return (head?head+'\n':'')+c;
      });
    }

    var mainDir=dirOf(mainPath);
    return readText(byPath[mainPath]).then(function(html){
      var parts=mapOutside(html,
        /* 一般 HTML：link／img／source／poster／inline style */
        function(seg){
          return replaceAsync(seg,/<link\b[^>]*>/gi,function(tag){
            if(!/rel\s*=\s*["']?[^"'>]*stylesheet/i.test(tag))return Promise.resolve(tag);
            var m=/\bhref\s*=\s*(["'])([^"']*)\1/i.exec(tag)||/\bhref\s*=\s*([^\s>]+)/i.exec(tag);
            var u=m&&(m[2]!==undefined?m[2]:m[1]);
            if(!u||isExternal(u))return Promise.resolve(tag);
            var p=resolve(u,mainDir);
            if(!p||!byPath[p]){miss(u);return Promise.resolve(tag)}
            rep.css++;used[p]=1;
            return readText(byPath[p]).then(function(t){return cssBlock(t,p)})
              .then(function(c){return '<style data-hl-from="'+p+'">\n'+c+'\n</style>'});
          }).then(function(s){
            return replaceAsync(s,/(<(?:img|source|video|audio|input|track|embed)\b[^>]*?\s(?:src|poster)\s*=\s*)(["'])([^"']*)\2/gi,function(whole,pre,q,u){
              if(isExternal(u)||/^data:/i.test(u))return Promise.resolve(whole);
              var p=resolve(u,mainDir);
              if(!p||!byPath[p]){miss(u);return Promise.resolve(whole)}
              rep.img++;
              return data(p).then(function(d){return pre+q+d+q});
            });
          }).then(function(s){
            return replaceAsync(s,/(\sstyle\s*=\s*)(["'])([^"']*url\([^"']*)\2/gi,function(whole,pre,q,st){
              return replaceAsync(st,/url\(\s*(&quot;|['"]?)([^'")&]+)\1\s*\)/gi,function(w,qq,u){
                if(isExternal(u)||/^data:/i.test(u))return Promise.resolve(w);
                var p=resolve(u,mainDir);
                if(!p||!byPath[p]){miss(u);return Promise.resolve(w)}
                rep.img++;
                return data(p).then(function(d){return 'url('+d+')'});
              }).then(function(v){return pre+q+v+q});
            });
          });
        },
        /* <script src> → 內嵌；inline script 原樣 */
        function(open,body,close){
          var m=/\bsrc\s*=\s*(["'])([^"']*)\1/i.exec(open)||/\bsrc\s*=\s*([^\s>]+)/i.exec(open);
          var u=m&&(m[2]!==undefined?m[2]:m[1]);
          if(!u||isExternal(u))return Promise.resolve(open+body+close);
          var p=resolve(u,mainDir);
          if(!p||!byPath[p]){miss(u);return Promise.resolve(open+body+close)}
          rep.js++;used[p]=1;
          var attrs=open.replace(/\s+src\s*=\s*(["'])[^"']*\1|\s+src\s*=\s*[^\s>]+/i,'').replace(/\s+(?:defer|async)\b/gi,'');
          return readText(byPath[p]).then(function(t){
            return attrs.replace(/>$/,' data-hl-from="'+p+'">')+'\n'+t.replace(/<\/script/gi,'<\\/script')+'\n'+close;
          });
        },
        /* 頁面內的 <style>：url() 轉 data URI、@import 展開 */
        function(open,body,close){
          return cssBlock(body,mainPath).then(function(c){return open+c+close});
        });
      return Promise.all(parts.map(function(x){return Promise.resolve(x)})).then(function(arr){return arr.join('')});
    }).then(function(html){
      /* 動態圖片：資料夾裡還沒被內嵌、在主 HTML 目錄底下的圖片，放進對照表 */
      var cand=Object.keys(byPath).filter(function(p){return IMG_EXT.test(p)&&!used[p]&&p.indexOf(mainDir)===0}).sort();
      var total=0,keep=[];
      cand.forEach(function(p){var s=byPath[p].size*1.37;if(total+s>DYN_LIMIT){rep.skipped.push(p);return}total+=s;keep.push(p)});
      return Promise.all(keep.map(function(p){return readData(byPath[p],p)})).then(function(ds){
        if(!keep.length)return html;
        var map={};keep.forEach(function(p,i){map[p.slice(mainDir.length)]=ds[i]});
        rep.dynamic=keep.length;
        /* 程式字串裡刻意不寫 src=：避免被舊版匯入的路徑改寫誤判成標籤 */
        var shim='<script data-hl-from="folder-assets">/* 資料夾匯入：程式執行時才產生的圖片（'+keep.length+' 張），換成內嵌資料 */\n'
          +'window.__HL_ASSETS='+JSON.stringify(map).replace(/<\//g,'<\\/')+';\n'
          +'(function(){var A=window.__HL_ASSETS;function key(u){if(!u||/^(?:[a-z][a-z0-9+.-]*:|\\/\\/|#)/i.test(u))return null;'
          +'u=u.split("#")[0].split("?")[0];try{u=decodeURIComponent(u)}catch(e){}u=u.replace(/^\\.\\//,"").replace(/^\\//,"");return A[u]?u:null}'
          +'function fix(el){if(!el||el.nodeType!==1)return;var n=el.tagName;'
          +'if(n==="IMG"||n==="SOURCE"){var k=key(el.getAttribute("src"));if(k)el.setAttribute("src",A[k]);var ss=el.getAttribute("srcset");if(ss&&key(ss.split(/[\\s,]/)[0]))el.setAttribute("srcset",A[key(ss.split(/[\\s,]/)[0])]);}'
          +'if(n==="A"){var h=key(el.getAttribute("href"));if(h){el.addEventListener("click",function(e){e.preventDefault();fetch(A[h]).then(function(r){return r.blob()}).then(function(b){window.open(URL.createObjectURL(b),"_blank")})});}}'
          +'if(el.querySelectorAll)[].forEach.call(el.querySelectorAll("img,source,a"),fix)}'
          +'new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==="attributes")fix(m.target);else [].forEach.call(m.addedNodes,fix)})})'
          +'.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["src","srcset"]});'
          +'document.addEventListener("DOMContentLoaded",function(){fix(document.body)})})();\n</script>\n';
        return /<head\b[^>]*>/i.test(html)?html.replace(/<head\b[^>]*>/i,function(h){return h+'\n'+shim}):shim+html;
      });
    }).then(function(html){
      rep.bytes=new Blob([html]).size;
      var name=mainPath.split('/').pop().replace(/\.[^.]+$/,'');
      return {html:html,name:name,report:rep};
    });
  };

  /* 拖曳資料夾：DataTransferItem → File 陣列（帶 relPath） */
  g.HL_filesFromDrop=function(items){
    var out=[];
    function walk(entry,path){
      return new Promise(function(ok){
        if(entry.isFile){entry.file(function(f){f.relPath=path+entry.name;out.push(f);ok()},function(){ok()});return}
        if(!entry.isDirectory){ok();return}
        var rd=entry.createReader(),all=[];
        (function more(){rd.readEntries(function(es){
          if(!es.length){Promise.all(all.map(function(e){return walk(e,path+entry.name+'/')})).then(ok);return}
          all=all.concat([].slice.call(es));more();
        },function(){ok()})})();
      });
    }
    var roots=[];
    for(var i=0;i<items.length;i++){var e=items[i].webkitGetAsEntry&&items[i].webkitGetAsEntry();if(e)roots.push(e)}
    return Promise.all(roots.map(function(e){return walk(e,'')})).then(function(){
      /* 拖的是單一資料夾：去掉最外層資料夾名，讓路徑跟 <input webkitdirectory> 的結果一致 */
      return out;
    });
  };
  /* <input webkitdirectory> 的 File 陣列：relPath 取 webkitRelativePath */
  g.HL_filesFromInput=function(list){
    return [].slice.call(list).map(function(f){f.relPath=f.webkitRelativePath||f.name;return f});
  };
  /* 整理成「主 HTML 候選清單」：略過看起來是元件片段或壞掉的檔名 */
  g.HL_htmlCandidates=function(files){
    return files.map(function(f){return f.relPath}).filter(function(p){return /\.html?$/i.test(p)&&!/(^|\/)(node_modules|\.git)\//.test(p)})
      .sort(function(a,b){var da=a.split('/').length,db=b.split('/').length;return da-db||a.localeCompare(b,'zh-Hant')});
  };
})(window);
