import React from 'react';

export const FooterBottom: React.FC = () => {
  return (
    <div className="border-t border-white/10 py-6 text-center flex flex-col gap-2">
      <p className="text-[#BDBDBD] text-xs md:text-sm">
        &copy; {new Date().getFullYear()} iTech Network Africa. All Rights Reserved. Powered by Gotecx.
      </p>
      <p className="text-white/40 text-[11px] md:text-xs">
        iTech Network Africa and Gotecx are trademarks of iTech Network Africa.
      </p>
      <p className="text-white/30 text-[10px] mt-2 max-w-2xl mx-auto">
        By using this website you agree to our Terms of Service, Privacy Policy and Cookies Policy.
      </p>
    </div>
  );
};
