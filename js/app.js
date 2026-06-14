/* ===================================================
   旅する日本図鑑 — メインアプリケーション
=================================================== */

/* ===== 地域カラー定義 ===== */
const REGION_COLORS = {
  '北海道':     { fill: '#dbeafe', stroke: '#93c5fd' },
  '東北':       { fill: '#dcfce7', stroke: '#86efac' },
  '関東':       { fill: '#fef9c3', stroke: '#fde047' },
  '中部':       { fill: '#fff7ed', stroke: '#fdba74' },
  '近畿':       { fill: '#fce7f3', stroke: '#f9a8d4' },
  '中国':       { fill: '#ede9fe', stroke: '#c4b5fd' },
  '四国':       { fill: '#ccfbf1', stroke: '#5eead4' },
  '九州・沖縄': { fill: '#fee2e2', stroke: '#fca5a5' },
};

/* ===== 都道府県コード（JIS）→ 内部ID マッピング ===== */
const PREF_CODE_TO_ID = {
  1:'hokkaido', 2:'aomori',   3:'iwate',    4:'miyagi',   5:'akita',
  6:'yamagata', 7:'fukushima',8:'ibaraki',  9:'tochigi',  10:'gunma',
  11:'saitama', 12:'chiba',   13:'tokyo',   14:'kanagawa',15:'niigata',
  16:'toyama',  17:'ishikawa',18:'fukui',   19:'yamanashi',20:'nagano',
  21:'gifu',    22:'shizuoka',23:'aichi',   24:'mie',      25:'shiga',
  26:'kyoto',   27:'osaka',   28:'hyogo',   29:'nara',     30:'wakayama',
  31:'tottori', 32:'shimane', 33:'okayama', 34:'hiroshima',35:'yamaguchi',
  36:'tokushima',37:'kagawa', 38:'ehime',   39:'kochi',    40:'fukuoka',
  41:'saga',    42:'nagasaki',43:'kumamoto',44:'oita',     45:'miyazaki',
  46:'kagoshima',47:'okinawa'
};

document.addEventListener('DOMContentLoaded', () => {

  /* ===== スクロールアニメーション ===== */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  }

  /* ===== モバイルメニュー ===== */
  const hamburger = document.querySelector('.hamburger');
  const headerNav = document.querySelector('.header-nav');
  if (hamburger && headerNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      headerNav.style.display = open ? 'flex' : '';
      if (open) {
        headerNav.style.flexDirection = 'column';
        headerNav.style.position = 'absolute';
        headerNav.style.top = '64px';
        headerNav.style.left = '0';
        headerNav.style.right = '0';
        headerNav.style.background = 'rgba(12,27,53,0.98)';
        headerNav.style.padding = '12px 24px 20px';
        headerNav.style.gap = '4px';
      }
    });
  }

  /* ===== ヒーローチャット初期化 ===== */
  initHeroChat();

  /* ===== 地方地図レンダリング（トップ） ===== */
  renderRegionMap();

  /* ===== 都道府県SVG地図レンダリング（都道府県ページ） ===== */
  renderJapanMap();

  /* ===== キーワード検索 ===== */
  initExploreSearch();

  /* ===== 月カードリンク ===== */
  initMonthCards();

  /* ===== 温泉カードリンク ===== */
  initOnsenCards();

  /* ===== 目的カードリンク ===== */
  initPurposeCards();

  /* ===== クエスチョンピル ===== */
  initQuestionPills();

  /* ===== 旅グッズタブ切り替え ===== */
  initGoodsTabs();
});

/* ===== ヒーローチャット ===== */
function initHeroChat() {
  const messagesEl = document.getElementById('hero-messages');
  const inputEl    = document.getElementById('hero-input');
  const sendBtn    = document.getElementById('hero-send');
  const quickBtns  = document.querySelectorAll('.chat-quick');

  if (!messagesEl || !NoaChat) return;

  NoaChat.init({
    messagesEl,
    inputEl,
    sendBtnEl: sendBtn,
    quickBtns,
    rootPath: ROOT,
    initialMessages: [
      { role: 'noa', text: 'こんにちは！旅ノアです🗾✨\n\nどこに行くか決まっていなくても大丈夫！\n\n「6月に温泉旅行したい」「大阪発で1泊2日」「カップルで行ける絶景スポットは？」など、なんでも相談してください。47都道府県どこでもお答えします💕' },
    ],
  });
}

/* ===== パスプレフィックス（index.html vs pages/*.html 対応） ===== */
const ROOT = (() => {
  const p = location.pathname;
  if (p.includes('/pages/') || p.includes('/templates/')) return '../';
  return '';
})();

