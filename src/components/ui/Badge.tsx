import React from 'react';

interface BadgeProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Badge({ icon, children }: BadgeProps) {
  return (
    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-brand-purple text-xs font-bold tracking-wide whitespace-nowrap">
      {icon && icon}
      <span>{children}</span>
    </div>
  );
}
