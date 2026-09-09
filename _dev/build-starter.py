# -*- coding: utf-8 -*-
"""starter 單一真相源：hanlin-web-starter/ 資料夾是唯一編寫處，zip 是產物。

   先前兩份各自演化：資料夾比 zip 新一天，index.html／styles.css／styleguide.html
   三個檔不同，使用者下載到的範例少了 AI 免責聲明，zip 裡還打包了 .bak 備份檔。
   規則定為「改資料夾 → 重跑本腳本產 zip」，跟 build-engine.py／build-kits.py 一致。

     python3 _dev/build-starter.py          重新打包
     python3 _dev/build-starter.py --check  只檢查 zip 是否落後（CI 用）
"""
import os, sys, zipfile, hashlib

_here = os.path.dirname(os.path.abspath(__file__))
os.chdir(_here if os.path.exists(os.path.join(_here, 'hanlin-web-starter'))
         else os.path.dirname(_here))

SRC, OUT = 'hanlin-web-starter', 'hanlin-web-starter.zip'
# .bak 是版本控制該做的事，不該跟著發佈出去
SKIP_SUFFIX = ('.bak', '.DS_Store')
SKIP_CONTAINS = ('.bak-',)

def wanted(name):
    if name.endswith(SKIP_SUFFIX): return False
    return not any(s in name for s in SKIP_CONTAINS)

def files():
    out = []
    for root, _, fs in os.walk(SRC):
        for f in sorted(fs):
            rel = os.path.relpath(os.path.join(root, f), '.')
            if wanted(rel): out.append(rel)
    return sorted(out)

def digest(paths):
    h = hashlib.sha1()
    for p in paths:
        h.update(p.encode('utf-8'))
        h.update(open(p, 'rb').read())
    return h.hexdigest()[:12]

paths = files()
sha = digest(paths)

if '--check' in sys.argv:
    if not os.path.exists(OUT):
        print('zip 不存在，請重跑不帶 --check'); sys.exit(1)
    with zipfile.ZipFile(OUT) as z:
        inzip = sorted(n for n in z.namelist() if not n.endswith('/'))
        stale = [n for n in inzip if not wanted(n)]
        same = (inzip == paths)
        if same and not stale:
            for p in paths:
                if z.read(p) != open(p, 'rb').read(): same = False; break
    if same and not stale:
        print('zip 與資料夾同步（%s，%d 檔）' % (sha, len(paths))); sys.exit(0)
    if stale: print('zip 裡有不該發佈的檔案：' + '、'.join(stale))
    print('zip 落後於資料夾，請重跑 python3 _dev/build-starter.py'); sys.exit(1)

with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    for p in paths: z.write(p, p)
print('已重新打包 %s（%s，%d 檔）' % (OUT, sha, len(paths)))
for p in paths: print('   ' + p)
