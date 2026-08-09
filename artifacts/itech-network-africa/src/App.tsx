import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { RouteScrollReset } from '@/components/RouteScrollReset';
import { CookieBanner } from '@/components/CookieBanner';
import { SarahChatbot } from '@/components/SarahChatbot';

// Lazy-loaded page imports — each page becomes its own JS chunk
const HomePage         = lazy(() => import('@/pages/HomePage'));
const AboutPage        = lazy(() => import('@/pages/AboutPage'));
const ServicesPage     = lazy(() => import('@/pages/ServicesPage'));
const ServiceDetailPage= lazy(() => import('@/pages/ServiceDetailPage'));
const AIPage           = lazy(() => import('@/pages/AIPage'));
const SolutionsPage    = lazy(() => import('@/pages/SolutionsPage'));
const ProductsPage     = lazy(() => import('@/pages/ProductsPage'));
const PortfolioPage    = lazy(() => import('@/pages/PortfolioPage'));
const ProjectsPage     = lazy(() => import('@/pages/ProjectsPage'));
const IndustriesPage   = lazy(() => import('@/pages/IndustriesPage'));
const PartnersPage     = lazy(() => import('@/pages/PartnersPage'));
const ResourcesPage    = lazy(() => import('@/pages/ResourcesPage'));
const BlogPage         = lazy(() => import('@/pages/BlogPage'));
const NewsPage         = lazy(() => import('@/pages/NewsPage'));
const CareersPage      = lazy(() => import('@/pages/CareersPage'));
const SupportPage      = lazy(() => import('@/pages/SupportPage'));
const ContactPage      = lazy(() => import('@/pages/ContactPage'));
const PricingPage      = lazy(() => import('@/pages/PricingPage'));
const PrivacyPage      = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage        = lazy(() => import('@/pages/TermsPage'));
const CookiesPage      = lazy(() => import('@/pages/CookiesPage'));
const ClientPortalPage = lazy(() => import('@/pages/ClientPortalPage'));
const AdminDashboardPage= lazy(() => import('@/pages/AdminDashboardPage'));
const TeamMemberPage   = lazy(() => import('@/pages/TeamMemberPage'));
const FounderCVPage    = lazy(() => import('@/pages/FounderCVPage'));
const RefundPolicyPage = lazy(() => import('@/pages/RefundPolicyPage'));
const SitemapPage      = lazy(() => import('@/pages/SitemapPage'));
const ConsultationPage = lazy(() => import('@/pages/ConsultationPage'));
const DownloadsPage    = lazy(() => import('@/pages/resources/DownloadsPage'));
const BillingPage      = lazy(() => import('@/pages/BillingPage'));
const QuotePage        = lazy(() => import('@/pages/QuotePage'));
const NotFound         = lazy(() => import('@/pages/not-found'));

// Lightweight fallback shown while a page chunk is loading
function PageFallback() {
  return (
    <div className="flex-grow flex items-center justify-center py-32">
      <div className="w-8 h-8 rounded-full border-2 border-[#3CB52A] border-t-transparent animate-spin" />
    </div>
  );
}

const queryClient = new QueryClient();

const PAGE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.32, ease: PAGE_EASE },
};

// Routes that manage their own full-screen layout (no shared header/footer)
const FULLSCREEN_ROUTES = ['/portal', '/admin', '/quote'];

function Router() {
  const [location] = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.some(r => location === r || location.startsWith(r + '/'));

  // Fullscreen pages render without the site header/footer
  if (isFullscreen) {
    return (
      <>
        <RouteScrollReset />
        <Suspense fallback={<PageFallback />}>
          <Switch>
            <Route path="/portal" component={ClientPortalPage} />
            <Route path="/admin" component={AdminDashboardPage} />
            <Route path="/quote/:token" component={QuotePage} />
          </Switch>
        </Suspense>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <RouteScrollReset />
      <Header />
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location}
            initial={PAGE_TRANSITION.initial}
            animate={PAGE_TRANSITION.animate}
            exit={PAGE_TRANSITION.exit}
            transition={PAGE_TRANSITION.transition}
            className="flex-grow flex flex-col"
          >
            <Suspense fallback={<PageFallback />}>
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/services" component={ServicesPage} />
                <Route path="/services/:slug" component={ServiceDetailPage} />
                <Route path="/ai-solutions" component={AIPage} />
                <Route path="/solutions" component={SolutionsPage} />
                <Route path="/products" component={ProductsPage} />
                <Route path="/portfolio" component={PortfolioPage} />
                <Route path="/projects" component={ProjectsPage} />
                <Route path="/industries" component={IndustriesPage} />
                <Route path="/partners" component={PartnersPage} />
                <Route path="/resources" component={ResourcesPage} />
                <Route path="/resources/downloads" component={DownloadsPage} />
                <Route path="/blog" component={BlogPage} />
                <Route path="/news" component={NewsPage} />
                <Route path="/careers" component={CareersPage} />
                <Route path="/support" component={SupportPage} />
                <Route path="/contact" component={ContactPage} />
                <Route path="/pricing" component={PricingPage} />
                <Route path="/privacy-policy" component={PrivacyPage} />
                <Route path="/terms" component={TermsPage} />
                <Route path="/cookies" component={CookiesPage} />
                <Route path="/team/wilmot-kerkulah/cv" component={FounderCVPage} />
                <Route path="/team/:slug" component={TeamMemberPage} />
                <Route path="/refund-policy" component={RefundPolicyPage} />
                <Route path="/sitemap" component={SitemapPage} />
                <Route path="/consultation" component={ConsultationPage} />
                <Route path="/billing" component={BillingPage} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
      <SarahChatbot />
      <CookieBanner />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
