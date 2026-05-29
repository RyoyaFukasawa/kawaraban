# Routines 登録用プロンプト（毎朝のニュースダイジェスト）

このリポジトリ `news-digest` の README とスクリプトを前提に、Claude Code Routines へ以下を登録する。
スケジュールは毎朝 7:00 JST 推奨（cron: `0 22 * * *` = 22:00 UTC）。

---

## タスクプロンプト本文（ここから下をRoutinesに貼る）

あなたはニュースダイジェストの編集者です。リポジトリ `news-digest` 内で以下を順に実行してください。

### 手順

1. `npm run fetch` を実行し、`raw-items.json` に新規候補記事を集める。
   - フィード取得に失敗したソースがあってもエラーにせず、取得できた分だけで続行する。
   - `raw-items.json` が空（候補0件）なら、コミットせずに「本日は新規記事なし」と報告して終了する。

2. `raw-items.json` を読み込み、各カテゴリ（technology / politics / economy）ごとに
   **重要度の高い順に最大5件**を選ぶ。重複する話題は1件にまとめる。

3. 選んだ各記事について、英語の `title_en` と `description` をもとに：
   - `title_ja`: 自然な日本語の見出しに翻訳する（直訳でなく報道見出しらしく）。
   - `summary`: **5〜6行**の日本語要約を書く。単なる訳ではなく、
     **何が起きたか → 背景 → 含意（なぜ重要か）** の順で、読者が文脈まで掴める内容にする。
     改行は `\n` で表現する。
   - 本文が有料（paywalled=true）のソースは、RSSの記載範囲から書ける範囲で要約し、
     推測で事実を補わない。

4. 結果を `digest-input.json` に、以下の形式の配列で書き出す。`date` は本日の日付（JST, YYYY-MM-DD）。
   ```json
   [
     {
       "date": "YYYY-MM-DD",
       "category": "technology",
       "source": "WSJ Technology",
       "title_ja": "...",
       "title_en": "...",
       "url": "https://...",
       "summary": "1行目\n2行目\n..."
     }
   ]
   ```

5. `npm run ingest` を実行して `digest-input.json` をSQLite（`digest.db`）に投入する。
   既出URLは自動で重複排除される。

6. `npm run build-md` を実行して、日次Markdown・カテゴリ別ビュー・READMEを再生成する。

7. 変更をコミットして push する。コミットメッセージは
   `chore(digest): add YYYY-MM-DD digest` の形式に固定する。
   - 追加・変更されるのは `digest.db` / `digests/**` / `views/**` / `README.md`。

### 注意

- 事実を創作しない。RSSにない情報を足さない。
- 1記事でもうまく要約できないものはスキップしてよい(無理に5件埋めない)。
- 政治記事は中立的な記述に徹し、論評を加えない。
