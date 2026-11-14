<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Guide d'Ingénierie, Directives Architecturales & Standards SEO — Studio Lonside

Ce document constitue la **spécification obligatoire et permanente** pour tout agent d'intelligence artificielle (Claude Code, Cursor, Copilot, Antigravity) et tout développeur intervenant sur le dépôt `lonside`.

> [!IMPORTANT]
> **Le SEO, la sécurité, l'accessibilité et la cohérence de marque ne sont pas des tâches ponctuelles mais des exigences de qualité logicielle continues.**
> Tout ajout de page, de composant, de route API, d'article ou de module SaaS doit se conformer strictement à ces règles sous peine de rejet par la suite de tests (`npm test`).

---

## 1. Identité de Marque & Positionnement Non-Négociables

1. **Dénomination officielle :**
   - Marque : **Lonside**
   - Raison sociale / Désignation complémentaire : **Lonside Studio**
   - Organisation GitHub officielle : `https://github.com/lonsidestudio`
   - Email officiel de contact : `hello@lonside.com`
   - Domaine officiel : `https://www.lonside.com` (avec sous-domaine `www` canonique obligatoire).

2. **Interdiction Formelle du terme « Agence » :**
   - **RÈGLE STRICTE :** Ne JAMAIS utiliser le mot « agence » ou « agences » pour désigner Lonside dans le code, le texte, les métadonnées, les schémas ou la documentation.
   - Utiliser exclusivement les termes : **« studio »**, **« studio indépendant »** ou **« atelier »** (e.g. *« Studio indépendant de conception et d'édition logicielle »*).
   - Cette règle est validée automatiquement par le test d'intégrité `npm test`.

3. **Direction Artistique & Esthétique Haute Horlogerie :**
   - Palette : Strictement monochrome, minimaliste et cinématique (`#ffffff` pour le fond, `#000000` pour le texte principal, nuances de zinc `zinc-50` à `zinc-800` pour les bordures et détails).
   - Typographies officielles :
     - **Titres & Display :** `Antonio` (majuscules, tracking serré, élégance horlogère).
     - **Corps de texte :** `Inter` (lisibilité optimale, rendu net).
     - **Données, métriques & code :** `Geist Mono` (précision technique).
   - Les modifications UI ne doivent JAMAIS régresser le style graphique ou ajouter des couleurs non conformes.

---

## 2. Architecture des URLs & Routage International (Next.js 16 App Router)

Le site utilise `next-intl` avec la stratégie `localePrefix: 'as-needed'`.

1. **Structure des URLs Canoniques (200 OK Direct) :**
   - Accueil Français (langue par défaut) : `https://www.lonside.com/` (avec trailing slash canonique).
   - Accueil Anglais : `https://www.lonside.com/en`.
   - Pages légales françaises : `/legal/mentions-legales`, `/legal/politique-confidentialite`, `/legal/cgv`, `/legal/cookies`.
   - Pages légales anglaises : `/en/legal/legal-notice`, `/en/legal/privacy-policy`, `/en/legal/terms-of-sale`, `/en/legal/cookie-policy`.
   - **Interdiction absolue** de générer des URLs intermédiaires comme `/fr/legal/...` qui renvoient des redirections 308/307.

2. **Bypass du Middleware (`src/proxy.ts`) :**
   - Tout asset statique dynamique ou endpoint technique Next.js (`/icon`, `/apple-icon`, `/og`, `/manifest.webmanifest`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/api/*`) **doit impérativement être exclu** du matcher de `proxy.ts`.
   - Si une nouvelle route technique sans extension est créée, elle doit être ajoutée dans la regex de négation du matcher sous peine de 404 en production.

3. **Redirections 301 sans chaînes de redirection (`next.config.ts`) :**
   - Toute redirection d'ancienne URL doit pointer **directement en un seul saut (0 hop)** vers la destination finale (`/#tarifs`, `/en#tarifs`, etc.), sans passer par un préfixe `/fr` qui déclencherait un saut 307 supplémentaire.

---

## 3. Contrat Qualité SEO pour Toute Nouvelle Page ou Produit SaaS

Toute nouvelle route ou page doit respecter les 5 piliers suivants :

### 3.1. Métadonnées Exhaustives (`generateMetadata`)
Chaque page doit exporter une fonction `generateMetadata` définissant :
- `title` : concis, descriptif, avec le nom de marque `— Lonside Studio`.
- `description` : 140 à 160 caractères, percutante et orientée conversion.
- `alternates.canonical` : URL absolue canonique complète (e.g. `https://www.lonside.com/...`).
- `alternates.languages` : dictionnaire `fr`, `en` et `x-default` (pointant vers la version FR).
- `openGraph` : titre, description, URL canonique, `siteName: 'Lonside Studio'`, image OG avec locale.
- `twitter` : `card: 'summary_large_image'`, titre, description, image OG.

### 3.2. Schémas Structurés JSON-LD (Schema.org)
- **Toute page de contenu :** Balisage `WebPage` lié au `WebSite` officiel (`https://www.lonside.com/`) et à l'organisation éditrice `Organization` (`Lonside Studio`).
- **Pages secondaires & légales :** Balisage `BreadcrumbList` indiquant la hiérarchie (`Accueil` $\rightarrow$ `Titre de la page`).
- **Nouveau Produit SaaS :** Balisage `SoftwareApplication` (nom, description, applicationCategory, operatingSystem, offers).
- **Article de blog / Livre blanc futur :** Balisage `TechArticle` ou `Article` avec auteur, date de publication, image et éditeur.

### 3.3. Intégration Systématique dans `sitemap.ts`
- Dès qu'une nouvelle page publique est créée, elle **doit être enregistrée** dans le tableau `ROUTES` de `src/app/sitemap.ts`.
- Indiquer un `priority` cohérent (1.0 pour l'accueil, 0.7-0.8 pour les produits/pages piliers, 0.3 pour le légal).
- Vérifier que l'URL ajoutée renvoie un code HTTP 200 immédiat.

### 3.4. Pages d'Erreur & 404
- Toute page d'erreur (`not-found.tsx`, `error.tsx`) doit explicitement définir `robots: { index: false, follow: false }` pour interdire toute indexation par les moteurs.

---

## 4. Accessibilité & Web Performance (WCAG 2.1 AA & Core Web Vitals)

1. **Cibles Tactiles Mobiles (Touch Targets) :**
   - Tout élément interactif (bouton, lien, burger menu, sélecteur de langue) doit faire **au minimum $44 \times 44\text{px}$** (ou disposer d'un espacement garantissant la zone tactile selon WCAG 2.5.5 / 2.5.8).
2. **Contraste Typographique :**
   - Ratio minimum de 4.5:1 pour le texte courant sur fond blanc/zinc.
   - Les textes secondaires doivent utiliser `zinc-500` au minimum pour garantir une lisibilité sans effort.
3. **Optimisation des Polices :**
   - Utiliser exclusivement `next/font/google` (`display: 'swap'`). Zéro appel vers des CDN Google Fonts externes afin d'éviter les requêtes réseau bloquantes et respecter le RGPD.
4. **Optimisation des Images :**
   - Utiliser les formats modernes AVIF et WebP.
   - Spécifier systématiquement les dimensions (`width`, `height`) ou le layout `fill` avec un attribut `alt` descriptif et signifiant.

---

## 5. Sécurité & Protection des Formulaires

1. **En-têtes de Sécurité :**
   - Maintenir les headers définis dans `next.config.ts` : HSTS (prod), X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, CSP stricte.
2. **Route Contact & Formulaires API :**
   - Validation stricte des entrées via **Zod** (`name`, `email`, `message`).
   - Mécanisme anti-spam **Honeypot** silencieux (champ `_trap`).
   - **Rate Limiting** par adresse IP (3 requêtes par minute maximum).

---

## 6. Pipeline de Contrôle Qualité Obligatoire (Quality Gate)

Avant de soumettre une Pull Request ou de committer des modifications, **exécutez obligatoirement la séquence suivante** :

```bash
# 1. Validation de l'intégrité SEO, analytics et identité de marque
npm test

# 2. Vérification statique des types TypeScript
npx tsc --noEmit

# 3. Compilation de production Next.js et vérification du pré-rendu statique (SSG)
npm run build
```

> ⚠️ **Tout échec à l'une de ces étapes bloque immédiatement la livraison.**
