import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, hex_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    tcPr = cell._element.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}/>')
    for edge in ('top', 'left', 'bottom', 'right'):
        edge_data = kwargs.get(edge)
        if edge_data:
            b_elm = parse_xml(f'<w:{edge} {nsdecls("w")} w:val="{edge_data.get("val", "single")}" w:sz="{edge_data.get("sz", "4")}" w:space="0" w:color="{edge_data.get("color", "E4E4E7")}"/>')
            tcBorders.append(b_elm)
        else:
            b_elm = parse_xml(f'<w:{edge} {nsdecls("w")} w:val="none"/>')
            tcBorders.append(b_elm)
    tcPr.append(tcBorders)

def add_callout(doc, title, text, bg="FAFAFA", border="E4E4E7"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = tbl.cell(0, 0)
    c.width = Inches(6.8)
    set_cell_background(c, bg)
    set_cell_margins(c, top=160, bottom=160, left=200, right=200)
    set_cell_border(c, top=dict(color=border, sz="6"), bottom=dict(color=border, sz="6"),
                       left=dict(color=border, sz="6"), right=dict(color=border, sz="6"))
    p = c.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    if title:
        r_t = p.add_run(f"{title}\n")
        r_t.font.name = "Arial"
        r_t.font.bold = True
        r_t.font.size = Pt(10)
        r_t.font.color.rgb = RGBColor(9, 9, 11)
    r_body = p.add_run(text)
    r_body.font.name = "Arial"
    r_body.font.size = Pt(9.5)
    r_body.font.color.rgb = RGBColor(39, 39, 42)
    doc.add_paragraph().paragraph_format.space_before = Pt(4)

def build_livrables_spec_docx(output_path):
    doc = Document()

    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    COLOR_BLACK = RGBColor(9, 9, 11)      # #09090b
    COLOR_DARK = RGBColor(24, 24, 27)     # #18181b
    COLOR_BODY = RGBColor(39, 39, 42)     # #27272a
    COLOR_MUTED = RGBColor(113, 113, 122) # #71717a

    # ──────────────────────────────────────────────────────────────────────────
    # COUVERTURE ÉDITORIALE HAUTE COUTURE
    # ──────────────────────────────────────────────────────────────────────────
    p_brand = doc.add_paragraph()
    p_brand.paragraph_format.space_before = Pt(30)
    p_brand.paragraph_format.space_after = Pt(10)
    r_b = p_brand.add_run("LONSIDE STUDIO  //  MANUEL TECHNIQUE & QUALITÉ DE LIVRAISON")
    r_b.font.name = "Arial"
    r_b.font.size = Pt(10)
    r_b.font.bold = True
    r_b.font.color.rgb = COLOR_MUTED

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(8)
    r_t = p_title.add_run("SPÉCIFICATION DU PACK DE LIVRAISON\n& STANDARDS DE QUALITÉ")
    r_t.font.name = "Arial"
    r_t.font.size = Pt(26)
    r_t.font.bold = True
    r_t.font.color.rgb = COLOR_BLACK

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(18)
    r_s = p_sub.add_run("Décomposition Exhaustive de Chaque Livrable : Contenu Détaillé, Règles Strictes, Valeur Métier & Benchmarks Mondiaux")
    r_s.font.name = "Arial"
    r_s.font.size = Pt(12)
    r_s.font.color.rgb = COLOR_MUTED

    add_callout(
        doc,
        "LE STANDARD D'INGÉNIERIE LONSIDE : L'EXCELLENCE AU NIVEAU DES LEADERS MONDIAUX",
        "Ce document constitue la Bible d'Exécution et le Cahier des Normes de Lonside Studio. "
        "Pour chaque composante du pack de livraison, il définit sans ambiguïté : (1) le contenu matériel et logiciel exact, "
        "(2) les règles d'art intransigeantes applicables à la production, (3) la valeur business et d'évaluation transmise au client, "
        "et (4) l'alignement sur les références internationales les plus avancées du marché (Linear, Stripe, Vercel, Work & Co, GitHub, Basecamp / Shape Up).\n\n"
        "Destiné à la Direction Générale, aux Investisseurs en audit tech (Due Diligence) et aux CTOs de nos clients partenaires, "
        "ce manuel garantit qu'aucune ligne de code livrée par Lonside ne relève de l'amateurisme ou de la dette technique."
    )

    # Métadonnées
    tbl_meta = doc.add_table(rows=4, cols=2)
    tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_rows = [
        [("Destinataires :", " Direction, CTOs Partenaires, Comités d'Audit & Investisseurs"), ("Version :", " 2.0 (High-Precision Delivery Specification)")],
        [("Auteurs :", " Direction Artistique & Direction Opérationnelle (Kevin T.)"), ("Date d'Effet :", " Avril 2026")],
        [("Classification :", " Confidentiel Interne & Référentiel Client"), ("Périmètre :", " Tous Sprints & Déploiements Lonside")],
        [("Alignement Marché :", " Standards US & Nordiques (Linear, Stripe, Vercel)"), ("Opposabilité :", " Annexe Contractuelle aux Sprints Fermes")]
    ]
    for r_idx, row_data in enumerate(meta_rows):
        for c_idx, (k, v) in enumerate(row_data):
            cell = tbl_meta.cell(r_idx, c_idx)
            cell.width = Inches(3.4)
            set_cell_margins(cell, top=50, bottom=50, left=0, right=0)
            set_cell_border(cell, top=dict(color="E4E4E7", sz="4") if r_idx == 0 else None,
                               bottom=dict(color="E4E4E7", sz="4") if r_idx == 3 else None)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            rk = p.add_run(k)
            rk.font.name = "Arial"
            rk.font.bold = True
            rk.font.size = Pt(8.5)
            rk.font.color.rgb = COLOR_BLACK
            rv = p.add_run(v)
            rv.font.name = "Arial"
            rv.font.size = Pt(8.5)
            rv.font.color.rgb = COLOR_MUTED

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 1 : LIVRABLE #1 — LE DÉPÔT SOURCE & GOUVERNANCE GITHUB
    # ──────────────────────────────────────────────────────────────────────────
    h = doc.add_heading(level=1)
    rh = h.add_run("LIVRABLE #1 : DÉPÔT SOURCE & GOUVERNANCE GITHUB")
    rh.font.name = "Arial"
    rh.font.size = Pt(14)
    rh.font.bold = True
    rh.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARK MARCHÉ : GITHUB STANDARD & SHOPIFY CORE REPOSITORIES",
        "Comme chez Shopify et GitHub, le code source n'est pas un dépôt de fichiers vrac : c'est un écosystème gouverné, "
        "reproductible en une commande et protégé contre toute erreur humaine dès le premier jour."
    )

    doc.add_heading(level=2).add_run("1.1 Contenu Matériel Exact du Livrable").font.bold = True
    p = doc.add_paragraph()
    p.add_run("Le client reçoit le transfert officiel de propriété d'un dépôt GitHub privé configuré contenant :\n").font.color.rgb = COLOR_BODY
    items1 = [
        ("Arborescence Standardisée :", " Structure Clean Architecture sans dépendance circulaire (/src/app, /src/components, /src/modules, /src/lib)."),
        ("Historique Git Impeccable :", " Commits atomiques rédigés sous la norme Conventional Commits (feat, fix, refactor, test, docs). Zéro 'fix commit' ou 'wip' orphelin."),
        ("Configuration de Sécurité Préventive :", " Fichiers .gitignore stricts, scan automatique de fuites de clés API (GitGuardian / Gitleaks hook) et modèle .env.example exhaustif."),
        ("Templates & Standards d'Équipe :", " .github/PULL_REQUEST_TEMPLATE.md, templates d'issues et fichiers de directives pour agents de développement (.cursorrules, AGENTS.md).")
    ]
    for k, v in items1:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        rk = p.add_run(f"• {k}")
        rk.font.bold = True
        rk.font.size = Pt(9.5)
        rk.font.color.rgb = COLOR_BLACK
        rv = p.add_run(v)
        rv.font.size = Pt(9.5)
        rv.font.color.rgb = COLOR_BODY

    doc.add_heading(level=2).add_run("1.2 Règles Strictes à Respecter").font.bold = True
    rules1 = [
        "Branche principale 'main' sanctuarisée : interdiction formelle de pousser directement sur main sans pull request validée par la CI.",
        "Zéro secret en dur : aucune clé d'API, mot de passe de base de données ou identifiant de test n'est commité dans l'arbre Git.",
        "Zéro 'any' TypeScript : configuration tsconfig.json en mode strict intégral avec noImplicitAny: true et strictNullChecks: true.",
        "Reproductibilité totale : l'installation depuis zéro via 'npm install && npm run dev' doit fonctionner immédiatement sans étape manuelle obscure."
    ]
    for r in rules1:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.add_run(f"✓ {r}").font.size = Pt(9)

    doc.add_heading(level=2).add_run("1.3 Valeur Souhaitée pour le Client & Investisseurs").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "• Pour le CTO client : Un onboarding immédiat d'un nouvel ingénieur en moins de 15 minutes chrono.\n"
        "• Pour les Investisseurs / M&A : Lors d'une due diligence technique de levée de fonds (Série A/B), le dépôt renvoie l'image d'une équipe de classe mondiale, "
        "éliminant toute décote liée à un code brouillon ou à une dette technique cachée."
    ).font.size = Pt(9.5)

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 2 : LIVRABLE #2 — LE SOCLE APPLICATIF & CLEAN ARCHITECTURE
    # ──────────────────────────────────────────────────────────────────────────
    h = doc.add_heading(level=1)
    rh = h.add_run("LIVRABLE #2 : SOCLE APPLICATIF & CLEAN ARCHITECTURE")
    rh.font.name = "Arial"
    rh.font.size = Pt(14)
    rh.font.bold = True
    rh.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARK MARCHÉ : LINEAR.APP (FLUIDITÉ 60FPS) & BASECAMP (SHAPE UP)",
        "À l'image de Linear, l'application est pensée pour une réactivité instantanée, une clarté de navigation totale "
        "et une architecture en couches étanches empêchant tout effet de bord."
    )

    doc.add_heading(level=2).add_run("2.1 Contenu Matériel Exact du Livrable").font.bold = True
    items2 = [
        ("Architecture en Couches (DDD Allégé) :", " Découpage strict entre (1) Présentation UI (Composants React), (2) Logique Métier (Services), (3) Accès aux Données (Repositories/ORM) et (4) Adaptateurs Externes."),
        ("Next.js App Router Optimisé :", " Exploitation maximale des React Server Components (RSC) par défaut pour réduire le bundle JavaScript client à son strict minimum."),
        ("Gestion Unifiée des Erreurs :", " Classe MichiException / StudioException avec ErrorCodes structurés (UNAUTHENTICATED, NOT_FOUND, VALIDATION_ERROR) renvoyant des messages compréhensibles."),
        ("Optimistic UI & Cache Invalidations :", " Mise à jour instantanée de l'interface lors des actions utilisateur avant même la confirmation serveur pour un ressenti ultra-rapide.")
    ]
    for k, v in items2:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        rk = p.add_run(f"• {k}")
        rk.font.bold = True
        rk.font.size = Pt(9.5)
        rk.font.color.rgb = COLOR_BLACK
        rv = p.add_run(v)
        rv.font.size = Pt(9.5)
        rv.font.color.rgb = COLOR_BODY

    doc.add_heading(level=2).add_run("2.2 Règles Strictes à Respecter").font.bold = True
    rules2 = [
        "Interdiction des composants géants : aucun composant React ne doit dépasser 250 lignes de code (décomposition en sous-composants atomiques).",
        "Interdiction des boucles N+1 sur les requêtes de base de données : utilisation obligatoire de batching ou requêtes jointes optimisées.",
        "Zéro logique métier dans les composants d'interface : les règles de calcul et de validation vivent dans /modules/*/services, jamais dans le JSX.",
        "Gestion d'état minimaliste : privilégier l'état d'URL (searchParams) et le cache serveur plutôt que des stores globaux lourds et opaques."
    ]
    for r in rules2:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.add_run(f"✓ {r}").font.size = Pt(9)

    doc.add_heading(level=2).add_run("2.3 Valeur Souhaitée pour le Client & Investisseurs").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "• Vélocité d'évolution : L'équipe du client peut ajouter des fonctionnalités en toute sécurité sans craindre d'effondrer une autre partie du système.\n"
        "• Rétention des utilisateurs finaux : Une application sans latence perceptive convertit jusqu'à 3x plus et offre un taux d'attrition (churn) minimal."
    ).font.size = Pt(9.5)

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 3 : LIVRABLE #3 — L'INFRASTRUCTURE EDGE, VERCEL & CI/CD
    # ──────────────────────────────────────────────────────────────────────────
    h = doc.add_heading(level=1)
    rh = h.add_run("LIVRABLE #3 : INFRASTRUCTURE EDGE, VERCEL & PIPELINE CI/CD")
    rh.font.name = "Arial"
    rh.font.size = Pt(14)
    rh.font.bold = True
    rh.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARK MARCHÉ : VERCEL INFRASTRUCTURE & CLOUDFLARE EDGE",
        "Une infrastructure moderne ne requiert aucun serveur dédié à maintenir : elle est déployée globalement sur le réseau Edge, "
        "servie en moins de 100ms depuis n'importe quel continent avec zéro coût d'administration système."
    )

    doc.add_heading(level=2).add_run("3.1 Contenu Matériel Exact du Livrable").font.bold = True
    items3 = [
        ("Configuration de Déploiement Vercel :", " Liaison directe avec le compte Vercel client, routage Edge, compression Brotli, et serveurs DNS Anycast mondial."),
        ("Environnements Étanches :", " Séparation stricte entre Production (branche main), Staging (branche staging) et Preview Deployments (générés à chaque pull request)."),
        ("Pipeline GitHub Actions CI :", " Exécution automatique à chaque push des vérifications de syntaxe (ESLint), de typage (tsc), des tests unitaires et du build de production."),
        ("Durcissement des Headers HTTP :", " En-têtes Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options et protection contre les attaques XSS.")
    ]
    for k, v in items3:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        rk = p.add_run(f"• {k}")
        rk.font.bold = True
        rk.font.size = Pt(9.5)
        rk.font.color.rgb = COLOR_BLACK
        rv = p.add_run(v)
        rv.font.size = Pt(9.5)
        rv.font.color.rgb = COLOR_BODY

    doc.add_heading(level=2).add_run("3.2 Règles Strictes à Respecter").font.bold = True
    rules3 = [
        "Core Web Vitals garantis : LCP (Largest Contentful Paint) < 1.2s, CLS (Cumulative Layout Shift) = 0, FID < 50ms sur connexions mobiles 4G.",
        "Temps de build de production inférieur à 90 secondes avec Turbopack.",
        "Zéro downtime lors des déploiements : transitions atomiques instantanées avec rollback possible en 1 clic en cas d'anomalie.",
        "Protection DDoS et pare-feu d'application web (WAF) activé avec limitation de débit (Rate Limiting) sur les routes d'authentification et de formulaires."
    ]
    for r in rules3:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.add_run(f"✓ {r}").font.size = Pt(9)

    doc.add_heading(level=2).add_run("3.3 Valeur Souhaitée pour le Client & Investisseurs").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "• Coût d'exploitation quasi-nul : Zéro dépense en devops ou administrateur système dédié (économies de 40k€ à 70k€/an).\n"
        "• Résilience mondiale : Capacité d'encaisser une campagne de presse ou un pic de 100 000 visiteurs simultanés sans la moindre saturation serveur."
    ).font.size = Pt(9.5)

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 4 : LIVRABLE #4 — LE MODÈLE DE DONNÉES & MIGRATIONS VERSIONNÉES
    # ──────────────────────────────────────────────────────────────────────────
    h = doc.add_heading(level=1)
    rh = h.add_run("LIVRABLE #4 : MODÈLE DE DONNÉES & MIGRATIONS VERSIONNÉES")
    rh.font.name = "Arial"
    rh.font.size = Pt(14)
    rh.font.bold = True
    rh.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARK MARCHÉ : POSTGRESQL STANDARD STRIPE & SUPABASE ARCHITECTURE",
        "La base de données est l'actif le plus précieux d'une entreprise. Son schéma doit être aussi propre et normalisé "
        "que les livres comptables d'une banque centrale."
    )

    doc.add_heading(level=2).add_run("4.1 Contenu Matériel Exact du Livrable").font.bold = True
    items4 = [
        ("Schéma Relationnel Normalisé (3NF) :", " Base de données PostgreSQL modélisée avec clés primaires UUID v4, contraintes d'unicité, clés étrangères et index de recherche optimisés."),
        ("Système de Migrations Versionnées :", " Historique de migrations déclaratif (Drizzle / Prisma / Alembic). Chaque changement de colonne est horodaté et réversible."),
        ("Stratégie de Soft-Delete & Audit Trail :", " Colonnes created_at, updated_at et deleted_at automatiques garantissant la traçabilité sans perte définitive de données accidentelle."),
        ("Typage Automatique TypeScript :", " Génération automatique des interfaces TypeScript depuis le schéma SQL pour éliminer tout risque de désynchronisation de type.")
    ]
    for k, v in items4:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        rk = p.add_run(f"• {k}")
        rk.font.bold = True
        rk.font.size = Pt(9.5)
        rk.font.color.rgb = COLOR_BLACK
        rv = p.add_run(v)
        rv.font.size = Pt(9.5)
        rv.font.color.rgb = COLOR_BODY

    doc.add_heading(level=2).add_run("4.2 Règles Strictes à Respecter").font.bold = True
    rules4 = [
        "Interdiction de modifier manuellement la base en production : toute altération passe exclusivement par un script de migration versionné et testé.",
        "Indexation obligatoire de toute colonne utilisée dans les clauses WHERE, JOIN et ORDER BY fréquentes.",
        "Ségrégation des données multi-tenants : utilisation de Row Level Security (RLS) ou filtres d'organisation stricts interdisant toute fuite inter-comptes.",
        "Sauvegardes quotidiennes automatisées chiffrées avec procédure de restauration documentée (Point-in-Time Recovery)."
    ]
    for r in rules4:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.add_run(f"✓ {r}").font.size = Pt(9)

    doc.add_heading(level=2).add_run("4.3 Valeur Souhaitée pour le Client & Investisseurs").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "• Scalabilité garantie jusqu'à 500 000 utilisateurs actifs sans refonte de structure.\n"
        "• Conformité RGPD et sécurité bancaire : Cloisonnement strict des données personnelles protégeant le client de tout risque juridique majeur."
    ).font.size = Pt(9.5)

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 5 : LIVRABLE #5 — LE MOTEUR MONÉTIQUE STRIPE & FLUX DE VENTE
    # ──────────────────────────────────────────────────────────────────────────
    h = doc.add_heading(level=1)
    rh = h.add_run("LIVRABLE #5 : MOTEUR MONÉTIQUE STRIPE & FLUX FINANCIERS")
    rh.font.name = "Arial"
    rh.font.size = Pt(14)
    rh.font.bold = True
    rh.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARK MARCHÉ : STRIPE BILLING & GLOBAL CHECKOUT STANDARDS",
        "Le paiement ne supporte aucune approximation. Le moteur Stripe Lonside garantit que chaque centime encaissé "
        "déclenche les droits d'accès correspondants sans aucun risque de doublon ou d'abandon panier évitable."
    )

    doc.add_heading(level=2).add_run("5.1 Contenu Matériel Exact du Livrable").font.bold = True
    items5 = [
        ("Intégration Stripe Complète :", " Prise en charge des paiements uniques, abonnements récurrents (mensuels/annuels) et périodes d'essai gratuites (Free Trials)."),
        ("Webhooks avec Déduplication Idempotente :", " Traitement asynchrone sécurisé de chaque événement Stripe (checkout.session.completed, invoice.paid, customer.subscription.deleted) avec stockage de l'event_id pour éviter tout double débit."),
        ("Portail Client Self-Service (Stripe Customer Portal) :", " Interface permettant aux utilisateurs finaux de mettre à jour leur carte bancaire, télécharger leurs factures et gérer leur abonnement en totale autonomie."),
        ("Gestion Fiscale Automatisée (Stripe Tax) :", " Calcul et application dynamique de la TVA intracommunautaire et internationale selon la localisation de l'acheteur.")
    ]
    for k, v in items5:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        rk = p.add_run(f"• {k}")
        rk.font.bold = True
        rk.font.size = Pt(9.5)
        rk.font.color.rgb = COLOR_BLACK
        rv = p.add_run(v)
        rv.font.size = Pt(9.5)
        rv.font.color.rgb = COLOR_BODY

    doc.add_heading(level=2).add_run("5.2 Règles Strictes à Respecter").font.bold = True
    rules5 = [
        "Zéro stockage de numéro de carte : conformité PCI-DSS SAQ-A intégrale déléguée aux coffres-forts chiffrés de Stripe.",
        "Gestion automatique des rejets de paiement (Smart Retries & Dunning) pour maximiser le recouvrement des revenus récurrents.",
        "Validation systématique des signatures de webhooks (stripe-signature) pour interdire toute usurpation d'événement.",
        "Test de transaction réelle à 1€ en mode live validé avant la remise définitive du projet."
    ]
    for r in rules5:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.add_run(f"✓ {r}").font.size = Pt(9)

    doc.add_heading(level=2).add_run("5.3 Valeur Souhaitée pour le Client & Investisseurs").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "• Capacité d'encaissement immédiate dès la première heure post-livraison.\n"
        "• Taux de conversion de checkout supérieur à 85% grâce à l'UX standardisée Apple Pay / Google Pay / Carte Bleue."
    ).font.size = Pt(9.5)

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 6 : LIVRABLE #6 — LE DESIGN SYSTEM & DIRECTION ARTISTIQUE HAUTE PRÉCISION
    # ──────────────────────────────────────────────────────────────────────────
    h = doc.add_heading(level=1)
    rh = h.add_run("LIVRABLE #6 : DESIGN SYSTEM & DIRECTION ARTISTIQUE HAUTE PRÉCISION")
    rh.font.name = "Arial"
    rh.font.size = Pt(14)
    rh.font.bold = True
    rh.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARK MARCHÉ : WORK & CO (APPLE / GOOGLE) & DIETER RAMS (LESS BUT BETTER)",
        "L'élégance naît de la suppression du bruit. Notre design system monochrome pur garantit une autorité visuelle immédiate "
        "qui distingue le produit de la masse des templates génériques du marché."
    )

    doc.add_heading(level=2).add_run("6.1 Contenu Matériel Exact du Livrable").font.bold = True
    items6 = [
        ("Charte Chromatique Strictement Encadrée :", " 7 nuances calibrées de noir minéral (#09090b), zincs gradués et blanc pur. Zéro couleur d'accent criarde."),
        ("Tokens Géométriques Universels :", " Rayon de courbure signature rounded-xl (12px), bordures fines border-black/[0.08], micro-ombres imperceptibles shadow-xs."),
        ("Système Typographique à 3 Voix :", " Voix Architecturale (Geist Sans/Helvetica), Voix Ingénierie (JetBrains Mono pour les données chiffrées), Voix Éditoriale (Serif Italique pour les citations)."),
        ("Bibliothèque de Composants Accessibles :", " Composants modulaires (Navbar, Tiroir DossierDrawer, Accordéons FAQ, Cartouches d'immersion) entièrement compatibles navigation clavier.")
    ]
    for k, v in items6:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        rk = p.add_run(f"• {k}")
        rk.font.bold = True
        rk.font.size = Pt(9.5)
        rk.font.color.rgb = COLOR_BLACK
        rv = p.add_run(v)
        rv.font.size = Pt(9.5)
        rv.font.color.rgb = COLOR_BODY

    doc.add_heading(level=2).add_run("6.2 Règles Strictes à Respecter").font.bold = True
    rules6 = [
        "Règle de casse i18n naturelle : dictionnaires JSON rédigés en Sentence case, majuscules visuelles appliquées par la classe CSS 'uppercase'.",
        "Conformité accessibilité WCAG 2.1 niveau AAA sur les contrastes de lecture principaux (ratios > 7:1).",
        "Mobile-first strict : adaptation ergonomique parfaite sur écran 375px avec touch targets de 44x44px minimum.",
        "Motion design sobre : transitions d'état à accélération naturelle (cubic-bezier(0.16, 1, 0.3, 1)) en 200ms à 350ms, zéro effet rebondissant ('bouncy')."
    ]
    for r in rules6:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.add_run(f"✓ {r}").font.size = Pt(9)

    doc.add_heading(level=2).add_run("6.3 Valeur Souhaitée pour le Client & Investisseurs").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "• Crédibilité institutionnelle immédiate : Le produit renvoie la stature d'une entreprise établie et rassure instantanément les clients grands comptes et investisseurs.\n"
        "• Cohérence visuelle pérenne : Les futures fonctionnalités s'assemblent comme des pièces de Lego sans divergence graphique."
    ).font.size = Pt(9.5)

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 7 : LIVRABLES #7 À #9 — QA, PASSATION TECHNIQUE & GARANTIE 30J
    # ──────────────────────────────────────────────────────────────────────────
    h = doc.add_heading(level=1)
    rh = h.add_run("LIVRABLES #7 À #9 : QA, PASSATION LOOM & GARANTIE 30 JOURS")
    rh.font.name = "Arial"
    rh.font.size = Pt(14)
    rh.font.bold = True
    rh.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARK MARCHÉ : THOUGHTBOT QA CULTURE & STRIPE DEVELOPER DOCUMENTATION",
        "La livraison ne s'arrête pas au code : elle inclut le filet de sécurité des tests, la clarté pédagogique "
        "de la transmission et l'engagement d'assistance post-lancement."
    )

    doc.add_heading(level=2).add_run("Livrable #7 : Le Harnais de Tests Automatisés").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "• Contenu : Suite de tests automatisés (Node.js test runner / Vitest) couvrant la protection RGPD, le consentement des cookies, les flux de paiement et les API critiques.\n"
        "• Règles : Couverture > 80% sur la logique financière et d'authentification. Zéro test intermittent ('flaky').\n"
        "• Valeur : Déploiements en production sereins à tout moment sans régression."
    ).font.size = Pt(9.5)

    doc.add_heading(level=2).add_run("Livrable #8 : La Passation Technique & Walkthrough Vidéo Loom (CTO)").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "• Contenu : Vidéo HD de 20 minutes enregistrée personnellement par le Lead Architect détaillant l'architecture du code, les modèles de données et les clés de configuration + documentation ARCHITECTURE.md.\n"
        "• Règles : Démonstration pratique exécutable pas-à-pas, explication des choix de conception et des points d'extension futurs.\n"
        "• Valeur : Prise en main instantanée par le CTO ou les développeurs internes du client sans perte de temps en réunions de passation confuses."
    ).font.size = Pt(9.5)

    doc.add_heading(level=2).add_run("Livrable #9 : La Garantie Corrective Intégrale de 30 Jours").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "• Contenu : 30 jours calendaires d'assistance complète post-lancement avec SLA de réponse < 4h ouvrées sur canal direct dédié.\n"
        "• Règles : Correction sans aucun frais de toute anomalie ou divergence constatée par rapport au cahier des charges scellé.\n"
        "• Valeur : Élimination totale du risque de lancement pour le fondateur et les investisseurs."
    ).font.size = Pt(9.5)

    # ──────────────────────────────────────────────────────────────────────────
    # TABLEAU RÉCAPITULATIF FINAL DE LA VALEUR
    # ──────────────────────────────────────────────────────────────────────────
    doc.add_paragraph().paragraph_format.space_before = Pt(14)
    h_rec = doc.add_heading(level=2)
    h_rec.add_run("Tableau Synthétique : Livrables, Références & Valeur d'Entreprise").font.bold = True

    tbl_sum = doc.add_table(rows=1, cols=4)
    tbl_sum.alignment = WD_TABLE_ALIGNMENT.CENTER
    s_heads = ["Livrable Clé", "Contenu Essentiel", "Référence Marché", "Valeur Transmise"]
    for idx, text in enumerate(s_heads):
        c = tbl_sum.cell(0, idx)
        set_cell_background(c, "09090B")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.font.bold = True
        r.font.size = Pt(8)
        r.font.color.rgb = RGBColor(255, 255, 255)

    sum_rows = [
        ("1. Dépôt GitHub", "Repo privé, CI/CD, Conventional Commits", "GitHub / Shopify", "Onboarding CTO en 15 min, Due Diligence M&A"),
        ("2. Architecture Logicielle", "Next.js App Router, DDD, RSC purs", "Linear.app / Basecamp", "Fluidité 60fps, maintenance sans dette"),
        ("3. Infrastructure Edge", "Vercel Anycast, Headers CSP/HSTS", "Vercel / Cloudflare", "0€ d'admin sys, disponibilité 99.99%"),
        ("4. Base de Données", "PostgreSQL 3NF, Migrations Drizzle", "Stripe / Supabase", "Intégrité financière, scalabilité 500k users"),
        ("5. Monétisation Stripe", "Abonnements, Webhooks, Customer Portal", "Stripe Global", "Encaissement immédiat, checkout 85%+"),
        ("6. Design System Haute Précision", "Monochrome pur, WCAG AAA, rounded-xl", "Work & Co / Braun", "Autorité institutionnelle, image haut de gamme"),
        ("7. Tests Automatisés", "Couverture >80% sur flux critiques", "Thoughtbot / Google", "Zéro régression, sécurité psychologique"),
        ("8. Walkthrough Loom", "Vidéo 20 min architecte + README", "Stripe Docs / Retool", "Autonomie technique totale du client"),
        ("9. Garantie 30 Jours", "Assistance corrective SLA < 4h", "Enterprise SLA", "Risque zéro d'exécution pour les investisseurs")
    ]

    for p_liv, p_cnt, p_ref, p_val in sum_rows:
        row = tbl_sum.add_row().cells
        for idx, text in enumerate([p_liv, p_cnt, p_ref, p_val]):
            c = row[idx]
            set_cell_margins(c, top=60, bottom=60, left=80, right=80)
            set_cell_border(c, bottom=dict(color="E4E4E7", sz="4"))
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8)
            if idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_BLACK
            elif idx == 2:
                r.font.bold = True
                r.font.color.rgb = COLOR_DARK
            else:
                r.font.color.rgb = COLOR_BODY

    p_close = doc.add_paragraph()
    p_close.paragraph_format.space_before = Pt(24)
    rc1 = p_close.add_run("LONSIDE STUDIO  //  MANUEL TECHNIQUE & CAHIER DES NORMES DE LIVRAISON\n")
    rc1.font.name = "Arial"
    rc1.font.bold = True
    rc1.font.size = Pt(9.5)
    rc1.font.color.rgb = COLOR_BLACK
    rc2 = p_close.add_run("Spécification approuvée pour standardisation des offres, revues d'architecture et comités d'investissement — Version 2.0 (Avril 2026)")
    rc2.font.name = "Arial"
    rc2.font.size = Pt(8.5)
    rc2.font.color.rgb = COLOR_MUTED

    doc.save(output_path)
    print(f"Document Spécification Livrables DOCX généré avec succès : {output_path}")

if __name__ == "__main__":
    out_docs = os.path.join(os.path.dirname(__file__), "LONSIDE_SPECIFICATION_LIVRABLES_ET_STANDARDS_QUALITE.docx")
    out_public = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "LONSIDE_SPECIFICATION_LIVRABLES_ET_STANDARDS_QUALITE.docx")
    build_livrables_spec_docx(out_docs)
    build_livrables_spec_docx(out_public)

