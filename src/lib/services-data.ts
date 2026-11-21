import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import type { Locale } from '@/lib/keystatic/reader';

export type ServiceRouteKey =
  | 'sprint-mvp-14-jours'
  | 'application-web-nextjs'
  | 'plateforme-saas-sur-mesure'
  | 'regie-tech-senior';

interface LocalizedServiceCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  h1Muted: string;
  intro: string;
  priceLabel: string;
  priceNumeric: string;
  timelineLabel: string;
  warrantyLabel: string;
  idealFor: string[];
  deliverablesTitle: string;
  deliverables: Array<{ title: string; desc: string }>;
  comparisonRows: Array<{
    criterion: string;
    lonside: string;
    freelance: string;
    traditional: string;
  }>;
  faq: Array<{ q: string; a: string }>;
}

export interface ServiceDefinition {
  key: ServiceRouteKey;
  frPath: `/services/${ServiceRouteKey}`;
  enPath: string;
  stack: string[];
  featuredSlugs: string[];
  fr: LocalizedServiceCopy;
  en: LocalizedServiceCopy;
}

export const SERVICES: Record<ServiceRouteKey, ServiceDefinition> = {
  'sprint-mvp-14-jours': {
    key: 'sprint-mvp-14-jours',
    frPath: '/services/sprint-mvp-14-jours',
    enPath: '/en/services/14-day-mvp-sprint',
    stack: ['Next.js 16 (App Router)', 'TypeScript Strict', 'Tailwind CSS', 'PostgreSQL / Supabase RLS', 'Stripe Billing', 'PostHog EU', 'Resend'],
    featuredSlugs: ['weedin', 'welqo'],
    fr: {
      metaTitle: 'Sprint MVP 14 Jours au Forfait Fixe — Lonside Studio',
      metaDescription: 'Lancez votre MVP SaaS ou application web en production dès 14 jours ouvrés. Forfait ferme à 6 900 € HT, 100 % du code cédé sur votre GitHub, garantie 30 jours.',
      eyebrow: 'Sprint Launch // 14 Jours Ouvrés',
      h1: 'Votre MVP SaaS en production,',
      h1Muted: 'livré en 14 jours fermes.',
      intro: 'Passez d’une idée validée à une application web réelle, sécurisée et prête à encaisser vos premiers clients Stripe en deux semaines. Zéro intermédiaire, zéro dépassement budgétaire, propriété intellectuelle intégrale dès le premier commit.',
      priceLabel: '6 900 € HT',
      priceNumeric: '6900',
      timelineLabel: '14 jours ouvrés garantis',
      warrantyLabel: '30 jours de garantie corrective',
      idealFor: [
        'Fondateurs qui veulent valider un marché avec un vrai produit, pas une maquette jetable',
        'Startups pré-seed / seed préparant une démo investisseurs ou leurs 50 premiers clients payants',
        'PME lançant un portail client ou un outil métier sans subir 6 mois de cycle classique',
      ],
      deliverablesTitle: 'Ce qui est livré clé en main en 14 jours',
      deliverables: [
        {
          title: 'Application web full-stack responsive',
          desc: 'Interface Haute Horlogerie mobile-first en Next.js 16 + TypeScript strict, optimisée Core Web Vitals et SEO technique dès le premier jour.',
        },
        {
          title: 'Authentification, sessions & base de données sécurisée',
          desc: 'Schéma PostgreSQL / Supabase avec politiques Row Level Security (RLS), gestion des comptes et cloisonnement strict des données utilisateurs.',
        },
        {
          title: 'Monétisation Stripe & emails transactionnels',
          desc: 'Checkout Stripe, abonnements récurrents, portail de facturation client et emails automatisés Resend prêts à encaisser dès la mise en ligne.',
        },
        {
          title: 'Cession 100 % GitHub & Pack Handover',
          desc: 'Tout le code est poussé directement sur votre dépôt privé GitHub avec documentation technique, variables chiffrées et visite guidée vidéo.',
        },
      ],
      comparisonRows: [
        { criterion: 'Délai de mise en production', lonside: '14 jours ouvrés contractuels', freelance: '4 à 10 semaines aléatoires', traditional: '3 à 6 mois (cycles lourds)' },
        { criterion: 'Budget', lonside: '6 900 € HT ferme et scellé', freelance: 'TJM variable, risque de dérive', traditional: '25 000 € à 60 000 €+ HT' },
        { criterion: 'Propriété du code source', lonside: '100 % sur votre GitHub dès J1', freelance: 'Souvent livré en fin de mission', traditional: 'Dépendance fréquente ou clauses lourdes' },
        { criterion: 'Interlocuteur technique', lonside: 'Directement le Lead Architect', freelance: 'Profil parfois mono-compétence', traditional: 'Commerciaux & chefs de projet intermédiaires' },
      ],
      faq: [
        {
          q: 'Est-ce vraiment possible de livrer un MVP solide en 14 jours sans dette technique ?',
          a: 'Oui, parce que nous ne perdons aucun jour en réunions inutiles ni en réinvention de brique standard. Notre socle Next.js 16 / TypeScript / PostgreSQL / Stripe est industrialisé, ce qui concentre 100 % du sprint sur votre logique métier différenciante.',
        },
        {
          q: 'Que se passe-t-il si le studio accuse du retard sur la date scellée ?',
          a: 'Nos délais sont contractuels : une pénalité de 10 % est déduite par tranche de 48 heures de retard imputable au studio. En pratique, le cadrage amont verrouille le périmètre pour livrer à l’heure.',
        },
        {
          q: 'Pourrai-je faire évoluer le MVP avec mon propre développeur après le sprint ?',
          a: 'Absolument. Le dépôt GitHub vous appartient à 100 %, sans framework propriétaire. N’importe quel ingénieur TypeScript / React senior peut reprendre la base de code en moins d’une heure grâce au Pack Handover.',
        },
      ],
    },
    en: {
      metaTitle: '14-Day Fixed-Price MVP Sprint — Lonside Studio',
      metaDescription: 'Ship your production SaaS MVP or custom web application in 14 business days. Fixed €6,900 scope, 100% GitHub source code ownership, and 30-day warranty.',
      eyebrow: 'Sprint Launch // 14 Business Days',
      h1: 'Your production SaaS MVP,',
      h1Muted: 'shipped in 14 business days.',
      intro: 'Turn a validated concept into a live, secure web application ready to onboard real users and collect Stripe revenue in two weeks. Zero account managers, zero budget creep, 100% IP transfer from commit one.',
      priceLabel: '€6,900 excl. VAT',
      priceNumeric: '6900',
      timelineLabel: '14 guaranteed business days',
      warrantyLabel: '30-day corrective warranty',
      idealFor: [
        'Founders validating demand with production software instead of throwaway prototypes',
        'Pre-seed and seed teams preparing investor demos or onboarding their first 50 paying users',
        'SMBs launching a customer portal or internal tool without enduring a 6-month build cycle',
      ],
      deliverablesTitle: 'Everything shipped live in 14 days',
      deliverables: [
        {
          title: 'Responsive full-stack web application',
          desc: 'Precision mobile-first interface built on Next.js 16 and strict TypeScript, engineered for Core Web Vitals and clean technical SEO from day one.',
        },
        {
          title: 'Authentication, sessions & hardened database',
          desc: 'PostgreSQL / Supabase schema with Row Level Security (RLS), session management, and strict tenant data isolation.',
        },
        {
          title: 'Stripe billing & transactional email stack',
          desc: 'Stripe Checkout, recurring subscriptions, customer billing portal, and Resend transactional notifications ready to generate revenue at launch.',
        },
        {
          title: '100% GitHub transfer & Handover Pack',
          desc: 'Every commit lands directly in your private GitHub repository alongside architecture documentation and a Loom code walkthrough.',
        },
      ],
      comparisonRows: [
        { criterion: 'Time to production', lonside: '14 contractual business days', freelance: '4–10 unpredictable weeks', traditional: '3–6 months (heavy committees)' },
        { criterion: 'Pricing certainty', lonside: '€6,900 fixed and sealed', freelance: 'Open-ended day rates', traditional: '€25,000–€60,000+ with change orders' },
        { criterion: 'Source code ownership', lonside: '100% in your GitHub from day 1', freelance: 'Often transferred at the end', traditional: 'Frequent vendor lock-in' },
        { criterion: 'Who builds it', lonside: 'Directly the Lead Architect', freelance: 'Single-track skill set', traditional: 'Sales & project manager layers' },
      ],
      faq: [
        {
          q: 'Can a 14-day MVP really be production-grade with zero technical debt?',
          a: 'Yes. We eliminate discovery bloat and build on our battle-tested Next.js 16, TypeScript, PostgreSQL, and Stripe foundation—dedicating 100% of sprint bandwidth to your core differentiating workflow.',
        },
        {
          q: 'What happens if the studio misses the locked delivery date?',
          a: 'Delivery dates are backed by a contractual SLA: a 10% fee refund applies for every 48 hours of studio-attributable delay.',
        },
        {
          q: 'Can our internal engineers take over immediately after launch?',
          a: 'Yes. You hold 100% ownership of the private GitHub repo built on standard TypeScript and React conventions, backed by our complete Handover Pack.',
        },
      ],
    },
  },

  'application-web-nextjs': {
    key: 'application-web-nextjs',
    frPath: '/services/application-web-nextjs',
    enPath: '/en/services/nextjs-web-application',
    stack: ['Next.js 16 (App Router / RSC)', 'React 19', 'TypeScript Strict', 'Tailwind CSS v4', 'PostgreSQL / Prisma / Supabase', 'Vercel Edge', 'Playwright / Vitest'],
    featuredSlugs: ['welqo', 'bely'],
    fr: {
      metaTitle: 'Développement Application Web Next.js & TypeScript — Lonside Studio',
      metaDescription: 'Studio indépendant spécialisé Next.js 16, React et TypeScript. Applications web sur-mesure ultra-rapides, Core Web Vitals > 95, SEO technique et 100 % du code à vous.',
      eyebrow: 'Ingénierie Frontend & Full-Stack // Next.js 16',
      h1: 'Applications web Next.js,',
      h1Muted: 'taillées pour la vitesse.',
      intro: 'Nous concevons et développons des applications web sur-mesure sur Next.js 16 (App Router, Server Components, TypeScript strict). Des interfaces instantanées, parfaitement indexables par Google et maintenables par toute équipe d’ingénierie senior.',
      priceLabel: 'Dès 6 900 € HT',
      priceNumeric: '6900',
      timelineLabel: '14 à 30 jours ouvrés',
      warrantyLabel: 'Score Lighthouse & SLA inclus',
      idealFor: [
        'Entreprises dont le produit web doit performer autant en acquisition SEO qu’en fluidité applicative',
        'Équipes souhaitant migrer un frontend lent ou une stack vieillissante vers Next.js 16 & TypeScript',
        'Portails clients, marketplaces, simulateurs financiers et plateformes métier à fort trafic',
      ],
      deliverablesTitle: 'Standards d’ingénierie Next.js Lonside',
      deliverables: [
        {
          title: 'Architecture App Router, SSR & SSG hybride',
          desc: 'Découpage chirurgical entre Server Components et interactivité client pour des temps de réponse sous les 120 ms et un HTML 100 % crawlable.',
        },
        {
          title: 'TypeScript strict & validation bout en bout',
          desc: 'Contrats de données typés de la base PostgreSQL jusqu’aux formulaires Zod, réduisant drastiquement les régressions en production.',
        },
        {
          title: 'SEO technique, i18n & données structurées natifs',
          desc: 'Canoniques propres, hreflang multi-langues, Schema.org JSON-LD, sitemaps dynamiques et Core Web Vitals au sommet dès le déploiement.',
        },
        {
          title: 'Sécurité HTTP & observabilité production',
          desc: 'En-têtes CSP, HSTS, rate limiting sur les routes API, télémétrie PostHog conforme RGPD et suite de tests automatisés.',
        },
      ],
      comparisonRows: [
        { criterion: 'Performance mobile (LCP)', lonside: 'Architecture RSC / Edge optimisée', freelance: 'Souvent SPA lourde côté client', traditional: 'Surcouches lourdes et plugins empilés' },
        { criterion: 'Qualité du code TypeScript', lonside: 'Mode strict + CI + revue Lead Architect', freelance: 'Dépend fortement de l’individu', traditional: 'Hétérogène selon les profils juniors assignés' },
        { criterion: 'SEO & Indexation Google', lonside: 'Intégré dès l’architecture (SSG/SSR)', freelance: 'Souvent ajouté après coup', traditional: 'Facturé en prestation SEO séparée' },
        { criterion: 'Livraison & prévisibilité', lonside: 'Sprints fermes de 14 à 30 jours', freelance: 'Planning glissant', traditional: 'Cycles trimestriels coûteux' },
      ],
      faq: [
        {
          q: 'Pourquoi Lonside choisit Next.js 16 et TypeScript comme socle principal ?',
          a: 'Next.js réunit le meilleur du rendu serveur (SEO, vitesse de premier affichage, sécurité des appels API) et de l’interactivité React moderne, tout en constituant le standard le plus facile à recruter et maintenir sur la durée.',
        },
        {
          q: 'Pouvez-vous reprendre ou migrer une application existante vers Next.js ?',
          a: 'Oui. Nous réalisons des refontes progressives ou complètes (depuis SPA React, PHP/WordPress, no-code ou legacy) en sécurisant vos redirections 301 SEO et votre base de données.',
        },
        {
          q: 'L’hébergement est-il verrouillé chez Lonside ?',
          a: 'Jamais. Nous déployons directement sur votre propre compte Vercel, AWS, Scaleway ou infrastructure Docker selon vos contraintes de souveraineté.',
        },
      ],
    },
    en: {
      metaTitle: 'Custom Next.js & TypeScript Web Application Studio — Lonside Studio',
      metaDescription: 'Independent studio specializing in Next.js 16, React, and strict TypeScript web applications. Sub-120ms speed, Core Web Vitals > 95, clean SEO, and 100% code ownership.',
      eyebrow: 'Frontend & Full-Stack Engineering // Next.js 16',
      h1: 'Next.js web applications,',
      h1Muted: 'engineered for speed.',
      intro: 'We architect and ship custom web applications on Next.js 16 (App Router, Server Components, strict TypeScript). Instant user interfaces, rock-solid technical SEO, and clean codebases any senior team can maintain.',
      priceLabel: 'From €6,900 excl. VAT',
      priceNumeric: '6900',
      timelineLabel: '14 to 30 business days',
      warrantyLabel: 'Core Web Vitals & SLA included',
      idealFor: [
        'Companies whose web product must excel at both organic SEO acquisition and interactive speed',
        'Teams migrating a sluggish SPA or legacy stack to Next.js 16 and TypeScript',
        'Client portals, marketplaces, interactive calculators, and high-traffic B2B platforms',
      ],
      deliverablesTitle: 'Lonside Next.js engineering standards',
      deliverables: [
        {
          title: 'Hybrid App Router, SSR & SSG architecture',
          desc: 'Disciplined separation between Server Components and client interactivity for sub-120ms TTFB and 100% crawlable HTML.',
        },
        {
          title: 'Strict TypeScript & end-to-end validation',
          desc: 'Typed data contracts from PostgreSQL schemas to Zod API routes, eliminating entire classes of production regressions.',
        },
        {
          title: 'Built-in technical SEO, i18n & structured data',
          desc: 'Canonical URL hygiene, bidirectional hreflang, Schema.org JSON-LD, dynamic sitemaps, and top-tier Core Web Vitals out of the box.',
        },
        {
          title: 'Hardened HTTP security & telemetry',
          desc: 'Strict CSP, HSTS, API rate limiting, GDPR-compliant PostHog analytics, and automated regression tests.',
        },
      ],
      comparisonRows: [
        { criterion: 'Mobile LCP performance', lonside: 'RSC / Edge-first architecture', freelance: 'Often heavy client-side SPA', traditional: 'Bloated boilerplate & plugins' },
        { criterion: 'TypeScript code quality', lonside: 'Strict mode + CI + Lead Architect', freelance: 'Varies widely per contractor', traditional: 'Mixed junior/mid turnover' },
        { criterion: 'Technical SEO readiness', lonside: 'Built into routing & SSG from day 1', freelance: 'Often an afterthought', traditional: 'Billed as a separate add-on' },
        { criterion: 'Delivery predictability', lonside: 'Fixed 14–30 day sprints', freelance: 'Rolling timelines', traditional: 'Quarterly waterfall delays' },
      ],
      faq: [
        {
          q: 'Why does Lonside standardize on Next.js 16 and TypeScript?',
          a: 'Next.js unifies server-rendered speed, technical SEO, and modern React interactivity on the industry’s most maintainable and hireable web engineering stack.',
        },
        {
          q: 'Can you migrate an existing web app or no-code prototype to Next.js?',
          a: 'Yes. We handle clean migrations from legacy stacks or no-code tools while preserving SEO equity with zero-hop 301 redirects and safe database migrations.',
        },
        {
          q: 'Is hosting locked to Lonside?',
          a: 'Never. We deploy directly into your own Vercel, AWS, Scaleway, or Docker infrastructure so you retain 100% operational sovereignty.',
        },
      ],
    },
  },

  'plateforme-saas-sur-mesure': {
    key: 'plateforme-saas-sur-mesure',
    frPath: '/services/plateforme-saas-sur-mesure',
    enPath: '/en/services/custom-saas-platform',
    stack: ['Next.js 16', 'PostgreSQL Multi-Tenant (RLS)', 'Node.js / Python FastAPI', 'Stripe Connect & Billing', 'Webhooks & Jobs Temps Réel', 'Vitest / Tests Intégration'],
    featuredSlugs: ['michi', 'bely', 'welqo'],
    fr: {
      metaTitle: 'Développement Plateforme SaaS Sur-Mesure (30 Jours) — Lonside Studio',
      metaDescription: 'Plateformes SaaS B2B multi-rôles, portails multi-tenants, moteurs de calcul temps réel et facturation Stripe livrés en 30 jours au forfait ferme de 13 900 € HT.',
      eyebrow: 'Sprint Scale // 30 Jours Ouvrés',
      h1: 'Plateformes SaaS B2B,',
      h1Muted: 'architecturées pour scaler.',
      intro: 'Pour les produits ambitieux qui dépassent le simple MVP : portails multi-rôles (Admin, Client, Opérateur), isolation multi-tenant stricte, moteurs de calcul métier, synchronisation API temps réel et facturation automatisée, livrés en 30 jours ouvrés.',
      priceLabel: '13 900 € HT',
      priceNumeric: '13900',
      timelineLabel: '30 jours ouvrés (2 jalons)',
      warrantyLabel: '45 jours de garantie corrective',
      idealFor: [
        'Fondateurs B2B bâtissant un SaaS vertical (PropTech, Supply Chain, Mobilité, EventTech, FinTech)',
        'Entreprises remplaçant des workflows Excel / no-code saturés par une plateforme propriétaire robuste',
        'Équipes exigeant multi-tenancy étanche, rôles granulaires, webhooks temps réel et tests automatisés',
      ],
      deliverablesTitle: 'Architecture complète du Sprint Scale (30 jours)',
      deliverables: [
        {
          title: 'Multi-tenancy étanche & contrôle d’accès (RBAC)',
          desc: 'Cloisonnement hermétique des organisations clientes via PostgreSQL RLS, rôles granulaires (Admin, Manager, Client) et journaux d’audit.',
        },
        {
          title: 'Moteurs métier, synchronisation API & tâches de fond',
          desc: 'Pipelines de calcul prédictif, dispatch géospatial, webhooks idempotents, files de jobs asynchrones et notifications temps réel.',
        },
        {
          title: 'Facturation B2B Stripe & conformité documentaire',
          desc: 'Plans par paliers, facturation consolidée, Stripe Connect ou signature électronique certifiée eIDAS intégrée au parcours.',
        },
        {
          title: 'Suite de tests automatisés & documentation complète',
          desc: 'Tests unitaires et d’intégration sur les flux critiques, schémas d’architecture et passation vidéo complète sur votre dépôt GitHub.',
        },
      ],
      comparisonRows: [
        { criterion: 'Isolation sécurité multi-tenant', lonside: 'PostgreSQL RLS + RBAC natifs', freelance: 'Souvent filtrage applicatif fragile', traditional: 'Long à spécifier et auditer' },
        { criterion: 'Coût total d’une V1 complète', lonside: '13 900 € HT ferme (2 jalons)', freelance: '20 000 € à 40 000 € étalés', traditional: '60 000 € à 150 000 € HT' },
        { criterion: 'Tests & maintenabilité', lonside: 'Tests automatisés + Pack Handover', freelance: 'Rarement couverts par défaut', traditional: 'Souvent coupés en fin de budget' },
        { criterion: 'Garantie post-lancement', lonside: '45 jours de garantie corrective incluse', freelance: 'Facturation au temps passé', traditional: 'Contrat TMA mensuel obligatoire' },
      ],
      faq: [
        {
          q: 'Comment est découpé un Sprint Scale de 30 jours ?',
          a: 'Le sprint s’articule en deux jalons clairs : Jalon 1 (J1–J15) sur l’architecture de données, l’authentification multi-rôles et le cœur métier ; Jalon 2 (J16–J30) sur les automatisations, intégrations tierces, paiements, tests et mise en production.',
        },
        {
          q: 'Pouvez-vous intégrer des moteurs de calcul Python ou de l’IA prédictive ?',
          a: 'Oui. Lorsque le métier l’exige (comme sur Michi 道 en prévision des stocks ou Bely en dispatch), nous couplons Next.js à des services PostgreSQL / Python FastAPI rapides et auditables.',
        },
        {
          q: 'Quelles preuves concrètes avez-vous sur des plateformes complexes ?',
          a: 'Consultez nos dossiers d’ingénierie détaillés sur Welqo (PropTech temps réel + eIDAS), Bely (dispatch VTC < 5 ms) et Michi 道 (prévision supply chain omnicanale).',
        },
      ],
    },
    en: {
      metaTitle: 'Custom B2B SaaS Platform Engineering (30 Days) — Lonside Studio',
      metaDescription: 'Multi-tenant B2B SaaS platforms, role-based portals, real-time computation engines, and automated Stripe billing delivered in 30 days for a fixed €13,900 scope.',
      eyebrow: 'Sprint Scale // 30 Business Days',
      h1: 'Custom B2B SaaS platforms,',
      h1Muted: 'architected to scale.',
      intro: 'Built for ambitious software products beyond a basic MVP: multi-role portals (Admin, Operator, Customer), hermetic multi-tenant isolation, real-time engines, API integrations, and automated billing—shipped live in 30 business days.',
      priceLabel: '€13,900 excl. VAT',
      priceNumeric: '13900',
      timelineLabel: '30 business days (2 milestones)',
      warrantyLabel: '45-day corrective warranty',
      idealFor: [
        'B2B founders launching vertical SaaS in PropTech, Supply Chain, Mobility, EventTech, or FinTech',
        'Companies replacing brittle spreadsheets or saturated no-code tools with proprietary software',
        'Teams requiring strict multi-tenant security, granular RBAC, real-time webhooks, and automated test suites',
      ],
      deliverablesTitle: 'Complete Sprint Scale blueprint (30 days)',
      deliverables: [
        {
          title: 'Hermetic multi-tenancy & granular RBAC',
          desc: 'Database-level tenant isolation with PostgreSQL RLS, multi-role permissions, and audit trails built in from commit one.',
        },
        {
          title: 'Business computation engines & real-time sync',
          desc: 'Predictive pipelines, geospatial dispatch, idempotent webhooks, background jobs, and live operational dashboards.',
        },
        {
          title: 'B2B Stripe billing & compliance workflows',
          desc: 'Tiered subscriptions, consolidated enterprise invoicing, Stripe Connect, or eIDAS-certified digital signing.',
        },
        {
          title: 'Automated test suite & full handover',
          desc: 'Unit and integration coverage on critical flows, architecture documentation, and Loom walkthrough pushed to your private GitHub.',
        },
      ],
      comparisonRows: [
        { criterion: 'Multi-tenant data security', lonside: 'Native PostgreSQL RLS + RBAC', freelance: 'Often fragile app-level filters', traditional: 'Slow specification overhead' },
        { criterion: 'Total V1 investment', lonside: '€13,900 fixed across 2 milestones', freelance: '€20k–€40k unpredictable', traditional: '€60k–€150k+ enterprise quotes' },
        { criterion: 'Testing & maintainability', lonside: 'Automated tests + Handover Pack', freelance: 'Seldom included by default', traditional: 'Often dropped when over budget' },
        { criterion: 'Post-launch protection', lonside: '45-day corrective warranty included', freelance: 'Billed hourly for fixes', traditional: 'Mandatory monthly retainer' },
      ],
      faq: [
        {
          q: 'How are the 30 business days structured?',
          a: 'Across two crisp milestones: Milestone 1 (Days 1–15) ships data architecture, multi-role auth, and core business logic; Milestone 2 (Days 16–30) delivers integrations, billing, automated tests, and production rollout.',
        },
        {
          q: 'Can you integrate Python computation services or predictive models?',
          a: 'Yes. When workloads require dedicated compute (such as inventory forecasting on Michi or sub-5ms dispatch on Bely), we pair Next.js with optimized PostgreSQL and Python FastAPI pipelines.',
        },
        {
          q: 'Where can we inspect real platforms you have shipped?',
          a: 'Review our full architectural dossiers for Welqo (real-time PropTech + eIDAS), Bely (executive mobility dispatch), and Michi (supply chain forecasting).',
        },
      ],
    },
  },

  'regie-tech-senior': {
    key: 'regie-tech-senior',
    frPath: '/services/regie-tech-senior',
    enPath: '/en/services/senior-engineering-squad',
    stack: ['Next.js / React / TypeScript', 'Node.js / Python / PostgreSQL', 'CI/CD & Architecture Cloud', 'Slack & GitHub Natif', 'Revues de code & Mentorat'],
    featuredSlugs: ['bely', 'michi'],
    fr: {
      metaTitle: 'Régie Tech Senior & Squad d’Immersion Next.js — Lonside Studio',
      metaDescription: 'Intégrez un Lead Architect / ingénieur senior full-stack TypeScript & Next.js dans votre Slack et GitHub dès 5 500 €/mois. Zéro délai d’onboarding, sans engagement long terme.',
      eyebrow: 'Régie d’Immersion // Continuité Produit',
      h1: 'Un ingénieur senior intégré,',
      h1Muted: 'opérationnel dès le jour 1.',
      intro: 'Accélérez votre roadmap produit sans subir 4 mois de recrutement ni le coût caché d’un mauvais profil. Un ingénieur senior Lonside rejoint directement votre Slack, votre Linear et votre GitHub avec un niveau d’exigence d’architecte.',
      priceLabel: 'Dès 5 500 € HT / mois',
      priceNumeric: '5500',
      timelineLabel: 'Allocation mensuelle flexible',
      warrantyLabel: 'Sans engagement long terme',
      idealFor: [
        'Startups financées (Seed / Série A) devant accélérer la livraison de features critiques',
        'Clients post-sprint Launch ou Scale souhaitant itérer chaque semaine sur les retours utilisateurs',
        'CTO et dirigeants cherchant un renfort senior autonome capable de cadrer, coder et déployer en production',
      ],
      deliverablesTitle: 'Comment fonctionne la Régie d’Immersion',
      deliverables: [
        {
          title: 'Intégration directe dans vos rituels (Slack, GitHub, Linear)',
          desc: 'Zéro couche de gestion intermédiaire. Pull requests quotidiennes, revues de code rigoureuses et déploiements continus dans votre CI.',
        },
        {
          title: 'Autonomie produit & architecture complète',
          desc: 'Capacité à transformer un besoin business en spécification technique, schéma de données, interface soignée et tests en production.',
        },
        {
          title: 'Performance, SEO technique & dette zéro',
          desc: 'Réduction progressive de votre dette technique, optimisation Core Web Vitals, sécurisation API et instrumentation PostHog.',
        },
        {
          title: 'Flexibilité mensuelle transparente',
          desc: 'Forfait mensuel clair, renouvelable ou ajustable sans préavis punitif, avec transfert continu de connaissance vers votre équipe interne.',
        },
      ],
      comparisonRows: [
        { criterion: 'Délai de démarrage', lonside: 'Immédiat (sous 5 jours)', freelance: '2 à 4 semaines de sourcing', traditional: '3 à 6 mois (recrutement CDI)' },
        { criterion: 'Séniorité garantie', lonside: 'Profil Lead Architect / Senior vérifié', freelance: 'Qualité très variable', traditional: 'Risque de profil junior placé' },
        { criterion: 'Coût mensuel chargé', lonside: 'Dès 5 500 € HT / mois', freelance: '10 000 € à 16 000 € / mois (TJM)', traditional: '7 500 €–10 000 €/mois + recrutement' },
        { criterion: 'Engagement contractuel', lonside: 'Mensuel flexible, zéro lock-in', freelance: 'Souvent minimum 3 mois', traditional: 'Contrat long terme / CDI rigide' },
      ],
      faq: [
        {
          q: 'Quelle est la différence avec une ESN classique ?',
          a: 'Aucune sous-traitance, aucun commercial, aucun remplacement par un profil junior en cours de route. Vous travaillez en direct avec l’ingénieur senior qui conçoit et pousse le code sur votre dépôt.',
        },
        {
          q: 'Peut-on démarrer la Régie d’Immersion sans avoir fait de Sprint Launch avant ?',
          a: 'Oui, à condition que votre stack soit alignée (TypeScript, React / Next.js, Node.js, PostgreSQL / Supabase). Nous commençons par un audit rapide de votre dépôt lors de la première semaine.',
        },
        {
          q: 'Comment suivez-vous la vélocité chaque semaine ?',
          a: 'Via vos propres outils (Linear, Jira, GitHub PRs) complétés par un point asynchrone hebdomadaire résumant ce qui est en production et les priorités de la semaine suivante.',
        },
      ],
    },
    en: {
      metaTitle: 'Embedded Senior Next.js & TypeScript Engineering Squad — Lonside Studio',
      metaDescription: 'Embed a senior full-stack Lead Architect directly into your Slack and GitHub from €5,500/month. Zero onboarding drag, flexible monthly cadence, zero long-term lock-in.',
      eyebrow: 'Immersion Squad // Continuous Velocity',
      h1: 'A senior embedded engineer,',
      h1Muted: 'shipping from day one.',
      intro: 'Accelerate your product roadmap without enduring 4-month hiring cycles or risky contractor roulette. A Lonside senior engineer plugs straight into your Slack, Linear, and GitHub with Lead Architect rigor.',
      priceLabel: 'From €5,500 excl. VAT / mo',
      priceNumeric: '5500',
      timelineLabel: 'Flexible monthly allocation',
      warrantyLabel: 'No long-term lock-in',
      idealFor: [
        'Funded startups (Seed / Series A) needing immediate senior velocity on core roadmap milestones',
        'Post-Launch or Scale clients iterating weekly on live customer feedback',
        'CTOs and founders looking for an autonomous builder who architects, codes, and deploys cleanly',
      ],
      deliverablesTitle: 'How the Immersion Squad operates',
      deliverables: [
        {
          title: 'Native integration in Slack, GitHub & Linear',
          desc: 'Zero account manager friction. Daily pull requests, thorough code reviews, and continuous shipping inside your CI/CD.',
        },
        {
          title: 'End-to-end product & system autonomy',
          desc: 'Turns raw business requirements into clean data schemas, crisp UI, automated tests, and production releases.',
        },
        {
          title: 'Performance, technical SEO & debt elimination',
          desc: 'Continuous codebase hardening, Core Web Vitals optimization, API security, and PostHog funnel instrumentation.',
        },
        {
          title: 'Transparent monthly flexibility',
          desc: 'Predictable monthly allocation that scales up or pauses cleanly, with continuous knowledge transfer to your team.',
        },
      ],
      comparisonRows: [
        { criterion: 'Time to first PR', lonside: 'Under 5 business days', freelance: '2–4 weeks of vetting', traditional: '3–6 months full-time hiring' },
        { criterion: 'Guaranteed seniority', lonside: 'Verified Lead Architect / Senior', freelance: 'Inconsistent delivery quality', traditional: 'Bait-and-switch junior staffing' },
        { criterion: 'Monthly investment', lonside: 'From €5,500 excl. VAT / mo', freelance: '€10k–€16k/mo full-time day rates', traditional: '€8k–€11k/mo loaded + recruiter fees' },
        { criterion: 'Commitment', lonside: 'Flexible monthly, zero lock-in', freelance: 'Often 3-month minimum', traditional: 'Rigid multi-quarter contracts' },
      ],
      faq: [
        {
          q: 'How is this different from traditional IT staffing firms?',
          a: 'Zero outsourcing, zero sales layer, and zero junior handoffs. You collaborate directly with the senior engineer architecting and pushing production code into your repo.',
        },
        {
          q: 'Can we start an Immersion Squad on an existing codebase?',
          a: 'Yes, provided your stack aligns with TypeScript, React / Next.js, Node.js, and PostgreSQL / Supabase. Week one includes a focused technical baseline audit.',
        },
        {
          q: 'How is weekly output tracked?',
          a: 'Directly inside your Linear/GitHub pull requests, paired with a crisp weekly async summary of shipped features and upcoming priorities.',
        },
      ],
    },
  },
};

export const SERVICE_KEYS = Object.keys(SERVICES) as ServiceRouteKey[];

export function buildServiceMetadata(key: ServiceRouteKey, locale: string): Metadata {
  const currentLocale: Locale = locale === 'en' ? 'en' : 'fr';
  const isEn = currentLocale === 'en';
  const def = SERVICES[key];
  const copy = isEn ? def.en : def.fr;
  const frUrl = `${siteConfig.siteUrl}${def.frPath}`;
  const enUrl = `${siteConfig.siteUrl}${def.enPath}`;
  const canonical = isEn ? enUrl : frUrl;
  const ogImage = `${siteConfig.siteUrl}/og?locale=${currentLocale}&title=${encodeURIComponent(copy.metaTitle)}&description=${encodeURIComponent(copy.metaDescription)}`;

  return {
    title: { absolute: copy.metaTitle },
    description: copy.metaDescription,
    alternates: {
      canonical,
      languages: {
        fr: frUrl,
        en: enUrl,
        'x-default': frUrl,
      },
    },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: canonical,
      siteName: 'Lonside Studio',
      locale: isEn ? 'en_US' : 'fr_FR',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: copy.metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.metaTitle,
      description: copy.metaDescription,
      images: [ogImage],
    },
  };
}
