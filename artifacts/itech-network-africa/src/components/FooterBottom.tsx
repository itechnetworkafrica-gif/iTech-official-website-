import React from 'react';

export const FooterBottom: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <button className="text-[#BDBDBD] text-sm hover:text-white transition-colors underline-offset-2 hover:underline">
        Do not sell my personal information
      </button>

      <p className="text-[#888888] text-xs leading-relaxed max-w-lg">
        Copyright &copy; {new Date().getFullYear()} iTech Network Africa. All Rights Reserved.
        The iTech Network Africa name and iT logo are registered trademarks of iTech Network Africa,
        powered by Gotecx.
      </p>

      <p className="text-[#666666] text-xs leading-relaxed max-w-lg">
        Use of this Site is subject to express terms of use. By using this site, you signify that
        you agree to be bound by these{' '}
        <a href="/terms" className="underline hover:text-[#BDBDBD] transition-colors">
          Terms of Service
        </a>
        .
      </p>
    </div>
  );
};
