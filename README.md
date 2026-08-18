# The polite scraper

A small, polite scraping pipeline for [books.toscrape.com](https://books.toscrape.com),
built for FlyRank Internship, Backend Track, Week 5, Assignment A9.

It downloads the first 3 catalogue pages, visits all 60 book pages, and turns messy
HTML into clean, schema-checked JSON, without hammering the server, and without
crashing if one page is broken.

## How to run

```bash
npm install
npm start
```

Requires Node.js 20+. Produces `output/books.json`, `output/errors.json`, and
`output/run-report.json`.

## Lane

JavaScript (Node.js 20+), using built-in `fetch`, Cheerio for HTML parsing, and Zod
for schema validation.

## Target classification

- **Site:** https://books.toscrape.com
- **What it is:** A fictional bookstore built by the ToScrape project specifically for
  people to practise web scraping on. Its own homepage (toscrape.com) states it
  "desperately wants to be scraped" and is "a safe place for beginners learning web
  scraping." It has no real business, no real customers, and no real stock behind it.
- **Scope:** Only the first 3 catalogue pages (20 books each) and the 60 individual
  book detail pages they link to. Nothing beyond that is touched.
- **Data collected:** Book title, price, availability text, star rating, description,
  and the book's own URL, all text the site displays publicly to any visitor, nothing
  behind a login or paywall.
- **robots.txt result:** Requested `https://books.toscrape.com/robots.txt`. The
  server returned **404 Not Found**. No robots file exists on this site. This is not
  the same as permission; it simply means the site has published no automated-access
  rules at all, so there is nothing to obey or disobey there. Permission instead comes
  from the site's own stated purpose (above).
- **Why this is appropriate:** This is a purpose-built practice sandbox, not a live
  business. It is scraped at a slow, clearly-identified pace, for a small, fixed,
  non-commercial amount of data.

I will not reuse this code on another site without checking its rules and terms first.

## Record schema

Each entry in `output/books.json`:

| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `product_url` | string (URL) | canonical identity of the record |
| `price_text` | string | raw text as shown on the page, e.g. `"£51.77"` |
| `price_gbp` | number | parsed from `price_text` |
| `availability_text` | string | e.g. `"In stock (22 available)"` |
| `rating_text` | string | e.g. `"Three"` |
| `description` | string or null | `null` when the page has no description |
| `source_page` | string (URL) | which catalogue page linked to this book |
| `fetched_at` | string (ISO datetime) | when this record was collected |

Records that fail validation are written to `output/errors.json` with a `reason`
instead of `books.json`.

## Politeness rules

- Identifies itself with a custom `User-Agent`: `FlyRankInternshipA9/1.0`
- 8-second timeout on every request
- 500ms delay between real requests (cached reads have no delay)
- Every response's status code is checked; only `200` is treated as success
- Development reads from `cache/` instead of re-requesting the live site
- 5xx errors and network failures are retried once; `404`/`403` are never retried

## Why no browser was needed

toscrape.com itself states books.toscrape.com does not require JavaScript. The data
is already present in the HTML the server sends on first response. A tool like
Playwright, which launches a real browser to execute JavaScript, would only add cost
(memory, startup time) with no benefit here.

## Sample run report

```json
{
  "start_time": "2026-08-18T05:05:31.151Z",
  "duration_ms": 913,
  "pages_fetched": 0,
  "cache_hits": 63,
  "valid_records": 60,
  "invalid_records": 0,
  "failed_pages": 0
}
```

`pages_fetched: 0` and `cache_hits: 63` here because this run was fully served from
cache (3 catalogue pages + 60 book pages already downloaded in an earlier run),
proof of both caching and idempotency (60 valid records, no duplicates, no failures).

## Honest limitation

The retry logic retries a failed request exactly once, after a fixed 1.5s delay. It
does not implement exponential backoff or respect a `Retry-After` header.

## Ethics note

This scraper only targets a site explicitly built and offered for scraping practice.
In general: prefer an official API when one exists, never bypass logins, paywalls, or
access blocks, and collect only the data actually needed for the task at hand.