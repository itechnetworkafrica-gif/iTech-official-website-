import { useEffect } from 'react';
import { useLocation } from 'wouter';

/** Scroll to the element matching window.location.hash, or to the top. */
function scrollToHash() {
  const hash = window.location.hash;
  if (hash) {
    // Wait a tick for the page to render before measuring element positions
    const el = document.querySelector(hash);
    if (el) {
      // Account for the sticky header height (~100px)
      const headerOffset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      return true;
    }
  }
  return false;
}

/** Handles scroll-to-top on route change and smooth scroll-to-section for hash links. */
export const RouteScrollReset: React.FC = () => {
  const [location] = useLocation();

  // On every route change, either scroll to hash or to top
  useEffect(() => {
    if (window.location.hash) {
      // Give the page one frame to mount, then scroll
      const id = requestAnimationFrame(() => {
        if (!scrollToHash()) {
          // Element not rendered yet — retry after a short delay (e.g. lazy sections)
          setTimeout(scrollToHash, 200);
        }
      });
      return () => cancelAnimationFrame(id);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location]);

  // Handle hash changes on the same page (clicking a hash link while already on that path)
  useEffect(() => {
    const onHashChange = () => {
      requestAnimationFrame(scrollToHash);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return null;
};
