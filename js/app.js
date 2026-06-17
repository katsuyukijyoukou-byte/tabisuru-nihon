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

  /* ===== 注目の旅先（日替わりランダム5件） ===== */
  renderFeaturedDest();

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

  /* ===== 動的カードのImpression観測を追加登録 ===== */
  if (window.Track && window.Track.observe) {
    window.Track.observe(document);
  }
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

/* ===== 注目の旅先データ（18件プール） ===== */
const FEATURED_DESTS = [
  { id: 'hiroshima', name: '広島',        region: '中国地方', img: 'images/japan/hiroshima/hiroshima-miyajima-torii-01.jpg',   alt: '広島県宮島の厳島神社大鳥居と夕日',       copy: '世界遺産・厳島神社の大鳥居が海に浮かぶ絶景。歴史と自然が共存する旅先。', manualBoost: 1000 },
  { id: 'kyoto',     name: '京都',        region: '近畿',     img: 'images/japan/kyoto/kyoto-fushimi-inari-01.jpg',              alt: '京都・伏見稲荷大社の千本鳥居',           copy: '伏見稲荷・嵐山・祇園。日本の伝統文化と美しい社寺。',                   manualBoost: 500 },
  { id: 'hokkaido',  name: '北海道',      region: '北海道',   img: 'images/japan/hokkaido/hokkaido-biei-flower-field-01.jpg',    alt: '北海道美瑛の丘と花畑',                   copy: '大自然と絶品グルメ。ラベンダー・知床・流氷と四季の顔を持つ大地。',       manualBoost: 300 },
  { id: 'tokyo',     name: '東京',        region: '関東',     img: 'images/japan/tokyo/tokyo-asakusa-sensoji-01.jpg',            alt: '東京浅草の浅草寺',                       copy: '浅草・渋谷・新宿。下町の情緒と最先端が共存する首都。',                   manualBoost: 0 },
  { id: 'okinawa',   name: '沖縄',        region: '九州・沖縄', img: 'images/japan/okinawa/okinawa-sea-coast-02.jpg',            alt: '沖縄の青い海と海岸',                     copy: 'エメラルドグリーンの海・首里城・独自の食文化。',                         manualBoost: 300 },
  { id: 'osaka',     name: '大阪',        region: '近畿',     img: 'images/japan/osaka/osaka-castle-01.jpg',                    alt: '大阪城',                                 copy: '道頓堀・黒門市場・たこ焼き・大阪城。食い倒れの街。',                     manualBoost: 0 },
  { id: 'nara',      name: '奈良',        region: '近畿',     img: 'images/japan/nara/nara-todaiji-02.jpg',                     alt: '奈良・東大寺大仏殿',                     copy: '世界遺産と野生の鹿が共存する古都。東大寺・吉野山。',                     manualBoost: 0 },
  { id: 'hyogo',     name: '兵庫',        region: '近畿',     img: 'images/japan/hyogo/hyogo-himeji-01.jpg',                    alt: '世界遺産・姫路城',                       copy: '世界遺産・姫路城と有馬温泉・神戸の洋館。',                               manualBoost: 0 },
  { id: 'nagano',    name: '長野',        region: '中部',     img: 'images/japan/nagano/nagano-kamikochi-01.jpg',               alt: '長野・上高地と穂高連峰',                 copy: '上高地・松本城・善光寺・野沢温泉。アルプスの絶景。',                     manualBoost: 0 },
  { id: 'kanagawa',  name: '神奈川',      region: '関東',     img: 'images/japan/kanagawa/kanagawa-hakone-yumoto-01.jpg',        alt: '神奈川・箱根湯本の温泉街',               copy: '鎌倉大仏・箱根温泉・横浜中華街。東京から日帰りも。',                     manualBoost: 0 },
  { id: 'ishikawa',  name: '石川（金沢）', region: '中部',    img: 'images/japan/ishikawa/ishikawa-kanazawa-01.jpg',            alt: '石川・兼六園',                           copy: '兼六園・ひがし茶屋街・近江町市場。西の京都。',                           manualBoost: 0 },
  { id: 'fukuoka',   name: '福岡',        region: '九州',     img: 'images/japan/fukuoka/fukuoka-dazaifu-02.jpg',               alt: '福岡・太宰府天満宮',                     copy: '太宰府天満宮・博多ラーメン・中洲屋台。九州随一の食文化。',               manualBoost: 0 },
  { id: 'nagasaki',  name: '長崎',        region: '九州',     img: 'images/japan/nagasaki/nagasaki-inasa-night-01.jpg',         alt: '長崎の夜景',                             copy: 'グラバー園・ハウステンボス・軍艦島と日本三大夜景。',                     manualBoost: 0 },
  { id: 'gifu',      name: '岐阜（白川郷）', region: '中部',  img: 'images/japan/gifu/gifu-shirakawago-01.jpg',                 alt: '岐阜・白川郷の合掌造り集落',             copy: '世界遺産・合掌造り集落と冬の雪景色が圧巻。',                             manualBoost: 0 },
  { id: 'yamagata',  name: '山形',        region: '東北',     img: 'images/japan/yamagata/yamagata-zao-02.jpg',                 alt: '山形・蔵王の樹氷',                       copy: '蔵王の樹氷・銀山温泉・さくらんぼ。東北屈指の温泉。',                     manualBoost: 0 },
  { id: 'tochigi',   name: '栃木（日光）', region: '関東',    img: 'images/japan/tochigi/tochigi-nikko-01.jpg',                 alt: '栃木・日光東照宮',                       copy: '世界遺産・日光東照宮と華厳の滝。鬼怒川温泉も。',                         manualBoost: 0 },
  { id: 'yamanashi', name: '山梨（富士五湖）', region: '中部', img: 'images/japan/yamanashi/yamanashi-fuji-lake-02.jpg',         alt: '山梨・河口湖と富士山',                   copy: '河口湖から眺める富士山は日本一の絶景。ほうとうも必食。',                 manualBoost: 0 },
  { id: 'miyagi',    name: '宮城（松島）', region: '東北',    img: 'images/japan/miyagi/miyagi-matsushima-03.jpg',              alt: '宮城・松島の島々',                       copy: '日本三景・松島と牛タン・ずんだ餅。東北の中心地。',                       manualBoost: 0 },
];

