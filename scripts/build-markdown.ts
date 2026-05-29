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

function renderArticle(a: ArticleRow): string {
  const tags = `#${a.category} #${a.date}`;
  // summary 内の \n を実改行に
  const summary = a.summary.replace(/\\n/g, "\n");
  return [
    `### [${a.title_ja}](${a.url})`,
    `*${a.title_en}*`,
    `出典: ${a.source} ・ ${tags}`,
    ``,
    summary,
    ``,
  ].join("\n");
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
  lines.push("- **カテゴリで読む**: `views/technology.md` / `views/politics.md` / `views/economy.md`");
  lines.push("");
  lines.push("## 仕組み");
  lines.push("");
  lines.push("1. **毎朝 6:50 JST** — GitHub Actions が RSS を取得し `raw-items.json` を生成（[.github/workflows/fetch-feeds.yml](.github/workflows/fetch-feeds.yml)）。");
  lines.push("2. **毎朝 7:00 JST** — Claude routine が記事を選定し、選んだ記事の本文を取得（[scripts/fetch-article.ts](scripts/fetch-article.ts)）して投資視点で翻訳・要約し、SQLite と Markdown に蓄積（[ROUTINES_PROMPT.md](ROUTINES_PROMPT.md)）。");
  lines.push("3. **毎週月曜** — 別の Claude routine が運用ログ（`ops-log/`）を分析し、フィード改善を PR で提案（[IMPROVE_PROMPT.md](IMPROVE_PROMPT.md)）。");
  lines.push("");
  lines.push("## 情報源");
  lines.push("");
  lines.push("党派や地域に偏らないよう、信頼性の高い無料RSSを横断している（[src/feeds.ts](src/feeds.ts)）。");
  lines.push("");
  lines.push("- **経済の事実報道**: WSJ・Financial Times・CNBC（Markets / Earnings）");
  lines.push("- **テック**: TechCrunch・CNBC Technology / NYT・BBC・NPR の各テック面");
  lines.push("- **中立・公共放送**: NPR・PBS・BBC");
  lines.push("- **保守寄り**: WSJ（論調） / **リベラル寄り**: NYT");
  lines.push("");
  lines.push("※ 無料媒体（CNBC・NPR・BBC・PBS・TechCrunch 等）は記事本文まで取得して厚く要約する。");
  lines.push("WSJ・NYT・FT は本文がペイウォールのため要約は RSS のリード文の範囲。");
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
