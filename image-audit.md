# 画像監査ログ

確認日: 2026-06-14

## 修正済み画像

| ページ | 対象 | 変更前 | 問題点 | 変更後 |
|--------|------|--------|--------|--------|
| pages/prefectures.html | 福井カード | fukui-tojinbo-01.jpg | 人物の顔写真が表示されていた | fukui-nature-02.jpg |
| pages/prefectures.html | 愛媛カード | ehime-dogo-01.jpg | ヨガ・フィットネス系の人物写真が表示されていた | ehime-dogo-honkan-01.jpg（道後温泉本館）|
| pages/prefectures.html | 三重カード | mie-ise-coast-01.jpg | ビジネスマン風の人物写真が表示されていた | mie-kumano-02.jpg（熊野） |
| index.html | 香川カード（地方グリッド） | kagawa-ritsurin-01.jpg | ファイルが存在しなかった（404） | kagawa-chichibugahama-01.jpg |

## 画像マッピング方式

すべての画像は以下の方式で明示的にIDと紐づけしています：

- **都道府県カード**: `pages/prefectures.html` 内 `PREF_IMGS` オブジェクト（県ID → パス）
- **温泉地カード**: `pages/onsen.html` 内 `ONSEN_IMGS` オブジェクト（温泉ID → パス）
- **目的カード**: `pages/purpose.html` 内 `PURPOSE_CARD_IMGS` オブジェクト（目的ID → パス）
- **月別カード**: `pages/monthly.html` 内 `MONTH_IMGS` 配列（月番号→パス）
- **地方グリッド**: `index.html` 内 `REGION_IMG_MAP` オブジェクト（地方ID → パス）
- **温泉詳細**: `js/app.js` 内 `ONSEN_HERO_IMGS` オブジェクト（温泉ID → パス）

「配列の順番でなんとなく対応」はなく、すべてID明示型マッピングを使用。

## 全画像パス存在確認結果（2026-06-14）

- 確認対象ファイル: index.html, pages/*.html, js/app.js, data/*.js
- 結果: **全パス存在確認済み（MISSINGなし）**

## 都道府県カード画像一覧

| 県ID | 画像ファイル | 主な被写体 |
|------|-------------|-----------|
| hokkaido | hokkaido-biei-flower-field-01.jpg | 美瑛・花畑 |
| aomori | aomori-oirase-01.jpg | 奥入瀬渓流 |
| iwate | iwate-nature-01.jpg | 自然風景 |
| miyagi | miyagi-matsushima-01.jpg | 松島 |
| akita | akita-tazawako-01.jpg | 田沢湖 |
| yamagata | yamagata-ginzan-01.jpg | 銀山温泉 |
| fukushima | fukushima-goshikinuma-01.jpg | 五色沼 |
| ibaraki | ibaraki-kairakuen-02.jpg | 偕楽園 |
| tochigi | tochigi-nikko-01.jpg | 日光 |
| gunma | gunma-kusatsu-01.jpg | 草津温泉 |
| saitama | saitama-kawagoe-01.jpg | 川越 |
| chiba | chiba-seaside-01.jpg | 海岸 |
| tokyo | tokyo-asakusa-sensoji-01.jpg | 浅草・浅草寺 |
| kanagawa | kanagawa-kamakura-01.jpg | 鎌倉 |
| niigata | niigata-landscape-01.jpg | 風景 |
| toyama | toyama-tateyama-02.jpg | 立山 |
| ishikawa | ishikawa-kanazawa-01.jpg | 金沢 |
| fukui | fukui-nature-02.jpg | 自然風景（修正済み） |
| yamanashi | yamanashi-fuji-kawaguchi-01.jpg | 富士・河口湖 |
| nagano | nagano-kamikochi-01.jpg | 上高地 |
| gifu | gifu-shirakawago-01.jpg | 白川郷 |
| shizuoka | shizuoka-fuji-01.jpg | 富士山 |
| aichi | aichi-nagoya-castle-01.jpg | 名古屋城 |
| mie | mie-kumano-02.jpg | 熊野（修正済み） |
| shiga | shiga-lake-01.jpg | 琵琶湖 |
| kyoto | kyoto-fushimi-inari-01.jpg | 伏見稲荷 |
| osaka | osaka-dotonbori-01.jpg | 道頓堀 |
| hyogo | hyogo-himeji-01.jpg | 姫路城 |
| nara | nara-deer-01.jpg | 奈良の鹿 |
| wakayama | wakayama-nachi-01.jpg | 那智 |
| tottori | tottori-sanddune-02.jpg | 鳥取砂丘 |
| shimane | shimane-izumo-01.jpg | 出雲大社 |
| okayama | okayama-kurashiki-01.jpg | 倉敷 |
| hiroshima | hiroshima-miyajima-torii-01.jpg | 宮島・鳥居 |
| yamaguchi | yamaguchi-coast-01.jpg | 海岸 |
| tokushima | tokushima-awa-02.jpg | 阿波 |
| kagawa | kagawa-chichibugahama-01.jpg | 父母ヶ浜 |
| ehime | ehime-dogo-honkan-01.jpg | 道後温泉本館（修正済み） |
| kochi | kochi-katsurahama-01.jpg | 桂浜 |
| fukuoka | fukuoka-city-01.jpg | 福岡市街 |
| saga | saga-castle-01.jpg | 佐賀城 |
| nagasaki | nagasaki-harbor-01.jpg | 長崎港 |
| kumamoto | kumamoto-castle-01.jpg | 熊本城 |
| miyazaki | miyazaki-coast-01.jpg | 海岸 |
| kagoshima | kagoshima-nature-01.jpg | 自然 |
| oita | oita-beppu-01.jpg | 別府温泉 |
| okinawa | okinawa-sea-coast-02.jpg | 沖縄の海 |

## 画像の出典・ライセンス

本サイトで使用している写真は、以下のいずれかです：
- サイト制作時に収集した旅行先の参考画像
- パブリックドメインまたは商用利用可能なライセンスの素材

※具体的な出典・ライセンスの詳細については、別途管理が必要です。

## 今後の改善候補

- `fukui-nature-02.jpg` の内容確認（東尋坊・永平寺の写真があれば差し替え検討）
- `mie-kumano-02.jpg` → より有名な伊勢神宮の写真があれば優先検討
- `yamaguchi-coast-01.jpg` → 角島大橋の写真があればより良い
- 各温泉地専用写真が1種類しかないものは追加収集検討
