'use client';

import { useState, useEffect } from 'react';
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

  const applyConsent = (state: CookieConsentState) => {
    // Persistent choices
    localStorage.setItem('lonside-cookie-consent', JSON.stringify(state));
    
    // Manage Plausible Script
    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    if (plausibleDomain) {
      if (state.analytics) {
        // Load plausible script
        const existingScript = document.getElementById('plausible-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'plausible-script';
          script.defer = true;
          script.setAttribute('data-domain', plausibleDomain);
          script.src = 'https://plausible.io/js/script.js';
          document.body.appendChild(script);
        }
      } else {
        // Remove plausible script if already loaded
        const script = document.getElementById('plausible-script');
        if (script) {
          script.remove();
        }
      }
    }
  };

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
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[480px] z-[100] max-h-[90vh] overflow-y-auto rounded-2xl glass-panel p-6 shadow-[0_10px_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
      
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base tracking-wide font-sans">
            {t('title')}
          </h3>
          {!isCustomizing && (
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {t('description')}
            </p>
          )}
        </div>
      </div>

      {/* Custom preferences form */}
      {isCustomizing ? (
        <div className="flex flex-col gap-4 py-2 border-t border-b border-white/5 my-2">
          
          {/* Category: Essential */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => toggleDetail('essential')}
                className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-brand-purple transition-colors cursor-pointer text-left"
              >
                {t('essentialTitle')}
                {showDetails.essential ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              <div className="flex items-center justify-center w-9 h-5 rounded-full bg-slate-800 opacity-60 relative px-1 cursor-not-allowed">
                <div className="w-3 h-3 rounded-full bg-slate-400 absolute right-1"></div>
              </div>
            </div>
            
            {showDetails.essential && (
              <p className="text-[11px] text-slate-400 pl-1 leading-relaxed">
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
                className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-brand-purple transition-colors cursor-pointer text-left"
              >
                {t('analyticsTitle')}
                {showDetails.analytics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              <button
                type="button"
                onClick={() => setAnalyticsConsent(!analyticsConsent)}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-1 cursor-pointer focus:outline-none ${analyticsConsent ? 'bg-brand-purple' : 'bg-slate-800'}`}
                aria-label="Toggle Analytics cookies"
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white transition-transform block ${analyticsConsent ? 'translate-x-3.5' : 'translate-x-0'}`}></span>
              </button>
            </div>
            
            {showDetails.analytics && (
              <p className="text-[11px] text-slate-400 pl-1 leading-relaxed">
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
                className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-brand-purple transition-colors cursor-pointer text-left"
              >
                {t('marketingTitle')}
                {showDetails.marketing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              <button
                type="button"
                onClick={() => setMarketingConsent(!marketingConsent)}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-1 cursor-pointer focus:outline-none ${marketingConsent ? 'bg-brand-purple' : 'bg-slate-800'}`}
                aria-label="Toggle Marketing cookies"
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-white transition-transform block ${marketingConsent ? 'translate-x-3.5' : 'translate-x-0'}`}></span>
              </button>
            </div>
            
            {showDetails.marketing && (
              <p className="text-[11px] text-slate-400 pl-1 leading-relaxed">
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
              className="py-2.5 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-semibold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] cursor-pointer flex items-center justify-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              {t('save')}
            </button>
            <button
              onClick={() => setIsCustomizing(false)}
              className="py-2.5 px-4 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-850 text-xs font-medium cursor-pointer transition-colors"
            >
              {t('close')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAcceptAll}
                className="py-2.5 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-semibold text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              >
                <Shield className="w-3.5 h-3.5" />
                {t('acceptAll')}
              </button>
              <button
                onClick={handleDeclineAll}
                className="py-2.5 px-4 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:bg-slate-850 text-xs font-medium cursor-pointer transition-colors"
              >
                {t('declineAll')}
              </button>
            </div>
            <button
              onClick={() => setIsCustomizing(true)}
              className="py-2 text-slate-400 hover:text-white text-xs font-medium underline underline-offset-4 cursor-pointer transition-colors text-center focus:outline-none"
            >
              {t('customize')}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
