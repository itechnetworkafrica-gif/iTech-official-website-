import React from 'react';

const marqueeItems = [
  "Web Development", "Website Design", "Mobile App Development", "AI Solutions", 
  "Artificial Intelligence", "Machine Learning", "Cloud Services", "Cloud Computing", 
  "Cybersecurity", "ICT Consultancy", "Networking", "Business Automation", 
  "ERP Solutions", "POS Systems", "CRM Systems", "Enterprise Software", 
  "UI/UX Design", "Graphic Design", "Branding", "Digital Marketing", "SEO", 
  "Domain Registration", "Web Hosting", "Email Hosting", "API Development", 
  "Database Development", "Software Engineering", "Managed IT Services", 
  "IT Support", "CCTV Installation", "Server Administration", "Innovation", 
  "Smart Technology", "Gotecx", "iTech Network Africa"
];

export const ScrollingMarquee: React.FC = () => {
  return (
    <div className="w-full bg-[#1A1A1A] py-3 overflow-hidden border-b border-white/5 relative">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
        {/* Render twice for seamless loop */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex shrink-0">
            {marqueeItems.map((item, idx) => (
              <div key={`${i}-${idx}`} className="flex items-center">
                <span className="text-white text-sm font-bold uppercase tracking-[0.15em] whitespace-nowrap">
                  {item}
                </span>
                <span className="text-[#3CB52A] mx-6">•</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
