# kawaraban 瓦版

毎朝、世界のニュースを投資家の視点で読み解く自動ダイジェスト。
名前は江戸時代のニュース速報「瓦版」から。tech / 政治 / 経済の記事を日本語に
翻訳・要約し、**投資含意・関連銘柄・波及（連想の連鎖）**つきで毎日蓄積する。

単なる株ニュースだけでなく、出来事が**評判・信頼・競争環境・業界地図にどう波及し、
結果どの銘柄やセクターの見え方を変えるか**まで読み解くことを重視している。

- **正本**: `articles.json`（テキスト）。重複排除もここ。git で差分が読める。
- **検索**: `digest.db`（SQLite）。`articles.json` から生成する派生物（git管理外）。
- **日付で読む**: `digests/YYYY/MM/YYYY-MM-DD.md`
- **カテゴリで読む**: `views/ai.md` / `views/robotics.md` / `views/technology.md` / `views/politics.md` / `views/economy.md`

## 仕組み

1. **毎朝 4:00 JST** — GitHub Actions が RSS を取得し `raw-items.json` を生成（[.github/workflows/fetch-feeds.yml](.github/workflows/fetch-feeds.yml)）。GitHub Actions のスケジュール実行は高負荷時間帯に遅延・ドロップする仕様で実測 50分〜1時間半ほど後ろにずれるため、7:00 routine に確実に間に合うよう前倒ししている。
2. **毎朝 7:00 JST** — Claude routine が記事を選定し、選んだ記事の本文を取得（[scripts/fetch-article.ts](scripts/fetch-article.ts)）して投資視点で翻訳・要約し、SQLite と Markdown に蓄積（[ROUTINES_PROMPT.md](ROUTINES_PROMPT.md)）。
3. **毎週月曜** — 別の Claude routine が直近7日の運用ログ（`ops-log/`）を全件読み、(A)複数レンズのagentでブレスト→(B)推進派⇄懐疑派の対立議論＋ジャッジ裁定で改善を練る。結論に基づくフィード改善を PR で提案する（ブレスト/議論ログは [ops-log/DEBATES/](ops-log/DEBATES/) に蓄積）（[IMPROVE_PROMPT.md](IMPROVE_PROMPT.md)）。

## 情報源

党派や地域に偏らないよう、信頼性の高い無料RSSを横断している（[src/feeds.ts](src/feeds.ts)）。

- **AI・先進技術**: OpenAI・Google DeepMind・Hugging Face・MIT Tech Review・BAIR（一次情報重視・先進性優先）
- **経済の事実報道**: WSJ・Financial Times・CNBC（Markets / Earnings）
- **テック**: TechCrunch・CNBC Technology / NYT・BBC・NPR の各テック面
- **中立・公共放送**: NPR・PBS・BBC
- **保守寄り**: WSJ（論調） / **リベラル寄り**: NYT
- **コミュニティ（⚠️未確認）**: Reddit r/LocalLLaMA・r/MachineLearning（報道より早いが裏取り前提）

※ 無料媒体（CNBC・NPR・BBC・PBS・TechCrunch 等）は記事本文まで取得して厚く要約する。
WSJ・NYT・FT は本文がペイウォールのため要約は RSS のリード文の範囲。
Reddit 等のコミュニティ発は ⚠️ 付きで「未確認情報」として明示し、事実断定を避ける。
記事に無い数値・ティッカーは創作しない方針。投資判断の補助情報であり、売買推奨ではない。

## 最近のダイジェスト

- [2026-06-20](digests/2026/06/2026-06-20.md)
- [2026-06-19](digests/2026/06/2026-06-19.md)
- [2026-06-18](digests/2026/06/2026-06-18.md)
- [2026-06-17](digests/2026/06/2026-06-17.md)
- [2026-06-15](digests/2026/06/2026-06-15.md)
- [2026-06-14](digests/2026/06/2026-06-14.md)
- [2026-06-13](digests/2026/06/2026-06-13.md)
- [2026-06-12](digests/2026/06/2026-06-12.md)
- [2026-06-11](digests/2026/06/2026-06-11.md)
- [2026-06-10](digests/2026/06/2026-06-10.md)
- [2026-06-09](digests/2026/06/2026-06-09.md)
- [2026-06-08](digests/2026/06/2026-06-08.md)
- [2026-06-07](digests/2026/06/2026-06-07.md)
- [2026-06-06](digests/2026/06/2026-06-06.md)

## 検索

CLI で手軽に（内部で `articles.json` から `digest.db` を生成して検索）:

```sh
npm run query -- --category politics --month 2026-05
npm run query -- --keyword NVDA
```

SQL を直接叩きたい場合（`npm run ingest` 等で生成された `digest.db` に対して）:

```sql
-- 2026年5月の政治記事だけ
SELECT date, title_ja, source FROM articles
WHERE category='politics' AND date LIKE '2026-05%'
ORDER BY date DESC;
```
