# 🏛️ Lonside — Studio d'Ingénierie Digitale Haute Vélocité

> **Votre produit digital en production, dès 14 jours.**  
> Studio de développement d'applications web et plateformes sur-mesure pour fondateurs et équipes exigeantes. Périmètre verrouillé, forfait fixe sans mauvaise surprise, et 100% du code source cédé sur votre propre compte GitHub.

---

## 🧭 Sommaire

1. [Vision & Positionnement](#-vision--positionnement)
2. [Grille des Deux Formats Fermés](#-grille-des-deux-formats-fermés)
3. [Stack Technique de Pointe](#-stack-technique-de-pointe)
4. [Architecture Modulaire (Domain-Driven Design)](#-architecture-modulaire-domain-driven-design)
5. [Installation & Démarrage Rapide](#-installation--démarrage-rapide)
6. [Configuration & Variables d'Environnement](#-configuration--variables-denvironnement)
7. [Scripts & Commandes Disponibles](#-scripts--commandes-disponibles)
8. [Référencement SEO & GEO (Generative Engine Optimization)](#-référencement-seo--geo-generative-engine-optimization)
9. [Design System & Charte Monochrome](#-design-system--charte-monochrome)
10. [Conformité RGPD & Analytics](#-conformité-rgpd--analytics)
11. [Déploiement en Production](#-déploiement-en-production)

---

## 🎯 Vision & Positionnement

Lonside rompt avec les dérives traditionnelles du marché (agences lentes facturant au TJM sans fin, ou code amateur non testé) en s'inspirant des meilleurs studios d'ingénierie et de design mondiaux (*Linear, Work & Co, MetaLab, Stripe*) :

* **Vitesse Industrielle :** Échafaudage accéléré par les outils d'ingénierie les plus avancés couplé à une rigueur d'artisan senior.
* **Certitude Budgétaire :** Des forfaits fermes sans aucun dépassement. Si le studio prend du retard sur son engagement contractuel, une pénalité de 10% par tranche de 48h est appliquée.
* **Souveraineté Totale (Cession GitHub) :** 100% de la propriété intellectuelle (code, schémas PostgreSQL, composants UI) est poussée sur le dépôt privé du client dès le premier jour. Zéro captivité technique.

---

## 📦 Grille des Deux Formats Fermés

| Dimension | Formule 01 : SPRINT LAUNCH | Formule 02 : SPRINT SCALE |
| :--- | :--- | :--- |
| **Délai garanti** | **14 jours ouvrés** | **30 jours ouvrés** (2 jalons de 15j) |
| **Tarif forfaitaire** | **6 900 € HT** (Acompte 50% / Solde 50%) | **13 900 € HT** (40% lancement / 30% J15 / 30% J30) |
| **Périmètre cible** | MVP, première version commercialisable, SaaS | Plateformes multi-rôles, flux métier data, portails |
| **Comptes utilisateurs**| 1 rôle utilisateur principal + 1 admin | Multi-rôles (Acheteur, Vendeur, Gestionnaire, Admin) |
| **Paiements & Billing** | Stripe Checkout & Portail client complet | Stripe Billing, abonnements complexes ou commissions |
| **Intégrations API** | 1 à 2 connecteurs clés (Resend, Webhooks) | 2 à 4 connecteurs d'API avancés (ERP, CRM, IA) |
| **Garantie 0-Bug** | **30 jours post-lancement** | **45 jours post-lancement** |
| **Documentation** | Walkthrough Loom d'architecture + README | Loom détaillé + Pack Due Diligence Investisseur |

> **Continuité Post-Lancement (Régie d'Immersion) :**  
> Dès 5 500 € / mois, le même Lead Developer qui a conçu le produit reste immergé dans votre équipe (Slack, GitHub, Linear) avec zéro délai de recrutement et flexibilité mensuelle sans engagement.

---

## ⚡ Stack Technique de Pointe

* **Framework :** [Next.js 16 (App Router)](https://nextjs.org/) avec compilateur **Turbopack** natif.
* **Moteur UI :** [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) (typage strict).
* **Styling & Design System :** [Tailwind CSS v4](https://tailwindcss.com/) avec typographie suisse (*Inter*, *Antonio* variable display, *Geist Mono*).
* **Internationalisation :** [next-intl v4](https://next-intl-docs.vercel.app/) avec routage bilingue étanche (`/fr` et `/en`) et support de `x-default`.
* **CMS & Études de Cas :** [Keystatic CMS](https://keystatic.com/) (stockage Git/YAML local & synchronisé).
* **Formulaires & Validation :** [Zod](https://zod.dev/) pour la validation stricte des entrées API.
* **Emailing Transactionnel :** [Resend API](https://resend.com/) avec templates HTML soignés.
* **Analytics Privacy-First :** [PostHog](https://posthog.com/) + [Vercel Web Analytics](https://vercel.com/analytics) assujettis à un consentement explicite préalable (conforme CNIL / RGPD).

---

## 🏛️ Architecture Modulaire (Domain-Driven Design)

Le code est structuré selon les principes d'isolation de domaine pour éviter tout couplage fort :

```
/lonside/
├── content/                     # Sources de vérité Keystatic (YAML)
│   ├── faq/                     # Questions/Réponses réparties par thématique
│   ├── legal/                   # Textes légaux (CGV, Cookies, Mentions, Confidentialité)
│   └── portfolio/               # Dossiers d'études de cas (Welqo, Weedin, Bely, Michi)
├── public/
│   ├── llms.txt                 # Manifeste GEO pour les moteurs d'IA (Perplexity, ChatGPT)
│   └── videos/                  # Vidéo cinématique de fond (hero-ambient.mp4)
├── src/
│   ├── app/
│   │   ├── [locale]/            # Routage bilingue dynamique (/fr et /en)
│   │   │   ├── legal/           # Pages légales conformes
│   │   │   ├── layout.tsx       # Root layout locale, metadataBase & CookieConsent
│   │   │   └── page.tsx         # Page d'accueil unique (One-Page d'élite)
│   │   ├── api/contact/         # Endpoint sécurisé (Rate Limiting + Honeypot anti-bot)
│   │   ├── og/                  # Générateur OpenGraph Edge dynamique (1200x630)
│   │   ├── apple-icon.tsx       # Icône iOS vectorielle générée dynamiquement
│   │   ├── icon.tsx             # Favicon dynamique 32x32
│   │   ├── robots.ts            # Consignes de crawl bots & moteurs d'IA
│   │   └── sitemap.ts           # Sitemap dynamique multilingue avec x-default
│   ├── components/
│   │   ├── home/                # Sections modulaires du One-Page
│   │   │   ├── ContactSection.tsx
│   │   │   ├── FaqSection.tsx
│   │   │   ├── ManifestoSection.tsx
│   │   │   ├── MethodSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   └── WorkSection.tsx
│   │   ├── layout/              # Composants structurels
│   │   │   ├── CookieConsent.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LocaleHtmlLang.tsx
│   │   │   ├── LocaleSwitcher.tsx
│   │   │   └── Navbar.tsx
│   │   ├── DossierDrawer.tsx    # Tiroir latéral de présentation des études de cas
│   │   └── StudioAtmosphere.tsx # Fond architectural vivant & trame géométrique
│   └── lib/
│       ├── i18n/                # Moteur de traduction et navigation bilingue
│       ├── keystatic/           # Lecteur de collections typé
│       └── site-config.ts       # Source unique de vérité pour toutes les URLs (.env)
├── keystatic.config.ts          # Définition des schémas de contenu Keystatic
└── package.json
```

---

## 🚀 Installation & Démarrage Rapide

### Prérequis
* Node.js $\ge$ 20.x
* npm $\ge$ 10.x

### 1. Cloner le dépôt et installer les dépendances
```bash
git clone https://github.com/KevinTSAGUE/lonside.git
cd lonside
npm install
```

### 2. Configurer les variables d'environnement
Copiez le modèle `.env.example` vers `.env.local` :
```bash
cp .env.example .env.local
```

### 3. Lancer le serveur de développement local
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) pour visualiser le site.  
Pour accéder au panneau d'administration de contenu Keystatic, rendez-vous sur [http://localhost:3000/keystatic](http://localhost:3000/keystatic).

---

## 🔧 Configuration & Variables d'Environnement

Toutes les URLs et clés d'intégration sont centralisées via [`.env.local`](.env.local) et consommées de façon étanche par [`src/lib/site-config.ts`](src/lib/site-config.ts) :

```env
# URL publique canonique du studio
NEXT_PUBLIC_SITE_URL=https://lonside.ai

# Prise de rendez-vous en ligne (Cal.com ou Calendly)
NEXT_PUBLIC_CALENDAR_URL=https://cal.com/kevintsague/15min

# Contact et communication directe
NEXT_PUBLIC_CONTACT_EMAIL=contact@lonside.ai

# Présence sur les réseaux professionnels
NEXT_PUBLIC_GITHUB_URL=https://github.com/KevinTSAGUE
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/votre-profil
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/votre-compte

# Resend — envoi des emails du formulaire de contact (https://resend.com)
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX

# Analytics PostHog (Optionnel)
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

---

## 🛠️ Scripts & Commandes Disponibles

| Commande | Action |
| :--- | :--- |
| `npm run dev` | Lance le serveur de développement Next.js (Turbopack) |
| `npm run build` | Compile l'application en mode production (19/19 pages SSG) |
| `npm run start` | Démarre le serveur de production compilé |
| `npm run lint` | Lance le linter ESLint (0 erreur, 0 avertissement) |
| `npm test` | Exécute la suite de tests automatisés (Node.js Test Runner) |

---

## 🌐 Référencement SEO & GEO (Generative Engine Optimization)

Lonside intègre les technologies de référencement les plus récentes pour dominer à la fois sur Google et sur les moteurs d'intelligence artificielle :

1. **Rich Snippets SERP (Google) :**
   - **`FAQPage` Schema :** Déploiement automatique des accordéons de questions/réponses directement sous le lien Google dans les résultats de recherche.
   - **`OfferCatalog` Schema :** Déclaration formelle des tarifs (6 900 € et 13 900 € HT) pour indexation immédiate.
   - **`Organization` & `sameAs` :** Nourrit le Knowledge Graph de Google avec vos profils vérifiés.
2. **Generative Engine Optimization (GEO) :**
   - Fichier [`public/llms.txt`](public/llms.txt) structuré en Markdown selon le standard universel de l'IA.
   - Permet à **Perplexity, ChatGPT Search, Claude et Gemini** d'ingérer immédiatement la proposition de valeur de Lonside sans risque d'hallucination.
3. **Cartes OpenGraph Dynamiques :**
   - Route Edge [`/og`](src/app/og/route.tsx) générant à la volée une carte vectorielle 1200x630px en haute résolution adaptée à la langue du visiteur.
4. **Indexation Internationale Infaillible :**
   - Balise pivot `x-default` présente dans les balises `alternate` et dans le `sitemap.xml`.
   - `robots.txt` protégeant les endpoints `/api/` et `/keystatic/` tout en autorisant expressément les bots IA (*GPTBot, ClaudeBot, PerplexityBot*).

---

## 🎨 Design System & Charte Monochrome

* **Palette Monochrome Haute Couture :** Fond blanc titane pur (`#ffffff`), typographies et boutons noir profond (`#000000`), contrastes secondaires en nuances de gris zinc (`zinc-500`, `zinc-600`). Éradication totale des ombres néon ou dégradés saturés.
* **Rayon de Courbure Unifié :** Tous les boutons d'action, cartes, tiroirs et badges utilisent rigoureusement la norme **`rounded-xl` (12px)** pour une harmonie géométrique parfaite.
* **Labels sur une Ligne :** Classe `whitespace-nowrap` appliquée à tous les badges et boutons.
* **Ergonomie Tactile Mobile-First :** Cibles tactiles conformes aux recommandations ergonomiques ($\ge 44 \times 44\text{ px}$).
* **Tiroir de Projets Rectiligne (`DossierDrawer`) :** Fin des arrondis sur le flanc gauche (`rounded-none`), arête nette et glissement dynamique d'ouverture/fermeture avec courbe d'accélération naturelle `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 🛡️ Conformité RGPD & Analytics

* **Opt-In Explicite Obligatoire :** Aucun tracker d'audience (Vercel Analytics ou PostHog) ne se charge tant que l'utilisateur n'a pas validé son consentement.
* **Suite de Tests Dédiée :** 7 tests automatisés (`tests/analytics-consent.test.mjs`) vérifient en continu l'étanchéité du stockage local, la purge immédiate des événements en cas de retrait de consentement et l'anonymisation stricte des URLs.
* **Bannière Monochrome Epurée :** Le module de consentement respecte l'identité visuelle du studio sans intrusion agressive.

---

## 🚢 Déploiement en Production

Le projet est optimisé pour un déploiement continu à latence zéro sur **Vercel** :

1. Connectez votre dépôt GitHub à votre compte [Vercel](https://vercel.com).
2. Configurez les variables d'environnement dans les réglages du projet (*Project Settings $\rightarrow$ Environment Variables*) :
   - `NEXT_PUBLIC_SITE_URL` : `https://lonside.ai`
   - `NEXT_PUBLIC_CALENDAR_URL` : votre lien Cal.com
   - `NEXT_PUBLIC_CONTACT_EMAIL` : `contact@lonside.ai`
   - `RESEND_API_KEY` : votre clé d'API Resend de production
   - `NEXT_PUBLIC_GITHUB_URL` et `NEXT_PUBLIC_LINKEDIN_URL`
3. Déclenchez le déploiement : la commande `next build` pré-générera l'intégralité des 19 pages de façon statique sur le réseau CDN mondial.

---

© 2026 **Lonside Studio** — Tous droits réservés.
