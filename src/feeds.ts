// フィード設定。ここを編集すれば収集ソースを足し引きできる。
// category は 'technology' | 'politics' | 'economy' のいずれか。
// テック個別株・マーケットの投資判断に効くソースを重視している。
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
    // テックスタートアップ・資金調達・企業競争の報道。テック投資に直結（無料・本文も無料）。
    // 個人ブログ的だった MarkTechPost からの差し替え（信頼性と投資直結度で上回るため）。
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "technology",
  },
  {
    // テック個別株・製品の動向。投資視点での要約に向く（無料・安定）。
    name: "CNBC Technology",
    url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=19854910",
    category: "technology",
  },
  {
    // 英国・欧州のテック視点。製品・企業の話題が評判や競争環境に波及する記事を拾う。
    name: "BBC Technology",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    category: "technology",
  },
  {
    // 米公共放送。テックと社会・規制・科学の交差点を中立的に報道（無料・本文も無料・description充実）。
    name: "NPR Technology",
    url: "https://feeds.npr.org/1019/rss.xml",
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
  {
    // 国際情勢（中東・欧州・地政学）。原油やマクロ、各国・企業の評判に波及する材料を中立的に拾う。
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
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
  {
    // マーケット全体（金利・インフレ・指数）。無料でリード文が要約に足る。
    name: "CNBC Markets",
    url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=20910258",
    category: "economy",
  },
  {
    // 決算速報。個別株投資の核心となる業績情報源（無料）。
    name: "CNBC Earnings",
    url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839135",
    category: "economy",
  },
  {
    // 英国・欧州の経済・企業ニュース。米国偏重を是正し、世界経済の視点を補う。
    name: "BBC Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    category: "economy",
  },
  {
    // 米公共放送の経済報道。金利・インフレ・消費などマクロを中立的に深掘り（無料・description充実）。
    name: "NPR Economy",
    url: "https://feeds.npr.org/1017/rss.xml",
    category: "economy",
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
