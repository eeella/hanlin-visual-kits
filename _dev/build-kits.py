# -*- coding: utf-8 -*-
"""風格色版單一真相源：把 template.html 的 var PALETTES 原封不動抽成 kits.js。

   template.html 仍是唯一的「編寫處」，kits.js 是產物；index.html／template.html
   只消費產物，不自己再存一份。作法與 build-engine.py（import.html → engine.js）一致——
   Master/data.js 與 brand.html 各存一份、改了不同步，就是這樣才出問題的。

     python3 build-kits.py          產生 kits.js
     python3 build-kits.py --check  只檢查 kits.js 是否落後於 brand.html（CI 用）
"""
import hashlib, os, re, sys

# 腳本已歸檔到 _dev/，但來源與產物都在專案根，所以往上一層執行
_here = os.path.dirname(os.path.abspath(__file__))
os.chdir(_here if os.path.exists(os.path.join(_here, 'template.html')) else os.path.dirname(_here))

SRC = 'template.html'
OUTFILE = 'kits.js'

html = open(SRC, encoding='utf-8').read()
head = '  var PALETTES=['
i = html.index(head)
j = html.index('\n  ];', i)
body = html[i + len(head):j]

# template.html?kit= 要一個英文代號。brand.html 那份沒有 id 欄位，
# 這裡依中文名補上；名字對不上就用 en 欄位轉小寫當備援，再不行就用序號。
IDS = {
    '翰林學習藍': 'hanlin', '清新小森林': 'musical', '漫畫貼紙風': 'istockapp',
    '復古文青風': 'navy', '多巴胺潮風': 'dopamine',
    '摩洛哥風情': 'moroccan', '午夜金融藍': 'dawho',
    '芥黃刊物': 'mustard', '墨綠聖誕': 'pine', '撞色旅途': 'clash',
    '酪梨青檸': 'avocado', '林蔭野趣': 'trail', '藍夜霓虹': 'neon',
    '學堂紫': 'douclass', '公務金黃': 'gov',
}
# 列表頁的分類篩選用。與 id 同理：brand.html 那份沒有這個欄位，
# 它是「列表怎麼分堆」的展示需求，不是色版本身的規範值，所以補在產生器這裡。
CATS = {
    '翰林學習藍': '專業', '清新小森林': '自然', '漫畫貼紙風': '活潑',
    '復古文青風': '人文', '多巴胺潮風': '潮流',
    '摩洛哥風情': '人文', '午夜金融藍': '科技',
    '芥黃刊物': '人文', '墨綠聖誕': '人文', '撞色旅途': '活潑',
    '酪梨青檸': '自然', '林蔭野趣': '自然', '藍夜霓虹': '潮流',
    '學堂紫': '專業', '公務金黃': '專業',
}
_seq = [0]


def _addid(m):
    name = m.group(1)
    kid = IDS.get(name)
    if not kid:
        _seq[0] += 1
        kid = 'kit%d' % _seq[0]
    return "{id:'%s',cat:'%s',n:'%s'" % (kid, CATS.get(name, '其他'), name)


body_out, n = re.subn(r"\{n:'([^']+)'", _addid, body)
sha = hashlib.sha1(body_out.encode('utf-8')).hexdigest()[:12]

OUT = ("""/* 自動產生，請勿手改。來源：template.html 的 var PALETTES／產生器：build-kits.py
   指紋 %s　共 %d 組

   為什麼要有這個檔：index.html（套版列表）與 template.html（套版詳細）也要用同一份風格資料。
   若各自存一份，就會重演「兩邊各存一份、改了不同步」的問題。
   要改風格色版，改 template.html 裡的 var PALETTES，然後重跑 build-kits.py。

   欄位：
     id          英文代號，template.html?kit= 用（由產生器依中文名補上）
     cat         列表頁分類篩選用的分堆（同樣由產生器補上）
     n/en/src    中文名／英文名／來源規範文件
     bg/ln/mu/ink  頁面底色／分隔線／次要文字／主要文字
     tk/tkEn     四個主色的中文名與其來源 token 名
     rd[3]       圓角：按鈕chip輸入框／卡片／大區塊
     sh[2]       陰影：一般／大
     bd          元件邊線（null＝無邊線）
     ex          裝飾色 [[名稱,色碼],…]
     btn         風格色版按鈕的底色
     p/s/i/c     主色／輔色／亮色／對比色
     d           這一組的說明 */
window.HL_KITS=[%s
];
window.HL_KITS_VERSION='%s';
""") % (sha, n, body_out, sha)

if '--check' in sys.argv:
    cur = open(OUTFILE, encoding='utf-8').read() if os.path.exists(OUTFILE) else ''
    ok = (cur == OUT)
    print(('kits.js 與 template.html 同步（%s，%d 組）' % (sha, n)) if ok
          else 'kits.js 落後於 template.html，請重跑 build-kits.py')
    sys.exit(0 if ok else 1)

open(OUTFILE, 'w', encoding='utf-8').write(OUT)
print('kits.js 已產生 %d 位元組，%d 組，指紋 %s' % (len(OUT), n, sha))

# 消費端的破快取版本號一起改掉，避免「改了但看到的是舊的」
# 【清單不可寫死】(2026-09-09 實測)
#   原本只列 index／templates／template／demo，但 import.html、ai.html、brand.html
#   也都 <script src="kits.js?v=…">。它們沒被同步，於是 kits.js 換成 cd67361477e4 之後
#   這三頁仍然指向 39caefe7862e —— 瀏覽器繼續吃快取裡的舊色盤，
#   看起來就是「改了配色但匯入頁沒變」。改成掃專案根目錄所有 .html。
import glob
for f in sorted(os.path.basename(x) for x in glob.glob('*.html')):
    try:
        s = open(f, encoding='utf-8').read()
        # 錨在行首的 <script> 標籤：不然連 JS 字串裡的說明文字
        # （'請確認 <script src="kits.js"> 有載到'）都會被改，每次建置都製造雜訊。
        # 連「完全沒有 ?v」的引用也要補上（selfcheck.html 就是）
        t = re.sub(r'(?m)^(?P<pre>\s*<script )src="kits\.js(?:\?v=[0-9a-zA-Z]+)?"', lambda m: m.group('pre') + 'src="kits.js?v=%s"' % sha, s)
        if t != s:
            open(f, 'w', encoding='utf-8').write(t)
            print('%s 的 kits.js 破快取版本已同步為 %s' % (f, sha))
    except FileNotFoundError:
        pass
