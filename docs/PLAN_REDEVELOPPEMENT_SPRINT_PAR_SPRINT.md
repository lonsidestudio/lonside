# 🗺️ Lonside — Plan Directeur de Redéveloppement Sprint par Sprint (De Zéro à la Production)

**Version :** 1.0 (Master Execution Roadmap)  
**Date :** Novembre 2026  
**Audience :** Direction Lonside, Lead Developers, Designers & Product Owners  
**Statut :** Document Cadre de Suivi d'Exécution et d'Évolution Continue  

---

## 📋 Table des Matières

1. [La Vision Unifiée du Projet](#1-la-vision-unifiée-du-projet)
2. [Matrice Globale des 6 Sprints d'Exécution](#2-matrice-globale-des-6-sprints-dexécution)
3. [Sprint 0 : Fondations, Purge Intégrale & Clean Slate](#3-sprint-0--fondations-purge-intégrale--clean-slate)
4. [Sprint 1 : CMS Git-Backed & Cœur de Données Résilient](#4-sprint-1--cms-git-backed--cœur-de-données-résilient)
5. [Sprint 2 : Système de Design Noir & Blanc Haute Couture & Primitives Tactiles](#5-sprint-2--système-de-design-noir--blanc-haute-couture--primitives-tactiles)
6. [Sprint 3 : Assemblage de la Page Unique Maîtresse (Les 7 Blocs Narratifs)](#6-sprint-3--assemblage-de-la-page-unique-maîtresse-les-7-blocs-narratifs)
7. [Sprint 4 : Dépréciation des Anciennes Routes, Redirections 301 & SEO d'Élite](#7-sprint-4--dépréciation-des-anciennes-routes-redirections-301--seo-délite)
8. [Sprint 5 : Assurance Qualité, Benchmarks Web Vitals & Mise en Production](#8-sprint-5--assurance-qualité-benchmarks-web-vitals--mise-en-production)
9. [Feuille de Route des Évolutions Futures (Roadmap Post-Prod)](#9-feuille-de-route-des-évolutions-futures-roadmap-post-prod)
10. [Tableau de Bord de Suivi de l'Avancement (Checklist Live)](#10-tableau-de-bord-de-suivi-de-lavancement-checklist-live)

---

## 1. La Vision Unifiée du Projet

Ce plan de redéveloppement concrétise l'ensemble des analyses consignées dans le dossier [`docs/`](file:///c:/Users/KevinTSAGUE/project/lonside/docs/) :
* **Stratégie Commerciale :** Modèle mono-spécialité à deux formats fermés (**Sprint Launch 14j** à 6 900 € HT et **Sprint Scale 30j** à 13 900 € HT), complétés par la **Régie d'Immersion Squad** pour la continuité post-sprint.
* **Marketing & Copywriting :** Modèle **Dual-Layer** (clarté humaine et émotionnelle pour le CEO, couplée à un tiroir technique d'autorité pour le CTO), avec dé-jargonisation totale et manifeste anti-agence.
* **Direction Artistique :** Esthétique **Noir & Blanc Haute Couture** inspirée de *WheelOfWork* et *DesignJoy* (typographie condensée monumentale, vidéo cinématique ralentie en arrière-plan, grain argentique 35mm et finitions métalliques).
* **Architecture Produit :** **Single-Page Studio** sans rechargement de page, avec exploration immersive des études de cas via tiroirs latéraux ([`DossierDrawer.tsx`](file:///c:/Users/KevinTSAGUE/project/lonside/src/components/DossierDrawer.tsx)).
* **Gestion Éditoriale :** Console visuelle **Keystatic Git-Backed** permettant aux collaborateurs non-techniciens d'éditer les projets et la FAQ en production sans toucher à Git.

---

## 2. Matrice Globale des 6 Sprints d'Exécution

```mermaid
gantt
    title Plan de Redéveloppement Lonside (De Zéro à la Prod)
    dateFormat  X
    axisFormat  Sprint %s
    
    section Socle & Données
    Sprint 0 : Fondations & Purge du Dead Code      :active, s0, 0, 1
    Sprint 1 : CMS Git-Backed & Données Résilientes :s1, 1, 2
    
    section Expérience & UI
    Sprint 2 : Design System Noir & Blanc + Drawer  :s2, 2, 3
    Sprint 3 : Assemblage Page Unique (7 Blocs)     :s3, 3, 4
    
    section Clôture & Lancement
    Sprint 4 : Redirections 301 & SEO d'Élite       :s4, 4, 5
    Sprint 5 : QA, Lighthouse 100/100 & Prod Vercel :s5, 5, 6
```

---

## 3. Sprint 0 : Fondations, Purge Intégrale & Clean Slate

### 3.1 Objectifs du Sprint
Éradiquer la totalité de la dette technique accumulée, supprimer les composants orphelins (~75 KB de dead code), assainir les dépendances et verrouiller un socle propre.

### 3.2 Tâches Détaillées
- [ ] **Suppression des composants orphelins :**
  - Supprimer [`src/components/AgentTerminal.tsx`](file:///c:/Users/KevinTSAGUE/project/lonside/src/components/AgentTerminal.tsx) (faux terminal d'IA orphelin).
  - Supprimer [`src/components/FlagshipOffers.tsx`](file:///c:/Users/KevinTSAGUE/project/lonside/src/components/FlagshipOffers.tsx) (composant monolithique obsolète).
  - Supprimer [`src/components/ServicesGrid.tsx`](file:///c:/Users/KevinTSAGUE/project/lonside/src/components/ServicesGrid.tsx) (grille obsolète).
  - Supprimer [`src/components/CostEstimator.tsx`](file:///c:/Users/KevinTSAGUE/project/lonside/src/components/CostEstimator.tsx) (doublon de 1000 lignes).
  - Supprimer le dossier vide `scripts/`.
- [ ] **Assainissement des dépendances & Sentry :**
  - Retirer `@sentry/nextjs` du `package.json` et supprimer `sentry.*.config.ts` (ou configurer un vrai DSN valide).
  - Exécuter `pnpm install` pour figer le lockfile assaini.
- [ ] **Purge du faux blog d'IA :**
  - Supprimer le dossier `content/blog/` (articles génériques sans valeur).

### 3.3 Critères de Validation (Definition of Done)
* `pnpm build` s'exécute sans aucun warning lié aux composants supprimés.
* Le dossier `src/components/` ne contient plus aucun fichier orphelin.

---

## 4. Sprint 1 : CMS Git-Backed & Cœur de Données Résilient

### 4.1 Objectifs du Sprint
Permettre aux personnes non-techniques de modifier les contenus en toute autonomie via une interface visuelle épurée sur `/keystatic`, tout en assurant une compilation statique pure côté Next.js.

### 4.2 Tâches Détaillées
- [ ] **Réécriture de `keystatic.config.ts` :**
  - Configurer le mode de stockage dynamique : `local` en développement, `github` en production.
  - Supprimer toutes les collections mortes (blog, mentions, etc.).
  - Ne conserver que les collections essentielles : `portfolio` (les 4 projets d'élite) et `faq` (questions-réponses).
- [ ] **Validation des Fiches Projets YAML :**
  - Consolider `content/portfolio/michi.yaml` (Supply Chain & Algorithmes).
  - Consolider `content/portfolio/bely.yaml` (Dispatch VTC & Temps Réel).
  - Consolider `content/portfolio/welqo.yaml` (PropTech & Conciergerie).
  - Consolider `content/portfolio/weedin.yaml` (EventTech & Billetterie).
- [ ] **Création du Reader Typé :**
  - Créer `src/lib/keystatic/reader.ts` avec inférence de types Zod stricte pour sécuriser la lecture des données dans les Server Components.

### 4.3 Critères de Validation (Definition of Done)
* Accès à `/keystatic` fonctionnel localement avec interface en français.
* Les modifications d'une étude de cas dans le CMS sont immédiatement répercutées dans les fichiers YAML.

---

## 5. Sprint 2 : Système de Design Noir & Blanc Haute Couture & Primitives Tactiles

### 5.1 Objectifs du Sprint
Faire disparaître définitivement le "violet SaaS fade" au profit d'une direction artistique d'autorité inspirée de *WheelOfWork* et *DesignJoy*.

### 5.2 Tâches Détaillées
- [ ] **Typographie Monumentale :**
  - Configurer la police Display Condensée (style TT Trailers / Syne / Monument) dans `src/app/layout.tsx` et `globals.css`.
  - Configurer la police Monospace d'ingénieur pour les métriques et métadonnées.
- [ ] **Palette Monochrome & Textures :**
  - Remplacer tous les styles violets (`brand-purple`) par les codes Noir Pur (`#000000`), Blanc Titane (`#F8FAFC`) et bordures verre (`white/10`).
  - Implémenter le composant de grain argentique `BrandNoise.tsx` (texture film 35mm).
  - Préparer le conteneur vidéo cinématique monochrome ralentie pour le Hero.
- [ ] **Refonte du Composant `DossierDrawer.tsx` :**
  - Styliser le tiroir latéral en Noir & Blanc Haute Couture (backdrop-blur, typographie soignée, badges d'ingénierie, bouton de fermeture fluide).
- [ ] **Création des Composants Tactiles :**
  - Implémenter le ruban continu défilant `TickerMarquee.tsx`.
  - Implémenter le badge d'état live avec pastille verte pulsante (`#10B981`).

### 5.3 Critères de Validation (Definition of Done)
* Le design system n'utilise plus aucune couleur en dehors du noir, blanc, gris acier et du vert signal.
* Le composant `DossierDrawer` s'ouvre et se ferme avec une animation à 60fps sans lag.

---

## 6. Sprint 3 : Assemblage de la Page Unique Maîtresse (Les 7 Blocs Narratifs)

### 6.1 Objectifs du Sprint
Construire la nouvelle page d'accueil maîtresse (`src/app/[locale]/page.tsx`) intégrant les 7 sections dans un flux narratif ininterrompu.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. NAVBAR MINIMALISTE    : [ Lonside ]  Projets • Méthode • Tarifs • FAQ    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. HERO MONUMENTAL       : Titre condensé + Vidéo cinématique + Ticker      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. SHOWCASE PROJETS      : Grille 4 projets + Tiroir interactif DossierDrawer│
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. LA MÉTHODE EN 3 TEMPS : 01. Cadrage → 02. Staging Live → 03. Livrable     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. GRILLE TARIFAIRE      : Sprint Launch (14j) vs Scale (30j) + Tiroir CTO  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. CONTINUITÉ & RÉGIE    : Bandeau Immersion Squad & Maintenance            │
├─────────────────────────────────────────────────────────────────────────────┤
│ 7. MANIFESTE, FAQ & CTA  : Démolition des objections + Réservation Cal.com  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Tâches Détaillées
- [ ] **Bloc 1 : Header / Navbar Ultra-Minimaliste :**
  - Réduire `Navbar.tsx` à 4 ancres lisses (`#projets`, `#methode`, `#tarifs`, `#faq`) + 1 CTA unique vers `#contact`.
- [ ] **Bloc 2 : Hero Section :**
  - Titre monumental condensé + Vidéo monochrome en background + HUD des 4 métriques.
- [ ] **Bloc 3 : Showcase Projets :**
  - Grille des 4 projets avec cartes haute couture déclenchant le `DossierDrawer`.
- [ ] **Bloc 4 : Méthode Commando :**
  - 3 cartes horizontales métalliques décrivant le déroulement chronologique.
- [ ] **Bloc 5 : Tarifs Fermés & Tiroir CTO (Dual-Layer) :**
  - Carte **Sprint Launch (14j - 6 900 €)** & Carte **Sprint Scale (30j - 13 900 €)**.
  - Accordéon dépliable sous chaque carte avec les specs d'ingénierie pour CTO.
- [ ] **Bloc 6 : Continuité & Régie :**
  - Section valorisant le maintien du Lead Dev Lonside dans la squad client.
- [ ] **Bloc 7 : Manifeste, FAQ & Contact :**
  - Accordéons de FAQ tranchée + Widget Cal.com (ou formulaire en 3 champs connecté à l'API Resend).

### 6.3 Critères de Validation (Definition of Done)
* Toute la traversée de vente s'effectue sans aucun rechargement de page.
* Les ancres de la Navbar font défiler la page de façon fluide (*smooth scroll*).

---

## 7. Sprint 4 : Dépréciation des Anciennes Routes, Redirections 301 & SEO d'Élite

### 7.1 Objectifs du Sprint
Supprimer physiquement les 59 anciennes routes superflues et mettre en place les redirections permanentes 301 pour transférer 100% de la puissance SEO sur la page maîtresse.

### 7.2 Tâches Détaillées
- [ ] **Suppression des répertoires de routes obsolètes :**
  - Supprimer `src/app/[locale]/services/` (et toutes ses sous-pages).
  - Supprimer `src/app/[locale]/methode/`.
  - Supprimer `src/app/[locale]/estimation/`.
  - Supprimer `src/app/[locale]/a-propos/`.
- [ ] **Configuration des Redirections 301 dans `next.config.ts` :**
  ```typescript
  async redirects() {
    return [
      { source: '/services', destination: '/#tarifs', permanent: true },
      { source: '/services/:slug', destination: '/#tarifs', permanent: true },
      { source: '/methode', destination: '/#methode', permanent: true },
      { source: '/estimation', destination: '/#tarifs', permanent: true },
      { source: '/a-propos', destination: '/#manifeste', permanent: true },
      { source: '/portfolio/:slug', destination: '/#projets', permanent: true },
    ];
  }
  ```
- [ ] **Pelliculage SEO & Données Structurées :**
  - Intégrer les balises OpenGraph, Twitter Cards et le schéma JSON-LD `ProfessionalService` sur la page maîtresse.
  - Mettre à jour dynamique `src/app/sitemap.ts` et `src/app/robots.ts`.
- [ ] **Purge Radicale de `fr.json` & `en.json` :**
  - Réduire les fichiers de traduction de 1 929 lignes à moins de 250 lignes (7 sections uniquement).

### 7.3 Critères de Validation (Definition of Done)
* Le build Next.js ne génère plus que **1 seule route applicative maîtresse** au lieu des 59 précédentes.
* Chaque ancienne URL redirige instantanément en HTTP 301 vers l'ancre correspondante de la page d'accueil.

---

## 8. Sprint 5 : Assurance Qualité, Benchmarks Web Vitals & Mise en Production

### 8.1 Objectifs du Sprint
Auditer la vitesse, la sécurité et la robustesse mobile pour garantir une note de 100/100 partout avant déploiement officiel.

### 8.2 Tâches Détaillées
- [ ] **Audit Google Lighthouse (Mobile & Desktop) :**
  - Performance $\ge 98/100$, Accessibilité $100/100$, Bonnes Pratiques $100/100$, SEO $100/100$.
  - First Contentful Paint (FCP) $< 0.5$s, Largest Contentful Paint (LCP) $< 0.8$s, Cumulative Layout Shift (CLS) $= 0.000$.
- [ ] **Vérification Sécurité & En-Têtes HTTP :**
  - Valider la Content Security Policy (CSP), le blocage d'iFrame et le HSTS.
  - Vérifier l'étanchéité du formulaire de contact (rate-limit et honeypot actif).
- [ ] **Contrôle Responsive Multi-Device :**
  - Tester sur écran mobile 375px (iPhone standard), 768px (iPad) et 1440px (Desktop).
- [ ] **Déploiement Vercel & Vérification des Variables d'Environnement :**
  - Configurer les clés `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL` sur Vercel Production.

### 8.3 Critères de Validation (Definition of Done)
* Mise en production effective sans aucune erreur console.
* Le test du premier e-mail de contact via Resend aboutit en moins de 3 secondes.

---

## 9. Feuille de Route des Évolutions Futures (Roadmap Post-Prod)

Une fois la version 1.0 du Studio One-Page en ligne et validée par le marché, voici les évolutions prévues par ordre de priorité :

```
┌────────────────────────────────────────────────────────────────────────┐
│                   ROADMAP ÉVOLUTIVE LONSIDE (V1.1 - V2.0)              │
├────────────────────────────────────────────────────────────────────────┤
│ V1.1 : Simulateur de Cadrage Interactif en Drawer (Quick Estimator)    │
│        Un configurateur léger en 3 clics intégré dans un tiroir        │
│        latéral pour orienter instantanément vers Launch ou Scale.      │
│                                                                        │
│ V1.2 : Activation de Keystatic GitHub Cloud en Multi-Collaborateurs    │
│        Invitation de rédacteurs externes avec droits restreints sur    │
│        les fiches de projets et la FAQ.                                │
│                                                                        │
│ V1.3 : Internationalisation Étendue (EN & DE)                          │
│        Déploiement de la version anglophone complète pour adresser     │
│        les marchés UK, US et Nordics.                                  │
│                                                                        │
│ V2.0 : Espace Client Privé Lonside (The Sprint Portal)                 │
│        Portail d'onboarding où le client suit le compte à rebours,     │
│        accède à sa Staging Vercel et valide les jalons en temps réel.   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Tableau de Bord de Suivi de l'Avancement (Checklist Live)

Ce tableau sert d'indicateur d'avancement pour chaque étape du projet :

| Sprint | Domaine | Statut Actuel | Validation Finale |
| :--- | :--- | :--- | :--- |
| **Sprint 0** | Purge du Dead Code & Nettoyage Dépendances | ⏳ Prêt à exécuter | [ ] Validé |
| **Sprint 1** | Keystatic CMS Git-Backed & Reader Typé | ⏳ Prêt à exécuter | [ ] Validé |
| **Sprint 2** | Design System Noir & Blanc + DossierDrawer | ⏳ Prêt à exécuter | [ ] Validé |
| **Sprint 3** | Assemblage de la Page Unique (7 Blocs) | ⏳ Prêt à exécuter | [ ] Validé |
| **Sprint 4** | Redirections 301 & Purge i18n | ⏳ Prêt à exécuter | [ ] Validé |
| **Sprint 5** | Audit Lighthouse 100/100 & Mise en Prod | ⏳ Prêt à exécuter | [ ] Validé |