/* ===== 地域アコーディオン（トップページ用） ===== */
function renderRegionMap() {
  const accordion = document.getElementById('region-accordion');
  if (!accordion) return;

  /* 地方データ定義 */
  const REGIONS = [
    {
      id: 'hokkaido', name: '北海道', emoji: '🦀',
      color: '#dbeafe', stroke: '#60a5fa',
      prefs: ['北海道'],
      prefIds: ['hokkaido'],
      // SVGポリゴン座標 (viewBox 0 0 420 520)
      poly: '218,14 375,14 400,28 388,86 330,106 256,100 218,72',
    },
    {
      id: 'tohoku', name: '東北', emoji: '⛄',
      color: '#dcfce7', stroke: '#4ade80',
      prefs: ['青森','岩手','宮城','秋田','山形','福島'],
      prefIds: ['aomori','iwate','miyagi','akita','yamagata','fukushima'],
      poly: '260,100 322,96 360,110 368,175 345,208 298,220 262,204 248,155',
    },
    {
      id: 'kitakanto', name: '北関東', emoji: '🌾',
      color: '#fefce8', stroke: '#facc15',
      prefs: ['茨城','栃木','群馬'],
      prefIds: ['ibaraki','tochigi','gunma'],
      poly: '296,214 360,207 376,232 356,256 296,260 276,240 280,220',
    },
    {
      id: 'shuto', name: '首都圏', emoji: '🗼',
      color: '#fef3c7', stroke: '#f59e0b',
      prefs: ['東京','神奈川','千葉','埼玉'],
      prefIds: ['tokyo','kanagawa','chiba','saitama'],
      poly: '330,253 396,244 410,265 404,300 360,310 316,298 317,270',
    },
    {
      id: 'koshinetsu', name: '甲信越', emoji: '🏔️',
      color: '#e0f2fe', stroke: '#38bdf8',
      prefs: ['新潟','山梨','長野'],
      prefIds: ['niigata','yamanashi','nagano'],
      poly: '246,200 298,202 302,245 280,265 242,260 226,232 237,206',
    },
    {
      id: 'hokuriku', name: '北陸', emoji: '🦀',
      color: '#f0fdf4', stroke: '#86efac',
      prefs: ['富山','石川','福井'],
      prefIds: ['toyama','ishikawa','fukui'],
      poly: '188,180 256,167 268,190 258,210 212,220 180,213 178,193',
    },
    {
      id: 'tokai', name: '東海', emoji: '🍵',
      color: '#fff7ed', stroke: '#fb923c',
      prefs: ['静岡','愛知','岐阜','三重'],
      prefIds: ['shizuoka','aichi','gifu','mie'],
      poly: '238,260 300,254 318,285 300,318 258,324 226,303 228,272',
    },
    {
      id: 'kinki', name: '近畿', emoji: '⛩️',
      color: '#fce7f3', stroke: '#f472b6',
      prefs: ['大阪','京都','兵庫','滋賀','奈良','和歌山'],
      prefIds: ['osaka','kyoto','hyogo','shiga','nara','wakayama'],
      poly: '178,240 248,232 256,270 238,308 198,322 162,300 160,264',
    },
    {
      id: 'chugoku', name: '山陰・山陽', emoji: '⛩️',
      color: '#ede9fe', stroke: '#a78bfa',
      prefs: ['鳥取','島根','岡山','広島','山口'],
      prefIds: ['tottori','shimane','okayama','hiroshima','yamaguchi'],
      poly: '108,252 196,242 205,274 190,300 132,304 103,282 106,260',
    },
    {
      id: 'shikoku', name: '四国', emoji: '🍊',
      color: '#ccfbf1', stroke: '#2dd4bf',
      prefs: ['徳島','香川','愛媛','高知'],
      prefIds: ['tokushima','kagawa','ehime','kochi'],
      poly: '150,312 222,304 236,334 218,362 163,366 136,345 136,318',
    },
    {
      id: 'kyushu', name: '九州', emoji: '🌸',
      color: '#fee2e2', stroke: '#f87171',
      prefs: ['福岡','佐賀','長崎','熊本','大分','宮崎','鹿児島'],
      prefIds: ['fukuoka','saga','nagasaki','kumamoto','oita','miyazaki','kagoshima'],
      poly: '64,282 134,268 153,286 160,356 128,382 85,376 53,346 46,308',
    },
    {
      id: 'okinawa', name: '沖縄', emoji: '🌺',
      color: '#fff1f2', stroke: '#fb7185',
      prefs: ['沖縄'],
      prefIds: ['okinawa'],
      poly: '26,444 124,444 124,474 26,474',
      isInset: true,
    },
  ];

  /* 都道府県ID変換マップ（表示名 → ID） */
  const PREF_NAME_TO_ID = {
    '北海道':'hokkaido','青森':'aomori','岩手':'iwate','宮城':'miyagi','秋田':'akita',
    '山形':'yamagata','福島':'fukushima','茨城':'ibaraki','栃木':'tochigi','群馬':'gunma',
    '埼玉':'saitama','千葉':'chiba','東京':'tokyo','神奈川':'kanagawa','新潟':'niigata',
    '富山':'toyama','石川':'ishikawa','福井':'fukui','山梨':'yamanashi','長野':'nagano',
    '岐阜':'gifu','静岡':'shizuoka','愛知':'aichi','三重':'mie','滋賀':'shiga',
    '京都':'kyoto','大阪':'osaka','兵庫':'hyogo','奈良':'nara','和歌山':'wakayama',
    '鳥取':'tottori','島根':'shimane','岡山':'okayama','広島':'hiroshima','山口':'yamaguchi',
    '徳島':'tokushima','香川':'kagawa','愛媛':'ehime','高知':'kochi','福岡':'fukuoka',
    '佐賀':'saga','長崎':'nagasaki','熊本':'kumamoto','大分':'oita','宮崎':'miyazaki',
    '鹿児島':'kagoshima','沖縄':'okinawa',
  };

  /* ===== アコーディオン（PC・スマホ共通） ===== */
  REGIONS.forEach(region => {
    const item = document.createElement('div');
    item.className = 'racc-item';

    const head = document.createElement('button');
    head.className = 'racc-head';
    head.setAttribute('aria-expanded', 'false');
    head.setAttribute('aria-controls', `racc-body-${region.id}`);
    head.innerHTML = `
      <span class="racc-label">
        <span class="racc-emoji">${region.emoji}</span>
        <span class="racc-name">${region.name}</span>
        <span class="racc-count">${region.prefs.length}県</span>
      </span>
      <span class="racc-arrow" aria-hidden="true">▼</span>
    `;

    head.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      accordion.querySelectorAll('.racc-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.racc-head').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
      }
    });

    /* 都道府県チップ */
    const prefChips = region.prefs.map(pref => {
      const id = PREF_NAME_TO_ID[pref] || '';
      const href = id ? `${ROOT}templates/prefecture.html?id=${id}` : `${ROOT}pages/prefectures.html?region=${region.id}`;
      return `<a href="${href}" class="racc-pref-chip">${pref}</a>`;
    }).join('');

    const body = document.createElement('div');
    body.className = 'racc-body';
    body.id = `racc-body-${region.id}`;
    body.innerHTML = `
      <div class="racc-pref-chips">${prefChips}</div>
      <a class="racc-all-link" href="${ROOT}pages/prefectures.html?region=${region.id}">
        ${region.name}の都道府県を一覧で見る →
      </a>
    `;

    item.appendChild(head);
    item.appendChild(body);
    accordion.appendChild(item);
  });
}

/* ===== キーワード検索（チャット連携） ===== */
function initExploreSearch() {
  const input  = document.getElementById('keyword-search-input');
  const btn    = document.getElementById('keyword-search-btn');
  const chips  = document.querySelectorAll('.esearch-chip');
  if (!input) return;

  function doSearch(kw) {
    if (!kw.trim()) return;
    // チャットセクションへスクロールしてキーワードを投入
    const chatSection = document.getElementById('chat-section');
    const chatInput   = document.getElementById('chat-input') || document.querySelector('.chat-input-main');
    if (chatSection) chatSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // NoaChatがあればメッセージ送信
    if (window.NoaChat && typeof NoaChat.sendMessage === 'function') {
      setTimeout(() => NoaChat.sendMessage(kw), 600);
    } else if (chatInput) {
      chatInput.value = kw;
      chatInput.dispatchEvent(new Event('input'));
    }
  }

  btn.addEventListener('click', () => doSearch(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(input.value); });
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.kw;
      doSearch(chip.dataset.kw);
    });
  });
}

