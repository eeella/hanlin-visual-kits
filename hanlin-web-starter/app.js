/* ============================================================
   翰林相信學習 — 基本互動
   對應規範：STYLEGUIDE.md §3.3 Chip、§3.5 Accordion、§3.2 Field、§4 無障礙
   純原生 JS，沒有相依套件。
   ============================================================ */
(function () {
  'use strict';

  /* ── §3.3 Chip 篩選 ────────────────────────────────────
     群組以 role="tablist" 標記，左右方向鍵在群組內循環移動焦點。
     篩選結果變化以 aria-live="polite" 播報數量。 */
  document.querySelectorAll('[data-chip-group]').forEach(function (group) {
    var chips = Array.prototype.slice.call(group.querySelectorAll('.chip'));
    var liveRegion = document.querySelector(group.dataset.chipGroup);

    function select(chip) {
      chips.forEach(function (c) {
        var on = c === chip;
        c.setAttribute('aria-selected', String(on));
        c.tabIndex = on ? 0 : -1;              // roving tabindex
      });
      if (liveRegion) {
        var label = chip.textContent.trim();
        var count = chip.dataset.count || '0';
        liveRegion.textContent = '已篩選「' + label + '」，共 ' + count + ' 筆結果。';
      }
    }

    chips.forEach(function (chip, i) {
      chip.tabIndex = chip.getAttribute('aria-selected') === 'true' ? 0 : -1;
      chip.addEventListener('click', function () { select(chip); });
      chip.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = chips[(i + 1) % chips.length];
        else if (e.key === 'ArrowLeft') next = chips[(i - 1 + chips.length) % chips.length];
        else if (e.key === 'Home') next = chips[0];
        else if (e.key === 'End') next = chips[chips.length - 1];
        if (!next) return;
        e.preventDefault();
        next.focus();
        select(next);
      });
    });
  });

  /* ── §3.5 Accordion ────────────────────────────────────
     面板以 hidden 收合並移出無障礙樹，收合內容不得仍可被 Tab 聚焦。
     data-single="true" 時一次只展開一項。 */
  document.querySelectorAll('.accordion').forEach(function (acc) {
    var triggers = Array.prototype.slice.call(acc.querySelectorAll('.accordion__trigger'));
    var single = acc.dataset.single === 'true';

    function setOpen(trigger, open) {
      trigger.setAttribute('aria-expanded', String(open));
      document.getElementById(trigger.getAttribute('aria-controls')).hidden = !open;
    }

    triggers.forEach(function (trigger, i) {
      trigger.addEventListener('click', function () {
        var open = trigger.getAttribute('aria-expanded') !== 'true';
        if (single && open) triggers.forEach(function (t) { setOpen(t, false); });
        setOpen(trigger, open);
      });

      trigger.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown') next = triggers[(i + 1) % triggers.length];
        else if (e.key === 'ArrowUp') next = triggers[(i - 1 + triggers.length) % triggers.length];
        else if (e.key === 'Home') next = triggers[0];
        else if (e.key === 'End') next = triggers[triggers.length - 1];
        if (!next) return;
        e.preventDefault();
        next.focus();
      });
    });
  });

  /* ── 回到頂端 ──────────────────────────────────────────
     捲過一個視窗高度才彈出。收起時用 hidden 移出無障礙樹與 Tab 順序（§4），
     hidden 沒有 display 可以過渡，所以先拿掉 hidden、下一幀再加 .is-in 觸發彈出。 */
  var toTop = document.querySelector('[data-to-top]');
  if (toTop) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var shown = false;

    function sync() {
      var want = window.pageYOffset > window.innerHeight * 0.6;
      if (want === shown) return;
      shown = want;
      if (want) {
        toTop.hidden = false;
        // 先繪一幀起始狀態，再加 class，否則瀏覽器會合併成沒有過渡的一次跳變
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () { toTop.classList.add('is-in'); });
        });
      } else {
        toTop.classList.remove('is-in');
        if (reduced.matches) {
          toTop.hidden = true;
        } else {
          window.setTimeout(function () { if (!shown) toTop.hidden = true; }, 320);
        }
      }
    }

    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
      // 捲回頂端後把焦點交還給頁面開頭，鍵盤使用者才不會卡在消失的按鈕上
      var first = document.querySelector('.skip-link');
      if (first) first.focus({ preventScroll: true });
    });
  }

  /* ── §3.2 表單驗證 ─────────────────────────────────────
     錯誤同時以顏色、文字與 aria-invalid 表達，不得只用顏色。
     訊息說明原因與修正方式；使用者開始修正後即時清除。
     §5 文案：動作標籤與結果必須一致（按「訂閱」後回報「訂閱成功」）。 */
  var form = document.querySelector('[data-subscribe-form]');
  if (form) {
    var input = form.querySelector('.input');
    var errorText = form.querySelector('.error-text');
    var result = form.querySelector('[data-form-result]');
    var submit = form.querySelector('.btn');

    function clearError() {
      input.setAttribute('aria-invalid', 'false');
      errorText.textContent = '';
    }

    function showError(message) {
      input.setAttribute('aria-invalid', 'true');
      errorText.textContent = message;
      result.textContent = '';
      result.className = 'alert';
      result.hidden = true;
      input.focus();
    }

    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') clearError();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = input.value.trim();

      if (!value) {
        showError('請輸入信箱，我們會把每月的教學資源整理寄給你。');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showError('信箱格式不正確，請確認是否包含 @ 與網域。');
        return;
      }

      clearError();

      // loading：label 以 visibility 保留寬度，版面不得位移
      submit.dataset.loading = 'true';
      submit.setAttribute('aria-busy', 'true');

      window.setTimeout(function () {
        delete submit.dataset.loading;
        submit.removeAttribute('aria-busy');
        result.hidden = false;
        result.className = 'alert alert--success';
        result.textContent = '訂閱成功，確認信已寄至 ' + value + '。';
        form.reset();
      }, 600);
    });
  }
})();
