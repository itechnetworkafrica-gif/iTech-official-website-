---
name: SEO canonical host
description: Public SEO metadata must use the www custom domain, not Replit alternate hosts.
---

Rule: `https://www.itechnetworkafrica.com` is the public SEO origin; Replit hosts are alternate delivery URLs.

**Why:** Google Search Console previously selected a Replit URL as canonical, causing the custom-domain homepage to be treated as an alternate page.

**How to apply:** Keep canonical links, Open Graph/Twitter URLs, JSON-LD, sitemap, and robots sitemap references on the `www` domain. Mark Replit hosts `noindex`, and prefer a host-level permanent redirect when the hosting layer supports it.