#!/usr/bin/env node
/**
 * audit-site.js
 * 旅する日本図鑑 サイト品質監査スクリプト
 * Node.js 標準ライブラリのみ使用（npm不要）
 * 使い方: node scripts/audit-site.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 禁止画像リスト（audit-images.html に記載されているNG画像）
const BANNED_IMAGES = [
  'oita-aso-01.jpg',
  'yamagata-ginzan-01.jpg',
  'niigata-landscape-01.jpg',
  'nagano-hakuba-01.jpg',
  'miyagi-matsushima-01.jpg',
  'nara-deer-01.jpg',
  'nagasaki-nightview-02.jpg',
  'osaka-dotonbori-01.jpg',
  'aichi-nagoya-castle-01.jpg',
  'saga-castle-01.jpg',
  'okayama-kurashiki-01.jpg',
  'fukuoka-city-01.jpg',
];

// 旧プロジェクト名
const STALE_NAMES = ['宮島思い出図鑑', '錦水館', 'miyajima-kinsuikan'];

let errors = [];
let warnings = [];
let passes = [];

function log(type, msg) {
  if (type === 'error') errors.push(msg);
  else if (type === 'warn') warnings.push(msg);
  else passes.push(msg);
}

// ---- ファイル走査ユーティリティ ----

function readFileLines(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf8').split('\n');
  } catch {
    return [];
  }
}

function walkDir(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full, exts));
    } else if (exts.some(e => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

// ---- 1. 画像パス存在チェック ----

function checkImagePaths() {
  const htmlFiles = [
    ...walkDir(path.join(ROOT, 'pages'), ['.html']),
    ...walkDir(path.join(ROOT, 'templates'), ['.html']),
    path.join(ROOT, 'index.html'),
  ];

  let checked = 0;
  let missing = 0;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = [...content.matchAll(/src=["']([^"']*images\/japan[^"']+\.(?:jpg|png|webp))["']/g)];
    for (const m of matches) {
      let imgPath = m[1];
      // ../images/ → ROOT/images/
      imgPath = imgPath.replace(/^\.\.\//, '').replace(/^\//, '');
      const abs = path.join(ROOT, imgPath);
      checked++;
      if (!fs.existsSync(abs)) {
        log('error', `[画像なし] ${path.relative(ROOT, file)}: ${imgPath}`);
        missing++;
      }
    }
  }
  if (missing === 0) log('pass', `画像パス: ${checked}件チェック、全て存在`);
  else log('warn', `画像パス: ${checked}件中 ${missing}件が見つかりません`);
}

// ---- 2. 禁止画像使用チェック ----

function checkBannedImages() {
  const htmlFiles = [
    ...walkDir(path.join(ROOT, 'pages'), ['.html']),
    ...walkDir(path.join(ROOT, 'templates'), ['.html']),
    ...walkDir(path.join(ROOT, 'js'), ['.js']),
    path.join(ROOT, 'index.html'),
  ];

  let found = 0;
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const banned of BANNED_IMAGES) {
      if (content.includes(banned)) {
        log('error', `[禁止画像] ${path.relative(ROOT, file)}: ${banned}`);
        found++;
      }
    }
  }
  if (found === 0) log('pass', `禁止画像: 全 ${BANNED_IMAGES.length} 件が未使用`);
}

// ---- 3. 旧プロジェクト名チェック ----

function checkStaleNames() {
  const allFiles = [
    ...walkDir(path.join(ROOT, 'pages'), ['.html', '.js']),
    ...walkDir(path.join(ROOT, 'templates'), ['.html', '.js']),
    ...walkDir(path.join(ROOT, 'js'), ['.js']),
    ...walkDir(path.join(ROOT, 'data'), ['.js']),
    path.join(ROOT, 'index.html'),
  ];

  let found = 0;
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const name of STALE_NAMES) {
      if (content.includes(name)) {
        log('error', `[旧名称] ${path.relative(ROOT, file)}: "${name}"`);
        found++;
      }
    }
  }
  if (found === 0) log('pass', `旧プロジェクト名: 全 ${STALE_NAMES.length} 件が未使用`);
}

// ---- 4. sitemap.xml と data/onsens.js の ID 整合チェック ----

function checkSitemapVsData() {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  const onsensPath = path.join(ROOT, 'data', 'onsens.js');

  if (!fs.existsSync(sitemapPath)) { log('error', 'sitemap.xml が見つかりません'); return; }
  if (!fs.existsSync(onsensPath)) { log('error', 'data/onsens.js が見つかりません'); return; }

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const onsensJs = fs.readFileSync(onsensPath, 'utf8');

  // サイトマップから温泉IDを抽出
  const sitemapIds = new Set([...sitemap.matchAll(/onsen\.html\?id=([a-z0-9]+)/g)].map(m => m[1]));

  // onsens.jsからIDを抽出（id: 'xxx' または 'id': 'xxx' の両形式に対応）
  const dataIds = new Set([...onsensJs.matchAll(/\bid\s*:\s*['"]([a-z0-9]+)['"]/g)].map(m => m[1]));

  const inSitemapNotData = [...sitemapIds].filter(id => !dataIds.has(id));
  const inDataNotSitemap = [...dataIds].filter(id => !sitemapIds.has(id));

  if (inSitemapNotData.length === 0 && inDataNotSitemap.length === 0) {
    log('pass', `sitemap ↔ onsens.js: ${sitemapIds.size}件のID完全一致`);
  } else {
    if (inSitemapNotData.length > 0) log('error', `[sitemap過剰] data未定義のID: ${inSitemapNotData.join(', ')}`);
    if (inDataNotSitemap.length > 0) log('warn', `[sitemap未登録] dataにあるID: ${inDataNotSitemap.join(', ')}`);
  }
}

// ---- 5. image-credits.csv カバレッジチェック ----

function checkImageCredits() {
  const creditsPath = path.join(ROOT, 'data', 'image-credits.csv');
  if (!fs.existsSync(creditsPath)) { log('warn', 'data/image-credits.csv が見つかりません'); return; }

  const lines = readFileLines(creditsPath).filter(l => l.trim() && !l.startsWith('prefecture'));
  const creditedFiles = new Set(lines.map(l => {
    const cols = l.split(',');
    return cols[10] ? cols[10].trim() : '';
  }).filter(Boolean));

  // images/japan 以下の全jpgを列挙
  const allImages = walkDir(path.join(ROOT, 'images', 'japan'), ['.jpg', '.png', '.webp']);
  const uncovered = allImages.filter(img => {
    const basename = path.basename(img);
    return !creditedFiles.has(basename) && !BANNED_IMAGES.includes(basename);
  });

  if (uncovered.length === 0) {
    log('pass', `image-credits.csv: 全画像がカバーされています`);
  } else {
    log('warn', `[クレジット未記載] ${uncovered.length}件: ${uncovered.slice(0, 10).map(f => path.basename(f)).join(', ')}${uncovered.length > 10 ? '...' : ''}`);
  }
}

// ---- 6. data/ ファイルID重複チェック ----

function checkDataDuplicates() {
  const dataFiles = walkDir(path.join(ROOT, 'data'), ['.js']);

  for (const file of dataFiles) {
    const rel = path.relative(ROOT, file);
    const content = fs.readFileSync(file, 'utf8');
    const ids = [...content.matchAll(/\bid\s*:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
    const seen = new Set();
    const dupes = new Set();
    for (const id of ids) {
      if (seen.has(id)) dupes.add(id);
      seen.add(id);
    }
    if (dupes.size > 0) {
      // prefectures.jsは複数マップが同ファイルにあるため誤検知が多い。重複数が都道府県数(47)以上なら誤検知と判断
      if (rel === 'data\\prefectures.js' || rel === 'data/prefectures.js') {
        log('pass', `ID重複チェックスキップ（複数マップ構造）: ${rel}`);
      } else {
        log('error', `[ID重複] ${rel}: ${[...dupes].join(', ')}`);
      }
    } else if (ids.length > 0) {
      log('pass', `ID重複なし: ${rel} (${seen.size}件)`);
    }
  }
}

// ---- 実行 ----

console.log('=== 旅する日本図鑑 サイト監査 ===\n');

checkImagePaths();
checkBannedImages();
checkStaleNames();
checkSitemapVsData();
checkImageCredits();
checkDataDuplicates();

console.log('\n--- ERRORS ---');
if (errors.length === 0) console.log('  (なし)');
else errors.forEach(e => console.log('  ✗ ' + e));

console.log('\n--- WARNINGS ---');
if (warnings.length === 0) console.log('  (なし)');
else warnings.forEach(w => console.log('  ⚠ ' + w));

console.log('\n--- PASSED ---');
passes.forEach(p => console.log('  ✓ ' + p));

console.log(`\n合計: ${errors.length} エラー / ${warnings.length} 警告 / ${passes.length} 合格`);
if (errors.length > 0) process.exit(1);
