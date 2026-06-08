# INSIGHTS — プロジェクト改善の累積考察

このファイルは「kawaraban という仕組みをどう良くするか」についての考察を**追記式で積む**場所。
ニュース内容の感想ではなく、**fetch の仕組み・ソース構成・選定ロジック・最新性/先進性の担保**といった
プロジェクト自体の改善に関する所感を蓄積する。

- 日次ログ（`YYYY-MM-DD.md`）の「プロジェクト改善考察」は1日で流れる。ここはその集約先で**消えない**。
- **書き込むのは週次の改善 routine だけ**（[../IMPROVE_PROMPT.md](../IMPROVE_PROMPT.md)）。日次 routine は読むのみ。
- 既存の論点は消さず、状態を更新する（`🟢解消` / `🟡継続` / `🔴悪化` / `🔵検証中` のマーカーを付ける）。
- 新しい週の考察は **末尾に追記**する（時系列で読めるように）。

## 使い方（週次 routine 向け）
1. 直近7日の日次ログの「気づき/改善候補」「プロジェクト改善考察」を読む。
2. 下の「論点トラッカー」を更新する（既出論点の状態遷移＋新規論点の追加）。
3. その週に考えたこと・打った手（PR）・残した宿題を「週次エントリ」に**追記**する。
4. コード変更はあくまで PR で提案（このファイルへの追記はコミットしてよい）。

---

## 論点トラッカー（状態を更新していく一覧）

| 論点 | 種別 | 状態 | 初出 | 最終更新 | メモ |
|---|---|---|---|---|---|
| FT / NYT が全記事 paywalled で本文取得不可 | ソース | 🟡継続 | 2026-05-30 | 2026-06-07 | 7日連続で全件 paywalled/403。Reuters/AP の追加を検討中（要URL検証。下記「Reuters/AP economy 追加」行参照） |
| CBS News の `/video/` URL は本文0字 | 仕組み | 🔵検証中 | 2026-05-30 | 2026-06-07 | 06-07 に 29件中1件のみ採用。`/video/` フィルタ + skipped ログ追加の PR を今週提出 |
| BBC / The Hill が本文取得で403（bot遮断疑い） | 仕組み | 🟡継続 | 2026-05-30 | 2026-06-07 | 7日連続403。RSS description で代替中。User-Agent 調整の検討を次週以降に積む |
| WSJ Politics フィードが SKIP（HTTP 403/サイト改編疑い） | ソース | 🟡継続 | 2026-05-29 | 2026-06-07 | 7日連続で完全 SKIP（0件）。代替ソース未定 |
| AI枠（先進性優先）の効き具合は要観測 | 仕組み | 🟢解消 | 2026-06-02 | 2026-06-07 | 06-04〜06-07 でOpenAI/HuggingFace 本文取得成功。Reddit r/LocalLLaMA も description 経由で機能。報道より早い一次情報の取得を確認。ただし r/MachineLearning のノイズ継続（下記行参照） |
| Reddit r/MachineLearning のノイズ（議論スレが多く採用率低） | ソース | 🔵検証中 | 2026-06-07 | 2026-06-07 | 06-07 は6件全件が議論スレで採用0件。採用率が継続的に低ければ削除を次週以降に検討 |
| Reuters Business / AP Business を economy に追加すること | ソース | 🔵検証中 | 2026-06-07 | 2026-06-07 | コンテナ環境でURL検証不可のため今週は保留。次の検証手順で確認後に追加：(1) コンテナ外で `curl -I https://feeds.reuters.com/reuters/businessNews` → HTTP 200 + XML であること (2) `<item>` タグ含むことを確認 (3) AP: `https://feeds.apnews.com/rss/apf-business` も同様。確認後 economy カテゴリに追加する |

---

## 週次エントリ（末尾に追記していく）

### 2026-06-07 — CBS /video/ フィルタ PR 提出、Reuters/AP は保留

**読んだ日次ログ**: 2026-05-31 〜 2026-06-07 の 8件全件。

**今週の最大の課題**:
- Economy カテゴリが実質機能不全。FT・NYT Business・BBC Business がすべて paywalled/403 で7日連続。実質的に本文が取れているのは CNBC ファミリー（Markets/Earnings）+ NPR（1〜2件/日）+ PBS（1〜2件/日）のみ。
- CBS News が毎日29件を返すが大半が `/video/` URL で本文0字。06-07は29件中1件のみ採用という状態が続いている。

**最新性/先進性の担保**:
AI 枠の先進性優先は 06-04〜06-07 で機能を確認。OpenAI Blog（GPT-Rosalind, Dreaming）・Hugging Face（Holo3.1, NVIDIA Nemotron 3.5）は公式発表日当日に取得できており「報道の後追い」ではなく一次情報先行が実現している。Reddit r/LocalLLaMA は llama.cpp の Gemma4 MTP マージ情報を報道系より早く拾えた事例あり（06-07）。一方 Reddit r/MachineLearning は06-07で6件全件が議論スレで採用0件。継続的に採用率が低い場合は削除を検討。

**ソース構成の穴**（今週の診断）:
1. Economy: Reuters/AP 不在が最大の穴。FT/NYT 代替の無料一次情報源が皆無。
2. Politics: BBC World・The Hill が 403 継続。国際政治の本文情報が PBS + CBS 頼みに。
3. AI: r/MachineLearning のノイズ問題。BAIR Blog・Google DeepMind はほぼ空。
4. Robotics: IEEE Spectrum が「候補なし」の日がある（06-06）。The Robot Report は有望（06-07 で本文 OK）。

**選定ロジックの妥当性**:
MAX 5件/カテゴリの枠設定は妥当。AI カテゴリ先進性優先の方針は継続。ただし Reddit r/MachineLearning の採用率低下は要監視。

**打った手（今週のPR）**:
- `scripts/fetch-feeds.ts` に CBS News `/video/` URL フィルタ + `skipped` カウンタを追加（ジャッジ「やる」裁定）。
- 議論ログ: `ops-log/DEBATES/2026-06-07.md`

**残した宿題**:
1. Reuters Business / AP Business の URL をコンテナ外（ローカル or CI）で検証してから economy カテゴリに追加する。
2. Reddit r/MachineLearning の採用率を来週のログで確認し、継続的に低ければ削除を検討。
3. User-Agent 調整による BBC/The Hill の 403 解消を来週以降に試みる。
4. WSJ Politics フィードの代替を調査（現在完全 SKIP が7日連続）。

---

### 2026-06-02 — 初期化（seed）
- このファイルを新設。これまで日次ログの「気づき」が上書きで流れていたため、経時的なパターンが
  追跡できていなかった。論点トラッカーで状態を継続管理する運用に切り替える。
- 既存ログ（〜05-30）から読み取れる恒常的な論点を上の表に転記した。
- **最新性/先進性について**: 直近まで技術ソースは報道系（TechCrunch/CNBC/BBC/NPR/NYT）中心で、
  一次情報（研究所・企業公式）が薄かった。06-02 に AI 枠を新設し OpenAI/DeepMind/Hugging Face/
  MIT Tech Review/BAIR と Reddit(r/LocalLLaMA, r/MachineLearning) を追加。
  → 仮説: 「報道の後追い」から「一次情報を先に拾う」へ寄せられたはず。数日の採用実績で検証する。
- **宿題**: (1) AI枠の採用記事が報道より早いか／質が伴うかを日次ログで見る。(2) Reddit のノイズ比率
  （採用に値する話題がどれくらいか）を観測し、多すぎれば unverified ソースの絞り込みを検討。