/* ===== 日本地図（GeoJSON + Mercator投影）レンダリング v2 ===== */
function renderJapanMap() {
  const container = document.getElementById('japan-map');
  if (!container || !window.ALL_PREFS || !window.JAPAN_TOPOJSON) return;
  if (typeof topojson === 'undefined') { console.warn('topojson-client not loaded'); return; }

  /* --- Mercator投影ヘルパー --- */
  function merc(lon, lat, scale, cx, cy, tx, ty) {
    const x = (lon - cx) * (Math.PI / 180) * scale + tx;
    const y = -(Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) -
                Math.log(Math.tan(Math.PI / 4 + cy  * Math.PI / 360))) * scale + ty;
    return [x, y];
  }

  // 日本本土：scale/center/translate を最適化
  const W = 520, H = 540;
  const mainProj = (lon, lat) => merc(lon, lat, 1450, 136.5, 36.5, 230, 295);

  // 沖縄インセット（左下）
  const OKI_X = 4, OKI_Y0 = H - 148, OKI_W = 128, OKI_H = 130;
  const okiProj = (lon, lat) => merc(lon, lat, 2600, 127.8, 26.0, OKI_X + 64, OKI_Y0 + 65);

  /* --- GeoJSON変換 --- */
  const features = topojson.feature(JAPAN_TOPOJSON, JAPAN_TOPOJSON.objects.japan).features;

  /* --- prefById ルックアップ --- */
  const prefById = {};
  ALL_PREFS.forEach(p => { prefById[p.id] = p; });

  /* --- フィーチャー → SVGパス + 重心 --- */
  function ringToD(coords, proj) {
    if (!coords || coords.length < 2) return { d: '', cx: 0, cy: 0, count: 0 };
    let sx = 0, sy = 0;
    const pts = coords.map(([lon, lat]) => {
      const [x, y] = proj(lon, lat);
      sx += x; sy += y;
      return x.toFixed(1) + ',' + y.toFixed(1);
    });
    return { d: 'M' + pts.join('L') + 'Z', cx: sx / pts.length, cy: sy / pts.length, count: pts.length };
  }
  function featureToD(feat, proj) {
    const g = feat.geometry;
    if (!g) return { d: '', cx: 0, cy: 0, area: 0 };
    const polys = g.type === 'Polygon' ? [g.coordinates]
                : g.type === 'MultiPolygon' ? g.coordinates : [];
    let allD = '', bestCx = 0, bestCy = 0, bestCount = 0;
    polys.forEach(poly => {
      const outer = poly[0];
      const r = ringToD(outer, proj);
      allD += poly.map(ring => ringToD(ring, proj).d).join('');
      if (r.count > bestCount) { bestCx = r.cx; bestCy = r.cy; bestCount = r.count; }
    });
    return { d: allD, cx: bestCx, cy: bestCy };
  }

  /* --- SVG構築 --- */
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'japan-svg-map');
  svg.setAttribute('aria-label', '日本地図 — 都道府県をクリックして詳細を確認');

  // 海背景
  const sea = document.createElementNS(NS, 'rect');
  sea.setAttribute('x','0'); sea.setAttribute('y','0');
  sea.setAttribute('width', W); sea.setAttribute('height', H);
  sea.setAttribute('fill', '#d6ecf8');
  svg.appendChild(sea);

  // 沖縄インセット背景＋枠
  const okiBg = document.createElementNS(NS, 'rect');
  okiBg.setAttribute('x', OKI_X); okiBg.setAttribute('y', OKI_Y0);
  okiBg.setAttribute('width', OKI_W); okiBg.setAttribute('height', OKI_H);
  okiBg.setAttribute('fill','#d6ecf8'); okiBg.setAttribute('stroke','#94a3b8');
  okiBg.setAttribute('stroke-width','1'); okiBg.setAttribute('rx','5');
  svg.appendChild(okiBg);

  // 沖縄ラベル
  const okiTxt = document.createElementNS(NS, 'text');
  okiTxt.setAttribute('x', String(OKI_X + 4));
  okiTxt.setAttribute('y', String(OKI_Y0 + OKI_H - 3));
  okiTxt.setAttribute('font-size','8'); okiTxt.setAttribute('fill','#64748b');
  okiTxt.setAttribute('pointer-events','none');
  okiTxt.textContent = '沖縄（縮小表示）';
  svg.appendChild(okiTxt);

  // 沖縄インセット clipPath
  const defs = document.createElementNS(NS, 'defs');
  const clipPath = document.createElementNS(NS, 'clipPath');
  clipPath.setAttribute('id', 'oki-clip');
  const clipRect = document.createElementNS(NS, 'rect');
  clipRect.setAttribute('x', OKI_X); clipRect.setAttribute('y', OKI_Y0);
  clipRect.setAttribute('width', OKI_W); clipRect.setAttribute('height', OKI_H);
  clipPath.appendChild(clipRect);
  defs.appendChild(clipPath);
  svg.appendChild(defs);

  // テキストラベルグループ（パスの後に描画するため後で追加）
  const labelGroup = document.createElementNS(NS, 'g');
  labelGroup.setAttribute('pointer-events', 'none');

  // 都道府県パスを描画
  features.forEach(feat => {
    const code   = feat.properties.id;
    const prefId = PREF_CODE_TO_ID[code];
    if (!prefId) return;

    const pref       = prefById[prefId];
    const isFeatured = window.PREFECTURES_DATA && !!PREFECTURES_DATA[prefId];
    const rc         = REGION_COLORS[pref?.region] || { fill: '#f1f5f9', stroke: '#cbd5e1' };
    const isOkinawa  = (code === 47);
    const proj       = isOkinawa ? okiProj : mainProj;

    const { d, cx, cy } = featureToD(feat, proj);
    if (!d) return;

    const name = pref?.name || feat.properties.nam_ja || '';

    const pathEl = document.createElementNS(NS, 'path');
    pathEl.setAttribute('d', d);
    // 全47県対応済みのため地域カラーで統一（ホバー時にゴールド強調）
    pathEl.setAttribute('fill',   rc.fill);
    pathEl.setAttribute('stroke', rc.stroke);
    pathEl.setAttribute('stroke-width', '1.0');
    pathEl.setAttribute('stroke-linejoin', 'round');
    pathEl.setAttribute('class', [
      'pref-svg-path',
      pref?.ready ? 'pref-svg-ready' : 'pref-svg-not-ready',
      isFeatured ? 'pref-svg-featured' : '',
    ].filter(Boolean).join(' '));
    pathEl.setAttribute('data-id',     prefId);
    pathEl.setAttribute('data-name',   name);
    pathEl.setAttribute('data-region', pref?.region || '');
    pathEl.setAttribute('tabindex',    pref?.ready ? '0' : '-1');
    pathEl.setAttribute('role',        'button');
    pathEl.setAttribute('aria-label',  name + (isFeatured ? '（詳細ガイドあり）' : ''));
    if (isOkinawa) pathEl.setAttribute('clip-path', 'url(#oki-clip)');

    const titleEl = document.createElementNS(NS, 'title');
    titleEl.textContent = name + ' — クリックで詳細へ';
    pathEl.appendChild(titleEl);

    // クリック・タップ
    pathEl.addEventListener('click', () => {
      if (!pref?.ready) { showToast(`${name}のページは準備中です🚧`); return; }
      window.location.href = `${ROOT}templates/prefecture.html?id=${prefId}`;
    });
    // ホバー→ツールチップ
    pathEl.addEventListener('mouseenter', () => {
      const tip = container.querySelector('.map-svg-tooltip');
      if (tip) {
        tip.innerHTML = `<span style="font-size:1.1em">${pref?.emoji || ''}</span> <strong>${name}</strong> <span style="color:#22c55e;font-size:0.85em">✓</span>`;
        tip.style.display = 'block';
        tip.style.opacity = '1';
      }
    });
    pathEl.addEventListener('mouseleave', () => {
      const tip = container.querySelector('.map-svg-tooltip');
      if (tip) tip.style.display = 'none';
    });
    svg.appendChild(pathEl);

    // テキストラベル（主要県と広い県はフル名、狭い県は省略）
    const LABEL_FULL = ['hokkaido','aomori','iwate','miyagi','akita','yamagata',
      'fukushima','ibaraki','tochigi','gunma','saitama','chiba','tokyo','kanagawa',
      'niigata','nagano','gifu','shizuoka','aichi','mie','shiga',
      'kyoto','osaka','hyogo','nara','wakayama',
      'tottori','shimane','okayama','hiroshima','yamaguchi',
      'fukuoka','saga','nagasaki','kumamoto','oita','miyazaki','kagoshima'];
    const LABEL_SHORT = { // 狭い県は略称
      'toyama':'富山','ishikawa':'石川','fukui':'福井','yamanashi':'山梨',
      'tokushima':'徳島','kagawa':'香川','ehime':'愛媛','kochi':'高知',
    };
    if (pref?.ready && !isOkinawa && cx > 10) {
      const showFull = LABEL_FULL.includes(prefId);
      const showShort = LABEL_SHORT[prefId];
      if (showFull || showShort) {
        const txt = document.createElementNS(NS, 'text');
        txt.setAttribute('x', cx.toFixed(1));
        txt.setAttribute('y', (cy + 1).toFixed(1));
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('dominant-baseline', 'middle');
        const fontSize = prefId === 'hokkaido' ? '10' : showShort ? '6' : '7';
        txt.setAttribute('font-size', fontSize);
        txt.setAttribute('font-weight', isFeatured ? '700' : '600');
        txt.setAttribute('fill', isFeatured ? '#7a5500' : '#1a3060');
        txt.setAttribute('stroke', 'rgba(255,255,255,0.85)');
        txt.setAttribute('stroke-width', '2.5');
        txt.setAttribute('paint-order', 'stroke');
        txt.textContent = showShort || name;
        labelGroup.appendChild(txt);
      }
    }
  });

  svg.appendChild(labelGroup);

  // ツールチップ
  const tooltip = document.createElement('div');
  tooltip.className = 'map-svg-tooltip';
  tooltip.style.display = 'none';

  container.innerHTML = '';
  container.appendChild(svg);
  container.appendChild(tooltip);

  container.addEventListener('mousemove', e => {
    if (tooltip.style.display === 'none') return;
    const rect = container.getBoundingClientRect();
    let lx = e.clientX - rect.left + 16;
    let ly = e.clientY - rect.top  - 44;
    if (lx + 160 > rect.width) lx = e.clientX - rect.left - 160;
    tooltip.style.left = lx + 'px';
    tooltip.style.top  = ly + 'px';
  });

  // モバイル用タッチ（タップ時にツールチップ表示して第2タップで遷移）
  let lastTapped = null;
  container.addEventListener('touchstart', e => {
    const el = e.target.closest('.pref-svg-path');
    if (!el) return;
    const prefId = el.dataset.id;
    const name   = el.dataset.name;
    if (lastTapped === prefId) {
      // 2回タップで遷移
      lastTapped = null;
      const pref = prefById[prefId];
      if (!pref?.ready) { showToast(`${name}のページは準備中です🚧`); return; }
      window.location.href = `${ROOT}templates/prefecture.html?id=${prefId}`;
    } else {
      lastTapped = prefId;
      showToast(`${el.dataset.name} — もう一度タップで詳細へ`);
      setTimeout(() => { if (lastTapped === prefId) lastTapped = null; }, 3000);
    }
  }, { passive: true });
}

