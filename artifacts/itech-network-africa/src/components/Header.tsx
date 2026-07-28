import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Menu, Search, Phone, HelpCircle, User, ShoppingCart, X } from 'lucide-react';
import { Logo } from './Logo';
import { AccountDropdown } from './AccountDropdown';
import { MobileMenu } from './MobileMenu';

const PHONE = '+231761978796';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Close search on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsSearchOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleAccountDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-[#2B2B2B] transition-all duration-300 ${
          isScrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.3)]' : 'shadow-none'
        }`}
      >
        {/* Main bar */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-[60px] flex items-center justify-between">

          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-white hover:text-[#3CB52A] transition-colors p-1"
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>
            <Link href="/" className="flex items-center">
              <Logo variant="icon" white />
            </Link>
          </div>

          {/* Right: icons */}
          <div className="flex items-center gap-1 sm:gap-2 relative">

            {/* Search icon */}
            <button
              onClick={() => setIsSearchOpen(o => !o)}
              className={`text-white transition-all duration-200 p-2 rounded-full flex items-center justify-center
                hover:text-[#3CB52A] hover:bg-[#3CB52A]/10
                ${isSearchOpen ? 'text-[#3CB52A] bg-[#3CB52A]/10' : ''}`}
              aria-label="Search"
            >
              {isSearchOpen ? <X size={22} /> : <Search size={22} />}
            </button>

            {/* Phone — visible on sm+ */}
            <a
              href={`tel:${PHONE}`}
              className="hidden sm:flex items-center gap-1.5 text-white hover:text-[#3CB52A] transition-colors p-2 rounded-full hover:bg-[#3CB52A]/10"
              title={PHONE}
              aria-label="Call us"
            >
              <Phone size={22} />
              <span className="hidden lg:inline text-sm font-medium whitespace-nowrap">{PHONE}</span>
            </a>

            {/* Help / Support */}
            <HeaderIconLink icon={<HelpCircle size={22} />} label="Support" href="/support" />

            {/* Account */}
            <div className="relative">
              <button
                onClick={toggleAccountDropdown}
                className={`text-white transition-all duration-200 p-2 rounded-full flex items-center justify-center
                  hover:text-[#3CB52A] hover:bg-[#3CB52A]/10
                  ${isAccountDropdownOpen ? 'text-[#3CB52A] bg-[#3CB52A]/10' : ''}`}
                aria-label="Account"
              >
                <User size={22} />
              </button>
              <AccountDropdown
                isOpen={isAccountDropdownOpen}
                onClose={() => setIsAccountDropdownOpen(false)}
              />
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-white transition-all duration-200 p-2 rounded-full flex items-center justify-center hover:text-[#3CB52A] hover:bg-[#3CB52A]/10"
            >
              <ShoppingCart size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#3CB52A] rounded-full ring-2 ring-[#2B2B2B]" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#3CB52A] rounded-full animate-ping opacity-75" />
            </Link>
          </div>
        </div>

        {/* Slide-down search bar */}
        {isSearchOpen && (
          <div className="bg-[#222222] border-t border-white/10 px-4 lg:px-8 py-3">
            <div className="max-w-[1400px] mx-auto flex items-center gap-3">
              <Search size={18} className="text-white/50 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="What are you looking for today?"
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-white/50 hover:text-white transition-colors text-sm shrink-0"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

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
