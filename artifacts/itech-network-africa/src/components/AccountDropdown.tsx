import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { LogIn, UserPlus, ExternalLink } from 'lucide-react';

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
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-[calc(100%+8px)] right-0 w-64 bg-[#2B2B2B] rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/8">
        <p className="text-white font-bold text-sm">Client Portal</p>
        <p className="text-white/45 text-xs mt-0.5">Access your projects and account</p>
      </div>

      {/* Actions */}
      <div className="py-3 px-3">
        <Link
          href="/portal"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#3CB52A] hover:bg-[#2da822] transition-colors mb-2"
        >
          <LogIn size={16} />
          Login to Portal
        </Link>
        <Link
          href="/portal"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/8 hover:text-white transition-colors"
        >
          <UserPlus size={16} />
          Create an Account
        </Link>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/8 bg-white/3">
        <Link
          href="/contact"
          onClick={onClose}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-[#3CB52A] transition-colors"
        >
          <ExternalLink size={12} />
          Need help? Contact support
        </Link>
      </div>
    </div>
  );
};
