# ops-log — 運用ログ

毎日の日次ダイジェスト routine が、その日の収集状況を `YYYY-MM-DD.md` として
ここに書き出す。週次の改善 routine（[../IMPROVE_PROMPT.md](../IMPROVE_PROMPT.md)）が
このログを集計して `src/feeds.ts` の改善 PR を作る、という自己改善ループの記録場所。

人間がコードを直す必要はない。ログは routine が自動で残す。

## フォーマット（日次 routine が生成）

```markdown
# 運用ログ YYYY-MM-DD

## fetch 結果
| ソース | カテゴリ | 結果 | 取得/新規 | 備考 |
|---|---|---|---|---|
| WSJ Technology | technology | OK | 20 / 20 | |
| WSJ Politics | politics | SKIP | - | HTTP 403 |
| ... | | | | |

- 成功ソース数: X / 全Y
- 候補総数: N件

## カテゴリ別 採用状況
| カテゴリ | 候補 | 採用 | 備考 |
|---|---|---|---|
| technology | 30 | 5 | |
| politics | 45 | 3 | 候補は多いが低品質で3件のみ |
| economy | 29 | 5 | |

## 気づき / 改善候補
- WSJ Politics が継続して 403。サイト改編の可能性、代替フィード要検討。
- politics は件数は出るが速報の重複が多い。中立系の解説ソース追加を検討。
- （新ソース候補があればURLとともにメモ）
```

## 運用ルール
- 1日1ファイル。同日再実行時は追記ではなく上書き更新でよい。
- このログ自体はコミット対象（改善 routine が読むため）。
