import fs from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";

const USER_AGENT = "FlyRankInternshipA9/1.0 (+https://github.com/meerabc/scraper)";
const CACHE_DIR = "cache";
const TIMEOUT_MS = 8000;
const DELAY_MS = 500;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(url, cacheFile) {
  const cachePath = path.join(CACHE_DIR, cacheFile);

  try {
    const cached = await fs.readFile(cachePath, "utf-8");
    console.log(`CACHE HIT ${cacheFile} (${cached.length} bytes)`);
    return cached;
  } catch {}

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: controller.signal,
  });
  clearTimeout(timer);

  if (res.status !== 200) {
    throw new Error(`Failed fetch: ${url} returned status ${res.status}`);
  }

  const html = await res.text();
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(cachePath, html, "utf-8");
  console.log(`FETCH ${cacheFile} (${html.length} bytes)`);
  await sleep(DELAY_MS);
  return html;
}

async function discoverCatalogue(maxPages = 3) {
  const bookUrls = new Set();
  let pageUrl = "https://books.toscrape.com/catalogue/page-1.html";
  let pageNum = 1;

  while (pageUrl && pageNum <= maxPages) {
    const html = await fetchPage(pageUrl, `catalogue-page-${pageNum}.html`);
    const $ = cheerio.load(html);

    $(".product_pod h3 a").each((_, el) => {
      const href = $(el).attr("href");
      bookUrls.add(new URL(href, pageUrl).href);
    });

    const nextHref = $(".next a").attr("href");
    pageUrl = nextHref ? new URL(nextHref, pageUrl).href : null;
    pageNum++;
  }

  return { catalogue_pages: pageNum - 1, urls: [...bookUrls] };
}

const result = await discoverCatalogue();
console.log(`catalogue_pages=${result.catalogue_pages} discovered=${result.urls.length} unique_urls=${result.urls.length}`);