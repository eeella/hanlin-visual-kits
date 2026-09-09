# -*- coding: utf-8 -*-
"""手寫資產的破快取版本號同步。

   kits.js／engine.js 是產物，各自的 build 腳本會把 `?v=指紋` 寫回消費端；
   defaults.js 是手寫的，沒有任何腳本負責它 —— 於是 2026-09-09 改完
   DEFAULT_ADOPT 的 bug 之後，六個頁面仍然指向 `defaults.js?v=d0777c2d097c`
   （實際內容已是 16974f4afe52）。瀏覽器繼續拿快取裡的舊檔，
   「選了 A 卻變翰林藍」那個修正在使用者機器上等於沒發生。

     python3 build-bust.py          同步版本號
     python3 build-bust.py --check  只檢查是否過期（CI 用）
"""
import glob, hashlib, os, re, sys

ASSETS = ('defaults.js',)          # 手寫、無產生器的資產

_here = os.path.dirname(os.path.abspath(__file__))
os.chdir(_here if os.path.exists(os.path.join(_here, 'index.html')) else os.path.dirname(_here))

check = '--check' in sys.argv
stale, changed = [], []
for asset in ASSETS:
    if not os.path.exists(asset):
        continue
    sha = hashlib.sha1(open(asset, 'rb').read()).hexdigest()[:12]
    # 也認「完全沒有 ?v」的引用，否則那種頁面永遠停在快取裡的舊檔
    # 錨在行首的 <script> 標籤，避免改到 JS 字串裡的說明文字
    pat = re.compile(r'(?m)^(\s*<script )src="' + re.escape(asset)
                     + r'(?:\?v=([0-9a-zA-Z]+))?"')
    for f in sorted(os.path.basename(x) for x in glob.glob('*.html')):
        s = open(f, encoding='utf-8').read()
        hits = [m[1] for m in pat.findall(s)]
        if not hits:
            continue
        if all(h == sha for h in hits):
            continue
        if check:
            stale.append('%s → %s?v=%s（應為 %s）' % (f, asset, hits[0] or '（無）', sha))
        else:
            open(f, 'w', encoding='utf-8').write(
                pat.sub(lambda m: m.group(1) + 'src="%s?v=%s"' % (asset, sha), s))
            changed.append('%s：%s?v=%s → %s' % (f, asset, hits[0] or '（無）', sha))

if check:
    if stale:
        print('破快取版本號過期：')
        for x in stale:
            print('  ' + x)
        sys.exit(1)
    print('手寫資產的破快取版本號都是最新的')
    sys.exit(0)

for x in changed:
    print(x)
print('完成，共同步 %d 處' % len(changed))
