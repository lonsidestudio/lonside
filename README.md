# lonside — Digital Engineering Studio

Site web de l'agence **lonside**, un studio d'ingénierie digitale augmentée par l'IA. Stack Next.js 16 + TailwindCSS v4 + next-intl.

---

## Architecture DDD (Domain-Driven Design)

Le projet suit une architecture DDD légère avec une séparation claire entre domaines métier, composants UI et pages.

```
src/
├── app/
│   ├── [locale]/                    # Routes i18n (fr par défaut, en optionnel)
│   │   ├── layout.tsx               # Layout racine avec NextIntlClientProvider
│   │   ├── page.tsx                 # Home
│   │   ├── a-propos/page.tsx        # À propos
│   │   ├── services/
│   │   │   ├── page.tsx             # Liste des services + tableau comparatif
│   │   │   ├── site-vitrine/page.tsx
│   │   │   ├── application-web/page.tsx
│   │   │   ├── automatisation/page.tsx
│   │   │   └── design/page.tsx
│   │   ├── methode/page.tsx         # Processus / Méthodologie
│   │   ├── portfolio/page.tsx       # Réalisations clients
│   │   ├── tarifs/page.tsx          # Configurateur de prix
│   │   ├── blog/
│   │   │   ├── page.tsx             # Index des articles
│   │   │   └── [slug]/page.tsx      # Article dynamique
│   │   ├── contact/page.tsx
│   │   └── legal/
│   │       ├── mentions-legales/page.tsx
│   │       ├── politique-confidentialite/page.tsx
│   │       └── cgv/page.tsx
│   ├── globals.css
│   ├── layout.tsx                   # Root layout (pass-through)
│   ├── not-found.tsx                # Page 404 custom
│   └── sitemap.ts                   # Sitemap dynamique
├── domains/                         # Couche DDD — données et types métier
│   ├── services/   (types.ts, data.ts)
│   ├── portfolio/  (types.ts, data.ts)
│   ├── pricing/    (types.ts, data.ts)
│   └── blog/       (types.ts, data.ts)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx               # Navigation principale (mis à jour)
│   │   └── Footer.tsx               # Pied de page (mis à jour)
│   ├── ui/                          # Composants atomiques
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── SectionHeader.tsx
│   ├── sections/                    # Sections réutilisables
│   │   └── CTABanner.tsx
│   └── (legacy)                     # Composants existants conservés
│       ├── AgentTerminal.tsx
│       ├── CostEstimator.tsx
│       ├── DossierDrawer.tsx
│       ├── FAQ.tsx
│       ├── FrustrationGrid.tsx
│       └── ServicesGrid.tsx
├── lib/
│   ├── i18n/
│   │   ├── config.ts                # Locales disponibles
│   │   ├── request.ts               # Configuration next-intl
│   │   └── messages/
│   │       ├── fr.json              # Traductions françaises
│   │       └── en.json              # Traductions anglaises
│   └── utils.ts
├── hooks/
│   └── useMediaQuery.ts
└── middleware.ts                    # Middleware i18n
```

---

## Démarrage rapide

```bash
# Installation des dépendances
npm install

# Serveur de développement
npm run dev

# Build de production
npm run build

# Lancer la production
npm start
```

Le site sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## Guide i18n

### Langues disponibles

| Locale | Langue   | Préfixe URL |
|--------|----------|-------------|
| `fr`   | Français | aucun (par défaut) |
| `en`   | Anglais  | `/en/...`  |

### Ajouter une langue

1. Ajouter le code locale dans `src/lib/i18n/config.ts` :
   ```typescript
   export const locales = ['fr', 'en', 'de'] as const; // ex: ajout de l'allemand
   ```

2. Créer le fichier de messages dans `src/lib/i18n/messages/de.json` en copiant `fr.json` et en traduisant les valeurs.

3. Redémarrer le serveur de développement.

### Utiliser les traductions dans une page

**Server Component (recommandé) :**
```tsx
import { useTranslations } from 'next-intl';

export default function MyPage() {
  const t = useTranslations('myNamespace');
  return <h1>{t('myKey')}</h1>;
}
```

**Client Component :**
```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('myNamespace');
  return <span>{t('myKey')}</span>;
}
```

---

## Conventions de code

- **Composants** : PascalCase (`MyComponent.tsx`)
- **Hooks** : camelCase préfixé par `use` (`useMediaQuery.ts`)
- **Types** : suffixe `Type` ou `Interface` dans les fichiers `types.ts`
- **Data** : constantes UPPER_CASE dans les fichiers `data.ts`
- **Imports** : alias `@/` pour `src/`
- **CSS** : TailwindCSS v4 uniquement, pas de CSS modules
- **"use client"** : uniquement quand nécessaire (hooks React, event handlers)

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# URL publique du site (pour sitemap et OG)
NEXT_PUBLIC_SITE_URL=https://lonside.ai

# (futur) Resend pour l'envoi d'emails du formulaire de contact
RESEND_API_KEY=re_xxxxxxxx

# (futur) Supabase pour la base de données
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Typage | TypeScript 5 |
| Styles | TailwindCSS v4 |
| i18n | next-intl |
| Animations | Framer Motion |
| Icônes | Lucide React |
| Hébergement | Vercel |