/* ===== LCG 疑似乱数（日付シード） ===== */
function seededRNG(seed) {
  let s = (seed >>> 0) || 1;
  return function () {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ===== 注目の旅先レンダリング（日替わりランダム5件） ===== */
function renderFeaturedDest() {
  const container = document.getElementById('featured-dest');
  if (!container) return;

  /* 日付シード（毎日変わる、同日中は同じ） */
  const t = new Date();
  const seed = t.getFullYear() * 10000 + (t.getMonth() + 1) * 100 + t.getDate();
  const rng = seededRNG(seed);

  /* 広島を必ず含む + 残り4件をランダム選出 */
  const hiroshima = FEATURED_DESTS.find(d => d.id === 'hiroshima');
  const pool = FEATURED_DESTS.filter(d => d.id !== 'hiroshima');

  /* Fisher-Yates shuffle (seeded) */
  const shuffled = pool.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
  }
  const five = [hiroshima].concat(shuffled.slice(0, 4));

  /* 5件の表示順もシャッフル（広島の位置もランダム） */
  for (let i = five.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = five[i]; five[i] = five[j]; five[j] = tmp;
  }

  /* レイアウト：big(0) + med×2(1,2) + small×2(3,4) */
  function ta(d) {
    return 'data-track-category="featured" data-track-id="' + d.id + '" data-track-title="' + d.name + '" data-track-type="card"';
  }
  function bigCard(d) {
    return '<a class="feat-big" href="' + ROOT + 'templates/prefecture.html?id=' + d.id + '" ' + ta(d) + '>' +
      '<img src="' + ROOT + d.img + '" alt="' + d.alt + '" loading="lazy">' +
      '<div class="feat-overlay">' +
        '<div class="feat-region-label">' + d.region + '</div>' +
        '<div class="feat-name-label">' + d.name + '</div>' +
        '<div class="feat-copy-label">' + d.copy + '</div>' +
        '<span class="feat-btn">詳細を見る →</span>' +
      '</div></a>';
  }
  function medCard(d) {
    return '<a class="feat-med" href="' + ROOT + 'templates/prefecture.html?id=' + d.id + '" ' + ta(d) + '>' +
      '<img src="' + ROOT + d.img + '" alt="' + d.alt + '" loading="lazy">' +
      '<div class="feat-overlay">' +
        '<div class="feat-region-label">' + d.region + '</div>' +
        '<div class="feat-name-label">' + d.name + '</div>' +
        '<div class="feat-copy-label">' + d.copy + '</div>' +
        '<span class="feat-btn">詳細を見る →</span>' +
      '</div></a>';
  }
  function smallCard(d) {
    return '<a class="dest-photo-card" href="' + ROOT + 'templates/prefecture.html?id=' + d.id + '" ' + ta(d) + '>' +
      '<img src="' + ROOT + d.img + '" alt="' + d.alt + '" loading="lazy">' +
      '<div class="dest-photo-overlay">' +
        '<div class="dpo-region">' + d.region + '</div>' +
        '<div class="dpo-name">' + d.name + '</div>' +
        '<div class="dpo-copy">' + d.copy + '</div>' +
      '</div></a>';
  }

  container.innerHTML =
    '<div class="feat-editorial">' +
      bigCard(five[0]) +
      '<div class="feat-med-col">' + medCard(five[1]) + medCard(five[2]) + '</div>' +
    '</div>' +
    '<div class="dest-small-grid" style="grid-template-columns:repeat(2,1fr);margin-top:16px">' +
      smallCard(five[3]) + smallCard(five[4]) +
    '</div>';
}

/* ===== 地域アコーディオン（トップページ用） ===== */
function renderRegionMap() {
  const accordion = document.getElementById('region-accordion');
  if (!accordion) return;

  /* 地方データ定義（7グループ） */
  const REGIONS = [
    {
      id: 'hokkaido-tohoku', name: '北海道・東北', emoji: '⛄',
      color: '#dbeafe', stroke: '#60a5fa',
      countLabel: '7県',
      prefs: ['北海道','青森','岩手','宮城','秋田','山形','福島'],
      prefIds: ['hokkaido','aomori','iwate','miyagi','akita','yamagata','fukushima'],
    },
    {
      id: 'kanto', name: '関東', emoji: '🗼',
      color: '#fef3c7', stroke: '#f59e0b',
      countLabel: '7県',
      prefs: ['茨城','栃木','群馬','埼玉','千葉','東京','神奈川'],
      prefIds: ['ibaraki','tochigi','gunma','saitama','chiba','tokyo','kanagawa'],
    },
    {
      id: 'koshinetsu-hokuriku', name: '甲信越・北陸', emoji: '🏔️',
      color: '#e0f2fe', stroke: '#38bdf8',
      countLabel: '6県',
      prefs: ['新潟','富山','石川','福井','山梨','長野'],
      prefIds: ['niigata','toyama','ishikawa','fukui','yamanashi','nagano'],
    },
    {
      id: 'tokai', name: '東海', emoji: '🍵',
      color: '#fff7ed', stroke: '#fb923c',
      countLabel: '4県',
      prefs: ['岐阜','静岡','愛知','三重'],
      prefIds: ['gifu','shizuoka','aichi','mie'],
    },
    {
      id: 'kinki', name: '近畿', emoji: '⛩️',
      color: '#fce7f3', stroke: '#f472b6',
      countLabel: '6府県',
      prefs: ['滋賀','京都','大阪','兵庫','奈良','和歌山'],
      prefIds: ['shiga','kyoto','osaka','hyogo','nara','wakayama'],
    },
    {
      id: 'chugoku-shikoku', name: '中国・四国', emoji: '🍊',
      color: '#ede9fe', stroke: '#a78bfa',
      countLabel: '9県',
      prefs: ['鳥取','島根','岡山','広島','山口','徳島','香川','愛媛','高知'],
      prefIds: ['tottori','shimane','okayama','hiroshima','yamaguchi','tokushima','kagawa','ehime','kochi'],
    },
    {
      id: 'kyushu-okinawa', name: '九州・沖縄', emoji: '🌺',
      color: '#fee2e2', stroke: '#f87171',
      countLabel: '8県',
      prefs: ['福岡','佐賀','長崎','熊本','大分','宮崎','鹿児島','沖縄'],
      prefIds: ['fukuoka','saga','nagasaki','kumamoto','oita','miyazaki','kagoshima','okinawa'],
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
        <span class="racc-count">${region.countLabel || region.prefs.length + '県'}</span>
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
  // BreadcrumbList
  const prefBcScript = document.createElement('script');
  prefBcScript.type = 'application/ld+json';
  prefBcScript.textContent = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"TOP","item":"https://tabisuru-nihon.github.io/"},{"@type":"ListItem","position":2,"name":"都道府県一覧","item":"https://tabisuru-nihon.github.io/pages/prefectures.html"},{"@type":"ListItem","position":3,"name":d.name,"item":`https://tabisuru-nihon.github.io/templates/prefecture.html?id=${id}`}]});
  document.head.appendChild(prefBcScript);

  // heroの背景グラデーション + 代表写真
  const hero = document.querySelector('.pref-hero');
  if (hero) {
    const imgPath = `../images/japan/${id}/${id}-spot-${id.replace(/-/g,'')}-01.jpg`;
    const fallbackImg = `../images/japan/${id}/${id}-${id}-01.jpg`;
    // 県代表画像マッピング
    const PREF_HERO_IMGS = {
      hokkaido: '../images/japan/hokkaido/hokkaido-biei-flower-field-01.jpg',
      aomori: '../images/japan/aomori/aomori-oirase-01.jpg',
      iwate: '../images/japan/iwate/iwate-forest-01.jpg',
      miyagi: '../images/japan/miyagi/miyagi-matsushima-03.jpg',
      akita: '../images/japan/akita/akita-kakunodate-01.jpg',
      yamagata: '../images/japan/yamagata/yamagata-zao-02.jpg',
      fukushima: '../images/japan/fukushima/fukushima-lake-01.jpg',
      ibaraki: '../images/japan/ibaraki/ibaraki-hitachi-01.jpg',
      tochigi: '../images/japan/tochigi/tochigi-nikko-01.jpg',
      gunma: '../images/japan/gunma/gunma-kusatsu-01.jpg',
      saitama: '../images/japan/saitama/saitama-kawagoe-01.jpg',
      chiba: '../images/japan/chiba/chiba-naritasan-01.jpg',
      tokyo: '../images/japan/tokyo/tokyo-asakusa-sensoji-01.jpg',
      kanagawa: '../images/japan/kanagawa/kanagawa-hakone-yumoto-01.jpg',
      niigata: '../images/japan/niigata/niigata-shrine-01.jpg',
      toyama: '../images/japan/toyama/toyama-kurobe-01.jpg',
      ishikawa: '../images/japan/ishikawa/ishikawa-kanazawa-01.jpg',
      fukui: '../images/japan/fukui/fukui-tojinbo-02.jpg',
      yamanashi: '../images/japan/yamanashi/yamanashi-fuji-01.jpg',
      nagano: '../images/japan/nagano/nagano-alps-01.jpg',
      gifu: '../images/japan/gifu/gifu-shirakawago-01.jpg',
      shizuoka: '../images/japan/shizuoka/shizuoka-fuji-01.jpg',
      aichi: '../images/japan/aichi/aichi-nagoya-02.jpg',
      mie: '../images/japan/mie/mie-kumano-02.jpg',
      shiga: '../images/japan/shiga/shiga-biwako-01.jpg',
      kyoto: '../images/japan/kyoto/kyoto-fushimi-inari-01.jpg',
      osaka: '../images/japan/osaka/osaka-castle-01.jpg',
      hyogo: '../images/japan/hyogo/hyogo-himeji-castle-01.jpg',
      nara: '../images/japan/nara/nara-todaiji-02.jpg',
      wakayama: '../images/japan/wakayama/wakayama-nachi-01.jpg',
      tottori: '../images/japan/tottori/tottori-sand-dunes-01.jpg',
      shimane: '../images/japan/shimane/shimane-izumo-01.jpg',
      okayama: '../images/japan/okayama/okayama-kurashiki-02.jpg',
      hiroshima: '../images/japan/hiroshima/hiroshima-miyajima-torii-01.jpg',
      yamaguchi: '../images/japan/yamaguchi/yamaguchi-torii-02.jpg',
      tokushima: '../images/japan/tokushima/tokushima-naruto-01.jpg',
      kagawa: '../images/japan/kagawa/kagawa-ritsurin-01.jpg',
      ehime: '../images/japan/ehime/ehime-dogo-honkan-01.jpg',
      kochi: '../images/japan/kochi/kochi-castle-01.jpg',
      fukuoka: '../images/japan/fukuoka/fukuoka-dazaifu-02.jpg',
      saga: '../images/japan/saga/saga-balloon-01.jpg',
      nagasaki: '../images/japan/nagasaki/nagasaki-inasa-night-01.jpg',
      kumamoto: '../images/japan/kumamoto/kumamoto-castle-01.jpg',
      oita: '../images/japan/oita/oita-beppu-01.jpg',
      miyazaki: '../images/japan/miyazaki/miyazaki-takachiho-01.jpg',
      kagoshima: '../images/japan/kagoshima/kagoshima-sakurajima-03.jpg',
      okinawa: '../images/japan/okinawa/okinawa-sea-coast-02.jpg',
    };
    const heroImg = PREF_HERO_IMGS[id];
    if (heroImg) {
      hero.style.background = `linear-gradient(to bottom, rgba(12,27,53,0.55) 0%, rgba(12,27,53,0.75) 100%), url(${heroImg}) center/cover no-repeat`;
      const ogImgEl = document.querySelector('meta[property="og:image"]');
      if (ogImgEl) ogImgEl.setAttribute('content', 'https://tabisuru-nihon.github.io/' + heroImg.replace('../', ''));
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
      { src: '../images/japan/iwate/iwate-forest-01.jpg', alt: '岩手の深い杉木立と神社門' },
    ],
    miyagi: [
      { src: '../images/japan/miyagi/miyagi-matsushima-03.jpg', alt: '松島湾の岩島と松' },
      { src: '../images/japan/miyagi/miyagi-matsushima-04.jpg', alt: '松島の海景色' },
      // matsushima-01（真っ黒な画像）・matsushima-02（欧州針葉樹林）は使用禁止
    ],
    akita: [
      { src: '../images/japan/akita/akita-kakunodate-01.jpg', alt: '角館・武家屋敷の雪景色' },
      { src: '../images/japan/akita/akita-nyutou-onsen-01.jpg', alt: '乳頭温泉郷' },
    ],
    yamagata: [
      { src: '../images/japan/yamagata/yamagata-zao-02.jpg', alt: '蔵王の樹氷' },
      { src: '../images/japan/yamagata/yamagata-ginzan-02.jpg', alt: '銀山温泉の大正ロマン旅館' },
      // yamagata-ginzan-01（実験器具写真）は使用禁止
    ],
    fukushima: [
      { src: '../images/japan/fukushima/fukushima-lake-01.jpg', alt: '福島の紅葉と湖' },
      { src: '../images/japan/fukushima/fukushima-waterfall-02.jpg', alt: '福島の渓流' },
    ],
    ibaraki: [
      { src: '../images/japan/ibaraki/ibaraki-hitachi-01.jpg', alt: 'ひたち海浜公園・コキア' },
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
      { src: '../images/japan/chiba/chiba-naritasan-01.jpg', alt: '成田山の滝' },
      { src: '../images/japan/chiba/chiba-nokogiri-02.jpg', alt: '鋸山からの絶景' },
    ],
    tokyo: [
      { src: '../images/japan/tokyo/tokyo-asakusa-sensoji-01.jpg', alt: '浅草寺' },
      { src: '../images/japan/tokyo/tokyo-shibuya-01.jpg', alt: '渋谷スクランブル交差点' },
      { src: '../images/japan/tokyo/tokyo-shinjuku-01.jpg', alt: '新宿' },
      { src: '../images/japan/tokyo/tokyo-ueno-01.jpg', alt: '上野公園' },
    ],
    kanagawa: [
      { src: '../images/japan/kanagawa/kanagawa-hakone-ashinoko-01.jpg', alt: '箱根・芦ノ湖と富士山' },
      { src: '../images/japan/kanagawa/kanagawa-hakone-yumoto-01.jpg', alt: '箱根湯本の温泉街' },
    ],
    niigata: [
      { src: '../images/japan/niigata/niigata-shrine-01.jpg', alt: '新潟・雪の神社' },
    ],
    toyama: [
      { src: '../images/japan/toyama/toyama-kurobe-01.jpg', alt: '黒部峡谷トロッコと紅葉' },
      { src: '../images/japan/toyama/toyama-kurobe-02.jpg', alt: '黒部峡谷の滝' },
    ],
    ishikawa: [
      { src: '../images/japan/ishikawa/ishikawa-kanazawa-01.jpg', alt: '金沢' },
      { src: '../images/japan/ishikawa/ishikawa-kenroku-01.jpg', alt: '兼六園' },
    ],
    fukui: [
      { src: '../images/japan/fukui/fukui-tojinbo-02.jpg', alt: '東尋坊の柱状節理と日本海' },
      { src: '../images/japan/fukui/fukui-eiheiji-01.jpg', alt: '永平寺の参道と杉木立' },
      { src: '../images/japan/fukui/fukui-nature-02.jpg', alt: '越前海岸の柱状節理' },
    ],
    yamanashi: [
      { src: '../images/japan/yamanashi/yamanashi-fuji-01.jpg', alt: '富士山と山梨の街並み' },
      { src: '../images/japan/yamanashi/yamanashi-fuji-lake-02.jpg', alt: '富士山・湖の夜明け' },
    ],
    nagano: [
      { src: '../images/japan/nagano/nagano-alps-01.jpg', alt: '北アルプスの山岳風景' },
      { src: '../images/japan/nagano/nagano-jigokudani-01.jpg', alt: '地獄谷野猿公苑・スノーモンキー' },
      // nagano-hakuba-01（パスポート写真）は使用禁止
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
      { src: '../images/japan/aichi/aichi-nagoya-02.jpg', alt: '名古屋城' },
      { src: '../images/japan/aichi/aichi-unagi-01.jpg', alt: '名古屋グルメ・ひつまぶし' },
      // aichi-nagoya-castle-01（アニメキャラ）は使用禁止
    ],
    mie: [
      { src: '../images/japan/mie/mie-ise-coast-01.jpg', alt: '伊勢海岸' },
      { src: '../images/japan/mie/mie-kumano-02.jpg', alt: '熊野古道' },
    ],
    shiga: [
      { src: '../images/japan/shiga/shiga-biwako-01.jpg', alt: '琵琶湖と雪の比良山系' },
      { src: '../images/japan/shiga/shiga-hikone-02.jpg', alt: '彦根城' },
    ],
    kyoto: [
      { src: '../images/japan/kyoto/kyoto-fushimi-inari-01.jpg', alt: '伏見稲荷大社' },
      { src: '../images/japan/kyoto/kyoto-kinkakuji-01.jpg', alt: '金閣寺' },
      { src: '../images/japan/kyoto/kyoto-arashiyama-01.jpg', alt: '嵐山' },
    ],
    osaka: [
      { src: '../images/japan/osaka/osaka-castle-01.jpg', alt: '大阪城' },
      { src: '../images/japan/osaka/osaka-kuromon-02.jpg', alt: '黒門市場' },
      // osaka-dotonbori-01（京都清水寺の市街展望）は使用禁止
    ],
    hyogo: [
      { src: '../images/japan/hyogo/hyogo-himeji-castle-01.jpg', alt: '姫路城と庭園' },
      { src: '../images/japan/hyogo/hyogo-kobe-port-02.jpg', alt: '神戸ポートタワー' },
    ],
    nara: [
      { src: '../images/japan/nara/nara-todaiji-02.jpg', alt: '東大寺大仏殿' },
      { src: '../images/japan/nara/nara-deer-02.jpg', alt: '奈良公園の鹿' },
    ],
    wakayama: [
      { src: '../images/japan/wakayama/wakayama-nachi-01.jpg', alt: '那智の滝' },
      { src: '../images/japan/wakayama/wakayama-seigantoji-02.jpg', alt: '青岸渡寺と那智の滝' },
    ],
    tottori: [
      { src: '../images/japan/tottori/tottori-sand-dunes-01.jpg', alt: '鳥取砂丘の夕景' },
      { src: '../images/japan/tottori/tottori-coast-02.jpg', alt: '鳥取の海岸' },
    ],
    shimane: [
      { src: '../images/japan/shimane/shimane-izumo-01.jpg', alt: '出雲大社' },
      { src: '../images/japan/shimane/shimane-shrine-02.jpg', alt: '島根の神社参道' },
    ],
    okayama: [
      { src: '../images/japan/okayama/okayama-kurashiki-02.jpg', alt: '倉敷美観地区・川下り' },
      // okayama-kurashiki-01（薬の仕分けケース）は使用禁止
    ],
    hiroshima: [
      { src: '../images/japan/hiroshima/hiroshima-miyajima-torii-01.jpg', alt: '宮島の大鳥居' },
      { src: '../images/japan/hiroshima/hiroshima-itsukushima-shrine-02.jpg', alt: '厳島神社' },
      { src: '../images/japan/hiroshima/hiroshima-miyajima-02.jpg', alt: '宮島の風景' },
      { src: '../images/japan/hiroshima/hiroshima-miyajima-03.jpg', alt: '宮島の鹿と社殿' },
      // hiroshima-peace-memorial-01（サグラダファミリア）は使用禁止
    ],
    yamaguchi: [
      { src: '../images/japan/yamaguchi/yamaguchi-torii-02.jpg', alt: '元乃隅神社・海に続く鳥居' },
      // yamaguchi-coast-01（ビッグベン・英国）は使用禁止
    ],
    tokushima: [
      { src: '../images/japan/tokushima/tokushima-naruto-01.jpg', alt: '大鳴門橋と鳴門海峡' },
      { src: '../images/japan/tokushima/tokushima-bridge-02.jpg', alt: '徳島の橋・川' },
    ],
    kagawa: [
      { src: '../images/japan/kagawa/kagawa-ritsurin-01.jpg', alt: '栗林公園の池と紅葉' },
      { src: '../images/japan/kagawa/kagawa-naoshima-02.jpg', alt: '直島・アート島' },
    ],
    ehime: [
      { src: '../images/japan/ehime/ehime-dogo-01.jpg', alt: '道後温泉' },
      { src: '../images/japan/ehime/ehime-dogo-02.jpg', alt: '道後温泉本館' },
    ],
    kochi: [
      { src: '../images/japan/kochi/kochi-castle-01.jpg', alt: '高知城と石段' },
      { src: '../images/japan/kochi/kochi-nature-02.jpg', alt: '高知の清流・自然' },
    ],
    fukuoka: [
      { src: '../images/japan/fukuoka/fukuoka-dazaifu-02.jpg', alt: '太宰府天満宮' },
      { src: '../images/japan/fukuoka/fukuoka-ramen-01.jpg', alt: '福岡・博多ラーメン' },
      // fukuoka-city-01（目黒川夜桜・東京）は使用禁止
    ],
    saga: [
      { src: '../images/japan/saga/saga-balloon-01.jpg', alt: '佐賀インターナショナルバルーンフェスタ' },
      // saga-castle-01（シカゴ高層ビル・米国）は使用禁止
    ],
    nagasaki: [
      { src: '../images/japan/nagasaki/nagasaki-inasa-night-01.jpg', alt: '稲佐山からの長崎夜景' },
      // nagasaki-harbor-01（ダイビング写真）・nagasaki-nightview-02（渋谷夜景・東京）は使用禁止
    ],
    oita: [
      { src: '../images/japan/oita/oita-beppu-01.jpg', alt: '別府温泉' },
      { src: '../images/japan/oita/oita-yufuin-01.jpg', alt: '由布院の風景' },
      // oita-aso-01（使用禁止）
    ],
    miyazaki: [
      { src: '../images/japan/miyazaki/miyazaki-takachiho-01.jpg', alt: '高千穂峡・真名井の滝' },
      { src: '../images/japan/miyazaki/miyazaki-shrine-02.jpg', alt: '宮崎神宮' },
    ],
    kagoshima: [
      { src: '../images/japan/kagoshima/kagoshima-sakurajima-03.jpg', alt: '桜島の噴煙と錦江湾' },
      // kagoshima-nature-01（イタリア・ドロミテ）は使用禁止
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

  // 向かない人
  const notIdealEl = document.querySelector('#pref-not-ideal');
  const notIdealCard = document.querySelector('#not-ideal-card');
  if (notIdealEl && notIdealCard && d.notIdealFor && d.notIdealFor.length) {
    notIdealCard.style.display = '';
    notIdealEl.innerHTML = d.notIdealFor.map(s =>
      `<div style="padding:7px 10px;background:var(--section-alt);border-radius:8px;font-size:0.8rem;color:var(--text-light)">⚠️ ${s.reason||s}</div>`
    ).join('');
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
  if (!d) {
    const body = document.querySelector('.pref-body .container');
    if (body) body.innerHTML = `<div style="text-align:center;padding:80px 20px"><p style="font-size:1.1rem;color:var(--text-muted);margin-bottom:24px">温泉地「${id}」の情報が見つかりませんでした。</p><a href="../pages/onsen.html" style="display:inline-block;padding:12px 28px;background:var(--teal);color:white;border-radius:8px;text-decoration:none;font-weight:700">← 温泉地一覧へ戻る</a></div>`;
    document.title = '温泉地が見つかりません | 旅する日本図鑑';
    return;
  }

  document.title = `${d.name} 温泉ガイド | 旅する日本図鑑`;
  let onsenCanonical = document.querySelector('link[rel="canonical"]');
  if (!onsenCanonical) { onsenCanonical = document.createElement('link'); onsenCanonical.rel = 'canonical'; document.head.appendChild(onsenCanonical); }
  onsenCanonical.href = `https://tabisuru-nihon.github.io/templates/onsen.html?id=${id}`;
  const onsenOgUrl = document.querySelector('meta[property="og:url"]');
  // BreadcrumbList
  const onsenBcScript = document.createElement('script');
  onsenBcScript.type = 'application/ld+json';
  onsenBcScript.textContent = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"TOP","item":"https://tabisuru-nihon.github.io/"},{"@type":"ListItem","position":2,"name":"温泉地一覧","item":"https://tabisuru-nihon.github.io/pages/onsen.html"},{"@type":"ListItem","position":3,"name":d.name,"item":`https://tabisuru-nihon.github.io/templates/onsen.html?id=${id}`}]});
  document.head.appendChild(onsenBcScript);
  if (onsenOgUrl) onsenOgUrl.setAttribute('content', onsenCanonical.href);

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
    yufuin:      'images/japan/oita/oita-yufuin-01.jpg',
    nyuto:       'images/japan/akita/akita-nyutou-onsen-01.jpg',
    kurokawa:    'images/japan/kumamoto/kumamoto-aso-02.jpg',
    gero:        'images/japan/gifu/gifu-onsen-01.jpg',
    zao:         'images/japan/yamagata/yamagata-zao-02.jpg',
    jozankei:    'images/japan/hokkaido/hokkaido-shirogane-blue-pond-02.jpg',
    ginzan:      'images/japan/yamagata/yamagata-ginzan-02.jpg',
    ikaho:       'images/japan/gunma/gunma-mochi-01.jpg',
    kinugawa:    'images/japan/tochigi/tochigi-kinugawa-01.jpg',
    yudanaka:    'images/japan/nagano/nagano-jigokudani-01.jpg',
    akiu:        'images/japan/miyagi/miyagi-matsushima-03.jpg',
    ibusuki:     'images/japan/kagoshima/kagoshima-sakurajima-02.jpg',
    tamatsukuri: 'images/japan/shimane/shimane-izumo-01.jpg',
    wakura:      'images/japan/ishikawa/ishikawa-kenroku-01.jpg',
    okuhida:     'images/japan/gifu/gifu-shirakawago-01.jpg',
    shima:       'images/japan/gunma/gunma-kusatsu-yunohata-01.jpg',
    yugawara:    'images/japan/kanagawa/kanagawa-hakone-yumoto-01.jpg',
    yamashiro:   'images/japan/ishikawa/ishikawa-kanazawa-01.jpg',
    tsukioka:    'images/japan/niigata/niigata-winter-01.jpg',
    sukayu:      'images/japan/aomori/aomori-oirase-01.jpg',
    yamanaka:    'images/japan/ishikawa/ishikawa-kenroku-01.jpg',
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
  // BreadcrumbList
  const monthBcScript = document.createElement('script');
  monthBcScript.type = 'application/ld+json';
  monthBcScript.textContent = JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"TOP","item":"https://tabisuru-nihon.github.io/"},{"@type":"ListItem","position":2,"name":"月別特集","item":"https://tabisuru-nihon.github.io/pages/monthly.html"},{"@type":"ListItem","position":3,"name":`${month}月の旅行おすすめ`,"item":`https://tabisuru-nihon.github.io/templates/monthly-detail.html?month=${month}`}]});
  document.head.appendChild(monthBcScript);

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
