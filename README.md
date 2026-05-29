# kawaraban 瓦版

毎朝、世界のニュースを投資家の視点で読み解く自動ダイジェスト。
名前は江戸時代のニュース速報「瓦版」から。tech / 政治 / 経済の記事を日本語に
翻訳・要約し、**投資含意・関連銘柄・波及（連想の連鎖）**つきで毎日蓄積する。

単なる株ニュースだけでなく、出来事が**評判・信頼・競争環境・業界地図にどう波及し、
結果どの銘柄やセクターの見え方を変えるか**まで読み解くことを重視している。

- **正本**: `digest.db`（SQLite）。検索・重複排除はここ。
- **日付で読む**: `digests/YYYY/MM/YYYY-MM-DD.md`
- **カテゴリで読む**: `views/technology.md` / `views/politics.md` / `views/economy.md`

## 仕組み

1. **毎朝 6:50 JST** — GitHub Actions が RSS を取得し `raw-items.json` を生成（[.github/workflows/fetch-feeds.yml](.github/workflows/fetch-feeds.yml)）。
2. **毎朝 7:00 JST** — Claude routine が記事を選定・翻訳・投資視点で要約し、SQLite と Markdown に蓄積（[ROUTINES_PROMPT.md](ROUTINES_PROMPT.md)）。
3. **毎週月曜** — 別の Claude routine が運用ログ（`ops-log/`）を分析し、フィード改善を PR で提案（[IMPROVE_PROMPT.md](IMPROVE_PROMPT.md)）。

## 情報源

党派や地域に偏らないよう、信頼性の高い無料RSSを横断している（[src/feeds.ts](src/feeds.ts)）。

- **経済の事実報道**: WSJ・Financial Times・CNBC（Markets / Earnings）
- **テック**: TechCrunch・CNBC Technology / NYT・BBC・NPR の各テック面
- **中立・公共放送**: NPR・PBS・BBC
- **保守寄り**: WSJ（論調） / **リベラル寄り**: NYT

※ WSJ・NYT・FT は本文がペイウォールのため、要約は RSS のリード文の範囲。
記事に無い数値・ティッカーは創作しない方針。投資判断の補助情報であり、売買推奨ではない。

## 最近のダイジェスト

- [2026-05-29](digests/2026/05/2026-05-29.md)

## 検索例（SQLite）

```sql
-- 2026年5月の政治記事だけ
SELECT date, title_ja, source FROM articles
WHERE category='politics' AND date LIKE '2026-05%'
ORDER BY date DESC;
```
