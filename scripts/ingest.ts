// Routines上のClaudeが翻訳・要約して生成した digest-input.json をDBに投入する。
//
// digest-input.json の形式（配列）:
// [
//   {
//     "date": "2026-05-30",
//     "category": "technology",
//     "source": "WSJ Technology",
//     "title_ja": "日本語訳タイトル",
//     "title_en": "English Original Title",
//     "url": "https://...",
//     "summary": "5〜6行の日本語要約（改行は \\n で表現）"
//   }, ...
// ]

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { openDb, insertArticles, type NewArticle } from "../src/db.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT_PATH = join(__dirname, "..", "digest-input.json");

const VALID_CATEGORIES = new Set(["technology", "politics", "economy"]);

function validate(items: unknown): NewArticle[] {
  if (!Array.isArray(items)) throw new Error("digest-input.json は配列である必要があります");
  const out: NewArticle[] = [];
  for (const [i, raw] of items.entries()) {
    const a = raw as Record<string, unknown>;
    const required = ["date", "category", "source", "title_ja", "title_en", "url", "summary"];
    for (const key of required) {
      if (typeof a[key] !== "string" || (a[key] as string).trim() === "") {
        throw new Error(`item[${i}] のフィールド "${key}" が不正です`);
      }
    }
    if (!VALID_CATEGORIES.has(a.category as string)) {
      throw new Error(`item[${i}] の category "${a.category}" は無効です`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date as string)) {
      throw new Error(`item[${i}] の date "${a.date}" は YYYY-MM-DD 形式である必要があります`);
    }
    out.push({
      date: a.date as string,
      category: a.category as string,
      source: a.source as string,
      title_ja: a.title_ja as string,
      title_en: a.title_en as string,
      url: a.url as string,
      summary: a.summary as string,
    });
  }
  return out;
}

function main() {
  if (!existsSync(INPUT_PATH)) {
    console.error(`入力ファイルがありません: ${INPUT_PATH}`);
    process.exit(1);
  }
  const items = validate(JSON.parse(readFileSync(INPUT_PATH, "utf-8")));
  const db = openDb();
  const added = insertArticles(db, items);
  db.close();
  console.log(`${items.length}件中 ${added}件を新規追加しました（既出は重複排除）。`);
}

main();
