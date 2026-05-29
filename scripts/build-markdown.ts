// SQLite を正本として、閲覧用Markdownを再生成する:
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
  lines.push("# News Digest");
  lines.push("");
  lines.push("米国株（特にテック個別株）の投資判断に効く tech / 政治 / 経済ニュースを、");
  lines.push("毎日自動で日本語に翻訳・要約し、投資含意・関連銘柄つきで蓄積するリポジトリ。");
  lines.push("");
  lines.push("- **正本**: `digest.db`（SQLite）。検索・重複排除はここ。");
  lines.push("- **日付で読む**: `digests/YYYY/MM/YYYY-MM-DD.md`");
  lines.push("- **カテゴリで読む**: `views/technology.md` / `views/politics.md` / `views/economy.md`");
  lines.push("");
  lines.push("## 最近のダイジェスト");
  lines.push("");
  for (const d of dates.slice(0, 14)) {
    const [y, m] = d.split("-");
    lines.push(`- [${d}](digests/${y}/${m}/${d}.md)`);
  }
  lines.push("");
  lines.push("## 検索例（SQLite）");
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
