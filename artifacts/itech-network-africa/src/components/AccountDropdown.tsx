import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { LogIn, UserPlus, LayoutDashboard, User, Settings, LogOut } from 'lucide-react';

interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { icon: <LogIn size={16} />, label: "Login", href: "/login" },
    { icon: <UserPlus size={16} />, label: "Register", href: "/register" },
    { icon: <LayoutDashboard size={16} />, label: "Dashboard", href: "/dashboard" },
    { icon: <User size={16} />, label: "Profile", href: "/profile" },
    { icon: <Settings size={16} />, label: "Settings", href: "/settings" },
    { icon: <LogOut size={16} />, label: "Logout", href: "/logout", isDestructive: true },
  ];

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-[calc(100%+8px)] right-0 w-56 bg-[#2B2B2B] rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50"
    >
      <div className="py-2">
        {items.map((item, idx) => (
          <React.Fragment key={item.label}>
            <Link 
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                item.isDestructive 
                  ? 'text-red-400 hover:bg-red-400/10 hover:text-red-300' 
                  : 'text-white hover:bg-white/10 hover:text-[#3CB52A]'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
            {idx === 1 && <div className="h-px bg-white/10 my-2 mx-4" />}
            {idx === 4 && <div className="h-px bg-white/10 my-2 mx-4" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
