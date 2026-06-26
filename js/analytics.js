/* ===================================================
   旅する日本図鑑 — GA4 イベント計測
   測定ID: G-V8ZM6F6F34
=================================================== */
(function () {
  'use strict';

  function send(eventName, params) {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, params || {});
  }

  /* ---------- クリック委譲（アフィリエイト・ページ遷移系） ---------- */
  document.addEventListener('click', function (e) {
    var target = e.target.closest('a, button');
    if (!target) return;
    var href = target.getAttribute('href') || target.getAttribute('data-href') || '';
    var text = (target.textContent || '').trim().slice(0, 80);

    // アフィリエイトリンク（楽天・A8・もしもなど）
    if (/a\.r10\.to|rakuten\.co\.jp|af\.moshimo|affiliate-b\.com|px\.a8\.net|ck\.jp\.ap\.valuecommerce|click\.linksynergy/.test(href)) {
      send('affiliate_click', {
        link_text: text,
        link_domain: href.split('/')[2] || ''
      });
    }

    // 予約クリック（booking.htmlへのリンク、または外部予約サイト）
    if (/booking\.html|jalan\.net|ikyu\.com|travel\.yahoo\.co\.jp|travel\.rakuten/.test(href)) {
      send('booking_click', {
        link_text: text,
        link_url: href.slice(0, 150)
      });
    }

    // 都道府県ページへのクリック
    if (/prefecture\.html|prefectures\//.test(href)) {
      var prefId = '';
      try { prefId = new URL(href, location.href).searchParams.get('id') || href; } catch (ex) {}
      send('prefecture_click', { prefecture_id: prefId, link_text: text });
    }

    // 温泉ページへのクリック
    if (/onsen\.html/.test(href)) {
      send('onsen_click', { link_text: text });
    }

    // 目的別ページへのクリック
    if (/purpose\.html/.test(href)) {
      send('purpose_click', { link_text: text });
    }
  }, true); // useCapture: true でアフィリエイトリンクが新タブでも確実に取れる

  /* ---------- 旅ノア: パネル開閉 ---------- */
  function attachNoaOpen(selector) {
    var els = document.querySelectorAll(selector);
    els.forEach(function (el) {
      el.addEventListener('click', function () {
        send('noa_open', { trigger: selector });
      });
    });
  }
  // フローティングボタン・ヘッダーCTA・ヒーローCTA
  attachNoaOpen('#noa-float-btn');
  attachNoaOpen('#fh-open-noa');
  attachNoaOpen('#hero-noa-cta-btn');
  attachNoaOpen('#explore-noa-btn');

  /* ---------- 旅ノア: チャット内クリック ---------- */
  var chatPanel = document.getElementById('noa-fp-messages');
  if (chatPanel) {
    chatPanel.addEventListener('click', function (e) {
      var btn = e.target.closest('.chat-suggest-btn');
      if (!btn) return;
      var label = (btn.textContent || '').trim().slice(0, 80);
      if (btn.classList.contains('chat-suggest-btn--link')) {
        // ページ遷移ボタン（金色）→ recommend_click
        send('noa_recommend_click', { button_text: label });
      } else {
        // 会話続行ボタン（白）→ question_click
        send('noa_question_click', { button_text: label });
      }
    });
  }

  /* ---------- 旅ノア: 検索（メッセージ送信） ---------- */
  var sendBtn = document.getElementById('noa-fp-send');
  var inputEl = document.getElementById('noa-fp-input');

  function trackSearch() {
    if (!inputEl) return;
    var q = inputEl.value.trim();
    if (!q) return;
    send('search', { search_term: q.slice(0, 150) });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', trackSearch);
    sendBtn.addEventListener('touchend', trackSearch);
  }
  if (inputEl) {
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) trackSearch();
    });
  }

  /* ---------- 旅ノア: 答えられなかったクエリ ---------- */
  // chat.js の findResponse が「デフォルト回答」を返したとき外から検知する
  // グローバルフック: NoaChat.onFallback = fn を chat.js 側で呼ぶ
  if (window.NoaChatHooks) {
    window.NoaChatHooks.onFallback = function (query) {
      send('noa_fallback', { query: (query || '').slice(0, 150) });
    };
  }

}());
