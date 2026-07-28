import { useEffect } from 'react';
import { useLocation } from 'wouter';

/** Scrolls to the top of the page on every route change. */
export const RouteScrollReset: React.FC = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Only scroll to top if there's no hash anchor
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location]);

  return null;
};
