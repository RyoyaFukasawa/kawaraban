# News Digest

WSJ などの tech / 政治 / 経済ニュースを毎日自動で日本語に翻訳・要約して蓄積するリポジトリ。

- **正本**: `digest.db`（SQLite）。検索・重複排除はここ。
- **日付で読む**: `digests/YYYY/MM/YYYY-MM-DD.md`
- **カテゴリで読む**: `views/technology.md` / `views/politics.md` / `views/economy.md`

## 最近のダイジェスト

- [2026-05-29](digests/2026/05/2026-05-29.md)

## 検索例（SQLite）

```sql
-- 2026年5月の政治記事だけ
SELECT date, title_ja, source FROM articles
WHERE category='politics' AND date LIKE '2026-05%'
ORDER BY date DESC;
```
