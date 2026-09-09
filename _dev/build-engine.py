# -*- coding: utf-8 -*-
"""引擎單一真相源：把 import.html 的套用引擎原封不動抽成 engine.js。
   import.html 仍是唯一的「編寫處」，engine.js 是產物；preview.html 只消費產物，
   不再自帶第二份引擎——先前兩份不同版，同一批樣本 27/27 份數字全不一致。
   本腳本不改任何演算法，只搬運與掛載。
     python3 build-engine.py          產生 engine.js
     python3 build-engine.py --check  只檢查 engine.js 是否落後於 import.html（CI 用）"""
import extract, hashlib, os, sys
# 腳本已歸檔到 _dev/，但來源與產物都在專案根，所以往上一層執行
_here = os.path.dirname(os.path.abspath(__file__))
os.chdir(_here if os.path.exists(os.path.join(_here, 'import.html')) else os.path.dirname(_here))
sys.path.insert(0, _here)

code = extract.engine('import.html')
sha  = hashlib.sha1(code.encode('utf-8')).hexdigest()[:12]
# IIFE 包起來避免污染全域；只把入口掛到 window.HL_ENGINE，
# 消費端一律透過 HL_ENGINE 取用，取不到就代表產物沒載入（面板會報出來）。
OUT = ("/* 自動產生，請勿手改。來源：import.html／產生器：build-engine.py\n"
       "   指紋 %s */\n(function(g){\n%s\n"
       # classifyEl／markKinds／precisifySelectors／writeStyle 在 import.html 裡
       # 本來就巢狀定義在 brandifyHtml 內（實測大括號深度 2），不是頂層函式，
       # 匯不出來也不該匯 —— 引擎一致性改看 version 指紋，不要探測這些名字。
       "g.HL_ENGINE={version:'%s',brandifyHtml:brandifyHtml,toneFor:toneFor};\n"
       "})(window);\n") % (sha, code, sha)

if '--check' in sys.argv:
    cur = open('engine.js', encoding='utf-8').read() if os.path.exists('engine.js') else ''
    ok = (cur == OUT)
    print(('engine.js 與 import.html 同步（%s）' % sha) if ok
          else 'engine.js 落後於 import.html，請重跑 build-engine.py')
    sys.exit(0 if ok else 1)

open('engine.js', 'w', encoding='utf-8').write(OUT)
print('engine.js 已產生 %d 位元組，指紋 %s' % (len(OUT), sha))

# 消費端的破快取版本號一起改掉。少了這一步，engine.js 內容換了但網址沒換，
# 瀏覽器會繼續拿快取裡的舊引擎 —— 實測代價：header 對齊的修正做完了，
# 使用者重新整理預覽頁看到的仍是舊版，看起來就像「根本沒修」。(2026-09-03)
import re as _re, glob as _glob
# 清單不可寫死（與 build-kits.py 同一個坑）：任何 <script src="engine.js?v=…"> 都要同步
for _f in sorted(os.path.basename(_x) for _x in _glob.glob('*.html')):
    try:
        _s = open(_f, encoding='utf-8').read()
        # 錨在行首的 <script> 標籤：不然連 JS 字串裡的說明文字
        # （'請確認 <script src="engine.js"> 有載到'）都會被改，每次建置都製造雜訊。
        # 連「完全沒有 ?v」的引用也要補上：selfcheck.html 原本寫 src="engine.js"，
        # 舊的正則只認 engine.js?v=<hex>，於是那一頁永遠吃瀏覽器快取裡的舊引擎。
        _n = _re.sub(r'(?m)^(?P<pre>\s*<script )src="engine\.js(?:\?v=[0-9a-zA-Z]+)?"',
                     lambda m: m.group('pre') + 'src="engine.js?v=%s"' % sha, _s)
        if _n != _s:
            open(_f, 'w', encoding='utf-8').write(_n)
            print('%s 的 engine.js 破快取版本已同步為 %s' % (_f, sha))
    except FileNotFoundError:
        pass
