import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { Menu, Search, Phone, HelpCircle, User, ShoppingCart, X, ChevronDown, ExternalLink, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { AccountDropdown } from './AccountDropdown';
import { MobileMenu } from './MobileMenu';
import { navigationData, primaryNavIds, type NavigationItem } from './NavigationData';

const PHONE = '+231761978796';

/* Primary nav items only */
const primaryNav = navigationData.filter(n => primaryNavIds.includes(n.id));

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [isSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsSearchOpen(false); setActiveMenu(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="xl:hidden text-white hover:text-[#3CB52A] transition-colors p-1"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
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
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <a
              href={`tel:${PHONE}`}
              className="hidden sm:flex items-center gap-1.5 text-white hover:text-[#3CB52A] transition-colors p-2 rounded-full hover:bg-[#3CB52A]/10"
              aria-label="Call us"
            >
              <Phone size={20} />
              <span className="hidden lg:inline text-xs font-medium whitespace-nowrap">{PHONE}</span>
            </a>

            <HeaderIconLink icon={<HelpCircle size={20} />} label="Support" href="/support" />

            <div className="relative">
              <button
                onClick={toggleAccountDropdown}
                className={`text-white transition-all duration-200 p-2 rounded-full flex items-center justify-center hover:text-[#3CB52A] hover:bg-[#3CB52A]/10 ${isAccountDropdownOpen ? 'text-[#3CB52A] bg-[#3CB52A]/10' : ''}`}
                aria-label="Account"
              >
                <User size={20} />
              </button>
              <AccountDropdown isOpen={isAccountDropdownOpen} onClose={() => setIsAccountDropdownOpen(false)} />
            </div>

            <Link
              href="/portal"
              className="hidden sm:flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-[#3CB52A]/15 hover:bg-[#3CB52A]/25 hover:text-[#3CB52A] transition-all border border-[#3CB52A]/20"
            >
              <ExternalLink size={13} /> Portal
            </Link>

            <Link
              href="/cart"
              className="relative text-white transition-all duration-200 p-2 rounded-full flex items-center justify-center hover:text-[#3CB52A] hover:bg-[#3CB52A]/10"
            >
              <ShoppingCart size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3CB52A] rounded-full ring-2 ring-[#2B2B2B]" />
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
                      className={`absolute top-full left-0 z-50 ${isServices ? 'w-[900px]' : 'w-64'} bg-[#1A1A1A] border border-white/10 rounded-b-2xl shadow-2xl overflow-hidden`}
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

        {/* ── Search bar ── */}
        {isSearchOpen && (
          <div className="bg-[#1A1A1A] border-t border-white/10 px-4 lg:px-8 py-3">
            <div className="max-w-[1400px] mx-auto flex items-center gap-3">
              <Search size={16} className="text-white/40 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search services, solutions, resources…"
                className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm"
              />
              <button onClick={() => setIsSearchOpen(false)} className="text-white/40 hover:text-white transition-colors text-sm shrink-0">
                Cancel
              </button>
            </div>
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
        className="flex items-center gap-2.5 px-5 py-2.5 text-[13px] text-white/65 hover:text-white hover:bg-white/5 transition-all group"
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
      <div className="w-[260px] border-r border-white/8 py-4 overflow-y-auto shrink-0">
        {categories.map((cat, i) => (
          <button
            key={i}
            onMouseEnter={() => setHovered(i)}
            onClick={onClose}
            className={`w-full flex items-center justify-between px-5 py-2.5 text-[13px] text-left transition-all ${
              hovered === i
                ? 'bg-[#3CB52A]/10 text-[#3CB52A]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
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
              className="flex items-center gap-2 px-3 py-2 text-[13px] text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
            >
              <span className="w-1 h-1 rounded-full bg-[#3CB52A] opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
              {sub.label}
            </Link>
          ))}
        </div>

        {/* CTA at bottom */}
        <div className="mt-6 pt-5 border-t border-white/8">
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

/* ─────────────────────────────────────────
   Small icon link helper
───────────────────────────────────────── */
interface HeaderIconLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const HeaderIconLink: React.FC<HeaderIconLinkProps> = ({ icon, label, href }) => (
  <Link
    href={href}
    className="hidden sm:flex text-white transition-all duration-200 p-2 rounded-full items-center justify-center hover:text-[#3CB52A] hover:bg-[#3CB52A]/10"
    title={label}
  >
    {icon}
  </Link>
);
