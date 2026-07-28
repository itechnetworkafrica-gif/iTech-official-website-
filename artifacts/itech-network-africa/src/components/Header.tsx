import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Menu, Grid, Phone, HelpCircle, User, ShoppingCart } from 'lucide-react';
import { Logo } from './Logo';
import { AccountDropdown } from './AccountDropdown';
import { MobileMenu } from './MobileMenu';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccountDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full bg-[#2B2B2B] transition-all duration-300 ${
          isScrolled ? 'h-[60px] shadow-[0_10px_30px_rgba(0,0,0,0.3)]' : 'h-[72px] shadow-none'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          
          {/* Left Side: Mobile Menu Button & Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-white hover:text-[#3CB52A] transition-colors p-1"
              aria-label="Open mobile menu"
            >
              <Menu size={28} />
            </button>
            
            <Link href="/" className="flex items-center">
              <Logo variant="icon" white />
            </Link>
          </div>

          {/* Right Side: Icons */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 relative">
            <HeaderIcon icon={<Grid size={22} />} label="Services" href="/services" />
            <HeaderIcon icon={<Phone size={22} />} label="Contact" href="/contact" />
            <HeaderIcon icon={<HelpCircle size={22} />} label="Support" href="/support" />
            
            <div className="relative">
              <button 
                onClick={toggleAccountDropdown}
                className={`text-white transition-all duration-200 p-2 rounded-full flex items-center justify-center
                  hover:scale-110 hover:text-[#3CB52A] hover:bg-[#3CB52A]/10 hover:shadow-[0_0_15px_rgba(60,181,42,0.4)]
                  ${isAccountDropdownOpen ? 'text-[#3CB52A] bg-[#3CB52A]/10 shadow-[0_0_15px_rgba(60,181,42,0.4)]' : ''}
                `}
                aria-label="Account"
              >
                <User size={22} />
              </button>
              <AccountDropdown 
                isOpen={isAccountDropdownOpen} 
                onClose={() => setIsAccountDropdownOpen(false)} 
              />
            </div>
            
            <Link href="/cart" className="group relative text-white transition-all duration-200 p-2 rounded-full flex items-center justify-center hover:scale-110 hover:text-[#3CB52A] hover:bg-[#3CB52A]/10 hover:shadow-[0_0_15px_rgba(60,181,42,0.4)]">
              <ShoppingCart size={22} />
              {/* Animated Badge */}
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#3CB52A] rounded-full ring-2 ring-[#2B2B2B]"></span>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#3CB52A] rounded-full animate-ping opacity-75"></span>
            </Link>
          </div>
          
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

interface HeaderIconProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const HeaderIcon: React.FC<HeaderIconProps> = ({ icon, label, href }) => {
  return (
    <Link 
      href={href} 
      className="hidden sm:flex text-white transition-all duration-200 p-2 rounded-full items-center justify-center hover:scale-110 hover:text-[#3CB52A] hover:bg-[#3CB52A]/10 hover:shadow-[0_0_15px_rgba(60,181,42,0.4)]"
      title={label}
    >
      {icon}
    </Link>
  );
};
