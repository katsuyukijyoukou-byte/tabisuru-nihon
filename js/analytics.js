/* ===================================================
   旅する日本図鑑 — GA4 イベント計測 + 旅ノア未回答ログ
   測定ID: G-V8ZM6F6F34
=================================================== */

/* ---------- GAS エンドポイント（デプロイ後に更新） ---------- */
var NOA_UNANSWERED_ENDPOINT = 'ここにGASのWebアプリURLを入れる';

/* ---------- ユーティリティ ---------- */
function getNoaSessionId() {
  var id = sessionStorage.getItem('noa_session_id');
  if (!id) {
    id = 'noa_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    sessionStorage.setItem('noa_session_id', id);
  }
  return id;
}

function guessDevice() {
  var ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|iphone|android/i.test(ua)) return 'mobile';
  return 'pc';
}

function guessCategoryFromQuestion(question) {
  var q = String(question || '');
  if (/温泉|宿|旅館|ホテル|泊ま|宿泊/.test(q)) return '宿泊・温泉';
  if (/予算|安い|高い|料金|費用|いくら/.test(q)) return '予算';
  if (/子供|子連れ|家族|赤ちゃん/.test(q)) return '子連れ';
  if (/夫婦|カップル|記念日|デート/.test(q)) return '夫婦・カップル';
  if (/雨|梅雨|天気/.test(q)) return '雨の日';
  if (/グルメ|ご飯|ランチ|夕食|食べ/.test(q)) return 'グルメ';
  if (/車なし|電車|新幹線|アクセス|交通/.test(q)) return '交通';
  if (/広島|宮島|京都|大阪|東京|北海道|沖縄/.test(q)) return '地域・都道府県';
  return '未分類';
}

function maskPersonalInfo(text) {
  return String(text || '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
    .replace(/\b0\d{1,4}-?\d{1,4}-?\d{3,4}\b/g, '[phone]');
}

function getGaClientId(cb) {
  try {
    if (typeof gtag === 'function') {
      gtag('get', 'G-V8ZM6F6F34', 'client_id', function(clientId) {
        cb(clientId || '');
      });
      return;
    }
  } catch (e) {}
  cb('');
}

/* ---------- メインログ送信 ---------- */
function sendNoaUnansweredLog(params) {
  var userQuestion = maskPersonalInfo(params.userQuestion || '');
  var noaReply     = maskPersonalInfo(params.noaReply || '').slice(0, 300);
  var reason       = params.reason || 'unknown';

  // GA4イベント（同時送信）
  if (typeof gtag === 'function') {
    gtag('event', 'noa_unanswered', {
      user_question:  userQuestion.slice(0, 150),
      reason:         reason,
      category_guess: guessCategoryFromQuestion(userQuestion)
    });
  }

  // スプレッドシート送信（エンドポイント未設定なら何もしない）
  if (!NOA_UNANSWERED_ENDPOINT || NOA_UNANSWERED_ENDPOINT.includes('ここに')) return;

  getGaClientId(function(gaClientId) {
    var payload = {
      timestamp:      new Date().toISOString(),
      page_url:       location.href,
      page_title:     document.title,
      user_question:  userQuestion,
      noa_reply:      noaReply,
      reason:         reason,
      category_guess: guessCategoryFromQuestion(userQuestion),
      device:         guessDevice(),
      user_agent:     navigator.userAgent,
      session_id:     getNoaSessionId(),
      ga_client_id:   gaClientId,
      status:         '未対応'
    };
    try {
      fetch(NOA_UNANSWERED_ENDPOINT, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body:    JSON.stringify(payload)
      }).catch(function() {});
    } catch (e) {}
  });
}

/* ---------- NoaChatHooks 接続 ---------- */
// window.NoaChatHooks はindex.htmlのGA4タグ内で {} として作成済み
(function waitForHooks() {
  if (!window.NoaChatHooks) { setTimeout(waitForHooks, 50); return; }

  window.NoaChatHooks.onFallback = function(data) {
    sendNoaUnansweredLog({
      userQuestion: data.query  || '',
      noaReply:     data.reply  || '',
      reason:       'fallback_reply'
    });
  };

  window.NoaChatHooks.onNegativeFeedback = function(data) {
    sendNoaUnansweredLog({
      userQuestion: data.query         || '',
      noaReply:     data.previousReply || '',
      reason:       'negative_user_feedback'
    });
  };

  window.NoaChatHooks.onLongLoopUnresolved = function(data) {
    sendNoaUnansweredLog({
      userQuestion: data.query || '',
      noaReply:     data.reply || '',
      reason:       'long_loop_unresolved'
    });
  };
}());

/* ================================================================
   以下: 通常のGA4クリックイベント計測
================================================================ */
(function () {
  'use strict';

  function send(eventName, params) {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, params || {});
  }

  /* ---------- クリック委譲 ---------- */
  document.addEventListener('click', function (e) {
    var target = e.target.closest('a, button');
    if (!target) return;
    var href = target.getAttribute('href') || target.getAttribute('data-href') || '';
    var text = (target.textContent || '').trim().slice(0, 80);

    // アフィリエイトリンク（URLは変更しない・クリック計測のみ）
    if (/a\.r10\.to|rakuten\.co\.jp|af\.moshimo|affiliate-b\.com|px\.a8\.net|ck\.jp\.ap\.valuecommerce|click\.linksynergy/.test(href)) {
      send('affiliate_click', {
        link_text:   text,
        link_domain: (href.split('/')[2] || '')
      });
    }

    // 予約クリック
    if (/booking\.html|jalan\.net|ikyu\.com|travel\.yahoo\.co\.jp|travel\.rakuten/.test(href)) {
      send('booking_click', { link_text: text, link_url: href.slice(0, 150) });
    }

    // 都道府県ページ
    if (/prefecture\.html|prefectures\//.test(href)) {
      var prefId = '';
      try { prefId = new URL(href, location.href).searchParams.get('id') || href; } catch (ex) {}
      send('prefecture_click', { prefecture_id: prefId, link_text: text });
    }

    // 温泉ページ
    if (/onsen\.html/.test(href)) {
      send('onsen_click', { link_text: text });
    }

    // 目的別ページ
    if (/purpose\.html/.test(href)) {
      send('purpose_click', { link_text: text });
    }
  }, true);

  /* ---------- 旅ノア: パネル開閉 ---------- */
  ['#noa-float-btn', '#fh-open-noa', '#hero-noa-cta-btn', '#explore-noa-btn'].forEach(function(sel) {
    var el = document.querySelector(sel);
    if (el) el.addEventListener('click', function() {
      send('noa_open', { trigger: sel });
    });
  });

  /* ---------- 旅ノア: チャット内ボタン ---------- */
  var chatPanel = document.getElementById('noa-fp-messages');
  if (chatPanel) {
    chatPanel.addEventListener('click', function (e) {
      var btn = e.target.closest('.chat-suggest-btn');
      if (!btn) return;
      var label = (btn.textContent || '').trim().slice(0, 80);
      if (btn.classList.contains('chat-suggest-btn--link')) {
        send('noa_recommend_click', { button_text: label });
      } else {
        send('noa_question_click', { button_text: label });
      }
    });
  }

  /* ---------- 旅ノア: 検索（メッセージ送信） ---------- */
  var sendBtn = document.getElementById('noa-fp-send');
  var inputEl = document.getElementById('noa-fp-input');

  function trackSearch() {
    var q = inputEl ? inputEl.value.trim() : '';
    if (!q) return;
    send('search', { search_term: maskPersonalInfo(q).slice(0, 150) });
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

}());
