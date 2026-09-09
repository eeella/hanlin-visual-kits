#!/bin/bash
# 全站驗收:重建測試頁 → 跑完所有測試 → 輸出總表
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
python3 build-tests.py >/dev/null || { echo "建置測試頁失敗"; exit 1; }
# user-suite 為手動維護的測試頁，這裡把最新引擎重新注入
python3 build-edcafe.py >/dev/null || { echo "建置 edcafe-suite 失敗"; exit 1; }
python3 - <<'EOF' >/dev/null || { echo "同步 user-suite 引擎失敗"; exit 1; }
import extract,re
t=open('user-suite.html',encoding='utf-8').read()
i1=t.index('var LOGO_DATA=');m=re.search(r'\nfunction setT\(',t[i1:])
open('user-suite.html','w',encoding='utf-8').write(t[:i1]+extract.engine('import.html')+t[i1+m.start():])
EOF
fail=0
# ── 驗收報告：檔名自我描述，事後可稽核 ──────────────────────────────
# 先前輸出寫在暫存檔、檔名隨手取（bi1.out／bi.base.out），
# 檔名本身不帶任何資訊，事後無從判斷「這是哪一組、跑的是哪一版、什麼時候、結果如何」，
# 導致結果的可信度只能靠人背書。改成以下格式，一看檔名就知道全部四件事：
#
#   <測試組>__<git短碼>[-dirty]__<YYYYMMDD-HHMMSS>__<結果>.html
#   例：btn-imp-test__d47ce2a__20260827-160930__BTNIMP-0-FAIL.html
#
# -dirty 表示當時工作區有未提交的改動，該次結果無法對應到任何 commit。
REPORT_DIR="reports"
mkdir -p "$REPORT_DIR"
GITREF=$(git rev-parse --short HEAD 2>/dev/null || echo "nogit")
[ -n "$(git status --porcelain 2>/dev/null)" ] && GITREF="${GITREF}-dirty"
RUNSTAMP=$(date +%Y%m%d-%H%M%S)
echo "報告目錄=$REPORT_DIR  版本=$GITREF  時間=$RUNSTAMP"
run(){ # $1=檔名 $2=需要 file 存取
  # 每組測試用獨立的臨時 profile：不指定 --user-data-dir 時所有測試共用同一個 Chrome
  # 預設 profile，file:// 下同源，前一組留下的 hanlin-* localStorage 會污染下一組
  # （edcafe-suite 單獨跑全過、排在 user-suite 後面卻 9 FAIL 就是這樣來的）。
  local prof; prof=$(mktemp -d)
  local flags="--headless=new --disable-gpu --user-data-dir=$prof --virtual-time-budget=200000 --dump-dom"
  [ "$2" = "file" ] && flags="--headless=new --disable-gpu --user-data-dir=$prof --allow-file-access-from-files --virtual-time-budget=90000 --dump-dom"
  # Chrome 151 起 --dump-dom 會把 DOM 寫完卻不結束進程，用 $(...) 命令替換會一直等
  # stdout 關閉而永遠卡住（測試其實早就跑完了）。改成寫入暫存檔、輪詢 <title> 出現後
  # 自己收掉進程。macOS 沒有 timeout 指令，睡眠用 perl select。
  local tmp; tmp=$(mktemp)
  "$CHROME" $flags "file://$PWD/$1.html" >"$tmp" 2>/dev/null &
  local pid=$!
  local out="" i=0
  while [ $i -lt 300 ]; do
    out=$(grep -oE '<title>[A-Z0-9-]+</title>' "$tmp" 2>/dev/null | head -1 | sed 's|</*title>||g')
    [ -n "$out" ] && break
    ps -p $pid >/dev/null 2>&1 || break        # 進程真的結束了就不必再等
    perl -e 'select(undef,undef,undef,1)'
    i=$((i+1))
  done
  kill -9 $pid 2>/dev/null
  wait $pid 2>/dev/null
  local tmp2="$tmp"
  [ -z "$out" ] && out="無回應"
  local n=$(echo "$out" | grep -oE '\-[0-9]+\-' | tr -d '-')
  rm -rf "$prof"
  # 保留自我描述檔名的報告：測試組＋版本＋時間＋結果，全部寫在檔名裡
  cp "$tmp2" "$REPORT_DIR/$1__${GITREF}__${RUNSTAMP}__${out}.html" 2>/dev/null
  rm -f "$tmp2"
  if [ -z "$n" ] || [ "$n" != "0" ]; then fail=$((fail+1)); echo "❌ $1 → $out"; else echo "✅ $1 → $out"; fi
}
echo "=== 引擎與套用 ==="
run spec-table
run engine-suite
run variant-suite
run audit-suite
echo "=== 全站頁面與流程 ==="
run force2-suite
run semantic-suite
run deep-suite
run framework-suite
run authoring-suite
run component-suite
run coverage-suite
run match-suite file
run hero-fm-suite file
run force-suite file
run import-suite file
# 版型決策單一真相源：8 種 hero×fm×opt 組合逐一實際渲染量測，
# 外加「設定缺鍵」與「設定雙重編碼」兩個真實失效情境，以及 F5 保存。
run vspec-suite file
# 特徵指紋偵測：亂數命名（CSS-in-JS 風格）的選項卡與橫幅要抓得到，
# 且導覽列（水平並排＋一個 active）不得被誤判成選項卡。
run fuzz-test file
# 進匯入頁的乾淨狀態：新工作階段不得自動還原上次匯入的檔案，
# 但採用設定（永久保存）不受影響。
run fresh-test file
# 使用者真實檔案（samples/user-cloudec.html）的橫幅與佈局：
# 原檔已有主視覺設計時不得洗成淺底／不得補預留位／欄數須與原檔一致／須有列印防線。
run hero-real-test file
# 使用者真實檔案②（samples/user-cloudec2.html，自帶 349 個 !important）：
# 原檔的 !important 也必須蓋得掉——setS 一律以 setProperty(...,'important') 寫在元素上。
run btn-imp-test file
run check-test file
run async-test file
run sg-js-import file   # JS / JSX 匯入（theme.js、tailwind.config.js、React 元件）
run file-suite file
run chain-suite file
run req-test file
run session-test file
run e2e-test file
echo "=== 使用者真實檔案 ==="
run user-suite
run edcafe-suite
echo "==============================="
[ $fail -eq 0 ] && echo "全站驗收通過（0 失敗）" || echo "未通過：$fail 組"
exit $fail
