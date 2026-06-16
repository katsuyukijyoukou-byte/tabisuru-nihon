/* =====================================================
   旅する日本図鑑 アフィリエイトリンク管理 v1.0
   楽天アフィリエイトID: 13d6d4ee.28199bf3.13d6d4ef.2c83be2d
   JTB (brandsafe.js) は動作確認後に実装予定
===================================================== */

const AFF = (() => {

  const RAKUTEN_ID = '13d6d4ee.28199bf3.13d6d4ef.2c83be2d';

  /* ===== A8.net 案件データ ===== */
  const A8 = {

    jalan: {
      name: 'じゃらんnet',
      label: '宿泊を探す',
      desc: '国内最大級・40万件以上の宿泊施設を比較',
      emoji: '🏨',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5R04+6OJ916+14CS+6GZCH',
      banner: 'https://www21.a8.net/svt/bgt?aid=260608756404&wid=006&eno=01&mid=s00000005230001087000&mc=1',
      tracker: 'https://www12.a8.net/0.gif?a8mat=4B5R04+6OJ916+14CS+6GZCH',
    },

    yahoo_travel: {
      name: 'Yahoo!トラベル',
      label: '宿泊を比較する',
      desc: '施設数約17,000の国内最大級宿泊サイト',
      emoji: '🏩',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5X8H+1U38SA+4ZCO+65ME9',
      banner: 'https://www28.a8.net/svt/bgt?aid=260616833111&wid=006&eno=01&mid=s00000023244001034000&mc=1',
      tracker: 'https://www18.a8.net/0.gif?a8mat=4B5X8H+1U38SA+4ZCO+65ME9',
    },

    ikyu: {
      name: '一休.com',
      label: '高級宿を探す',
      desc: '厳選された高級ホテル・旅館を予約',
      emoji: '✨',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5OO4+8BH5X6+1OK+77ZKH',
      banner: 'https://www20.a8.net/svt/bgt?aid=260605732503&wid=006&eno=01&mid=s00000000218001213000&mc=1',
      tracker: 'https://www14.a8.net/0.gif?a8mat=4B5OO4+8BH5X6+1OK+77ZKH',
    },

    nihon_ryoko: {
      name: '日本旅行',
      label: '旅行プランを探す',
      desc: '国内旅行の総合旅行会社・パック旅行も充実',
      emoji: '🗾',
      href: 'https://px.a8.net/svt/ejp?a8mat=3N46E9+CHIED6+Z9G+NYP3L',
      banner: 'https://www28.a8.net/svt/bgt?aid=220224609755&wid=006&eno=01&mid=s00000004570004025000&mc=1',
      tracker: 'https://www10.a8.net/0.gif?a8mat=3N46E9+CHIED6+Z9G+NYP3L',
    },

    agoda: {
      name: 'agoda',
      label: '国内・海外ホテルを探す',
      desc: '世界250万件以上のホテルを格安比較',
      emoji: '🌍',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5OO4+7SFAKA+4X1W+5ZMCH',
      banner: 'https://www28.a8.net/svt/bgt?aid=260605732471&wid=006&eno=01&mid=s00000022946001006000&mc=1',
      tracker: 'https://www19.a8.net/0.gif?a8mat=4B5OO4+7SFAKA+4X1W+5ZMCH',
    },

    yukimado: {
      name: 'ゆめやど',
      label: '平日宿泊をお得に探す',
      desc: '平日限定のお得な温泉宿・旅館',
      emoji: '♨️',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5OO4+9T26D6+44YI+HY069',
      banner: 'https://www24.a8.net/svt/bgt?aid=260605732593&wid=006&eno=01&mid=s00000019305003014000&mc=1',
      tracker: 'https://www14.a8.net/0.gif?a8mat=4B5OO4+9T26D6+44YI+HY069',
    },

    ozmall: {
      name: 'OZmall',
      label: '高級プランを予約する',
      desc: '厳選ホテル・旅館・レストランの贅沢プラン',
      emoji: '💎',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5X8G+GC8EBE+3UQG+60OXD',
      banner: 'https://www22.a8.net/svt/bgt?aid=260616832988&wid=006&eno=01&mid=s00000017980001011000&mc=1',
      tracker: 'https://www15.a8.net/0.gif?a8mat=4B5X8G+GC8EBE+3UQG+60OXD',
    },

    tabirai_activity: {
      name: 'たびらいアクティビティ',
      label: '現地アクティビティを探す',
      desc: '国内の遊び・体験・レジャーを格安予約',
      emoji: '🎯',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5X8H+YJ9Q2+1EQO+1NLHNL',
      banner: 'https://www26.a8.net/svt/bgt?aid=260616833058&wid=006&eno=01&mid=s00000006576010010000&mc=1',
      tracker: 'https://www13.a8.net/0.gif?a8mat=4B5X8H+YJ9Q2+1EQO+1NLHNL',
    },

    airtri_rentacar: {
      name: 'エアトリレンタカー',
      label: 'レンタカーを探す',
      desc: '全国のレンタカーを格安比較・予約',
      emoji: '🚗',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5X8H+RZI2I+AD2+2T9U01',
      banner: 'https://www27.a8.net/svt/bgt?aid=260616833047&wid=006&eno=01&mid=s00000001343017010000&mc=1',
      tracker: 'https://www14.a8.net/0.gif?a8mat=4B5X8H+RZI2I+AD2+2T9U01',
    },

    airtri_flight: {
      name: 'エアトリ 国内航空券',
      label: '格安航空券を探す',
      desc: '国内線の格安航空券を比較・予約',
      emoji: '✈️',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5X8H+SKXOA+AD2+6BMG1',
      banner: 'https://www26.a8.net/svt/bgt?aid=260616833048&wid=006&eno=01&mid=s00000001343001062000&mc=1',
      tracker: 'https://www12.a8.net/0.gif?a8mat=4B5X8H+SKXOA+AD2+6BMG1',
    },

    navitime: {
      name: 'NAVITIME Travel',
      label: '新幹線チケットを予約する',
      desc: 'JR新幹線・特急チケットを自宅お届け',
      emoji: '🚄',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5OO4+94NEKA+4R8G+BZ0Z5',
      banner: 'https://www27.a8.net/svt/bgt?aid=260605732552&wid=006&eno=01&mid=s00000022192002011000&mc=1',
      tracker: 'https://www10.a8.net/0.gif?a8mat=4B5OO4+94NEKA+4R8G+BZ0Z5',
    },

    glamping: {
      name: 'リゾートグランピング',
      label: 'グランピングを予約する',
      desc: '国内最大級グランピング予約サイト',
      emoji: '🏕️',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5OO4+9LWZ3U+5Q4K+5Z6WX',
      banner: 'https://www28.a8.net/svt/bgt?aid=260605732581&wid=006&eno=01&mid=s00000026714001004000&mc=1',
      tracker: 'https://www11.a8.net/0.gif?a8mat=4B5OO4+9LWZ3U+5Q4K+5Z6WX',
    },

    okinawa_tourist: {
      name: '沖縄ツーリスト',
      label: '沖縄旅行を探す',
      desc: '沖縄専門の旅行会社・ツアーが充実',
      emoji: '🌺',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5X8G+G8NSOQ+5R8A+5YZ75',
      banner: 'https://www22.a8.net/svt/bgt?aid=260616832982&wid=006&eno=01&mid=s00000026857001003000&mc=1',
      tracker: 'https://www12.a8.net/0.gif?a8mat=4B5X8G+G8NSOQ+5R8A+5YZ75',
    },

    tabirai_rentacar: {
      name: 'たびらいレンタカー',
      label: 'レンタカーを比較する',
      desc: '国内レンタカー最安値を比較・予約',
      emoji: '🚙',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5X8H+1GZPH6+1EQO+TX15D',
      banner: 'https://www29.a8.net/svt/bgt?aid=260616833089&wid=006&eno=01&mid=s00000006576005025000&mc=1',
      tracker: 'https://www19.a8.net/0.gif?a8mat=4B5X8H+1GZPH6+1EQO+TX15D',
    },

    airtri_bus: {
      name: 'エアトリ 夜行・高速バス',
      label: '夜行バスを探す',
      desc: '格安で移動！夜行・高速バスを比較',
      emoji: '🚌',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5X8H+TRSVU+AD2+3H2QRL',
      banner: 'https://www25.a8.net/svt/bgt?aid=260616833050&wid=006&eno=01&mid=s00000001343021008000&mc=1',
      tracker: 'https://www12.a8.net/0.gif?a8mat=4B5X8H+TRSVU+AD2+3H2QRL',
    },

  };

  /* ===== ページ別デフォルト広告セット ===== */
  const PAGE_SETS = {
    top:        ['jalan', 'yahoo_travel', 'ikyu', 'nihon_ryoko'],
    prefecture: ['jalan', 'yahoo_travel', 'airtri_rentacar'],
    onsen:      ['ikyu', 'jalan', 'yahoo_travel', 'yukimado'],
    activity:   ['tabirai_activity', 'glamping', 'airtri_rentacar'],
    transport:  ['navitime', 'airtri_flight', 'airtri_bus', 'airtri_rentacar'],
    okinawa:    ['okinawa_tourist', 'tabirai_activity', 'airtri_flight'],
  };

  /* ===== 楽天アフィリエイト テスト対象県データ ===== */
  const RAKUTEN_PREFS = {
    hokkaido:  { name: '北海道', kenCode: '1' },
    kyoto:     { name: '京都',   kenCode: '26' },
    hiroshima: { name: '広島',   kenCode: '34' },
  };

  /* ===== 楽天URL生成 ===== */
  function _rakutenUrl(dest) {
    return 'https://hb.afl.rakuten.co.jp/hgc/' + RAKUTEN_ID + '/?pc=' + encodeURIComponent(dest) + '&m=' + encodeURIComponent(dest);
  }

  /* ===== A8バナーHTML生成（A8発行コードをそのまま使用） ===== */
  function _a8Banner(key) {
    var d = A8[key];
    if (!d) return '';
    return '<div class="aff-banner-wrap">'
      + '<a href="' + d.href + '" target="_blank">'
      +   '<img border="0" width="300" height="250" alt="' + d.name + '" src="' + d.banner + '">'
      + '</a>'
      + '<img border="0" width="1" height="1" src="' + d.tracker + '" alt="">'
      + '</div>';
  }

  /* ===== 楽天ボタンHTML生成 ===== */
  function _rakutenBtn(emoji, label, href) {
    return '<a href="' + href + '" rel="nofollow sponsored" target="_blank" class="aff-rakuten-btn">'
      + '<span class="aff-btn-emoji" aria-hidden="true">' + emoji + '</span>'
      + '<span>' + label + '</span>'
      + '</a>';
  }

  /* ===== 公開API ===== */

  /**
   * A8広告グリッドをレンダリング
   * @param {string[]} keys  A8案件キー配列
   * @param {string}   containerId  描画先要素のid
   */
  function renderA8Grid(keys, containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '<div class="aff-banner-grid">' + keys.map(_a8Banner).join('') + '</div>';
  }

  /**
   * 都道府県アフィリエイトセクションをレンダリング
   * テスト対象（hokkaido/kyoto/hiroshima）のみ表示
   * @param {string} prefId   getPageParam('id') の値
   * @param {string} containerId  描画先要素のid
   */
  function renderPrefAff(prefId, containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var pref = RAKUTEN_PREFS[prefId];
    if (!pref) { el.style.display = 'none'; return; }

    var rUrl1 = _rakutenUrl('https://travel.rakuten.co.jp/search/?f_ken=' + pref.kenCode);
    var rUrl2 = _rakutenUrl('https://search.rakuten.co.jp/search/mall/' + encodeURIComponent(pref.name + ' お土産') + '/');
    var rUrl3 = _rakutenUrl('https://event.rakuten.co.jp/furusato/search/?query=' + encodeURIComponent(pref.name));

    var rakutenHtml
      = _rakutenBtn('🏨', pref.name + 'の宿を楽天トラベルで探す', rUrl1)
      + _rakutenBtn('🎁', pref.name + 'のお土産を楽天市場で探す', rUrl2)
      + _rakutenBtn('🗾', pref.name + 'のふるさと納税返礼品を探す', rUrl3);

    var a8Html = PAGE_SETS.prefecture.map(_a8Banner).join('');

    el.innerHTML
      = '<div class="aff-subsection-label">楽天で探す</div>'
      + '<div class="aff-rakuten-btns">' + rakutenHtml + '</div>'
      + '<div class="aff-subsection-label" style="margin-top:16px">宿・交通を比較する</div>'
      + '<div class="aff-banner-grid">' + a8Html + '</div>';
  }

  return { renderA8Grid, renderPrefAff, A8, PAGE_SETS, RAKUTEN_PREFS };

})();
