/* ══ 套用比對監測面板：唯一一份呈現邏輯 ═══════════════════════════════
   量測走 km-monitor.js 的 KM.measure，呈現走這一支。
   匯入頁與預覽頁都呼叫 KMPanel.mount()，避免又變成「兩份面板各改各的」——
   這個專案已經因為 import／preview 各自內嵌一份引擎吃過一次大虧
   （同一批 27 份樣本六項統計無一相同）。
   面板只讀取被量的文件，不修改它，也不參與任何套用判定。 */
(function(g){
  function esc(t){return String(t).replace(/[&<>]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[m]})}
  function td(v,c){return '<td style="border:1px solid #dde2ea;padding:3px 6px'+(c?';text-align:center':'')+'">'+v+'</td>'}
  function th(list){return '<tr style="background:#eef2f7">'+list.map(function(h){
    return '<th style="border:1px solid #dde2ea;padding:3px 6px">'+h+'</th>'}).join('')+'</tr>'}

  /* opts: {frame:<iframe>, rerender:<function|null>}
     rerender 有給時，按下按鈕會先重新套用再量；沒給就直接量現況。
     【為什麼固定浮在右下角】原本內嵌在比較區之後，有兩個問題：
       ① 兩個 iframe 各約 700px 高，面板被推到 top≈1690，不捲到底看不到；
       ② 匯入前比較區是 display:none，面板跟著沒有高度，等於不存在。
     改成掛在 document.body 上的 position:fixed，兩個問題一起消失，
     而且兩頁共用同一份，不會又變成各頁自己調位置。 */
  function mount(opts){
    var frame=opts&&opts.frame;if(!frame)return null;
    var wrap=document.createElement('div');
    wrap.id='kmPanel';
    wrap.style.cssText='position:fixed;right:16px;bottom:16px;z-index:2147483000;'+
      'width:min(620px,calc(100vw - 32px));max-height:76vh;display:flex;flex-direction:column;'+
      'border:1px solid #cfd7e3;border-radius:12px;background:#fff;font-size:12.5px;overflow:hidden;'+
      'box-shadow:0 10px 34px rgba(16,32,56,.22)';
    wrap.innerHTML=
      '<div id="kmBar" style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:#f4f7fb;'+
        'border-bottom:1px solid #dfe4ec;flex:0 0 auto">'+
        '<b style="font-size:13px;white-space:nowrap">套用比對監測</b>'+
        '<span id="kmSum" style="color:#62778f;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;'+
          'white-space:nowrap">尚未量測</span>'+
        '<button class="btn primary" id="kmRun" style="font-size:12px;padding:4px 12px;white-space:nowrap">開始比對量測</button>'+
        '<button class="btn soft" id="kmToggle" style="font-size:12px;padding:4px 10px;white-space:nowrap">明細</button>'+
        '<button class="btn soft" id="kmCopy" style="font-size:12px;padding:4px 10px;white-space:nowrap">複製</button>'+
        '<button class="btn soft" id="kmMin" title="收起／展開" style="font-size:12px;padding:4px 9px;white-space:nowrap">－</button>'+
      '</div>'+
      '<div id="kmBody" style="display:none;padding:12px 14px;overflow:auto;flex:1 1 auto"></div>';
    document.body.appendChild(wrap);
    /* 收起：只留一條標題膠囊，不擋畫面；狀態記在 localStorage，重整後沿用。 */
    var minEl=wrap.querySelector('#kmMin'),barEl=wrap.querySelector('#kmBar');
    function setMin(on){
      try{localStorage.setItem('hanlin-km-min',on?'1':'0')}catch(e){}
      minEl.textContent=on?'＋':'－';
      wrap.style.width=on?'auto':'min(620px,calc(100vw - 32px))';
      Array.prototype.forEach.call(barEl.children,function(c){
        if(c!==minEl&&c.tagName!=='B')c.style.display=on?'none':'';
      });
      if(on){wrap.querySelector('#kmBody').style.display='none';
             wrap.querySelector('#kmToggle').textContent='明細'}
      barEl.style.cursor=on?'pointer':'';
    }
    minEl.addEventListener('click',function(){setMin(minEl.textContent==='－')});
    /* 收起時整顆膠囊都能點開，不用瞄準那顆「＋」 */
    barEl.addEventListener('click',function(e){if(minEl.textContent==='＋'&&e.target!==minEl)setMin(false)});
    /* 2026-09-16 UX 審核：預設收起。展開的整條工具列會蓋住匯入頁的「解析貼上的內容」與提示文字，
       手機版更會橫切說明區；面板仍無條件顯示（2026-09-09 決定），只是第一次進來先收成一顆膠囊，
       使用者展開過一次就記住。 */
    var minPref=null;try{minPref=localStorage.getItem('hanlin-km-min')}catch(e){}
    setMin(minPref!=='0');

    var sum=wrap.querySelector('#kmSum'),body=wrap.querySelector('#kmBody');
    var tg=wrap.querySelector('#kmToggle'),cp=wrap.querySelector('#kmCopy'),run=wrap.querySelector('#kmRun');
    var LAST='',pending=false;
    tg.addEventListener('click',function(){var o=body.style.display!=='none';
      body.style.display=o?'none':'block';tg.textContent=o?'明細':'收合'});
    cp.addEventListener('click',function(){
      try{navigator.clipboard.writeText(LAST);cp.textContent='已複製'}catch(e){cp.textContent='複製失敗'}
      setTimeout(function(){cp.textContent='複製紀錄'},1600)});

    function measure(){
      if(!g.KM)return;
      var d,W;try{d=frame.contentDocument;W=frame.contentWindow}catch(e){return}
      if(!d||!d.body)return;
      var m=KM.measure(d,W,{sourceOfTruth:!!opts.sourceOfTruth}),s=m.stats;
      sum.innerHTML='元素 '+s.total+'　已判定 '+s.kinded+'　已寫樣式 '+s.styled+
        '　選項卡標記 '+s.optd+'　未觸及 '+s.untouched+'　品牌色落點 '+s.land+
        ((m.rules&&(m.rules.live+m.rules.dead))?('　規則 '+m.rules.live+'/'+(m.rules.live+m.rules.dead)+' 生效'):'')+
        '　登入系統 '+((m.member&&m.member.injected)?'已注入':'<b style="color:#c0392b">未注入</b>')+
        '　選項卡候選未接管 '+(m.tabMiss?('<b style="color:#c0392b">'+m.tabMiss+'</b>'):'0')+
        (m.invis.length?('　<b style="color:#c0392b">隱形字 '+m.invis.length+'</b>'):'')+
        (m.lack.length?('　<b style="color:#c0392b">引擎缺 '+m.lack.length+' 項</b>'):'');
      var H=[];
      H.push('<div style="color:var(--gray-2,#62778f);margin-bottom:8px">套用引擎：<code>'+(m.engine||'?')+'</code></div>');
      if(m.lack.length)H.push('<div style="background:#fff2f2;border:1px solid #f0c0c0;border-radius:8px;'+
        'padding:10px 12px;margin-bottom:12px"><b>引擎未走單一真相源</b>：'+
        m.lack.map(function(x){return x[1]}).join('、')+
        '。此時預覽結果與匯入頁實際套出／匯出的結果不保證相同。</div>');
      /* 登入系統（brand.html 勾的會員入口）—— 這一區先前完全沒有，
         導致它壞了很久都沒被任何報告抓到。 */
      var mm=m.member||{};
      var okm=!!mm.injected;
      /* 規則生效帳：純量測，不動套用機制 */
      var rl=m.rules||{total:0,live:0,dead:0,byProp:{},samples:[]};
      if(rl.total){
        var judged=rl.live+rl.dead;
        var pct=judged?Math.round(rl.dead/judged*100):0;
        var tops=Object.keys(rl.byProp).sort(function(a,b){return rl.byProp[b]-rl.byProp[a]}).slice(0,6)
          .map(function(k){return k+'×'+rl.byProp[k]}).join('、');
        H.push('<b>樣式規則生效狀況</b>'+
          '<div style="background:'+(pct>=25?'#fff8f0':'#f6f8fb')+';border:1px solid '+(pct>=25?'#f0dcb0':'#e3e8f0')+
          ';border-radius:8px;padding:10px 12px;margin:6px 0 14px">'+
          '發出 <b>'+rl.total+'</b> 條　可判定 <b>'+(rl.live+rl.dead)+'</b> 條（生效 '+rl.live+
          '／未生效 <b style="color:'+(pct>=25?'#c0392b':'#62778f')+'">'+rl.dead+'</b>，'+pct+'%）'+
          '　無法判定 '+(rl.unknown||0)+' 條'+
          (tops?('<br><span style="color:var(--gray-2,#62778f)">未生效屬性：'+esc(tops)+'</span>'):'')+
          (rl.samples.length?('<br><span style="color:var(--gray-2,#62778f)">例：'+
            rl.samples.slice(0,4).map(function(x){
              return esc(x.el)+' {'+x.prop+':'+esc(x.want)+'} → 實際 '+esc(x.got)}).join('　｜　')+
            '</span>'):'')+
          '<br><span style="color:var(--gray-2,#62778f)">同一元素同一屬性被寫多次時只有最後一條生效，'+
          '前面的成為噪音。「無法判定」是 shorthand 被展開後量不準的（border-width:medium、'+
          'outline 複合值等），不列入分母。這裡只做量測，不改寫入機制。</span></div>');
      }
      H.push('<b>登入系統（會員入口）</b>'+
        '<div style="background:'+(okm?'#f1f9f2':'#fff8f0')+';border:1px solid '+(okm?'#cfe6d3':'#f0dcb0')+
        ';border-radius:8px;padding:10px 12px;margin:6px 0 14px">'+
        (okm
          ? ('✅ <b>已注入</b>　位置：'+(mm.inHd?'頁首內':'<b style="color:#c0392b">不在頁首內</b>')+
             '　按鈕文字：「'+esc(mm.text)+'」　下拉項目：'+mm.items+' 個<br>'+
             '底 '+mm.bg+'　字 '+mm.fg+'　對比 '+(mm.cr===null?'—':mm.cr+':1')+
             (mm.cr!==null&&mm.cr<4.5?' <b style="color:#c0392b">未達 4.5:1</b>':'')+
             (mm.rule?('<br><span style="color:var(--gray-2,#62778f)">規則歸屬：'+esc(mm.rule)+'</span>'):''))
          : ('⚠️ <b>未注入</b>（checklist：'+esc(mm.state)+'）<br>判定原因：'+esc(mm.why||'—')+
             '<br><span style="color:var(--gray-2,#62778f)">偵測到的頁首：'+esc(mm.hdSel)+
             '　頁首已有登入字樣：'+(mm.hdHasLogin?'是':'否')+'</span>')
        )+'</div>');
      H.push('<b>頁面自己的登入表單（'+m.login.length+' 列，按鈕判定異常 '+m.loginFlag+'）</b>');
      if(!m.login.length)H.push('<div style="color:var(--gray-2,#62778f);margin:4px 0 12px">'+
        '這份匯入檔沒有密碼欄或登入表單，未列帳。</div>');
      else H.push('<table style="border-collapse:collapse;width:100%;margin:6px 0 14px;font-size:11.5px">'+
        th(['元素','判定','寫樣式','版型區','底','字','對比','備註'])+
        m.login.map(function(r){return '<tr'+(r.flag?' style="background:#fff2f2"':'')+'>'+
          td('<code>'+esc(r.el)+'</code>')+td(r.kind||'—',1)+td(r.styled?'有':'無',1)+td(r.zone||'—',1)+
          td(r.bg,1)+td(r.fg+(r.brand?('<br><span style="color:#0088D2">'+r.brand+'</span>'):''),1)+
          td(r.cr===null?'—':r.cr,1)+td(esc(r.flag||''))+'</tr>'}).join('')+'</table>');
      H.push('<b>橫向選項卡候選（'+m.tabs.length+' 組，未接管 '+m.tabMiss+' 組）</b>'+
        '<div style="color:var(--gray-2,#62778f);margin:2px 0 6px">候選＝依 role／aria／狀態類／命名訊號推定，'+
        '不是期望值；「未接管」表示引擎沒有在這組打 <code>data-hl-opt</code>。</div>');
      if(!m.tabs.length)H.push('<div style="color:var(--gray-2,#62778f);margin-bottom:12px">沒有偵測到選項卡訊號。</div>');
      else H.push('<table style="border-collapse:collapse;width:100%;margin:6px 0 14px;font-size:11.5px">'+
        th(['容器','子項','訊號','首個子項','子項判定','版型區','接管'])+
        m.tabs.map(function(r){return '<tr'+(r.taken?'':' style="background:#fff2f2"')+'>'+
          td('<code>'+esc(r.el)+'</code>')+td(r.kids,1)+td(esc(r.why))+td('<code>'+esc(r.kid)+'</code>')+
          td((r.kidKind||'—')+(r.kidStyled?'／已寫樣式':''),1)+td(r.zone||'—',1)+
          td(r.taken?'✅':'❌ 未接管',1)+'</tr>'}).join('')+'</table>');
      if(m.invis.length)H.push('<b style="color:#c0392b">隱形字風險（對比 &lt; 3:1，'+m.invis.length+' 處）</b>'+
        '<ul style="margin:6px 0 12px">'+m.invis.slice(0,20).map(function(x){
          return '<li>'+esc(x.el)+' 對比 '+x.cr+':1（字 '+x.fg+'）</li>'}).join('')+'</ul>');
      body.innerHTML=H.join('');
      LAST=['套用比對監測 '+new Date().toLocaleString('zh-TW'),
        '套用引擎：'+(m.engine||'?'),
        '元素 '+s.total+'／已判定 '+s.kinded+'／已寫樣式 '+s.styled+'／選項卡標記 '+s.optd+
        '／未觸及 '+s.untouched+'／品牌色落點 '+s.land,
        ((m.rules&&m.rules.total)?('樣式規則：發出 '+m.rules.total+' 條／可判定 '+(m.rules.live+m.rules.dead)+
          '（生效 '+m.rules.live+'／未生效 '+m.rules.dead+'）／無法判定 '+(m.rules.unknown||0)):''),
        '登入系統：'+((m.member&&m.member.injected)?('已注入（'+(m.member.inHd?'頁首內':'不在頁首內')+
          '，對比 '+(m.member.cr===null?'—':m.member.cr+':1')+'）'):('未注入 — '+((m.member||{}).why||''))),
        '頁面自己的登入表單 '+m.login.length+' 列，按鈕判定異常 '+m.loginFlag,
        '選項卡候選 '+m.tabs.length+' 組，未接管 '+m.tabMiss+' 組',
        '隱形字 '+m.invis.length+' 處']
        .concat(m.tabs.map(function(r){return '  ['+(r.taken?'接管':'未接管')+'] '+r.el+' 子項'+r.kids+' 訊號:'+r.why}))
        .concat(m.login.map(function(r){return '  '+r.el+' 判定='+(r.kind||'—')+' 寫樣式='+(r.styled?'有':'無')+
          ' 底='+r.bg+' 字='+r.fg+(r.flag?(' ⚠'+r.flag):'')})).join('\n');
      g.__KM_LAST=LAST;g.__KM_JSON=JSON.stringify(m);
    }
    /* 【點擊後才量測】套用是非同步的（iframe 重繪、字型圖片還在載），
       載入當下就量會量到半成品；也不該在使用者還沒要比對時就自己跑。 */
    function done(){pending=false;run.textContent='重新比對量測';
      if(body.style.display==='none'){body.style.display='block';tg.textContent='收合'}}
    function measureSoon(){setTimeout(function(){measure();done()},900);
      setTimeout(function(){if(pending){measure();done()}},2400)}
    run.addEventListener('click',function(){
      pending=true;run.textContent='量測中…';sum.textContent='套用中，等待畫面穩定…';
      if(typeof opts.rerender==='function')opts.rerender();else measureSoon();
    });
    frame.addEventListener('load',function(){if(pending)measureSoon()});
    return {measure:measure,el:wrap};
  }
  g.KMPanel={mount:mount};
})(window);
