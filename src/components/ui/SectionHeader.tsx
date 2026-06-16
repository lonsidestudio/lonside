import React from 'react';

interface SectionHeaderProps {
  badge?: React.ReactNode;
  headline: string;
  headlineHighlight?: string;
  subheadline?: string;
  centered?: boolean;
}

export function SectionHeader({ badge, headline, headlineHighlight, subheadline, centered = true }: SectionHeaderProps) {
  return (
    <div className={`space-y-6 ${centered ? 'text-center' : ''}`}>
      {badge && badge}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight">
        {headline}
        {headlineHighlight && (
          <>
            <br />
            <span className="shimmer-text">{headlineHighlight}</span>
          </>
        )}
      </h1>
      {subheadline && (
        <p className={`text-xs sm:text-sm text-slate-400 leading-relaxed font-normal ${centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
          {subheadline}
        </p>
      )}
    </div>
  );
}
