// フィード設定。ここを編集すれば収集ソースを足し引きできる。
// category は 'technology' | 'politics' | 'economy' のいずれか。
// WSJ のフィードURLはサイト改編で変わることがあるため、取得失敗しても
// 他のソースは止まらない設計（fetch-feeds.ts 側でスキップ）。

export type Category = "technology" | "politics" | "economy";

export interface FeedSource {
  /** 表示用の出典名 */
  name: string;
  /** RSS/Atom フィードのURL */
  url: string;
  /** 分類カテゴリ */
  category: Category;
  /** 本文が有料の壁の向こうか（要約はRSS記載範囲ベースになる旨の注記用） */
  paywalled?: boolean;
}

export const FEEDS: FeedSource[] = [
  // --- テクノロジー ---
  {
    name: "WSJ Technology",
    url: "https://feeds.a.dj.com/rss/RSSWSJD.xml",
    category: "technology",
    paywalled: true,
  },
  {
    name: "MarkTechPost",
    url: "https://www.marktechpost.com/feed/",
    category: "technology",
  },

  // --- 政治 ---
  {
    name: "WSJ Politics",
    url: "https://feeds.a.dj.com/rss/RSSPolitics.xml",
    category: "politics",
    paywalled: true,
  },
  {
    name: "The Hill",
    url: "https://thehill.com/homenews/feed/",
    category: "politics",
  },
  {
    name: "CBS News",
    url: "https://www.cbsnews.com/latest/rss/main",
    category: "politics",
  },

  // --- 経済・マーケット ---
  {
    name: "WSJ Markets",
    url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
    category: "economy",
    paywalled: true,
  },
  {
    name: "Financial Times",
    url: "https://www.ft.com/rss/home/international",
    category: "economy",
    paywalled: true,
  },
];

/** 1カテゴリあたり、ダイジェストに残す最大記事数 */
export const MAX_PER_CATEGORY = 5;

export const CATEGORY_LABELS: Record<Category, string> = {
  technology: "🖥 テクノロジー",
  politics: "🏛 政治",
  economy: "💹 経済・マーケット",
};

export const CATEGORY_ORDER: Category[] = ["technology", "politics", "economy"];
