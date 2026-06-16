import type { PricingTier, PricingAddon } from './types';

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 1500,
    period: 'project',
    description: 'Idéal pour lancer votre acquisition client en ligne rapidement.',
    features: [
      "Site d'acquisition client (jusqu'à 8 pages)",
      'Design responsive Mobile-First',
      'Temps de chargement ultra-rapide (< 1s)',
      'Formulaire de contact & capture de prospects',
      '1 phase de révision complète',
      'Hébergement haute performance sécurisé',
      'Propriété exclusive à 100% (code source livré)',
    ],
    highlighted: false,
    cta: 'Choisir Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4500,
    period: 'project',
    description: 'Pour automatiser votre activité et fidéliser vos clients.',
    features: [
      'Tout Starter inclus',
      'Plateforme web sur-mesure (Espace Client)',
      'Accès sécurisé pour vos utilisateurs',
      'Base de données sécurisée et centralisée',
      'Intégration de paiements (Stripe/Cartes)',
      'Automatisation de vos flux de travail (2 connecteurs)',
      '3 phases de révisions complètes',
      'Support technique post-lancement (30 jours)',
    ],
    highlighted: true,
    cta: 'Choisir Pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9500,
    period: 'project',
    description: 'Pour les projets d\'envergure, automatisations complexes et agents IA sur-mesure.',
    features: [
      'Tout Pro inclus',
      'Assistants IA métiers sur-mesure (Claude/GPT)',
      'Architecture hautement évolutive & API',
      'Audits complets de sécurité & charge',
      'Formation de vos équipes aux outils (4h)',
      'Maintenance & assistance mensuelle (6 mois)',
      'Révisions illimitées',
      'Chef de projet senior dédié',
    ],
    highlighted: false,
    cta: 'Nous contacter',
  },
];

export const PRICING_ADDONS: PricingAddon[] = [
  { id: 'design', name: 'Identité visuelle complète', price: 800, unit: 'projet' },
  { id: 'seo', name: 'Audit SEO + stratégie contenu', price: 600, unit: 'projet' },
  { id: 'automation', name: "Pipeline automatisation N8N", price: 1200, unit: 'projet' },
  { id: 'maintenance', name: 'Maintenance mensuelle', price: 350, unit: 'mois' },
  { id: 'ai-agent', name: 'Agent IA métier sur-mesure', price: 2000, unit: 'agent' },
];
