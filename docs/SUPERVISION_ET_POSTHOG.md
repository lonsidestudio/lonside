# Guide d'Ingénierie de Supervision & Télémétrie PostHog — Studio Lonside

Ce document technique détaille l'architecture de télémétrie, la configuration PostHog, l'interface de supervision et les métriques de santé du studio Lonside.

---

## 1. Architecture du Pipeline Télémétrique

Le studio Lonside utilise une approche **Privacy-First** et **Haute Fidélité** pour sa supervision analytique :

```
Visiteur Lonside (Web)
      │
      ├── Consentement RGPD accordé (localStorage) ?
      │         │
      │         ├── NON  ──> Événements bloqués / SDK en veille (Zéro fuite de données)
      │         │
      │         └── OUI  ──> PostHog Client (Host EU: https://eu.i.posthog.com)
      │                           │
      │                           ├── Assainissement d'URL (Suppression des query strings sensibles)
      │                           ├── Exclusion des routes administratives (/keystatic)
      │                           └── Capture des événements métiers
      │
      └── Journal Télémétrique Local (Buffer circulaire en mémoire pour la supervision en direct)
```

---

## 2. Variables d'Environnement Requises

Dans le tableau de bord Vercel (**Settings** $\rightarrow$ **Environment Variables**) ou dans votre fichier `.env.local` :

| Variable | Exemple | Rôle |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Clé d'API publique du projet PostHog |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` | Hôte d'ingestion européen PostHog Cloud (Défaut : EU) |
| `NEXT_PUBLIC_POSTHOG_DEBUG`| `true` ou `false` | Force l'initialisation du SDK hors production pour tests |
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxx` | Clé d'expédition des formulaires de contact |
| `NEXT_PUBLIC_CONTACT_EMAIL`| `hello@lonside.com` | Email de réception des demandes de cadrage |

---

## 3. Taxonomie Complète des Événements Métiers

Tous les événements sont typés via l'union `LeadEvent` dans `src/lib/posthog.ts` :

| Événement | Déclencheur | Propriétés envoyées | Objectif Business |
| :--- | :--- | :--- | :--- |
| `contact_cta_clicked` | Clic sur un bouton d'action vers le contact | `{ channel: 'contact_anchor' \| 'email' \| 'appointment' }` | Mesurer l'intention de contact |
| `contact_form_started` | Premier focus ou début de frappe dans le formulaire | `{}` | Calculer le taux d'engagement du formulaire |
| `contact_form_submitted` | Envoi réussi de la demande de cadrage | `{}` | Mesurer le taux de conversion final |
| `contact_form_failed` | Erreur lors de l'envoi (réseau, spam, 429) | `{ reason: string }` | Détecter les blocages techniques |
| `dossier_opened` | Ouverture du tiroir de cas client (`DossierDrawer`) | `{ client: string, slug: string, industry: string }` | Identifier les projets phares |
| `dossier_external_clicked`| Clic sur le lien live du client dans le dossier | `{ client: string, url: string }` | Mesurer la curiosité client vers la prod |
| `pricing_tier_selected` | Clic sur le CTA d'un forfait (Launch, Scale, Régie)| `{ tier: string, price: string }` | Identifier l'offre la plus attractive |
| `locale_switched` | Changement de langue | `{ from: 'fr' \| 'en', to: 'fr' \| 'en' }` | Suivre l'audience internationale |
| `supervision_health_checked`| Émission d'un test depuis la console `/status` | `{ source: string, timestamp: string }` | Valider le pipeline PostHog |

---

## 4. Interfaces de Supervision Disponibles

### A. Interface Visuelle Utilisateur : `/status` (ou `/en/status`)
* **URL :** `https://www.lonside.com/status`
* **Rôle :** Tableau de bord public/privé affichant l'état en direct de l'infrastructure Lonside.
* **Fonctionnalités :**
  - Statut global (`100% HEALTHY` ou `ACTION NEEDED`).
  - Diagnostic des 4 services : PostHog, Resend, Vercel Edge & Speed Insights, Moteurs de recherche & IA.
  - **Banc de test interactif :** Bouton pour envoyer un événement de test en direct.
  - **Flux de session en temps réel :** Journalisation visuelle des 50 derniers événements capturés dans le navigateur.
* **Indexation :** Balise `robots: { index: false, follow: false }` pour protéger la confidentialité des données techniques.

### B. Endpoint API Automatisé : `GET /api/supervision`
* **URL :** `https://www.lonside.com/api/supervision`
* **Format :** JSON standardisé `SupervisionReport`.
* **Utilisation :** Idéal pour connecter un robot de surveillance externe (UptimeRobot, Better Uptime, Datadog).

---

## 5. Configuration Recommandée des Tableaux de Bord PostHog Cloud

Connectez-vous sur votre espace [eu.posthog.com](https://eu.posthog.com) et créez les 3 dashboards suivants :

### 📊 Dashboard 1 : Funnel de Conversion Commerciale Studio
1. **Entonnoir de Conversion (Funnels) :**
   * Étape 1 : `$pageview` (Visiteurs de la page d'accueil)
   * Étape 2 : `pricing_tier_selected` ou `dossier_opened` (Intérêt démontré)
   * Étape 3 : `contact_cta_clicked` (Intention d'échange)
   * Étape 4 : `contact_form_started` (Formulaire démarré)
   * Étape 5 : `contact_form_submitted` (Demande de cadrage transmise)
2. **Répartition des Offres Demandées (Pie Chart) :**
   * Événement : `pricing_tier_selected` groupé par `tier`.

### 🔍 Dashboard 2 : Intelligence & Engagement Portfolio
1. **Top Projets les Plus Consultés (Bar Chart) :**
   * Événement : `dossier_opened` groupé par `client`.
2. **Vérification de Preuve Client (Table) :**
   * Événement : `dossier_external_clicked` groupé par `client`.

### 🛠️ Dashboard 3 : Supervision Technique & Qualité
1. **Santé du Formulaire de Contact :**
   * Comparaison temporelle : `contact_form_submitted` vs `contact_form_failed`.
2. **Répartition Géographique & Linguistique :**
   * Événement `$pageview` filtré par pays et langue (`locale_switched`).

---

## 6. Vérification & Tests de Non-Régression

Toute modification apportée à la télémétrie ou aux services de supervision est automatiquement validée par la suite de tests :

```bash
# Exécuter les 15 tests d'intégrité (analytics, SEO, marque, supervision)
npm test

# Vérifier la compilation stricte TypeScript
npx tsc --noEmit

# Vérifier le build de production et le pré-rendu SSG (21/21 pages)
npm run build
```
