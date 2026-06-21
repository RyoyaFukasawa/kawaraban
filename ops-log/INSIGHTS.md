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
| FT / NYT が全記事 paywalled で本文取得不可 | ソース | 🟡継続 | 2026-05-30 | 2026-06-21 | 直近2週（06-08〜06-21）全日で全件 paywalled/403 継続。Economy は実質 CNBC + PBS のみ。Reuters/AP URL はコンテナ環境から検証不可 |
| CBS News の `/video/` URL は本文0字 | 仕組み | 🟢解消 | 2026-05-30 | 2026-06-14 | /video/ フィルタPR導入済み（06-07実施）。06-09ログで「フィルタが機能している」を確認。ただし `/transcript/` URL 問題が新たに浮上（下記行参照） |
| CBS News の `/transcript/` URL（番組書き起こし）がノイズ | 仕組み | 🟡継続 | 2026-06-14 | 2026-06-21 | PR #15（open）にフィルタ追加済みだが未マージ。06-19ログでは問題なし。PR #15 マージ待ち |
| BBC / The Hill が本文取得で403（bot遮断疑い） | 仕組み | 🟡継続 | 2026-05-30 | 2026-06-21 | 直近2週全日403継続。RSS description で代替中。User-Agent 調整は検討続行 |
| WSJ Politics フィードが SKIP（HTTP 403/サイト改編疑い） | ソース | 🔴悪化 | 2026-05-29 | 2026-06-21 | 06-21時点で21日以上連続 SKIP（0件）。Politicsカテゴリに実質的な穴。今週PR（improve/feeds-2026-06-21）で削除、代替候補はPR本文に記載 |
| WSJ Technology フィードが SKIP（HTTP 403/サイト改編疑い） | ソース | 🔴悪化 | 2026-06-21 | 2026-06-21 | 06-21時点で15日以上連続 SKIP（0件）。WSJ Politics と同根。今週PRで削除 |
| AI枠（先進性優先）の効き具合は要観測 | 仕組み | 🟡継続 | 2026-06-02 | 2026-06-21 | 06-21（日曜）はr/LocalLLaMAが4件中4件（100%）。平日は1〜2件/5件程度で機能しているが週末の公式ブログ停止が顕在化。UNVERIFIED_RATIO_CAPで上限設定（今週PR） |
| Reddit r/MachineLearning のノイズ（議論スレが多く採用率低） | ソース | 🔴悪化 | 2026-06-07 | 2026-06-21 | PR #15（open）で削除待ち。06-21ログでは「削除済」と記載があるが実際はPR未マージ。次回マージ時に🟢解消へ遷移 |
| Reuters Business / AP Business を economy に追加すること | ソース | 🔵検証中 | 2026-06-07 | 2026-06-21 | 週次コンテナ環境ではDNS解決不可（全外部ホストが403/host not in allowlist）のため今週も検証不可。日次ルーティン環境での検証が必要。次回検証手順：curl -I https://feeds.reuters.com/reuters/businessNews で HTTP 200+XML かつ `<item>` タグ確認 |
| Anthropic Blog を AI枠に追加すること | ソース | 🔵検証中 | 2026-06-21 | 2026-06-21 | 06-19ログで「priority: 高」として言及。URL: https://www.anthropic.com/rss.xml。週次コンテナから疎通不可（403）。日次環境での検証後に次回PRで追加。検証手順：curl -I https://www.anthropic.com/rss.xml でHTTP 200+XML |
| Reddit unverified ソースの比率上限（UNVERIFIED_RATIO_CAP） | 仕組み | 🟢解消 | 2026-06-21 | 2026-06-21 | 今週PR（improve/feeds-2026-06-21）にて fetch-feeds.ts へ UNVERIFIED_RATIO_CAP=0.40 定数＋カテゴリ別カウンタ実装。カテゴリあたりunverified記事を最大2件（40%×5）に制限 |

---

## 週次エントリ（末尾に追記していく）

### 2026-06-21 — WSJ 2フィード削除・UNVERIFIED_RATIO_CAP 実装 PR

**読んだ日次ログ**: 2026-06-15, 06-17〜06-21 の6件（06-16欠損）。

**今週の最大の課題**:
- **WSJ Technology / WSJ Politics の長期SKIP**: WSJ Politics が21日以上、WSJ Technology が15日以上連続でSKIP（0件）。フィード自体が死んでいる。維持コストゼロだが「あるのに取れない」状態は混乱を招くため削除が妥当。
- **AI枠 r/LocalLLaMA 過依存（日曜に100%）**: 06-21（日曜）はAI枠5件中4件が r/LocalLLaMA。OpenAI Blog・Hugging Face 等の公式ブログは週末に更新停止する傾向があり、構造的問題。UNVERIFIED_RATIO_CAP で上限設定。
- **Anthropic Blog 未追加**: 06-19ログで「priority: 高」として言及があるが、URL疎通を日次環境でしか確認できない。今週は保留。

