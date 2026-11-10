# Changelog

Toutes les modifications notables apportées à ce projet sont consignées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère aux principes du [Semantic Versioning](https://semver.org/lang/fr/).

---

## [2.0.0] - 2026-11-10

### 🚀 Ajouté (Added)
- **Architecture One-Page Haute Précision :** Refonte intégrale du parcours client en une page d'ingénierie continue (Hero, Manifeste, Méthode 4 phases, 4 Études de cas, Tarifs fermes, FAQ accordéon, Contact).
- **Section d'Origine & d'Artisanat (WhyUsSection) :** Nouveau bloc positionné immédiatement après le Hero et les métriques, inspiré de l'épure éditoriale de Designjoy (cartouche d'atelier sans intermédiaire ni commercial, grand titre avec accent éditorial en italique et sous-texte d'engagement clarifié).
- **SEO & GEO (Generative Engine Optimization) de classe mondiale :**
  - Schémas JSON-LD `Organization`, `WebSite`, `FAQPage` (accordéons interactifs Google SERP) et `OfferCatalog` (`Sprint Launch 6 900 €` et `Sprint Scale 13 900 €`).
  - Intégration du manifeste `public/llms.txt` pour les moteurs de recherche IA (*Perplexity, ChatGPT Search, Claude*).
  - Génération dynamique de carte OpenGraph Edge 1200x630 (`/og?locale=...`) et favicons dynamiques multirésolutions.
  - Balise alternative bilingue avec gestion standard `x-default` dans le `sitemap.ts` et le `<head>`.
  - Directive `robots.ts` optimisée interdisant le crawl Keystatic et autorisant les moteurs d'indexation IA réputés.
- **Sélecteur de Langue Haute Précision :** Composant `LocaleSwitcher` dropdown accessible (FR / EN) avec badge `rounded-xl`, flèche vectorielle, focus ring épuré et synchronisation automatique de l'URL.
- **Tiroir d'Étude de Cas Dynamique (`DossierDrawer`) :**
  - Design à angle droit sans arrondi gauche (`rounded-none`) pour un ancrage architectural net.
  - Animations d'entrée et de sortie fluides avec easing cubique Apple/Linear (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Verrouillage automatique du défilement du corps (`overflow: hidden`), gestion de la touche Échap et fermeture par backdrop.
- **Vidéo Cinématique de Fond :**
  - Composant `StudioAtmosphere` avec fallback silencieux, lecture automatique, boucle infinie et filtre CSS noir et blanc cinématique.
  - Intégration du flux vidéo MP4 `public/videos/hero-ambient.mp4`.
- **Configuration d'Environnement Universelle :**
  - Module centralisé `src/lib/site-config.ts` typé et sécurisé.
  - Support de `NEXT_PUBLIC_CALENDAR_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL` et des liens de réseaux sociaux dans `.env.local` et `.env.example`.
- **Conformité Légale & RGPD Purement Monochrome :**
  - Bandeau de consentement aux cookies `CookieConsent` réécrit en mode clair monochrome sans lueur violette.
  - Bouton flottant de gestion des préférences `CookiePreferenceButton` (`rounded-xl`, monochrome, font mono).
  - Modernisation des fiches YAML légales (`cookies.yaml`, `mentions-legales.yaml`) avec raison sociale Lonside Studio et e-mail officiel.

### 🔄 Modifié (Changed)
- **Harmonisation UI/UX :**
  - Unification de tous les arrondis interactifs sur `rounded-xl` (boutons, badges de statut, conteneurs, formulaires).
  - Typographie display modernisée avec la police variable suisse *Antonio*.
  - Boutons d'action rapides avec `whitespace-nowrap` pour empêcher tout saut de ligne indésirable sur mobile.
  - Cibles tactiles calibrées à un minimum strict de 44x44px conformes WCAG 2.1 AA.
- **Routage Hybride Navbar & Footer :**
  - Sur la page d'accueil (`/` ou `/en`), défilement fluide par ancre avec mise à jour propre de l'URL.
  - Depuis les pages légales ou sous-pages, redirection transparente avec ancre absolue (`/#tarifs`, `/#contact`).
  - Clic sur le logo avec remise à zéro du scroll et purge de l'URL sans rechargement lourd.

### 🗑️ Supprimé (Removed)
- Suppression des composants obsolètes ou dupliqués : `TickerMarquee.tsx`, `HeroAmbientCanvas.tsx`, `FrustrationGrid.tsx`, `FAQ.tsx`, `Badge.tsx`, `Card.tsx`, `SectionHeader.tsx`.
- Éradication des styles et ombres néon violets obsolètes (`brand-purple`, `glow-purple`).
- Suppression du hook redondant `src/hooks/useInView.ts`.

---

## [1.0.0] - 2026-11-05

### 🚀 Ajouté (Added)
- Initialisation du projet Next.js App Router avec TypeScript et Tailwind CSS.
- Configuration du CMS local Keystatic avec collections YAML pour FAQ, Portfolio et Pages Légales.
- Mise en place de l'internationalisation bilingue (`next-intl`) pour le français et l'anglais.
- Formulaire de prise de contact avec protection anti-spam (Honeypot + Rate Limiter) et envoi via Resend API.
- Suite de tests unitaires Vitest et configuration Playwright.
