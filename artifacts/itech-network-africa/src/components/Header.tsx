import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, Search, Phone, HelpCircle, User, PhoneCall, X, ChevronDown, ExternalLink, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { AccountDropdown } from './AccountDropdown';
import { MobileMenu } from './MobileMenu';
import { navigationData, primaryNavIds, type NavigationItem } from './NavigationData';

const PHONE = '+231761978796';

/* Primary nav items only */
const primaryNav = navigationData.filter(n => primaryNavIds.includes(n.id));

/* ── Searchable content index ── */
const SEARCH_INDEX = [
  { title: 'Home', href: '/', desc: 'iTech Network Africa homepage', category: 'Pages' },
  { title: 'About Us', href: '/about', desc: 'Our story, team, mission and values', category: 'Pages' },
  { title: 'Services', href: '/services', desc: 'All technology services we offer', category: 'Pages' },
  { title: 'AI Solutions', href: '/ai-solutions', desc: 'Machine learning, automation and AI products', category: 'Pages' },
  { title: 'Portfolio', href: '/portfolio', desc: 'Case studies and project showcase', category: 'Pages' },
  { title: 'Projects', href: '/projects', desc: 'Current and completed projects', category: 'Pages' },
  { title: 'Industries', href: '/industries', desc: 'Sectors and industries we specialise in', category: 'Pages' },
  { title: 'Solutions', href: '/solutions', desc: 'Technology solutions by business need', category: 'Pages' },
  { title: 'Products', href: '/products', desc: 'Our software products and platforms', category: 'Pages' },
  { title: 'Partners', href: '/partners', desc: 'Partner program and strategic alliances', category: 'Pages' },
  { title: 'Blog & Insights', href: '/blog', desc: 'Tech insights, news and company updates', category: 'Pages' },
  { title: 'Careers', href: '/careers', desc: 'Join our team – open positions', category: 'Pages' },
  { title: 'Contact', href: '/contact', desc: 'Get in touch or request a quote', category: 'Pages' },
  { title: 'Pricing', href: '/pricing', desc: 'Software and service pricing plans', category: 'Pages' },
  { title: 'Support / Help Center', href: '/support', desc: 'Help center, tickets and FAQs', category: 'Pages' },
  { title: 'Client Portal', href: '/portal', desc: 'Login to your client dashboard', category: 'Pages' },
  { title: 'Resources', href: '/resources', desc: 'Documentation, APIs and tutorials', category: 'Pages' },
  { title: 'Enterprise Software', href: '/services', desc: 'Custom ERP, CRM and business platforms', category: 'Services' },
  { title: 'Web Development', href: '/services', desc: 'Custom web application development', category: 'Services' },
  { title: 'Mobile App Development', href: '/services', desc: 'iOS and Android app development', category: 'Services' },
  { title: 'Cloud Infrastructure', href: '/services', desc: 'AWS, Azure and Google Cloud solutions', category: 'Services' },
  { title: 'Cybersecurity', href: '/services', desc: 'Security audits, compliance and threat protection', category: 'Services' },
  { title: 'AI & Automation', href: '/ai-solutions', desc: 'Machine learning and intelligent automation', category: 'Services' },
  { title: 'IT Support & Managed Services', href: '/support', desc: '24/7 managed IT support and monitoring', category: 'Services' },
  { title: 'Network Solutions', href: '/services', desc: 'Enterprise networking and connectivity', category: 'Services' },
  { title: 'Privacy Policy', href: '/privacy-policy', desc: 'Our data privacy practices', category: 'Legal' },
  { title: 'Terms & Conditions', href: '/terms', desc: 'Legal terms of service', category: 'Legal' },
  { title: 'Cookies Policy', href: '/cookies', desc: 'How we use cookies', category: 'Legal' },
  { title: 'Refund Policy', href: '/refund-policy', desc: 'Refund and cancellation terms', category: 'Legal' },
];

