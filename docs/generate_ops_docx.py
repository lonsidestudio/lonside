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

def build_lonside_ops_docx(output_path):
    doc = Document()

    # Marges 2 cm
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
    r_b = p_brand.add_run("LONSIDE STUDIO  //  DOCUMENT DE GOUVERNANCE STRATÉGIQUE")
    r_b.font.name = "Arial"
    r_b.font.size = Pt(10)
    r_b.font.bold = True
    r_b.font.color.rgb = COLOR_MUTED

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(8)
    r_t = p_title.add_run("PLAN OPÉRATIONNEL\n& PACK DE LIVRAISON")
    r_t.font.name = "Arial"
    r_t.font.size = Pt(28)
    r_t.font.bold = True
    r_t.font.color.rgb = COLOR_BLACK

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(20)
    r_s = p_sub.add_run("Architecture de l'Offre, Matrice des Parties Prenantes, Cadence des Sprints & Spécification des Livrables")
    r_s.font.name = "Arial"
    r_s.font.size = Pt(12)
    r_s.font.color.rgb = COLOR_MUTED

    add_callout(
        doc,
        "MANIFESTE OPÉRATIONNEL & ENGAGEMENT DE DIRECTION",
        "Lonside a été fondé sur un postulat sans compromis : le modèle traditionnel des agences de développement digital est cassé par le parasitisme commercial, la dilution de responsabilité et la dérive budgétaire systématique.\n\n"
        "Chez Lonside, nous opérons sous la forme d'un Atelier d'Ingénierie Haute Vélocité : un interlocuteur unique chevronné (Lead Architect), des sprints aux forfaits scellés dès 14 jours, 100% du code cédé sur le GitHub du client et une garantie d'exécution opposable avec pénalités contractuelles de retard. "
        "Ce document détaille l'intégralité de nos processus opérationnels, nos protocoles de livraison et notre cadre de gouvernance interne pour la Direction, les Investisseurs et les CTOs partenaires."
    )

    # Tableau Métadonnées de Couverture
    tbl_meta = doc.add_table(rows=4, cols=2)
    tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_rows = [
        [("Destinataires :", " Direction Générale, Comité Stratégique, CTOs & Investisseurs"), ("Version Document :", " 2.0 (High-Velocity Sprint Standard)")],
        [("Auteur & Rôle :", " Kevin T. (Directeur Opérationnel & DA)"), ("Date d'Effet :", " Avril 2026")],
        [("Classification :", " Confidentiel Interne & Investisseurs"), ("Périmètre :", " Globalité des Offres & Opérations Lonside")],
        [("SLA Contractuel :", " Engagement Forfait Ferme & Garantie 30 Jours"), ("Statut d'Exécution :", " Opérationnel & Validé en Production")]
    ]
    for r_idx, row_data in enumerate(meta_rows):
        for c_idx, (k, v) in enumerate(row_data):
            cell = tbl_meta.cell(r_idx, c_idx)
            cell.width = Inches(3.4)
            set_cell_margins(cell, top=60, bottom=60, left=0, right=0)
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
    # SECTION 1 : THÈSE STRATÉGIQUE & MODÈLE OPÉRATIONNEL
    # ──────────────────────────────────────────────────────────────────────────
    h = doc.add_heading(level=1)
    rh = h.add_run("1. THÈSE STRATÉGIQUE & MODÈLE OPÉRATIONNEL")
    rh.font.name = "Arial"
    rh.font.size = Pt(16)
    rh.font.bold = True
    rh.font.color.rgb = COLOR_BLACK

    p1 = doc.add_paragraph()
    p1.add_run(
        "Lonside résout l'asymétrie fondamentale du marché du logiciel : les startups et PME ont besoin d'aller vite pour valider leur modèle "
        "ou accélérer leur monétisation, mais font face soit à des freelances isolés à la disponibilité aléatoire, soit à des agences traditionnelles "
        "lourdes dont 60% de la facturation finance des postes commerciaux, des chefs de projet intermédiaires et des frais de structure inutiles."
    ).font.color.rgb = COLOR_BODY

    p_model = doc.add_paragraph()
    p_model.paragraph_format.space_before = Pt(8)
    p_model.add_run("Les piliers de notre disruption opérationnelle :").font.bold = True

    model_points = [
        ("Interlocuteur Unique Senior (Zero Middleman)", "Aucun compte n'est géré par un commercial ou un junior. Le client échange directement avec un Lead Architect expérimenté capable d'arbitrer techniquement et commercialement en temps réel."),
        ("Forfait Scellé & Délais Fermes", "Refus formel de la facturation au temps passé (TJM) qui incite structurellement à la lenteur. Nos sprints sont scellés à prix fixe (6 900 € pour 14j, 13 900 € pour 30j) avec pénalités journalières en cas de dérive studio."),
        ("Cession de Code Source Sans Captivité (Zero Lock-In)", "Dès le jour de livraison, 100% du code, des schémas de base de données et des composants sont transférés sur le compte GitHub du client. Pas de plateforme fermée, pas d'abonnement forcé."),
        ("Garantie Corrective Intégrale de 30 Jours", "Chaque livraison s'accompagne d'un mois calendaire d'assistance complète et de correction de bugs gratuite, assurant une sérénité totale post-lancement."),
        ("Confidentialité ZDR (Zero Data Retention)", "Toutes les opérations d'ingénierie et d'automatisation s'exécutent sous accords stricts d'isolation. Les données et codes clients ne sont jamais réutilisés ni entraînés sur des modèles publics.")
    ]

    for title, desc in model_points:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        rt = p.add_run(f"• {title} : ")
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = COLOR_BLACK
        rd = p.add_run(desc)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 2 : MATRICE DES PARTIES PRENANTES & GOUVERNANCE RACI
    # ──────────────────────────────────────────────────────────────────────────
    h2 = doc.add_heading(level=1)
    rh2 = h2.add_run("2. MATRICE DES PARTIES PRENANTES & GOUVERNANCE RACI")
    rh2.font.name = "Arial"
    rh2.font.size = Pt(16)
    rh2.font.bold = True
    rh2.font.color.rgb = COLOR_BLACK

    p2 = doc.add_paragraph()
    p2.add_run(
        "La réussite d'un sprint de 14 ou 30 jours repose sur une répartition chirurgicale des responsabilités. "
        "Aucune décision ne doit être ralentie par un comité de validation informe."
    ).font.color.rgb = COLOR_BODY

    # Tableau RACI
    tbl_raci = doc.add_table(rows=1, cols=5)
    tbl_raci.alignment = WD_TABLE_ALIGNMENT.CENTER
    raci_headers = ["Phase du Sprint", "Lead Architect (Lonside)", "Client Founder / CPO", "Client CTO / Tech Lead", "Squad d'Ingénieurs"]
    for idx, text in enumerate(raci_headers):
        cell = tbl_raci.cell(0, idx)
        set_cell_background(cell, "09090B")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(text)
        run.font.bold = True
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(255, 255, 255)

    raci_rows = [
        ("Cadrage Initial (J1-J2)", "Accountable (A) — Verrouille le CDC et l'architecture", "Responsible (R) — Valide les personas et objectifs", "Consulted (C) — Valide les contraintes d'infra", "Informed (I) — Intègre les spécifications"),
        ("Sprint Actif (J3-J11)", "Responsible (R) — Pilote l'assemblage et les revues", "Informed (I) — Accès en temps réel au staging", "Consulted (C) — Revues des schémas de données", "Responsible (R) — Développement & tests unitaires"),
        ("Démo Mi-Sprint (J7)", "Responsible (R) — Présentation de la version active", "Accountable (A) — Arbitrage des ajustements mineurs", "Consulted (C) — Validation technique intermédiaire", "Informed (I) — Ajustements du backlog"),
        ("QA & Durcissement (J12)", "Responsible (R) — Audit sécu, mobile, responsive", "Consulted (C) — Derniers retours utilisateurs", "Accountable (A) — Validation des accès production", "Responsible (R) — Résolution des anomalies"),
        ("Mise en Ligne (J13-J14)", "Accountable (A) — Transfert GitHub, DNS & Stripe", "Responsible (R) — Annonce officielle & paiement", "Accountable (A) — Réception de la propriété tech", "Informed (I) — Déploiement production"),
        ("Garantie 30j (J15-J45)", "Accountable (A) — Prise en charge SLA < 4h", "Informed (I) — Suivi des résolutions de bugs", "Responsible (R) — Signalement des éventuels écarts", "Responsible (R) — Déploiement des correctifs")
    ]

    for row_data in raci_rows:
        row_cells = tbl_raci.add_row().cells
        for idx, text in enumerate(row_data):
            cell = row_cells[idx]
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
            set_cell_border(cell, bottom=dict(color="E4E4E7", sz="4"))
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            run = p.add_run(text)
            run.font.size = Pt(8)
            if idx == 0:
                run.font.bold = True
                run.font.color.rgb = COLOR_BLACK
            else:
                run.font.color.rgb = COLOR_BODY

    p_raci_note = doc.add_paragraph()
    p_raci_note.paragraph_format.space_before = Pt(10)
    r_rn = p_raci_note.add_run("Règle de communication : ")
    r_rn.font.bold = True
    r_rn.font.color.rgb = COLOR_BLACK
    r_rn2 = p_raci_note.add_run(
        "Un canal direct dédié (Slack Connect ou groupe WhatsApp privé) est activé dès le Jour 1. "
        "Temps de réponse moyen garanti par le Lead Architect : moins de 2 heures en journée ouvrée."
    )
    r_rn2.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 3 : DÉTAIL DES 3 OFFRES DU CATALOGUE LONSIDE
    # ──────────────────────────────────────────────────────────────────────────
    h3 = doc.add_heading(level=1)
    rh3 = h3.add_run("3. DÉTAIL DES 3 OFFRES DU CATALOGUE OPÉRATIONNEL")
    rh3.font.name = "Arial"
    rh3.font.size = Pt(16)
    rh3.font.bold = True
    rh3.font.color.rgb = COLOR_BLACK

    # Offre 1 : Sprint Launch
    doc.add_heading(level=2).add_run("Offre 1 : Sprint Launch — 6 900 € (14 Jours Ouvrés)").font.bold = True
    add_callout(
        doc,
        "MISSION & CIBLE DU SPRINT LAUNCH",
        "Conçu pour les fondateurs lançant un nouveau produit ou les équipes devant mettre en production une première version commerciale clé-en-main en 14 jours ouvrés. "
        "L'objectif est d'atteindre le statut 'Live in Production' avec encaissement Stripe actif et zéro dette technique."
    )

    tbl_launch = doc.add_table(rows=1, cols=3)
    tbl_launch.alignment = WD_TABLE_ALIGNMENT.CENTER
    l_heads = ["Chronologie", "Actions Opérationnelles Concrètes", "Livrable Tangible Remis"]
    for idx, text in enumerate(l_heads):
        c = tbl_launch.cell(0, idx)
        set_cell_background(c, "18181B")
        set_cell_margins(c, top=80, bottom=80, left=90, right=90)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.font.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    launch_phases = [
        ("Jours 1 — 2\n(Cadrage & Modélisation)", "• Alignement objectifs et flux utilisateurs clés\n• Modélisation DB (PostgreSQL) et sécurité des rôles\n• Verrouillage contractuel du périmètre fonctionnel\n• Ouverture canal direct Slack / WhatsApp", "Cahier des Charges Scellé & Schéma de Données Validé"),
        ("Jours 3 — 6\n(Développement Front & Logique)", "• Montage Next.js App Router & Tailwind CSS\n• Composants haute couture responsive mobile-first\n• Intégration de l'authentification sécurisée (OAuth, JWT)\n• Déploiement staging avec URL de preview en continu", "Environnement Staging Actif & Démo Vidéo Jalon"),
        ("Jours 7 — 11\n(Monétisation & Intégrations)", "• Configuration Stripe (Abonnements ou Paiements Uniques)\n• Webhooks d'idempotence et gestion de facturation\n• Connexion APIs externes (Resend, CRM, stockage S3/Vercel)\n• Batterie de tests automatisés (Zéro régression)", "Parcours de Paiement & Flux Métier 100% Fonctionnels"),
        ("Jours 12 — 14\n(Recette, Transfert & Lancement)", "• Audits vitesse, SEO, RGPD et compatibilité mobile\n• Cession intégrale du code sur l'organisation GitHub client\n• Configuration domaine personnalisé (DNS) et Vercel Edge\n• Enregistrement de la visite guidée d'architecture (Loom)", "Produit en Ligne + Organisation GitHub Cédée + Loom")
    ]

    for p_time, p_acts, p_deliv in launch_phases:
        row = tbl_launch.add_row().cells
        for idx, text in enumerate([p_time, p_acts, p_deliv]):
            c = row[idx]
            set_cell_margins(c, top=70, bottom=70, left=90, right=90)
            set_cell_border(c, bottom=dict(color="E4E4E7", sz="4"))
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_BLACK
            elif idx == 2:
                r.font.bold = True
                r.font.color.rgb = COLOR_DARK
            else:
                r.font.color.rgb = COLOR_BODY

    doc.add_paragraph().paragraph_format.space_before = Pt(12)

    # Offre 2 : Sprint Scale
    doc.add_heading(level=2).add_run("Offre 2 : Sprint Scale — 13 900 € (30 Jours Ouvrés)").font.bold = True
    add_callout(
        doc,
        "MISSION & CIBLE DU SPRINT SCALE",
        "Dédié aux plateformes complexes, marketplaces ou SaaS B2B nécessitant des flux de données multi-acteurs (clients, prestataires, administrateurs), "
        "des calculs automatisés, des notifications temps réel et une architecture distribuée résiliente."
    )

    scale_features = [
        ("Architecture Multi-Rôles Sécurisée", "Portails étanches avec gestion fine des permissions (RBAC), invitations d'équipes et tableaux de bord personnalisés par profil."),
        ("Traitement Intelligent des Flux & Données", "Moteurs de calcul en tâche de fond, imports/exports CSV volumineux, génération dynamique de PDF et rapports analytiques."),
        ("Notifications Temps Réel & Déclencheurs", "Intégration d'événements webhook asynchrones, alertes transactionnelles par email/SMS et synchronisation temps réel."),
        ("Tests de Résilience & Sécurité Renforcée", "Couverture de tests unitaires et d'intégration supérieure à 80%, protection contre les injections et attaques de force brute."),
        ("Documentation Système pour Équipes Internes", "Documentation technique complète du schéma DB, des APIs internes et des runbooks de maintenance pour une transition fluide.")
    ]

    for title, desc in scale_features:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        rt = p.add_run(f"• {title} : ")
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = COLOR_BLACK
        rd = p.add_run(desc)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    doc.add_paragraph().paragraph_format.space_before = Pt(12)

    # Offre 3 : Régie d'Immersion
    doc.add_heading(level=2).add_run("Offre 3 : Régie d'Immersion Senior — Dès 5 500 € / mois").font.bold = True
    add_callout(
        doc,
        "MISSION & CIBLE DE LA RÉGIE D'IMMERSION",
        "Pour les scale-ups et entreprises disposant déjà d'un produit en production mais manquant de bande passante senior pour expédier leur roadmap. "
        "Intégration directe d'un à trois ingénieurs seniors dans votre Slack, sans engagement contraignant, avec semaine d'essai de 5 jours."
    )

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 4 : LE PACK DE LIVRAISON EXHAUSTIF (WHAT WE DELIVER)
    # ──────────────────────────────────────────────────────────────────────────
    h4 = doc.add_heading(level=1)
    rh4 = h4.add_run("4. LE PACK DE LIVRAISON EXHAUSTIF (WHAT WE DELIVER)")
    rh4.font.name = "Arial"
    rh4.font.size = Pt(16)
    rh4.font.bold = True
    rh4.font.color.rgb = COLOR_BLACK

    p4 = doc.add_paragraph()
    p4.add_run(
        "Chaque contrat Lonside se conclut par la remise d'un Pack de Livraison certifié. "
        "Voici la liste contractuelle des livrables tangibles transmis au client lors du transfert final :"
    ).font.color.rgb = COLOR_BODY

    tbl_pack = doc.add_table(rows=1, cols=3)
    tbl_pack.alignment = WD_TABLE_ALIGNMENT.CENTER
    pack_heads = ["Livrable Concret", "Spécification Technique & Norme", "Valeur Opérationnelle Client"]
    for idx, text in enumerate(pack_heads):
        c = tbl_pack.cell(0, idx)
        set_cell_background(c, "09090B")
        set_cell_margins(c, top=80, bottom=80, left=90, right=90)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.font.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    pack_items = [
        ("1. Organisation GitHub Cédée", "Transfert complet de propriété du repository sur l'organisation GitHub du client. 100% du code source, git history, branches et tags.", "Liberté totale de développement. Zéro lock-in, zéro dépendance vis-à-vis du studio."),
        ("2. Architecture Logicielle Clean", "Codebase modulaire Next.js (App Router, Server Components, TypeScript strict, architecture DDD sans couplage circulaire).", "Maintenance aisée par n'importe quel développeur senior futur sans dette technique."),
        ("3. Pipeline CI/CD & Déploiement", "Workflows GitHub Actions configurés (lint, types, tests automatiques) et liaison directe avec l'infrastructure de production Vercel.", "Déploiements continus sécurisés et instantanés à chaque commit sur la branche main."),
        ("4. Base de Données & Migrations", "Schéma PostgreSQL normalisé avec scripts de migration versionnés (Alembic / Prisma / Drizzle) et sauvegardes automatiques.", "Intégrité parfaite des données et capacité d'évolution du modèle sans rupture."),
        ("5. Monétisation Stripe Active", "Module de paiement Stripe complet : checkout sécurisé, abonnements récurrents, portail client, gestion des échecs de paiement.", "Capacité d'encaisser de vrais clients et abonnés dès la première minute post-lancement."),
        ("6. Suite de Tests Automatisés", "Batterie de tests automatisés (unitaires et intégration) couvrant les flux critiques de paiement et d'authentification.", "Bouclier protecteur garantissant zéro régression lors des évolutions futures."),
        ("7. Walkthrough Vidéo Loom (CTO)", "Vidéo HD de 20 minutes enregistrée par le Lead Architect détaillant la structure du code, les choix d'architecture et les API.", "Onboarding immédiat des équipes techniques du client sans réunions interminables."),
        ("8. Garantie Corrective 30 Jours", "30 jours calendaires d'assistance complète et d'intervention prioritaire sur toute anomalie par rapport au cahier des charges.", "Sérénité absolue : le studio reste présent et engagé après la mise en ligne.")
    ]

    for p_name, p_spec, p_val in pack_items:
        row = tbl_pack.add_row().cells
        for idx, text in enumerate([p_name, p_spec, p_val]):
            c = row[idx]
            set_cell_margins(c, top=70, bottom=70, left=90, right=90)
            set_cell_border(c, bottom=dict(color="E4E4E7", sz="4"))
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_BLACK
            elif idx == 2:
                r.font.color.rgb = COLOR_DARK
            else:
                r.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 5 : GESTION DES RISQUES & ENGAGEMENT FINANCIER OPPOSABLE
    # ──────────────────────────────────────────────────────────────────────────
    h5 = doc.add_heading(level=1)
    rh5 = h5.add_run("5. GESTION DES RISQUES & ENGAGEMENT FINANCIER OPPOSABLE")
    rh5.font.name = "Arial"
    rh5.font.size = Pt(16)
    rh5.font.bold = True
    rh5.font.color.rgb = COLOR_BLACK

    p5 = doc.add_paragraph()
    p5.add_run(
        "Lonside se distingue des acteurs de marché par sa responsabilité financière explicite. "
        "Nous appliquons le principe du 'Skin in the Game' : si nous échouons à tenir nos engagements, nous en payons le prix."
    ).font.color.rgb = COLOR_BODY

    risks = [
        ("Gestion du Risque de Scope Creep (Dérive de Périmètre)", "Toute demande de fonctionnalité nouvelle non prévue au cahier des charges scellé est isolée dans un 'Backlog V2'. Le sprint en cours n'est jamais pollué. Si la modification est indispensable, elle fait l'objet d'un avenant écrit chiffré et d'un ajustement convenu de la date cible."),
        ("Pénalités Contractuelles de Retard", "En cas de retard imputable au studio par rapport à la date de livraison garantie, Lonside applique une pénalité journalière automatique stipulée au contrat, déduite du solde de facturation."),
        ("Disponibilité & Stabilité des Dépendances Externes", "Toutes les dépendances critiques (Stripe, Resend, Vercel, Supabase) sont architecturées derrière des adaptateurs modulaires avec mocks de secours, garantissant l'avancement même en cas d'indisponibilité momentanée d'une API tierce."),
        ("Zéro Donnée Résiduelle & Sécurité des Données (ZDR)", "Aucune information confidentielle de code ou de base de données n'est persistée sur des disques non chiffrés. Tous les échanges sont protégés par double authentification et clés d'accès révoquées post-livraison.")
    ]

    for title, desc in risks:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        rt = p.add_run(f"• {title} : ")
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = COLOR_BLACK
        rd = p.add_run(desc)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 6 : CHECKLIST FINALE DES 40 POINTS AVANT DÉPLOIEMENT
    # ──────────────────────────────────────────────────────────────────────────
    doc.add_paragraph().paragraph_format.space_before = Pt(12)
    h6 = doc.add_heading(level=2)
    rh6 = h6.add_run("Protocole de Déploiement : La Checklist des 40 Points")
    rh6.font.bold = True
    rh6.font.size = Pt(12)
    rh6.font.color.rgb = COLOR_BLACK

    checklist_domains = [
        ("Performance & Vitals :", " Lighthouse score > 90/100 sur mobile et desktop, temps de réponse serveur edge < 100ms, images optimisées au format WebP/AVIF."),
        ("Sécurité & RGPD :", " Variables d'environnement masquées, headers HTTP sécurisés (CSP, HSTS), bannière de consentement conforme, Zero Data Retention validé."),
        ("Compatibilité Écrans :", " Validation responsive sur 375px (iPhone standard), 768px (iPad) et 1440px (Desktop), aucun élément débordant ni troncature."),
        ("Monétisation & Flux :", " Test d'achat réel en mode live Stripe, validation de réception des webhooks, génération de facture client conforme."),
        ("Passation Technique :", " README d'installation complet, documentation des scripts d'environnement, transfert officiel d'accès GitHub et hébergeur.")
    ]

    for domain, detail in checklist_domains:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        rd = p.add_run(f"✓ {domain}")
        rd.font.bold = True
        rd.font.size = Pt(9)
        rd.font.color.rgb = COLOR_BLACK
        rdet = p.add_run(detail)
        rdet.font.size = Pt(9)
        rdet.font.color.rgb = COLOR_MUTED

    # Clôture & Signature
    p_close = doc.add_paragraph()
    p_close.paragraph_format.space_before = Pt(28)
    rc1 = p_close.add_run("LONSIDE STUDIO  //  DIRECTION GÉNÉRALE & DIRECTION OPÉRATIONNELLE\n")
    rc1.font.name = "Arial"
    rc1.font.bold = True
    rc1.font.size = Pt(9.5)
    rc1.font.color.rgb = COLOR_BLACK
    rc2 = p_close.add_run("Document approuvé pour gouvernance interne, due diligence investisseurs et engagements CTO — Version 2.0 (Avril 2026)")
    rc2.font.name = "Arial"
    rc2.font.size = Pt(8.5)
    rc2.font.color.rgb = COLOR_MUTED

    doc.save(output_path)
    print(f"Document Plan Opérationnel DOCX généré avec succès : {output_path}")

if __name__ == "__main__":
    out_docs = os.path.join(os.path.dirname(__file__), "LONSIDE_PLAN_OPERATIONNEL_ET_PACK_LIVRAISON.docx")
    out_public = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "LONSIDE_PLAN_OPERATIONNEL_ET_PACK_LIVRAISON.docx")
    build_lonside_ops_docx(out_docs)
    build_lonside_ops_docx(out_public)

