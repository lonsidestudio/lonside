# 📦 Lonside — Spécification Officielle : Le Pack de Livraison & Protocole de Handover

**Version :** 1.0  
**Statut :** Protocole officiel de livraison  
**Dernière mise à jour :** Novembre 2026  
**Audience :** Clients Lonside, Lead Developers & Direction  

---

## 1. Philosophie : La Dignité de la Livraison

Pour la majorité des agences, la fin d'un projet est un soulagement bâclé : envoi d'identifiants par email, code non documenté et départ précipité.

Chez Lonside, **le moment de la livraison est le point culminant de notre promesse**. C'est l'instant où nous transférons un actif technologique de haute valeur, immédiatement exploitable et valorisable auprès d'investisseurs ou d'équipes internes.

---

## 2. L'Inventaire Exhaustif du Pack Handover

Le jour J (Jour 14 pour le Sprint Launch, Jour 30 pour le Sprint Scale), le client reçoit l'accès à son **Dossier de Propriété Numérique** comprenant les 6 livrables certifiés :

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LE PACK HANDOVER LONSIDE                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Cession de Propriété Git        : Droits 'Owner' transférés         │
│ 2. Walkthrough Vidéo Haute Clarté  : Vidéo Loom de 15 minutes          │
│ 3. Dictionnaire de Données & ERD   : Schéma relationnel interactif     │
│ 4. Attestation QA & Tests          : Rapport Vitest & Playwright e2e   │
│ 5. Guide d'Onboarding Développeur  : Test des 120 minutes certifié     │
│ 6. Certificat de Garantie 24h      : Couverture 30 ou 45 jours         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Détail des 6 Livrables Officiels

### Livrable 1 : Le Protocole de Transfert de Propriété (Zero Lock-in)
* **Dépôt Git privé :** L'organisation GitHub ou GitLab du client est promue `Owner`. Lonside rétrograde ses propres accès en simple contributeur ou se retire totalement.
* **Comptes Cloud & Services :**
  * Projet **Vercel** transféré sur l'équipe Vercel du client.
  * Instance **Supabase** transférée sur le compte de facturation du client.
  * Webhooks **Stripe** pointant sur les clés de production du client.
* **Cession de Propriété Intellectuelle (IP) :** Attestation juridique signée transférant l'ensemble des droits patrimoniaux sur le code source et les assets.

### Livrable 2 : Le Walkthrough Vidéo de 15 Minutes (Loom)
Une vidéo HD enregistrée par le Lead Developer en charge du projet, découpée en chapitres précis :
* *00:00 - 03:00 :* Vue d'ensemble de l'architecture et logique des dossiers (`src/domains/*`).
* *03:00 - 07:00 :* Modèle de données Supabase, tables critiques et règles de sécurité RLS.
* *07:00 - 11:00 :* Tunnel de paiement Stripe, gestion des webhooks et des plans d'abonnement.
* *11:00 - 15:00 :* Comment ajouter une nouvelle fonctionnalité ou modifier un texte en autonomie.

### Livrable 3 : Dictionnaire de Données & Schéma Relationnel (ERD)
* Un schéma visuel exporté en format vectoriel (SVG/Mermaid) représentant l'ensemble des tables PostgreSQL, clés primaires, clés étrangères et index.
* Un dictionnaire documentant chaque colonne et son utilité métier (ex: statut des commandes, flags d'annulation, rôles utilisateurs).

### Livrable 4 : Attestation de Qualité & Rapport de Tests (QA Badge)
* **Rapport de couverture de code :** Relevé officiel Vitest attestant d'une couverture $\ge 80\%$ sur la logique critique.
* **Rapport Playwright e2e :** Vidéo d'exécution sans faille des tests de parcours utilisateur complets.
* **Audit de performance Google Lighthouse :** Score certifié vert ($\ge 95/100$) sur le SEO, l'Accessibilité et la Vitesse.

### Livrable 5 : Le Guide d'Onboarding Développeur (Le Test des 120 Minutes)
Le fichier `README.md` racine de l'application est rédigé selon un standard international irréprochable :
```bash
# 1. Cloner le dépôt privé
git clone git@github.com:votre-entreprise/votre-projet.git

# 2. Installer les dépendances avec pnpm
pnpm install

# 3. Lancer l'environnement local (BDD + Frontend)
pnpm dev
```
* **L'engagement Lonside :** Tout développeur senior recruté par le client est autonome et opérationnel sur la base de code en **moins de 2 heures chrono**.

### Livrable 6 : Le Certificat de Garantie Corrective sous 24h
Un document d'engagement juridique précisant :
* **Durée de couverture :** 30 jours calendaires (Sprint Launch) ou 45 jours (Sprint Scale).
* **SLA de prise en charge :** Tout dysfonctionnement ou bug constaté sur le périmètre validé est pris en charge sous 4h et corrigé sous 24h ouvrées, **sans aucun frais supplémentaire**.

---

## 4. Le Rituel de Clôture : La Réunion de Passation (45 minutes)

Le jour de la livraison, un échange de célébration et de passation technique est planifié :
1. **Démonstration finale live** en présence des décideurs du client.
2. **Exécution du premier paiement réel** (1 € de test sur Stripe) pour valider la chaîne de valeur en direct.
3. **Remise solennelle du Handover Pack.**
4. **Présentation sans pression des options de continuité** (Maintenance Sérénité ou Régie d'Immersion Squad).

