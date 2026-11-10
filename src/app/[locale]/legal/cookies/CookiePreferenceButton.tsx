'use client';

interface CookiePreferenceButtonProps {
  label: string;
}

export default function CookiePreferenceButton({ label }: CookiePreferenceButtonProps) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('open-cookie-consent'))}
      className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.14em] transition-colors whitespace-nowrap cursor-pointer shadow-none focus:outline-none"
    >
      {label}
    </button>
  );
}
