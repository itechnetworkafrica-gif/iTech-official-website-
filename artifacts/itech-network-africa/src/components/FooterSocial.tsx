import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Github } from 'lucide-react';
import { Link } from 'wouter';

export const FooterSocial: React.FC = () => {
  const socials = [
    { icon: <Facebook size={20} strokeWidth={1.5} />, label: 'Facebook', href: '#' },
    { icon: <Instagram size={20} strokeWidth={1.5} />, label: 'Instagram', href: '#' },
    { icon: <Linkedin size={20} strokeWidth={1.5} />, label: 'LinkedIn', href: '#' },
    // X (Twitter) icon custom SVG
    { 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
        </svg>
      ), 
      label: 'X (Twitter)', 
      href: '#' 
    },
    { icon: <Youtube size={20} strokeWidth={1.5} />, label: 'YouTube', href: '#' },
    { icon: <Github size={20} strokeWidth={1.5} />, label: 'GitHub', href: '#' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:border-[#007BFF] hover:bg-[#007BFF]/10 hover:text-[#007BFF] hover:shadow-[0_0_15px_rgba(0,123,255,0.3)]"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};