/* ===== 月カード ===== */
function initMonthCards() {
  document.querySelectorAll('.month-card[data-month]').forEach(card => {
    card.addEventListener('click', () => {
      const m = card.dataset.month;
      if (card.classList.contains('has-data')) {
        window.location.href = `${ROOT}templates/monthly-detail.html?month=${m}`;
      } else {
        showToast(`${m}月のページは準備中です🚧`);
      }
    });
  });
}

/* ===== 温泉カード ===== */
function initOnsenCards() {
  document.querySelectorAll('.onsen-card[data-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      window.location.href = `${ROOT}templates/onsen.html?id=${id}`;
    });
  });
}

/* ===== 目的カード ===== */
function initPurposeCards() {
  document.querySelectorAll('.purpose-card[data-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      window.location.href = `${ROOT}pages/purpose.html?id=${id}`;
    });
  });
}

/* ===== クエスチョンピル → チャットに入力 ===== */
function initQuestionPills() {
  const pills = document.querySelectorAll('.question-pill');
  const heroInput = document.getElementById('hero-input');
  const heroSend  = document.getElementById('hero-send');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const q = pill.dataset.q || pill.textContent.trim().replace(/^[^\s]+\s/, '');
      if (heroInput) {
        heroInput.value = q;
        heroInput.focus();
        // スクロールしてヒーローチャットへ
        document.querySelector('.hero-chat-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => heroSend?.click(), 400);
      }
    });
  });
}

/* ===== トースト通知 ===== */
function initGoodsTabs() {
  const tabs = document.querySelectorAll('.goods-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = 'goods-' + tab.dataset.tab;
      document.querySelectorAll('.goods-grid').forEach(grid => {
        grid.classList.toggle('hidden', grid.id !== target);
      });
    });
  });
}