function getResults(query: string) {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return SEARCH_INDEX.filter(
    item =>
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q),
  ).slice(0, 7);
}

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const searchResults = getResults(searchQuery);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
    else setSearchQuery('');
  }, [isSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsSearchOpen(false); setActiveMenu(null); }
      if (e.key === 'Enter' && isSearchOpen && searchResults.length > 0) {
        navigate(searchResults[0].href);
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSearchOpen, searchResults, navigate]);

  /* Close menu when clicking outside */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const openMenu = useCallback((id: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setActiveMenu(id);
  }, []);

  const closeMenu = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => setActiveMenu(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  }, []);

  const toggleAccountDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const handleResultClick = (href: string) => {
    navigate(href);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <header
        ref={navRef}
        className={`sticky top-0 z-50 w-full bg-[#2B2B2B] transition-all duration-300 ${
          isScrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.4)]' : ''
        }`}
      >
        {/* ── Top bar ── */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-[56px] flex items-center justify-between border-b border-white/8">

          {/* Left: hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            <div className="neon-border xl:hidden" style={{ borderRadius: '12px', padding: '2px', boxShadow: '0 0 18px rgba(0,229,255,0.18)' }}>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white hover:text-[#00e5ff] transition-colors p-2 flex items-center justify-center"
                style={{ background: 'rgba(14,16,28,0.95)', borderRadius: '10px', backdropFilter: 'blur(8px)' }}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>
            <Link href="/" className="flex items-center">
              <Logo variant="icon" white />
            </Link>
          </div>

          {/* Right: icons */}
          <div className="flex items-center gap-1 relative">
            <button
              onClick={() => setIsSearchOpen(o => !o)}
              className={`text-white transition-all duration-200 p-2 rounded-full flex items-center justify-center hover:text-[#3CB52A] hover:bg-[#3CB52A]/10 ${isSearchOpen ? 'text-[#3CB52A] bg-[#3CB52A]/10' : ''}`}
              aria-label="Search"
            >
              {isSearchOpen ? <X size={22} /> : <Search size={22} />}
            </button>

            <a
              href={`tel:${PHONE}`}
              className="hidden sm:flex items-center gap-1.5 text-white hover:text-[#3CB52A] transition-colors p-2 rounded-full hover:bg-[#3CB52A]/10"
              aria-label="Call us"
            >
              <Phone size={22} />
              <span className="hidden lg:inline text-xs font-medium whitespace-nowrap">{PHONE}</span>
            </a>

            <Link
              href="/support"
              className="relative flex text-white transition-all duration-200 p-1.5 rounded-full items-center justify-center hover:text-[#3CB52A] hover:bg-[#3CB52A]/10"
              title="Support"
              aria-label="Support"
            >
              <HelpCircle size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#3CB52A] border border-[#2B2B2B]" />
            </Link>

            <div className="relative">
              <button
                onClick={toggleAccountDropdown}
                className={`text-white transition-all duration-200 p-2 rounded-full flex items-center justify-center hover:text-[#3CB52A] hover:bg-[#3CB52A]/10 ${isAccountDropdownOpen ? 'text-[#3CB52A] bg-[#3CB52A]/10' : ''}`}
                aria-label="Account"
              >
                <User size={22} />
              </button>
              <AccountDropdown isOpen={isAccountDropdownOpen} onClose={() => setIsAccountDropdownOpen(false)} />
            </div>

            <Link
              href="/portal"
              className="hidden sm:flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-[#3CB52A]/15 hover:bg-[#3CB52A]/25 hover:text-[#3CB52A] transition-all border border-[#3CB52A]/20"
            >
              <ExternalLink size={14} /> Portal
              <span className="inline-flex items-center px-1 py-0.5 rounded text-[8px] font-bold bg-[#3CB52A] text-white tracking-wide uppercase leading-none">NEW</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-1.5 text-white transition-all duration-200 p-2 rounded-full hover:text-[#3CB52A] hover:bg-[#3CB52A]/10"
              title="Call us"
              aria-label="Contact us"
            >
              <PhoneCall size={22} />
            </Link>
          </div>
        </div>

        {/* ── Desktop nav bar ── */}
        <nav className="hidden xl:block bg-[#222222] border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-8 flex items-stretch">
            {primaryNav.map(item => {
              const isActive = activeMenu === item.id;
              const isServices = !!item.categories;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => openMenu(item.id)}
                  onMouseLeave={closeMenu}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 px-4 py-3.5 text-[13px] font-medium transition-all duration-150 border-b-2 whitespace-nowrap group ${
                      isActive
                        ? 'text-[#3CB52A] border-[#3CB52A]'
                        : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                    }`}
                  >
                    {item.label}
                    {item.isNew && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#3CB52A] text-white tracking-wide uppercase leading-none">NEW</span>
                    )}
                    {item.children.length > 0 && (
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${isActive ? 'rotate-180 text-[#3CB52A]' : 'text-white/40 group-hover:text-white/60'}`}
                      />
                    )}
                  </Link>

                  {/* Dropdown / Mega-menu */}
                  {isActive && item.children.length > 0 && (
                    <div
                      onMouseEnter={cancelClose}
                      onMouseLeave={closeMenu}
                      className={`absolute top-full left-0 z-50 ${isServices ? 'w-[900px]' : 'w-64'} bg-white border border-gray-200 rounded-b-2xl shadow-2xl overflow-hidden`}
                    >
                      {isServices && item.categories ? (
                        <ServicesPanel categories={item.categories} onClose={() => setActiveMenu(null)} />
                      ) : (
                        <SimpleDropdown item={item} onClose={() => setActiveMenu(null)} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Spacer + CTA */}
            <div className="ml-auto flex items-center pl-4">
              <Link
                href="/contact"
                className="flex items-center gap-2 text-[13px] font-bold text-white bg-[#3CB52A] hover:bg-[#2da822] px-5 py-2 rounded-lg transition-colors"
              >
                Get a Quote <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Search bar + results ── */}
        {isSearchOpen && (
          <div className="bg-[#1A1A1A] border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-3">
              <div className="flex items-center gap-3">
                <Search size={16} className="text-white/40 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search pages, services, resources…"
                  className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white transition-colors shrink-0">
                    <X size={14} />
                  </button>
                )}
                <button onClick={() => setIsSearchOpen(false)} className="text-white/40 hover:text-white transition-colors text-sm shrink-0 pl-2 border-l border-white/10">
                  Cancel
                </button>
              </div>
            </div>

            {/* Results dropdown */}
            {searchResults.length > 0 && (
              <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-4">
                <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
                  {searchResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => handleResultClick(result.href)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium group-hover:text-[#3CB52A] transition-colors truncate">
                            {result.title}
                          </span>
                          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider shrink-0 bg-white/5 px-2 py-0.5 rounded-full">
                            {result.category}
                          </span>
                        </div>
                        <p className="text-white/40 text-xs mt-0.5 truncate">{result.desc}</p>
                      </div>
                      <ArrowRight size={13} className="text-white/20 group-hover:text-[#3CB52A] transition-colors shrink-0" />
                    </button>
                  ))}
                  <div className="px-4 py-2.5 bg-white/3 border-t border-white/5">
                    <p className="text-white/30 text-xs">Press <kbd className="bg-white/10 text-white/50 px-1.5 py-0.5 rounded text-[10px]">Enter</kbd> to go to top result · <kbd className="bg-white/10 text-white/50 px-1.5 py-0.5 rounded text-[10px]">Esc</kbd> to close</p>
                  </div>
                </div>
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-4">
                <p className="text-white/35 text-sm">No results for "<span className="text-white/60">{searchQuery}</span>". Try a different term.</p>
              </div>
            )}
          </div>
        )}
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

/* ─────────────────────────────────────────
   Simple dropdown (non-Services)
───────────────────────────────────────── */
const SimpleDropdown: React.FC<{ item: NavigationItem; onClose: () => void }> = ({ item, onClose }) => (
  <div className="py-3">
    {item.children.map((child, i) => (
      <Link
        key={i}
        href={child.href}
        onClick={onClose}
        className="flex items-center gap-2.5 px-5 py-2.5 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all group"
      >
        <span className="w-1 h-1 rounded-full bg-[#3CB52A] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        {child.label}
      </Link>
    ))}
  </div>
);

/* ─────────────────────────────────────────
   Services mega-menu panel (13 categories)
───────────────────────────────────────── */
const ServicesPanel: React.FC<{
  categories: NonNullable<NavigationItem['categories']>;
  onClose: () => void;
}> = ({ categories, onClose }) => {
  const [hovered, setHovered] = useState(0);
  const active = categories[hovered];

  return (
    <div className="flex h-[480px]">
      {/* Left: category list */}
      <div className="w-[260px] border-r border-gray-100 py-4 overflow-y-auto shrink-0">
        {categories.map((cat, i) => (
          <button
            key={i}
            onMouseEnter={() => setHovered(i)}
            onClick={onClose}
            className={`w-full flex items-center justify-between px-5 py-2.5 text-[13px] text-left transition-all ${
              hovered === i
                ? 'bg-[#3CB52A]/10 text-[#3CB52A]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium">{cat.title}</span>
            {hovered === i && <ChevronDown size={13} className="-rotate-90" />}
          </button>
        ))}
      </div>

      {/* Right: items grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-4">
          <Link
            href={active.href}
            onClick={onClose}
            className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase hover:underline"
          >
            {active.title}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {active.items.map((sub, i) => (
            <Link
              key={i}
              href={sub.href}
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all group"
            >
              <span className="w-1 h-1 rounded-full bg-[#3CB52A] opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
              {sub.label}
            </Link>
          ))}
        </div>

        {/* CTA at bottom */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <Link
            href="/services"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#3CB52A] hover:gap-3 transition-all"
          >
            View all services <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
