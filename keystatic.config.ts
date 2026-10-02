import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Lonside Studio' },
    navigation: {
      Contenu: ['blog', 'portfolio'],
      Légal: ['mentionsLegales', 'politiqueConfidentialite', 'cgv', 'cookies'],
    },
  },
  collections: {
    blog: collection({
      label: 'Articles de blog',
      slugField: 'slug',
      path: 'content/blog/*',
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'URL Slug' } }),
        titleFr: fields.text({ label: 'Titre (FR)', validation: { isRequired: true } }),
        titleEn: fields.text({ label: 'Title (EN)' }),
        excerptFr: fields.text({ label: 'Extrait (FR)', multiline: true }),
        excerptEn: fields.text({ label: 'Excerpt (EN)', multiline: true }),
        category: fields.select({
          label: 'Catégorie',
          options: [
            { label: 'Intelligence Artificielle', value: 'ia' },
            { label: 'Développement Web', value: 'web' },
            { label: 'Design', value: 'design' },
            { label: 'SEO', value: 'seo' },
          ],
          defaultValue: 'web',
        }),
        publishedAt: fields.date({ label: 'Date de publication' }),
        readingTime: fields.number({ label: 'Temps de lecture (min)' }),
        featured: fields.checkbox({ label: 'Article à la une', defaultValue: false }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (p) => p.value,
        }),
        authorName: fields.text({ label: 'Auteur — Nom', defaultValue: 'Kevin T.' }),
        authorRole: fields.text({
          label: 'Auteur — Rôle',
          defaultValue: 'Fondateur & Lead Dev',
        }),
        seoTitleFr: fields.text({ label: 'Titre SEO (FR)' }),
        seoTitleEn: fields.text({ label: 'SEO Title (EN)' }),
        seoDescriptionFr: fields.text({ label: 'Meta description (FR)', multiline: true }),
        seoDescriptionEn: fields.text({ label: 'Meta description (EN)', multiline: true }),
      },
    }),

    portfolio: collection({
      label: 'Projets Portfolio',
      slugField: 'slug',
      path: 'content/portfolio/*',
      format: { data: 'yaml' },
      schema: {
        slug: fields.slug({ name: { label: 'URL Slug' } }),
        client: fields.text({ label: 'Nom du client' }),
        industryFr: fields.text({ label: 'Secteur d\'activité (FR)' }),
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
        architectureSummaryFr: fields.text({ label: 'Synthèse de l\'architecture (FR)', multiline: true }),
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
        seoTitleFr: fields.text({ label: 'Titre SEO (FR)' }),
        seoTitleEn: fields.text({ label: 'SEO Title (EN)' }),
        seoDescriptionFr: fields.text({ label: 'Meta description SEO (FR)', multiline: true }),
        seoDescriptionEn: fields.text({ label: 'SEO Meta Description (EN)', multiline: true }),
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
