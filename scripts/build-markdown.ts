// articles.json を正本として、閲覧用Markdownを再生成する（内部で digest.db を生成して読む）:
//   - digests/YYYY/MM/YYYY-MM-DD.md  (日付ビュー)
//   - views/<category>.md            (カテゴリ別ビュー, 日付逆順)
//   - README.md                      (索引: 最新の日付へのリンク)

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  openDb,
  articlesByDate,
  articlesByCategory,
  allDates,
  type ArticleRow,
} from "../src/db.ts";
import { CATEGORY_LABELS, CATEGORY_ORDER, type Category } from "../src/feeds.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Reddit 等の未確認ソースを出典名から機械的に判定する。
// routine 側でも⚠️を付ける運用だが、書き忘れの保険としてここでも自動付与する。
// 注: 正本(articles.json)/DB は unverified 列を持たないため、ここでは source 名で判定している。
//     feeds.ts に unverified ソースを増やしたら、その出典名がこの正規表現に乗るか確認すること
//     （乗らない命名のソースを足す場合は、ここのパターンも更新する）。
function isUnverifiedSource(source: string): boolean {
  return /reddit/i.test(source);
}

function renderArticle(a: ArticleRow): string {
  const tags = `#${a.category} #${a.date}`;
  // summary 内の \n を実改行に
  const summary = a.summary.replace(/\\n/g, "\n");
  const unverified = isUnverifiedSource(a.source);
  // 未確認ソースは見出しに⚠️を付け、末尾に注記を添える（事実断定を避ける明示）。
  // ただし routine 側でも ⚠️/注記を入れる運用のため、二重にならないよう冪等にする
  // （title が既に⚠️で始まる/summaryに既に未確認注記がある場合は重ねて足さない）。
  const titleHasWarning = a.title_ja.trimStart().startsWith("⚠️");
  const summaryHasNote = /未確認情報/.test(summary);
  const heading =
    unverified && !titleHasWarning
      ? `### ⚠️ [${a.title_ja}](${a.url})`
      : `### [${a.title_ja}](${a.url})`;
  const lines = [
    heading,
    `*${a.title_en}*`,
    `出典: ${a.source} ・ ${tags}`,
    ``,
    summary,
  ];
  if (unverified && !summaryHasNote) {
    lines.push(
      `> ⚠️ **未確認情報**（${a.source}発・要裏取り）。コミュニティの話題であり、事実は確認されていません。`,
    );
  }
  lines.push(``);
  return lines.join("\n");
}

function renderDateFile(date: string, rows: ArticleRow[]): string {
  const cats = [...new Set(rows.map((r) => r.category))];
  const lines: string[] = [];
  lines.push("---");
  lines.push(`date: ${date}`);
  lines.push(`categories: [${cats.join(", ")}]`);
  lines.push(`count: ${rows.length}`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${date} ニュースダイジェスト`);
  lines.push("");

  for (const cat of CATEGORY_ORDER) {
    const inCat = rows.filter((r) => r.category === cat);
    if (inCat.length === 0) continue;
    lines.push(`## ${CATEGORY_LABELS[cat as Category]}`);
    lines.push("");
    for (const a of inCat) lines.push(renderArticle(a));
  }
  return lines.join("\n");
}

function renderCategoryView(cat: Category, rows: ArticleRow[]): string {
  const lines: string[] = [];
  lines.push(`# ${CATEGORY_LABELS[cat]} — 全アーカイブ`);
  lines.push("");
  lines.push(`全${rows.length}件 / 日付の新しい順`);
  lines.push("");
  let currentDate = "";
  for (const a of rows) {
    if (a.date !== currentDate) {
      currentDate = a.date;
      lines.push(`## ${a.date}`);
      lines.push("");
    }
    lines.push(renderArticle(a));
  }
  return lines.join("\n");
}

