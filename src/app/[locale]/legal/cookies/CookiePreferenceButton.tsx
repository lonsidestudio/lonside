'use client';

interface CookiePreferenceButtonProps {
  label: string;
}

export default function CookiePreferenceButton({ label }: CookiePreferenceButtonProps) {
  return (
    <div className="pt-6">
      <button
        onClick={() => window.dispatchEvent(new Event('open-cookie-consent'))}
        className="py-2.5 px-6 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] cursor-pointer focus:outline-none"
      >
        {label}
      </button>
    </div>
  );
}