function showToast(msg) {
  const existing = document.querySelector('.toast-msg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
    background:rgba(12,27,53,0.92);color:white;padding:12px 24px;
    border-radius:999px;font-size:0.85rem;font-weight:600;
    z-index:9999;backdrop-filter:blur(8px);
    animation:toastIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ===== テンプレートページ共通：URLパラメータ取得 ===== */
window.getPageParam = (key) => new URLSearchParams(location.search).get(key);

/* ===== 都道府県テンプレートレンダリング ===== */
window.renderPrefecturePage = function() {
  const id = getPageParam('id');
  if (!id || !window.PREFECTURES_DATA) return;

  const d = PREFECTURES_DATA[id];
  if (!d) {
    document.title = '都道府県が見つかりません';
    document.querySelector('.pref-hero')?.insertAdjacentHTML('afterbegin',
      '<div class="container"><p style="color:white;padding:40px 0">ページが見つかりません</p></div>');
    return;
  }

  document.title = `${d.name} 旅行ガイド | 旅する日本図鑑`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', `${d.name}の旅行情報。${d.tagline}。おすすめスポット・グルメ・温泉・モデルコースを紹介。`);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `${d.name} 旅行ガイド | 旅する日本図鑑`);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://tabisuru-nihon.github.io/templates/prefecture.html?id=${id}`);
  // canonical
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) { canonicalEl = document.createElement('link'); canonicalEl.rel = 'canonical'; document.head.appendChild(canonicalEl); }
  canonicalEl.href = `https://tabisuru-nihon.github.io/templates/prefecture.html?id=${id}`;

  // heroの背景グラデーション + 代表写真
  const hero = document.querySelector('.pref-hero');
  if (hero) {
    const imgPath = `../images/japan/${id}/${id}-spot-${id.replace(/-/g,'')}-01.jpg`;
    const fallbackImg = `../images/japan/${id}/${id}-${id}-01.jpg`;
    // 県代表画像マッピング
    const PREF_HERO_IMGS = {
      hokkaido: '../images/japan/hokkaido/hokkaido-biei-flower-field-01.jpg',
      aomori: '../images/japan/aomori/aomori-oirase-01.jpg',
      iwate: '../images/japan/iwate/iwate-nature-01.jpg',
      miyagi: '../images/japan/miyagi/miyagi-matsushima-01.jpg',
      akita: '../images/japan/akita/akita-tazawako-01.jpg',
      yamagata: '../images/japan/yamagata/yamagata-ginzan-01.jpg',
      fukushima: '../images/japan/fukushima/fukushima-goshikinuma-01.jpg',
      ibaraki: '../images/japan/ibaraki/ibaraki-kairakuen-02.jpg',
      tochigi: '../images/japan/tochigi/tochigi-nikko-01.jpg',
      gunma: '../images/japan/gunma/gunma-kusatsu-01.jpg',
      saitama: '../images/japan/saitama/saitama-kawagoe-01.jpg',
      chiba: '../images/japan/chiba/chiba-seaside-01.jpg',
      tokyo: '../images/japan/tokyo/tokyo-asakusa-sensoji-01.jpg',
      kanagawa: '../images/japan/kanagawa/kanagawa-kamakura-01.jpg',
      niigata: '../images/japan/niigata/niigata-landscape-01.jpg',
      toyama: '../images/japan/toyama/toyama-tateyama-02.jpg',
      ishikawa: '../images/japan/ishikawa/ishikawa-kanazawa-01.jpg',
      fukui: '../images/japan/fukui/fukui-tojinbo-01.jpg',
      yamanashi: '../images/japan/yamanashi/yamanashi-fuji-kawaguchi-01.jpg',
      nagano: '../images/japan/nagano/nagano-kamikochi-01.jpg',
      gifu: '../images/japan/gifu/gifu-shirakawago-01.jpg',
      shizuoka: '../images/japan/shizuoka/shizuoka-fuji-01.jpg',
      aichi: '../images/japan/aichi/aichi-nagoya-castle-01.jpg',
      mie: '../images/japan/mie/mie-ise-coast-01.jpg',
      shiga: '../images/japan/shiga/shiga-lake-01.jpg',
      kyoto: '../images/japan/kyoto/kyoto-fushimi-inari-01.jpg',
      osaka: '../images/japan/osaka/osaka-dotonbori-01.jpg',
      hyogo: '../images/japan/hyogo/hyogo-himeji-01.jpg',
      nara: '../images/japan/nara/nara-deer-01.jpg',
      wakayama: '../images/japan/wakayama/wakayama-nachi-01.jpg',
      tottori: '../images/japan/tottori/tottori-sanddune-02.jpg',
      shimane: '../images/japan/shimane/shimane-izumo-01.jpg',
      okayama: '../images/japan/okayama/okayama-kurashiki-01.jpg',
      hiroshima: '../images/japan/hiroshima/hiroshima-miyajima-torii-01.jpg',
      yamaguchi: '../images/japan/yamaguchi/yamaguchi-coast-01.jpg',
      tokushima: '../images/japan/tokushima/tokushima-awa-02.jpg',
      kagawa: '../images/japan/kagawa/kagawa-chichibugahama-01.jpg',
      ehime: '../images/japan/ehime/ehime-dogo-01.jpg',
      kochi: '../images/japan/kochi/kochi-katsurahama-01.jpg',
      fukuoka: '../images/japan/fukuoka/fukuoka-city-01.jpg',
      saga: '../images/japan/saga/saga-castle-01.jpg',
      nagasaki: '../images/japan/nagasaki/nagasaki-harbor-01.jpg',
      kumamoto: '../images/japan/kumamoto/kumamoto-castle-01.jpg',
      oita: '../images/japan/oita/oita-beppu-01.jpg',
      miyazaki: '../images/japan/miyazaki/miyazaki-coast-01.jpg',
      kagoshima: '../images/japan/kagoshima/kagoshima-nature-01.jpg',
      okinawa: '../images/japan/okinawa/okinawa-sea-coast-02.jpg',
    };
    const heroImg = PREF_HERO_IMGS[id];
    if (heroImg) {
      hero.style.background = `linear-gradient(to bottom, rgba(12,27,53,0.55) 0%, rgba(12,27,53,0.75) 100%), url(${heroImg}) center/cover no-repeat`;
    } else {
      hero.style.background = d.gradient || `linear-gradient(135deg, #0c1b35, #1a3060)`;
    }
  }

  // フォトギャラリー画像マッピング（複数画像がある県）
  const PREF_GALLERY_IMGS = {
    hokkaido: [
      { src: '../images/japan/hokkaido/hokkaido-biei-flower-field-01.jpg', alt: '美瑛の花畑' },
      { src: '../images/japan/hokkaido/hokkaido-noboribetsu-01.jpg', alt: '登別温泉' },
      { src: '../images/japan/hokkaido/hokkaido-shiretoko-01.jpg', alt: '知床半島' },
    ],
    aomori: [
      { src: '../images/japan/aomori/aomori-oirase-01.jpg', alt: '奥入瀬渓流' },
      { src: '../images/japan/aomori/aomori-hirosaki-02.jpg', alt: '弘前城の桜' },
    ],
    iwate: [
      { src: '../images/japan/iwate/iwate-nature-01.jpg', alt: '岩手の自然' },
      { src: '../images/japan/iwate/iwate-hiraizumi-01.jpg', alt: '平泉・中尊寺' },
    ],
    miyagi: [
      { src: '../images/japan/miyagi/miyagi-matsushima-01.jpg', alt: '松島' },
      { src: '../images/japan/miyagi/miyagi-matsushima-02.jpg', alt: '松島の島々' },
    ],
    akita: [
      { src: '../images/japan/akita/akita-tazawako-01.jpg', alt: '田沢湖' },
      { src: '../images/japan/akita/akita-nyutou-onsen-01.jpg', alt: '乳頭温泉郷' },
    ],
    yamagata: [
      { src: '../images/japan/yamagata/yamagata-ginzan-01.jpg', alt: '銀山温泉' },
      { src: '../images/japan/yamagata/yamagata-zao-02.jpg', alt: '蔵王の山々' },
    ],
    fukushima: [
      { src: '../images/japan/fukushima/fukushima-goshikinuma-01.jpg', alt: '五色沼' },
      { src: '../images/japan/fukushima/fukushima-waterfall-02.jpg', alt: '福島の渓流' },
    ],
    ibaraki: [
      { src: '../images/japan/ibaraki/ibaraki-kairakuen-02.jpg', alt: '偕楽園' },
      { src: '../images/japan/ibaraki/ibaraki-nemophila-02.jpg', alt: 'ひたち海浜公園・ネモフィラ' },
    ],
    tochigi: [
      { src: '../images/japan/tochigi/tochigi-nikko-01.jpg', alt: '日光東照宮' },
      { src: '../images/japan/tochigi/tochigi-nikko-02.jpg', alt: '日光の自然' },
    ],
    gunma: [
      { src: '../images/japan/gunma/gunma-kusatsu-01.jpg', alt: '草津温泉' },
      { src: '../images/japan/gunma/gunma-kusatsu-02.jpg', alt: '草津温泉湯畑' },
    ],
    saitama: [
      { src: '../images/japan/saitama/saitama-kawagoe-01.jpg', alt: '川越・時の鐘' },
      { src: '../images/japan/saitama/saitama-kawagoe-02.jpg', alt: '川越・蔵造りの街' },
    ],
    chiba: [
      { src: '../images/japan/chiba/chiba-seaside-01.jpg', alt: '九十九里浜' },
      { src: '../images/japan/chiba/chiba-nokogiri-02.jpg', alt: '鋸山からの絶景' },
    ],
    tokyo: [
      { src: '../images/japan/tokyo/tokyo-asakusa-sensoji-01.jpg', alt: '浅草寺' },
      { src: '../images/japan/tokyo/tokyo-shibuya-01.jpg', alt: '渋谷スクランブル交差点' },
      { src: '../images/japan/tokyo/tokyo-shinjuku-01.jpg', alt: '新宿' },
      { src: '../images/japan/tokyo/tokyo-ueno-01.jpg', alt: '上野公園' },
    ],
    kanagawa: [
      { src: '../images/japan/kanagawa/kanagawa-kamakura-01.jpg', alt: '鎌倉' },
      { src: '../images/japan/kanagawa/kanagawa-hakone-01.jpg', alt: '箱根' },
    ],
    toyama: [
      { src: '../images/japan/toyama/toyama-tateyama-02.jpg', alt: '立山黒部アルペンルート' },
      { src: '../images/japan/toyama/toyama-kurobe-02.jpg', alt: '黒部峡谷の滝' },
    ],
    ishikawa: [
      { src: '../images/japan/ishikawa/ishikawa-kanazawa-01.jpg', alt: '金沢' },
      { src: '../images/japan/ishikawa/ishikawa-kenroku-01.jpg', alt: '兼六園' },
    ],
    fukui: [
      { src: '../images/japan/fukui/fukui-tojinbo-01.jpg', alt: '東尋坊' },
      { src: '../images/japan/fukui/fukui-nature-02.jpg', alt: '福井の自然' },
    ],
    yamanashi: [
      { src: '../images/japan/yamanashi/yamanashi-fuji-kawaguchi-01.jpg', alt: '富士山・河口湖' },
      { src: '../images/japan/yamanashi/yamanashi-fuji-lake-02.jpg', alt: '富士山・湖の夜明け' },
    ],
    nagano: [
      { src: '../images/japan/nagano/nagano-kamikochi-01.jpg', alt: '上高地' },
      { src: '../images/japan/nagano/nagano-hakuba-01.jpg', alt: '白馬アルプス' },
    ],
    gifu: [
      { src: '../images/japan/gifu/gifu-shirakawago-01.jpg', alt: '白川郷' },
      { src: '../images/japan/gifu/gifu-shirakawago-02.jpg', alt: '白川郷の合掌造り' },
    ],
    shizuoka: [
      { src: '../images/japan/shizuoka/shizuoka-fuji-01.jpg', alt: '富士山' },
      { src: '../images/japan/shizuoka/shizuoka-fuji-pagoda-02.jpg', alt: '富士山と五重塔' },
    ],
    aichi: [
      { src: '../images/japan/aichi/aichi-nagoya-castle-01.jpg', alt: '名古屋城' },
      { src: '../images/japan/aichi/aichi-nagoya-02.jpg', alt: '名古屋城・全景' },
    ],
    mie: [
      { src: '../images/japan/mie/mie-ise-coast-01.jpg', alt: '伊勢海岸' },
      { src: '../images/japan/mie/mie-kumano-02.jpg', alt: '熊野古道' },
    ],
    shiga: [
      { src: '../images/japan/shiga/shiga-lake-01.jpg', alt: '琵琶湖' },
      { src: '../images/japan/shiga/shiga-hikone-02.jpg', alt: '彦根城' },
    ],
    kyoto: [
      { src: '../images/japan/kyoto/kyoto-fushimi-inari-01.jpg', alt: '伏見稲荷大社' },
      { src: '../images/japan/kyoto/kyoto-kinkakuji-01.jpg', alt: '金閣寺' },
      { src: '../images/japan/kyoto/kyoto-arashiyama-01.jpg', alt: '嵐山' },
    ],
    osaka: [
      { src: '../images/japan/osaka/osaka-dotonbori-01.jpg', alt: '道頓堀' },
      { src: '../images/japan/osaka/osaka-castle-01.jpg', alt: '大阪城' },
    ],
    hyogo: [
      { src: '../images/japan/hyogo/hyogo-himeji-01.jpg', alt: '姫路城' },
      { src: '../images/japan/hyogo/hyogo-kobe-port-02.jpg', alt: '神戸ポートタワー' },
    ],
    nara: [
      { src: '../images/japan/nara/nara-deer-01.jpg', alt: '奈良の鹿' },
      { src: '../images/japan/nara/nara-todaiji-02.jpg', alt: '東大寺' },
    ],
    wakayama: [
      { src: '../images/japan/wakayama/wakayama-nachi-01.jpg', alt: '那智の滝' },
      { src: '../images/japan/wakayama/wakayama-seigantoji-02.jpg', alt: '青岸渡寺と那智の滝' },
    ],
    tottori: [
      { src: '../images/japan/tottori/tottori-sanddune-02.jpg', alt: '鳥取砂丘' },
      { src: '../images/japan/tottori/tottori-coast-02.jpg', alt: '鳥取の海岸' },
    ],
    shimane: [
      { src: '../images/japan/shimane/shimane-izumo-01.jpg', alt: '出雲大社' },
      { src: '../images/japan/shimane/shimane-shrine-02.jpg', alt: '島根の神社参道' },
    ],
    okayama: [
      { src: '../images/japan/okayama/okayama-kurashiki-01.jpg', alt: '倉敷美観地区' },
      { src: '../images/japan/okayama/okayama-kurashiki-02.jpg', alt: '倉敷・川下り' },
    ],
    hiroshima: [
      { src: '../images/japan/hiroshima/hiroshima-miyajima-torii-01.jpg', alt: '宮島の大鳥居' },
      { src: '../images/japan/hiroshima/hiroshima-peace-memorial-01.jpg', alt: '原爆ドーム' },
      { src: '../images/japan/hiroshima/hiroshima-miyajima-02.jpg', alt: '宮島の風景' },
      { src: '../images/japan/hiroshima/hiroshima-city-01.jpg', alt: '広島市街' },
    ],
    yamaguchi: [
      { src: '../images/japan/yamaguchi/yamaguchi-coast-01.jpg', alt: '山口の海岸' },
      { src: '../images/japan/yamaguchi/yamaguchi-torii-02.jpg', alt: '海に沈む鳥居' },
    ],
    tokushima: [
      { src: '../images/japan/tokushima/tokushima-awa-02.jpg', alt: '阿波おどり' },
      { src: '../images/japan/tokushima/tokushima-bridge-02.jpg', alt: '徳島の橋・川' },
    ],
    kagawa: [
      { src: '../images/japan/kagawa/kagawa-chichibugahama-01.jpg', alt: '父母ヶ浜' },
      { src: '../images/japan/kagawa/kagawa-naoshima-02.jpg', alt: '直島・アート島' },
    ],
    ehime: [
      { src: '../images/japan/ehime/ehime-dogo-01.jpg', alt: '道後温泉' },
      { src: '../images/japan/ehime/ehime-dogo-02.jpg', alt: '道後温泉本館' },
    ],
    kochi: [
      { src: '../images/japan/kochi/kochi-katsurahama-01.jpg', alt: '桂浜' },
      { src: '../images/japan/kochi/kochi-nature-02.jpg', alt: '高知の清流・自然' },
    ],
    fukuoka: [
      { src: '../images/japan/fukuoka/fukuoka-city-01.jpg', alt: '福岡市街' },
      { src: '../images/japan/fukuoka/fukuoka-dazaifu-02.jpg', alt: '太宰府天満宮' },
    ],
    saga: [
      { src: '../images/japan/saga/saga-castle-01.jpg', alt: '佐賀城' },
      { src: '../images/japan/saga/saga-shrine-02.jpg', alt: '佐賀の神社' },
    ],
    nagasaki: [
      { src: '../images/japan/nagasaki/nagasaki-harbor-01.jpg', alt: '長崎港' },
      { src: '../images/japan/nagasaki/nagasaki-nightview-02.jpg', alt: '長崎の夜景' },
    ],
    oita: [
      { src: '../images/japan/oita/oita-beppu-01.jpg', alt: '別府温泉' },
    ],
    miyazaki: [
      { src: '../images/japan/miyazaki/miyazaki-coast-01.jpg', alt: '宮崎の海岸' },
      { src: '../images/japan/miyazaki/miyazaki-shrine-02.jpg', alt: '宮崎神宮' },
    ],
    kagoshima: [
      { src: '../images/japan/kagoshima/kagoshima-nature-01.jpg', alt: '鹿児島の自然' },
      { src: '../images/japan/kagoshima/kagoshima-sakurajima-02.jpg', alt: '桜島' },
    ],
    kumamoto: [
      { src: '../images/japan/kumamoto/kumamoto-castle-01.jpg', alt: '熊本城' },
      { src: '../images/japan/kumamoto/kumamoto-aso-02.jpg', alt: '阿蘇山' },
    ],
    okinawa: [
      { src: '../images/japan/okinawa/okinawa-sea-coast-02.jpg', alt: '沖縄の海' },
      { src: '../images/japan/okinawa/okinawa-shuri-castle-01.jpg', alt: '首里城' },
      { src: '../images/japan/okinawa/okinawa-kouri-01.jpg', alt: '古宇利島' },
    ],
  };
  const galleryEl = document.querySelector('#pref-gallery');
  if (galleryEl) {
    const imgs = PREF_GALLERY_IMGS[id];
    if (imgs && imgs.length > 1) {
      galleryEl.innerHTML = imgs.map(img => `
        <div class="gallery-item" data-src="${img.src}" data-alt="${img.alt}" role="button" tabindex="0" aria-label="${img.alt}を拡大">
          <img src="${img.src}" alt="${img.alt}" loading="lazy" width="320" height="213"
               onerror="this.closest('.gallery-item').style.display='none'">
          <div class="gallery-caption">${img.alt}</div>
        </div>`).join('');
      const galleryBlock = document.getElementById('pref-gallery-block');
      if (galleryBlock) galleryBlock.style.display = '';

      // ライトボックス
      const lb = document.createElement('div');
      lb.className = 'lightbox-overlay';
      lb.innerHTML = `<div class="lightbox-content"><button class="lightbox-close" aria-label="閉じる">✕</button><img src="" alt=""><p class="lightbox-caption"></p></div>`;
      document.body.appendChild(lb);
      const lbImg = lb.querySelector('img');
      const lbCap = lb.querySelector('.lightbox-caption');
      const openLb = (src, alt) => { lbImg.src = src; lbCap.textContent = alt; lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
      const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
      lb.querySelector('.lightbox-close').addEventListener('click', closeLb);
      lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
      galleryEl.addEventListener('click', e => {
        const item = e.target.closest('.gallery-item');
        if (item) openLb(item.dataset.src, item.dataset.alt);
      });
    }
  }

  // 基本情報
  setEl('#pref-label', `${d.region} › ${d.name}`);
  setEl('#pref-name', `${d.emoji} ${d.name}`);
  setEl('#pref-tagline', d.tagline);
  setEl('#pref-en', d.nameEn);

  // ベストフォータグ
  const tagsEl = document.querySelector('#pref-best-for');
  if (tagsEl && d.bestFor) {
    tagsEl.innerHTML = d.bestFor.map(t => `<span class="pref-tag">${t}</span>`).join('');
  }

  // 概要
  setEl('#pref-overview', d.overview);

  // こんな人に向いている
  const suitEl = document.querySelector('#pref-suitable');
  if (suitEl && d.suitableFor) {
    suitEl.innerHTML = d.suitableFor.map(s => {
      const label = typeof s === 'string' ? s : s.type;
      const reason = typeof s === 'string' ? '' : s.reason;
      return `<div class="course-step">
        <div class="step-badge">✓</div>
        <div class="step-content">
          <h4>${label}</h4>
          ${reason ? `<p>${reason}</p>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  // ハイライト
  const hlEl = document.querySelector('#pref-highlights');
  if (hlEl && d.highlights) {
    hlEl.innerHTML = d.highlights.map(h => `
      <div class="spot-card">
        <div class="spot-thumb">${h.emoji || '📍'}</div>
        <div class="spot-info">
          <div class="spot-name">${h.name}</div>
          <div class="spot-desc">${h.desc || ''}</div>
          ${(h.season || h.bestSeason) ? `<div class="spot-season">🗓 ${h.season || h.bestSeason}</div>` : ''}
        </div>
      </div>`).join('');
  }

  // 季節
  const seasonEl = document.querySelector('#pref-seasonal');
  if (seasonEl && d.seasonal) {
    const s = d.seasonal;
    seasonEl.innerHTML = [
      { key: 'spring', label: '春', emoji: '🌸' },
      { key: 'summer', label: '夏', emoji: '☀️' },
      { key: 'autumn', label: '秋', emoji: '🍁' },
      { key: 'winter', label: '冬', emoji: '❄️' },
    ].map(({ key, label, emoji }) => `
      <div class="season-card">
        <div class="season-emoji">${emoji}</div>
        <div class="season-name">${label}</div>
        <div class="season-desc">${s[key] || '—'}</div>
      </div>`).join('');
  }

  // グルメ
  const gourmetEl = document.querySelector('#pref-gourmet');
  if (gourmetEl && d.gourmet) {
    gourmetEl.innerHTML = d.gourmet.map(g => `
      <div class="food-card">
        <div class="food-emoji">${g.emoji || '🍽'}</div>
        <div class="food-name">${g.name}</div>
        <div class="food-desc">${g.desc || ''}</div>
      </div>`).join('');
  }

  // 穴場スポット
  const hiddenEl = document.querySelector('#pref-hidden-gems');
  if (hiddenEl) {
    if (d.hiddenGems && d.hiddenGems.length) {
      hiddenEl.innerHTML = d.hiddenGems.map(g => `
        <div class="highlight-card">
          <div class="highlight-icon">${g.emoji || '💎'}</div>
          <div class="highlight-body">
            <div class="highlight-name">${g.name}</div>
            <div class="highlight-type" style="font-size:0.75rem;color:var(--teal);margin-bottom:4px">${g.type || ''}</div>
            <div class="highlight-desc">${g.desc}</div>
          </div>
        </div>`).join('');
    } else {
      const block = hiddenEl.closest('.content-block');
      if (block) block.style.display = 'none';
    }
  }

  // アクティビティ
  const actEl = document.querySelector('#pref-activities');
  if (actEl) {
    if (d.activities && d.activities.length) {
      actEl.innerHTML = d.activities.map(a => `
        <div class="activity-item">
          <span class="activity-icon">${a.emoji || '🎯'}</span>
          <div class="activity-body">
            <div class="activity-name">${a.name} <span class="activity-season">${a.season || ''}</span></div>
            <div class="activity-desc">${a.desc}</div>
          </div>
        </div>`).join('');
    } else {
      const block = actEl.closest('.content-block');
      if (block) block.style.display = 'none';
    }
  }

  // モデルコース（複数コース対応）
  const courseEl = document.querySelector('#pref-course');
  const courseBlock = courseEl?.closest('.content-block');
  if (courseEl) {
    if (d.models) {
      const COURSE_LABELS = {
        halfDay:    { label: '半日', icon: '🌅' },
        oneDay:     { label: '1日',  icon: '☀️' },
        oneNight:   { label: '1泊2日', icon: '🌙' },
        twoNights:  { label: '2泊3日', icon: '🗓️' },
        threeNights:{ label: '3泊4日', icon: '✈️' },
      };
      const keys = ['halfDay','oneDay','oneNight','twoNights','threeNights'].filter(k => d.models[k]);
      if (keys.length > 0) {
        const renderCourse = (m) => {
          const items = m.steps
            ? m.steps.map((s, i) => ({ num: i + 1, title: typeof s === 'string' ? s : (s.spot || s.title || s), desc: typeof s === 'object' ? (s.desc || '') : '' }))
            : (m.days || []).map((s, i) => ({ num: i + 1, title: s.title || s, desc: s.desc || '' }));
          return items.map(s => `
            <div class="course-step">
              <div class="step-badge">${s.num}</div>
              <div class="step-content">
                <h4>${s.title}</h4>
                ${s.desc ? `<p>${s.desc}</p>` : ''}
              </div>
            </div>`).join('');
        };
        if (keys.length === 1) {
          const m = d.models[keys[0]];
          courseEl.innerHTML = `<div class="course-label">${COURSE_LABELS[keys[0]].icon} ${m.title || COURSE_LABELS[keys[0]].label}</div>` + renderCourse(m);
        } else {
          const tabs = keys.map((k, i) => `<button class="course-tab${i===0?' active':''}" data-key="${k}">${COURSE_LABELS[k].icon} ${COURSE_LABELS[k].label}</button>`).join('');
          const panels = keys.map((k, i) => {
            const m = d.models[k];
            return `<div class="course-panel${i===0?' active':''}" data-key="${k}">
              <div class="course-label">${m.title || ''}</div>
              ${renderCourse(m)}
            </div>`;
          }).join('');
          courseEl.innerHTML = `<div class="course-tabs">${tabs}</div><div class="course-panels">${panels}</div>`;
          courseEl.querySelectorAll('.course-tab').forEach(btn => {
            btn.addEventListener('click', () => {
              const key = btn.dataset.key;
              courseEl.querySelectorAll('.course-tab').forEach(b => b.classList.remove('active'));
              courseEl.querySelectorAll('.course-panel').forEach(p => p.classList.remove('active'));
              btn.classList.add('active');
              courseEl.querySelector(`.course-panel[data-key="${key}"]`).classList.add('active');
            });
          });
        }
      }
    } else if (courseBlock) {
      courseBlock.style.display = 'none';
    }
  }

  // アクセス
  const accessEl = document.querySelector('#pref-access');
  if (accessEl && d.access) {
    const entries = Object.entries(d.access).filter(([k]) => k !== 'tip');
    accessEl.innerHTML = entries.map(([from, info]) => `
      <div class="access-item">
        <span class="access-label">${from === 'fromTokyo' ? '東京' : from === 'fromOsaka' ? '大阪' : from}発</span>
        <span>${info}</span>
      </div>`).join('');
    if (d.access.tip) {
      accessEl.insertAdjacentHTML('beforeend', `<div class="access-item" style="color:var(--teal);font-weight:600"><span class="access-label">💡 Tip</span><span>${d.access.tip}</span></div>`);
    }
  }

  // ノアコメント
  setEl('#noa-comment', d.noaComment);

  // 予約
  const bookEl = document.querySelector('#pref-booking');
  if (bookEl && d.booking) {
    const BOOKING_URLS = {
      '楽天トラベル': 'https://travel.rakuten.co.jp/',
      '一休.com': 'https://www.ikyu.com/',
      'じゃらん': 'https://www.jalan.net/',
      'JTB': 'https://www.jtb.co.jp/',
      'Relux': 'https://rlux.jp/',
    };
    const BOOKING_LOGOS = {
      '楽天トラベル': '🔴',
      '一休.com': '🟠',
      'じゃらん': '🟢',
      'JTB': '🔵',
      'Relux': '⚫',
    };
    const btns = (d.booking.recommended || []).map(name => {
      const url = BOOKING_URLS[name] || '#';
      const logo = BOOKING_LOGOS[name] || '🏨';
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="booking-pref-btn">
        <span>${logo}</span><span>${name}で探す</span>
      </a>`;
    }).join('');
    bookEl.innerHTML = `
      <div class="booking-pref-btns">${btns}</div>
      ${d.booking.tip ? `<p class="booking-pref-tip">💡 ${d.booking.tip}</p>` : ''}
      <p class="booking-pref-note">※価格・空室状況は各サイトでご確認ください</p>`;
  }

  // お土産・名産品
  const souvBlock = document.querySelector('#pref-souvenirs-block');
  const souvEl = document.querySelector('#pref-souvenirs');
  if (souvEl && window.SOUVENIRS_DATA) {
    const items = SOUVENIRS_DATA[id];
    if (items && items.length) {
      souvEl.innerHTML = items.map(s => `
        <div class="souvenir-item">
          <div class="souvenir-icon">${s.genre.includes('洋菓子') || s.genre.includes('和菓子') ? '🍡' : s.genre.includes('酒') ? '🍶' : s.genre.includes('海産') || s.genre.includes('水産') ? '🐟' : s.genre.includes('肉') ? '🥩' : s.genre.includes('果物') ? '🍊' : s.genre.includes('工芸') ? '🏺' : s.genre.includes('茶') ? '🍵' : s.genre.includes('麺') ? '🍜' : '🎁'}</div>
          <div class="souvenir-body">
            <div class="souvenir-name">${s.name}</div>
            <div class="souvenir-genre">${s.genre}</div>
            <div class="souvenir-desc">${s.desc}</div>
          </div>
        </div>`).join('');
    } else if (souvBlock) {
      souvBlock.style.display = 'none';
    }
  }
};

/* ===== 温泉テンプレートレンダリング ===== */
window.renderOnsenPage = function() {
  const id = getPageParam('id');
  if (!id || !window.ONSENS_DATA) return;

  const d = ONSENS_DATA[id];
  if (!d) return;

  document.title = `${d.name} 温泉ガイド | 旅する日本図鑑`;
  let onsenCanonical = document.querySelector('link[rel="canonical"]');
  if (!onsenCanonical) { onsenCanonical = document.createElement('link'); onsenCanonical.rel = 'canonical'; document.head.appendChild(onsenCanonical); }
  onsenCanonical.href = `https://tabisuru-nihon.github.io/templates/onsen.html?id=${id}`;
  const onsenOgUrl = document.querySelector('meta[property="og:url"]');
  if (onsenOgUrl) onsenOgUrl.setAttribute('content', onsenCanonical.href);

  // 専用写真がある温泉のみ記載。ない場合はグラデーション背景を使用
  const ONSEN_HERO_IMGS = {
    noboribetsu: 'images/japan/hokkaido/hokkaido-noboribetsu-jigokudani-01.jpg',
    kusatsu:     'images/japan/gunma/gunma-kusatsu-yunohata-01.jpg',
    hakone:      'images/japan/kanagawa/kanagawa-hakone-yumoto-01.jpg',
    atami:       'images/japan/shizuoka/shizuoka-atami-onsen-01.jpg',
    arima:       'images/japan/hyogo/hyogo-arima-kinsenkawa-01.jpg',
    kinosaki:    'images/japan/hyogo/hyogo-kinosaki-01.jpg',
    shirahama:   'images/japan/wakayama/wakayama-shirahama-beach-01.jpg',
    dogo:        'images/japan/ehime/ehime-dogo-honkan-01.jpg',
    beppu:       'images/japan/oita/oita-beppu-01.jpg',
    nyuto:       'images/japan/akita/akita-nyutou-onsen-01.jpg',
    zao:         'images/japan/yamagata/yamagata-zao-02.jpg',
    ginzan:      'images/japan/yamagata/yamagata-ginzan-01.jpg',
    sukayu:      'images/japan/aomori/aomori-oirase-01.jpg',
    tsukioka:    'images/japan/niigata/niigata-landscape-01.jpg',
  };
  const heroImg = ONSEN_HERO_IMGS[id];
  const hero = document.querySelector('.onsen-hero');
  if (hero) {
    if (heroImg) {
      hero.style.background = `linear-gradient(to bottom, rgba(12,27,53,0.5) 0%, rgba(12,27,53,0.75) 100%), url(../${heroImg}) center/cover no-repeat`;
    } else {
      hero.style.background = `linear-gradient(135deg, ${d.color || '#0c1b35'}, #1a3060)`;
    }
  }

  setEl('#onsen-name', `${d.emoji} ${d.name}`);
  setEl('#onsen-pref', d.name);
  setEl('#onsen-pref-area', d.prefecture + (d.area ? ` / ${d.area}` : ''));
  setEl('#onsen-tagline', d.tagline);
  setEl('#onsen-why', d.whyFamous);

  // 泉質
  const springsEl = document.querySelector('#onsen-springs');
  if (springsEl && d.springs) {
    springsEl.innerHTML = d.springs.map(s => `<span class="suit-tag">${s}</span>`).join('');
  }

  // 見どころ
  if (d.features && d.features.length) {
    const featEl = document.querySelector('#onsen-features');
    const featBlock = document.querySelector('#features-block');
    if (featEl && featBlock) {
      featEl.innerHTML = d.features.map(f => `<div class="highlight-card"><div class="highlight-name">📍 ${f}</div></div>`).join('');
      featBlock.style.display = '';
    }
  }

  // 向いている人
  const suitsEl = document.querySelector('#onsen-suits');
  if (suitsEl && d.suits) {
    suitsEl.innerHTML = `
      <div class="suits-perfect"><div class="suits-label">✅ 特におすすめ</div><div class="suits-items">${(d.suits.perfect || []).join('<br>')}</div></div>
      <div class="suits-good"><div class="suits-label">👍 向いている</div><div class="suits-items">${(d.suits.good || []).join('<br>')}</div></div>
      <div class="suits-not"><div class="suits-label">⚠️ 向かない場合</div><div class="suits-items">${(d.suits.notIdeal || []).join('<br>')}</div></div>
    `;
  }

  // 比較
  const compEl = document.querySelector('#onsen-comparison');
  if (compEl && d.comparison) {
    const VS_NAMES = {
      vsKusatsu:'草津温泉', vsArima:'有馬温泉', vsHakone:'箱根温泉', vsKinosaki:'城崎温泉',
      vsYufuin:'湯布院', vsBeppu:'別府温泉', vsNoboribetsu:'登別温泉', vsAtami:'熱海温泉',
      vsNyuto:'乳頭温泉郷', vsKurokawa:'黒川温泉', vsGero:'下呂温泉', vsZao:'蔵王温泉',
      vsJozankei:'定山渓温泉', vsIzu:'伊豆', vsOkinawa:'沖縄', vsDogo:'道後温泉',
    };
    compEl.innerHTML = Object.entries(d.comparison).map(([key, text]) => {
      const vsName = VS_NAMES[key] || key.replace(/^vs/, '');
      return `<div class="comparison-card">
        <div class="comparison-title">vs ${vsName}</div>
        <div class="comparison-text">${text}</div>
      </div>`;
    }).join('');
  }

  // ノアコメント
  setEl('#noa-comment', d.noaComment);
};

/* ===== 月別テンプレートレンダリング ===== */
window.renderMonthlyPage = function() {
  const month = parseInt(getPageParam('month'));
  if (!month || !window.MONTHLY_DATA) return;

  const d = MONTHLY_DATA[month];
  if (!d) return;

  document.title = `${month}月の国内旅行おすすめ | 旅する日本図鑑`;
  let monthCanonical = document.querySelector('link[rel="canonical"]');
  if (!monthCanonical) { monthCanonical = document.createElement('link'); monthCanonical.rel = 'canonical'; document.head.appendChild(monthCanonical); }
  monthCanonical.href = `https://tabisuru-nihon.github.io/templates/monthly-detail.html?month=${month}`;
  const monthOgUrl = document.querySelector('meta[property="og:url"]');
  if (monthOgUrl) monthOgUrl.setAttribute('content', monthCanonical.href);

  setEl('#month-num', `${month}月`);
  setEl('#month-name', d.name);
  setEl('#month-theme', d.theme);
  setEl('#month-weather', d.weather);
  setEl('#month-tip', d.tip);

  // pros/cons
  const prosEl = document.querySelector('#month-pros');
  if (prosEl && d.pros) {
    prosEl.innerHTML = d.pros.map(p => `<li style="padding:4px 0;font-size:0.85rem">✅ ${p}</li>`).join('');
  }
  const consEl = document.querySelector('#month-cons');
  if (consEl && d.cons) {
    consEl.innerHTML = d.cons.map(c => `<li style="padding:4px 0;font-size:0.85rem">⚠️ ${c}</li>`).join('');
  }

  // おすすめスポット
  const picksEl = document.querySelector('#month-picks');
  if (picksEl && d.picks) {
    picksEl.innerHTML = d.picks.map(p => `
      <div class="monthly-pick-card">
        <div class="pick-header">
          <div class="pick-emoji">${p.emoji || '📍'}</div>
          <div>
            <div class="pick-name">${p.name}</div>
            <div class="pick-pref">${p.prefecture || ''}</div>
          </div>
        </div>
        <div class="pick-reason">${p.reason}</div>
        ${p.suitableFor ? `<div class="pick-suitable">${p.suitableFor.map(s => `<span class="suitable-tag">${s}</span>`).join('')}</div>` : ''}
        ${p.tip ? `<div style="margin-top:8px;font-size:0.75rem;color:var(--teal);font-weight:600">💡 ${p.tip}</div>` : ''}
      </div>`).join('');
  }
};

/* ===== ヘルパー ===== */
function setEl(selector, text) {
  const el = document.querySelector(selector);
  if (el && text !== undefined) el.textContent = text;
}
