import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div className={`p-6 rounded-2xl bg-[#0d0d11] border border-white/5 ${hover ? 'hover:border-brand-purple/30 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
}
