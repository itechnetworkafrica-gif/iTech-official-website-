import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full bg-white flex justify-center py-4 px-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sticky top-[72px] z-40">
      <div 
        className={`flex items-center w-full max-w-[700px] bg-white rounded-full border border-gray-200 overflow-hidden transition-all duration-300 ${isFocused ? 'shadow-[0_4px_24px_rgba(0,0,0,0.12)] border-blue-200 ring-4 ring-blue-50' : 'shadow-sm'}`}
      >
        <div className="pl-5 pr-3 text-gray-400">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="What are you looking for today?" 
          className="flex-1 py-4 text-base outline-none text-gray-800 placeholder-gray-400 bg-transparent"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button className="bg-[#3CB52A] hover:bg-[#2fa022] text-white font-medium py-4 px-8 rounded-r-full transition-colors h-full flex items-center justify-center">
          Search
        </button>
      </div>
    </div>
  );
};
