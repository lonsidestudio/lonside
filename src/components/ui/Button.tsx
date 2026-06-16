import React from 'react';
import { Link } from '@/lib/i18n/navigation';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-bold rounded-lg transition-all duration-300';
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-3.5 text-sm',
  };
  const variants = {
    primary: 'bg-brand-purple hover:bg-brand-purple-hover text-white hover:scale-[1.02]',
    secondary: 'bg-transparent border border-white/10 hover:border-brand-purple/30 text-slate-300',
    ghost: 'bg-transparent text-brand-purple hover:text-brand-purple-hover',
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