function renderReadme(dates: string[]): string {
  const lines: string[] = [];
  lines.push("# kawaraban 瓦版");
  lines.push("");
  lines.push("毎朝、世界のニュースを投資家の視点で読み解く自動ダイジェスト。");
  lines.push("名前は江戸時代のニュース速報「瓦版」から。tech / 政治 / 経済の記事を日本語に");
  lines.push("翻訳・要約し、**投資含意・関連銘柄・波及（連想の連鎖）**つきで毎日蓄積する。");
  lines.push("");
  lines.push("単なる株ニュースだけでなく、出来事が**評判・信頼・競争環境・業界地図にどう波及し、");
  lines.push("結果どの銘柄やセクターの見え方を変えるか**まで読み解くことを重視している。");
  lines.push("");
  lines.push("- **正本**: `articles.json`（テキスト）。重複排除もここ。git で差分が読める。");
  lines.push("- **検索**: `digest.db`（SQLite）。`articles.json` から生成する派生物（git管理外）。");
  lines.push("- **日付で読む**: `digests/YYYY/MM/YYYY-MM-DD.md`");
  // CATEGORY_ORDER から動的に生成（feeds.ts でカテゴリを追加すれば自動で追従）。
  const viewLinks = CATEGORY_ORDER.map((c) => `\`views/${c}.md\``).join(" / ");
  lines.push(`- **カテゴリで読む**: ${viewLinks}`);
  lines.push("");
  lines.push("## 仕組み");
  lines.push("");
  lines.push("1. **毎朝 4:00 JST** — GitHub Actions が RSS を取得し `raw-items.json` を生成（[.github/workflows/fetch-feeds.yml](.github/workflows/fetch-feeds.yml)）。GitHub Actions のスケジュール実行は高負荷時間帯に遅延・ドロップする仕様で実測 50分〜1時間半ほど後ろにずれるため、7:00 routine に確実に間に合うよう前倒ししている。");
  lines.push("2. **毎朝 7:00 JST** — Claude routine が記事を選定し、選んだ記事の本文を取得（[scripts/fetch-article.ts](scripts/fetch-article.ts)）して投資視点で翻訳・要約し、SQLite と Markdown に蓄積（[ROUTINES_PROMPT.md](ROUTINES_PROMPT.md)）。");
  lines.push("3. **毎週月曜** — 別の Claude routine が直近7日の運用ログ（`ops-log/`）を全件読み、(A)複数レンズのagentでブレスト→(B)推進派⇄懐疑派の対立議論＋ジャッジ裁定で改善を練る。結論に基づくフィード改善を PR で提案する（ブレスト/議論ログは [ops-log/DEBATES/](ops-log/DEBATES/) に蓄積）（[IMPROVE_PROMPT.md](IMPROVE_PROMPT.md)）。");
  lines.push("");
  lines.push("## 情報源");
  lines.push("");
  lines.push("党派や地域に偏らないよう、信頼性の高い無料RSSを横断している（[src/feeds.ts](src/feeds.ts)）。");
  lines.push("");
  lines.push("- **AI・先進技術**: OpenAI・Google DeepMind・Hugging Face・MIT Tech Review・BAIR（一次情報重視・先進性優先）");
  lines.push("- **経済の事実報道**: WSJ・Financial Times・CNBC（Markets / Earnings）");
  lines.push("- **テック**: TechCrunch・CNBC Technology / NYT・BBC・NPR の各テック面");
  lines.push("- **中立・公共放送**: NPR・PBS・BBC");
  lines.push("- **保守寄り**: WSJ（論調） / **リベラル寄り**: NYT");
  lines.push("- **コミュニティ（⚠️未確認）**: Reddit r/LocalLLaMA・r/MachineLearning（報道より早いが裏取り前提）");
  lines.push("");
  lines.push("※ 無料媒体（CNBC・NPR・BBC・PBS・TechCrunch 等）は記事本文まで取得して厚く要約する。");
  lines.push("WSJ・NYT・FT は本文がペイウォールのため要約は RSS のリード文の範囲。");
  lines.push("Reddit 等のコミュニティ発は ⚠️ 付きで「未確認情報」として明示し、事実断定を避ける。");
  lines.push("記事に無い数値・ティッカーは創作しない方針。投資判断の補助情報であり、売買推奨ではない。");
  lines.push("");
  lines.push("## 最近のダイジェスト");
  lines.push("");
  for (const d of dates.slice(0, 14)) {
    const [y, m] = d.split("-");
    lines.push(`- [${d}](digests/${y}/${m}/${d}.md)`);
  }
  lines.push("");
  lines.push("## 検索");
  lines.push("");
  lines.push("CLI で手軽に（内部で `articles.json` から `digest.db` を生成して検索）:");
  lines.push("");
  lines.push("```sh");
  lines.push("npm run query -- --category politics --month 2026-05");
  lines.push("npm run query -- --keyword NVDA");
  lines.push("```");
  lines.push("");
  lines.push("SQL を直接叩きたい場合（`npm run ingest` 等で生成された `digest.db` に対して）:");
  lines.push("");
  lines.push("```sql");
  lines.push("-- 2026年5月の政治記事だけ");
  lines.push("SELECT date, title_ja, source FROM articles");
  lines.push("WHERE category='politics' AND date LIKE '2026-05%'");
  lines.push("ORDER BY date DESC;");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

function main() {
  const db = openDb();
  const dates = allDates(db);

  // 日付ビュー（全日付を再生成）
  for (const date of dates) {
    const rows = articlesByDate(db, date);
    const [y, m] = date.split("-");
    const dir = join(ROOT, "digests", y, m);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${date}.md`), renderDateFile(date, rows), "utf-8");
  }

  // カテゴリビュー
  mkdirSync(join(ROOT, "views"), { recursive: true });
  for (const cat of CATEGORY_ORDER) {
    const rows = articlesByCategory(db, cat);
    writeFileSync(join(ROOT, "views", `${cat}.md`), renderCategoryView(cat as Category, rows), "utf-8");
  }

  // README索引
  writeFileSync(join(ROOT, "README.md"), renderReadme(dates), "utf-8");

  db.close();
  console.log(`Markdown生成完了: 日付${dates.length}件 + カテゴリ${CATEGORY_ORDER.length}件 + README`);
}

main();
