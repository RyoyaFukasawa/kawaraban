import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DB_PATH = join(__dirname, "..", "digest.db");

export interface ArticleRow {
  id: number;
  date: string; // YYYY-MM-DD
  category: string; // technology | politics | economy
  source: string; // WSJ Technology など
  title_ja: string;
  title_en: string;
  url: string;
  summary: string;
  created_at: string;
}

export type NewArticle = Omit<ArticleRow, "id" | "created_at">;

export function openDb(path: string = DB_PATH): DatabaseSync {
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id          INTEGER PRIMARY KEY,
      date        TEXT    NOT NULL,
      category    TEXT    NOT NULL,
      source      TEXT    NOT NULL,
      title_ja    TEXT    NOT NULL,
      title_en    TEXT    NOT NULL,
      url         TEXT    NOT NULL UNIQUE,
      summary     TEXT    NOT NULL,
      created_at  TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_articles_date     ON articles(date);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
  `);
  return db;
}

/**
 * 記事を投入する。url がユニークキーなので、既出記事は無視される（重複排除）。
 * @returns 実際に新規追加された件数
 */
export function insertArticles(db: DatabaseSync, articles: NewArticle[]): number {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO articles (date, category, source, title_ja, title_en, url, summary)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  let added = 0;
  for (const a of articles) {
    const result = stmt.run(
      a.date,
      a.category,
      a.source,
      a.title_ja,
      a.title_en,
      a.url,
      a.summary,
    );
    if (result.changes > 0) added++;
  }
  return added;
}

/** 既に取り込み済みのURL集合を返す（取得段階での重複スキップに使う） */
export function existingUrls(db: DatabaseSync): Set<string> {
  const rows = db.prepare(`SELECT url FROM articles`).all() as { url: string }[];
  return new Set(rows.map((r) => r.url));
}

export function articlesByDate(db: DatabaseSync, date: string): ArticleRow[] {
  return db
    .prepare(`SELECT * FROM articles WHERE date = ? ORDER BY category, id`)
    .all(date) as ArticleRow[];
}

export function articlesByCategory(db: DatabaseSync, category: string): ArticleRow[] {
  return db
    .prepare(`SELECT * FROM articles WHERE category = ? ORDER BY date DESC, id DESC`)
    .all(category) as ArticleRow[];
}

export function allDates(db: DatabaseSync): string[] {
  const rows = db
    .prepare(`SELECT DISTINCT date FROM articles ORDER BY date DESC`)
    .all() as { date: string }[];
  return rows.map((r) => r.date);
}
