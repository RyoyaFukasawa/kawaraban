// 指定URLの記事本文を取得・抽出して JSON で標準出力に返す。
//   npm run fetch-article -- "https://www.cnbc.com/2026/05/29/..."
//   npm run fetch-article -- "<url1>" "<url2>" ...  （複数可）
//
// 用途: Routines 上の Claude が、選定した記事の本文を厚く要約するために使う。
// RSSのdescription（リード文）より深い本文が取れる無料媒体を想定。
// ペイウォール（WSJ/NYT/FT等）や 403/bot対策で本文が取れない場合は
// text を空にして返すので、呼び出し側は RSS の description にフォールバックする。
//
// 出力（標準出力, JSON配列）:
//   [{ "url": "...", "ok": true, "status": 200, "chars": 3200, "text": "本文..." }, ...]

import { extractArticle } from "../src/extract.ts";

async function fetchHtml(url: string, timeoutMs = 20000): Promise<{ status: number; html: string }> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        // ニュースサイトはブラウザ風UAでないと弾くことが多い
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const html = await res.text();
    return { status: res.status, html };
  } finally {
    clearTimeout(t);
  }
}

interface ArticleResult {
  url: string;
  ok: boolean;
  status: number | null;
  chars: number;
  paragraphs: number;
  text: string;
  error?: string;
}

async function fetchOne(url: string): Promise<ArticleResult> {
  try {
    const { status, html } = await fetchHtml(url);
    if (status < 200 || status >= 300) {
      return { url, ok: false, status, chars: 0, paragraphs: 0, text: "", error: `HTTP ${status}` };
    }
    const { text, paragraphs, chars } = extractArticle(html);
    // 本文が短すぎる場合は「取れなかった」扱い（ペイウォール抜粋など）
    const ok = chars >= 200;
    return { url, ok, status, chars, paragraphs, text: ok ? text : "" };
  } catch (err) {
    return {
      url,
      ok: false,
      status: null,
      chars: 0,
      paragraphs: 0,
      text: "",
      error: (err as Error).message,
    };
  }
}

async function main() {
  const urls = process.argv.slice(2).filter((a) => /^https?:\/\//.test(a));
  if (urls.length === 0) {
    console.error('使い方: npm run fetch-article -- "<URL>" ["<URL2>" ...]');
    process.exit(1);
  }

  // 適度な並列度で取得（相手サイトに優しく、かつ速く）
  const CONCURRENCY = 4;
  const results: ArticleResult[] = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const settled = await Promise.all(batch.map(fetchOne));
    results.push(...settled);
  }

  // 進捗は stderr、結果(JSON)は stdout に出す（パイプで拾いやすく）
  for (const r of results) {
    const tag = r.ok ? `OK   ${r.chars}字/${r.paragraphs}段落` : `MISS ${r.error ?? "本文薄い"}`;
    console.error(`${tag}  ${r.url}`);
  }
  process.stdout.write(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
