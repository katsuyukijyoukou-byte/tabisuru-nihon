/* =====================================================
   旅する日本図鑑 アフィリエイトリンク管理 v1.0
   楽天アフィリエイトID: 13d6d4ee.28199bf3.13d6d4ef.2c83be2d
   JTB (brandsafe.js) は動作確認後に実装予定
===================================================== */

window.AFF = (() => {

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

  /* ===== A8.net テキスト広告データ（A8発行コードをそのまま使用）===== */
  const A8TEXT = {

    /* ── 宿泊 ── */
    jalan_main: {
      name: 'じゃらんnet', emoji: '🏨',
      desc: '国内25,000軒以上・2%ポイント還元',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5R04+6OJ916+14CS+68EPE',
      text: '【じゃらん】国内25,000軒の宿をネットで予約OK！2％ポイント還元！',
      tracker: 'https://www19.a8.net/0.gif?a8mat=4B5R04+6OJ916+14CS+68EPE',
    },
    jalan_onsen: {
      name: 'じゃらんnet 温泉', emoji: '♨️',
      desc: '有名温泉から穴場まで5,000件以上が予約OK',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5R04+6OJ916+14CS+63WO2',
      text: '【じゃらん】有名温泉から穴場まで温泉旅館・ホテル5,000件以上が予約OK!',
      tracker: 'https://www14.a8.net/0.gif?a8mat=4B5R04+6OJ916+14CS+63WO2',
    },
    ikyu_main: {
      name: '一休.com', emoji: '✨',
      desc: '厳選された高級ホテル・旅館を格安予約',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5OO4+8BH5X6+1OK+5YJRM',
      text: "国内ホテルの格安予約サイト『一休.com』",
      tracker: 'https://www10.a8.net/0.gif?a8mat=4B5OO4+8BH5X6+1OK+5YJRM',
    },
    ikyu_onsen: {
      name: '一休.com 温泉', emoji: '♨️',
      desc: '温泉旅館を格安予約',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5OO4+8BH5X6+1OK+5YRHE',
      text: "温泉旅館の格安予約サイト『一休.com』",
      tracker: 'https://www12.a8.net/0.gif?a8mat=4B5OO4+8BH5X6+1OK+5YRHE',
    },
    ikyu_luxury: {
      name: '一休.com 高級', emoji: '💎',
      desc: '高級ホテル・旅館が最大60%OFF',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5OO4+8BH5X6+1OK+61JSI',
      text: '一休高級ホテル・旅館が最大60％OFF！',
      tracker: 'https://www18.a8.net/0.gif?a8mat=4B5OO4+8BH5X6+1OK+61JSI',
    },
    yahoo_main: {
      name: 'Yahoo!トラベル', emoji: '🏩',
      desc: '約17,000施設・国内最大級宿泊サイト',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5X8H+1U38SA+4ZCO+60OXE',
      text: '【ヤフートラベル】取り扱い施設数が約17000施設!!国内最大級宿泊予約サイト',
      tracker: 'https://www19.a8.net/0.gif?a8mat=4B5X8H+1U38SA+4ZCO+60OXE',
    },
    nihon_shinkansen: {
      name: '日本旅行', emoji: '🚄',
      desc: '新幹線＋宿泊セットプラン',
      href: 'https://px.a8.net/svt/ejp?a8mat=3N46E9+CHIED6+Z9G+NZ4J6',
      text: 'セットでお得！日本旅行の「新幹線+宿泊」セットプラン',
      tracker: 'https://www10.a8.net/0.gif?a8mat=3N46E9+CHIED6+Z9G+NZ4J6',
    },
    agoda_main: {
      name: 'Agoda', emoji: '🌍',
      desc: '世界250万件以上・海外ホテルも格安比較',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5OO4+7SFAKA+4X1W+5YRHE',
      text: '国内・海外ホテル格安予約のアゴダ',
      tracker: 'https://www15.a8.net/0.gif?a8mat=4B5OO4+7SFAKA+4X1W+5YRHE',
    },
    ozmall_onsen: {
      name: 'OZmall 温泉', emoji: '💐',
      desc: 'OZ限定・女子に人気の温泉プラン',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5X8G+GC8EBE+3UQG+601S2',
      text: '女子人気の温泉だけ！OZ限定1泊2食付13800円〜',
      tracker: 'https://www14.a8.net/0.gif?a8mat=4B5X8G+GC8EBE+3UQG+601S2',
    },
    yukimado_text: {
      name: 'ゆめやど', emoji: '🌙',
      desc: '平日限定のお得な温泉宿・旅館',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5OO4+9T24TM+44YI+HV7V6',
      text: '平日の宿・ホテル予約が圧倒的お得! [ゆめやど]',
      tracker: 'https://www13.a8.net/0.gif?a8mat=4B5OO4+9T24TM+44YI+HV7V6',
    },

    /* ── JTB 旅物語 ── */
    jtb_tabimono_intl: {
      name: 'JTB 旅物語（国内/海外）', emoji: '🗺️',
      desc: 'JTBの国内・海外ツアーブランド「旅物語」',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5Y0B+9B75G2+15A4+1NJRXE',
      text: '旅物語　国内/海外',
      tracker: 'https://www11.a8.net/0.gif?a8mat=4B5Y0B+9B75G2+15A4+1NJRXE',
    },
    jtb_tabimono: {
      name: 'JTB 旅物語', emoji: '🧳',
      desc: 'JTBの人気ツアーブランド「旅物語」',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5Y0B+9B75G2+15A4+1NJK7M',
      text: '旅物語',
      tracker: 'https://www13.a8.net/0.gif?a8mat=4B5Y0B+9B75G2+15A4+1NJK7M',
    },
    jtb_cruise: {
      name: 'JTB 飛鳥2クルーズ', emoji: '🚢',
      desc: '飛鳥2チャーター・クリスマスクルーズ',
      href: 'https://px.a8.net/svt/ejp?a8mat=4B5Y0B+9B75G2+15A4+1NL282',
      text: '飛鳥2チャーター・クリスマスクルーズ',
      tracker: 'https://www13.a8.net/0.gif?a8mat=4B5Y0B+9B75G2+15A4+1NL282',
    },

    /* ── J-TRIP 地域別（A8発行テキストリンク）── */
    jtrip_hokkaido: {
      name: 'J-TRIP 北海道', emoji: '✈️',
      desc: 'JALで行く北海道格安旅行',
      href: 'https://px.a8.net/svt/ejp?a8mat=3N46E9+CAD38Y+40T2+6C9LE',
      text: '北海道旅行ならJALで行く格安旅行のJ-TRIP（ジェイトリップ）',
      tracker: 'https://www14.a8.net/0.gif?a8mat=3N46E9+CAD38Y+40T2+6C9LE',
    },
    jtrip_kansai: {
      name: 'J-TRIP 関西', emoji: '✈️',
      desc: 'JALで行く関西格安旅行',
      href: 'https://px.a8.net/svt/ejp?a8mat=3N46E9+CAD38Y+40T2+6CP0Y',
      text: '関西旅行ならJALで行く格安旅行のJ-TRIP（ジェイトリップ）',
      tracker: 'https://www14.a8.net/0.gif?a8mat=3N46E9+CAD38Y+40T2+6CP0Y',
    },
    jtrip_chushikoku: {
      name: 'J-TRIP 中四国', emoji: '✈️',
      desc: 'JALで行く中四国格安旅行',
      href: 'https://px.a8.net/svt/ejp?a8mat=3N46E9+CAD38Y+40T2+6DJW2',
      text: '中四国への旅行ならJALで行く格安旅行のJ-TRIP（ジェイトリップ）',
      tracker: 'https://www15.a8.net/0.gif?a8mat=3N46E9+CAD38Y+40T2+6DJW2',
    },
    jtrip_kyushu: {
      name: 'J-TRIP 九州', emoji: '✈️',
      desc: 'JALで行く九州格安旅行',
      href: 'https://px.a8.net/svt/ejp?a8mat=3N46E9+CAD38Y+40T2+6CWQQ',
      text: '九州旅行ならJALで行く格安旅行のJ-TRIP（ジェイトリップ）',
      tracker: 'https://www16.a8.net/0.gif?a8mat=3N46E9+CAD38Y+40T2+6CWQQ',
    },
    jtrip_okinawa: {
      name: 'J-TRIP 沖縄', emoji: '✈️',
      desc: 'JALで行く沖縄格安旅行',
      href: 'https://px.a8.net/svt/ejp?a8mat=3N46E9+CAD38Y+40T2+5YRHE',
      text: '沖縄旅行ならJALで行く格安旅行のJ-TRIP（ジェイトリップ）',
      tracker: 'https://www15.a8.net/0.gif?a8mat=3N46E9+CAD38Y+40T2+5YRHE',
    },
    jtrip_tokyo: {
      name: 'J-TRIP 東京', emoji: '✈️',
      desc: 'JALで行く東京格安旅行',
      href: 'https://px.a8.net/svt/ejp?a8mat=3N46E9+CAD38Y+40T2+6CHB6',
      text: '東京旅行ならJALで行く格安旅行のJ-TRIP（ジェイトリップ）',
      tracker: 'https://www11.a8.net/0.gif?a8mat=3N46E9+CAD38Y+40T2+6CHB6',
    },
    jtrip_tohoku: {
      name: 'J-TRIP 東北', emoji: '✈️',
      desc: 'JALで行く東北格安旅行',
      href: 'https://px.a8.net/svt/ejp?a8mat=3N46E9+CAD38Y+40T2+6DC6A',
      text: '東北旅行ならJALで行く格安旅行のJ-TRIP（ジェイトリップ）',
      tracker: 'https://www13.a8.net/0.gif?a8mat=3N46E9+CAD38Y+40T2+6DC6A',
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

  /* ===== 楽天アフィリエイト 47都道府県データ ===== */
  const RAKUTEN_PREFS = {
    hokkaido:  { name: '北海道', kenCode: '1',  jtrip: 'jtrip_hokkaido' },
    aomori:    { name: '青森',   kenCode: '2',  jtrip: 'jtrip_tohoku' },
    iwate:     { name: '岩手',   kenCode: '3',  jtrip: 'jtrip_tohoku' },
    miyagi:    { name: '宮城',   kenCode: '4',  jtrip: 'jtrip_tohoku' },
    akita:     { name: '秋田',   kenCode: '5',  jtrip: 'jtrip_tohoku' },
    yamagata:  { name: '山形',   kenCode: '6',  jtrip: 'jtrip_tohoku' },
    fukushima: { name: '福島',   kenCode: '7',  jtrip: 'jtrip_tohoku' },
    ibaraki:   { name: '茨城',   kenCode: '8',  jtrip: null },
    tochigi:   { name: '栃木',   kenCode: '9',  jtrip: null },
    gunma:     { name: '群馬',   kenCode: '10', jtrip: null },
    saitama:   { name: '埼玉',   kenCode: '11', jtrip: null },
    chiba:     { name: '千葉',   kenCode: '12', jtrip: null },
    tokyo:     { name: '東京',   kenCode: '13', jtrip: 'jtrip_tokyo' },
    kanagawa:  { name: '神奈川', kenCode: '14', jtrip: null },
    niigata:   { name: '新潟',   kenCode: '15', jtrip: null },
    toyama:    { name: '富山',   kenCode: '16', jtrip: null },
    ishikawa:  { name: '石川',   kenCode: '17', jtrip: null },
    fukui:     { name: '福井',   kenCode: '18', jtrip: null },
    yamanashi: { name: '山梨',   kenCode: '19', jtrip: null },
    nagano:    { name: '長野',   kenCode: '20', jtrip: null },
    gifu:      { name: '岐阜',   kenCode: '21', jtrip: null },
    shizuoka:  { name: '静岡',   kenCode: '22', jtrip: null },
    aichi:     { name: '愛知',   kenCode: '23', jtrip: null },
    mie:       { name: '三重',   kenCode: '24', jtrip: null },
    shiga:     { name: '滋賀',   kenCode: '25', jtrip: 'jtrip_kansai' },
    kyoto:     { name: '京都',   kenCode: '26', jtrip: 'jtrip_kansai' },
    osaka:     { name: '大阪',   kenCode: '27', jtrip: 'jtrip_kansai' },
    hyogo:     { name: '兵庫',   kenCode: '28', jtrip: 'jtrip_kansai' },
    nara:      { name: '奈良',   kenCode: '29', jtrip: 'jtrip_kansai' },
    wakayama:  { name: '和歌山', kenCode: '30', jtrip: 'jtrip_kansai' },
    tottori:   { name: '鳥取',   kenCode: '31', jtrip: 'jtrip_chushikoku' },
    shimane:   { name: '島根',   kenCode: '32', jtrip: 'jtrip_chushikoku' },
    okayama:   { name: '岡山',   kenCode: '33', jtrip: 'jtrip_chushikoku' },
    hiroshima: { name: '広島',   kenCode: '34', jtrip: 'jtrip_chushikoku' },
    yamaguchi: { name: '山口',   kenCode: '35', jtrip: 'jtrip_chushikoku' },
    tokushima: { name: '徳島',   kenCode: '36', jtrip: 'jtrip_chushikoku' },
    kagawa:    { name: '香川',   kenCode: '37', jtrip: 'jtrip_chushikoku' },
    ehime:     { name: '愛媛',   kenCode: '38', jtrip: 'jtrip_chushikoku' },
    kochi:     { name: '高知',   kenCode: '39', jtrip: 'jtrip_chushikoku' },
    fukuoka:   { name: '福岡',   kenCode: '40', jtrip: 'jtrip_kyushu' },
    saga:      { name: '佐賀',   kenCode: '41', jtrip: 'jtrip_kyushu' },
    nagasaki:  { name: '長崎',   kenCode: '42', jtrip: 'jtrip_kyushu' },
    kumamoto:  { name: '熊本',   kenCode: '43', jtrip: 'jtrip_kyushu' },
    oita:      { name: '大分',   kenCode: '44', jtrip: 'jtrip_kyushu' },
    miyazaki:  { name: '宮崎',   kenCode: '45', jtrip: 'jtrip_kyushu' },
    kagoshima: { name: '鹿児島', kenCode: '46', jtrip: 'jtrip_kyushu' },
    okinawa:   { name: '沖縄',   kenCode: '47', jtrip: 'jtrip_okinawa' },
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
      + '<a href="' + d.href + '" rel="nofollow" target="_blank">'
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

  /* ===== A8テキスト広告HTML生成（A8発行コードをそのまま使用）===== */
  function _a8TextCta(d) {
    return '<div class="a8-text-cta">'
      + '<a href="' + d.href + '" rel="nofollow">' + d.text + '</a>'
      + '<img border="0" width="1" height="1" src="' + d.tracker + '" alt="">'
      + '</div>';
  }

  function _a8TextCard(key) {
    var d = A8TEXT[key];
    if (!d) return '';
    return '<div class="a8-text-card">'
      + '<div class="a8-text-card-pr">PR・広告</div>'
      + '<div class="a8-text-card-header">'
      +   '<span class="a8-text-card-emoji" aria-hidden="true">' + d.emoji + '</span>'
      +   '<strong class="a8-text-card-name">' + d.name + '</strong>'
      + '</div>'
      + '<p class="a8-text-card-desc">' + d.desc + '</p>'
      + _a8TextCta(d)
      + '</div>';
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
   * 都道府県アフィリエイトセクションをレンダリング（47都道府県対応）
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
      + _rakutenBtn('🎁', pref.name + 'のお土産を楽天市場で見る', rUrl2)
      + _rakutenBtn('🗾', pref.name + 'のふるさと納税を探す', rUrl3);

    el.innerHTML
      = '<div class="aff-subsection-label">' + pref.name + 'の宿を探す</div>'
      + '<div class="aff-rakuten-btns">' + rakutenHtml + '</div>'
      + '<div class="aff-subsection-label" style="margin-top:16px">他の予約サービスと比較する</div>'
      + '<div class="a8-text-card-grid">'
      +   _a8TextCard('jalan_main')
      +   _a8TextCard('yahoo_main')
      +   (pref.jtrip ? _a8TextCard(pref.jtrip) : '')
      + '</div>';
  }

  /**
   * A8テキスト広告カードグリッドをレンダリング
   * @param {string[]} keys  A8TEXT案件キー配列
   * @param {string}   containerId  描画先要素のid
   */
  function renderA8TextCards(keys, containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '<div class="a8-text-card-grid">' + keys.map(_a8TextCard).join('') + '</div>';
  }

  /**
   * A8テキストCTA HTML（単一）を返す - booking sectionなどから利用
   * @param {string} key  A8TEXT案件キー
   */
  function textCtaHtml(key) {
    var d = A8TEXT[key];
    return d ? _a8TextCta(d) : '';
  }

  /**
   * 楽天URL生成（公開）
   * @param {string} dest  遷移先URL
   */
  function rakutenUrl(dest) {
    return _rakutenUrl(dest);
  }

  return { renderA8Grid, renderPrefAff, renderA8TextCards, textCtaHtml, rakutenUrl, A8, A8TEXT, PAGE_SETS, RAKUTEN_PREFS };

})();
