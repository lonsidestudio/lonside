'use client';

import { useState, useEffect } from 'react';
import { CONSENT_KEY, CONSENT_EVENT } from '@/lib/analytics-consent';
import { useTranslations } from 'next-intl';
import { Cookie, Shield, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface CookieConsentState {
  accepted: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const t = useTranslations('cookieConsent');
  
  const [showBanner, setShowBanner] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Consent state for custom panel toggles
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  
  // Details accordion toggle
  const [showDetails, setShowDetails] = useState({
    essential: false,
    analytics: false,
    marketing: false,
  });

  const applyConsent = (state: CookieConsentState) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable: analytics stays disabled.
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  useEffect(() => {
    setMounted(true);
    
    // Check localStorage
    const stored = localStorage.getItem('lonside-cookie-consent');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookieConsentState;
        applyConsent(parsed);
      } catch (e) {
        console.error('Error parsing cookie consent', e);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }

    // Event listener for opening settings from Footer
    const handleOpen = () => {
      // Retrieve stored choices to pre-fill checkboxes
      const stored = localStorage.getItem('lonside-cookie-consent');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as CookieConsentState;
          setAnalyticsConsent(parsed.analytics);
          setMarketingConsent(parsed.marketing);
        } catch {
          // fallback
        }
      }
      setIsCustomizing(true);
      setShowBanner(true);
    };

    window.addEventListener('open-cookie-consent', handleOpen);
    return () => {
      window.removeEventListener('open-cookie-consent', handleOpen);
    };
  }, []);

  const handleAcceptAll = () => {
    const newState = { accepted: true, analytics: true, marketing: true };
    applyConsent(newState);
    setShowBanner(false);
    setIsCustomizing(false);
  };

  const handleDeclineAll = () => {
    const newState = { accepted: true, analytics: false, marketing: false };
    applyConsent(newState);
    setShowBanner(false);
    setIsCustomizing(false);
  };

  const handleSavePreferences = () => {
    const newState = {
      accepted: true,
      analytics: analyticsConsent,
      marketing: marketingConsent,
    };
    applyConsent(newState);
    setShowBanner(false);
    setIsCustomizing(false);
  };

  const toggleDetail = (key: 'essential' | 'analytics' | 'marketing') => {
    setShowDetails(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!mounted || !showBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[460px] z-[100] max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] border border-black/[0.08] flex flex-col gap-4 animate-in slide-in-from-bottom duration-300 text-black">
      
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-black shrink-0 border border-black/[0.06]">
          <Cookie className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display uppercase text-base text-black tracking-tight font-normal">
            {t('title')}
          </h3>
          {!isCustomizing && (
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              {t('description')}
            </p>
          )}
        </div>
      </div>

      {/* Custom preferences form */}
      {isCustomizing ? (
        <div className="flex flex-col gap-4 py-3 border-t border-b border-black/[0.08] my-1">
          
          {/* Category: Essential */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => toggleDetail('essential')}
                className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.1em] text-black hover:text-zinc-600 transition-colors cursor-pointer text-left"
              >
                {t('essentialTitle')}
                {showDetails.essential ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              <div className="flex items-center justify-center w-9 h-5 rounded-full bg-zinc-200 opacity-60 relative px-1 cursor-not-allowed">
                <div className="w-3 h-3 rounded-full bg-zinc-500 absolute right-1"></div>
              </div>
            </div>
            
            {showDetails.essential && (
              <p className="text-[11px] text-zinc-500 pl-1 leading-relaxed">
                {t('essentialDesc')}
              </p>
            )}
          </div>

          {/* Category: Analytics */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => toggleDetail('analytics')}
                className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.1em] text-black hover:text-zinc-600 transition-colors cursor-pointer text-left"
              >
                {t('analyticsTitle')}
                {showDetails.analytics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              <button
                type="button"
                onClick={() => setAnalyticsConsent(!analyticsConsent)}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-1 cursor-pointer focus:outline-none ${analyticsConsent ? 'bg-black' : 'bg-zinc-200'}`}
                aria-label="Toggle Analytics cookies"
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white transition-transform block ${analyticsConsent ? 'translate-x-3.5' : 'translate-x-0'}`}></span>
              </button>
            </div>
            
            {showDetails.analytics && (
              <p className="text-[11px] text-zinc-500 pl-1 leading-relaxed">
                {t('analyticsDesc')}
              </p>
            )}
          </div>

          {/* Category: Marketing */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => toggleDetail('marketing')}
                className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.1em] text-black hover:text-zinc-600 transition-colors cursor-pointer text-left"
              >
                {t('marketingTitle')}
                {showDetails.marketing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              <button
                type="button"
                onClick={() => setMarketingConsent(!marketingConsent)}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-1 cursor-pointer focus:outline-none ${marketingConsent ? 'bg-black' : 'bg-zinc-200'}`}
                aria-label="Toggle Marketing cookies"
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white transition-transform block ${marketingConsent ? 'translate-x-3.5' : 'translate-x-0'}`}></span>
              </button>
            </div>
            
            {showDetails.marketing && (
              <p className="text-[11px] text-zinc-500 pl-1 leading-relaxed">
                {t('marketingDesc')}
              </p>
            )}
          </div>

        </div>
      ) : null}

      {/* Button Controls */}
      <div className="flex flex-col gap-2 mt-2">
        {isCustomizing ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSavePreferences}
              className="py-2.5 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.14em] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-none whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t('save')}</span>
            </button>
            <button
              onClick={() => setIsCustomizing(false)}
              className="py-2.5 px-4 rounded-xl bg-transparent border border-black/[0.12] hover:border-black text-black font-mono text-xs uppercase tracking-[0.14em] hover:bg-zinc-50 transition-colors cursor-pointer flex items-center justify-center shadow-none whitespace-nowrap"
            >
              {t('close')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAcceptAll}
                className="py-2.5 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-[0.14em] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-none whitespace-nowrap"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('acceptAll')}</span>
              </button>
              <button
                onClick={handleDeclineAll}
                className="py-2.5 px-4 rounded-xl bg-transparent border border-black/[0.12] hover:border-black text-black font-mono text-xs uppercase tracking-[0.14em] hover:bg-zinc-50 transition-colors cursor-pointer flex items-center justify-center shadow-none whitespace-nowrap"
              >
                {t('declineAll')}
              </button>
            </div>
            <button
              onClick={() => setIsCustomizing(true)}
              className="py-2 text-zinc-500 hover:text-black font-mono text-xs uppercase tracking-[0.12em] underline underline-offset-4 cursor-pointer transition-colors text-center focus:outline-none whitespace-nowrap"
            >
              {t('customize')}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
