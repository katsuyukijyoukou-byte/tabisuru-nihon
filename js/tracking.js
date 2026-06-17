/* ===================================================
   旅する日本図鑑 — カード計測ユーティリティ v1
   現在は console.log。将来 GA4 / GAS に差し替え可能。

   ランキングスコア設計（将来参照用）:
     score = views × 1 + clicks × CLICK_WEIGHT[category] + manualBoost

   カテゴリ別クリック重み:
     featured   10  旅先選択の起点
     onsen      10  温泉宿探しの起点
     booking    20  予約遷移 = 収益直結
     gourmet     8  情報閲覧寄り
     souvenir    8  情報閲覧寄り
     purpose     8  旅のテーマ選択
     prefecture 10  旅先詳細への遷移
     monthly     6  季節コンテンツ
     noah        5  相談導線
     activity    8  体験・アクティビティ
=================================================== */
(function () {
  'use strict';

  /* --------------------------------------------------
     公開 API
  -------------------------------------------------- */

  /** カードクリック計測（将来: gtag / fetch POST に差し替え） */
  function trackCardClick(data) {
    console.log('[Track:click]', data);
    // 将来: gtag('event', 'card_click', { event_category: data.category, event_label: data.id, ...data });
    // 将来: fetch('/api/track/click', { method: 'POST', body: JSON.stringify(data) });
  }

  /** カード表示計測（将来: gtag / fetch POST に差し替え） */
  function trackCardImpression(data) {
    console.log('[Track:impression]', data);
    // 将来: gtag('event', 'card_impression', { event_category: data.category, event_label: data.id, ...data });
    // 将来: fetch('/api/track/impression', { method: 'POST', body: JSON.stringify(data) });
  }

  /* --------------------------------------------------
     クリック計測（イベント委譲 — 動的要素も対象）
  -------------------------------------------------- */
  function initClickTracking() {
    document.addEventListener('click', function (e) {
      var card = e.target.closest('[data-track-id]');
      if (!card) return;
      trackCardClick({
        category:    card.dataset.trackCategory || '',
        id:          card.dataset.trackId       || '',
        title:       card.dataset.trackTitle    || '',
        type:        card.dataset.trackType     || 'card',
        destination: card.getAttribute('href')  || '',
      });
    });
  }

  /* --------------------------------------------------
     表示計測（IntersectionObserver — 1要素1回のみ）
  -------------------------------------------------- */
  var _seen = new Set();
  var _observer = null;

  function buildObserver() {
    if (!window.IntersectionObserver) return null;
    return new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        var key = (card.dataset.trackCategory || '') + ':' + (card.dataset.trackId || '');
        if (_seen.has(key)) { _observer && _observer.unobserve(card); return; }
        _seen.add(key);
        _observer && _observer.unobserve(card);
        trackCardImpression({
          category: card.dataset.trackCategory || '',
          id:       card.dataset.trackId       || '',
          title:    card.dataset.trackTitle    || '',
          type:     card.dataset.trackType     || 'card',
        });
      });
    }, { threshold: 0.4 });
  }

  /**
   * 指定ルート（省略時 document）配下の [data-track-id] を観測開始。
   * 動的レンダリング後に呼ぶ。
   */
  function observe(root) {
    if (!_observer) return;
    var els = (root || document).querySelectorAll('[data-track-id]');
    els.forEach(function (el) { _observer.observe(el); });
  }

  /* --------------------------------------------------
     初期化
  -------------------------------------------------- */
  function init() {
    initClickTracking();
    _observer = buildObserver();
    observe(document);
  }

  window.Track = {
    click:      trackCardClick,
    impression: trackCardImpression,
    observe:    observe,
    init:       init,
  };

  /* DOMContentLoaded 後に自動初期化（app.js より先に読み込まれる想定） */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