**最新性/先進性の担保**:
平日は OpenAI Blog・Hugging Face 等が機能（06-18: OpenAI Blog 2件採用が理想例）。週末の公式ブログ停止が AI枠品質の最大の不安定要因。UNVERIFIED_RATIO_CAP=0.40 により、r/LocalLLaMA が5件中2件（40%）を超えて採用されることを防ぐ。

**ソース構成の穴（今週の診断）**:
1. AI: r/LocalLLaMA への週末過依存（日曜100%が常態化リスク）。対処：UNVERIFIED_RATIO_CAP で今週実装。
2. Politics: WSJ Politics 21日以上SKIP。削除して代替を探す（Politico等は日次環境での検証後）。
3. Technology: WSJ Technology 15日以上SKIP。同様に削除。
4. Economy: FT/NYT paywall継続（構造問題、変化なし）。Reuters/AP は検証不可で継続保留。

**選定ロジックの妥当性**:
UNVERIFIED_RATIO_CAP=0.40 → カテゴリあたりunverified記事は最大 `max(2, floor(5×0.40))` = 2件に制限。定数として外出しすることで将来の調整が容易。

**打った手（今週のPR）**:
- `src/feeds.ts` から WSJ Technology・WSJ Politics を削除（15日以上SKIP継続）
- `scripts/fetch-feeds.ts` に UNVERIFIED_RATIO_CAP=0.40 + per-category カウンタを追加
- 議論ログ: `ops-log/DEBATES/2026-06-21.md`
- PR: improve/feeds-2026-06-21

**残した宿題**:
1. Anthropic Blog (https://www.anthropic.com/rss.xml) の日次環境での疎通確認 → 確認後に次回PRで AI枠に追加
2. Reuters Business / AP Business の日次環境での疎通確認（継続）
3. PR #15（r/MachineLearning 削除 + CBS /transcript/ フィルタ）のマージ促進
4. WSJ Politics 代替ソース（Politico 等）の日次環境での検証と追加
5. BBC/The Hill の User-Agent 調整による 403 解消の試み（継続）

---

### 2026-06-14 — Reddit r/ML 削除・CBS /transcript/ フィルタ PR

**読んだ日次ログ**: 2026-06-08〜2026-06-14 の7件全件。

**今週の最大の課題**:
- **Reddit r/MachineLearning の機能不全**: 直近7日で採用件数0件。直近3日（06-12〜06-14）はフィード自体が0件取得されていない（フィード停止の可能性）。維持するコストに見合う価値がなく、削除が妥当。
- **CBS News /transcript/ URL 混入（新規発見）**: 06-14ログで Face the Nation 等の番組書き起こし記事が5〜6件/日混入していることが判明。/video/ フィルタと同様の対処（/transcript/ URLをfetch段階でスキップ）が有効。
- **Economy 機能不全継続**: FT/NYT全件paywalled + BBC本文403 が7日連続。実質CNBC（2〜3件/日）+ PBS（1〜2件/日）のみ。Reuters/AP のURL検証は週次コンテナから不可（日次環境での検証待ち）。

**最新性/先進性の担保**:
AI枠は機能しているが Reddit r/LocalLLaMA への依存度が高まっている（06-14: AI枠全5件がLocalLLaMA）。OpenAI BlogやHugging Faceの記事が出ない日の補完として機能しているが、「未確認ソース」への過度な依存は継続リスクとして認識。

**ソース構成の穴（今週の診断）**:
1. Economy: Reuters/AP 不在が最大の穴（前週から継続）。週次コンテナ環境の制約で検証できず、保留継続。
2. Politics: WSJ Politics 15日以上連続SKIP。代替ソース（Politico Tech等）の追加が急務。
3. AI: r/MachineLearning が実質死んでいる。削除してクリーンに保つ方が良い。

**選定ロジックの妥当性**:
MAX 5件/カテゴリ維持。CBS Newsの /transcript/ URLs（番組書き起こし）がノイズとして6件程度/日混入しており、/video/ フィルタと同様にコード側でフィルタすることで候補の質が上がる。

**打った手（今週のPR）**:
- `src/feeds.ts` から Reddit r/MachineLearning を削除（採用率0%・フィード停止）
- `scripts/fetch-feeds.ts` に CBS News `/transcript/` URL フィルタを追加
- 議論ログ: `ops-log/DEBATES/2026-06-14.md`

**残した宿題**:
1. Reuters/AP Business URL の日次ルーティン環境での実際のURL検証（weekly コンテナから不可のため）
2. WSJ Politics の代替ソース（Politico Tech 等）のURL検証と追加（同上）
3. BBC/The Hill の User-Agent 調整による403解消の試み（継続）

---

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
