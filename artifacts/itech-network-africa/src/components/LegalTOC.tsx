import React from 'react';

interface TOCItem {
  id: string;
  title: string;
}

interface LegalTOCProps {
  items: TOCItem[];
}

export function LegalTOC({ items }: LegalTOCProps) {
  return (
    <nav
      aria-label="Table of contents"
      className="mb-12 rounded-2xl border border-gray-200 bg-gray-50 p-6 not-prose"
    >
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#3CB52A]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="0" y="1" width="5" height="1.5" rx="0.75" fill="#3CB52A" />
          <rect x="0" y="5" width="9" height="1.5" rx="0.75" fill="#3CB52A" />
          <rect x="0" y="9" width="7" height="1.5" rx="0.75" fill="#3CB52A" />
        </svg>
        Table of Contents
      </p>
      <ol className="space-y-2 list-none m-0 p-0">
        {items.map((item, index) => (
          <li key={item.id} className="m-0 p-0">
            <a
              href={`#${item.id}`}
              className="group flex items-baseline gap-3 rounded-lg px-3 py-1.5 text-sm text-[#374151] no-underline transition-colors hover:bg-white hover:text-[#3CB52A]"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span className="min-w-[1.5rem] text-xs font-semibold text-gray-400 group-hover:text-[#3CB52A] transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
