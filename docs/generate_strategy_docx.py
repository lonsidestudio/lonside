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

def build_lonside_master_strategy_docx(output_path, img_brand, img_road, img_media):
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
    r_t = p_title.add_run("LE MASTER PLAN STRATÉGIQUE\n& FEUILLE DE ROUTE OPÉRATIONNELLE\n(2027 — 2029+)")
    r_t.font.name = "Arial"
    r_t.font.size = Pt(24)
    r_t.font.bold = True
    r_t.font.color.rgb = COLOR_BLACK

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(16)
    r_s = p_sub.add_run("De l'Atelier d'Ingénierie Logicielle Haute Vélocité au Média d'Influence et à l'Édition de Produits SaaS : Architecture de Marque, Périmètre Détaillé des Services, Rationale des Décisions & Modèle Flywheel")
    r_s.font.name = "Arial"
    r_s.font.size = Pt(11)
    r_s.font.color.rgb = COLOR_MUTED

    add_callout(
        doc,
        "LE MANIFESTE STRATÉGIQUE FONDATIONNEL : L'ALLIANCE DU CODE ET DE LA DISTRIBUTION",
        "Lonside rassemble sous une même bannière souveraine deux forces complémentaires :\n"
        "• Lonside Software : Conception et édition de logiciels, SaaS et produits numériques propriétaires.\n"
        "• Lonside Studio : Média tech, interviews de builders, podcasts vidéo et formats d'immersion technique.\n\n"
        "Notre stratégie opérationnelle démarre en 2027 par l'offre de prestations d'ingénierie logicielle haut de gamme (sprints fermes dès 14 jours). "
        "Cette phase fondatrice génère le cash-flow nécessaire (autofinancement strict sans dilution prématurée), éprouve notre bibliothèque de composants, "
        "confronte l'équipe aux besoins réels du marché et bâtit notre clientèle décisionnaire. "
        "Cette trésorerie est ensuite réinvestie dès 2028 pour déployer le média Lonside Studio (sur YouTube et formats multicanaux), "
        "créant un avantage d'audience massif permettant d'éditer et de lancer progressivement dès 2029 des logiciels SaaS avec un coût d'acquisition client nul (CAC = 0 €)."
    )

    tbl_meta = doc.add_table(rows=4, cols=2)
    tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_rows = [
        [("Marque Mère :", " lonside. (Technology · People · Ideas)"), ("Version :", " 3.0 (Master Strategic & Operational Blueprint)")],
        [("Branches Actives :", " Lonside Software (Édition) & Lonside Studio (Média)"), ("Horizon Roadmap :", " Phase 1 (2027) -> Phase 2 (2028) -> Phase 3 (2029+)")],
        [("Rôles Auteur :", " Direction Artistique & Direction Opérationnelle (Kevin T.)"), ("Classification :", " Confidentiel Stratégique / Direction & Investisseurs")],
        [("Thèse Économique :", " Services Cash-Flow -> Media Flywheel -> Proprietary SaaS"), ("Modèle d'Exécution :", " Bootstrapped, Marge Nette > 70%, Zero Lock-In")]
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
    # SECTION 1 : ARCHITECTURE DE MARQUE & MODÈLE FLYWHEEL
    # ──────────────────────────────────────────────────────────────────────────
    h1 = doc.add_heading(level=1)
    rh1 = h1.add_run("1. ARCHITECTURE DE MARQUE & SYNERGIE EN FLYWHEEL")
    rh1.font.name = "Arial"
    rh1.font.size = Pt(14)
    rh1.font.bold = True
    rh1.font.color.rgb = COLOR_BLACK

    p = doc.add_paragraph()
    p.add_run(
        "Lonside structure son organisation en deux branches maîtresses reliées par un volant d'inertie (flywheel) auto-alimenté :"
    ).font.color.rgb = COLOR_BODY

    # Insertion de l'illustration Schéma d'Architecture
    if os.path.exists(img_brand):
        doc.add_paragraph().paragraph_format.space_before = Pt(4)
        doc.add_picture(img_brand, width=Inches(6.8))
        p_cap = doc.add_paragraph()
        p_cap.paragraph_format.space_before = Pt(4)
        p_cap.paragraph_format.space_after = Pt(12)
        r_c = p_cap.add_run("Figure 1.1 : Schéma d'Architecture de Marque et Volant d'Inertie Lonside.")
        r_c.font.size = Pt(8)
        r_c.font.italic = True
        r_c.font.color.rgb = COLOR_MUTED

    doc.add_heading(level=2).add_run("1.1 Le Fonctionnement Mécanique du Flywheel").font.bold = True
    fly_points = [
        ("Le Flux Prestations alimente la Trésorerie & la Légitimité :", " En exécutant des applications pour des fondateurs exigeants dès 2027, Lonside génère des marges nettes élevées (> 70%), accumule des retours d'expérience bruts et éprouve sa bibliothèque de code propriétaire."),
        ("Le Média Lonside Studio magnifie l'Expertise & crée l'Audience :", " En invitant des entrepreneurs, CTOs et chercheurs pour analyser leurs décisions et en ouvrant les coulisses de code (Inside the Build), Lonside attire les meilleurs profils et crée un canal d'acquisition direct."),
        ("Lonside Software transforme les Douleurs Métiers en Actifs SaaS :", " Chaque produit SaaS lancé résout un problème récurrent observé chez nos clients de services. Lancé devant l'audience qualifiée de Lonside Studio, il atteint immédiatement ses premiers abonnés payants sans dépenser 1 € en publicités payantes (CAC = 0 €).")
    ]
    for k, v in fly_points:
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

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 2 : ORIGINE DES DÉCISIONS STRATÉGIQUES (BENCHMARKS & FORUMS TECH)
    # ──────────────────────────────────────────────────────────────────────────
    h2 = doc.add_heading(level=1)
    rh2 = h2.add_run("2. ORIGINE DES DÉCISIONS STRATÉGIQUES & BENCHMARKS MONDIAUX")
    rh2.font.name = "Arial"
    rh2.font.size = Pt(14)
    rh2.font.bold = True
    rh2.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "BENCHMARKS MONDIAUX : 37SIGNALS, STRIPE PRESS, METALAB (TINY) & VERCEL",
        "Notre stratégie synthétise les modèles des entreprises technologiques les plus robustes au monde tout en intégrant les enseignements amers tirés des discussions entre pairs sur Hacker News, Indie Hackers et les cercles de fondateurs YC."
    )

    benchmarks = [
        ("Modèle 37signals (Basecamp / Jason Fried & DHH) :", " À l'origine, 37signals était une agence de design web d'élite. Face aux besoins de gestion de leurs propres clients, ils ont développé Basecamp en interne, financé par leurs prestations, avant de basculer vers un modèle 100% logiciel générant des centaines de millions de dollars sans levée de fonds dilutive. Lonside applique exactement cette trajectoire."),
        ("Modèle Stripe Press & Developer Authority :", " Stripe a compris très tôt que l'ingénierie seule ne suffit pas : il faut dominer le champ culturel et intellectuel des entrepreneurs. Avec Stripe Press et leur documentation légendaire, ils inspirent le respect des bâtisseurs. Lonside Studio joue ce rôle d'aimant à talents et de caution d'autorité."),
        ("Modèle MetaLab / Tiny (Andrew Wilkinson) :", " MetaLab a débuté comme studio d'ingénierie et design haut de gamme (ayant conçu les premières versions de Slack, Uber, Pitch), puis a réinvesti ses profits massifs pour créer et acquérir un portefeuille de logiciels SaaS pérennes. Lonside Software en est l'héritier."),
        ("Modèle Vercel / Next.js (Guillermo Rauch) :", " Guillermo Rauch a fondé des services et librairies open-source, créé une communauté d'admirateurs via du contenu technique intransigeant, pour en faire le leader mondial du cloud Edge. Lonside s'appuie sur la même rigueur technique pure.")
    ]
    for b_title, b_desc in benchmarks:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        rt = p.add_run(f"• {b_title}\n")
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = COLOR_BLACK
        rd = p.add_run(b_desc)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 3 : PHASE 1 (2027) — PÉRIMÈTRE DÉTAILLÉ DE CHAQUE SERVICE
    # ──────────────────────────────────────────────────────────────────────────
    h3 = doc.add_heading(level=1)
    rh3 = h3.add_run("3. PHASE 1 (2027) : PÉRIMÈTRE DÉTAILLÉ DE CHAQUE SERVICE, RÈGLES & RÉSULTATS")
    rh3.font.name = "Arial"
    rh3.font.size = Pt(14)
    rh3.font.bold = True
    rh3.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "CADRAGE OPÉRATIONNEL DE LA PHASE 1 (ANNÉE 2027) : LE SOCLE DE PRESTATIONS",
        "En 2027, la priorité absolue est de consolider l'offre de services, déployer des applications d'exception pour nos premiers clients, "
        "établir la réputation de vélocité Lonside et générer une trésorerie souveraine. "
        "Chaque formule répond à des règles strictes et délivre un résultat tangible scellé."
    )

    # Tableau comparatif exhaustif des services
    tbl_serv = doc.add_table(rows=1, cols=5)
    tbl_serv.alignment = WD_TABLE_ALIGNMENT.CENTER
    s_heads = ["Service", "Périmètre Fonctionnel Inclus", "Règles d'Exécution", "Livrables Remis", "Résultat Métier Client"]
    for idx, text in enumerate(s_heads):
        c = tbl_serv.cell(0, idx)
        set_cell_background(c, "09090B")
        set_cell_margins(c, top=80, bottom=80, left=70, right=70)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.font.bold = True
        r.font.size = Pt(8)
        r.font.color.rgb = RGBColor(255, 255, 255)

    services_data = [
        ("Sprint Launch\n(6 900 € · 14j)", 
         "• Cadrage CDC & schéma DB\n• Next.js App Router & Tailwind\n• Authentification sécurisée OAuth\n• Paiements Stripe actifs\n• Connexion APIs (Resend, etc.)", 
         "• 14 jours ouvrés garantis\n• Forfait ferme (0 dépassement)\n• 1 seul interlocuteur senior\n• Zéro junior, zéro sous-traitance\n• Tests automatisés obligatoires", 
         "• Dépôt GitHub cédé à 100%\n• App en production Vercel Edge\n• Compte Stripe live configuré\n• Walkthrough vidéo Loom (CTO)\n• Garantie corrective 30 jours", 
         "Capacité immédiate d'encaisser de vrais clients payants dès J14 sans dette technique."),
        ("Sprint Scale\n(13 900 € · 30j)", 
         "• Tout le contenu Sprint Launch\n• Portails multi-rôles (RBAC)\n• Moteur de calculs automatisés\n• Tâches d'arrière-plan (Workers)\n• Notifications temps réel", 
         "• 30 jours ouvrés garantis\n• Architecture distribuée résiliente\n• Couverture de tests > 80%\n• Démo jalon intermédiaire J15\n• Traçabilité audit trail complète", 
         "• Dépôt GitHub cédé à 100%\n• Base PostgreSQL normalisée\n• Schémas migrations versionnés\n• Documentation technique runbook\n• Garantie corrective 30 jours", 
         "Plateforme robuste prête à encaisser des milliers d'utilisateurs et convaincre des investisseurs."),
        ("Régie d'Immersion\n(Dès 5 500 €/m)", 
         "• Ingénieur senior dédié (1 à 3)\n• Intégration Slack client direct\n• Daily standups & rituels agiles\n• Expédition continue de features\n• Refactoring & optimisation infra", 
         "• Semaine d'essai de 5 jours\n• Zéro engagement contraignant\n• Ajustement libre du volume\n• Rétroaction hebdomadaire\n• Disponibilité temps réel", 
         "• Commits directs sur repo client\n• PRs documentées et revues\n• Rapports de vélocité mensuels\n• Transfert continu de savoir-faire", 
         "Accélération immédiate de la roadmap produit sans le coût ni le délai d'un recrutement interne.")
    ]

    for s_name, s_scope, s_rules, s_deliv, s_res in services_data:
        row = tbl_serv.add_row().cells
        for idx, text in enumerate([s_name, s_scope, s_rules, s_deliv, s_res]):
            c = row[idx]
            set_cell_margins(c, top=60, bottom=60, left=70, right=70)
            set_cell_border(c, bottom=dict(color="E4E4E7", sz="4"))
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(7.5)
            if idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_BLACK
            elif idx == 4:
                r.font.bold = True
                r.font.color.rgb = COLOR_DARK
            else:
                r.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 4 : PHASE 2 (2028) — LONSIDE STUDIO (MÉDIA & CONTENU DE POINTE)
    # ──────────────────────────────────────────────────────────────────────────
    h4 = doc.add_heading(level=1)
    rh4 = h4.add_run("4. PHASE 2 (2028) : LONSIDE STUDIO — GRILLE DES FORMATS & STRATÉGIE MÉDIA")
    rh4.font.name = "Arial"
    rh4.font.size = Pt(14)
    rh4.font.bold = True
    rh4.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "DÉPLOIEMENT MÉDIA EN 2028 : L'ATTENTION COMME ACTIF SOUVERAIN",
        "En 2028, fort des dizaines de projets expédiés en 2027 et de notre réseau de fondateurs satisfaits, "
        "Lonside active son studio média. L'objectif n'est pas d'amuser, mais de devenir la référence francophone incontournable "
        "sur la réalité brute de la conception de produits et de l'entrepreneuriat technologique."
    )

    if os.path.exists(img_media):
        doc.add_paragraph().paragraph_format.space_before = Pt(4)
        doc.add_picture(img_media, width=Inches(6.8))
        p_cap = doc.add_paragraph()
        p_cap.paragraph_format.space_before = Pt(4)
        p_cap.paragraph_format.space_after = Pt(12)
        r_c = p_cap.add_run("Figure 4.1 : Grille des Formats Éditoriaux Lonside Studio pour YouTube et Formats Dérivés.")
        r_c.font.size = Pt(8)
        r_c.font.italic = True
        r_c.font.color.rgb = COLOR_MUTED

    doc.add_heading(level=2).add_run("4.1 Anatomie Opérationnelle des 3 Formats").font.bold = True
    media_specs = [
        ("1. Lonside Conversations (40 à 60 minutes) :",
         "• Invités : Fondateurs de startups ayant franchi le cap des premiers millions d'ARR, CTOs confrontés à des migrations titanesques, designers de produits iconiques, chercheurs en IA.\n"
         "• Direction : Décor sobre et feutré, cadrage cinéma en plans fixes, micros Shure SM7B visibles, zéro coupure artificielle. On laisse le temps à la réflexion complexe.\n"
         "• Résultat : Crédibilité institutionnelle maximale et création de relations profondes avec les leaders de l'écosystème."),
        ("2. Inside the Build (15 à 25 minutes) :",
         "• Concept : Immersion sans filtre dans le code et les schémas. Le Lead Architect Lonside ou un invité ouvre son IDE, son architecture Cloud ou sa base de données.\n"
         "• Direction : Partage d'écran 4K épuré, annotations en direct, autopsie d'une décision technique (ex: 'Pourquoi nous avons quitté MongoDB pour PostgreSQL', 'Comment nous encaissons 50k transactions/sec').\n"
         "• Résultat : Preuve irréfutable de la supériorité technique de Lonside aux yeux des développeurs et CTOs."),
        ("3. The Turning Point (5 à 10 minutes) :",
         "• Concept : Récit condensé d'un pivot dramatique ou d'un moment de bascule (un licenciement transformé en boîte florissante, un bug critique ayant failli couler l'entreprise, un refus de rachat).\n"
         "• Direction : Rythme soutenu, montage cinématographique noir et blanc contrasté, déclinaison en extraits verticaux (Shorts, Reels, LinkedIn Clips).\n"
         "• Résultat : Forte viralité organique, captation d'audience froide et redirection vers les formats longs et l'atelier.")
    ]
    for m_t, m_d in media_specs:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        rt = p.add_run(f"{m_t}\n")
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = COLOR_BLACK
        rd = p.add_run(m_d)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 5 : PHASE 3 (2029+) — LONSIDE SOFTWARE (LE STUDIO D'ÉDITION SAAS)
    # ──────────────────────────────────────────────────────────────────────────
    h5 = doc.add_heading(level=1)
    rh5 = h5.add_run("5. PHASE 3 (2029+) : LONSIDE SOFTWARE — ÉDITION DE PRODUITS SAAS & ACTIFS PÉRENNES")
    rh5.font.name = "Arial"
    rh5.font.size = Pt(14)
    rh5.font.bold = True
    rh5.font.color.rgb = COLOR_BLACK

    add_callout(
        doc,
        "LA CAPITALISATION LOGICIELLE DÈS 2029 : « A PRODUCT BY LONSIDE »",
        "En 2029, Lonside active sa pleine maturité : transformer les opportunités et douleurs récurrentes du marché "
        "en logiciels SaaS indépendants et hautement valorisables. Lonside devient une Holding de Logiciels Modernes."
    )

    saas_principles = [
        ("La Règle des 'Trois Fois' :", " Aucun produit n'est créé sur une intuition. Une idée de SaaS n'est validée en interne que si elle résout un problème que nous avons dû coder manuellement pour au moins trois clients de services différents."),
        ("Autonomie de Marque & Sceau de Qualité :", " Chaque logiciel possède son identité, son domaine et sa proposition de valeur propre (ex: Welqo, FlowScribe, PulseOps), tout en arborant le label institutionnel 'A Product by Lonside' qui rassure sur la pérennité et la sécurité."),
        ("Acquisition à Coût Zéro (CAC = 0 €) :", " Le produit est dévoilé dans un épisode dédié d'Inside the Build sur Lonside Studio. L'audience de développeurs et fondateurs accumulée en 2028 devient le vivier immédiat des premiers utilisateurs et abonnés payants."),
        ("Architecture Haute Densité (Boring Tech) :", " Des bases solides (Next.js, TypeScript, PostgreSQL, Edge) permettant à un seul ingénieur senior de superviser l'infrastructure de plusieurs SaaS sans maintenance complexe.")
    ]
    for s_t, s_d in saas_principles:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        rt = p.add_run(f"• {s_t}")
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = COLOR_BLACK
        rd = p.add_run(s_d)
        rd.font.size = Pt(9.5)
        rd.font.color.rgb = COLOR_BODY

    doc.add_page_break()

    # ──────────────────────────────────────────────────────────────────────────
    # SECTION 6 : ROADMAP CHRONOLOGIQUE CONCISE & ALLOCATION DU TEMPS
    # ──────────────────────────────────────────────────────────────────────────
    h6 = doc.add_heading(level=1)
    rh6 = h6.add_run("6. ROADMAP STRATÉGIQUE (2027 — 2029+) & DISCIPLINE D'ALLOCATION DU TEMPS")
    rh6.font.name = "Arial"
    rh6.font.size = Pt(14)
    rh6.font.bold = True
    rh6.font.color.rgb = COLOR_BLACK

    # Insertion de l'illustration Schéma de la Roadmap
    if os.path.exists(img_road):
        doc.add_paragraph().paragraph_format.space_before = Pt(4)
        doc.add_picture(img_road, width=Inches(6.8))
        p_cap = doc.add_paragraph()
        p_cap.paragraph_format.space_before = Pt(4)
        p_cap.paragraph_format.space_after = Pt(12)
        r_c = p_cap.add_run("Figure 6.1 : Chronologie d'Exécution en 3 Phases Majeures (2027 — 2029+).")
        r_c.font.size = Pt(8)
        r_c.font.italic = True
        r_c.font.color.rgb = COLOR_MUTED

    tbl_chrono = doc.add_table(rows=1, cols=4)
    tbl_chrono.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_heads = ["Année / Phase", "Focus Opérationnel", "Jalons Clés & Actions Concrètes", "Objectif Financier / KPI"]
    for idx, text in enumerate(c_heads):
        c = tbl_chrono.cell(0, idx)
        set_cell_background(c, "09090B")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(text)
        r.font.bold = True
        r.font.size = Pt(8)
        r.font.color.rgb = RGBColor(255, 255, 255)

    chrono_rows = [
        ("2027\n(Phase 1 : Maintenant)", 
         "Consolider les Services &\nTrésorerie d'Autofinancement", 
         "• Déploiement des Sprints Launch (14j) & Scale (30j)\n• Constitution d'un carnet de 15 à 25 clients solides\n• Standardisation complète des composants d'atelier\n• Trésorerie de réserve sanctuarisée : 100k€", 
         "35k€ — 60k€ / mois de CA\nMarge nette > 70%\n0€ de dette, 0 dilution"),
        ("2028\n(Phase 2 : Ensuite)", 
         "Déployer le Média\nLonside Studio", 
         "• Lancement de la chaîne YouTube & formats podcasts\n• Production de 24 épisodes Conversations & Inside the Build\n• Réseau d'ambassadeurs fondateurs & CTOs activé\n• Portée organique multicanale (LinkedIn, X, YouTube)", 
         "25 000 abonnés qualifiés\nInbound régulier sur les services\nPremiers sponsors institutionnels"),
        ("2029+\n(Phase 3 : Progressivement)", 
         "Éditer des Produits SaaS\nLonside Software", 
         "• Incubation et lancement de 2 SaaS propriétaires B2B\n• Signature ombrelle « A Product by Lonside »\n• Acquisition à 0 € CAC via les épisodes Inside the Build\n• Transition progressive du CA Services vers l'ARR Logiciel", 
         "ARR Logiciel > 250k€\nRevenus récurrents prédictibles\nValorisation d'actifs pérennes")
    ]

    for p_y, p_f, p_j, p_k in chrono_rows:
        row = tbl_chrono.add_row().cells
        for idx, text in enumerate([p_y, p_f, p_j, p_k]):
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

    doc.add_heading(level=2).add_run("6.1 La Règle d'Allocation Évolutive du Temps d'Équipe").font.bold = True
    p = doc.add_paragraph()
    p.add_run(
        "Pour garantir l'exécution sans dispersion :\n"
        "• En 2027 (Phase 1) : 80% Prestations Services / 15% Préparation Média / 5% R&D Produit.\n"
        "• En 2028 (Phase 2) : 60% Prestations Services / 25% Lonside Studio / 15% Prototypage SaaS.\n"
        "• En 2029+ (Phase 3) : 35% Prestations Services / 25% Lonside Studio / 40% Édition & Scaling SaaS Lonside Software."
    ).font.size = Pt(9.5)

    p_close = doc.add_paragraph()
    p_close.paragraph_format.space_before = Pt(28)
    rc1 = p_close.add_run("LONSIDE  //  TECHNOLOGY · PEOPLE · IDEAS\n")
    rc1.font.name = "Arial"
    rc1.font.bold = True
    rc1.font.size = Pt(9.5)
    rc1.font.color.rgb = COLOR_BLACK
    rc2 = p_close.add_run("Document de gouvernance stratégique générale — Validé par la Direction pour exécution — Version 3.0 (Avril 2026)")
    rc2.font.name = "Arial"
    rc2.font.size = Pt(8.5)
    rc2.font.color.rgb = COLOR_MUTED

    doc.save(output_path)
    print(f"Document Master Plan Stratégique DOCX (avec illustrations) généré avec succès : {output_path}")

if __name__ == "__main__":
    docs_dir = os.path.dirname(__file__)
    img_b = os.path.join(docs_dir, "diagram_brand_architecture.png")
    img_r = os.path.join(docs_dir, "diagram_roadmap_timeline.png")
    img_m = os.path.join(docs_dir, "diagram_media_formats.png")

    out_docs = os.path.join(docs_dir, "LONSIDE_MASTER_PLAN_STRATEGIQUE_ET_ROADMAP.docx")
    out_public = os.path.join(os.path.dirname(docs_dir), "public", "LONSIDE_MASTER_PLAN_STRATEGIQUE_ET_ROADMAP.docx")

    build_lonside_master_strategy_docx(out_docs, img_b, img_r, img_m)
    build_lonside_master_strategy_docx(out_public, img_b, img_r, img_m)
