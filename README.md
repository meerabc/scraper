# The polite scraper

A small, polite scraping pipeline for [books.toscrape.com](https://books.toscrape.com),
built for FlyRank Internship, Backend Track, Week 5, Assignment A9.

It downloads the first 3 catalogue pages, visits all ~60 book pages, and turns messy
HTML into clean, schema-checked JSON, without hammering the server, and without
crashing if one page is broken.

## Target classification

- **Site:** https://books.toscrape.com
- **What it is:** A fictional bookstore built by the ToScrape project specifically for
  people to practise web scraping on. Its own homepage (toscrape.com) states it
  "desperately wants to be scraped" and is "a safe place for beginners learning web
  scraping." It has no real business, no real customers, and no real stock behind it.
- **Scope:** Only the first 3 catalogue pages (20 books each) and the ~60 individual
  book detail pages they link to. Nothing beyond that is touched.
- **Data collected:** Book title, price, availability text, star rating, description,
  and the book's own URL, all text that the site displays publicly to any visitor,
  nothing behind a login or paywall.
- **robots.txt result:** Requested `https://books.toscrape.com/robots.txt`, the
  server returned **404 Not Found**. No robots file exists on this site. This is not
  the same as permission, it simply means the site has published no automated-access
  rules at all, so there is nothing to obey or disobey there. Permission instead comes
  from the site's own stated purpose (above).
- **Why this is appropriate:** This is a purpose-built practice sandbox, not a live
  business. It is scraped at a slow, clearly-identified pace, for a small, fixed,
  non-commercial amount of data.

I will not reuse this code on another site without checking its rules and terms first.