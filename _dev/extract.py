"""從 import.html 可靠抽出引擎程式碼(忽略字串內的大括號)"""
import re,os
def _blocks(src):
    """回傳 {函式名: 程式碼} """
    out={};i=0;n=len(src)
    while i<n:
        m=re.compile(r'\n(\s*)function\s+(\w+)\s*\(').search(src,i)
        if not m:break
        name=m.group(2);start=m.start()+1
        j=src.index('{',m.end()-1)
        depth=0;k=j;instr=None;esc=False
        while k<n:
            ch=src[k]
            if instr:
                if esc:esc=False
                elif ch=='\\':esc=True
                elif ch==instr:instr=None
            else:
                if ch in '"\'':instr=ch
                elif ch=='{':depth+=1
                elif ch=='}':
                    depth-=1
                    if depth==0:break
                elif ch=='/':
                    nx=src[k+1] if k+1<n else ''
                    if nx=='/':
                        p=src.find('\n',k); k=(p if p>0 else n)-1
                    elif nx=='*':
                        e=src.find('*/',k+2); k=(e+1) if e>0 else n
                    else:
                        # 判斷是否為正則字面量(前一個非空白字元屬於運算子/開頭)
                        t=k-1
                        while t>=0 and src[t] in ' \t':t-=1
                        prev=src[t] if t>=0 else '('
                        if prev in '(,=:[!&|?{};\n+':
                            e=k+1;esc2=False;incls=False
                            while e<n:
                                c2=src[e]
                                if esc2:esc2=False
                                elif c2=='\\':esc2=True
                                elif c2=='[':incls=True
                                elif c2==']':incls=False
                                elif c2=='/' and not incls:break
                                elif c2=='\n':break
                                e+=1
                            k=e
            k+=1
        out[name]=src[start:k+1]
        i=k+1
    return out
def _stmt_end(src,k):
    """從宣告的 '=' 之後往後走，回傳這條 var 語句的結尾索引。
       原本的做法是「只收縮排恰為 2 的**單行** var 宣告」，於是
       `var DEFAULT={` 這種跨多行的物件只被收走第一行，抽出來的檔案
       在 `var DEFAULT={` 之後直接接下一條宣告 —— 整份腳本語法錯誤，
       瀏覽器連 brandifyHtml 都不會定義（實測 preview.html 就是這樣
       28 份樣本全報 'brandifyHtml is not defined'）。
       這裡改成括號配對掃描：{} [] () 深度歸零時遇到 ; 或換行才算結束，
       字串／樣板字串／註解／正則字面量裡的括號與分號一律不計。"""
    n=len(src);depth=0;instr=None;esc=False
    while k<n:
        ch=src[k]
        if instr:
            if esc:esc=False
            elif ch=='\\':esc=True
            elif ch==instr:instr=None
        else:
            if ch in '"\'`':instr=ch
            elif ch in '([{':depth+=1
            elif ch in ')]}':depth-=1
            elif ch==';' and depth<=0:return k+1
            elif ch=='\n' and depth<=0:return k
            elif ch=='/':
                nx=src[k+1] if k+1<n else ''
                if nx=='/':
                    p2=src.find('\n',k);k=(p2 if p2>0 else n)-1
                elif nx=='*':
                    e=src.find('*/',k+2);k=(e+1) if e>0 else n
                else:
                    # 正則字面量：看前一個非空白字元是不是運算子／開頭
                    t=k-1
                    while t>=0 and src[t] in ' \t':t-=1
                    prev=src[t] if t>=0 else '('
                    if prev in '(,=:[!&|?{};\n+':
                        e=k+1;esc2=False;incls=False
                        while e<n:
                            c2=src[e]
                            if esc2:esc2=False
                            elif c2=='\\':esc2=True
                            elif c2=='[':incls=True
                            elif c2==']':incls=False
                            elif c2=='/' and not incls:break
                            elif c2=='\n':break
                            e+=1
                        k=e
        k+=1
    return n

def _topvars(src):
    """收「縮排恰為 2」的頂層 var 宣告，單行與多行都收。
       回傳 {名稱: 完整宣告文字}，順序即原始檔出現順序。"""
    out={}
    for m in re.finditer(r'\n  var\s+([A-Za-z_$][\w$]*)\s*=',src):
        name=m.group(1)
        if name in out:continue                      # 同名以第一次出現為準
        text=src[m.start()+1:_stmt_end(src,m.end())].rstrip()
        if not text.endswith(';'):text+=';'
        out[name]=text
    return out

def engine(path='import.html',with_audit=False):
    src=open(path,encoding='utf-8').read()
    b=_blocks(src)
    # 從入口函式出發遞迴收集依賴,不再手工維護清單——
    # 手工清單每漏一個(actOf、isGrayish、sgLum2…)測試頁就是一句 ReferenceError,
    # 而且要一輪一輪才會露出下一個缺的。
    seeds=['toneFor','brandifyHtml']+(['auditBranded'] if with_audit else [])
    need,seen,stack=[],set(),list(seeds)
    while stack:
        nm=stack.pop()
        if nm in seen or nm not in b:continue
        seen.add(nm);need.append(nm)
        # 不能只找「識別字後面接 (」的呼叫形式:hx2 是被當值傳進 .map(hx2),
        # 那樣會漏掉。掃全部識別字,多帶到幾個沒被用到的函式也無害。
        for ident in set(re.findall(r'\b([A-Za-z_$][\w$]*)\b',b[nm])):
            if ident in b and ident not in seen:stack.append(ident)
    # function 宣告會提升,順序不影響;照原始檔出現順序輸出比較好讀
    order={nm:src.index('function '+nm) for nm in need if ('function '+nm) in src}
    parts=[b[nm] for nm in sorted(need,key=lambda x:order.get(x,0))]
    # 頂層常數也要自動帶：手工只列了 NEUTRAL_SAT,漏掉 HANLIN 就是一句
    # ReferenceError 把整個測試頁打掛(和先前漏 actOf / sgLum2 同一類問題)。
    # 只收「縮排恰為 2 的單行 var 宣告」,且排除依賴 DOM 的(那些在測試環境取不到)。
    lines=src.split('\n')
    # 多行宣告一併收（_topvars 做括號配對），不再只收單行
    consts={}
    for _nm,_tx in _topvars(src).items():
        if _nm in ('LOGO_DATA','LOGO_MARK_DATA'):continue   # 下面單獨輸出
        # 依賴 DOM 的宣告在離線測試環境取不到值，沿用原本的排除政策
        if re.search(r'\bdocument\b|\bwindow\b|localStorage|sessionStorage|getElementById|querySelector',_tx):continue
        consts[_nm]=_tx
    # 只帶被實際引用到的常數(常數之間也可能互相引用,做到收斂為止)
    usedc,changed=set(),True
    while changed:
        changed=False
        pool=''.join(b[nm] for nm in need)+''.join(consts[c] for c in usedc)
        for cname in consts:
            if cname in usedc:continue
            if re.search(r'\b'+re.escape(cname)+r'\b',pool):
                usedc.add(cname);changed=True
    parts=[consts[c] for c in sorted(usedc,key=lambda x:src.index('var '+x))]+parts
    logo=[l for l in lines if l.strip().startswith('var LOGO_DATA=')][0].strip()
    mark=[l for l in lines if l.strip().startswith('var LOGO_MARK_DATA=')][0].strip()
    return logo+'\n'+mark+'\n'+'\n'.join(parts)
if __name__=='__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    e=engine()
    open('/tmp/_eng.js','w',encoding='utf-8').write(e)
    print('抽出長度',len(e),'含 brandifyHtml:', 'function brandifyHtml' in e)
