# Release Notes — Lonside Studio v2.0.0

**Version :** `2.0.0`  
**Date de publication :** 10 Novembre 2026  
**Statut :** Production Ready  
**Plateforme :** Next.js 16 (Turbopack) / React 19 / TypeScript 5 / Tailwind CSS v4

---

## 🎯 Résumé Exécutif

La version **2.0.0** marque le repositionnement stratégique et la refonte technique intégrale de **Lonside** en studio d'ingénierie logicielle et développement web haute vélocité. 

Inspirée des références mondiales du design et de l'ingénierie numérique (*Linear, Work & Co, MetaLab, Stripe*), cette version livre une plateforme unifiée alliant **vitesse d'exécution**, **tarification forfaitaire sans dépassement**, **souveraineté totale du code** et **standards d'accessibilité et de performance de niveau Silicon Valley**.

---

## 💎 Nouveautés Majeures

### 1. Parcours Client One-Page Haute Précision
- **Architecture unifiée :** Suppression de la navigation éclatée au profit d'une expérience linéaire et rythmée structurée en 7 sections stratégiques :
  1. **Hero Studio :** Accroche frontale, statut de disponibilité temps réel, boutons d'action rapide vers le calendrier de réservation et les études de cas.
  2. **Manifeste & Vision :** Antithèse des dérives d'agences traditionnelles, engagement de cession immédiate du code sur le dépôt GitHub client.
  3. **Méthode Commando en 4 Phases :** Cadrage (J1-J2), Sprint d'Ingénierie (J3-J12), QA & Tests (J13), Livraison & Déploiement (J14).
  4. **Études de Cas Industrielles (Work) :** Présentation des produits développés (*Welqo, Weedin, Bely, Michi*), KPI mesurables et ouverture instantanée des dossiers techniques.
  5. **Tarifs & Forfaits Fermes :** Comparateur direct entre *Sprint Launch (14 jours, 6 900 €)* et *Sprint Scale (30 jours, 13 900 €)* avec clause contractuelle de pénalité en cas de retard.
  6. **FAQ Interactive :** Accordéons répondant aux 8 interrogations clés des fondateurs.
  7. **Contact Direct :** Prise de rendez-vous immédiate via calendrier synchronisé et formulaire avec protection anti-bot Honeypot.

### 2. Dossier Technique Interactif (`DossierDrawer`)
- Tiroir latéral d'analyse technique sans arrondi gauche (`rounded-none`) pour une esthétique architecturale brute.
- Transitions cinématiques d'entrée et de sortie calibrées à 300 ms avec courbe de Bézier Apple/Linear (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Blocage propre du défilement de l'arrière-plan (`body lock`) et fermeture fluide via le bouton d'échappement, la touche clavier `Échap` ou le clic sur le masque sombre.

### 3. SEO & GEO (Generative Engine Optimization)
- **Données Structurées Schema.org :**
  - `Organization` & `WebSite` avec maillage des réseaux sociaux.
  - `FAQPage` pour l'affichage immédiat des questions/réponses dans les résultats enrichis de Google (Rich Snippets).
  - `OfferCatalog` indexant officiellement les offres tarifaires fermes en devise Euro.
- **Manifeste pour IA `public/llms.txt` :** Fichier standardisé permettant aux moteurs conversationnels (*Perplexity, SearchGPT, Claude*) de citer et résumer fidèlement l'offre Lonside.
- **Cartes Sociales Edge (`/og`) :** Génération dynamique côté serveur des images de partage social (1200x630) bilingues.
- **Balises canoniques & multilingues :** Inclusion de la directive `x-default` dans le sitemap et le `<head>` pour un référencement optimal sur les marchés francophones et internationaux.

### 4. Design System & Charte Monochrome
- **Éradication totale du violet :** Suppression des halos, lueurs néon et couleurs fantaisistes au profit d'un noir et blanc strict (`#000000`, `#ffffff`, `#09090b`, `#71717a`).
- **Arrondis uniformisés :** Standardisation sur `rounded-xl` (12px) pour l'intégralité des composants d'action, boutons, étiquettes de statut et boîtes modales.
- **Typographie de précision :** Intégration de la police variable suisse *Antonio* pour les chiffres et titrages d'impact, associée à *Inter* pour le corps de texte et *Geist Mono* pour les données techniques.
- **Ambiance Studio Vidéo :** Intégration d'un arrière-plan vidéo subtil (`StudioAtmosphere`) en noir et blanc avec gestion du mode basse consommation.

### 5. Composant de Langue Dropdown (`LocaleSwitcher`)
- Sélecteur bilingue FR/EN élégant dans la barre de navigation.
- Déclencheur compact avec étiquette de code langue et indicateur vectoriel.
- Menu contextuel accessible avec indicateur de langue active et redirection dynamique d'URL.
- Suppression des doubles bordures et bagues de focus indésirables.

### 6. Paramétrage Environnemental Universel
- Centralisation des configurations critiques dans `src/lib/site-config.ts`.
- Tous les liens externes, de prise de rendez-vous et de contact sont désormais pilotés via des variables d'environnement (`NEXT_PUBLIC_CALENDAR_URL`, `NEXT_PUBLIC_SITE_URL`, etc.).

---

## 🛠️ Corrections & Nettoyage Technique

| Élément | Avant | Après |
| :--- | :--- | :--- |
| **Bandeau Cookies** | Thème sombre avec lueurs violettes `brand-purple` | Carte blanche épurée, toggles noirs, `rounded-xl` |
| **Bouton Préférences** | Arrondi circulaire violet avec ombre néon | Bouton d'angle `rounded-xl` noir monochrome |
| **Composants morts** | 8 fichiers inutilisés (`TickerMarquee`, `Card`, etc.) | Codebase allégée, 0 composant orphelin |
| **Qualité du code** | Alertes ESLint sur entités non échappées | **0 erreur, 0 avertissement** ESLint |
| **Typage TypeScript** | Erreurs de comparaison sur les chemins de navigation | **0 erreur** `tsc --noEmit` en mode strict |
| **Tests** | 7 tests unitaires | **7/7 tests réussis** (100% passants) |
| **Compilation** | Erreur de poids de police variable avec Turbopack | **19/19 pages pré-rendues statiquement** |

---

## 🚀 Guide de Déploiement

### 1. Variables d'Environnement Obligatoires
Assurez-vous que les variables suivantes sont renseignées dans votre interface Vercel / Cloudflare / Coolify :

```bash
NEXT_PUBLIC_SITE_URL="https://lonside.ai"
NEXT_PUBLIC_CALENDAR_URL="https://cal.com/lonside/echange-produit"
NEXT_PUBLIC_CONTACT_EMAIL="contact@lonside.ai"
RESEND_API_KEY="re_..."
CONTACT_NOTIFICATION_EMAIL="contact@lonside.ai"
```

### 2. Commandes de Validation
```bash
npm run lint       # Vérification de conformité du code
npm test           # Exécution des tests unitaires
npm run build      # Build de production Turbopack
```

---

*Lonside Studio — Conçu pour les fondateurs qui ne peuvent pas attendre.*
