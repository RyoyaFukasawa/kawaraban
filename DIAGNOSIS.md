# HTTP 403 診断レポート

**実行日時**: 2026-05-29  
**実行環境**: Claude Code on the Web（クラウド実行コンテナ）  
**目的**: kawaraban フィード取得が HTTP 403 になる原因の切り分け

---

## 検証対象 URL

| # | 名称 | URL |
|---|------|-----|
| 1 | WSJ Markets | https://feeds.a.dj.com/rss/RSSMarketsMain.xml |
| 2 | CNBC Markets | https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=20910258 |
| 3 | CBS News | https://www.cbsnews.com/latest/rss/main |

---

## 検証結果

### パターン 1: 現行ボット UA

```
User-Agent: news-digest-bot/1.0 (+https://github.com/)
```

| URL | HTTP ステータス | サイズ (bytes) |
|-----|-----------------|---------------|
| WSJ Markets | **403** | 21 |
| CNBC Markets | **403** | 21 |
| CBS News | **403** | 21 |

### パターン 2: ブラウザ風 UA

```
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36
```

| URL | HTTP ステータス | サイズ (bytes) |
|-----|-----------------|---------------|
| WSJ Markets | **403** | 21 |
| CNBC Markets | **403** | 21 |
| CBS News | **403** | 21 |

### パターン 3: ブラウザ風 UA + ヘッダー一式

```
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36
Accept: application/rss+xml,application/xml,text/xml,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
```

| URL | HTTP ステータス | サイズ (bytes) |
|-----|-----------------|---------------|
| WSJ Markets | **403** | 21 |
| CNBC Markets | **403** | 21 |
| CBS News | **403** | 21 |

### パターン 4: Node.js 素の `fetch()`

```js
const r = await fetch(url);
console.log(r.status, r.headers.get('server'), r.headers.get('cf-ray'));
```

| URL | HTTP ステータス | server ヘッダー | cf-ray ヘッダー |
|-----|-----------------|-----------------|-----------------|
| WSJ Markets | **403** | null | null |
| CNBC Markets | **403** | null | null |
| CBS News | **403** | null | null |

---

## 403 レスポンスの詳細ヘッダー

全 URL・全パターンで同一のレスポンスが返った。代表として WSJ Markets の実測値を示す。

### レスポンスヘッダー（curl `-D -` による取得）

```
HTTP/2 403
x-deny-reason: host_not_allowed
content-length: 21
content-type: text/plain
date: Fri, 29 May 2026 08:43:05 GMT
```

### レスポンスボディ（先頭 200 文字）

```
Host not in allowlist
```

（21 バイト、ASCII テキスト。"Host not in allowlist" の 21 文字と一致）

### Node.js `fetch()` で取得した全ヘッダー（WSJ）

```
status: 403
content-length: 21
content-type: text/plain
date: Fri, 29 May 2026 08:43:19 GMT
x-deny-reason: host_not_allowed
```

---

## Cloudflare / WAF 痕跡の有無

| 指標 | 検出結果 |
|------|---------|
| `cf-ray` ヘッダー | **なし** |
| `cf-mitigated` ヘッダー | **なし** |
| `server: cloudflare` | **なし** |
| `x-` 系ヘッダー（Cloudflare / WAF） | `x-deny-reason: host_not_allowed` のみ |
| ボディに WAF/bot challenge の HTML | **なし**（"Host not in allowlist" のみ） |

---

## 結論

### (a) 主因: 実行環境のネットワークポリシーによる IP ブロック

**全パターン（ボット UA / ブラウザ UA / ブラウザ UA + ヘッダー一式 / Node.js fetch）で、3 URL すべてが HTTP 403 を返した。**

注目すべき点:

- `x-deny-reason: host_not_allowed` というヘッダーは対象 Web サイト（WSJ・CNBC・CBS News）が発行するものではない
- ボディが "Host not in allowlist" という 21 バイトの平文テキストであり、各サイトの bot 拒否ページ（通常は HTML、数 KB〜数十 KB）とは全く異なる
- 3 サイトで全く同一のヘッダー・ボディ・バイト数が返っており、レスポンスの発生源が単一のプロキシ/ゲートウェイであることを示している
- Cloudflare や各サイトの WAF の痕跡（`cf-ray`, `server: cloudflare`, WAF の HTML チャレンジページ等）が一切ない

**結論: リクエストは対象サーバーに到達していない。** クラウド実行コンテナの送信トラフィックを管理するネットワークプロキシが、許可リスト（allowlist）に登録されていないホストへのアウトバウンド通信を 403 で遮断している。UA やリクエストヘッダーの変更では回避できない。

### (b) ブラウザ風 UA・ヘッダーで通るパターン

**なし。** UA・Accept ヘッダー・Accept-Language・Accept-Encoding のいずれの組み合わせも効果なし。プロキシは HTTP ヘッダーの内容を見ておらず、宛先ホスト名のみで判断していると考えられる。

### (c) Cloudflare 等の痕跡

**なし。** 403 はターゲットサイトではなく実行環境のプロキシが返しており、Cloudflare・WAF・IP 評判ブロックとは無関係。

---

## 対処の方向性

1. **Claude Code on the Web の実行環境でフィード取得が必要な場合**: 環境のネットワーク設定でフィード URL のホスト（`feeds.a.dj.com`, `search.cnbc.com`, `www.cbsnews.com` 等）を許可リストに追加する必要がある。詳細は https://code.claude.com/docs/en/claude-code-on-the-web を参照。
2. **代替手段**: フィード取得を外部サービス（GitHub Actions, Vercel Cron 等、通常のクラウド環境）に移し、その結果を本リポジトリにコミットする構成にする。
3. **ローカル開発環境での実行**: ローカルで `node scripts/...` を実行する場合はこの制約はなく、正常に取得できると考えられる。
