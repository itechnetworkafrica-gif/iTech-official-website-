import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { RouteScrollReset } from '@/components/RouteScrollReset';
import { CookieBanner } from '@/components/CookieBanner';

// Page Imports
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import AIPage from '@/pages/AIPage';
import SolutionsPage from '@/pages/SolutionsPage';
import ProductsPage from '@/pages/ProductsPage';
import PortfolioPage from '@/pages/PortfolioPage';
import ProjectsPage from '@/pages/ProjectsPage';
import IndustriesPage from '@/pages/IndustriesPage';
import PartnersPage from '@/pages/PartnersPage';
import ResourcesPage from '@/pages/ResourcesPage';
import BlogPage from '@/pages/BlogPage';
import NewsPage from '@/pages/NewsPage';
import CareersPage from '@/pages/CareersPage';
import SupportPage from '@/pages/SupportPage';
import ContactPage from '@/pages/ContactPage';
import PricingPage from '@/pages/PricingPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import CookiesPage from '@/pages/CookiesPage';
import ClientPortalPage from '@/pages/ClientPortalPage';
import TeamMemberPage from '@/pages/TeamMemberPage';
import RefundPolicyPage from '@/pages/RefundPolicyPage';
import SitemapPage from '@/pages/SitemapPage';
import ConsultationPage from '@/pages/ConsultationPage';

const queryClient = new QueryClient();

const PAGE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.32, ease: PAGE_EASE },
};

function Router() {
  const [location] = useLocation();

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
              <Route path="/blog" component={BlogPage} />
              <Route path="/news" component={NewsPage} />
              <Route path="/careers" component={CareersPage} />
              <Route path="/support" component={SupportPage} />
              <Route path="/contact" component={ContactPage} />
              <Route path="/pricing" component={PricingPage} />
              <Route path="/privacy-policy" component={PrivacyPage} />
              <Route path="/terms" component={TermsPage} />
              <Route path="/cookies" component={CookiesPage} />
              <Route path="/portal" component={ClientPortalPage} />
              <Route path="/team/:slug" component={TeamMemberPage} />
              <Route path="/refund-policy" component={RefundPolicyPage} />
              <Route path="/sitemap" component={SitemapPage} />
              <Route path="/consultation" component={ConsultationPage} />
              <Route component={NotFound} />
            </Switch>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppWidget />
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
