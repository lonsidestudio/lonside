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

def build_lonside_strategy_docx(output_path):
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
    r_b = p_brand.add_run("LONSIDE  //  TECHNOLOGY · PEOPLE · IDEAS")
    r_b.font.name = "Arial"
    r_b.font.size = Pt(10)
    r_b.font.bold = True
    r_b.font.color.rgb = COLOR_MUTED

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(8)
    r_t = p_title.add_run("LE MASTER PLAN STRATÉGIQUE\n(2026 — 2028)")
    r_t.font.name = "Arial"
    r_t.font.size = Pt(28)
    r_t.font.bold = True
    r_t.font.color.rgb = COLOR_BLACK

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(18)
    r_s = p_sub.add_run("De l'Atelier d'Ingénierie Logicielle au Média d'Influence et à l'Édition de Produits SaaS : Modèle Flywheel, Rationale des Décisions & Roadmap Opérationnelle")
    r_s.font.name = "Arial"
    r_s.font.size = Pt(12)
    r_s.font.color.rgb = COLOR_MUTED

    add_callout(
        doc,
        "LA THÈSE CENTRALE LONSIDE : L'ALLIANCE DE L'EXÉCUTION TECHNIQUE ET DE LA DISTRIBUTION",
        "Lonside n'est pas une simple agence de prestations de services, ni un média passif de divertissement tech. "
        "C'est un écosystème hybride à haute vélocité articulé autour de deux piliers synergiques :\n\n"
        "1. Lonside Software : Conception, architecture et édition de logiciels, SaaS et plateformes cloud propriétaires.\n"
        "2. Lonside Studio : Média premium d'interviews, décryptages technologiques, coulisses d'ingénierie et formats originaux (YouTube, Podcasts, Publications).\n\n"
        "Notre stratégie démarre par la prestation d'ingénierie logicielle haut de gamme (sprints fermes dès 14 jours). "
        "Cette phase initiale finance l'expansion sur fonds propres (bootstrapped), établit une autorité technique incontestable, "
        "confronte l'équipe aux besoins réels du terrain et constitue le portefeuille client initial. "
        "La trésorerie générée est ensuite réinvestie pour déployer le média Lonside Studio, créant ainsi un avantage de distribution asymétrique (CAC = 0 €) "
        "au service de nos futurs logiciels édités sous la signature « A Product by Lonside »."
    )

    # Tableau Métadonnées de Couverture
    tbl_meta = doc.add_table(rows=4, cols=2)
    tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_rows = [
        [("Marque Mère :", " Lonside (Technology · People · Ideas)"), ("Version :", " 2.0 (Master Strategic Blueprint)")],
        [("Branches Actives :", " Lonside Software (Édition) & Lonside Studio (Média)"), ("Date d'Effet :", " Avril 2026")],
        [("Direction & Rédaction :", " Direction Artistique & Opérationnelle (Kevin T.)"), ("Classification :", " Confidentiel Stratégique / Investisseurs")],
        [("Modèle Économique :", " Services Cash-Flow -> Media Flywheel -> Proprietary SaaS"), ("Horizon de Déploiement :", " 2026 — 2028")]
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
    # SECTION 1 : L'ORIGINE DES DÉCISIONS STRATÉGIQUES (RETOURS FORUMS & BENCHMARKS MONDIAUX)
    # ──────────────────────────────────────────────────────────────────────────
    h1 = doc.add_heading(level=1)
    rh1 = h1.add_run("1. L'ORIGINE DES DÉCISIONS STRATÉGIQUES (ANALYSES & ÉCHANGES MARCHÉ)")
    rh1.font.name = "Arial"
    rh1.font.size = Pt(14)
    rh1.font.bold = True
    rh1.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARKS MONDIAUX : 37SIGNALS (BASECAMP), STRIPE, METALAB & Y COMBINATOR",
        "Notre modèle n'est pas une théorie abstraite : c'est la synthèse empirique des trajectoires les plus rentables "
        "observées aux États-Unis et en Europe du Nord, combinée à l'analyse rigoureuse des échecs récurrents partagés "
        "sur Hacker News, Indie Hackers et les communautés de fondateurs tech."
    )

    doc.add_heading(level=2).add_run("1.1 Les 4 Pièges Mortels du Marché Évités par Lonside").font.bold = True
    traps = [
        ("Le Piège du 'SaaS Sans Trésorerie ni Réseau' (Échec #1 des fondateurs solitaires)", 
         "Créer un logiciel dans son garage pendant 12 mois sans client, puis découvrir que personne ne l'achète faute de distribution et de trésorerie restante. "
         "Décision Lonside : Démarrer par les prestations de services à haute marge pour créer immédiatement du cash, un carnet d'adresses décisionnaire et une compréhension intime des besoins payants."),
        ("Le Piège de 'l'Agence Zombie' (Échec #2 des agences de services classiques)", 
         "Vendre du temps passé (TJM), recruter massivement des juniors, crouler sous les coûts fixes et ne jamais trouver le temps de développer ses propres produits. "
         "Décision Lonside : Limiter strictement le nombre de clients simultanés, opérer en forfaits fermes ultra-véloces (14j/30j) et sanctuariser 20% du temps d'équipe sur l'édition de logiciels propriétaires."),
        ("Le Piège du 'Média Gadget / Micro-Cravate Banal' (Échec #3 des créateurs de contenu)", 
         "Faire un podcast générique 'motivation / mindset' sans valeur technique, noyé dans la masse, impossible à monétiser. "
         "Décision Lonside : Un positionnement de niche chirurgical 'Behind the Code' axé sur l'artisanat du logiciel, les choix d'architecture réels, les post-mortems d'échecs et les compromis d'ingénierie que personne ne montre."),
        ("Le Piège de l'Investissement Prématuré en Studio Physique (Gaspillage de CAPEX)", 
         "Signer un bail commercial lourd et acheter 50k€ de matériel vidéo avant même d'avoir un format validé. "
         "Décision Lonside : Approche Lean absolue. Tournages nomades haute précision, location ponctuelle d'espaces inspirants à l'heure, priorité absolue à la valeur conversationnelle et au grain cinématographique feutré.")
    ]
    for title, desc in traps:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        rt = p.add_run(f"• {title} :\n")
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = COLOR_BLACK
        rd = p.add_run(desc)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    doc.add_heading(level=2).add_run("1.2 L'Effet Volant d'Inertie (The Lonside Flywheel)").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "Chaque entité de Lonside nourrit et renforce mécaniquement les deux autres dans un cycle auto-porteur :\n"
        "1. Lonside Services finance le cash-flow initial, apporte les études de cas concrètes et éprouve les composants techniques.\n"
        "2. Lonside Studio (Média) documente ces coulisses, interviewe les meilleurs builders, attire une audience qualifiée de fondateurs/CTOs et génère un flux d'opportunités entrantes (Inbound) sans frais publicitaires.\n"
        "3. Lonside Software (SaaS) résout les frustrations métiers récurrentes observées chez nos clients, bénéficie immédiatement d'une distribution gratuite via le média et génère des revenus récurrents (ARR) hautement valorisables."
    ).font.size = Pt(9.5)

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 2 : PHASE 1 — CONSOLIDER LES SERVICES (LE MOTEUR DE CASH INITIAL)
    # ──────────────────────────────────────────────────────────────────────────
    h2 = doc.add_heading(level=1)
    rh2 = h2.add_run("2. PHASE 1 (MAINTENANT) : CONSOLIDER LES SERVICES & LA TRÉSORERIE")
    rh2.font.name = "Arial"
    rh2.font.size = Pt(14)
    rh2.font.bold = True
    rh2.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "OBJECTIF OPÉRATIONNEL IMMÉDIAT : AUTOFINANCEMENT SOUVERAIN (BOOTSTRAPPED)",
        "Générer une rentabilité opérationnelle nette supérieure à 65% sur les prestations logicielles. "
        "Constituer une réserve de trésorerie sanctuarisée de 100 000 € dédiée à l'amorçage de Lonside Studio et Lonside Software sans levée de fonds dilutive prématurée."
    )

    doc.add_heading(level=2).add_run("2.1 Le Portfolio d'Offres & Économie Unitaire").font.bold = True
    
    tbl_pricing = doc.add_table(rows=1, cols=4)
    tbl_pricing.alignment = WD_TABLE_ALIGNMENT.CENTER
    heads = ["Offre Forfaitaire", "Prix Scellé", "Durée d'Exécution", "Marge Nette Visée"]
    for idx, text in enumerate(heads):
        c = tbl_pricing.cell(0, idx)
        set_cell_background(c, "09090B")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.font.bold = True
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    p_rows = [
        ("Sprint Launch (MVP & 1ère version live)", "6 900 €", "14 jours ouvrés", "> 75% (Interlocuteur Senior direct)"),
        ("Sprint Scale (Plateforme multi-rôles & SaaS)", "13 900 €", "30 jours ouvrés", "> 70% (Ingénierie avancée & QA)"),
        ("Régie d'Immersion (Squad senior dédiée)", "Dès 5 500 € / m", "Mensuel sans engagement", "> 60% (Revenus récurrents prédictibles)")
    ]
    for o_name, o_price, o_dur, o_mrg in p_rows:
        row = tbl_pricing.add_row().cells
        for idx, text in enumerate([o_name, o_price, o_dur, o_mrg]):
            c = row[idx]
            set_cell_margins(c, top=60, bottom=60, left=80, right=80)
            set_cell_border(c, bottom=dict(color="E4E4E7", sz="4"))
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_BLACK
            elif idx == 1:
                r.font.bold = True
                r.font.color.rgb = COLOR_DARK
            else:
                r.font.color.rgb = COLOR_BODY

    doc.add_heading(level=2).add_run("2.2 Le Rôle Stratégique Caché des Missions Clients").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "Chaque mission client est exploitée comme un banc d'essai technologique et un détecteur d'opportunités de produit :\n"
        "• Standardisation de notre bibliothèque de briques propriétaires (auth, facturation Stripe, composants haute couture, webhooks, audit trails).\n"
        "• Identification directe des douleurs logicielles : si 3 clients demandent un outil sur-mesure pour résoudre le même problème (ex: facturation spécifique, portail partenaire, synchronisation d'inventaire), cela valide l'existence d'un marché pour un futur SaaS Lonside Software."
    ).font.size = Pt(9.5)

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 3 : PHASE 2 — LONSIDE STUDIO (LE MÉDIA & MOTEUR DE DISTRIBUTION)
    # ──────────────────────────────────────────────────────────────────────────
    h3 = doc.add_heading(level=1)
    rh3 = h3.add_run("3. PHASE 2 : LONSIDE STUDIO (LE MÉDIA, PODCAST & INFLUENCE YOUTUBE)")
    rh3.font.name = "Arial"
    rh3.font.size = Pt(14)
    rh3.font.bold = True
    rh3.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARK MARCHÉ : STRIPE PRESS, Y COMBINATOR MEDIA & LEX FRIDMAN",
        "Ne pas faire un simple 'podcast tech bavard'. Lonside Studio produit du contenu documentaire haut de gamme, "
        "avec une scénarisation rigoureuse, une image cinématographique monochrome et des conversations sans concession sur la fabrication du logiciel."
    )

    doc.add_heading(level=2).add_run("3.1 Les 3 Formats Éditoriaux Chirurgicaux").font.bold = True
    formats = [
        ("1. Lonside Conversations (Entretiens Long-Format 40 — 60 min)",
         "Cible : Fondateurs de startups, CTOs, ingénieurs chevronnés, designers de produits emblématiques, chercheurs.\n"
         "Angle : Déconstruction méthodique d'un parcours : décisions charnières, échecs réels passés sous silence, dilemmes d'architecture logicielle, gestion du capital et pérennité d'entreprise. Zéro langue de bois."),
        ("2. Inside the Build (Coulisses & Démonstrations Réelles 15 — 25 min)",
         "Cible : Développeurs, créateurs de SaaS, builders indépendants, passionnés de produit.\n"
         "Angle : Partage d'écran et tableau blanc : décryptage d'une base de code, post-mortem d'une panne critique en production, architecture d'un SaaS à 1M$ d'ARR, choix de stack technique justifiés par les chiffres."),
        ("3. The Turning Point (Moments Décisifs 5 — 10 min, Format Punchy)",
         "Cible : Large audience tech, entrepreneurs en transition, décideurs pressés (adapté YouTube & Shorts/LinkedIn).\n"
         "Angle : Récit condensé et immersif centré sur une bascule unique : un licenciement transformé en succès, un pivot de produit in extremis, un refus d'investisseur ayant sauvé l'entreprise.")
    ]
    for f_title, f_desc in formats:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        rt = p.add_run(f"{f_title} :\n")
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = COLOR_BLACK
        rd = p.add_run(f_desc)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    doc.add_heading(level=2).add_run("3.2 Modèle Opérationnel & Économie de Production Lean").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "• Zéro studio physique fixe en phase d'amorçage : Tournages dans les bureaux de l'invité ou location ponctuelle d'espaces architecturaux à la demi-journée (ex: Peerspace, WeWork Studio).\n"
        "• Direction Artistique Monochrome & Cinématographique : Fond épuré, contraste affirmé, micros de référence (Shure SM7B), éclairage feutré à haute précision (Aputure). Le décor reflète le calme et la solidité de la marque.\n"
        "• La Conversion 'Trojan Horse' : Chaque personnalité invitée au micro devient un ambassadeur naturel de Lonside, un client potentiel pour nos services ou un sponsor/utilisateur de nos futurs logiciels."
    ).font.size = Pt(9.5)

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 4 : PHASE 3 — LONSIDE SOFTWARE (L'ÉDITION DE LOGICIELS SAAS)
    # ──────────────────────────────────────────────────────────────────────────
    h4 = doc.add_heading(level=1)
    rh4 = h4.add_run("4. PHASE 3 : LONSIDE SOFTWARE (L'ÉDITION DE LOGICIELS SAAS & CLOUD)")
    rh4.font.name = "Arial"
    rh4.font.size = Pt(14)
    rh4.font.bold = True
    rh4.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARK MARCHÉ : 37SIGNALS (BASECAMP/HEY), METALAB (TINY) & VERCEL",
        "L'objectif ultime de Lonside est de posséder des actifs logiciels propriétaires récurrents (SaaS). "
        "Chaque application éditée bénéficie de la signature ombrelle « A Product by Lonside », héritant de l'autorité "
        "technique du studio et de la force de distribution du média."
    )

    doc.add_heading(level=2).add_run("4.1 La Doctrine de Sélection des Produits SaaS").font.bold = True
    rules_saas = [
        ("Résolution d'un Problème Éprouvé 3 Fois en Prestation :", " Interdiction d'inventer des besoins imaginaires. Un produit n'est mis en chantier que s'il répond à un blocage réel récurrent rencontré chez nos clients d'ingénierie."),
        ("Modèle Économique Direct (B2B SaaS / Micro-SaaS) :", " Aucun modèle publicitaire ou freemium destructeur. Facturation claire (abonnement mensuel/annuel ou licence perpétuelle avec support), orientée ROI mesurable pour l'acheteur."),
        ("Architecture Haute Densité & Maintenance Faible :", " Des logiciels conçus selon la philosophie 'Boring Tech' (PostgreSQL, TypeScript, Next.js, Edge) permettant à un seul ingénieur senior de maintenir 3 à 5 produits sans burn-out."),
        ("Signature d'Édition 'A Product by Lonside' :", " Chaque logiciel conserve son nom de marque propre (ex: Welqo, FlowMetrics, Scoper), tout en affichant fièrement le label de qualité de notre atelier.")
    ]
    for r_title, r_desc in rules_saas:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        rt = p.add_run(f"• {r_title} ")
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = COLOR_BLACK
        rd = p.add_run(r_desc)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    doc.add_heading(level=2).add_run("4.2 Le Cycle d'Incubation Interne").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "1. Phase Sprint Interne (14 jours) : Prototypage et assemblage de la V1 par le Lead Architect Lonside.\n"
        "2. Phase Bêta Privée (30 jours) : Déploiement auprès d'un panel de 20 clients historiques et auditeurs du podcast.\n"
        "3. Lancement Public & Distribution (Jour 45) : Publication d'un épisode spécial 'Inside the Build' sur Lonside Studio dévoilant l'origine du logiciel, ses choix d'architecture et son modèle de code. Acquisition client sans frais d'ad-words (CAC = 0 €)."
    ).font.size = Pt(9.5)

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 5 : ROADMAP STRATÉGIQUE & JALONS CONCRETS (2026 — 2028)
    # ──────────────────────────────────────────────────────────────────────────
    h5 = doc.add_heading(level=1)
    rh5 = h5.add_run("5. ROADMAP STRATÉGIQUE INTERNE & JALONS D'EXÉCUTION (2026 — 2028)")
    rh5.font.name = "Arial"
    rh5.font.size = Pt(14)
    rh5.font.bold = True
    rh5.font.color.rgb = COLOR_BLACK

    tbl_road = doc.add_table(rows=1, cols=4)
    tbl_road.alignment = WD_TABLE_ALIGNMENT.CENTER
    r_heads = ["Période Cible", "Focus Opérationnel Principal", "Jalons Clés & Livrables", "Objectif Financier / KPI"]
    for idx, text in enumerate(r_heads):
        c = tbl_road.cell(0, idx)
        set_cell_background(c, "09090B")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.font.bold = True
        r.font.size = Pt(8)
        r.font.color.rgb = RGBColor(255, 255, 255)

    roadmap_data = [
        ("S1 2026\n(Maintenant)", "Consolidation Prestations\n& Trésorerie Saine", 
         "• Exécution des sprints fermes (Launch & Scale)\n• Standardisation des livrables et du design system\n• Constitution de 50k€ de trésorerie de réserve", 
         "25k€ — 40k€ / mois de CA\n100% autofinancé"),
        ("S2 2026\n(Ensuite)", "Lancement Média\nLonside Studio", 
         "• Lancement chaîne YouTube & Lonside Conversations\n• Production de 12 épisodes pilotes (setup Lean)\n• Distribution multicanale (YouTube, LinkedIn, X)", 
         "10 000 abonnés qualifiés\n3 à 5 deals Inbound générés"),
        ("S1 2027\n(Accélération)", "Incubation du Premier SaaS\nLonside Software", 
         "• Sélection du problème métier le plus récurrent\n• Développement du SaaS V1 en sprint interne 14j\n• Lancement via un épisode 'Inside the Build'", 
         "50 premiers clients payants\nARR SaaS initial : 25k€"),
        ("2027 — 2028\n(Maturité)", "Holding Hybride :\nServices, Média & Produits", 
         "• 2 à 3 logiciels SaaS rentables en exploitation\n• Média établi comme référence francophone tech\n• Équipe resserrée d'ingénieurs seniors autonomes", 
         "ARR Produits > CA Services\nValorisation d'actifs pérennes")
    ]

    for p_per, p_foc, p_jal, p_kpi in roadmap_data:
        row = tbl_road.add_row().cells
        for idx, text in enumerate([p_per, p_foc, p_jal, p_kpi]):
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
            elif idx == 3:
                r.font.bold = True
                r.font.color.rgb = COLOR_DARK
            else:
                r.font.color.rgb = COLOR_BODY

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 6 : ALLOCATION DES RESSOURCES & RÈGLE DU 70/20/10
    # ──────────────────────────────────────────────────────────────────────────
    doc.add_paragraph().paragraph_format.space_before = Pt(14)
    h6 = doc.add_heading(level=2)
    h6.add_run("Gouvernance du Temps : La Règle d'Allocation 70 / 20 / 10").font.bold = True
    
    p = doc.add_paragraph()
    p.add_run(
        "Pour éviter que la prestation de service ne cannibalise la stratégie de marque et le développement de logiciels, Lonside applique une discipline d'allocation du temps strict :\n"
        "• 70% du temps opérationnel : Dévoué à l'ingénierie client de haute volée (sprints fermes sans dépassement, garantissant la rentabilité immédiate et la réputation).\n"
        "• 20% du temps opérationnel : Dévoué à Lonside Studio (préparation éditoriale, enregistrement des conversations, tournages Inside the Build et diffusion).\n"
        "• 10% du temps opérationnel : Dévoué à la R&D interne de Lonside Software (architecture de composants partagés, veille technique, prototypage d'idées SaaS).\n\n"
        "À mesure que les revenus récurrents des SaaS progressent, cette clé d'allocation évoluera progressivement vers 40% Services / 30% Média / 30% Produits, assurant une transition harmonieuse sans fragilisation du modèle financier."
    ).font.size = Pt(9.5)

    p_close = doc.add_paragraph()
    p_close.paragraph_format.space_before = Pt(28)
    rc1 = p_close.add_run("LONSIDE  //  TECHNOLOGY · PEOPLE · IDEAS\n")
    rc1.font.name = "Arial"
    rc1.font.bold = True
    rc1.font.size = Pt(9.5)
    rc1.font.color.rgb = COLOR_BLACK
    rc2 = p_close.add_run("Document de gouvernance stratégique générale — Validé par la Direction pour exécution — Version 2.0 (Avril 2026)")
    rc2.font.name = "Arial"
    rc2.font.size = Pt(8.5)
    rc2.font.color.rgb = COLOR_MUTED

    doc.save(output_path)
    print(f"Document Master Plan Stratégique DOCX généré avec succès : {output_path}")

if __name__ == "__main__":
    out_docs = os.path.join(os.path.dirname(__file__), "LONSIDE_MASTER_PLAN_STRATEGIQUE_ET_ROADMAP.docx")
    out_public = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "LONSIDE_MASTER_PLAN_STRATEGIQUE_ET_ROADMAP.docx")
    build_lonside_strategy_docx(out_docs)
    build_lonside_strategy_docx(out_public)
