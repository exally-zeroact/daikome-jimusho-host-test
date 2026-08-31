'use strict';
// ============================================================
// ★★事務所の 入口が 正しい方を 向いているか★★ 2026-08-31
//
//   ★これは テスト用の repo です★
//   ⇒ 行き先は ★テストのメーター（daikou-app-test.vercel.app）★だけ
//   ⇒★本番の URL が 1つでも 混ざったら 赤★
//     （司さん 2026-08-09「本番とテストまぜんなぼけ」）
//
//   ★なぜ 見張るか★
//     ここは ★rewrite だけの 入口★です。行き先を 取り違えると
//     ★事務所の 画面が 黙って テストを 見ます★（画面は 同じに 見える）。
//     ＝★#ERROR より 黙って 別の物を 見せる方が 危ない★
// ============================================================
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const VJ = path.join(ROOT, 'office-host', 'vercel.json');

// ★この repo が どちら側か★（名前では なく この行で 決める）
const KOCHIRA = 'https://daikou-app-test.vercel.app';
const MUKOU = 'https://daikou-app.vercel.app';

describe('★事務所の 入口の 向き先★', () => {
  const raw = fs.readFileSync(VJ, 'utf8');
  const d = JSON.parse(raw);

  it('★① 形が 壊れていない（JSON として 読める）★', () => {
    expect(Array.isArray(d.rewrites), '★rewrites が ありません★').toBe(true);
    expect(d.rewrites.length, '★rewrites が 減っています★').toBeGreaterThanOrEqual(24);
  });

  it('★★② 行き先が 全部 テストのメーター★★', () => {
    const warui = d.rewrites
      .map((r) => r.destination)
      .filter((u) => typeof u === 'string' && u.indexOf(KOCHIRA) !== 0);
    expect(warui, '★テスト以外を 向いている 行き先が あります★').toEqual([]);
  });

  it('★★③ 本番の URL が 1つも 混ざっていない★★', () => {
    // ★本番の URL は「-test が 付かない daikou-app」★。
    //   テスト側は 必ず -test が 付くので、それを 数えて 見ます。
    const zenbu = (raw.match(/https:\/\/daikou-app[a-z-]*\.vercel\.app/g) || []);
    const honban = zenbu.filter((u) => u.indexOf('-test') < 0);
    expect(honban, '★本番の URL が 混ざっています★').toEqual([]);
    expect(zenbu.length, '★行き先が ありません★').toBeGreaterThanOrEqual(24);
  });

  it('★④ 画面を 持っていない（入口だけ）★', () => {
    // ★ここに html/js を 置くと、メーター側と 二重に なって 食い違います★
    const warui = fs
      .readdirSync(path.join(ROOT, 'office-host'))
      .filter((f) => /\.(html|js)$/.test(f) && f !== 'vercel.json');
    expect(warui, '★画面や js を 置いています（入口だけに してください）★').toEqual([]);
  });

  it('★⑤ Vercel が 知らないキーを 足していない★', () => {
    // ★知らないキーが 1つでも 在ると デプロイが 丸ごと 失敗します★（2026-08-31 に 実際に 踏んだ）
    const YURUSU = new Set([
      'rewrites',
      'redirects',
      'headers',
      'cleanUrls',
      'trailingSlash',
      'ignoreCommand',
      'public',
      'images',
      'git',
    ]);
    Object.keys(d).forEach((k) => {
      expect(YURUSU.has(k), '★"' + k + '" は Vercel が 知らないキー★').toBe(true);
    });
  });

  it('★★⑥ vercel.json は office-host の 中に ある★★', () => {
    // root-place
    // ★Vercel の Root Directory が "office-host" に 設定されて います★（2026-08-31 実測）
    // ⇒ 根に 置き直すと ★Vercel が 見つけられず 配信が 死にます★
    expect(fs.existsSync(VJ), '★office-host/vercel.json が ありません★').toBe(true);
    expect(
      fs.existsSync(path.join(ROOT, 'vercel.json')),
      '★根にも vercel.json が あります（どちらが 効くか 分からない）★'
    ).toBe(false);
  });
});
