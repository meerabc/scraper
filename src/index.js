import fs from "fs/promises";
import path from "path";

const USER_AGENT = "FlyRankInternshipA9/1.0 (+https://github.com/meerabc/scraper)";
const CACHE_DIR = "cache";
const TIMEOUT_MS = 8000;

async function fetchPage(url, cacheFile) {
  const cachePath = path.join(CACHE_DIR, cacheFile);

  try {
    const cached = await fs.readFile(cachePath, "utf-8");
    console.log(`CACHE HIT ${cacheFile} (${cached.length} bytes)`);
    return cached;
  } catch {
    // not cached yet, fall through to fetch
  }

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
  return html;
}

await fetchPage("https://books.toscrape.com/catalogue/page-1.html", "catalogue-page-1.html");