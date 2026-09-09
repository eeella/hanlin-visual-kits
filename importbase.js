/* ── 匯入檔的相對路徑處理 ────────────────────────────────────────────
   問題：對照預覽用的是 iframe.srcdoc，而 srcdoc 的 base URL 繼承父頁。
   匯入檔裡寫 styles.css，實際會去要 <平台根目錄>/styles.css——
   實測（Network 面板）確認四種寫法都打到平台身上：
     styles.css        → http://<平台>/styles.css
     ./assets/theme.css→ http://<平台>/assets/theme.css
     img/logo.png      → http://<平台>/img/logo.png
     app.js            → http://<平台>/app.js
   現在剛好都 404 只是運氣好；平台哪天多了同名檔案，匯入的頁面就會載到
   平台自己的樣式或腳本，畫面走樣還很難查——會被當成「套版把我的頁面弄壞了」。

   兩種處理：
     有原始網址 → 注入 <base href="使用者的網址">，資源就真的載得到。
     沒有網址   → 注入一個指向不存在子目錄的 base，讓相對路徑必定落空，
                  但絕不會撞到平台的任何檔案。這是「壞得明確」勝過「壞得隱晦」。
   兩種情況都回報清單，讓使用者知道哪些資源沒有跟著進來。 */
(function(g){
  'use strict';

  /* 掃出所有相對路徑資源。只認會發出請求的屬性，
     不碰 a[href]（那是連結，不是資源，改了會動到使用者的內容）。 */
  var ASSET_RE = /<(link|script|img|source|video|audio|iframe|embed|object)\b[^>]*?\s(href|src|data)\s*=\s*("([^"]*)"|'([^']*)'|([^\s">]+))/gi;

  function isAbsolute(u){
    return !u || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|data:|blob:|about:|javascript:)/i.test(u);
  }

  function scanAssets(html){
    var out=[], m;
    ASSET_RE.lastIndex=0;
    while((m=ASSET_RE.exec(html))){
      var url=(m[4]!==undefined?m[4]:(m[5]!==undefined?m[5]:m[6]))||'';
      if(isAbsolute(url))continue;
      /* 根路徑 /x.css 也算相對於網域，一樣會打到平台 */
      out.push({tag:m[1].toLowerCase(), attr:m[2].toLowerCase(), url:url});
    }
    return out;
  }

  /* 這個子目錄刻意不存在：相對路徑會落在它底下，永遠不會碰到平台的檔案。
     名字寫得白一點，使用者在 Network 面板看到就知道是怎麼回事。 */
  var DEAD_BASE = './__imported-assets-not-uploaded__/';

  /* 只注入 <base> 是不夠的（實測）：Chrome 的 preload scanner 會在主解析器
     處理到 <base> 之前，就先用父頁的 base 推測性地發出請求——同一個資源會發兩次，
     第一次照樣打到平台身上。所以真正有效的是把 URL 本身改寫掉，
     <base> 留著當第二道（處理 CSS 裡 url() 這類我們不改寫的部分）。 */
  /* 死路徑的絕對形式。在瀏覽器裡是 http://<平台>/__imported…__/，
     node 測試時 location.href 由呼叫端提供。 */
  function deadBaseAbs(){
    try{ return new URL(DEAD_BASE, location.href).href; }catch(e){ return DEAD_BASE; }
  }
  function rewriteAssets(html, prefix){
    ASSET_RE.lastIndex=0;
    return html.replace(ASSET_RE, function(whole, tag, attr, q, dq, sq, bare){
      var url = (dq!==undefined?dq:(sq!==undefined?sq:bare))||'';
      if(isAbsolute(url))return whole;
      /* 改寫成「絕對 URL」而不是相對路徑：<base> 之後還會再解析一次相對路徑，
         寫成相對的話會疊成 __imported…__/__imported…__/styles.css（實測），
         多發一輪注定失敗的請求。絕對 URL 不受 base 影響。 */
      var nu;
      try{ nu = new URL(url.replace(/^\.?\//,''), prefix || deadBaseAbs()).href; }
      catch(e){ nu = DEAD_BASE + url.replace(/^\.?\//,''); }
      /* 只換掉這個屬性的值，其餘原樣保留——標籤上還有 alt、class、onerror
         這些使用者自己的東西，重建整個標籤會弄丟它們。 */
      var idx = whole.lastIndexOf(q);
      return whole.slice(0, idx) + (dq!==undefined ? '"'+nu+'"'
                                  : sq!==undefined ? "'"+nu+"'"
                                  : '"'+nu+'"');
    });
  }

  function injectBase(html, href){
    var tag = '<base href="'+String(href).replace(/"/g,'&quot;')+'">';
    /* 已經有 base 的檔案不要動——那是使用者自己寫的，比我們猜得準 */
    if(/<base\b[^>]*>/i.test(html))return {html:html, injected:false};
    if(/<head\b[^>]*>/i.test(html))
      return {html:html.replace(/<head\b[^>]*>/i, function(h){return h+'\n'+tag}), injected:true};
    if(/<html\b[^>]*>/i.test(html))
      return {html:html.replace(/<html\b[^>]*>/i, function(h){return h+'\n<head>'+tag+'</head>'}), injected:true};
    return {html:'<head>'+tag+'</head>'+html, injected:true};
  }

  /* html    ：使用者匯入的原始碼
     baseUrl：這份檔案原本所在的網址（例如 https://example.com/about/index.html）。
              從本機上傳或直接貼上時沒有這個資訊，留空即可。
     回傳 {html, base, mode, assets, count} */
  g.HL_rebaseHtml = function(html, baseUrl){
    html = String(html==null?'':html);
    var assets = scanAssets(html);
    if(!assets.length) return {html:html, base:null, mode:'none', assets:[], count:0};

    var base, mode;
    if(baseUrl){
      /* 用 URL 解析成目錄，檔名要去掉，不然 styles.css 會變成 .../index.html/styles.css */
      try{
        var u = new URL(baseUrl, location.href);
        u.hash=''; u.search='';
        base = u.href.replace(/[^/]*$/, '');
        mode = 'origin';
      }catch(e){ base = DEAD_BASE; mode = 'isolated'; }
    }else{
      base = DEAD_BASE; mode = 'isolated';
    }
    /* 先改寫 URL（擋 preload scanner），再注入 base（擋 CSS url() 那類漏網的） */
    var rewritten = rewriteAssets(html, mode==='origin'?base:null);
    var r = injectBase(rewritten, base);
    return {html:r.html, base:base, mode:mode, assets:assets, count:assets.length,
            injected:r.injected};
  };

  /* 給報告用的人話摘要 */
  g.HL_rebaseSummary = function(res){
    if(!res||!res.count) return '';
    var kinds={};
    res.assets.forEach(function(a){kinds[a.tag]=(kinds[a.tag]||0)+1});
    var list=Object.keys(kinds).map(function(k){return k+' × '+kinds[k]}).join('、');
    if(res.mode==='origin')
      return '這份檔案有 '+res.count+' 個相對路徑資源（'+list+'），已依你提供的原始網址載入。';
    return '這份檔案有 '+res.count+' 個相對路徑資源（'+list+'）沒有一起上傳，'
         + '預覽時不會載入。這不影響套版結果——套版只改顏色、字體與 Logo。';
  };
})(window);
