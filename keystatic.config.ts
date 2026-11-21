import { config, collection, singleton, fields } from '@keystatic/core';

const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO || process.env.KEYSTATIC_GITHUB_REPO;
const [repoOwner, repoName] = (githubRepo || 'KevinTSAGUE/lonside').split('/');

const isProd = process.env.NODE_ENV === 'production' && Boolean(githubRepo);

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: {
          owner: repoOwner,
          name: repoName,
        },
      }
    : { kind: 'local' },
  ui: {
    brand: { name: 'Lonside — Studio Haute Vélocité' },
    navigation: {
      'Contenu Studio': ['portfolio', 'faq'],
      'Conformité Légale': ['mentionsLegales', 'politiqueConfidentialite', 'cgv', 'cookies'],
    },
  },
  collections: {
    portfolio: collection({
      label: 'Études de Cas (Portfolio)',
      slugField: 'slug',
      path: 'content/portfolio/*',
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug Unique (ex: michi)' } }),
        client: fields.text({ label: 'Nom du client / projet' }),
        industryFr: fields.text({ label: "Secteur d'activité (FR)" }),
        industryEn: fields.text({ label: 'Industry / Sector (EN)' }),
        headlineFr: fields.text({ label: 'Accroche (FR)', multiline: true }),
        headlineEn: fields.text({ label: 'Headline (EN)', multiline: true }),
        challengeFr: fields.text({ label: 'Défi client (FR)', multiline: true }),
        challengeEn: fields.text({ label: 'Client Challenge (EN)', multiline: true }),
        solutionFr: fields.text({ label: 'Solution apportée (FR)', multiline: true }),
        solutionEn: fields.text({ label: 'Solution Provided (EN)', multiline: true }),
        clientFeedbackFr: fields.text({ label: 'Retour client détaillé (FR)', multiline: true }),
        clientFeedbackEn: fields.text({ label: 'Detailed Client Feedback (EN)', multiline: true }),
        isProprietary: fields.checkbox({
          label: 'Produit Propriétaire Lonside (Studio Venture)',
          defaultValue: false,
        }),
        studioNoteFr: fields.text({
          label: 'Note du studio Lonside (FR)',
          multiline: true,
        }),
        studioNoteEn: fields.text({
          label: 'Lonside Studio Note (EN)',
          multiline: true,
        }),
        clientNeeds: fields.array(
          fields.object({
            titleFr: fields.text({ label: 'Titre du besoin (FR)' }),
            titleEn: fields.text({ label: 'Title (EN)' }),
            descFr: fields.text({ label: 'Description (FR)', multiline: true }),
            descEn: fields.text({ label: 'Description (EN)', multiline: true }),
          }),
          { label: 'Besoins client', itemLabel: (p) => p.fields.titleFr.value || 'Besoin' }
        ),
        constraints: fields.array(
          fields.object({
            titleFr: fields.text({ label: 'Titre du défi / contrainte (FR)' }),
            titleEn: fields.text({ label: 'Title (EN)' }),
            badgeFr: fields.text({ label: 'Badge / Catégorie (FR)' }),
            badgeEn: fields.text({ label: 'Badge (EN)' }),
            riskFr: fields.text({ label: 'Contrainte subie & Risque (FR)', multiline: true }),
            riskEn: fields.text({ label: 'Constraint & Risk (EN)', multiline: true }),
            resolutionFr: fields.text({ label: 'Arbitrage & Solution Lonside (FR)', multiline: true }),
            resolutionEn: fields.text({ label: 'Resolution & Decision (EN)', multiline: true }),
          }),
          { label: 'Contraintes & Arbitrages', itemLabel: (p) => p.fields.titleFr.value || 'Contrainte' }
        ),
        architectureSummaryFr: fields.text({ label: "Synthèse de l'architecture (FR)", multiline: true }),
        architectureSummaryEn: fields.text({ label: 'Architecture Summary (EN)', multiline: true }),
        services: fields.array(fields.text({ label: 'Service' }), {
          label: 'Services réalisés',
          itemLabel: (p) => p.value,
        }),
        techStack: fields.array(fields.text({ label: 'Technologie' }), {
          label: 'Stack technique',
          itemLabel: (p) => p.value,
        }),
        metrics: fields.array(
          fields.object({
            labelFr: fields.text({ label: 'Label (FR)' }),
            labelEn: fields.text({ label: 'Label (EN)' }),
            valueFr: fields.text({ label: 'Valeur (FR)' }),
            valueEn: fields.text({ label: 'Value (EN)' }),
            deltaFr: fields.text({ label: 'Delta (ex: +300%) (FR)' }),
            deltaEn: fields.text({ label: 'Delta (ex: +300%) (EN)' }),
          }),
          { label: 'Métriques', itemLabel: (p) => p.fields.labelFr.value || 'Métrique' }
        ),
        process: fields.array(
          fields.object({
            dayFr: fields.text({ label: 'Période (ex: Jours 1-5)' }),
            dayEn: fields.text({ label: 'Period (ex: Days 1-5)' }),
            actorFr: fields.text({ label: 'Acteur (FR)' }),
            actorEn: fields.text({ label: 'Actor (EN)' }),
            actionFr: fields.text({ label: 'Action réalisée (FR)', multiline: true }),
            actionEn: fields.text({ label: 'Action realized (EN)', multiline: true }),
          }),
          { label: 'Processus projet', itemLabel: (p) => p.fields.dayFr.value || 'Étape' }
        ),
        testimonialQuoteFr: fields.text({ label: 'Témoignage — Citation (FR)', multiline: true }),
        testimonialQuoteEn: fields.text({ label: 'Testimonial — Quote (EN)', multiline: true }),
        testimonialAuthor: fields.text({ label: 'Témoignage — Auteur' }),
        testimonialRoleFr: fields.text({ label: 'Témoignage — Rôle (FR)' }),
        testimonialRoleEn: fields.text({ label: 'Testimonial — Role (EN)' }),
        deliveryDays: fields.number({ label: 'Délai de livraison (jours)' }),
        coverColor: fields.text({ label: 'Couleur de fond CSS (ex: #1a0a3b)' }),
        liveUrl: fields.text({ label: 'URL live du projet' }),
        youtubeVideoId: fields.text({ label: 'ID vidéo YouTube (optionnel, ex: dQw4w9WgXcQ)' }),
        youtubeTitleFr: fields.text({ label: 'Titre vidéo YouTube (FR)' }),
        youtubeTitleEn: fields.text({ label: 'YouTube Video Title (EN)' }),
        youtubeDuration: fields.text({ label: 'Durée ISO 8601 (ex: PT6M30S)' }),
        storyLeadQuoteFr: fields.text({ label: 'Storytelling — Phrase d’accroche éditoriale (FR)', multiline: true }),
        storyLeadQuoteEn: fields.text({ label: 'Storytelling — Editorial Lead Quote (EN)', multiline: true }),
        storyOpeningFr: fields.text({ label: 'Acte I — Le Point de Rupture (FR)', multiline: true }),
        storyOpeningEn: fields.text({ label: 'Act I — The Inflection Point (EN)', multiline: true }),
        beforeAfter: fields.array(
          fields.object({
            dimensionFr: fields.text({ label: 'Axe opérationnel (FR)' }),
            dimensionEn: fields.text({ label: 'Operational Dimension (EN)' }),
            beforeFr: fields.text({ label: 'Avant Lonside (FR)' }),
            beforeEn: fields.text({ label: 'Before Lonside (EN)' }),
            afterFr: fields.text({ label: 'Après déploiement (FR)' }),
            afterEn: fields.text({ label: 'After Deployment (EN)' }),
          }),
          { label: 'Transformation Avant / Après', itemLabel: (p) => p.fields.dimensionFr.value || 'Transformation' }
        ),
        storyTurningPointFr: fields.text({ label: 'Acte II — Arbitrage Produit : ce que nous avons refusé de construire (FR)', multiline: true }),
        storyTurningPointEn: fields.text({ label: 'Act II — Product Thesis: What We Refused to Build (EN)', multiline: true }),
        storyWalkthroughFr: fields.text({ label: 'Acte III — Le Produit en Action (Scène d’usage réelle) (FR)', multiline: true }),
        storyWalkthroughEn: fields.text({ label: 'Act III — The Product in Motion (Live Scenario) (EN)', multiline: true }),
        storyOutcomeFr: fields.text({ label: 'Acte V — Impact Durable & Après-Lancement (FR)', multiline: true }),
        storyOutcomeEn: fields.text({ label: 'Act V — Lasting Impact & Post-Launch Reality (EN)', multiline: true }),
        productRoles: fields.array(
          fields.object({
            roleFr: fields.text({ label: 'Rôle utilisateur (FR)' }),
            roleEn: fields.text({ label: 'User Role (EN)' }),
            accessLevelFr: fields.text({ label: 'Périmètre / Accès (FR)' }),
            accessLevelEn: fields.text({ label: 'Access Scope (EN)' }),
            workflowFr: fields.text({ label: 'Parcours & valeur quotidienne (FR)', multiline: true }),
            workflowEn: fields.text({ label: 'Daily workflow & value (EN)', multiline: true }),
          }),
          { label: 'Anatomie Produit — Rôles & Parcours', itemLabel: (p) => p.fields.roleFr.value || 'Rôle' }
        ),
        productModules: fields.array(
          fields.object({
            tagFr: fields.text({ label: 'Catégorie module (FR)' }),
            tagEn: fields.text({ label: 'Module Tag (EN)' }),
            titleFr: fields.text({ label: 'Nom du module produit (FR)' }),
            titleEn: fields.text({ label: 'Product Module Name (EN)' }),
            behaviorFr: fields.text({ label: 'Fonctionnement côté utilisateur (FR)', multiline: true }),
            behaviorEn: fields.text({ label: 'User-facing behavior (EN)', multiline: true }),
            businessRuleFr: fields.text({ label: 'Règle métier / sécurité / monétisation (FR)', multiline: true }),
            businessRuleEn: fields.text({ label: 'Business / security / revenue rule (EN)', multiline: true }),
          }),
          { label: 'Anatomie Produit — Modules Clés', itemLabel: (p) => p.fields.titleFr.value || 'Module' }
        ),
        screenshots: fields.array(
          fields.object({
            src: fields.text({ label: 'Chemin image dans /public (ex: /images/portfolio/welqo-1.webp)' }),
            altFr: fields.text({ label: 'Texte alternatif SEO (FR)' }),
            altEn: fields.text({ label: 'SEO Alt Text (EN)' }),
            captionFr: fields.text({ label: 'Légende écran (FR)' }),
            captionEn: fields.text({ label: 'Screen Caption (EN)' }),
          }),
          { label: 'Galerie Captures Produit', itemLabel: (p) => p.fields.captionFr.value || 'Capture' }
        ),
        productFaq: fields.array(
          fields.object({
            questionFr: fields.text({ label: 'Question produit / secteur (FR)' }),
            questionEn: fields.text({ label: 'Product / Sector Question (EN)' }),
            answerFr: fields.text({ label: 'Réponse détaillée (FR)', multiline: true }),
            answerEn: fields.text({ label: 'Detailed Answer (EN)', multiline: true }),
          }),
          { label: 'FAQ Produit & Sectorielle', itemLabel: (p) => p.fields.questionFr.value || 'Question' }
        ),
        seoTitleFr: fields.text({ label: 'Titre SEO (FR)' }),
        seoTitleEn: fields.text({ label: 'SEO Title (EN)' }),
        seoDescriptionFr: fields.text({ label: 'Meta description SEO (FR)', multiline: true }),
        seoDescriptionEn: fields.text({ label: 'SEO Meta Description (EN)', multiline: true }),
      },
    }),

    faq: collection({
      label: 'Questions Fréquentes (FAQ)',
      slugField: 'questionFr',
      path: 'content/faq/*',
      format: { data: 'yaml' },
      schema: {
        order: fields.number({ label: 'Ordre d’affichage (1, 2, 3...)', defaultValue: 1 }),
        questionFr: fields.text({ label: 'Question (FR)', validation: { isRequired: true } }),
        questionEn: fields.text({ label: 'Question (EN)', validation: { isRequired: true } }),
        answerFr: fields.text({ label: 'Réponse (FR)', multiline: true, validation: { isRequired: true } }),
        answerEn: fields.text({ label: 'Réponse (EN)', multiline: true, validation: { isRequired: true } }),
        category: fields.select({
          label: 'Catégorie',
          options: [
            { label: 'Tarifs & Délais', value: 'pricing' },
            { label: 'Propriété Intellectuelle (IP)', value: 'ip' },
            { label: 'Stack Technique', value: 'tech' },
            { label: 'Garanties & SLA', value: 'guarantee' },
            { label: 'Handover & Suivi', value: 'handover' },
            { label: 'Qualité & IA', value: 'quality' },
          ],
          defaultValue: 'pricing',
        }),
      },
    }),
  },
  singletons: {
    mentionsLegales: singleton({
      label: 'Mentions Légales',
      path: 'content/legal/mentions-legales',
      format: { data: 'yaml' },
      schema: {
        titleFr: fields.text({ label: 'Titre (FR)', validation: { isRequired: true } }),
        titleEn: fields.text({ label: 'Titre (EN)', validation: { isRequired: true } }),
        sectionsFr: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre de la section (FR)', validation: { isRequired: true } }),
            content: fields.text({ label: 'Contenu (FR) (HTML supporté)', multiline: true }),
          }),
          { label: 'Sections (FR)', itemLabel: (p) => p.fields.title.value }
        ),
        sectionsEn: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre de la section (EN)', validation: { isRequired: true } }),
            content: fields.text({ label: 'Contenu (EN) (HTML supporté)', multiline: true }),
          }),
          { label: 'Sections (EN)', itemLabel: (p) => p.fields.title.value }
        ),
      },
    }),
    politiqueConfidentialite: singleton({
      label: 'Politique de Confidentialité',
      path: 'content/legal/politique-confidentialite',
      format: { data: 'yaml' },
      schema: {
        titleFr: fields.text({ label: 'Titre (FR)', validation: { isRequired: true } }),
        titleEn: fields.text({ label: 'Titre (EN)', validation: { isRequired: true } }),
        sectionsFr: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre de la section (FR)', validation: { isRequired: true } }),
            content: fields.text({ label: 'Contenu (FR) (HTML supporté)', multiline: true }),
          }),
          { label: 'Sections (FR)', itemLabel: (p) => p.fields.title.value }
        ),
        sectionsEn: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre de la section (EN)', validation: { isRequired: true } }),
            content: fields.text({ label: 'Contenu (EN) (HTML supporté)', multiline: true }),
          }),
          { label: 'Sections (EN)', itemLabel: (p) => p.fields.title.value }
        ),
      },
    }),
    cgv: singleton({
      label: 'CGV (Conditions Générales)',
      path: 'content/legal/cgv',
      format: { data: 'yaml' },
      schema: {
        titleFr: fields.text({ label: 'Titre (FR)', validation: { isRequired: true } }),
        titleEn: fields.text({ label: 'Titre (EN)', validation: { isRequired: true } }),
        sectionsFr: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre de la section (FR)', validation: { isRequired: true } }),
            content: fields.text({ label: 'Contenu (FR) (HTML supporté)', multiline: true }),
          }),
          { label: 'Sections (FR)', itemLabel: (p) => p.fields.title.value }
        ),
        sectionsEn: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre de la section (EN)', validation: { isRequired: true } }),
            content: fields.text({ label: 'Contenu (EN) (HTML supporté)', multiline: true }),
          }),
          { label: 'Sections (EN)', itemLabel: (p) => p.fields.title.value }
        ),
      },
    }),
    cookies: singleton({
      label: 'Charte des Cookies',
      path: 'content/legal/cookies',
      format: { data: 'yaml' },
      schema: {
        titleFr: fields.text({ label: 'Titre (FR)', validation: { isRequired: true } }),
        titleEn: fields.text({ label: 'Titre (EN)', validation: { isRequired: true } }),
        buttonLabelFr: fields.text({ label: 'Label du bouton (FR)', defaultValue: 'Modifier mes préférences de cookies' }),
        buttonLabelEn: fields.text({ label: 'Label du bouton (EN)', defaultValue: 'Modify my cookie settings' }),
        sectionsFr: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre de la section (FR)', validation: { isRequired: true } }),
            content: fields.text({ label: 'Contenu (FR) (HTML supporté)', multiline: true }),
          }),
          { label: 'Sections (FR)', itemLabel: (p) => p.fields.title.value }
        ),
        sectionsEn: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre de la section (EN)', validation: { isRequired: true } }),
            content: fields.text({ label: 'Contenu (EN) (HTML supporté)', multiline: true }),
          }),
          { label: 'Sections (EN)', itemLabel: (p) => p.fields.title.value }
        ),
      },
    }),
  },
});
