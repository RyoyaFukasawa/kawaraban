// 全フィードを取得し、未取得(新規)の候補記事を raw-items.json に書き出す。
// 翻訳・要約は行わない（それはRoutines上のClaudeが担当）。
// 失敗したフィードはスキップして他を続行する。

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { FEEDS } from "../src/feeds.ts";
import { parseFeed, type FeedItem } from "../src/rss.ts";
import { existingUrls } from "../src/db.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "raw-items.json");

export interface RawCandidate {
  source: string;
  category: string;
  paywalled: boolean;
  title_en: string;
  url: string;
  description: string;
  pubDate?: string;
}

async function fetchFeed(url: string, timeoutMs = 15000): Promise<FeedItem[]> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // 一部サイトはUA無しを弾くため明示
        "User-Agent": "news-digest-bot/1.0 (+https://github.com/)",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return parseFeed(xml);
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  // 既出URL（正本 articles.json から直接引く）で取得段階の重複をスキップ
  const seen = existingUrls();

  const candidates: RawCandidate[] = [];
  const perCategoryUrls = new Set<string>(); // 同一実行内の重複も排除

  for (const feed of FEEDS) {
    try {
      const items = await fetchFeed(feed.url);
      let kept = 0;
      for (const item of items) {
        const url = item.link.trim();
        if (!url) continue;
        if (seen.has(url) || perCategoryUrls.has(url)) continue; // 重複排除
        perCategoryUrls.add(url);
        candidates.push({
          source: feed.name,
          category: feed.category,
          paywalled: !!feed.paywalled,
          title_en: item.title,
          url,
          description: item.description,
          pubDate: item.pubDate,
        });
        kept++;
      }
      console.log(`OK   ${feed.name}: ${items.length}件取得 / 新規${kept}件`);
    } catch (err) {
      // 1本死んでも全体は止めない
      console.warn(`SKIP ${feed.name}: 取得失敗 (${(err as Error).message})`);
    }
  }

  writeFileSync(OUT_PATH, JSON.stringify(candidates, null, 2), "utf-8");
  console.log(`\n候補 ${candidates.length}件を ${OUT_PATH} に書き出しました。`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
