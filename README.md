# ダイコメ 事務所の 入口（テスト）

★この repo は「入口の 札」だけです。画面は 1枚も 持っていません★

## これは 何か

`daikome-jimusho-test.vercel.app`（司さんが 開く 事務所の 画面）の **入口**です。
中身は `vercel.json` の **rewrite 21本**だけで、
実際の 画面は **メーター側（daikou-app-test.vercel.app）** から 取ってきて 見せています。

★客から見た URL は 何も 変わりません★

## なぜ 別の repo に したか（2026-08-31・司さんの指示）

前は メーターと **同じ repo（Daikou-app）** に つながっていました。

★実測（ビルドログの 実物）★

```
16:08:01  Cloning github.com/exally-zeroact/Daikou-app-test (Branch: main)
16:11:58  Cloning completed: ★3:56.525★
16:11:58  Running "if [ "$VERCEL_ENV" != "production" ]; ..."
16:11:58  ★WARNING! Build output contains no "functions" or "static" directory★
16:11:58  Build Completed in /vercel/output ★[11ms]★
```

⇒ ★3分56秒 かけて 3.2GB を 引き、中身を 何も 作っていませんでした★
⇒ 1本 約15.7 コア分＝**$0.056** を ★中身ゼロ★に 払っていた

★clone の 時間は「repo の 履歴の 大きさ」で 決まります★（tip の 大きさでは ない）。
この repo は **履歴が 空** なので clone は **数秒**で 終わります。

## 触る時の 決まり

- ★ここに 画面（html/js）を 置かない★。画面は メーター側に 置く
- rewrite の 行き先は **本番のメーター** `https://daikou-app-test.vercel.app` だけ
  （本番用は 別 repo `daikome-jimusho-host`）
- ★向き先を 取り違えると 事務所が テストを 見ます★ので、
  `tests/muki-saki.test.js` が 機械で 見張っています

## 元の 置き場

この `vercel.json` は `Daikou-app-test` の `office-host/vercel.json` から 持ってきました。
**中身は 1文字も 変えていません**（2026-08-31 時点でバイト一致）。

## ★なぜ `office-host/` の 中に 置いているか★（2026-08-31 実測）

Vercel の この案件は **Root Directory = `office-host`** に 設定されています。

```
$ vercel project inspect daikome-jimusho
    Root Directory		office-host
```

⇒ `vercel.json` を **repo の 根に 置くと Vercel が 見つけられません**（配信が 死にます）。
⇒ なので **元と 同じ `office-host/vercel.json`** の ままに してあります。
★管理画面の 設定を 1つも 触らずに 差し替えられる★のが 狙いです。

`tests/muki-saki.test.js` の ⑥が これを 見張っています
（★根に 置き直す★／★office-host ごと 消す★の 両方で 赤に なる事を 実測済み）。

<!-- つなぎ替え 確認 2026-08-31 -->
