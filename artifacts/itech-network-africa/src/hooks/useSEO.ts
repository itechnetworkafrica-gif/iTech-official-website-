/**
 * useSEO — Per-page meta tag manager for iTech Network Africa.
 *
 * Updates: document.title, meta description, og:* tags, twitter:* tags,
 * canonical link, and meta robots. Restores the index.html defaults on unmount
 * so navigation between pages always shows the correct data.
 *
 * Usage:
 *   useSEO({ title: 'About Us', description: '...', canonical: '/about' });
 */
import { useEffect } from 'react';

// The only preferred production URL. Replit preview/deployment hosts are never
// allowed to become canonical URLs.
export const SITE_URL = 'https://www.itechnetworkafrica.com';
const SITE_NAME      = 'iTech Network Africa';
const DEFAULT_IMAGE  = `${SITE_URL}/og-image.png`;

function isNonCanonicalHost(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname.toLowerCase();
  return hostname.includes('replit');
}

export interface SEOConfig {
  /** Page title without site-name suffix — max ~55 chars */
  title: string;
  /** Meta description — max ~160 chars */
  description: string;
  /** Absolute path, e.g. "/about". Defaults to current pathname. */
  canonical?: string;
  /** Full image URL for OG/Twitter cards. Defaults to global og-image.png. */
  ogImage?: string;
  /** Set true for pages that must not appear in search results (admin, portal). */
  noindex?: boolean;
}

/* ─── helpers ──────────────────────────────────────────────────────────────── */

function getMeta(selector: string): HTMLMetaElement | null {
  return document.querySelector<HTMLMetaElement>(selector);
}

function getLinkEl(rel: string): HTMLLinkElement | null {
  return document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
}

function setAttr(el: Element | null, attr: string, value: string): string {
  const prev = el?.getAttribute(attr) ?? '';
  el?.setAttribute(attr, value);
  return prev;
}

/* ─── hook ──────────────────────────────────────────────────────────────────── */

export function useSEO({
  title,
  description,
  canonical,
  ogImage,
  noindex = false,
}: SEOConfig): void {
  useEffect(() => {
    const fullTitle    = `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${SITE_URL}${canonical ?? window.location.pathname}`;
    const image        = ogImage ?? DEFAULT_IMAGE;
    const robots       = noindex || isNonCanonicalHost() ? 'noindex, nofollow' : 'index, follow';

    // Snapshot previous values for cleanup
    const prevTitle    = document.title;
    const descEl       = getMeta('meta[name="description"]');
    const robotsEl     = getMeta('meta[name="robots"]');
    const canonEl      = getLinkEl('canonical');
    const ogTitleEl    = getMeta('meta[property="og:title"]');
    const ogDescEl     = getMeta('meta[property="og:description"]');
    const ogUrlEl      = getMeta('meta[property="og:url"]');
    const ogImgEl      = getMeta('meta[property="og:image"]');
    const twTitleEl    = getMeta('meta[name="twitter:title"]');
    const twDescEl     = getMeta('meta[name="twitter:description"]');
    const twUrlEl      = getMeta('meta[name="twitter:url"]');
    const twImgEl      = getMeta('meta[name="twitter:image"]');

    const prevDesc     = setAttr(descEl,    'content', description);
    const prevRobots   = setAttr(robotsEl,  'content', robots);
    const prevCanon    = setAttr(canonEl,   'href',    canonicalUrl);
    const prevOgTitle  = setAttr(ogTitleEl, 'content', fullTitle);
    const prevOgDesc   = setAttr(ogDescEl,  'content', description);
    const prevOgUrl    = setAttr(ogUrlEl,   'content', canonicalUrl);
    const prevOgImg    = setAttr(ogImgEl,   'content', image);
    const prevTwTitle  = setAttr(twTitleEl, 'content', fullTitle);
    const prevTwDesc   = setAttr(twDescEl,  'content', description);
    const prevTwUrl    = setAttr(twUrlEl,   'content', canonicalUrl);
    const prevTwImg    = setAttr(twImgEl,   'content', image);

    document.title = fullTitle;

    return () => {
      document.title = prevTitle;
      setAttr(descEl,    'content', prevDesc);
      setAttr(robotsEl,  'content', prevRobots);
      setAttr(canonEl,   'href',    prevCanon);
      setAttr(ogTitleEl, 'content', prevOgTitle);
      setAttr(ogDescEl,  'content', prevOgDesc);
      setAttr(ogUrlEl,   'content', prevOgUrl);
      setAttr(ogImgEl,   'content', prevOgImg);
      setAttr(twTitleEl, 'content', prevTwTitle);
      setAttr(twDescEl,  'content', prevTwDesc);
      setAttr(twUrlEl,   'content', prevTwUrl);
      setAttr(twImgEl,   'content', prevTwImg);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, canonical, ogImage, noindex]);
}
